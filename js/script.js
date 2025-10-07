// script.js - Simple and Robust
console.log('Script loaded - starting initialization');

// Wait for DOM to be fully ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing mobile navigation');
    initMobileNavigation();
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

// Auto-update dates function
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing date updates...');
    updateAllDates();
    
    // Also update dates when page fully loads (in case of dynamic content)
    window.addEventListener('load', function() {
        console.log('Page fully loaded - updating dates');
        updateAllDates();
    });
});