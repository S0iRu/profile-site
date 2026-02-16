

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
    rootMargin: '100px 0px', // Trigger 100px before entering viewport
    threshold: 0.01 // Trigger when just 1% is visible
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
let totalEasterEggCount = 0;

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
    totalEasterEggCount++;

    // Determine rarity ONCE for this trigger (20% chance after 5th trigger)
    // Determine rarity ONCE for this trigger (20% chance after 5th trigger)
    const isRare = totalEasterEggCount >= 5 && Math.random() < 0.2;

    // Get avatar center position
    const rect = avatarImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create massive burst
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createSakuraPetal(centerX, centerY, isRare); // Pass isRare
        }, i * 10); // Faster burst
    }

    // Show secret message
    showSecretMessage(isRare); // Pass isRare

    // Make avatar spin
    if (isRare) {
        avatarImg.style.animation = 'avatarSpinRare 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // Dynamic "back" easing
    } else {
        avatarImg.style.animation = 'avatarSpin 1s ease-in-out';
    }

    // Reset active state after animation
    const animDuration = isRare ? 1500 : 1000;
    setTimeout(() => {
        isEasterEggActive = false;
        avatarImg.style.animation = 'none'; // Cleanup
    }, animDuration);
}

function createSakuraPetal(startX, startY, isHeart) {
    const petal = document.createElement('div');

    // Config based on type
    if (isHeart) {
        petal.classList.add('easter-heart');
        petal.textContent = '❤';
    } else {
        petal.classList.add('easter-petal');
    }

    document.body.appendChild(petal);

    // Make hearts slightly larger than petals
    const size = isHeart
        ? Math.random() * 20 + 15  // Hearts: 15px - 35px
        : Math.random() * 15 + 8;  // Petals: 8px - 23px

    // Random direction and distance for burst
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 500 + 200; // Wider burst
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity + 100; // Add some gravity (downward bias)
    const rotation = Math.random() * 720;
    const duration = Math.random() * 1.5 + 1;

    const colors = ['#ff91c2', '#ffb7d5', '#ffd1e1', '#fff0f5', '#ffcce6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Apply styles
    // Note: For hearts, 'background' should be transparent and 'color' set. 
    // For petals, 'background' is set. 
    // We use common logic but adjust via ternary or specific props.

    petal.style.cssText = `
        position: fixed;
        width: ${isHeart ? 'auto' : size + 'px'};
        height: ${isHeart ? 'auto' : size + 'px'};
        font-size: ${size}px; /* Only affects hearts */
        background: ${isHeart ? 'transparent' : color};
        color: ${color}; /* Only affects hearts */
        border-radius: ${isHeart ? '0' : '100% 0 100% 0'};
        left: ${startX}px;
        top: ${startY}px;
        pointer-events: none;
        z-index: 100; /* On top of avatar */
        opacity: 0; /* Start invisible, fade in */
        animation: petalBurst ${duration}s ease-out forwards;
        --endX: ${endX}px;
        --endY: ${endY}px;
        --rot: ${rotation}deg;
    `;

    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

function showSecretMessage(isRare) {
    // Remove existing message if any
    const existing = document.querySelector('.secret-message');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.classList.add('secret-message');

    // Message selection was calculated in triggerEasterEgg and passed in
    // const isRare = totalEasterEggCount >= 5 && Math.random() < 0.2; (Removed)
    const text = isRare ? 'えへっ！そいそいのことそんなにすきなのぉ～？' : 'そいそいだよぉ～っ！';
    const emoji = isRare ? '💖' : '🐾'; // Optional: change emoji too for variety

    // Calculate font size adjustment if rare message (longer)
    const extraClass = isRare ? ' rare-msg' : '';

    const emojiSpan1 = document.createElement('span');
    emojiSpan1.className = 'secret-emoji';
    emojiSpan1.textContent = emoji;

    const textSpan = document.createElement('span');
    textSpan.className = 'secret-text' + extraClass;
    textSpan.textContent = text;

    const emojiSpan2 = document.createElement('span');
    emojiSpan2.className = 'secret-emoji';
    emojiSpan2.textContent = emoji;

    message.appendChild(emojiSpan1);
    message.appendChild(textSpan);
    message.appendChild(emojiSpan2);

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

// --- Gallery System & Lightbox ---
const galleryConfig = {
    apiKey: 'AIzaSyB1omQ9Bwj3sdgAFzVzmBRocNItRZDH1bU',
    parentFolderId: '1foag51qpEAKVIxow4QzEzjrFIERPiylQ',
    useDrive: true,
    localImages: [
        'images/g1.jpg',
        'images/g2.png',
        'images/g3.png'
    ]
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function initGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const isMobile = window.innerWidth <= 768;
    const colCount = isMobile ? 1 : 2;
    const columns = [];

    // Create Columns
    for (let i = 0; i < colCount; i++) {
        const col = document.createElement('div');
        col.className = 'gallery-col';
        col.style.transitionDelay = `${i * 0.1}s`;
        container.appendChild(col);
        columns.push(col);
    }

    let images = [];

    // Fetch from Drive if configured
    if (galleryConfig.useDrive && galleryConfig.apiKey && galleryConfig.parentFolderId) {
        try {
            const driveImages = await fetchDriveImages();
            images = driveImages.length > 0 ? driveImages : galleryConfig.localImages;
        } catch (error) {
            console.error('Failed to load Drive images:', error);
            images = galleryConfig.localImages; // Fallback
        }
    } else {
        images = galleryConfig.localImages;
    }

    // Shuffle images randomly
    images = shuffleArray(images);

    // Calculate column heights for true masonry
    const colHeights = new Array(colCount).fill(0);

    // Add Images to Columns
    images.forEach((imgData) => {
        const src = typeof imgData === 'string' ? imgData : imgData.src;
        const fullSrc = typeof imgData === 'object' && imgData.fullSrc ? imgData.fullSrc : src;
        const aspectRatio = typeof imgData === 'object' && imgData.ratio ? imgData.ratio : 1;

        const item = document.createElement('div');
        item.className = 'gallery-item loading';
        
        // Set aspect ratio for skeleton placeholder
        if (aspectRatio) {
            item.style.aspectRatio = aspectRatio;
        }

        const img = document.createElement('img');
        img.src = src;
        img.className = 'gallery-img';
        img.loading = 'lazy';
        img.alt = 'Gallery Image';
        img.decoding = 'async'; // Non-blocking decode

        // Fade in when loaded
        img.onload = () => {
            item.classList.remove('loading');
            item.classList.add('loaded');
            // Remove fixed aspect ratio after load to use natural size
            item.style.aspectRatio = '';
        };

        // Lightbox Trigger (pass both thumbnail and full resolution)
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(fullSrc, src);
        });

        // Preload full image on hover (desktop) or touchstart (mobile)
        item.addEventListener('mouseenter', () => {
            preloadImage(fullSrc);
        }, { passive: true });
        item.addEventListener('touchstart', () => {
            preloadImage(fullSrc);
        }, { passive: true });

        item.appendChild(img);

        // True Masonry: Add to shortest column
        const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
        columns[shortestColIndex].appendChild(item);

        // Estimate height contribution (width is equal, so height depends on aspect ratio)
        // aspectRatio = width/height, so height contribution = 1/aspectRatio
        const heightContribution = typeof aspectRatio === 'number' ? 1 / aspectRatio : 1;
        colHeights[shortestColIndex] += heightContribution;
    });
}

async function fetchDriveImages() {
    const allFiles = [];
    const { apiKey, parentFolderId } = galleryConfig;

    console.log('Fetching images from Drive...');

    // Step 1: Get subfolders (横, 縦, etc.)
    const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false&fields=files(id, name)&key=${apiKey}`;
    
    let folderIds = [];
    try {
        const foldersResponse = await fetch(foldersUrl);
        console.log('Folders API status:', foldersResponse.status);
        
        if (foldersResponse.ok) {
            const foldersData = await foldersResponse.json();
            console.log('Subfolders found:', foldersData.files);
            folderIds = foldersData.files ? foldersData.files.map(f => f.id) : [];
        } else {
            const errorData = await foldersResponse.json();
            console.error('Folders API error:', errorData);
        }
    } catch (e) {
        console.error('Failed to fetch subfolders:', e);
    }

    // If no subfolders found, try the parent folder directly
    if (folderIds.length === 0) {
        console.log('No subfolders, trying parent folder directly');
        folderIds = [parentFolderId];
    }

    // Step 2: Get images from each folder (with pagination for large folders)
    for (const folderId of folderIds) {
        let pageToken = null;
        
        do {
            let url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and mimeType contains 'image/' and trashed = false&fields=files(id,name,mimeType,imageMediaMetadata),nextPageToken&key=${apiKey}&pageSize=100&orderBy=createdTime desc`;
            
            if (pageToken) {
                url += `&pageToken=${pageToken}`;
            }
            
            try {
                const response = await fetch(url);
                console.log('Images API status for folder:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Images API error:', errorData);
                    break;
                }
                
                const data = await response.json();
                console.log('Images found in this batch:', data.files?.length || 0);
                
                if (data.files) {
                    allFiles.push(...data.files);
                }
                
                pageToken = data.nextPageToken;
            } catch (e) {
                console.error('Failed to fetch images:', e);
                break;
            }
        } while (pageToken);
    }

    console.log('Total images found:', allFiles.length);

    // Convert to usable format
    // Use responsive lightbox size: mobile gets w800, desktop gets w1600
    const isMobileDevice = window.innerWidth <= 768;
    const lightboxWidth = isMobileDevice ? 800 : 1600;

    return allFiles.map(file => {
        // Use smaller thumbnail with WebP for faster loading
        // w500 is sufficient for gallery cards, -rw converts to WebP format
        const src = `https://lh3.googleusercontent.com/d/${file.id}=w500-rw`;
        // Responsive full size for lightbox (WebP for faster loading)
        const fullSrc = `https://lh3.googleusercontent.com/d/${file.id}=w${lightboxWidth}-rw`;
        
        // Calculate aspect ratio if metadata exists
        let ratio = 1;
        if (file.imageMediaMetadata) {
            const { width, height } = file.imageMediaMetadata;
            if (width && height) {
                ratio = width / height;
            }
        }
        
        return { src, fullSrc, ratio };
    });
}

let lightboxScrollY = 0;

function lockBodyScroll() {
    lightboxScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lightboxScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, lightboxScrollY);
}

// Image preload cache to avoid duplicate requests
const preloadCache = new Set();

function preloadImage(src) {
    if (preloadCache.has(src)) return;
    preloadCache.add(src);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
}

function openLightbox(fullSrc, thumbSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const spinner = document.getElementById('lightbox-spinner');
    if (!lightbox || !lightboxImg) return;

    lightbox.style.display = 'flex';
    lockBodyScroll();

    // Step 1: Immediately show the thumbnail (already cached by browser)
    if (thumbSrc) {
        lightboxImg.src = thumbSrc;
        lightboxImg.style.visibility = 'visible';
        lightboxImg.classList.add('loading-hires');
    } else {
        lightboxImg.style.visibility = 'hidden';
    }

    // Show spinner while high-res loads
    if (spinner) spinner.classList.add('active');

    // Step 2: Load full resolution in background, then swap
    const hiRes = new Image();
    hiRes.onload = () => {
        lightboxImg.src = fullSrc;
        lightboxImg.style.visibility = 'visible';
        lightboxImg.classList.remove('loading-hires');
        if (spinner) spinner.classList.remove('active');
    };
    hiRes.onerror = () => {
        // On error, keep thumbnail visible
        lightboxImg.style.visibility = 'visible';
        lightboxImg.classList.remove('loading-hires');
        if (spinner) spinner.classList.remove('active');
    };
    hiRes.src = fullSrc;

    // If already cached, swap immediately
    if (hiRes.complete) {
        lightboxImg.src = fullSrc;
        lightboxImg.style.visibility = 'visible';
        lightboxImg.classList.remove('loading-hires');
        if (spinner) spinner.classList.remove('active');
    }
}

// Lightbox Controls
const lightbox = document.getElementById('lightbox');
const closeBtn = document.querySelector('.lightbox-close');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        closeLightbox();
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener('touchend', (e) => {
        if (e.target === lightbox) {
            e.preventDefault();
            closeLightbox();
        }
    }, { passive: false });
}

function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = 'none';
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.onload = null;
            lightboxImg.onerror = null;
            lightboxImg.src = '';
            lightboxImg.style.visibility = 'hidden';
            lightboxImg.classList.remove('loading-hires');
        }
        const spinner = document.getElementById('lightbox-spinner');
        if (spinner) spinner.classList.remove('active');
        unlockBodyScroll();
    }
}

// Initialize Gallery
document.addEventListener('DOMContentLoaded', initGallery);

// Handle Resize
let resizeTimer;
let lastIsMobile = window.innerWidth <= 768;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile !== lastIsMobile) {
            lastIsMobile = isMobile;
            initGallery();
        }
    }, 300);
});
