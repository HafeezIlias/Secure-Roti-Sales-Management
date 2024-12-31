<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "sales_management";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Fetch Filters (if applied)
$startDate = $_GET['start_date'] ?? null;
$endDate = $_GET['end_date'] ?? null;
$category = $_GET['category'] ?? null;

// Base Query
$sql = "SELECT id, product, category, amount, date FROM sales_transactions WHERE 1=1";

// Apply Filters if Provided
$params = [];
$types = '';

if ($startDate) {
    $sql .= " AND date >= ?";
    $params[] = $startDate;
    $types .= 's';
}

if ($endDate) {
    $sql .= " AND date <= ?";
    $params[] = $endDate;
    $types .= 's';
}

if ($category) {
    $sql .= " AND category = ?";
    $params[] = $category;
    $types .= 's';
}

// Prepare and Execute Query
$stmt = $conn->prepare($sql);
if ($types) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();

$result = $stmt->get_result();

// Fetch Sales Data
$sales_transactions = [];
while ($row = $result->fetch_assoc()) {
    $sales_transactions[] = $row;
}

// Calculate Metrics
$total_sales = array_sum(array_column($sales_transactions, 'amount'));
$total_transactions = count($sales_transactions);
$top_product = null;

// Identify Top Product
$productSales = [];
foreach ($sales_transactions as $sale) {
    $productSales[$sale['product']] = ($productSales[$sale['product']] ?? 0) + $sale['amount'];
}

if (!empty($productSales)) {
    arsort($productSales);
    $top_product = array_key_first($productSales);
}

// Sales Trends (Example: Group by Date)
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

// Send JSON Response
echo json_encode($response);

// Clean Up
$stmt->close();
$conn->close();
?>
