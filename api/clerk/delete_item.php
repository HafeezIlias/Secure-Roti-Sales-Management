<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
require_once '../db_config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = intval($_GET['id']);
    $type = htmlspecialchars($_GET['type']);

    if ($type === 'product') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
    } elseif ($type === 'ingredient') {
        $stmt = $pdo->prepare("DELETE FROM ingredients WHERE id = :id");
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid type']);
        exit;
    }

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => ucfirst($type) . ' deleted successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
