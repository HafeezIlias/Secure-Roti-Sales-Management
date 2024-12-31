<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
require_once '../db_config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Parse Input Data
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit;
    }

    // Validate Type
    $type = isset($input['type']) ? htmlspecialchars($input['type']) : null;

    if (!$type || !in_array($type, ['product', 'ingredient'])) {
        echo json_encode(['success' => false, 'error' => 'Valid type (product or ingredient) is required']);
        exit;
    }

    // Handle Product Addition
    if ($type === 'product') {
        $name = htmlspecialchars($input['name'] ?? '');
        $description = htmlspecialchars($input['description'] ?? '');
        $price = floatval($input['price'] ?? 0);
        $category = htmlspecialchars($input['category'] ?? '');
        $stock = intval($input['stock'] ?? 0);
        $reorder_point = intval($input['reorder_point'] ?? 0);

        if (!$name || !$price || !$category) {
            echo json_encode(['success' => false, 'error' => 'Product name, price, and category are required']);
            exit;
        }

        // Insert into Products table
        $stmt = $pdo->prepare("
            INSERT INTO products (name, description, price, category) 
            VALUES (:name, :description, :price, :category)
        ");
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':price' => $price,
            ':category' => $category
        ]);

        // Insert into Inventory table
        $stmt = $pdo->prepare("
            INSERT INTO inventory (item_name, stock, reorder_point) 
            VALUES (:item_name, :stock, :reorder_point)
        ");
        $stmt->execute([
            ':item_name' => $name,
            ':stock' => $stock,
            ':reorder_point' => $reorder_point
        ]);

        echo json_encode(['success' => true, 'message' => 'Product added successfully']);
        exit;
    }

    // Handle Ingredient Addition
    if ($type === 'ingredient') {
        $name = htmlspecialchars($input['name'] ?? '');
        $quantity = intval($input['quantity'] ?? 0);
        $unit = htmlspecialchars($input['unit'] ?? '');
        $supplier = htmlspecialchars($input['supplier'] ?? '');

        if (!$name || !$quantity || !$unit || !$supplier) {
            echo json_encode(['success' => false, 'error' => 'Ingredient name, quantity, unit, and supplier are required']);
            exit;
        }

        // Insert into Ingredients table
        $stmt = $pdo->prepare("
            INSERT INTO ingredients (name, quantity, unit, supplier) 
            VALUES (:name, :quantity, :unit, :supplier)
        ");
        $stmt->execute([
            ':name' => $name,
            ':quantity' => $quantity,
            ':unit' => $unit,
            ':supplier' => $supplier
        ]);

        echo json_encode(['success' => true, 'message' => 'Ingredient added successfully']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    error_log($e->getMessage());
    exit;
}
?>
