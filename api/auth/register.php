<?php
// Headers for CORS and JSON Response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle Preflight Requests (OPTIONS)
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
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Only Allow POST Requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method.']);
    exit();
}

// Parse JSON Data
$data = json_decode(file_get_contents('php://input'), true);

// Validate Input Fields
$username = htmlspecialchars(trim($data['username'] ?? ''));
$name = htmlspecialchars(trim($data['fullname'] ?? '')); // Map to 'name' in DB
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = trim($data['password'] ?? '');
$contact = htmlspecialchars(trim($data['contact'] ?? ''));
$address = htmlspecialchars(trim($data['address'] ?? ''));
$postcode = htmlspecialchars(trim($data['postcode'] ?? ''));
$country = htmlspecialchars(trim($data['country'] ?? ''));
$city = htmlspecialchars(trim($data['city'] ?? ''));

// Check Required Fields
if (!$username || !$name || !$email || !$password || !$contact || !$address || !$postcode || !$country || !$city) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit();
}

// Validate Contact Number
if (!preg_match('/^(\+60\d{9,10}|0\d{9,10})$/', $contact)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid contact number format.']);
    exit();
}

// Password Hashing
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert User into Database
try {
    $stmt = $pdo->prepare('
        INSERT INTO customers (username, name, email, password, contact, address, postcode, country, city) 
        VALUES (:username, :name, :email, :password, :contact, :address, :postcode, :country, :city)
    ');
    $stmt->execute([
        ':username' => $username,
        ':name' => $name,
        ':email' => $email,
        ':password' => $hashedPassword,
        ':contact' => $contact,
        ':address' => $address,
        ':postcode' => $postcode,
        ':country' => $country,
        ':city' => $city,
    ]);

    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to register user.']);
}
?>
