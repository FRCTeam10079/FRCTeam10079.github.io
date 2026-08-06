/* ==========================================================================
   layout.js — shared header, nav, and footer for every page.
   Edit the nav or footer ONCE here and every page updates.

   Usage per page:
     <script src="layout.js" data-page="home"></script>   ← where the header goes
     ...page content...
     <script>renderFooter()</script>                      ← where the footer goes

   data-page values: home, about, team, history, impact-report, newsletters,
   constitution, location, contact, robots, calendar, join, support, sponsors, links
   ========================================================================== */

(function () {
    'use strict';

    // Signals to CSS that JS is running (scroll-reveal only hides content then)
    document.documentElement.classList.add('js');

    var HEADER_HTML =
        '<header class="site-header">' +
        '  <div class="header-container">' +
        '    <a href="index.html" class="brand">' +
        '      <img src="images/arrowdynamicslogo.png" alt="" class="brand-logo">' +
        '      <span class="brand-name">ArrowDynamics<span class="brand-sub">FRC Team 10079</span></span>' +
        '    </a>' +
        '    <button class="mobile-menu-btn" aria-label="Menu" aria-expanded="false">' +
        '      <span></span><span></span><span></span>' +
        '    </button>' +
        '    <nav class="site-nav">' +
        '      <a href="index.html" data-nav="home">Home</a>' +
        '      <div class="dropdown">' +
        '        <button class="dropbtn" aria-haspopup="true">About Us</button>' +
        '        <div class="dropdown-content">' +
        '          <a href="about.html" data-nav="about">About Us</a>' +
        '          <a href="team.html" data-nav="team">Meet the Team</a>' +
        '          <a href="history.html" data-nav="history">Team History</a>' +
        '          <a href="impact-report.html" data-nav="impact-report">Impact Report</a>' +
        '          <a href="newsletters.html" data-nav="newsletters">Newsletters</a>' +
        '          <a href="constitution.html" data-nav="constitution">Constitution</a>' +
        '          <a href="location.html" data-nav="location">Location</a>' +
        '          <a href="contact.html" data-nav="contact">Contact Us</a>' +
        '        </div>' +
        '      </div>' +
        '      <a href="robots.html" data-nav="robots">Robots</a>' +
        '      <a href="calendar.html" data-nav="calendar">Calendar</a>' +
        '      <a href="join.html" data-nav="join">Join</a>' +
        '      <div class="dropdown">' +
        '        <button class="dropbtn" aria-haspopup="true">Support Us</button>' +
        '        <div class="dropdown-content">' +
        '          <a href="donate.html" data-nav="support">Support Us</a>' +
        '          <a href="sponsors.html" data-nav="sponsors">Sponsors</a>' +
        '        </div>' +
        '      </div>' +
        '      <a href="resources.html" data-nav="links">Links</a>' +
        '    </nav>' +
        '  </div>' +
        '</header>';

    var FOOTER_HTML =
        '<footer class="site-footer-bottom">' +
        '  <div class="footer-container">' +
        '    <div class="footer-grid">' +
        '      <div>' +
        '        <p class="footer-brand-name">ArrowDynamics</p>' +
        '        <p class="footer-brand-sub">FIRST Robotics Competition Team 10079</p>' +
        '        <p>The robotics club of Bothell High School, proudly competing in the FIRST Pacific Northwest District.</p>' +
        '      </div>' +
        '      <div>' +
        '        <p class="footer-heading">Find Us</p>' +
        '        <address>' +
        '          <a href="https://maps.google.com/?q=Bothell+High+School,+Bothell,+WA+98011" target="_blank" rel="noopener noreferrer">' +
        '            Bothell High School<br>Bothell, WA 98011' +
        '          </a>' +
        '        </address>' +
        '      </div>' +
        '      <div>' +
        '        <p class="footer-heading">Connect</p>' +
        '        <p><a href="mailto:roboticsbothell@gmail.com">roboticsbothell@gmail.com</a></p>' +
        '        <div class="footer-socials">' +
        '          <a href="https://www.instagram.com/arrowdynamics10079/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
        '            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' +
        '          </a>' +
        '          <a href="https://www.youtube.com/@ad10079" target="_blank" rel="noopener noreferrer" aria-label="YouTube">' +
        '            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' +
        '          </a>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="footer-bottom-bar">' +
        '      <p class="copyright-text">&copy; 2026 ArrowDynamics &mdash; FRC Team 10079 &middot; Bothell High School Robotics Club &middot; <a href="mailto:roboticsbothell@gmail.com">roboticsbothell@gmail.com</a></p>' +
        '    </div>' +
        '  </div>' +
        '</footer>' +
        '<a href="#" class="back-to-top-btn" aria-label="Back to top">&#8593;</a>';

    var script = document.currentScript;
    var page = script ? script.dataset.page : '';

    // Header is inserted synchronously at the script's position, so it exists
    // in the DOM before first paint — no flash, no layout shift.
    script.insertAdjacentHTML('afterend', HEADER_HTML);

    var header = document.querySelector('.site-header');

    // Highlight the current page in the nav (and its parent dropdown, if any)
    if (page) {
        var current = header.querySelector('[data-nav="' + page + '"]');
        if (current) {
            current.classList.add('active');
            current.setAttribute('aria-current', 'page');
            var dropdown = current.closest('.dropdown');
            if (dropdown) {
                dropdown.querySelector('.dropbtn').classList.add('active');
            }
        }
    }

    // Mobile hamburger
    var mobileMenuBtn = header.querySelector('.mobile-menu-btn');
    var siteNav = header.querySelector('.site-nav');
    var dropdowns = header.querySelectorAll('.dropdown');

    mobileMenuBtn.addEventListener('click', function () {
        var open = siteNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active', open);
        mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Mobile dropdown toggles (desktop uses hover/focus via CSS)
    dropdowns.forEach(function (dropdown) {
        var dropbtn = dropdown.querySelector('.dropbtn');
        dropbtn.addEventListener('click', function (e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                dropdowns.forEach(function (other) {
                    if (other !== dropdown) other.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            }
        });
    });

    // Tap outside closes the mobile menu
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 900 &&
            !siteNav.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            siteNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Called by each page at the footer position
    window.renderFooter = function () {
        document.currentScript.insertAdjacentHTML('beforebegin', FOOTER_HTML);
    };
})();
