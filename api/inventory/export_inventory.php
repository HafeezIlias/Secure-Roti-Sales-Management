<?php
// Prevent any accidental output before headers
ob_start();

// Set HTTP Headers for CSV Download
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="inventory_export.csv"');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

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

    // Fetch Inventory Data
    $stmt = $pdo->query("SELECT id, item_name, stock, reorder_point FROM inventory");

    // Open output stream
    $output = fopen('php://output', 'w');

    // Add CSV Headers
    fputcsv($output, ['ID', 'Item Name', 'Stock', 'Reorder Point']);

    // Add Data Rows
    while ($row = $stmt->fetch()) {
        fputcsv($output, $row);
    }

    // Close Output Stream
    fclose($output);

    // Clear output buffer
    ob_end_flush();

    exit;
} catch (PDOException $e) {
    // Handle Database Errors
    header('HTTP/1.1 500 Internal Server Error');
    echo "Error: " . $e->getMessage();
    exit;
}
?>
