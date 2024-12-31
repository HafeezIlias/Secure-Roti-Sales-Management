<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
require_once '../db_config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    /** Fetch Total Products */
    $stmt = $pdo->query("SELECT COUNT(*) AS totalProducts FROM products");
    $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC)['totalProducts'] ?? 0;

    /** Fetch Total Ingredients */
    $stmt = $pdo->query("SELECT COUNT(*) AS totalIngredients FROM ingredients");
    $totalIngredients = $stmt->fetch(PDO::FETCH_ASSOC)['totalIngredients'] ?? 0;


    /** Fetch Product List with Stock */
    $stmt = $pdo->query("
        SELECT p.product_id, p.name, p.description, p.price, i.stock, i.reorder_point 
        FROM products p
        LEFT JOIN inventory i ON p.name = i.item_name
    ");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /** Fetch Ingredient List */
    $stmt = $pdo->query("
        SELECT id, name, quantity, unit, supplier 
        FROM ingredients
    ");
    $ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /** Fetch Low Stock Items */
    $stmt = $pdo->query("
        SELECT 
            i.id,
            i.item_name,
            i.stock,
            i.reorder_point
        FROM inventory i
        WHERE i.stock <= i.reorder_point AND i.stock > 0
    ");
    $lowStockItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    

    /** Fetch Out of Stock Items */
    $stmt = $pdo->query("
        SELECT 
            i.id,
            i.item_name,
            i.stock,
            i.reorder_point
        FROM inventory i
        WHERE i.stock = 0
    ");
    $outOfStockItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return JSON Response
    echo json_encode([
        'success' => true,
        'totalProducts' => $totalProducts,
        'totalIngredients' => $totalIngredients,
        'products' => $products,
        'ingredients' => $ingredients,
        'lowStockCount' => count($lowStockItems),
        'outOfStockCount' => count($outOfStockItems),
        'lowStockItems' => $lowStockItems,
        'outOfStockItems' => $outOfStockItems
    ]);

} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    error_log($e->getMessage());
}
?>
