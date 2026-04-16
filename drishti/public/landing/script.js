// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// COVER-FIT DRAW FOR CANVAS (object-fit:cover equivalent)
// ==========================================
function drawCover(ctx, img, cw, ch) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const ox = (cw - nw) / 2;
    const oy = (ch - nh) / 2;
    ctx.drawImage(img, ox, oy, nw, nh);
}

// ==========================================
// NAVBAR & PARTICLES THEME HANDLING
// ==========================================
ScrollTrigger.create({
    trigger: ".sec-features",
    start: "top 10%",
    end: "bottom 5%",
    onEnter: () => {
        document.querySelector('.navbar').classList.add('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '0';
    },
    onLeaveBack: () => {
        document.querySelector('.navbar').classList.remove('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '1';
    },
    onEnterBack: () => {
        document.querySelector('.navbar').classList.add('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '0';
    },
    onLeave: () => {
        document.querySelector('.navbar').classList.remove('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '1';
    },
});

ScrollTrigger.create({
    trigger: ".sec-faq",
    start: "top 30%",
    onEnter: () => {
        document.querySelector('.navbar').classList.add('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '0';
    },
    onLeaveBack: () => {
        document.querySelector('.navbar').classList.remove('light-theme-nav');
        document.getElementById('particles-canvas').style.opacity = '1';
    }
});


// ==========================================
// HERO 3D CANVAS & Q&A INFOGRAPHICS
// ==========================================
(function() {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const frameCount = 160;
    const currentFrame = index => (
        `ezgif-59ef5be8b28bea7a-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );
    
    const images = [];
    const sequence = { frame: 0 };
    
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = images[sequence.frame];
        if (img && img.complete && img.naturalWidth > 0) {
            drawCover(ctx, img, canvas.width, canvas.height);
        }
    }
    
    if(images[0]) {
        images[0].onload = render;
    }
    
    const scrollEnd = 6000;
    
    gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".sec-hero",
            start: "top top",
            end: `+=${scrollEnd}`,
            pin: true,
            scrub: 1.5
        },
        onUpdate: render
    });
    
    // Select ONLY hero infographic items (not chain-info)
    const texts = gsap.utils.toArray(".sec-hero .infographic-item");
    
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".sec-hero",
            start: "top top",
            end: `+=${scrollEnd}`,
            scrub: 1
        }
    });

    // Fade out hero static content after a bit
    heroTl.to(".hero-content-static", { opacity: 0, y: -50, duration: 0.5 }, 0.3);
    
    // Stagger infographics perfectly across the 6000px scroll
    // 10 items spread across timeline positions
    texts.forEach((text, i) => {
        const startPos = (i * 1.4) + 0.8;
        heroTl.fromTo(text, 
            { opacity: 0, y: 60, scale: 0.95 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 
            startPos
        )
        .to(text, 
            { opacity: 0, y: -40, scale: 1.02, duration: 0.5 }, 
            startPos + 0.9
        );
    });
})();

// ==========================================
// FEATURES SECTION ANIMATIONS
// ==========================================
(function() {
    // Animate features header
    gsap.from(".features-header", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".sec-features",
            start: "top 80%",
        }
    });

    // Stagger animate bento cards with cinematic entrance
    const cards = gsap.utils.toArray(".bento-card");
    cards.forEach((card, i) => {
        gsap.from(card, {
            y: 80,
            opacity: 0,
            scale: 0.92,
            rotateX: 8,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            }
        });
    });

    // Animate SVG chart line drawing
    const chartPath = document.querySelector(".fake-chart path:nth-child(2)");
    if (chartPath) {
        const len = chartPath.getTotalLength();
        chartPath.style.strokeDasharray = len;
        chartPath.style.strokeDashoffset = len;
        gsap.to(chartPath, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: chartPath,
                start: "top 80%"
            }
        });
    }
})();


// ==========================================
// SECTION 2: VERTICAL CHAIN CANVAS
// ==========================================
(function() {
    const canvas = document.getElementById("chain-canvas");
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const frameCount = 160;
    const currentFrame = index => (
        `ezgif-35273fb4885ff593-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );
    
    const images = [];
    const chainData = { frame: 0 };
    
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = images[chainData.frame];
        if (img && img.complete && img.naturalWidth > 0) {
            drawCover(ctx, img, canvas.width, canvas.height);
        }
    }
    
    if(images[0]) {
        images[0].onload = render;
    }

    const scrollEndChain = 4000;
    
    gsap.to(chainData, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".sec-chain",
            start: "top top",
            end: `+=${scrollEndChain}`,
            pin: true,
            scrub: 1.5
        },
        onUpdate: render
    });

    // Select ONLY chain infographic items
    const chainTexts = gsap.utils.toArray(".chain-info");
    const chainTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".sec-chain",
            start: "top top",
            end: `+=${scrollEndChain}`,
            scrub: 1
        }
    });

    chainTl.to(".chain-intro", { opacity: 0, y: -50, duration: 0.5 }, 0.3);
    
    chainTexts.forEach((text, i) => {
        const startPos = (i * 1.8) + 0.8;
        
        // Dynamic placement to dodge the chain in the center
        // Toggles between top (20vh) and bottom (75vh) positions.
        const isTop = i % 2 === 0;
        text.style.top = isTop ? '20vh' : '75vh';

        chainTl.fromTo(text, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 
            startPos
        )
        .to(text, 
            { opacity: 0, scale: 1.05, duration: 0.6 }, 
            startPos + 1.2
        );
    });

})();

// ==========================================
// BACKGROUND 3D PARTICLES ENGINE
// ==========================================
(function() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let width, height, particles = [];

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 250; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.1
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(177, 66, 255, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    
    init(); animate();
    window.addEventListener('resize', init);
    // Show particles on load (since hero is dark)
    setTimeout(() => canvas.style.opacity = '1', 100);
})();

// ==========================================
// 3D CAROUSEL STACKED DECK LOGIC
// ==========================================
(function() {
    const cards = document.querySelectorAll('.carousel-card');
    const nextBtn = document.getElementById('carousel-next');
    const realPrevBtn = document.getElementById('carousel-prev');
    
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === currentIndex - 1) {
                card.classList.add('prev');
            } else if (index === currentIndex + 1) {
                card.classList.add('next');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if(realPrevBtn && nextBtn) {
        realPrevBtn.addEventListener('click', () => {
            if (currentIndex > 0) currentIndex--;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) currentIndex++;
            updateCarousel();
        });
        
        // Initialize
        setTimeout(updateCarousel, 100);
    }
})();

// ==========================================
// CINEMATIC SCROLL REVEALS (CTA, PRICING, FAQ)
// ==========================================
(function() {
    // Reveal Pricing Cards via stagger
    gsap.from(".pricing-card", {
        scrollTrigger: {
            trigger: ".sec-subscription",
            start: "top 60%"
        },
        y: 100,
        opacity: 0,
        rotationX: 15,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // Reveal CTA section image and massive wipe
    gsap.from(".cta-visual", {
        scrollTrigger: {
            trigger: ".sec-setup-cta",
            start: "top 60%"
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
    gsap.from(".cta-content", {
        scrollTrigger: {
            trigger: ".sec-setup-cta",
            start: "top 60%"
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
})();

// ==========================================
// INTERACTIVE FAQ LOGIC
// ==========================================
(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(f => f.classList.remove('open'));
            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
                ScrollTrigger.refresh(); // Important to recalculate scroll heights
            }
        });
    });
})();
