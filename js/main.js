/**
 * Shree Balaji Enterprises
 * Premium Features JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // Mobile Navigation
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ========================================
    // Scroll Animations (Fade In)
    // ========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ========================================
    // Counter Animation
    // ========================================
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ========================================
    // Back to Top Button
    // ========================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Property Filters
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            propertyCards.forEach(card => {
                const cardTypes = card.getAttribute('data-type') || '';
                if (filter === 'all' || cardTypes.includes(filter)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ========================================
    // Contact Form - WhatsApp Integration
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email') || 'Not provided';
            const requirement = formData.get('requirement');
            const message = formData.get('message');

            if (phone.replace(/\D/g, '').length < 10) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }

            const waMessage = `*New Enquiry - Shree Balaji Enterprises*

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}
*Requirement:* ${requirement}

*Message:*
${message}`;

            window.open(`https://wa.me/917767805544?text=${encodeURIComponent(waMessage)}`, '_blank');

            contactForm.reset();
            showNotification('Redirecting to WhatsApp...', 'success');
        });
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 24px;
            background: ${type === 'success' ? '#0F9D58' : type === 'error' ? '#EA4335' : '#117ACA'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ========================================
    // Dynamic Copyright Year
    // ========================================
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // Navbar Background on Scroll
    // ========================================
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    }
});

// ========================================
// Image Slider for Property Cards
// ========================================
(function () {
    const sliderState = {};

    function getSlider(id) {
        if (!sliderState[id]) {
            const container = document.getElementById(id);
            if (!container) return null;
            const slides = container.querySelectorAll('.slide');
            const dots = document.querySelectorAll('#' + id + '-dots .dot');
            sliderState[id] = { container, slides, dots, current: 0 };
        }
        return sliderState[id];
    }

    window.changeSlide = function (id, direction) {
        const s = getSlider(id);
        if (!s) return;
        const next = (s.current + direction + s.slides.length) % s.slides.length;
        window.goToSlide(id, next);
    };

    window.goToSlide = function (id, index) {
        const s = getSlider(id);
        if (!s) return;
        s.slides[s.current].classList.remove('active');
        if (s.dots[s.current]) s.dots[s.current].classList.remove('active');
        s.current = index;
        s.slides[s.current].classList.add('active');
        if (s.dots[s.current]) s.dots[s.current].classList.add('active');
    };

    // Auto-advance sliders every 4 seconds
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.property-card__image--slider').forEach(function (el) {
            const id = el.id;
            if (!id) return;
            setInterval(function () {
                window.changeSlide(id, 1);
            }, 4000);
        });
    });
})();
