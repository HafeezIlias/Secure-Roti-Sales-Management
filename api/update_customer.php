<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

// Parse PUT Data
parse_str(file_get_contents("php://input"), $data);

$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$name = $data['name'] ?? null;
$contact = $data['contact'] ?? null;
$address = $data['address'] ?? null;

// Validate Input
if (!$id || !$name || !$contact || !$address) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid input data']);
    exit();
}

// Update Customer
$stmt = $conn->prepare("UPDATE customers SET name = ?, contact = ?, address = ? WHERE id = ?");
$stmt->bind_param('sssi', $name, $contact, $address, $id);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Customer updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update customer']);
}

// Clean up
$stmt->close();
$conn->close();
exit();
?>
