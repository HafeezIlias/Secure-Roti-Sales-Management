<?php
// Enable Error Reporting for Development (Disable in Production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); // Restrict to frontend URL
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS Request (Preflight)
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

// Fetch Count of Low Inventory Items
try {
    $stmt = $conn->prepare("SELECT COUNT(*) AS low_stock_count FROM inventory WHERE stock <= reorder_point");
    if (!$stmt) {
        throw new Exception('Database query preparation failed.');
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $data = $result->fetch_assoc();
    $lowStockCount = intval($data['low_stock_count']);

    // Return the count of low inventory items
    echo json_encode(['low_stock_count' => $lowStockCount]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch low inventory count', 'details' => $e->getMessage()]);
}

// Close the Connection
$stmt->close();
$conn->close();
?>
