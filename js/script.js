// script.js - Cleaned and Optimized Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initNavbarScrollEffect();
    initAnimations();
    initFormHandling();
    initImageLoading();
    initCookieConsent();
    initUtilities();
});

// 1. Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// 2. Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 3. Navbar Scroll Effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'var(--card-bg)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.borderBottom = 'none';
        }
    });
}

// 4. Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .category-card, .value-card, .service-card, .compliance-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 5. Form Handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const subject = document.getElementById('subject')?.value;
        const message = document.getElementById('message')?.value;
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Success message
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// 6. Image Loading
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Handle already loaded images
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Special handling for logo
    const logo = document.querySelector('.nav-logo img');
    if (logo) {
        logo.onerror = function() {
            console.log('Logo failed to load');
            this.style.display = 'none';
        };
    }
}

// 7. Cookie Consent
function initCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #2c3e50;
                color: white;
                padding: 20px;
                text-align: center;
                z-index: 1000;
                font-family: inherit;
            `;
            banner.innerHTML = `
                <p style="margin-bottom: 15px;">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <button onclick="acceptCookies()" style="background: #3498db; color: white; border: none; padding: 10px 20px; margin: 0 10px; border-radius: 5px; cursor: pointer;">Accept</button>
                <button onclick="declineCookies()" style="background: transparent; color: white; border: 1px solid white; padding: 10px 20px; margin: 0 10px; border-radius: 5px; cursor: pointer;">Decline</button>
            `;
            document.body.appendChild(banner);
        }, 1000);
    }
}

// 8. Utility Functions
function initUtilities() {
    // Auto-update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/2024|2025/, currentYear);
    }

    // Auto-update last updated date
    const lastUpdatedElements = document.querySelectorAll('.compliance-intro p:first-child');
    lastUpdatedElements.forEach(element => {
        if (element.textContent.includes('Last updated:')) {
            const currentDate = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            element.textContent = `Last updated: ${formattedDate}`;
        }
    });

    // Enhance mobile touch interactions
    enhanceClickableLinks();
}

// 9. Mobile Touch Enhancements
function enhanceClickableLinks() {
    const clickableLinks = document.querySelectorAll('.clickable-link');
    
    clickableLinks.forEach(link => {
        link.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        link.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Cookie functions (must be global)
window.acceptCookies = function() {
    localStorage.setItem('cookiesAccepted', 'true');
    const banner = document.querySelector('div[style*="position: fixed; bottom: 0"]');
    if (banner) banner.remove();
}

window.declineCookies = function() {
    localStorage.setItem('cookiesAccepted', 'false');
    const banner = document.querySelector('div[style*="position: fixed; bottom: 0"]');
    if (banner) banner.remove();
}

// Optional: Google AdSense (uncomment and add your client ID)
function loadGoogleAdSense() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4252166289270815';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

window.addEventListener('load', function() {
    setTimeout(loadGoogleAdSense, 2000);
});
