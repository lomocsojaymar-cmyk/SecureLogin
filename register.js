// ========== PASSWORD TOGGLE VISIBILITY ==========
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========== PASSWORD STRENGTH CHECKER ==========
const passwordInput = document.getElementById('reg-password');
const confirmInput = document.getElementById('confirm-password');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

const checks = {
    length: { element: document.getElementById('check-length'), regex: /.{12,}/ },
    upper:  { element: document.getElementById('check-upper'),  regex: /[A-Z]/ },
    lower:  { element: document.getElementById('check-lower'),  regex: /[a-z]/ },
    number: { element: document.getElementById('check-number'), regex: /[0-9]/ },
    special:{ element: document.getElementById('check-special'), regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ }
};

const strengthLevels = [
    { label: '', color: 'transparent', width: '0%' },
    { label: 'Very Weak', color: '#ef4444', width: '20%' },
    { label: 'Weak', color: '#f97316', width: '40%' },
    { label: 'Fair', color: '#eab308', width: '60%' },
    { label: 'Strong', color: '#22c55e', width: '80%' },
    { label: 'Very Strong', color: '#06b6d4', width: '100%' }
];

passwordInput.addEventListener('input', function () {
    const password = this.value;
    let score = 0;

    // Check each requirement
    for (const key in checks) {
        const check = checks[key];
        const icon = check.element.querySelector('i');

        if (check.regex.test(password)) {
            score++;
            check.element.classList.add('passed');
            check.element.classList.remove('failed');
            icon.classList.remove('fa-circle', 'fa-circle-xmark');
            icon.classList.add('fa-circle-check');
        } else {
            check.element.classList.remove('passed');
            if (password.length > 0) {
                check.element.classList.add('failed');
                icon.classList.remove('fa-circle', 'fa-circle-check');
                icon.classList.add('fa-circle-xmark');
            } else {
                check.element.classList.remove('failed');
                icon.classList.remove('fa-circle-check', 'fa-circle-xmark');
                icon.classList.add('fa-circle');
            }
        }
    }

    // Update strength bar
    const level = strengthLevels[score];
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = password.length > 0 ? level.label : '';
    strengthText.style.color = level.color;

    // Also check confirm password match if it has a value
    if (confirmInput.value.length > 0) {
        checkPasswordMatch();
    }
});

// ========== CONFIRM PASSWORD MATCH ==========
function checkPasswordMatch() {
    const matchMsg = document.getElementById('matchMessage');
    if (confirmInput.value.length === 0) {
        matchMsg.textContent = '';
        matchMsg.className = 'match-message';
        return;
    }
    if (passwordInput.value === confirmInput.value) {
        matchMsg.textContent = '✓ Passwords match';
        matchMsg.className = 'match-message match-success';
    } else {
        matchMsg.textContent = '✗ Passwords do not match';
        matchMsg.className = 'match-message match-error';
    }
}

confirmInput.addEventListener('input', checkPasswordMatch);

// ========== DISPLAY MESSAGE ==========
function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;

    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 6000);
}

// ========== FORM SUBMISSION ==========
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    // Validate all checks pass
    let allPassed = true;
    for (const key in checks) {
        if (!checks[key].regex.test(password)) {
            allPassed = false;
            break;
        }
    }

    if (!allPassed) {
        displayMessage('Please meet all password requirements.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        displayMessage('Passwords do not match.', 'error');
        return;
    }

    // Show loading
    const btn = document.getElementById('registerBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    btn.disabled = true;
    btnText.textContent = 'Creating Account...';
    btnLoader.style.display = 'inline-block';

    try {
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('register.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            displayMessage(result.message, 'success');
            document.getElementById('registerForm').reset();
            // Reset checklist
            for (const key in checks) {
                const icon = checks[key].element.querySelector('i');
                checks[key].element.classList.remove('passed', 'failed');
                icon.classList.remove('fa-circle-check', 'fa-circle-xmark');
                icon.classList.add('fa-circle');
            }
            strengthFill.style.width = '0%';
            strengthText.textContent = '';
            document.getElementById('matchMessage').textContent = '';

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            displayMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        displayMessage('An error occurred. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Create Account';
        btnLoader.style.display = 'none';
    }
});
