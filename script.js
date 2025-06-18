// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form Validation
function validateForm(formData) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.get('name')?.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!formData.get('email')?.trim()) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.get('email'))) {
        errors.email = 'Please enter a valid email';
    }
    
    if (!formData.get('message')?.trim()) {
        errors.message = 'Message is required';
    }
    
    return errors;
}

function showFormError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    const inputElement = document.querySelector(`[name="${field}"]`);
    const existingError = inputElement.parentElement.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    inputElement.parentElement.appendChild(errorElement);
    inputElement.classList.add('error');
}

function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('show');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Navbar Shadow Change on Scroll (Debounced)
const updateNavbarShadow = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 8px 32px 0 rgba(31,38,135,0.12)';
    }
}, 100);

window.addEventListener('scroll', updateNavbarShadow);

// Animate Service Cards on Scroll with Intersection Observer
const observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Enhanced Form Submission Handling
const contactForm = document.querySelector('.contact-form');
const submitButton = document.querySelector('.submit-button');

async function handleFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        // Display validation errors
        Object.entries(errors).forEach(([field, message]) => {
            showFormError(field, message);
        });
        return;
    }
    
    try {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Here you would typically send the data to your server
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        contactForm.insertBefore(successMessage, contactForm.firstChild);
        
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.textContent = 'An error occurred. Please try again later.';
        contactForm.insertBefore(errorMessage, contactForm.firstChild);
        
    } finally {
        submitButton.innerHTML = 'Send Message';
        submitButton.disabled = false;
    }
}

contactForm.addEventListener('submit', handleFormSubmit);

// Lazy Loading for Portfolio Images
function loadPortfolioImages() {
    const portfolioItems = [
        {
            title: 'E-commerce Platform',
            category: 'Web Development',
            image: 'assets/images/portfolio/ecommerce.jpg'
        },
        {
            title: 'Mobile Banking App',
            category: 'App Development',
            image: 'assets/images/portfolio/banking.jpg'
        },
        {
            title: 'Data Analytics Dashboard',
            category: 'Data Science',
            image: 'assets/images/portfolio/analytics.jpg'
        }
    ];
    
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (!portfolioGrid) return;
    
    portfolioItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                 data-src="${item.image}" 
                 alt="${item.title}"
                 loading="lazy">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Initialize lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    loadPortfolioImages();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
}); 