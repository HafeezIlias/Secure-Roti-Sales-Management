<?php
// Enable JSON-safe output
ob_start();
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Error settings
ini_set('display_errors', 0); // Do not display errors
ini_set('log_errors', 1); // Log errors
error_reporting(E_ALL);

// Handle OPTIONS Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "sales_management";

try {
    $conn = new mysqli($host, $user, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Fetch Filters (if applied)
    $startDate = $_GET['start_date'] ?? null;
    $endDate = $_GET['end_date'] ?? null;

    // Base Query with JOINs
    $sql = "SELECT 
                st.transaction_id AS id, 
                p.name AS product_name, 
                st.customer_id, 
                st.amount, 
                st.date, 
                pm.payment_method
            FROM sales_transactions st
            LEFT JOIN products p ON st.product_id = p.product_id
            LEFT JOIN payments pm ON st.transaction_id = pm.id
            WHERE 1=1";

    // Apply Date Filters if Provided
    $params = [];
    $types = '';

    if ($startDate) {
        $sql .= " AND st.date >= ?";
        $params[] = $startDate;
        $types .= 's';
    }

    if ($endDate) {
        $sql .= " AND st.date <= ?";
        $params[] = $endDate;
        $types .= 's';
    }

    // Prepare and Execute Query
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('SQL Preparation Failed: ' . $conn->error);
    }

    if ($types) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();

    $result = $stmt->get_result();

    // Fetch Sales Data
    $sales_transactions = [];
    while ($row = $result->fetch_assoc()) {
        $sales_transactions[] = [
            'id' => $row['id'],
            'product_name' => $row['product_name'] ?? 'N/A',
            'customer_id' => $row['customer_id'] ?? 'N/A',
            'amount' => floatval($row['amount']),
            'date' => $row['date'],
            'payment_method' => $row['payment_method'] ?? 'N/A'
        ];
    }

    // Calculate Metrics
    $total_sales = number_format(array_sum(array_column($sales_transactions, 'amount')), 2, '.', '');
    $total_transactions = count($sales_transactions);
    $top_product = null;

    // Identify Top Product
    $productSales = [];
    foreach ($sales_transactions as $sale) {
        $productSales[$sale['product_name']] = ($productSales[$sale['product_name']] ?? 0) + $sale['amount'];
    }

    if (!empty($productSales)) {
        arsort($productSales);
        $top_product = array_key_first($productSales);
    }

    // Sales Trends (Group by Date)
    $sales_trend = [];
    foreach ($sales_transactions as $sale) {
        $date = $sale['date'];
        if (!isset($sales_trend[$date])) {
            $sales_trend[$date] = 0;
        }
        $sales_trend[$date] += $sale['amount'];
    }

    // Format Sales Trend for Frontend Chart.js
    $sales_trend_labels = array_keys($sales_trend);
    $sales_trend_values = array_values($sales_trend);

    // Response
    $response = [
        'total_sales' => $total_sales,
        'total_transactions' => $total_transactions,
        'top_product' => $top_product,
        'sales_trend' => [
            'labels' => $sales_trend_labels,
            'values' => $sales_trend_values,
        ],
        'sales_transactions' => $sales_transactions
    ];

    // Clear Output Buffer and Send JSON
    ob_end_clean();
    echo json_encode($response);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
