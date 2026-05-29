<?php
header('Content-Type: application/json');

// ========== DATABASE CONFIG (XAMPP) ==========
$host = 'localhost';
$dbname = 'cybersecurity';
$db_username = 'root';
$db_password = ''; // Default XAMPP has no password

// ========== CONNECT TO DATABASE ==========
try {
    $conn = new mysqli($host, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}

// ========== HANDLE LOGIN ==========
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validate inputs
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    // Look up user
    $stmt = $conn->prepare("SELECT id, fullname, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
        $stmt->close();
        exit;
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'message' => 'Login successful! Welcome, ' . $user['fullname'] . '.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    }

    $stmt->close();
    $conn->close();

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
