/**
 * Shree Balaji Enterprises
 * Premium Features JavaScript
 */

// ========================================
// Page-as-Card Transition
// Current page sweeps left revealing a card stack underneath.
// New page deals in from the right over the stack.
// ========================================
(function () {
    var SESSION_KEY = 'sbe-card-nav';

    // Build the deck that sits behind the current page during exit
    function injectStack() {
        var stack = document.createElement('div');
        stack.id = 'card-stack';
        // Insert BEFORE body so it renders below body in the stacking order
        document.documentElement.insertBefore(stack, document.body);
    }

    // Intercept internal link clicks
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var raw = a.getAttribute('href') || '';
        if (a.target === '_blank' || /^(mailto:|tel:|#|javascript)/.test(raw)) return;
        if (a.hostname && a.hostname !== location.hostname) return;
        e.preventDefault();
        var dest = a.href;
        injectStack();                               // show card deck underneath
        sessionStorage.setItem(SESSION_KEY, '1');    // tell next page to deal in
        document.body.classList.add('vt-exit');      // sweep current page left
        setTimeout(function () { location.href = dest; }, 730);
    }, true);

    // On new page load: deal the page in from the right
    document.addEventListener('DOMContentLoaded', function () {
        if (sessionStorage.getItem(SESSION_KEY)) {
            sessionStorage.removeItem(SESSION_KEY);
            document.body.classList.add('vt-enter');
            setTimeout(function () {
                document.body.classList.remove('vt-enter');
            }, 700);
        }
    });
})();

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
    // Auto Scroll-Reveal for Section Content
    // ========================================
    var revealSelectors = [
        '.section__header', '.cta__content', '.cta h2', '.cta p',
        '.page-header__title', '.page-header__breadcrumb',
        '.stat', '.type', '.testimonial', '.location',
        '.footer__brand', '.footer__links', '.footer__contact',
        '.contact__item', '.contact-form'
    ].join(',');

    var revealEls = document.querySelectorAll(revealSelectors);
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) {
        if (el.classList.contains('fade-in')) return; // already handled
        el.classList.add('will-reveal');
        // stagger siblings of the same type inside their parent
        var siblings = el.parentElement
            ? Array.from(el.parentElement.children).filter(function (c) { return c.classList.contains('will-reveal'); })
            : [];
        var idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = (idx * 0.09) + 's';
        revealObs.observe(el);
    });

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
                    card.style.display = '';
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
            nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        }, { passive: true });
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

// ========================================
// Spring Physics UI — jelly / soft-body feel
// ========================================
(function () {
    'use strict';

    /* ---- spring helpers ---- */
    function makeSpring(stiffness, damping) {
        return { stiffness: stiffness, damping: damping, value: 0, velocity: 0, target: 0 };
    }

    function tickSpring(s, dt) {
        var force = -s.stiffness * (s.value - s.target) - s.damping * s.velocity;
        s.velocity += force * dt;
        s.value += s.velocity * dt;
        return Math.abs(s.velocity) > 0.0003 || Math.abs(s.value - s.target) > 0.0003;
    }

    /* ---- animation loop ---- */
    var active = new Set();
    var lastTime = null;

    function loop(time) {
        var dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
        lastTime = time;

        active.forEach(function (item) {
            var alive = false;
            var keys = Object.keys(item.springs);
            for (var i = 0; i < keys.length; i++) {
                if (tickSpring(item.springs[keys[i]], dt)) alive = true;
            }
            item.apply();
            if (!alive) active.delete(item);
        });

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function wake(item) { active.add(item); }

    /* ---- Buttons & filter pills ---- */
    document.querySelectorAll('.btn, .nav__cta, .filter-btn').forEach(function (el) {
        // don't fight CSS transitions on these elements
        el.style.transitionProperty = 'background, color, border-color, box-shadow';

        var sp = {
            scale: makeSpring(230, 14),
            skewX: makeSpring(160, 11)
        };
        var item = {
            springs: sp,
            apply: function () {
                el.style.transform =
                    'scale(' + (1 + sp.scale.value) + ') skewX(' + sp.skewX.value + 'deg)';
            }
        };

        el.addEventListener('mouseenter', function () {
            sp.scale.velocity -= 0.08;
            sp.skewX.velocity += 2.5;
            wake(item);
        });
        el.addEventListener('mouseleave', function () {
            sp.skewX.target = 0;
            sp.scale.target = 0;
            wake(item);
        });
        el.addEventListener('mousedown', function () {
            sp.scale.velocity -= 0.12;
            wake(item);
        });
        el.addEventListener('mouseup', function () {
            sp.scale.velocity += 0.08;
            wake(item);
        });
    });

    /* ---- WhatsApp float button ---- */
    var waBtn = document.querySelector('.whatsapp');
    if (waBtn) {
        var waSp = {
            scale: makeSpring(200, 12),
            rot: makeSpring(150, 10)
        };
        var waItem = {
            springs: waSp,
            apply: function () {
                waBtn.style.transform =
                    'scale(' + (1 + waSp.scale.value) + ') rotate(' + waSp.rot.value + 'deg)';
            }
        };
        waBtn.addEventListener('mouseenter', function () {
            waSp.scale.velocity -= 0.12;
            waSp.rot.velocity += 10;
            wake(waItem);
        });
        waBtn.addEventListener('mouseleave', function () {
            waSp.scale.target = 0;
            waSp.rot.target = 0;
            wake(waItem);
        });
    }

    /* ---- Property cards, service cards, type & feature tiles ---- */
    document.querySelectorAll('.property-card, .service, .type, .feature').forEach(function (el) {
        el.style.willChange = 'transform';
        el.style.transitionProperty = 'box-shadow, opacity';   // don't fight transform

        var sp = {
            rotX: makeSpring(130, 11),
            rotY: makeSpring(130, 11),
            scale: makeSpring(200, 14)
        };
        var item = {
            springs: sp,
            apply: function () {
                el.style.transform =
                    'perspective(900px)' +
                    ' rotateX(' + sp.rotX.value + 'deg)' +
                    ' rotateY(' + sp.rotY.value + 'deg)' +
                    ' scale(' + (1 + sp.scale.value) + ')';
            }
        };

        el.addEventListener('mouseenter', function () {
            sp.scale.target = 0.03;
            wake(item);
        });
        el.addEventListener('mousemove', function (e) {
            var r = el.getBoundingClientRect();
            var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            sp.rotY.target = dx * 7;
            sp.rotX.target = -dy * 5;
            wake(item);
        });
        el.addEventListener('mouseleave', function () {
            sp.rotX.target = 0;
            sp.rotY.target = 0;
            sp.scale.target = 0;
            wake(item);
        });
        el.addEventListener('mousedown', function () {
            sp.scale.velocity -= 0.06;
            wake(item);
        });
        el.addEventListener('mouseup', function () {
            sp.scale.velocity += 0.04;
            wake(item);
        });
    });

    /* ---- Nav links — subtle bounce up ---- */
    document.querySelectorAll('.nav__link').forEach(function (el) {
        el.style.display = 'inline-block'; // needed for transform
        el.style.transitionProperty = 'color';

        var sp = { y: makeSpring(300, 16) };
        var item = {
            springs: sp,
            apply: function () { el.style.transform = 'translateY(' + sp.y.value + 'px)'; }
        };
        el.addEventListener('mouseenter', function () { sp.y.velocity -= 4; wake(item); });
        el.addEventListener('mouseleave', function () { sp.y.target = 0; wake(item); });
    });

})();

