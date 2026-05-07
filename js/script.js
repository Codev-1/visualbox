document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. FETCH & INJECT NAVBAR LOGIC
    // ==========================================
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) throw new Error("Navbar not found");
            return response.text();
        })
        .then(data => {
            const navPlaceholder = document.getElementById('navbar-placeholder');
            if (navPlaceholder) navPlaceholder.innerHTML = data;
            initNavbarLogic();
        })
        .catch(error => console.error('Error loading navbar:', error));

    // ==========================================
    // 2. FETCH & INJECT FOOTER LOGIC
    // ==========================================
    fetch('footer.html')
        .then(response => response.text())
        .then(footerData => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) footerPlaceholder.innerHTML = footerData;
            initFooterAnimations(); 
        })
        .catch(error => console.error('Error loading footer:', error));

    // ==========================================
    // 3. TESTIMONIAL CAROUSEL LOGIC
    // ==========================================
   // ==========================================
    // 3. BULLETPROOF TESTIMONIAL CAROUSEL 
    // ==========================================
   // ==========================================
    // 3. BULLETPROOF TESTIMONIAL CAROUSEL (AUTO-SLIDING)
    // ==========================================
    const testiTrack = document.getElementById('testi-track');
    const testiPrevBtn = document.getElementById('testi-prev');
    const testiNextBtn = document.getElementById('testi-next');

    if (testiTrack && testiPrevBtn && testiNextBtn) {
        
        // --- 1. The Core Scrolling Logic ---
        
        const scrollRight = () => {
            const card = testiTrack.querySelector('.testi-card');
            if (!card) return;
            
            const scrollDistance = card.offsetWidth + 32; 
            
            // Check if we are at the end of the scrollable area
            const maxScrollLeft = testiTrack.scrollWidth - testiTrack.clientWidth;
            
            // If we are at the end, jump smoothly back to the beginning
            if (testiTrack.scrollLeft >= maxScrollLeft - 10) { // -10px buffer for rounding errors
                testiTrack.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                testiTrack.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            }
        };

        const scrollLeft = () => {
            const card = testiTrack.querySelector('.testi-card');
            if (!card) return;
            const scrollDistance = card.offsetWidth + 32;
            testiTrack.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        };

        // --- 2. Button Event Listeners ---
        testiNextBtn.addEventListener('click', scrollRight);
        testiPrevBtn.addEventListener('click', scrollLeft);


        // --- 3. Auto-Sliding Logic ---
        let autoSlideInterval;
        const SLIDE_DELAY = 4000; // Time between slides (4 seconds)

        const startAutoSlide = () => {
            // Clear any existing interval to prevent duplicates
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(scrollRight, SLIDE_DELAY);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Start it initially
        startAutoSlide();

        // Pause when hovering over the track or the buttons
        const carouselWrapper = document.querySelector('.testi-carousel-wrapper');
        if(carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
            carouselWrapper.addEventListener('mouseleave', startAutoSlide);
            
            // For mobile users (pause when touching)
            carouselWrapper.addEventListener('touchstart', stopAutoSlide);
            carouselWrapper.addEventListener('touchend', startAutoSlide);
        }
    }




		// ==========================================
    // PORTFOLIO HORIZONTAL MOUSE WHEEL SCROLL
    // ==========================================
    const portTrack = document.querySelector('.gsap-port-track');
    
    if (portTrack) {
        portTrack.addEventListener('wheel', (e) => {
            // Only intervene if the user is scrolling vertically with their mouse wheel
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                
                const isAtStart = portTrack.scrollLeft === 0;
                // Subtract 2 to be extra safe against browser sub-pixel rounding
                const isAtEnd = portTrack.scrollLeft >= (portTrack.scrollWidth - portTrack.clientWidth) - 2; 
                
                // If at the boundaries, let the user scroll the page up/down normally
                if ((e.deltaY < 0 && isAtStart) || (e.deltaY > 0 && isAtEnd)) {
                    return; 
                }
                
                // Stop the page from scrolling down
                e.preventDefault();
                
                // Glide horizontally with native smooth scrolling
                portTrack.scrollBy({
                    left: e.deltaY, // Removed the * 2 multiplier so it doesn't fly out of control
                    behavior: 'smooth' // Changed from 'auto' to 'smooth' for a premium glide
                });
            }
        }, { passive: false }); 
    }





    // ==========================================
    // 4. AWESOME SERVICES CAROUSEL LOGIC
    // ==========================================
    const carousel = document.getElementById('services-carousel');
    const btnLeft = document.getElementById('btn-prev');
    const btnRight = document.getElementById('btn-next');

    if (carousel && btnLeft && btnRight) {
        btnRight.addEventListener('click', () => {
            const card = carousel.querySelector('.service-card');
            const scrollDistance = card.offsetWidth + 24; 
            carousel.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        });

        btnLeft.addEventListener('click', () => {
            const card = carousel.querySelector('.service-card');
            const scrollDistance = card.offsetWidth + 24;
            carousel.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 5. PREMIUM SERVICES 3D SHUTTER LOGIC
    // ==========================================
    const shutterCards = document.querySelectorAll('.vb-card');
    const SLICE_COUNT = 6; 

    shutterCards.forEach(card => {
        const bgUrl = card.getAttribute('data-bg');
        const shutterWrap = card.querySelector('.vb-shutters');
        const titleOverlay = card.querySelector('.vb-title-overlay');
        const contentElems = card.querySelectorAll('.vb-content > *');

        if (shutterWrap && bgUrl) {
            for (let i = 0; i < SLICE_COUNT; i++) {
                const slice = document.createElement('div');
                slice.classList.add('vb-slice');
                slice.style.width = `calc(${100 / SLICE_COUNT}% + 1px)`; 
                slice.style.left = `${(100 / SLICE_COUNT) * i}%`; 
                slice.style.position = 'absolute';
                slice.style.backgroundImage = `url('${bgUrl}')`;
                slice.style.backgroundSize = `${SLICE_COUNT * 100}% 100%`;
                slice.style.backgroundPosition = `${i * (100 / (SLICE_COUNT - 1))}% center`;
                shutterWrap.appendChild(slice);
            }
        }

        const slices = card.querySelectorAll('.vb-slice');
        if (typeof gsap !== 'undefined' && slices.length > 0) {
            gsap.set(contentElems, { opacity: 0, y: 30 });

            const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } });

            tl.to(titleOverlay, { opacity: 0, y: -20, duration: 0.4 })
              .to(slices, { rotationY: -90, stagger: 0.05, duration: 0.6, transformOrigin: "left center" }, "<") 
              .to(contentElems, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "back.out(1.2)" }, "-=0.3"); 

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        }
    });



			





    // ==========================================
    // 6. PROCESS CARDS 3D HOVER TILT
    // ==========================================
    const processCards = document.querySelectorAll('.process-card');
    
    processCards.forEach(card => {
        const innerCard = card.firstElementChild;
        if (!innerCard) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -15; 
            const tiltY = ((x - centerX) / centerX) * 15;
            
            innerCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            innerCard.style.transition = 'none'; 
        });
        
        card.addEventListener('mouseleave', () => {
            innerCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            innerCard.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
        });
        
        innerCard.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

}); // <-- END OF DOM CONTENT LOADED. NOTHING GOES PAST HERE EXCEPT FUNCTIONS.

// ==========================================
// OUTSIDE FUNCTIONS
// ==========================================

function initNavbarLogic() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('svg path') : null;
    let isMenuOpen = false;

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenu.classList.add('translate-x-0');
                if(mobileIcon) mobileIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                document.body.style.overflow = 'hidden'; 
            } else {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
                if(mobileIcon) mobileIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                document.body.style.overflow = ''; 
            }
        });
    }

    const currentUrl = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentUrl === linkHref || (currentUrl === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initFooterAnimations() {
    if (typeof gsap !== 'undefined') {
        const triangles = document.querySelectorAll('.gsap-tri');
        triangles.forEach((tri, index) => {
            gsap.to(tri, {
                y: -30, 
                rotation: index % 2 === 0 ? 15 : -15, 
                duration: "random(2.5, 4)", 
                repeat: -1, 
                yoyo: true, 
                ease: "sine.inOut",
                delay: index * 0.5 
            });
        });

        const footerElements = document.querySelectorAll('.footer-col');
        if (gsap.plugins && gsap.plugins.ScrollTrigger) {
            gsap.from(footerElements, {
                scrollTrigger: {
                    trigger: ".vb-footer-content",
                    start: "top 85%", 
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }
    }
}





// ==========================================
// GLOBAL FLOATING BUTTONS (Injected via JS)
// ==========================================
function initFloatingButtons() {
    // Prevent duplicate injections if the script runs twice
    if (document.getElementById('global-floating-buttons')) return;

    // Create the container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'global-floating-buttons';
    
    // HTML for Scroll-to-Top, Call, and WhatsApp Buttons stacked on the right
    buttonContainer.innerHTML = `
        <div class="fixed z-[9999] bottom-6 right-6 flex flex-col items-center gap-4 pointer-events-auto">
            
            <button id="scrollToTopBtn" class="w-12 h-12 bg-gradient-to-tr from-[#E3000F] to-[#F57C00] border-2 border-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(227,0,15,0.4)] hover:scale-110 transition-all duration-500 opacity-0 translate-y-10 pointer-events-none cursor-pointer">
                <svg style="stroke: #ffffff; width: 24px; height: 24px;" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 15l-6-6-6 6"/>
                </svg>
            </button>
            
            <a href="tel:7875838908" class="w-14 h-14 bg-gradient-to-tr from-[#2A3F84] to-[#00AEEF] border-2 border-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(0,174,239,0.5)] hover:scale-110 transition-transform duration-300 relative group">
                <svg style="fill: #ffffff; width: 24px; height: 24px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span class="absolute right-16 bg-white text-[#1a1a1a] font-outfit text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-gray-100">
                    Call Us
                    <span class="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white"></span>
                </span>
            </a>

            <a href="https://wa.me/917875838908" target="_blank" class="w-14 h-14 bg-gradient-to-tr from-[#25D366] to-[#8CC63F] border-2 border-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.5)] hover:scale-110 transition-all duration-300 relative group animate-bounce" style="animation-duration: 3s;">
                <svg style="fill: #ffffff; width: 32px; height: 32px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.027 6.988 2.895a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span class="absolute right-16 bg-white text-[#1a1a1a] font-outfit text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-gray-100">
                    Chat with us
                    <span class="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white"></span>
                </span>
            </a>
        </div>
    `;
    
    // Inject directly into the body
    document.body.appendChild(buttonContainer);

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                // Show button
                scrollToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                scrollToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            } else {
                // Hide button
                scrollToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        });

        // Click action
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Ensure the buttons load when the page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingButtons);
} else {
    initFloatingButtons();
}



// ==========================================
// BULLETPROOF NAVBAR & MOBILE MENU LOGIC
// ==========================================
document.addEventListener('click', function(e) {
    
    // 1. Handle Hamburger Button OR Dark Backdrop Click
    const mobileMenuBtn = e.target.closest('#mobile-menu-btn');
    const backdropClick = e.target.closest('#mobile-menu-backdrop');
    
    if (mobileMenuBtn || backdropClick) {
        const mobileMenu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('mobile-menu-backdrop');
        const btn = document.getElementById('mobile-menu-btn'); 
        const floatingBtns = document.getElementById('global-floating-buttons');
        
        if (mobileMenu) {
            // Check if menu is currently open
            const isOpen = mobileMenu.classList.contains('translate-x-0');
            
            if (isOpen) {
                // -> CLOSE THE MENU
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('-translate-x-full'); // Hide to the left
                
                // Fade out dark background
                if(backdrop) {
                    backdrop.classList.remove('opacity-100');
                    backdrop.classList.add('opacity-0');
                    setTimeout(() => backdrop.classList.add('hidden'), 300);
                }

                // Change Icon back to Hamburger
                if(btn) btn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
                
                // Show floating buttons again
                if (floatingBtns) floatingBtns.style.display = 'flex';
                
            } else {
                // -> OPEN THE MENU
                mobileMenu.classList.remove('-translate-x-full', 'translate-x-full'); // Remove all hidden states
                mobileMenu.classList.add('translate-x-0'); // Slide in
                
                // Fade in dark background
                if(backdrop) {
                    backdrop.classList.remove('hidden');
                    setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
                    setTimeout(() => backdrop.classList.add('opacity-100'), 20);
                }

                // Change Icon to 'X'
                if(btn) btn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>';
                
                // Hide floating buttons so they don't overlap the menu
                if (floatingBtns) floatingBtns.style.display = 'none';
            }
        }
        return; 
    }

    // 2. Handle Mobile "Services" Accordion Dropdown Click
    const mobileServicesBtn = e.target.closest('#mobile-services-btn');
    if (mobileServicesBtn) {
        const mobileServicesMenu = document.getElementById('mobile-services-menu');
        const mobileServicesIcon = document.getElementById('mobile-services-icon');
        
        if (mobileServicesMenu && mobileServicesIcon) {
            mobileServicesMenu.classList.toggle('hidden');
            mobileServicesMenu.classList.toggle('flex');
            mobileServicesIcon.classList.toggle('rotate-180');
        }
    }
});