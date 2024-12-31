<?php
// Enable CORS Headers
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle Preflight OPTIONS Request
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
    exit;
}

// Update Quantity
try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['cart_id']) || !isset($data['quantity'])) {
        echo json_encode(['error' => 'Invalid input']);
        http_response_code(400);
        exit;
    }

    $cart_id = intval($data['cart_id']);
    $quantity = intval($data['quantity']);

    if ($quantity <= 0) {
        // Remove item if quantity is zero or less
        $stmt = $pdo->prepare("DELETE FROM cart WHERE cart_id = ?");
        $stmt->execute([$cart_id]);
    } else {
        // Update quantity
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
        $stmt->execute([$quantity, $cart_id]);
    }

    echo json_encode(['success' => 'Cart updated successfully']);
    http_response_code(200);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to update cart']);
    http_response_code(500);
}
?>
