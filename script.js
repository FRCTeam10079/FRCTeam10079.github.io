
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',     
    duration: 600,         
    delay: 100,            
    reset: false,         
    easing: 'cubic-bezier(0.5, 0, 0, 1)', 
    viewFactor: 0.2       
});


sr.reveal('.hero-left h1', { delay: 100 });
sr.reveal('.hero-left h2', { delay: 200 });
sr.reveal('.hero-left .team-logo', { delay: 300, scale: 0.9, distance: '0px' }); 
sr.reveal('.hero-right', { origin: 'right', distance: '50px', delay: 200 });


sr.reveal('.about-content', { origin: 'left', distance: '50px' });
sr.reveal('.about-image', { origin: 'right', distance: '50px', delay: 150 });

sr.reveal('.sponsors-section', { delay: 100 });
sr.reveal('.leads-section .team-grid', { delay: 100 });
sr.reveal('.events-grid', { delay: 100 });
sr.reveal('.events-archive', { delay: 100 });
sr.reveal('.resources-grid', { delay: 100 });
sr.reveal('.contact-layout', { delay: 100 });

// Footer
sr.reveal('.footer-container', { delay: 50, distance: '20px' });

const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
const modalCloseButtons = document.querySelectorAll('.modal-close-btn');

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
}

modalOpenButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});



const backToTopButton = document.querySelector('.back-to-top-btn');


const handleScroll = () => {

    if (window.scrollY > 300) {
     
        backToTopButton.classList.add('active');
    } else {
  
        backToTopButton.classList.remove('active');
    }
};


window.addEventListener('scroll', handleScroll);

// Countdown Timer Logic
const countdown = document.getElementById('countdown');

if (countdown) {
    // Set the date we're counting down to
    // Glacier Peak starts March 13, 2026
    const targetDate = new Date("Mar 13, 2026 00:00:00").getTime();

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display results
        document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(updateCountdown);
            countdown.innerHTML = "<div class='time-box' style='width:100%'><span>EVENT LIVE!</span></div>";
        }
    }, 1000);
}

// Mobile Menu Logic
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const siteNav = document.querySelector('.site-nav');
const dropdowns = document.querySelectorAll('.dropdown');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        siteNav.classList.toggle('active');
    });
}

// Mobile Dropdown Logic
dropdowns.forEach(dropdown => {
    const dropbtn = dropdown.querySelector('.dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                // Prevent default behavior
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            }
        });
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (siteNav && mobileMenuBtn && !siteNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && window.innerWidth <= 900) {
        siteNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});