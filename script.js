/* ============================================================
   AI TRANSPARENCY PROTOCOL — script.js
   Countdown timer, scroll reveals, copy-to-clipboard,
   smooth scroll, mobile menu.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- EU AI Act Countdown Timer ---
    const deadline = new Date('2026-08-02T00:00:00+02:00').getTime();

    function updateCountdown() {
        const now = Date.now();
        const diff = deadline - now;

        if (diff <= 0) {
            document.getElementById('countdown-days').textContent = '00';
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            const ctaDays = document.getElementById('ctaDays');
            if (ctaDays) ctaDays.textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown-days').textContent = String(days).padStart(3, '0');
        document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');

        const ctaDays = document.getElementById('ctaDays');
        if (ctaDays) ctaDays.textContent = days;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // --- Scroll Reveal (IntersectionObserver) ---
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // stagger animation with slight delay for each sibling
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));


    // --- Navigation: scroll effects ---
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });


    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Close on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }


    // --- Copy to clipboard ---
    const copyBtn = document.getElementById('codeCopy');
    const codeContent = document.getElementById('codeContent');

    if (copyBtn && codeContent) {
        copyBtn.addEventListener('click', () => {
            const text = codeContent.textContent;

            navigator.clipboard.writeText(text).then(() => {
                const copyText = copyBtn.querySelector('.code-copy-text');
                copyBtn.classList.add('copied');
                if (copyText) copyText.textContent = 'Copied!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy';
                }, 2000);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                const copyText = copyBtn.querySelector('.code-copy-text');
                copyBtn.classList.add('copied');
                if (copyText) copyText.textContent = 'Copied!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy';
                }, 2000);
            });
        });
    }


    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });


    // --- ATS Bar animation on scroll ---
    const atsBars = document.querySelectorAll('.ats-bar-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // The width is set inline, just trigger the CSS transition
                entry.target.style.transitionDelay = '0.3s';
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    atsBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        barObserver.observe(bar);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { bar.style.width = width; }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(bar);
    });

});
