/**
 * SIDE QUEST CONFESSION - PARTICLES
 * Canvas starfield and DOM particle effects
 */

const Particles = (function () {
    const canvas = document.getElementById('starfield');
    const ctx = canvas?.getContext('2d');

    let stars = [];
    let shootingStars = [];
    let animationId = null;
    let isActive = true;
    const reducedMotion = Storage.systemReducedMotion() || Storage.getReducedMotion();

    // Star class
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.5 + 0.3;
            this.alpha = this.baseAlpha;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }

        update() {
            if (reducedMotion) return;

            this.twinklePhase += this.twinkleSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.2;

            // Subtle drift
            this.y -= 0.02;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha)})`;
            ctx.fill();
        }
    }

    // Shooting star
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.3;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 6 + 4;
            this.angle = Math.PI / 4;
            this.life = 1;
            this.active = false;
            this.waitTime = Math.random() * 8000 + 5000;
        }

        update() {
            if (!this.active) {
                this.waitTime -= 16;
                if (this.waitTime <= 0) {
                    this.active = true;
                }
                return;
            }

            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= 0.015;

            if (this.life <= 0 || this.x > canvas.width + 100 || this.y > canvas.height + 100) {
                this.reset();
            }
        }

        draw() {
            if (!this.active) return;

            const tailX = this.x - Math.cos(this.angle) * this.length;
            const tailY = this.y - Math.sin(this.angle) * this.length;

            const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        if (!canvas || !ctx) return;

        resize();
        window.addEventListener('resize', resize);

        // Create stars - limited count for performance
        const starCount = reducedMotion ? 50 : Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        // Create shooting stars
        shootingStars = [];
        for (let i = 0; i < 2; i++) {
            shootingStars.push(new ShootingStar());
        }

        animate();
    }

    function animate() {
        if (!isActive || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height * 0.7, 0,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        gradient.addColorStop(0, 'rgba(45, 27, 78, 0.15)');
        gradient.addColorStop(0.5, 'rgba(10, 10, 26, 0)');
        gradient.addColorStop(1, 'rgba(6, 6, 18, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Update and draw shooting stars
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    function stop() {
        isActive = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function start() {
        isActive = true;
        if (!animationId) {
            animate();
        }
    }

    // DOM-based confetti
    function createConfetti(options = {}) {
        if (reducedMotion) return;

        const {
            count = 50,
            colors = ['#c44569', '#e66767', '#ff4757', '#fdcb6e', '#ffeaa7', '#ffffff'],
            duration = 4000
        } = options;

        const container = document.getElementById('particle-layer');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animDuration = Math.random() * 2 + 2;
            const delay = Math.random() * 1;
            const isCircle = Math.random() > 0.5;

            piece.style.cssText = `
                --size: ${size}px;
                --color: ${color};
                --duration: ${animDuration}s;
                --delay: ${delay}s;
                --radius: ${isCircle ? '50%' : '0'};
                left: ${left}vw;
            `;

            container.appendChild(piece);

            // Cleanup
            setTimeout(() => {
                piece.remove();
            }, (animDuration + delay) * 1000);
        }
    }

    // Floating hearts
    function createHearts(options = {}) {
        if (reducedMotion) return;

        const {
            count = 15,
            duration = 6000
        } = options;

        const container = document.getElementById('particle-layer');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['❤️', '💖', '💕', '💗'][Math.floor(Math.random() * 4)];

            const size = Math.random() * 16 + 12;
            const left = Math.random() * 100;
            const animDuration = Math.random() * 3 + 4;
            const delay = Math.random() * 3;

            heart.style.cssText = `
                --size: ${size}px;
                --duration: ${animDuration}s;
                --delay: ${delay}s;
                left: ${left}vw;
            `;

            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, (animDuration + delay) * 1000);
        }
    }

    // Star burst celebration
    function starBurst(x, y) {
        if (reducedMotion) return;

        const container = document.getElementById('particle-layer');
        if (!container) return;

        const count = 20;
        const colors = ['#ff4757', '#fdcb6e', '#ffffff', '#c44569'];

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            star.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 100;
                transition: all 0.8s ease-out;
            `;

            container.appendChild(star);

            requestAnimationFrame(() => {
                star.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                star.style.opacity = '0';
            });

            setTimeout(() => star.remove(), 800);
        }
    }

    return {
        init,
        stop,
        start,
        createConfetti,
        createHearts,
        starBurst,
        get isActive() { return isActive; }
    };
})();

window.Particles = Particles;
