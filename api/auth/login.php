<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = htmlspecialchars($data['username'] ?? '');
    $passwordInput = htmlspecialchars($data['password'] ?? '');

    if (empty($username) || empty($passwordInput)) {
        echo json_encode(['error' => 'Username and password are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user && password_verify($passwordInput, $user['password'])) {
            echo json_encode(['success' => true, 'message' => 'Login successful!']);
        } else {
            echo json_encode(['error' => 'Invalid username or password.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'An error occurred during login.']);
    }
}
?>
