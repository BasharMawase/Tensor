// Auth State Management
let currentUser = JSON.parse(localStorage.getItem('tensor_user')) || null;

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    // Check if we should auto-open the auth modal
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openAuth') === 'true') {
        setTimeout(() => openAuthModal(), 300);
    }

    // Check for pending enrollment
    const pendingEnrollment = localStorage.getItem('pending_enrollment');
    if (pendingEnrollment && currentUser) {
        setTimeout(() => {
            const enroll = confirm(`You were trying to enroll in "${pendingEnrollment}".\n\nWould you like to continue?`);
            if (enroll) {
                // Find the course and redirect
                const courseId = findCourseIdByTitle(pendingEnrollment);
                if (courseId) {
                    window.location.href = `course.html?id=${courseId}&lang=en`;
                }
            }
            localStorage.removeItem('pending_enrollment');
        }, 500);
    }

    // Attach listeners to Auth Buttons (Desktop & Mobile versions)
    const authButtons = [
        document.getElementById('nav-auth-btn'),
        document.getElementById('mobile-auth-btn'),
        document.getElementById('mobile-auth-btn-ar'),
        document.getElementById('mobile-auth-btn-he'),
        document.getElementById('mobile-auth-btn-ru')
    ];

    authButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (currentUser) {
                    logout();
                } else {
                    openAuthModal();
                }
            });
        }
    });

    // Modal forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    login(data);
                } else {
                    showAuthError('login', data.message);
                }
            } catch (err) {
                showAuthError('login', 'Server error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    // Start Verification Flow
                    alert(`✅ Account created successfully!\n\nWe have sent a verification link to ${email}.\n\n(Since this is a demo, check the server console for the link)`);
                    closeAuthModal();
                    // Do not auto-login
                } else {
                    showAuthError('signup', data.message);
                }
            } catch (err) {
                showAuthError('signup', 'Server error');
            }
        });
    }
});

function openAuthModal() {
    document.getElementById('modal-overlay').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

function showAuthError(type, msg) {
    const errDiv = document.getElementById(`${type}-error`);
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
}

function login(userData) {
    currentUser = userData;
    localStorage.setItem('tensor_user', JSON.stringify(userData));
    closeAuthModal();
    updateAuthUI();
    location.reload(); // Refresh to update view
}

function logout() {
    currentUser = null;
    localStorage.removeItem('tensor_user');
    updateAuthUI();
    location.reload();
}

function updateAuthUI() {
    const authButtons = [
        document.getElementById('nav-auth-btn'),
        document.getElementById('mobile-auth-btn'),
        document.getElementById('mobile-auth-btn-ar'),
        document.getElementById('mobile-auth-btn-he'),
        document.getElementById('mobile-auth-btn-ru')
    ];

    authButtons.forEach(authBtn => {
        if (!authBtn) return;

        if (currentUser) {
            authBtn.textContent = `Logout (${currentUser.name})`;
            authBtn.classList.add('logged-in');
        } else {
            authBtn.classList.remove('logged-in');
            // Translation for Login/Sign Up based on current page
            const lang = document.documentElement.lang || 'en';
            if (lang === 'ar') authBtn.textContent = 'دخول / تسجيل';
            else if (lang === 'he') authBtn.textContent = 'התחברות / הרשמה';
            else if (lang === 'ru') authBtn.textContent = 'Войти / Регистрация';
            else authBtn.textContent = 'Login / Sign Up';
        }
    });

    // Handle Admin Link visibility
    const adminLink = document.getElementById('nav-admin-link');
    if (adminLink) {
        if (currentUser) { // Show to any logged-in user for now
            adminLink.style.display = 'inline-block';
        } else {
            adminLink.style.display = 'none';
        }
    }
}

// Helper function to find course ID by title
function findCourseIdByTitle(title) {
    const courseMap = {
        'Calculus & Analysis': 'MTH-101',
        'Linear Algebra': 'MTH-102',
        'Abstract Algebra': 'MTH-201',
        'Real Analysis': 'MTH-202',
        'Topology': 'MTH-301',
        'Differential Geometry': 'MTH-302',
        'Scientific English': 'LANG-EN',
        'Modern Arabic': 'LANG-AR',
        'Hebrew Language': 'LANG-HE',
        'Russian Language': 'LANG-RU',
        'Python for Science': 'LANG-PY'
    };

    return courseMap[title] || 'MTH-101';
}
