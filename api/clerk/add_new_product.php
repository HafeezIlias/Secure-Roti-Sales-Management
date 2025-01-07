<?php
// Set Response Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
$host = "localhost";
$user = "root";
$password = "";
$dbname = "sales_management";

// Establish Database Connection
$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Validate Request Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit();
}

// Retrieve and Validate Input Data
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$stock = $_POST['stock'] ?? '';
$reorder_point = $_POST['reorder'] ?? '';
$image = $_FILES['image'] ?? null;

// Validation
if (empty($name) || empty($description) || empty($price) || empty($stock) || empty($reorder_point)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields (name, description, price, stock, reorder point) are required.']);
    exit();
}

// Validate Price, Stock, and Reorder Point
if (!is_numeric($price) || $price <= 0 || !is_numeric($stock) || $stock < 0 || !is_numeric($reorder_point) || $reorder_point < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid format for price, stock, or reorder point.']);
    exit();
}

// Handle Image Upload
$imagePath = null;
if ($image && $image['error'] === UPLOAD_ERR_OK) {
    // Define the upload directory (absolute path)
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/assets/products/';
    
    // Ensure the directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Validate Image Extension
    $imageExtension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'png'];

    if (!in_array($imageExtension, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image format. Allowed formats: jpg, png']);
        exit();
    }

    // Validate Image Size (Max: 1MB)
    if ($image['size'] > 1 * 1024 * 1024) { // 1MB limit
        http_response_code(400);
        echo json_encode(['error' => 'Image size exceeds 1MB.']);
        exit();
    }

    // Sanitize Product Name for Filename
    $sanitizedProductName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $name);
    $imageFileName = $sanitizedProductName . '_' . time() . '.' . $imageExtension; // Add timestamp for uniqueness

    // Absolute path for moving the uploaded file
    $absoluteImagePath = $uploadDir . $imageFileName;

    if (!move_uploaded_file($image['tmp_name'], $absoluteImagePath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image.']);
        exit();
    }

    // Save relative path for the database
    $imagePath = 'assets/product/' . $imageFileName;
}


// Start Transaction for Atomic Operations
$conn->begin_transaction();

try {
    // Insert into products table
    $stmtProduct = $conn->prepare("INSERT INTO products (name, description, price, image_path) VALUES (?, ?, ?, ?)");
    $stmtProduct->bind_param("ssds", $name, $description, $price, $imagePath);

    if (!$stmtProduct->execute()) {
        throw new Exception('Failed to add product to products table.');
    }

    // Get the last inserted product_id
    $productId = $stmtProduct->insert_id;

    // Insert into inventory table
    $stmtInventory = $conn->prepare("INSERT INTO inventory (product_id, item_name, stock, reorder_point) VALUES (?, ?, ?, ?)");
    $stmtInventory->bind_param("isii", $productId, $name, $stock, $reorder_point);

    if (!$stmtInventory->execute()) {
        throw new Exception('Failed to add inventory record.');
    }

    // Commit Transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Product and inventory added successfully']);
} catch (Exception $e) {
    // Rollback Transaction on Error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// Close Database Connections
$stmtProduct->close();
$stmtInventory->close();
$conn->close();
?>
