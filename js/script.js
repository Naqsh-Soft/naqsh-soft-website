// ==================== THEME SETUP ====================
const html = document.documentElement;
html.setAttribute('data-theme', 'dark');

// ==================== CUSTOM ANIMATED BACKGROUND ====================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            const color = '10, 132, 255'; // RGB values (Dark mode accent)

            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor(canvas.width / 10));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles with lines
    function connectParticles() {
        const color = '10, 132, 255';

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        const isDark = html.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    function updateCanvasTheme() {
        // Just let the next animation frame handle the color change
    }

    // Start animation
    initParticles();
    animate();
}

// ==================== NAVBAR SCROLL ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== MOBILE MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ==================== ENHANCED PARALLAX SCROLL ====================
let ticking = false;
let lastScrollY = window.scrollY;

function updateParallax() {
    const scrollY = window.scrollY;

    // Parallax for sections
    document.querySelectorAll('.section').forEach((section, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrollY * speed);
        section.style.transform = `translateY(${yPos * 0.1}px)`;
    });

    // Parallax for cards with mouse movement effect
    document.querySelectorAll('.card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const distance = cardCenter - windowCenter;
        const parallaxY = distance * 0.05;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            card.style.transform = `translateY(${parallaxY}px)`;
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.15, // Slightly higher threshold for better effect
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counter animation if it's a stat number
            if (entry.target.classList.contains('counter-animate') && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }

            // Optional: Stop observing once visible to save performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in and new animate-item elements
document.addEventListener('DOMContentLoaded', () => {
    // Legacy support
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // New animations
    const animatedItems = document.querySelectorAll('.animate-item, .fade-in-up, .fade-in-left, .fade-in-right, .zoom-in, .flip-in-x, .counter-animate');
    animatedItems.forEach(el => observer.observe(el));
});

// Number Counter Animation
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = 20; // Update every 20ms
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + (el.getAttribute('data-suffix') || '');
            clearInterval(timer);
        } else {
            el.innerText = Math.ceil(current) + (el.getAttribute('data-suffix') || '');
        }
    }, step);
}

// ==================== SMOOTH SCROLL ====================
// Custom smooth scroll with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition - 80; // Account for navbar
            const duration = 1200; // Slower duration for smoother feel
            let start = null;

            // Easing function for smooth animation
            function easeInOutCubic(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    });
});

// Add smooth scrolling behavior to window scroll
let isScrolling = false;
let scrollTimeout;

window.addEventListener('wheel', (e) => {
    // Smooth out scroll speed
    if (!isScrolling) {
        isScrolling = true;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150);
}, { passive: true });

// ==================== CURSOR SPOTLIGHT EFFECT ====================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card, .partner-item, .section');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
