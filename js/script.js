// Modern Square Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for same-page anchors
        if (href !== '#') {
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

// Navbar background on scroll
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

// Active link highlighting based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add animation to nav items on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate nav items sequentially
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
    });

    // Initialize active link
    updateActiveNavLink();
});

// Form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Sticky header on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for fade-in animations
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
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-card, .category-card, .value-card, .service-card, .compliance-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Google AdSense auto ad placement
function loadGoogleAdSense() {
    // This function would be called when you're ready to load AdSense
    // Replace with your actual AdSense code
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Load AdSense after page is fully loaded
    setTimeout(loadGoogleAdSense, 2000);
});

// SEO-friendly URL routing (basic)
function updateMetaTags(page) {
    // This function would update meta tags dynamically if using SPA
    // For multi-page site, meta tags are handled in each HTML file
}

// Cookie consent banner (basic implementation)
function checkCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
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
        `;
        banner.innerHTML = `
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <button onclick="acceptCookies()" style="background: #3498db; color: white; border: none; padding: 10px 20px; margin: 0 10px; border-radius: 5px; cursor: pointer;">Accept</button>
            <button onclick="declineCookies()" style="background: transparent; color: white; border: 1px solid white; padding: 10px 20px; margin: 0 10px; border-radius: 5px; cursor: pointer;">Decline</button>
        `;
        document.body.appendChild(banner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.querySelector('div[style*="position: fixed; bottom: 0"]').remove();
}

function declineCookies() {
    // Handle cookie decline
    document.querySelector('div[style*="position: fixed; bottom: 0"]').remove();
}

// Initialize cookie consent check
checkCookieConsent();
function loadLogo() {
    const logo = document.querySelector('.nav-logo img');
    if (logo) {
        // Force reload the image source
        const originalSrc = logo.src;
        logo.src = '';
        logo.src = originalSrc;
        
        // Add fallback if image fails to load
        logo.onerror = function() {
            console.log('Logo failed to load, using fallback');
            this.style.display = 'none';
            // You could add a text fallback here
        };
        
        logo.onload = function() {
            console.log('Logo loaded successfully');
            this.style.visibility = 'visible';
            this.style.opacity = '1';
        };
    }
}

// Call when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadLogo();
});
// Enhance clickable links for mobile
function enhanceClickableLinks() {
    // Add click events for better mobile UX
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

// Call this function when page loads
document.addEventListener('DOMContentLoaded', function() {
    enhanceClickableLinks();
});

// Auto-update copyright year
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/2024/, currentYear);
    }
});
// Auto-update last updated date
function updateLastUpdatedDate() {
    const lastUpdatedElements = document.querySelectorAll('.compliance-intro p:first-child');
    
    lastUpdatedElements.forEach(element => {
        if (element.textContent.includes('Last updated:')) {
            const currentDate = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            element.textContent = `Last updated: ${formattedDate}`;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateLastUpdatedDate();
    updateCopyrightYear(); // Make sure this function exists for copyright year
});
