document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    window.addEventListener('resize', resizeCanvas);
    initPaymentInteractions();
    initVisitorCount();
    initMobileMenu();
    initScrollReveal();
    initAnalytics();

    // Header Scroll Effect
    const header = document.querySelector('header');
    const heroLogo = document.querySelector('.hero-logo-img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax logo
        if (heroLogo && scrolled < 600) {
            heroLogo.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.05}deg)`;
            heroLogo.style.opacity = 1 - (scrolled / 500);
        }
    });
});

// --- Data Collection Analytics ---
function initAnalytics() {
    const trackEvent = (type, data) => {
        try {
            const events = JSON.parse(localStorage.getItem('tensor_events') || '[]');
            events.push({
                type,
                data,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                userAgent: navigator.userAgent
            });
            // Keep only last 100 events to prevent localStorage bloat
            if (events.length > 100) events.shift();
            localStorage.setItem('tensor_events', JSON.stringify(events));
        } catch (e) {
            console.warn('Analytics tracking failed', e);
        }
    };

    // Track page view
    trackEvent('pageview', { title: document.title });

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .btn, .selection-card');
        if (target) {
            trackEvent('click', {
                element: target.tagName,
                text: (target.textContent || '').trim().substring(0, 50),
                id: target.id || target.className
            });
        }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
        trackEvent('form_submit', {
            formId: e.target.id || 'unknown_form'
        });
    });
}

// --- Scroll Reveal Logic ---
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it's revealed, we can stop observing it
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
    revealElements.forEach(el => observer.observe(el));
}

// --- Mobile Menu Logic ---
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// --- Visitor Counter Logic ---
async function initVisitorCount() {
    const countElement = document.getElementById('visitor-count-value');
    if (!countElement) return;

    try {
        const response = await fetch('/api/visitor-count');
        const data = await response.json();

        // Animate count-up
        let current = 0;
        const target = data.count;
        const duration = 1500; // 1.5 seconds
        const step = target / (duration / 16); // 60fps

        const animate = () => {
            current += step;
            if (current < target) {
                countElement.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(animate);
            } else {
                countElement.textContent = target.toLocaleString();
            }
        };
        animate();
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        countElement.textContent = '---';
    }
}

// --- Payment Card Animation Logic ---
function initPaymentInteractions() {
    const cardObject = document.getElementById('card-3d');
    if (!cardObject) return; // Payment section might not be on all pages or loaded yet

    const inputNumber = document.getElementById('input-number');
    const inputName = document.getElementById('input-name');
    const inputDate = document.getElementById('input-date');
    const inputCVV = document.getElementById('input-cvv');

    const displayNumber = document.getElementById('display-number');
    const displayName = document.getElementById('display-name');
    const displayDate = document.getElementById('display-date');
    const displayCVV = document.getElementById('display-cvv');

    // Flip Logic
    if (inputCVV) {
        inputCVV.addEventListener('focus', () => {
            cardObject.classList.add('is-flipped');
        });
        inputCVV.addEventListener('blur', () => {
            cardObject.classList.remove('is-flipped');
        });

        inputCVV.addEventListener('input', (e) => {
            displayCVV.textContent = e.target.value || '***';
        });
    }

    // Real-time Update Logic
    if (inputNumber) {
        inputNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted; // Update input with spacing
            displayNumber.textContent = formatted || '#### #### #### ####';
        });
    }

    if (inputName) {
        inputName.addEventListener('input', (e) => {
            displayName.textContent = e.target.value.toUpperCase() || 'FULL NAME';
        });
    }

    if (inputDate) {
        inputDate.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
            displayDate.textContent = val || 'MM/YY';
        });
    }
    // --- Backend Integration ---
    const paymentBtn = document.getElementById('btn-payment-submit');
    const signupForm = document.getElementById('form-signup');

    if (paymentBtn) {
        paymentBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const btnText = paymentBtn.textContent;
            paymentBtn.textContent = 'Processing...';
            paymentBtn.disabled = true;

            const paymentData = {
                cardNumber: document.getElementById('input-number')?.value,
                cardName: document.getElementById('input-name')?.value,
                expiry: document.getElementById('input-date')?.value,
                cvv: document.getElementById('input-cvv')?.value,
                amount: 100, // Default or selected amount
                currency: 'USD'
            };

            try {
                const response = await fetch('/api/pay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                });
                const result = await response.json();

                if (result.success) {
                    alert('✅ ' + result.message);
                } else {
                    alert('❌ Payment failed: ' + result.message);
                }
            } catch (err) {
                console.error(err);
                alert('❌ Connection Error. Please start the server (npm start).');
            } finally {
                paymentBtn.textContent = btnText;
                paymentBtn.disabled = false;
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input');
            const formData = {
                name: inputs[0].value,
                email: inputs[1].value,
                interest: inputs[2] ? inputs[2].value : 'General'
            };

            // Simple visual feedback
            const btn = signupForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';

            try {
                const response = await fetch('/api/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                alert(result.message);
                signupForm.reset();
            } catch (err) {
                alert('❌ Error sending application.');
            } finally {
                btn.textContent = originalText;
            }
        });
    }
}

/* --- Canvas Animation: Interactive Neural Network & Math Debris --- */
const canvas = document.getElementById('canvas-overlay');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let mathParticles = [];

const mathSymbols = [
    '∫', '∑', 'π', '∞', '∇', '∂', '√', 'λ', 'θ', 'Δ', 'Ω', 'μ', 'β', 'ƒ(x)', 'e', 'dy/dx', '≠', '≈',
    '∀', '∃', '∈', '∉', '⊂', '⊃', '∪', '∩', 'φ', 'ψ', 'Γ', 'Ξ', 'ℝ', 'ℂ', 'ℤ', 'ℕ', 'ℚ', '∅',
    '∮', '∯', '∴', '∵', '↦', '→', '⇔', '∫∫', 'lim', 'log', 'sin', 'cos', 'tan', 'det', 'Tr', 'α', 'δ', 'ε', 'ζ', 'η', 'ι', 'κ', 'ν', 'ξ', 'ρ', 'σ', 'τ', 'υ', 'χ', 'ω',
    '⊥', '⊕', '⊗', '∥', '∠', '°', '≡', '≤', '≥', '≪', '≫', '±', '∓', '∝',
    'ℏ', '†', 'ℒ', 'ℋ', 'ℱ', '∇²', 'dx', 'dy', 'dz', '∂x', '∂y', '∂z'
];

const config = {
    particleCount: 120,
    connectionDistance: 130,
    mouseRadius: 180,
    baseSpeed: 0.6,
    color: 'rgba(242, 209, 132, 0.7)',
    mathParams: {
        fontSizeMax: 24,
        fontSizeMin: 12,
        fadeSpeed: 0.015,
        velocity: 1.5
    }
};

const mouse = { x: null, y: null, lastX: null, lastY: null };

window.addEventListener('mousemove', (e) => {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.x;
    mouse.y = e.y;

    if (mouse.lastX !== null) {
        const dist = Math.hypot(mouse.x - mouse.lastX, mouse.y - mouse.lastY);
        if (dist > 5 && Math.random() > 0.7) {
            spawnMathParticle(mouse.x, mouse.y);
        }
    }
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.size = Math.random() * 2 + 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseRadius - distance) / config.mouseRadius;
                const attractionStrength = 0.05;
                this.vx += forceDirectionX * force * attractionStrength;
                this.vy += forceDirectionY * force * attractionStrength;
            }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 2;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    draw() {
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class MathParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.text = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        this.size = Math.random() * (config.mathParams.fontSizeMax - config.mathParams.fontSizeMin) + config.mathParams.fontSizeMin;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * config.mathParams.velocity;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.opacity = 1;
        this.rotation = Math.random() * 0.5 - 0.25;
        this.currentRotation = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.02;
        this.opacity -= config.mathParams.fadeSpeed;
        this.currentRotation += this.rotation * 0.1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#f2d184';
        ctx.font = `${this.size}px "Playfair Display", serif`;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.currentRotation);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}

function spawnMathParticle(x, y) {
    mathParticles.push(new MathParticle(x, y));
    if (mathParticles.length > 50) {
        mathParticles.shift();
    }
}

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    particles = [];
    const count = (width < 768) ? 30 : config.particleCount;

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    animate();
}

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                ctx.beginPath();
                const opacity = 1 - (distance / config.connectionDistance);
                ctx.strokeStyle = `rgba(242, 209, 132, ${opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(242, 209, 132, ${1 - distance / config.connectionDistance})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    for (let i = mathParticles.length - 1; i >= 0; i--) {
        mathParticles[i].update();
        mathParticles[i].draw();
        if (mathParticles[i].opacity <= 0) {
            mathParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// --- Bit Payment Integration ---
async function initiateBitPayment() {
    const bitBtn = document.querySelector('.bit-btn');
    const originalContent = bitBtn.innerHTML;

    try {
        // Find the amount (could be from the donation grid or a prompt)
        const activeAmountBtn = document.querySelector('.donate-amount-btn.active');
        let amount = activeAmountBtn ? parseInt(activeAmountBtn.textContent.replace(/[^0-9]/g, '')) : 100;

        const isRecurring = document.getElementById('bit-recurring')?.checked || false;

        // Show loading state
        bitBtn.innerHTML = '<span>Processing...</span>';
        bitBtn.disabled = true;

        const response = await fetch('/api/create-bit-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                currency: 'ILS',
                description: 'Donation to Tensor Academy',
                donorEmail: currentUser ? currentUser.email : null,
                recurring: isRecurring
            })
        });

        const data = await response.json();

        if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
        } else if (data.error) {
            alert('Error: ' + data.error);
            bitBtn.innerHTML = originalContent;
            bitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Bit Error:', err);
        alert('Could not initiate Bit payment. Please try again.');
        bitBtn.innerHTML = originalContent;
        bitBtn.disabled = false;
    }
}

// Add event listener for Bit button
document.addEventListener('DOMContentLoaded', () => {
    const bitBtn = document.querySelector('.bit-btn');
    if (bitBtn) {
        bitBtn.addEventListener('click', initiateBitPayment);
    }

    // Amount button active state
    const amountBtns = document.querySelectorAll('.donate-amount-btn');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
