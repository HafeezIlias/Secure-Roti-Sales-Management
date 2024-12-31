<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../db_config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id']);
    $quantity = intval($input['quantity']);
    $type = htmlspecialchars($input['type']);

    if (!$id || !$quantity || !$type) {
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
        exit;
    }

    if ($type === 'low-stock' || $type === 'out-of-stock') {
        $stmt = $pdo->prepare("UPDATE inventory SET stock = stock + :quantity WHERE id = :id");
        $stmt->execute([
            ':quantity' => $quantity,
            ':id' => $id
        ]);

        echo json_encode(['success' => true, 'message' => 'Item restocked successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid type']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    error_log($e->getMessage());
}
?>
