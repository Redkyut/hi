/**
 * SIDE QUEST CONFESSION - ANIMATIONS
 * Reusable animation utilities
 */

const Animations = (function () {
    const reducedMotion = Storage.systemReducedMotion() || Storage.getReducedMotion();

    function fadeIn(element, duration = 400) {
        if (!element) return Promise.resolve();

        if (reducedMotion) {
            element.classList.remove('hidden');
            element.style.opacity = '1';
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.classList.remove('hidden');
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease`;

            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });

            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    function fadeOut(element, duration = 400) {
        if (!element) return Promise.resolve();

        if (reducedMotion) {
            element.classList.add('hidden');
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.style.opacity = '1';
            element.style.transition = `opacity ${duration}ms ease`;

            requestAnimationFrame(() => {
                element.style.opacity = '0';
            });

            setTimeout(() => {
                element.classList.add('hidden');
                element.style.transition = '';
                element.style.opacity = '';
                resolve();
            }, duration);
        });
    }

    function slideIn(element, direction = 'up', duration = 500) {
        if (!element) return Promise.resolve();

        if (reducedMotion) {
            element.classList.remove('hidden');
            return Promise.resolve();
        }

        const transforms = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)'
        };

        return new Promise(resolve => {
            element.classList.remove('hidden');
            element.style.opacity = '0';
            element.style.transform = transforms[direction] || transforms.up;
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translate(0)';
            });

            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    function scaleIn(element, duration = 500) {
        if (!element) return Promise.resolve();

        if (reducedMotion) {
            element.classList.remove('hidden');
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.classList.remove('hidden');
            element.style.opacity = '0';
            element.style.transform = 'scale(0.9)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;

            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            });

            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    function typewriter(element, text, speed = 50) {
        if (!element) return Promise.resolve();

        return new Promise(resolve => {
            element.textContent = '';
            element.classList.remove('hidden');

            // Add cursor
            let cursor = element.querySelector('.typewriter-cursor');
            if (!cursor) {
                cursor = document.createElement('span');
                cursor.className = 'typewriter-cursor';
                element.appendChild(cursor);
            }

            let i = 0;
            const chars = text.split('');

            function type() {
                if (i < chars.length) {
                    // Handle newlines
                    if (chars[i] === '\n') {
                        element.insertBefore(document.createElement('br'), cursor);
                        i++;
                    } else {
                        const span = document.createElement('span');
                        span.textContent = chars[i];
                        span.style.opacity = '0';
                        span.style.transition = 'opacity 0.05s ease';
                        element.insertBefore(span, cursor);

                        requestAnimationFrame(() => {
                            span.style.opacity = '1';
                        });

                        i++;
                    }

                    // Variable speed for natural feel
                    const delay = speed + (Math.random() * 30 - 15);
                    setTimeout(type, delay);
                } else {
                    // Remove cursor after a moment
                    setTimeout(() => {
                        if (cursor) cursor.remove();
                        resolve();
                    }, 600);
                }
            }

            type();
        });
    }

    function staggerReveal(elements, delay = 200) {
        if (!elements || elements.length === 0) return Promise.resolve();

        return new Promise(resolve => {
            let completed = 0;
            const total = elements.length;

            elements.forEach((el, i) => {
                setTimeout(() => {
                    slideIn(el, 'up', 400).then(() => {
                        completed++;
                        if (completed >= total) resolve();
                    });
                }, i * delay);
            });
        });
    }

    function pulse(element, duration = 1000) {
        if (!element || reducedMotion) return;

        element.style.animation = `pulseGlow ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    function shake(element, intensity = 5) {
        if (!element || reducedMotion) return;

        const original = element.style.transform;
        let count = 0;
        const max = 10;

        const interval = setInterval(() => {
            const x = (Math.random() - 0.5) * intensity * 2;
            const y = (Math.random() - 0.5) * intensity;
            element.style.transform = `translate(${x}px, ${y}px)`;

            count++;
            if (count >= max) {
                clearInterval(interval);
                element.style.transform = original;
            }
        }, 50);
    }

    function transitionScreens(from, to) {
        return new Promise(resolve => {
            fadeOut(from, 400).then(() => {
                from.classList.remove('active');
                to.classList.add('active');
                slideIn(to, 'up', 600).then(resolve);
            });
        });
    }

    return {
        fadeIn,
        fadeOut,
        slideIn,
        scaleIn,
        typewriter,
        staggerReveal,
        pulse,
        shake,
        transitionScreens,
        get reducedMotion() { return reducedMotion; }
    };
})();

window.Animations = Animations;
