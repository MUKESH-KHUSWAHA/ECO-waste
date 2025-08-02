
// Authentication handling for signin.html and signup.html

document.addEventListener('DOMContentLoaded', function() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Sign In functionality
    if (currentPage === 'signin.html') {
        const signinForm = document.getElementById('signin-form');
        const googleSigninBtn = document.getElementById('google-signin-btn');
        const loading = document.getElementById('loading');
        const messageContainer = document.getElementById('message-container');

        if (signinForm) {
            signinForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                loading.classList.remove('hidden');
                
                try {
                    const response = await fetch('/api/auth/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        showMessage('Sign in successful! Redirecting...', 'success');
                        localStorage.setItem('authToken', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        showMessage(result.error || 'Sign in failed', 'error');
                    }
                } catch (error) {
                    showMessage('Network error. Please try again.', 'error');
                } finally {
                    loading.classList.add('hidden');
                }
            });
        }

        if (googleSigninBtn) {
            googleSigninBtn.addEventListener('click', function() {
                showMessage('Google Sign In coming soon!', 'info');
            });
        }
    }
    
    // Sign Up functionality
    if (currentPage === 'signup.html') {
        const signupForm = document.getElementById('signup-form');
        const googleSignupBtn = document.getElementById('google-signup-btn');
        const loading = document.getElementById('loading');
        const messageContainer = document.getElementById('message-container');

        if (signupForm) {
            signupForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const terms = document.getElementById('terms').checked;
                
                if (!firstName || !lastName || !email || !password || !confirmPassword) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showMessage('Passwords do not match', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showMessage('Password must be at least 6 characters', 'error');
                    return;
                }
                
                if (!terms) {
                    showMessage('Please accept the terms and conditions', 'error');
                    return;
                }
                
                loading.classList.remove('hidden');
                
                try {
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ firstName, lastName, email, password })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        showMessage('Account created successfully! Redirecting...', 'success');
                        localStorage.setItem('authToken', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        showMessage(result.error || 'Sign up failed', 'error');
                    }
                } catch (error) {
                    showMessage('Network error. Please try again.', 'error');
                } finally {
                    loading.classList.add('hidden');
                }
            });
        }

        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', function() {
                showMessage('Google Sign Up coming soon!', 'info');
            });
        }
    }

    function showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) return;
        
        const alertClass = type === 'success' ? 'bg-green-100 text-green-800 border-green-300' :
                          type === 'error' ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-blue-100 text-blue-800 border-blue-300';
        
        messageContainer.innerHTML = `
            <div class="p-4 border rounded-2xl ${alertClass} backdrop-blur-xl">
                <p class="font-semibold">${message}</p>
            </div>
        `;
        
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 3000);
        }
    }
});
