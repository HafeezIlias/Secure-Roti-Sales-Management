<?php
// Enable CORS and set JSON response type
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

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
    exit;
}

// Fetch Cart Items with Product Image
try {
    $stmt = $pdo->query("
        SELECT 
            c.cart_id,
            c.product_id,
            c.product_name,
            c.quantity,
            c.price,
            c.total,
            p.image_path
        FROM 
            cart c
        LEFT JOIN 
            products p ON c.product_id = p.product_id
    ");
    $cartItems = $stmt->fetchAll();

    echo json_encode($cartItems);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch cart items']);
    exit;
}
?>
