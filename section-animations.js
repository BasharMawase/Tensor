/**
 * Tensor Academy - Section Animations
 * Adds ambient, topic-specific background elements to sections.
 * Optimized for performance and premium aesthetics.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const ANIMATION_CONFIG = {
        'courses': {
            type: 'float',
            symbols: ['∫', '∑', '∂', 'π', '∆', '∞', '∇', '≈'],
            color: 'rgba(242, 209, 132, 0.08)', // Gold
            count: 15
        },
        'academics': {
            type: 'float',
            symbols: ['α', 'β', 'γ', 'θ', 'λ', 'Ω'],
            color: 'rgba(242, 209, 132, 0.05)',
            count: 10
        },
        'languages': {
            type: 'cloud',
            symbols: ['English', 'Español', 'Français', 'Deutsch', '中文', 'العربية', 'עברית', 'Русский', '日本語', 'Português'],
            color: 'rgba(255, 255, 255, 0.08)',
            count: 20
        },
        'programming': {
            type: 'matrix',
            symbols: ['0', '1', 'class', 'return', 'if', 'else', 'for', 'while', '{', '}', ';', '=>', '</>'],
            color: '#0F0', // Matrix Green
            count: 50
        },
        'ai-data-science': {
            type: 'float',
            symbols: ['[ ]', '0', '1', '●', '◈', '⚝'],
            color: 'rgba(255, 100, 100, 0.05)', // Redish/Pink
            count: 15
        }
    };

    // --- Style Injection ---
    const style = document.createElement('style');
    style.textContent = `
        .section-anim-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }
        
        /* Floating Animation */
        .anim-symbol {
            position: absolute;
            font-family: 'Playfair Display', monospace;
            font-weight: bold;
            user-select: none;
            animation: floatSymbol 15s infinite linear;
            will-change: transform, opacity;
        }

        @keyframes floatSymbol {
            0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(20deg); opacity: 0; }
        }

        /* Language Cloud Animation */
        .lang-word {
            position: absolute;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.1);
            white-space: nowrap;
            transition: all 0.5s ease;
            opacity: 0;
        }
        
        .lang-word.active {
            opacity: 1;
            transform: scale(1.2);
            color: var(--gold-primary);
        }

        /* Matrix Canvas */
        .matrix-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3; /* Subtle background */
        }
    `;
    document.head.appendChild(style);

    // --- Animation Classes (Must be defined before use) ---

    // 1. Classic Floating Symbols (Legacy/Default)
    class FloatAnimation {
        constructor(container, config) {
            this.container = container;
            this.config = config;
            this.elements = [];
            this.running = false;
        }

        init() {
            for (let i = 0; i < this.config.count; i++) {
                const span = document.createElement('span');
                span.className = 'anim-symbol';
                span.textContent = this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)];

                const size = Math.random() * 2 + 1;
                const left = Math.random() * 100;
                const duration = Math.random() * 15 + 10;

                span.style.color = this.config.color;
                span.style.fontSize = `${size}rem`;
                span.style.left = `${left}%`;
                span.style.top = `${Math.random() * 100}%`;
                span.style.animationDuration = `${duration}s`;
                span.style.animationDelay = `-${Math.random() * 20}s`;

                this.container.appendChild(span);
                this.elements.push(span);
            }
        }

        start() {
            if (!this.running) {
                if (this.elements.length === 0) this.init();
                this.elements.forEach(el => el.style.animationPlayState = 'running');
                this.running = true;
            }
        }

        stop() {
            // Optional optimization
        }
    }

    // 2. Matrix Rain
    class MatrixAnimation {
        constructor(container, config) {
            this.container = container;
            this.config = config;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'matrix-canvas';
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.columns = [];
            this.fontSize = 16;
            this.running = false;
            this.animationFrame = null;
        }

        resize() {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            const colCount = Math.floor(this.canvas.width / this.fontSize);
            this.columns = Array(colCount).fill(0);
        }

        draw() {
            this.ctx.fillStyle = 'rgba(2, 12, 27, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = '#0F0';
            this.ctx.font = `${this.fontSize}px monospace`;

            for (let i = 0; i < this.columns.length; i++) {
                const text = this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)];
                this.ctx.fillText(text, i * this.fontSize, this.columns[i] * this.fontSize);

                if (this.columns[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.columns[i] = 0;
                }
                this.columns[i]++;
            }

            if (this.running) {
                this.animationFrame = requestAnimationFrame(() => this.draw());
            }
        }

        start() {
            if (!this.running) {
                this.resize();
                window.addEventListener('resize', () => this.resize());

                this.running = true;
                this.draw();
            }
        }

        stop() {
            this.running = false;
            cancelAnimationFrame(this.animationFrame);
        }
    }

    // 3. Language Cloud (Drifting Words)
    class LangCloudAnimation {
        constructor(container, config) {
            this.container = container;
            this.config = config;
            this.words = [];
            this.running = false;
            this.interval = null;
        }

        init() {
            for (let i = 0; i < this.config.count; i++) {
                const word = document.createElement('div');
                word.className = 'lang-word';
                word.textContent = this.config.symbols[Math.floor(Math.random() * this.config.symbols.length)];

                this.resetWord(word);

                this.container.appendChild(word);
                this.words.push({
                    el: word,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2
                });
            }
        }

        resetWord(el) {
            el.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
            el.style.opacity = Math.random() * 0.2 + 0.05;
        }

        update() {
            this.words.forEach(obj => {
                obj.x += obj.vx;
                obj.y += obj.vy;

                if (obj.x < 0 || obj.x > 100) obj.vx *= -1;
                if (obj.y < 0 || obj.y > 100) obj.vy *= -1;

                obj.el.style.left = `${obj.x}%`;
                obj.el.style.top = `${obj.y}%`;

                if (Math.random() > 0.995) {
                    obj.el.classList.add('active');
                    setTimeout(() => obj.el.classList.remove('active'), 2000);
                }
            });

            if (this.running) {
                this.interval = requestAnimationFrame(() => this.update());
            }
        }

        start() {
            if (!this.running) {
                if (this.words.length === 0) this.init();
                this.running = true;
                this.update();
            }
        }

        stop() {
            this.running = false;
            cancelAnimationFrame(this.interval);
        }
    }

    // --- Observer and Initialization ---
    const observerOptions = {
        root: null,
        threshold: 0.2
    };

    const activeAnimations = {};

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (activeAnimations[id]) {
                    activeAnimations[id].start();
                }
            } else {
                const id = entry.target.id;
                if (activeAnimations[id]) {
                    activeAnimations[id].stop();
                }
            }
        });
    }, observerOptions);

    Object.keys(ANIMATION_CONFIG).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        if (getComputedStyle(section).position === 'static') {
            section.style.position = 'relative';
        }

        const config = ANIMATION_CONFIG[sectionId];
        const container = document.createElement('div');
        container.className = 'section-anim-container';
        section.prepend(container);

        if (config.type === 'matrix') {
            activeAnimations[sectionId] = new MatrixAnimation(container, config);
        } else if (config.type === 'cloud') {
            activeAnimations[sectionId] = new LangCloudAnimation(container, config);
        } else {
            activeAnimations[sectionId] = new FloatAnimation(container, config);
        }

        observer.observe(section);
    });

    console.log('Advanced Section Animations initialized (Fixed)');
});
