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

// Validate ID
$id = intval($_GET['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid customer ID']);
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

// Update Customer
$stmt = $conn->prepare("UPDATE customers SET username=?, email=?, name=?, contact=?, address=?, postcode=?, country=?, city=? WHERE id=?");
$stmt->bind_param("ssssssssi", $username, $email, $name, $contact, $address, $postcode, $country, $city, $id);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Customer updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update customer']);
}

// Close Connection
$stmt->close();
$conn->close();
?>
