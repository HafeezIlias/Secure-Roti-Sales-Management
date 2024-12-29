<?php
// Enable Error Reporting (For Development Only - Disable in Production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); // Replace with your frontend origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

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

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Fetch Orders
try {
    $stmt = $conn->prepare("SELECT id, customer_id, order_date, status, total_amount FROM orders");
    if (!$stmt) {
        throw new Exception('Failed to prepare database query');
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'id' => intval($row['id']),
            'customer_id' => intval($row['customer_id']),
            'order_date' => $row['order_date'],
            'status' => htmlspecialchars($row['status']),
            'total_amount' => floatval($row['total_amount'])
        ];
    }

     // Fetch counts
     $counts = [];
     $statuses = ['pending', 'fulfilled', 'cancelled'];
     foreach ($statuses as $status) {
         $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM orders WHERE status = ?");
         $stmt->bind_param('s', $status);
         $stmt->execute();
         $result = $stmt->get_result();
         $counts[$status] = $result->fetch_assoc()['count'];
     }

    echo json_encode($orders);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch orders',
        'details' => $e->getMessage()
    ]);
} finally {
    $stmt->close();
    $conn->close();
}

// Ensure no additional output
exit();
?>
