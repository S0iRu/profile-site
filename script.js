document.addEventListener('DOMContentLoaded', () => {
    // 1. Glow Cursor (Background light)
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Color Cycling Variables
    let hue = 200; // Start with blue-ish

    // --- 3. Auto-Scaling Logic ---
    function adjustScale() {
        const card = document.querySelector('.profile-card');
        if (!card) return;

        // Reset scale to measure natural size
        card.style.zoom = '1';

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Measure card dimensions *without* scaling
        // (zoom affects offsetWidth/Height, but scrollWidth might differ)
        // Best to use offsetWidth here now that transform is gone
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;

        // Calculate scale factor to fit
        const scaleX = (windowWidth * 0.9) / cardWidth; // 90% scaling
        const scaleY = (windowHeight * 0.9) / cardHeight;

        // Use the smaller scale to fit both
        let scale = Math.min(scaleX, scaleY);

        // Limit maximum scale (optional, prevent getting HUGE)
        if (scale > 1.2) scale = 1.2;

        // Apply scale using ZOOM for crisp text
        card.style.zoom = scale;
    }

    // Initial scale on load
    window.addEventListener('load', adjustScale);
    // Scale on resize
    window.addEventListener('resize', adjustScale);


    // --- Mouse & Touch Events ---
    function handleMove(x, y) {
        mouseX = x;
        mouseY = y;

        // Particle Trail
        const currentColor = `hsl(${hue}, 80%, 65%)`;
        createParticle(mouseX, mouseY, currentColor);
    }

    document.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        // Prevent default touch scrolling if we want to treat it like a canvas
        // But users might need to scroll if content > viewport (though we scaled it to fit)
        // Since we scale to fit, we can prevent default to stop rubber-banding
        // e.preventDefault(); 
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    }, { passive: true }); // passive true ensures scrolling performance if we allow it

    // Click/Touch Burst Effect
    function handleBurst(x, y) {
        const currentColor = `hsl(${hue}, 80%, 65%)`;
        const burstColor = `hsl(${hue}, 100%, 80%)`;
        for (let i = 0; i < 12; i++) {
            createParticle(x, y, burstColor, true);
        }

        cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(0.8)`;
        setTimeout(() => {
            cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
        }, 100);
    }

    document.addEventListener('mousedown', (e) => {
        handleBurst(e.clientX, e.clientY);
    });

    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        // Move cursor to touch start immediately
        cursorX = touch.clientX;
        cursorY = touch.clientY;
        handleBurst(touch.clientX, touch.clientY);
    }, { passive: true });

    // Animation Loop
    function animate() {
        const speed = 0.12; // slightly smoother
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        // Cycle Hue
        hue += 0.5; // Speed of color change
        if (hue > 360) hue = 0;

        // Apply color to cursor glow
        cursorGlow.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 60%, 0.5) 0%, transparent 70%)`;

        requestAnimationFrame(animate);
    }
    animate();
});

function createParticle(x, y, color, isBurst = false) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // Size
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Position
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Apply synchronized color
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    // Velocity
    // Valid spread depends on whether it's a trail or a burst
    const spread = isBurst ? 80 : 20;
    const destinationX = (Math.random() - 0.5) * spread;
    const destinationY = (Math.random() - 0.5) * spread;

    particle.style.setProperty('--tx', `${destinationX}px`);
    particle.style.setProperty('--ty', `${destinationY}px`);

    // Animation Duration
    const duration = isBurst ? (Math.random() * 0.5 + 0.5) : (Math.random() * 0.5 + 0.8);
    particle.style.animationDuration = `${duration}s`;

    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}
