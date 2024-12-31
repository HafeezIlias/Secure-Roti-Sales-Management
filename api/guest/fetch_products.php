<?php
// =======================
// 🚀 CORS Headers
// =======================
header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); // Allow frontend origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Allow specific methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allowed headers
header('Content-Type: application/json'); // Response type

// Handle Preflight OPTIONS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =======================
// 🚀 Error Reporting (Environment Toggle)
// =======================
$env = 'development'; // Change to 'production' in live environment

if ($env === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// =======================
// 🚀 Database Connection
// =======================
$host = 'localhost';
$dbname = 'sales_management';
$user = 'root';
$password = ''; // Change if you've set a password in XAMPP

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Enable exception mode
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch as associative array
            PDO::ATTR_EMULATE_PREPARES => false // Prevent SQL Injection
        ]
    );
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    http_response_code(500); // Internal Server Error
    exit;
}

// =======================
// 🚀 Fetch Products Securely
// =======================
try {
    $stmt = $pdo->prepare("SELECT product_id, name, description, price, image_path FROM products");
    $stmt->execute();
    $products = $stmt->fetchAll();

    // Check if products exist
    if (!$products) {
        echo json_encode(['message' => 'No products available']);
        http_response_code(200); // OK response but no content
        exit;
    }

    echo json_encode($products);
    http_response_code(200); // OK
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch products']);
    http_response_code(500); // Internal Server Error
    exit;
}
?>
