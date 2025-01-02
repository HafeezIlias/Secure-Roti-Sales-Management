<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'roti_management';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    die(json_encode(['error' => 'Invalid data']));
}

$orderTotal = 0;
foreach ($data as $item) {
    $orderTotal += $item['price'] * $item['quantity'];
}

$conn->query("INSERT INTO orders (order_date, total_amount) VALUES (NOW(), $orderTotal)");
$orderId = $conn->insert_id;

foreach ($data as $id => $item) {
    $conn->query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($orderId, $id, {$item['quantity']}, {$item['price']})");
}

echo json_encode(['message' => 'Order placed successfully']);
$conn->close();
?>
