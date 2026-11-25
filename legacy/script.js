// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    toastDuration: 3000,
    typingSpeed: 50,
    maxFormSubmits: 3,
    autoSlideInterval: 5000
};

// ============================================
// CLASE PRINCIPAL DE LA APLICACIÓN
// ============================================
class ChurchWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoader();
        this.setupNavbar();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupFormHandling();
        this.setupInteractiveElements();
        this.setupEasterEggs();
        console.log('🙏 Iglesia Adonai de Getsemaní - Website cargado exitosamente');
    }

    setupLoader() {
        window.addEventListener('load', () => {
            const loader = document.getElementById('pageLoader');
            setTimeout(() => {
                loader.classList.add('hidden');
                this.playWelcomeAnimation();
            }, 500);
        });
    }

    setupNavbar() {
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Scroll behavior
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Auto-hide navbar on scroll down (mobile)
            if (window.innerWidth <= 768) {
                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScroll = currentScroll;
        });

        // Menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    setupScrollEffects() {
        // Scroll to top button
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Parallax effect for hero section
        this.setupParallax();

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - CONFIG.scrollOffset;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupParallax() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (!heroContent || !heroImage) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight && window.innerWidth > 768) {
                requestAnimationFrame(() => {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
                });
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Counter animation for statistics
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.ministry-card, .testimonial-card, .event-card, .value-item, .belief-card, .counter'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));

        // Typing animation for hero section
        this.setupTypingAnimation();
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 100;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    setupTypingAnimation() {
        const subtitleElement = document.querySelector('.hero-content .subtitle');
        if (!subtitleElement) return;

        const text = subtitleElement.textContent;
        subtitleElement.textContent = '';
        let index = 0;

        const typeWriter = () => {
            if (index < text.length) {
                subtitleElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, CONFIG.typingSpeed);
            }
        };

        setTimeout(typeWriter, 1000);
    }

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        let submitCount = 0;
        const maxSubmits = CONFIG.maxFormSubmits;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Rate limiting
            if (submitCount >= maxSubmits) {
                this.showToast('Por favor espera un momento antes de enviar otro mensaje', 'error');
                return;
            }

            // Validate form
            if (!this.validateForm(contactForm)) {
                this.showToast('Por favor completa todos los campos requeridos', 'error');
                return;
            }

            // Collect form data
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value,
                timestamp: new Date().toISOString()
            };

            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Simulate API call
            await this.simulateAPICall(1500);

            // Success
            this.showToast('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
            contactForm.reset();
            this.createConfetti();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Update rate limit
            submitCount++;
            setTimeout(() => submitCount = Math.max(0, submitCount - 1), 60000);

            // Log data (in production, send to server)
            console.log('Form submitted:', formData);
        });

        // Real-time validation
        contactForm.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }

        if (isValid) {
            field.classList.remove('error');
            field.style.borderColor = '';
            this.removeErrorMessage(field);
        } else {
            field.classList.add('error');
            field.style.borderColor = '#e74c3c';
            this.showErrorMessage(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showErrorMessage(field, message) {
        this.removeErrorMessage(field);
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
        field.parentElement.appendChild(error);
    }

    removeErrorMessage(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    setupInteractiveElements() {
        // Event cards interaction
        this.setupEventCards();
        
        // Ministry cards interaction
        this.setupMinistryCards();
        
        // Testimonial slider
        this.setupTestimonialSlider();
        
        // Social links tracking
        this.setupSocialTracking();

        // Interactive hover effects
        this.setupHoverEffects();
    }

    setupEventCards() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const eventTitle = card.querySelector('h3')?.textContent || 'Evento';
                const eventDate = card.querySelector('.event-date .day')?.textContent || '';
                const eventMonth = card.querySelector('.event-date .month')?.textContent || '';
                
                this.showEventModal({
                    title: eventTitle,
                    date: `${eventDate} ${eventMonth}`,
                    details: card.querySelector('.event-info p')?.textContent || ''
                });
            });

            // Hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    showEventModal(event) {
        const message = `📅 ${event.title}\n📆 ${event.date}\n\n${event.details}\n\n¿Te gustaría más información?`;
        
        if (confirm(message)) {
            window.location.href = 'contacto.html';
        }
    }

    setupMinistryCards() {
        const ministryCards = document.querySelectorAll('.ministry-card');
        
        ministryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.ministry-image i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'all 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.ministry-image i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    setupTestimonialSlider() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        const cards = slider.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;

        let currentIndex = 0;
        
        // Auto-rotate testimonials
        setInterval(() => {
            cards.forEach((card, index) => {
                card.style.opacity = index === currentIndex ? '1' : '0.5';
                card.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
            });
            
            currentIndex = (currentIndex + 1) % cards.length;
        }, CONFIG.autoSlideInterval);
    }

    setupSocialTracking() {
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = e.currentTarget.querySelector('i')?.className.match(/fa-(\w+)/)?.[1] || 'unknown';
                console.log(`📱 Social click: ${platform}`);
                // In production: send to analytics
            });
        });
    }

    setupHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav, .btn-submit').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    animation: ripple 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupEasterEggs() {
        // Konami code easter egg
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
            }
        });

        // Click counter on logo
        const logo = document.querySelector('.logo');
        let clickCount = 0;
        
        if (logo) {
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 7) {
                    this.showToast('🎉 ¡Has encontrado un secreto! Dios te bendiga.', 'success');
                    this.createConfetti();
                    clickCount = 0;
                }
            });
        }
    }

    activateEasterEgg() {
        this.showToast('🎮 ¡Código Konami activado! Dios es bueno todo el tiempo.', 'success');
        this.createConfetti();
        document.body.style.animation = 'rainbow 3s ease infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }

    createConfetti() {
        const colors = ['#003B46', '#07575B', '#66A5AD', '#C4DFE6', '#FFFFFF'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -20px;
                    opacity: ${Math.random()};
                    transform: rotate(${Math.random() * 360}deg);
                    pointer-events: none;
                    z-index: 10000;
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const icon = type === 'success' ? '✓' : '⚠';
        const bgColor = type === 'success' ? '#66A5AD' : '#e74c3c';
        
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span style="font-size: 1.5rem; margin-right: 0.5rem;">${icon}</span>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            display: flex;
            align-items: center;
            font-weight: 600;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.toastDuration);
    }

    playWelcomeAnimation() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease';
                heroContent.style.opacity = '1';
            }, 100);
        }
    }

    simulateAPICall(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Throttle function for performance
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime < delay) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastExecTime = currentTime;
                func.apply(this, args);
            }, delay);
        } else {
            lastExecTime = currentTime;
            func.apply(this, args);
        }
    };
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// CSS ANIMATIONS
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ChurchWebsite();
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('❌ Error detectado:', e.message);
    // In production: send to error logging service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rejection:', e.reason);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Performance metrics:', {
                loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                resourcesLoaded: performance.getEntriesByType('resource').length
            });
        }, 0);
    });
}