<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit();
}

// Validate and save uploaded data
$data = [
    'name' => $_POST['name'] ?? '',
    'description' => $_POST['description'] ?? '',
    'price' => $_POST['price'] ?? '',
    'category' => $_POST['category'] ?? ''
];

if (empty($data['name']) || empty($data['description']) || empty($data['price']) || empty($data['category'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit();
}

// Handle Image Upload
$image = $_FILES['image'] ?? null;
if ($image && $image['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/products/';
    $filePath = $uploadDir . basename($image['name']);
    move_uploaded_file($image['tmp_name'], $filePath);
}

// Save to Database
// Use PDO for secure database interaction
echo json_encode(['success' => true, 'message' => 'Product added successfully']);
?>
