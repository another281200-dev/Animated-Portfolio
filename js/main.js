// Image Sequence Logic
const frameCount = 300;
const images = new Array(frameCount).fill(null);
let currentFrameIndex = 0;

const currentFrame = index => (
    `krishna anime clip/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const canvas = document.getElementById("scroll-animation");
const context = canvas.getContext("2d");

const renderImage = (index) => {
    const img = images[index];
    if (!img || !img.complete || img.naturalHeight === 0) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const x = (canvas.width / 2) - (img.naturalWidth / 2) * scale;
    const y = (canvas.height / 2) - (img.naturalHeight / 2) * scale;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
};

// Load images
let loadedCount = 0;
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (i === 0) renderImage(0);
    };
    images[i] = img;
}

// Initialize GSAP & Preloader
window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Preloader Animation (Smoother eases)
    const tlPreloader = gsap.timeline();
    
    tlPreloader.to("#preloader-progress", {
        width: "100%", duration: 1.2, ease: "power3.inOut"
    })
    .to(".preloader-letter", {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power4.out"
    }, "-=0.4")
    .to("#preloader", {
        yPercent: -100, duration: 1.2, ease: "expo.inOut", delay: 0.4
    })
    .from(".hero-text", {
        y: "120%", rotation: 5, opacity: 0, duration: 1.6, stagger: 0.15, ease: "power4.out", transformOrigin: "left top"
    }, "-=0.6")
    .to("#hero-subtitle", {
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out"
    }, "-=1")
    .to("#navbar", {
        opacity: 1, duration: 1
    }, "-=1");

    // MatchMedia for Responsive Scroll & Animations
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
        // Desktop: Slower scrub for buttery smooth canvas play
        const playhead = { frame: 0 };
        gsap.to(playhead, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5 // Buttery smooth scrub
            },
            onUpdate: () => {
                currentFrameIndex = Math.round(playhead.frame);
                renderImage(currentFrameIndex);
            }
        });

        // Smooth stagger fade-ins for bento boxes and sections
        gsap.utils.toArray('.section-header').forEach(el => {
            gsap.from(el, {
                y: 80, opacity: 0, scale: 0.95, duration: 1.4, ease: "power4.out",
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
            });
        });

        gsap.utils.toArray('.about-el').forEach(el => {
            gsap.from(el, {
                y: 80, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.2,
                scrollTrigger: { trigger: ".about-layout", start: "top 80%", toggleActions: "play none none reverse" }
            });
        });

        gsap.utils.toArray('.bento-el').forEach(el => {
            gsap.from(el, {
                y: 80, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.15,
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
            });
        });
    });

    mm.add("(max-width: 767px)", () => {
        // Mobile: Faster scrub, simpler animations for performance
        const playhead = { frame: 0 };
        gsap.to(playhead, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5 // Faster response on touch
            },
            onUpdate: () => {
                currentFrameIndex = Math.round(playhead.frame);
                renderImage(currentFrameIndex);
            }
        });

        // Simpler fade for mobile
        gsap.utils.toArray('.section-header, .about-el, .bento-el').forEach(el => {
            gsap.from(el, {
                y: 40, opacity: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" }
            });
        });
    });
});

// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');

if (cursor && follower) {
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });
    
    const cursorX = gsap.quickTo(cursor, "x", {duration: 0, ease: "none"});
    const cursorY = gsap.quickTo(cursor, "y", {duration: 0, ease: "none"});
    
    const followerX = gsap.quickTo(follower, "x", {duration: 0.4, ease: "power3.out"});
    const followerY = gsap.quickTo(follower, "y", {duration: 0.4, ease: "power3.out"});

    window.addEventListener('mousemove', (e) => {
        cursorX(e.clientX);
        cursorY(e.clientY);
        followerX(e.clientX);
        followerY(e.clientY);
    });

    const interactiveElements = document.querySelectorAll('a, button, .pill-btn, .download-btn, .hover-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// Mouse Interactive Glow
const mouseGlow = document.getElementById("mouse-glow");
window.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
        mouseGlow.style.opacity = 1;
        gsap.to(mouseGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: "power2.out"
        });
    }
});
window.addEventListener('mouseleave', () => {
    if (mouseGlow) mouseGlow.style.opacity = 0;
});

// Form Validation Logic
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const msgInput = document.getElementById('message');
        
        const showError = (input, msg) => {
            const group = input.parentElement;
            const errorEl = group.querySelector('.form-error');
            if (errorEl) {
                errorEl.innerText = msg;
                errorEl.classList.add('visible');
            }
            input.classList.add('error');
            isValid = false;
        };

        const clearErrors = () => {
            document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
            document.querySelectorAll('.input-field').forEach(el => el.classList.remove('error'));
        };
        
        clearErrors();

        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
        }
        
        if (msgInput.value.trim().length < 10) {
            showError(msgInput, 'Message must be at least 10 characters');
        }

        if (isValid) {
            const btnTextInner = contactForm.querySelector('.pill-text-inner span:first-child');
            if (btnTextInner) {
                const originalText = btnTextInner.innerText;
                btnTextInner.innerText = 'Sent Successfully!';
                btnTextInner.style.color = 'var(--accent)';
                
                contactForm.reset();
                setTimeout(() => {
                    btnTextInner.innerText = originalText;
                    btnTextInner.style.color = '';
                }, 3000);
            }
        }
    });
}

window.addEventListener('resize', () => requestAnimationFrame(() => renderImage(currentFrameIndex)));

// Typewriter Effect for About Section
const codeSnippet = `const krishna = new Developer({
  focus: ['Frontend Magic', 'Robust Backend'],
  skills: ['React', 'Node.js', 'GSAP'],
  drive: Infinity
});

krishna.code.until(Bug.count === 0);
krishna.deploy(); // 🚀`;

const typewriterText = document.getElementById('typewriter-text');
let charIndex = 0;

function typeWriter() {
    if (typewriterText && charIndex < codeSnippet.length) {
        typewriterText.textContent += codeSnippet.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, Math.random() * 50 + 50);
    } else if (typewriterText && charIndex >= codeSnippet.length) {
        setTimeout(() => {
            typewriterText.textContent = '';
            charIndex = 0;
            typeWriter();
        }, 5000);
    }
}

if (typewriterText) {
    ScrollTrigger.create({
        trigger: ".about-visual",
        start: "top 80%",
        onEnter: () => {
            if (charIndex === 0) {
                setTimeout(typeWriter, 500);
            }
        }
    });
}


// Magnetic Buttons & Links Logic
const magneticElements = document.querySelectorAll('.pill-btn, .download-btn, .hover-link, .nav-logo');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        
        gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: 'power3.out' });
        
        const innerText = el.querySelector('.pill-text, .hover-link-inner, .download-icon');
        if (innerText) {
            gsap.to(innerText, { x: x * 0.2, y: y * 0.2, duration: 0.6, ease: 'power3.out' });
        }
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        const innerText = el.querySelector('.pill-text, .hover-link-inner, .download-icon');
        if (innerText) {
            gsap.to(innerText, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        }
    });
});

// 3D Tilt for Bento Cards
const bentoCards = document.querySelectorAll('.bento-card, .contact-box');
bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    });
});
