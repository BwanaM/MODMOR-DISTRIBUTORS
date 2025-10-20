// script.js - Simple and Robust
console.log('Script loaded - starting initialization');

// Wait for DOM to be fully ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing all features');
    initMobileNavigation();
    initNavigationHighlighting();
    initDateUpdates();
});

function initMobileNavigation() {
    console.log('Initializing mobile navigation...');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Hamburger found:', hamburger);
    console.log('Nav menu found:', navMenu);
    
    if (!hamburger) {
        console.error('Hamburger button not found!');
        return;
    }
    
    if (!navMenu) {
        console.error('Navigation menu not found!');
        return;
    }

    // Remove any existing event listeners by cloning and replacing
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);

    // Add click event to hamburger
    newHamburger.addEventListener('click', function(e) {
        console.log('Hamburger clicked');
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navMenu.classList.contains('active');
        console.log('Current state - active:', isActive);
        
        // Toggle classes
        newHamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('Menu closed');
        }
    });

    // Close menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Nav links found:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Nav link clicked - closing menu');
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !newHamburger.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                console.log('Clicked outside - closing menu');
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('Escape key pressed - closing menu');
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('Mobile navigation initialized successfully');
}

// Navigation highlighting function
function initNavigationHighlighting() {
    console.log('Initializing navigation highlighting...');
    
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Only target navigation links inside .nav-item to exclude the logo
        const navLinks = document.querySelectorAll('.nav-item .nav-link');
        
        console.log('Current page:', currentPage);
        console.log('Navigation links found:', navLinks.length);
        
        // Remove active class from all navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            console.log('Checking link:', linkHref);
            
            if (linkHref === currentPage) {
                link.classList.add('active');
                console.log('Active link set to:', linkHref);
            }
            
            // Special handling for home page
            if (currentPage === '' || currentPage === 'index.html' && linkHref === 'index.html') {
                link.classList.add('active');
            }
        });
    }
    
    // Set active page on load
    setActivePage();
    
    // Update active page when navigating (for single page app behavior if needed)
    window.addEventListener('popstate', setActivePage);
    
    console.log('Navigation highlighting initialized');
}

// Auto-update dates function
function initDateUpdates() {
    console.log('Initializing date updates...');
    updateAllDates();
    
    // Also update dates when page fully loads (in case of dynamic content)
    window.addEventListener('load', function() {
        console.log('Page fully loaded - updating dates');
        updateAllDates();
    });
}

function updateAllDates() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    
    if (copyrightElement) {
        // Replace any year pattern (2023, 2024, 2025, etc.)
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\b20\d{2}\b/, currentYear);
        console.log('Copyright year updated to:', currentYear);
    }

    // Update last updated date in compliance section
    const lastUpdatedElements = document.querySelectorAll('.compliance-intro p');
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    
    lastUpdatedElements.forEach(element => {
        if (element.textContent.includes('Last updated') || element.textContent.includes('Last Updated')) {
            element.textContent = `Last updated: ${formattedDate}`;
            console.log('Last updated date set to:', formattedDate);
        }
    });

    // Update any other date elements
    const dateElements = document.querySelectorAll('[data-auto-update-date]');
    dateElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

// Optional: Add smooth scrolling for anchor links
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
// Optional: Add this if you want smooth scrolling
// document.addEventListener('DOMContentLoaded', initSmoothScrolling);
// Add this to your JavaScript
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Scroll progress indicator
window.addEventListener('scroll', function() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    document.querySelector('.scroll-progress').style.width = scrollPercent + '%';
});