<?php
// Enable error reporting (For Development Only)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS Headers
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle OPTIONS Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to Database
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'sales_management';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Parse JSON Input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload: ' . json_last_error_msg()]);
    exit();
}

// Validate Payment Method
$valid_payment_methods = ['cash', 'card', 'online'];
if (!isset($data['payment_method']) || !in_array($data['payment_method'], $valid_payment_methods)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payment method']);
    exit();
}

// Validate Customer ID
if (!isset($data['customer_id']) || !is_numeric($data['customer_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing customer ID']);
    exit();
}

// Validate Cart Items
if (!isset($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or empty cart items']);
    exit();
}

// Calculate Order Total
$orderTotal = 0;
foreach ($data['items'] as $item) {
    if (!isset($item['product_id'], $item['price'], $item['quantity']) ||
        !is_numeric($item['price']) || !is_numeric($item['quantity'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid item structure']);
        exit();
    }
    $orderTotal += floatval($item['price']) * intval($item['quantity']);
}

// Begin Transaction
$conn->begin_transaction();

try {
    // Step 1: Insert Order
    $orderStmt = $conn->prepare("INSERT INTO orders (customer_id, order_date, total_amount) VALUES (?, NOW(), ?)");
    $orderStmt->bind_param('id', $data['customer_id'], $orderTotal);
    $orderStmt->execute();
    $orderId = $orderStmt->insert_id;
    $orderStmt->close();

    // Step 2: Insert Order Items
    $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($data['items'] as $item) {
        $productId = intval($item['product_id']);
        $quantity = intval($item['quantity']);
        $price = floatval($item['price']);
        $itemStmt->bind_param('iiid', $orderId, $productId, $quantity, $price);
        $itemStmt->execute();
    }
    $itemStmt->close();

    // Step 3: Insert Payment
    $paymentStmt = $conn->prepare("INSERT INTO payments (order_id, payment_method, status) VALUES (?, ?, 'pending')");
    $paymentStmt->bind_param('is', $orderId, $data['payment_method']);
    $paymentStmt->execute();

    // Retrieve the Payment ID
    $paymentId = $paymentStmt->insert_id;
    $paymentStmt->close();

    // Step 4: Insert into Sales Transactions
    $salesStmt = $conn->prepare("INSERT INTO sales_transactions (transaction_id, customer_id, product_id, orders_id, amount, date) VALUES (?, ?, ?, ?, ?, NOW())");
    foreach ($data['items'] as $item) {
        $productId = intval($item['product_id']);
        $amount = floatval($item['price']) * intval($item['quantity']);
        $salesStmt->bind_param('iiiid', $paymentId, $data['customer_id'], $productId, $orderId, $amount);
        $salesStmt->execute();
    }
    $salesStmt->close();

    // Commit Transaction
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $orderId,
        'total_amount' => $orderTotal,
        'payment_method' => $data['payment_method']
    ]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// Close Connection
$conn->close();
?>
