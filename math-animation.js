/**
 * Tensor Academy - Math Network Animation
 * A sleek, high-performance particle network representing neural connections and tensor fields.
 * Palette: Matches style.css (Gold/Blue Deep)
 */

(function () {
    const canvas = document.getElementById('canvas-overlay');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const CONFIG = {
        particleCount: 60, // Density
        connectionDistance: 180, // Range for lines
        mouseDistance: 200, // Range for mouse interaction
        baseSpeed: 0.4,
        colors: {
            particle: 'rgba(242, 209, 132, 0.6)', // gold-primary
            line: 'rgba(242, 209, 132, 0.15)' // gold-glow
        }
    };

    // Mouse tracking
    const mouse = { x: null, y: null };

    // Resize handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Random velocity vectors
            this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
            this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
            this.size = Math.random() * 2 + 1; // Size 1-3px
        }

        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap (infinite canvas effect)
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse interaction (Repulsion)
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (CONFIG.mouseDistance - distance) / CONFIG.mouseDistance;

                    // Gentle push away
                    const strength = 0.05;
                    this.vx -= forceDirectionX * force * strength;
                    this.vy -= forceDirectionY * force * strength;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.colors.particle;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Adjust count based on screen size
        const count = window.innerWidth < 768 ? 30 : CONFIG.particleCount;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connections (Tensor mesh)
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = CONFIG.colors.line;
                    ctx.lineWidth = 1 - (distance / CONFIG.connectionDistance); // Fade out
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Event Listeners
    window.addEventListener('resize', resize);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Start
    resize();
    animate();

    console.log('Math Animation initialized');
})();
