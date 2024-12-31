<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
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

// Validate and sanitize inputs
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$status = isset($_GET['status']) ? trim(htmlspecialchars($_GET['status'])) : null;

$allowedStatuses = ['pending', 'fulfilled', 'cancelled'];
if (!$id || !$status || !in_array($status, $allowedStatuses)) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid input data']);
    exit();
}

// Update order status
$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param('si', $status, $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['message' => 'Order status updated successfully']);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Failed to update status or no changes detected']);
}

// Clean up
$stmt->close();
$conn->close();
exit();
?>
