/* ==========================================================================
   script.js has page behaviors: scroll reveal, back-to-top, countdowns.
   (Header/footer/nav behavior lives in layout.js.)
   ========================================================================== */

'use strict';

// ---- Scroll reveal (IntersectionObserver; content stays visible without JS) ----
(function () {
    // Tells layout.js's watchdog that reveal is handled, so it leaves html.js on
    window.revealReady = true;

    var revealed = document.querySelectorAll('.reveal');
    if (!revealed.length) return;

    function showAll() {
        revealed.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* Crawlers and auditors render the page once without ever scrolling, so an
       IntersectionObserver never fires for anything below the fold and those
       sections stay at opacity 0. That is what breaks the Search Console live
       test and the Lighthouse screenshot. Everyone here gets the identical
       markup either way, only the animation is skipped. */
    var ua = navigator.userAgent || '';
    var isCrawler = navigator.webdriver === true || /bot|crawl|spider|slurp|lighthouse|headless|inspectiontool|googleother|pagespeed|preview|validator|facebookexternalhit|embedly|quora link preview|screaming frog/i.test(ua);

    // layout.js has already folded the OS setting and the footer toggle into
    // this class, so read it rather than the media query on its own.
    var motionOff = document.documentElement.classList.contains('motion-off');

    if (isCrawler || motionOff || !('IntersectionObserver' in window)) {
        showAll();
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

    /* Second safety net, for a real browser whose observer never delivers:
       anything still hidden once the page has been loaded a while is shown.
       Sections the visitor has not reached yet are untouched, so scrolling
       still animates normally. */
    window.addEventListener('load', function () {
        window.setTimeout(function () {
            revealed.forEach(function (el) {
                if (el.classList.contains('is-visible')) return;
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        }, 1200);
    });
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

// ---- Newsletter year filter + search ----
(function () {
    var list = document.querySelector('[data-newsletter-list]');
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('.newsletter-item'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-year-filter]'));
    var searchInput = document.querySelector('[data-newsletter-search]');
    var emptyMessage = document.querySelector('[data-newsletter-empty]');
    var activeYear = 'all';

    function applyFilters() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var shown = 0;

        items.forEach(function (item) {
            var yearMatch = activeYear === 'all' || item.getAttribute('data-year') === activeYear;
            var titleEl = item.querySelector('.newsletter-title');
            var title = titleEl ? titleEl.textContent.toLowerCase() : '';
            var searchMatch = query === '' || title.indexOf(query) !== -1;
            var visible = yearMatch && searchMatch;

            item.hidden = !visible;
            if (visible) shown++;
        });

        if (emptyMessage) emptyMessage.hidden = shown > 0;
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            activeYear = chip.getAttribute('data-year-filter');
            chips.forEach(function (other) {
                var isActive = other === chip;
                other.classList.toggle('is-active', isActive);
                other.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    applyFilters();
})();

// ---- Document viewer: swap between the PDF and the formatted version ----
(function () {
    var toggle = document.querySelector('[data-doc-toggle]');
    var pdfView = document.querySelector('[data-doc-pdf]');
    var formattedView = document.querySelector('[data-doc-formatted]');
    if (!toggle || !pdfView || !formattedView) return;

    toggle.addEventListener('click', function () {
        var showFormatted = formattedView.hidden;

        formattedView.hidden = !showFormatted;
        pdfView.hidden = showFormatted;
        formattedView.classList.add('is-visible');

        toggle.setAttribute('aria-expanded', showFormatted ? 'true' : 'false');
        toggle.textContent = showFormatted ? 'View PDF' : 'View Formatted Version';
    });
})();
