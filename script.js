// Pepper - secret key stored separately (in production, this should be stored securely on the server)
const PEPPER = "MySecretPepperKey2024!@#";

// Generate a random salt
function generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate password requirements
function validatePassword(password) {
    const errors = [];
    
    // Check minimum length (12 characters)
    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long');
    }
    
    // Check for at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least 1 uppercase letter');
    }
    
    // Check for at least 1 lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least 1 lowercase letter');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Hash password with salt and pepper
async function hashPassword(password, salt) {
    // Combine password + salt + pepper
    const combined = password + salt + PEPPER;
    
    // Hash using bcrypt
    const hash = await bcrypt.hash(combined, 10);
    return hash;
}

// Display message to user
function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 5000);
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate password
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
        displayMessage(validation.errors.join('. '), 'error');
        return;
    }
    
    // Generate salt for this password
    const salt = generateSalt();
    
    try {
        // Hash the password with salt and pepper
        const hashedPassword = await hashPassword(password, salt);
        
        // In a real application, you would send this to your server
        // For demonstration, we'll show the hash and salt
        console.log('Username:', username);
        console.log('Salt:', salt);
        console.log('Hashed Password:', hashedPassword);
        
        displayMessage('Login successful! Password hashed with salt and pepper.', 'success');
        
        // Clear the form
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('Error hashing password:', error);
        displayMessage('An error occurred during login.', 'error');
    }
});

// Real-time password validation feedback
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    const validation = validatePassword(password);
    
    if (password.length === 0) {
        e.target.style.borderColor = '#ddd';
        return;
    }
    
    if (validation.isValid) {
        e.target.style.borderColor = '#28a745';
    } else {
        e.target.style.borderColor = '#dc3545';
    }
});
