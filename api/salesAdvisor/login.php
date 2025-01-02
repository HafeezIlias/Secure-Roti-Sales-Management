<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database Configuration
$host = 'localhost';
$dbname = 'sales_management';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Read and sanitize input data
    $data = json_decode(file_get_contents("php://input"), true);
    $username = htmlspecialchars(trim($data['username'] ?? ''));
    $passwordInput = trim($data['password'] ?? '');

    // Input Validation
    if (!$username || !$passwordInput) {
        echo json_encode(['success' => false, 'error' => 'Username and password are required']);
        exit;
    }

    // Hash the input password using SHA1
    $hashedPassword = sha1($passwordInput);

    // Fetch user by username and check hashed password
    $stmt = $pdo->prepare("SELECT * FROM users WHERE name = :username AND password_hash = :password LIMIT 1");
    $stmt->execute([
        ':username' => $username,
        ':password' => $hashedPassword
    ]);
    $user = $stmt->fetch();

    // Verify User and Role
    if ($user) {
        echo json_encode([
            'success' => true,
            'role' => $user['role'],
            'message' => 'Login successful'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'error' => 'An error occurred. Please try again later.']);
    error_log($e->getMessage());
}
?>
