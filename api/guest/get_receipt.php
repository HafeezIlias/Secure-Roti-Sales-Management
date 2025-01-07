<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'sales_management';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Validate order ID from GET parameter
$orderId = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;

if ($orderId <= 0) {
    echo json_encode(['error' => 'Invalid order ID']);
    exit;
}

// Fetch order details
$orderStmt = $conn->prepare("SELECT order_date, total_amount FROM orders WHERE id = ?");
$orderStmt->bind_param('i', $orderId);
$orderStmt->execute();
$orderResult = $orderStmt->get_result();

if ($orderResult->num_rows === 0) {
    echo json_encode(['error' => 'Order not found']);
    exit;
}

$order = $orderResult->fetch_assoc();
$orderStmt->close();

// Fetch order items
$itemStmt = $conn->prepare("
    SELECT oi.product_id, oi.quantity, oi.price, p.name AS product_name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
");
$itemStmt->bind_param('i', $orderId);
$itemStmt->execute();
$itemsResult = $itemStmt->get_result();

$items = [];
while ($row = $itemsResult->fetch_assoc()) {
    $items[] = $row;
}
$itemStmt->close();

// Return receipt data
echo json_encode([
    'order_id' => $orderId,
    'order_date' => $order['order_date'],
    'total_amount' => $order['total_amount'],
    'items' => $items
]);

$conn->close();
?>
