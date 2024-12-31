<?php
// Enable CORS and set response type
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'sales_management';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    http_response_code(500);
    exit;
}

// Process Add to Cart
try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['product_id']) || !isset($data['quantity'])) {
        echo json_encode(['error' => 'Invalid input']);
        http_response_code(400); // Bad Request
        exit;
    }

    $product_id = intval($data['product_id']);
    $quantity = intval($data['quantity']);

    // Fetch product details
    $stmt = $pdo->prepare("SELECT name, price FROM products WHERE product_id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();

    if (!$product) {
        echo json_encode(['error' => 'Product not found']);
        http_response_code(404); // Not Found
        exit;
    }

    // Insert into cart
    $stmt = $pdo->prepare("INSERT INTO cart (product_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
    $stmt->execute([$product_id, $product['name'], $quantity, $product['price']]);

    echo json_encode(['success' => 'Product added to cart']);
    http_response_code(200); // OK
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to add product to cart: ' . $e->getMessage()]);
    http_response_code(500); // Server Error
}
?>
