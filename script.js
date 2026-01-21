

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

const hamburgerIcon = hamburger.querySelector('i');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle icon
    const isOpen = navLinks.classList.contains('active');
    hamburgerIcon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburgerIcon.className = 'fas fa-bars'; // Reset icon
        }

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
        } else {
            entry.target.classList.add('hidden');
        }
    });
}, observerOptions);

// Initialize: Hide elements and start observing
document.querySelectorAll('.scroll-reveal').forEach(el => {
    el.classList.add('hidden'); // Hide initially via JS
    observer.observe(el);
});

// Particle Background System
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;
const connectionDistance = 150;
const moveSpeed = 0.5;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 3; // Slightly larger for petals
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 + 0.5; // Fall collision
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX; // Sway motion
        this.angle += this.spin;

        // Reset if goes off screen
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillStyle = 'rgba(255, 183, 197, 0.6)'; // Sakura pink
        ctx.beginPath();
        // Draw petal shape (ellipse-ish)
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- Reference Site Cursor Implementation ---

const cursorGlow = document.querySelector('.cursor-glow');
const interactables = document.querySelectorAll('a, button, .gallery-item, .world-card');

// Cursor State
let mouse = { x: -100, y: -100 }; // Start off-screen
let cursor = { x: -100, y: -100 };
let hue = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Create trail particles on move
    if (Math.random() < 0.8) { // Increased density
        createParticle(mouse.x, mouse.y);
    }
});

// Animation Loop
function updateCursor() {
    // Smooth follow (Lerp)
    cursor.x += (mouse.x - cursor.x) * 0.04;
    cursor.y += (mouse.y - cursor.y) * 0.04;

    // Fixed Sakura Color (Pink)
    const color = `rgba(255, 145, 194, 0.5)`; // Matching accent-glow

    // Apply styles
    cursorGlow.style.left = cursor.x + 'px';
    cursorGlow.style.top = cursor.y + 'px';
    cursorGlow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;

    requestAnimationFrame(updateCursor);
}
updateCursor();

// Particle System
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // Randomize particle props
    const size = Math.random() * 6 + 4; // Larger for petals
    // Mix of pinks for depth
    const colors = ['#ff91c2', '#ffb7d5', '#ffd1e1', '#fff0f5'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 20 + 5; // Slower, drifting feel
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    const rotation = Math.random() * 360;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = color;
    particle.style.transform = `rotate(${rotation}deg)`; // Initial rotation
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.setProperty('--rot', (rotation + 180) + 'deg'); // Target rotation

    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Click Effect
document.addEventListener('click', (e) => {
    // Burst particles
    for (let i = 0; i < 12; i++) {
        createParticle(e.clientX, e.clientY);
    }

    // Scale effect
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
    setTimeout(() => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
});

// Hover Interactions
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });
});

// --- Avatar Easter Egg ---
const avatarImg = document.querySelector('.avatar-img');
let avatarClickCount = 0;
let clickTimer = null;
let isEasterEggActive = false;

avatarImg.addEventListener('click', (e) => {
    if (isEasterEggActive) return;

    avatarClickCount++;

    // Reset after 2 seconds of no clicks
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        avatarClickCount = 0;
    }, 2000);

    // Small bounce animation on each click
    avatarImg.style.animation = 'none';
    avatarImg.offsetHeight; // Trigger reflow
    avatarImg.style.animation = 'avatarBounce 0.3s ease';

    // Easter egg triggers at 5 clicks
    if (avatarClickCount >= 5) {
        avatarClickCount = 0;
        triggerEasterEgg();
    }
});

function triggerEasterEgg() {
    isEasterEggActive = true;

    // Create massive sakura burst
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createSakuraPetal();
        }, i * 20);
    }

    // Show secret message
    showSecretMessage();

    // Make avatar spin
    avatarImg.style.animation = 'avatarSpin 1s ease-in-out';

    // Reset active state after animation
    setTimeout(() => {
        isEasterEggActive = false;
        avatarImg.style.animation = 'none'; // Cleanup
    }, 1000);
}

function createSakuraPetal() {
    const petal = document.createElement('div');
    petal.classList.add('easter-petal');
    document.body.appendChild(petal);

    const size = Math.random() * 15 + 8;
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200;
    const duration = Math.random() * 3 + 3;
    const delay = Math.random() * 0.5;

    const colors = ['#ff91c2', '#ffb7d5', '#ffd1e1', '#fff0f5', '#ffcce6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    petal.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 100% 0 100% 0;
        left: ${startX}px;
        top: -20px;
        pointer-events: none;
        z-index: 10000;
        opacity: 0.9;
        animation: petalFall ${duration}s ease-in-out ${delay}s forwards;
        --drift: ${drift}px;
    `;

    setTimeout(() => {
        petal.remove();
    }, (duration + delay) * 1000 + 100);
}

function showSecretMessage() {
    // Remove existing message if any
    const existing = document.querySelector('.secret-message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.classList.add('secret-message');
    message.innerHTML = `
        <span class="secret-emoji">🐾</span>
        <span class="secret-text">そいそいだよぉ～っ！</span>
        <span class="secret-emoji">🐾</span>
    `;

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.appendChild(message);
    } else {
        document.body.appendChild(message);
    }

    // Subtle particle burst
    createParticleBurst();

    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => message.remove(), 600);
    }, 3000);
}

function createParticleBurst() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const colors = ['#ff91c2', '#ffb7d5', '#ffd1e1', '#ffffff'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('floating-particle');

            const angle = (Math.PI * 2 / 30) * i + Math.random() * 0.5;
            const velocity = Math.random() * 80 + 40;
            const endX = Math.cos(angle) * velocity;
            const endY = Math.sin(angle) * velocity;
            const size = Math.random() * 4 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                animation: particleFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                --endX: ${endX}px;
                --endY: ${endY}px;
            `;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }, i * 15);
    }
}

// --- Lightbox Functionality ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

// Open Lightbox
document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling issues
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        document.body.style.overflow = 'hidden'; // Disable background scroll
    });
});

// Close Lightbox (Button)
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    });
}

// Close Lightbox (Background Click)
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}
