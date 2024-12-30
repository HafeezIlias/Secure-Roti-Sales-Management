<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = htmlspecialchars($data['username'] ?? '');
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $passwordInput = htmlspecialchars($data['password'] ?? '');

    if (empty($username) || empty($email) || empty($passwordInput)) {
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username OR email = :email');
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Username or email already exists.']);
            exit;
        }

        $hashedPassword = password_hash($passwordInput, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registration successful!']);
        } else {
            echo json_encode(['error' => 'Failed to register user.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'An error occurred during registration.']);
    }
}
?>
