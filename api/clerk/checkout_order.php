<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'sales_management';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Retrieve input data
$input = file_get_contents('php://input');
error_log("Raw Input: " . $input);

// Check if input is empty
if (empty($input)) {
    echo json_encode(['error' => 'No JSON payload received.']);
    exit;
}

// Validate JSON format
$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON Decode Error: " . json_last_error_msg());
    echo json_encode(['error' => 'Invalid JSON format: ' . json_last_error_msg()]);
    exit;
}

// Validate the decoded data
if (!$data || !is_array($data)) {
    echo json_encode(['error' => 'Invalid data. Please send valid JSON.']);
    exit;
}

// Validate data structure
foreach ($data as $id => $item) {
    if (
        !isset($item['price']) || 
        !isset($item['quantity']) || 
        !is_numeric($item['price']) || 
        !is_numeric($item['quantity'])
    ) {
        echo json_encode(['error' => "Invalid item structure for product ID: $id"]);
        exit;
    }
}

// Calculate order total
$orderTotal = 0;
foreach ($data as $id => $item) {
    $orderTotal += $item['price'] * $item['quantity'];
}

// Insert order
$orderStmt = $conn->prepare("INSERT INTO orders (order_date, total_amount) VALUES (NOW(), ?)");
$orderStmt->bind_param('d', $orderTotal);
if (!$orderStmt->execute()) {
    echo json_encode(['error' => 'Failed to insert order: ' . $orderStmt->error]);
    exit;
}
$orderId = $orderStmt->insert_id;
$orderStmt->close();

// Insert order items
$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
foreach ($data as $id => $item) {
    $productId = intval($id); // Ensure product ID is integer
    $quantity = intval($item['quantity']);
    $price = floatval($item['price']);
    $itemStmt->bind_param('iiid', $orderId, $productId, $quantity, $price);

    if (!$itemStmt->execute()) {
        echo json_encode(['error' => "Failed to insert order item for product ID $id: " . $itemStmt->error]);
        exit;
    }
}
$itemStmt->close();

echo json_encode([
    'message' => 'Order placed successfully',
    'order_id' => $orderId,
    'total_amount' => $orderTotal
]);

$conn->close();
?>
