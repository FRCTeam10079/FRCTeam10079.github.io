/* ==========================================================================
   script.js — page behaviors: scroll reveal, back-to-top, countdowns.
   (Header/footer/nav behavior lives in layout.js.)
   ========================================================================== */

'use strict';

// ---- Scroll reveal (IntersectionObserver; content stays visible without JS) ----
(function () {
    var revealed = document.querySelectorAll('.reveal');
    if (!revealed.length) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealed.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealed.forEach(function (el) { observer.observe(el); });
})();

// ---- Back to top ----
(function () {
    var backToTopButton = document.querySelector('.back-to-top-btn');
    if (!backToTopButton) return;

    window.addEventListener('scroll', function () {
        backToTopButton.classList.toggle('active', window.scrollY > 300);
    });
})();

// ---- Countdown timers ----
(function () {
    var countdowns = document.querySelectorAll('[data-countdown-target]');

    countdowns.forEach(function (countdown) {
        var targetDateValue = countdown.getAttribute('data-countdown-target');
        if (!targetDateValue) return;

        var targetDate = new Date(targetDateValue).getTime();
        if (Number.isNaN(targetDate)) return;

        var daysEl = countdown.querySelector('.days');
        var hoursEl = countdown.querySelector('.hours');
        var minutesEl = countdown.querySelector('.minutes');
        var secondsEl = countdown.querySelector('.seconds');

        var pad = function (n) { return n < 10 ? '0' + n : String(n); };

        var updateCountdown = setInterval(function () {
            var distance = targetDate - Date.now();

            if (distance < 0) {
                clearInterval(updateCountdown);
                countdown.innerHTML = "<div class='time-box' style='width:100%'><span>EVENT LIVE!</span></div>";
                return;
            }

            var days = Math.floor(distance / 86400000);
            var hours = Math.floor((distance % 86400000) / 3600000);
            var minutes = Math.floor((distance % 3600000) / 60000);
            var seconds = Math.floor((distance % 60000) / 1000);

            if (daysEl) daysEl.textContent = pad(days);
            if (hoursEl) hoursEl.textContent = pad(hours);
            if (minutesEl) minutesEl.textContent = pad(minutes);
            if (secondsEl) secondsEl.textContent = pad(seconds);
        }, 1000);
    });
})();
