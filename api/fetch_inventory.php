<?php
// Enable CORS Headers for Development Environment
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database Connection
$host = "localhost";
$user = "root";
$password = "";
$dbname = "sales_management";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database Connection Failed: ' . $conn->connect_error]));
}

// Handle Preflight (OPTIONS) Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Sanitize GET 'action'
$action = isset($_GET['action']) ? $_GET['action'] : null;

// 📚 **1. Read Inventory Items**
if ($action === 'read') {
    $result = $conn->query("SELECT * FROM inventory");
    if ($result) {
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    } else {
        echo json_encode(['error' => 'Failed to fetch inventory data']);
    }
    exit;
}

// 📦 **2. Create/Update Inventory Item**
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['name'], $data['stock'], $data['reorder'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $name = htmlspecialchars($data['name']);
    $stock = intval($data['stock']);
    $reorder = intval($data['reorder']);
    $id = isset($data['id']) ? intval($data['id']) : null;

    if ($id) {
        // Update existing item
        $stmt = $conn->prepare("UPDATE inventory SET item_name=?, stock=?, reorder_point=? WHERE id=?");
        $stmt->bind_param("siii", $name, $stock, $reorder, $id);
    } else {
        // Create new item
        $stmt = $conn->prepare("INSERT INTO inventory (item_name, stock, reorder_point) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $name, $stock, $reorder);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => $id ? 'Item updated successfully' : 'Item added successfully']);
    } else {
        echo json_encode(['error' => 'Failed to save item']);
    }

    $stmt->close();
    exit;
}

// 🗑️ **3. Delete Inventory Item**
if ($action === 'delete') {
    if (!isset($_GET['id'])) {
        echo json_encode(['error' => 'Item ID is required for deletion']);
        exit;
    }

    $id = intval($_GET['id']);
    $stmt = $conn->prepare("DELETE FROM inventory WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Item deleted successfully']);
    } else {
        echo json_encode(['error' => 'Failed to delete item']);
    }

    $stmt->close();
    exit;
}

// 🚫 **4. Invalid Action Handler**
echo json_encode(['error' => 'Invalid action specified']);
$conn->close();
?>
