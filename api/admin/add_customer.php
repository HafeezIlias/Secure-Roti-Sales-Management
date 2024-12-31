<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Read JSON Input
$data = json_decode(file_get_contents('php://input'), true);

// Validate Input
$username = htmlspecialchars($data['username'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$name = htmlspecialchars($data['name'] ?? '');
$contact = htmlspecialchars($data['contact'] ?? '');
$address = htmlspecialchars($data['address'] ?? '');
$postcode = htmlspecialchars($data['postcode'] ?? '');
$country = htmlspecialchars($data['country'] ?? '');
$city = htmlspecialchars($data['city'] ?? '');

if (!$username || !$email || !$name || !$contact || !$address || !$postcode || !$country || !$city) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required and email must be valid']);
    exit();
}

// Insert Customer
$stmt = $conn->prepare("INSERT INTO customers (username, email, name, contact, address, postcode, country, city) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssss", $username, $email, $name, $contact, $address, $postcode, $country, $city);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Customer added successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add customer']);
}

// Close Connection
$stmt->close();
$conn->close();
?>
