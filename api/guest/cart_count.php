<?php
// Enable CORS and JSON response
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

// Fetch Cart Count
try {
    $stmt = $pdo->query("SELECT SUM(quantity) AS count FROM cart");
    $result = $stmt->fetch();

    $count = $result['count'] ?? 0; // Default to 0 if null

    echo json_encode(['count' => (int)$count]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch cart count']);
    exit;
}
?>
