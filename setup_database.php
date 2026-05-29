<?php
/**
 * Database Setup Script
 * Run this once to create the 'cybersecurity' database and users table.
 * Access via: http://localhost/Masangka/setup_database.php
 */

$host = 'localhost';
$db_username = 'root';
$url = 'http://localhost/Masangka/login.html'
$db_password = '';

echo "<h2>CyberSecurity Database Setup</h2>";

// Connect to MySQL
$conn = new mysqli($host, $db_username, $db_password);

if ($conn->connect_error) {
    die("<p style='color:red;'>❌ Connection failed: " . $conn->connect_error . "</p>");
}

echo "<p style='color:green;'>✅ Connected to MySQL successfully.</p>";

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS cybersecurity";
if ($conn->query($sql) === TRUE) {
    echo "<p style='color:green;'>✅ Database 'cybersecurity' created or already exists.</p>";
} else {
    die("<p style='color:red;'>❌ Error creating database: " . $conn->error . "</p>");
}

// Select database
$conn->select_db('cybersecurity');

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "<p style='color:green;'>✅ Table 'users' created or already exists.</p>";
} else {
    die("<p style='color:red;'>❌ Error creating table: " . $conn->error . "</p>");
}

echo "<hr>";
echo "<p><strong>Setup complete!</strong> You can now:</p>";
echo "<ul>";
echo "<li><a href='register.html'>Go to Registration Page</a></li>";
echo "<li><a href='login.html'>Go to Login Page</a></li>";
echo "</ul>";

$conn->close();
?>
