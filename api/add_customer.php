<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

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

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? null;
$contact = $data['contact'] ?? null;
$address = $data['address'] ?? null;

if (!$name || !$contact || !$address) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO customers (name, contact, address) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $name, $contact, $address);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Customer added successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add customer']);
}

$stmt->close();
$conn->close();
?>
