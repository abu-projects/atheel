 
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#5A86AD',
                        'primary-hover': '#4E769A',
                        'primary-light': '#CBD9E6',
                        'gray-light': '#F2F3F5',
                        'gray-medium': '#A8AFB6',
                        'gray-dark': '#2A2F35',
                        'muted-bg': '#F8F9FA',
                        'accent-red': '#D44242',
                        'accent-green': '#35A57A',
                        'accent-amber': '#E8A53A',
                        'deep-charcoal': '#161A1E',
                        'custom-bg': '#f0f4f7'
                    },
                    fontFamily: {
                        'heading': ['GT Walsheim', 'Inter', 'sans-serif'],
                        'body': ['GT Walsheim', 'system-ui', 'sans-serif']
                    },
                    screens: {
                        'xs': '480px',
                        'sm': '768px',
                        'md': '1024px',
                        'lg': '1280px',
                        'xl': '1400px',
                        '2xl': '1600px'
                    }
                }
            }
        }
     
        // Header scroll behavior
        const header = document.getElementById('header');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        // Arabic mobile menu elements
        const mobileMenuAr = document.getElementById('mobile-menu-ar');
        const mobileMenuCloseAr = document.getElementById('mobile-menu-close-ar');
        const mobileMenuLines = document.querySelectorAll('.mobile-menu-line');
        let isMenuOpen = false;

        // Helper: active menu based on language
        function getActiveMobileMenu() {
            try {
                return (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? (mobileMenuAr || mobileMenu) : mobileMenu;
            } catch (_) {
                return mobileMenu;
            }
        }

        function getActiveMobileMenuClose() {
            try {
                return (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? (mobileMenuCloseAr || mobileMenuClose) : mobileMenuClose;
            } catch (_) {
                return mobileMenuClose;
            }
        }

        // Function to open mobile menu
        function openMobileMenu() {
            isMenuOpen = true;
            const activeMenu = getActiveMobileMenu();
            activeMenu.classList.remove('translate-x-full');
            activeMenu.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden';

            // Animate hamburger to X
            mobileMenuLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            mobileMenuLines[1].style.opacity = '0';
            mobileMenuLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }

        // Function to close mobile menu
        function closeMobileMenu() {
            isMenuOpen = false;
            [mobileMenu, mobileMenuAr].forEach(menu => {
                if (!menu) return;
                menu.classList.add('translate-x-full');
                menu.classList.remove('translate-x-0');
            });
            document.body.style.overflow = '';

            // Reset hamburger
            mobileMenuLines[0].style.transform = '';
            mobileMenuLines[1].style.opacity = '1';
            mobileMenuLines[2].style.transform = '';
        }

        // Mobile menu toggle
        mobileMenuButton.addEventListener('click', function () {
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close button functionality
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        if (mobileMenuCloseAr) mobileMenuCloseAr.addEventListener('click', closeMobileMenu);

        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                closeMobileMenu();
                document.body.style.overflow = '';

                // Reset hamburger
                mobileMenuLines[0].style.transform = '';
                mobileMenuLines[1].style.opacity = '1';
                mobileMenuLines[2].style.transform = '';
            });
        });

        // Header background change on scroll
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                // Change mobile menu lines color when scrolled
                mobileMenuLines.forEach(line => {
                    line.style.backgroundColor = '#2A2F35';
                });
            } else {
                header.classList.remove('scrolled');
                // Reset mobile menu lines color
                mobileMenuLines.forEach(line => {
                    line.style.backgroundColor = 'white';
                });
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Enhanced animation system with intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add fade-in to sections
                    entry.target.classList.add('fade-in');

                    // Animate stagger elements
                    const staggerElements = entry.target.querySelectorAll('.stagger-animation');
                    staggerElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('animate');
                        }, index * 100);
                    });

                    // Animate slide elements
                    const slideElements = entry.target.querySelectorAll('.slide-in-left, .slide-in-right, .scale-in');
                    slideElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateX(0) scale(1)';
                        }, index * 200);
                    });

                    // Animate About section content items
                    const aboutContentItems = entry.target.querySelectorAll('.about-content-item');
                    aboutContentItems.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('animate');
                        }, index * 200);
                    });

                    // Animate counters in About section
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000; // 2 seconds
                        const step = target / (duration / 16); // 60fps
                        let current = 0;

                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            counter.textContent = Math.floor(current);
                        }, 16);
                    });
                }
            });
        }, observerOptions);

        // Observe all sections and animated elements
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Initialize hero animations on page load
        window.addEventListener('load', function () {
            setTimeout(() => {
                const heroStaggerElements = document.querySelectorAll('#home .stagger-animation');
                heroStaggerElements.forEach(element => {
                    element.classList.add('animate');
                });
            }, 500);
        });

        // Parallax effect for hero background
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const hero = document.getElementById('home');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Add hover effects to project items
        document.querySelectorAll('.image-overlay').forEach(overlay => {
            overlay.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.02)';
            });

            overlay.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        });

        // Full-Width Project Slider Functionality (EN + AR)
        // ------- English slider (scoped) -------
        (function () {
            const projectSlider = document.getElementById('projectSlider');
            if (!projectSlider) return;

            const prevButtons = document.querySelectorAll('#projects .prev-btn, .projects .prev-btn');
            const nextButtons = document.querySelectorAll('#projects .next-btn, .projects .next-btn');
            const sliderDots = document.querySelectorAll('#projects .slider-dot');
            let currentSlide = 0;
            let totalSlides = projectSlider.querySelectorAll('.project-slide').length;

            function updateSlider() {
                const translateX = -currentSlide * 100;
                projectSlider.style.transform = `translateX(${translateX}%)`;
                sliderDots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.remove('bg-gray-300');
                        dot.classList.add('bg-primary');
                    } else {
                        dot.classList.remove('bg-primary');
                        dot.classList.add('bg-gray-300');
                    }
                });
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            }

            prevButtons.forEach(btn => btn.addEventListener('click', prevSlide));
            nextButtons.forEach(btn => btn.addEventListener('click', nextSlide));
            sliderDots.forEach((dot, index) => dot.addEventListener('click', () => { currentSlide = index; updateSlider(); }));

            const sliderWrapper = document.querySelector('#projects .project-slider-wrapper') || document.querySelector('.project-slider-wrapper');
            let autoPlayInterval = setInterval(nextSlide, 6000);
            if (sliderWrapper) {
                sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
                sliderWrapper.addEventListener('mouseleave', () => { autoPlayInterval = setInterval(nextSlide, 6000); });
                let startX = 0, endX = 0;
                sliderWrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
                sliderWrapper.addEventListener('touchend', e => { endX = e.changedTouches[0].clientX; const diff = startX - endX; if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); } });
            }

            document.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') prevSlide(); else if (e.key === 'ArrowRight') nextSlide(); });
            updateSlider();
        })();

        // ------- Arabic slider (scoped) -------
        (function () {
            const projectSliderAr = document.getElementById('projectSliderAr');
            if (!projectSliderAr) return;

            const prevButtonsAr = document.querySelectorAll('#projects-ar .prev-btn');
            const nextButtonsAr = document.querySelectorAll('#projects-ar .next-btn');
            const sliderDotsAr = document.querySelectorAll('#projects-ar .slider-dot');
            let currentSlideAr = 0;
            let totalSlidesAr = projectSliderAr.querySelectorAll('.project-slide').length;

            function updateSliderAr() {
                // Use negative translateX just like LTR - the slides work the same way
                const translateX = -currentSlideAr * 100;
                projectSliderAr.style.transform = `translateX(${translateX}%)`;
                sliderDotsAr.forEach((dot, index) => {
                    if (index === currentSlideAr) {
                        dot.classList.remove('bg-gray-300');
                        dot.classList.add('bg-primary');
                    } else {
                        dot.classList.remove('bg-primary');
                        dot.classList.add('bg-gray-300');
                    }
                });
            }

            function nextSlideAr() {
                currentSlideAr = (currentSlideAr + 1) % totalSlidesAr;
                updateSliderAr();
            }

            function prevSlideAr() {
                currentSlideAr = (currentSlideAr - 1 + totalSlidesAr) % totalSlidesAr;
                updateSliderAr();
            }

            // Button handlers work normally
            prevButtonsAr.forEach(btn => btn.addEventListener('click', prevSlideAr));
            nextButtonsAr.forEach(btn => btn.addEventListener('click', nextSlideAr));
            sliderDotsAr.forEach((dot, index) => dot.addEventListener('click', () => { currentSlideAr = index; updateSliderAr(); }));

            const sliderWrapperAr = document.querySelector('#projects-ar .project-slider-wrapper');
            let autoPlayIntervalAr = setInterval(nextSlideAr, 6000);
            if (sliderWrapperAr) {
                sliderWrapperAr.addEventListener('mouseenter', () => clearInterval(autoPlayIntervalAr));
                sliderWrapperAr.addEventListener('mouseleave', () => { autoPlayIntervalAr = setInterval(nextSlideAr, 6000); });
                let startXAr = 0, endXAr = 0;
                sliderWrapperAr.addEventListener('touchstart', e => { startXAr = e.touches[0].clientX; });
                // Touch swipe works normally
                sliderWrapperAr.addEventListener('touchend', e => { endXAr = e.changedTouches[0].clientX; const diff = startXAr - endXAr; if (Math.abs(diff) > 50) { diff > 0 ? nextSlideAr() : prevSlideAr(); } });
            }

            // Keyboard navigation works normally
            document.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft' && document.querySelector('#projects-ar:hover')) prevSlideAr();
                else if (e.key === 'ArrowRight' && document.querySelector('#projects-ar:hover')) nextSlideAr();
            });
            updateSliderAr();
        })();

        // Services Slick Slider Initialization
        $(document).ready(function () {
            console.log('jQuery loaded, initializing Slick Slider...');

            // Check if the container exists
            if ($('.services-slider-container').length > 0) {
                console.log('Services container found, initializing slider...');

                $('.services-slider-container').slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    pauseOnHover: true,
                    arrows: true,
                    centerMode: false,
                    variableWidth: false,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });

                console.log('Slick Slider initialized successfully');
            } else {
                console.error('Services slider container not found!');
            }
        });

        // Smooth Hero Video Sequence Functionality
        const heroVideo1 = document.getElementById('hero-video-1');
        const heroVideo2 = document.getElementById('hero-video-2');
        const videoSequence = [
            'assets/video/hero3.mp4',
            'assets/video/hero4.mp4',
            'assets/video/hero1.mp4',
            'assets/video/hero6.mp4'
        ];

        let currentVideoIndex = 0;
        let activeVideo = heroVideo1;
        let nextVideo = heroVideo2;
        let isTransitioning = false;

        function preloadNextVideo() {
            const nextIndex = (currentVideoIndex + 1) % videoSequence.length;
            const nextVideoSrc = videoSequence[nextIndex];

            // Update the source element inside the video tag
            const sourceElement = nextVideo.querySelector('source');
            if (sourceElement) {
                sourceElement.src = nextVideoSrc;
            } else {
                // If no source element exists, set the video src directly
                nextVideo.src = nextVideoSrc;
            }

            // Reload the video with new source
            nextVideo.load();
        }

        function crossfadeToNextVideo() {
            if (isTransitioning) return;
            isTransitioning = true;

            console.log(`Transitioning to video ${currentVideoIndex + 1}: ${videoSequence[(currentVideoIndex + 1) % videoSequence.length]}`);

            // Start playing the next video
            nextVideo.play().then(() => {
                // Crossfade: fade out current, fade in next
                activeVideo.style.opacity = '0';
                nextVideo.style.opacity = '1';

                // After transition completes, swap the videos
                setTimeout(() => {
                    // Swap active and next video references
                    const temp = activeVideo;
                    activeVideo = nextVideo;
                    nextVideo = temp;

                    // Update video index
                    currentVideoIndex = (currentVideoIndex + 1) % videoSequence.length;

                    // Preload the next video for seamless transitions
                    preloadNextVideo();

                    isTransitioning = false;

                    console.log(`Now playing video ${currentVideoIndex}: ${videoSequence[currentVideoIndex]}`);
                }, 1000); // Match the CSS transition duration

            }).catch(error => {
                console.error('Next video play failed:', error);
                // Try to continue with the sequence even if one video fails
                currentVideoIndex = (currentVideoIndex + 1) % videoSequence.length;
                preloadNextVideo();
                isTransitioning = false;
            });
        }

        // Initialize video sequence
        if (heroVideo1 && heroVideo2) {
            console.log('Initializing video sequence with videos:', videoSequence);

            // Preload the second video
            preloadNextVideo();

            // Set up event listeners for both videos
            [heroVideo1, heroVideo2].forEach((video, index) => {
                video.addEventListener('ended', () => {
                    console.log(`Video ${index + 1} ended, transitioning to next`);
                    crossfadeToNextVideo();
                });

                video.addEventListener('error', function (e) {
                    console.error(`Video ${index + 1} error:`, e);
                    if (!isTransitioning) {
                        setTimeout(() => crossfadeToNextVideo(), 500);
                    }
                });

                video.addEventListener('loadeddata', function () {
                    console.log(`Video ${index + 1} loaded successfully`);
                });

                video.addEventListener('canplay', function () {
                    console.log(`Video ${index + 1} can play`);
                });
            });

            // Ensure first video starts playing
            heroVideo1.play().then(() => {
                console.log('First video started playing successfully');
            }).catch(error => {
                console.error('Initial video play failed:', error);
            });

            console.log('Smooth video sequence initialized');
        } else {
            console.error('Hero video elements not found');
        }

        // Arabic Hero Video Sequence Functionality
        const heroVideo1Ar = document.getElementById('hero-video-1-ar');
        const heroVideo2Ar = document.getElementById('hero-video-2-ar');

        let currentVideoIndexAr = 0;
        let activeVideoAr = heroVideo1Ar;
        let nextVideoAr = heroVideo2Ar;
        let isTransitioningAr = false;

        function preloadNextVideoAr() {
            const nextIndex = (currentVideoIndexAr + 1) % videoSequence.length;
            const nextVideoSrc = videoSequence[nextIndex];

            // Update the source element inside the video tag
            const sourceElement = nextVideoAr.querySelector('source');
            if (sourceElement) {
                sourceElement.src = nextVideoSrc;
            } else {
                // If no source element exists, set the video src directly
                nextVideoAr.src = nextVideoSrc;
            }

            // Reload the video with new source
            nextVideoAr.load();
        }

        function crossfadeToNextVideoAr() {
            if (isTransitioningAr) return;
            isTransitioningAr = true;

            console.log(`Arabic: Transitioning to video ${currentVideoIndexAr + 1}: ${videoSequence[(currentVideoIndexAr + 1) % videoSequence.length]}`);

            // Start playing the next video
            nextVideoAr.play().then(() => {
                // Crossfade: fade out current, fade in next
                activeVideoAr.style.opacity = '0';
                nextVideoAr.style.opacity = '1';

                // After transition completes, swap the videos
                setTimeout(() => {
                    // Swap active and next video references
                    const temp = activeVideoAr;
                    activeVideoAr = nextVideoAr;
                    nextVideoAr = temp;

                    // Update video index
                    currentVideoIndexAr = (currentVideoIndexAr + 1) % videoSequence.length;

                    // Preload the next video for seamless transitions
                    preloadNextVideoAr();

                    isTransitioningAr = false;

                    console.log(`Arabic: Now playing video ${currentVideoIndexAr}: ${videoSequence[currentVideoIndexAr]}`);
                }, 1000); // Match the CSS transition duration

            }).catch(error => {
                console.error('Arabic: Next video play failed:', error);
                // Try to continue with the sequence even if one video fails
                currentVideoIndexAr = (currentVideoIndexAr + 1) % videoSequence.length;
                preloadNextVideoAr();
                isTransitioningAr = false;
            });
        }

        // Initialize Arabic video sequence
        if (heroVideo1Ar && heroVideo2Ar) {
            console.log('Initializing Arabic video sequence with videos:', videoSequence);

            // Preload the second video
            preloadNextVideoAr();

            // Set up event listeners for both videos
            [heroVideo1Ar, heroVideo2Ar].forEach((video, index) => {
                video.addEventListener('ended', () => {
                    console.log(`Arabic Video ${index + 1} ended, transitioning to next`);
                    crossfadeToNextVideoAr();
                });

                video.addEventListener('error', function (e) {
                    console.error(`Arabic Video ${index + 1} error:`, e);
                    if (!isTransitioningAr) {
                        setTimeout(() => crossfadeToNextVideoAr(), 500);
                    }
                });

                video.addEventListener('loadeddata', function () {
                    console.log(`Arabic Video ${index + 1} loaded successfully`);
                });

                video.addEventListener('canplay', function () {
                    console.log(`Arabic Video ${index + 1} can play`);
                });
            });

            // Ensure first video starts playing
            heroVideo1Ar.play().then(() => {
                console.log('Arabic: First video started playing successfully');
            }).catch(error => {
                console.error('Arabic: Initial video play failed:', error);
            });

            console.log('Arabic: Smooth video sequence initialized');
        } else {
            console.error('Arabic: Hero video elements not found');
        }
  



        // Update copyright year dynamically
        document.addEventListener('DOMContentLoaded', function () {
            const currentYear = new Date().getFullYear();
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = currentYear;
            }
        });
  


        // Language translations
        const translations = {
            en: {
                // Navigation
                'HOME': 'HOME',
                'ABOUT': 'ABOUT',
                'WHY CHOOSE US': 'WHY CHOOSE US',
                'SERVICES': 'SERVICES',
                'PROJECTS': 'PROJECTS',
                'CONTACT US': 'CONTACT US',
                'Language': 'Language',

                // Hero Section
                'Established 2020': 'Established 2020',
                'AL ATHEL ESTABLISHMENT is a comprehensive construction management team and general contractor.': 'AL ATHEL ESTABLISHMENT is a comprehensive construction management team and general contractor.',
                'We deliver residential, commercial, and infrastructure projects with safety, sustainability, and on-time delivery—our ingredients for construction excellence.': 'We deliver residential, commercial, and infrastructure projects with safety, sustainability, and on-time delivery—our ingredients for construction excellence.',
                'Scroll to discover': 'Scroll to discover',

                // About Section
                'OUR STORY': 'OUR STORY',
                'Ours is a labor of': 'Ours is a labor of',
                'love': 'love',

                // Company Name
                'AL ATHEL ESTABLISHMENT': 'AL ATHEL ESTABLISHMENT'
            },
            ar: {
                // Navigation
                'HOME': 'الرئيسية',
                'ABOUT': 'من نحن',
                'WHY CHOOSE US': 'لماذا تختارنا',
                'SERVICES': 'الخدمات',
                'PROJECTS': 'المشاريع',
                'CONTACT US': 'اتصل بنا',
                'Language': 'اللغة',

                // Hero Section
                'Established 2020': 'تأسست عام ٢٠٢٠',
                'AL ATHEL ESTABLISHMENT is a comprehensive construction management team and general contractor.': 'مؤسسة الأثل هي فريق شامل لإدارة البناء ومقاول عام متخصص.',
                'We deliver residential, commercial, and infrastructure projects with safety, sustainability, and on-time delivery—our ingredients for construction excellence.': 'نقوم بتنفيذ المشاريع السكنية والتجارية والبنية التحتية بأمان واستدامة وتسليم في الوقت المحدد - مكوناتنا للتميز في البناء.',
                'Scroll to discover': 'اسحب للاستكشاف',

                // About Section
                'OUR STORY': 'قصتنا',
                'Ours is a labor of': 'عملنا هو عمل مليء بـ',
                'love': 'الحب',

                // Company Name
                'AL ATHEL ESTABLISHMENT': 'مؤسسة الأثل'
            }
        };

        let currentLanguage = 'ar';

        function switchLanguage() {
            currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';

            // Update HTML direction
            document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = currentLanguage;

            // Update language indicators
            const langEl1 = document.getElementById('current-lang');
            const langEl2 = document.getElementById('current-lang-2');
            const mobLang1 = document.getElementById('mobile-current-lang');
            const mobLang2 = document.getElementById('mobile-current-lang-2');
            if (langEl1) langEl1.textContent = currentLanguage.toUpperCase();
            if (langEl2) langEl2.textContent = currentLanguage.toUpperCase();
            if (mobLang1) mobLang1.textContent = currentLanguage.toUpperCase();
            if (mobLang2) mobLang2.textContent = currentLanguage.toUpperCase();

            // Update all translatable elements
            updateTranslations();

            // Toggle visibility of language-specific blocks
            updateLanguageVisibility();

            // Save language preference
            localStorage.setItem('preferred-language', currentLanguage);
        }

        function updateTranslations() {
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[currentLanguage] && translations[currentLanguage][key]) {
                    element.textContent = translations[currentLanguage][key];
                }
            });
        }

        // Show only the current language blocks
        function updateLanguageVisibility() {
            const showAr = currentLanguage === 'ar';
            document.querySelectorAll('.english').forEach(el => el.classList.toggle('lang-hidden', showAr));
            document.querySelectorAll('.arabic').forEach(el => el.classList.toggle('lang-hidden', !showAr));
        }

        // Initialize language system
        document.addEventListener('DOMContentLoaded', function () {
            // Load saved language preference
            const savedLanguage = localStorage.getItem('preferred-language');
            if (savedLanguage) {
                currentLanguage = savedLanguage;
            }

            // Set dir/lang and indicators
            document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = currentLanguage;
            const langEl1 = document.getElementById('current-lang');
            const langEl2 = document.getElementById('current-lang-2');
            const mobLang1 = document.getElementById('mobile-current-lang');
            const mobLang2 = document.getElementById('mobile-current-lang-2');
            if (langEl1) langEl1.textContent = (currentLanguage === 'en' ? 'AR' : 'EN');
            if (langEl2) langEl2.textContent = (currentLanguage === 'en' ? 'AR' : 'EN');
            if (mobLang1) mobLang1.textContent = (currentLanguage === 'en' ? 'AR' : 'EN');
            if (mobLang2) mobLang2.textContent = (currentLanguage === 'en' ? 'AR' : 'EN');

            // Apply initial visibility for language-specific blocks immediately
            updateLanguageVisibility();

            // Add event listeners
            document.getElementById('language-toggle').addEventListener('click', switchLanguage);
            const languageToggle2 = document.getElementById('language-toggle-2');
            if (languageToggle2) languageToggle2.addEventListener('click', switchLanguage);
            document.getElementById('mobile-language-toggle').addEventListener('click', switchLanguage);
            const mobileLanguageToggle2 = document.getElementById('mobile-language-toggle-2');
            if (mobileLanguageToggle2) mobileLanguageToggle2.addEventListener('click', switchLanguage);

            // Add data-translate attributes to existing elements
            addTranslateAttributes();

            // Apply initial visibility for language-specific blocks
            updateLanguageVisibility();
        });

        function addTranslateAttributes() {
            // Navigation links
            const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
            navLinks.forEach(link => {
                const text = link.textContent.trim();
                if (translations.en[text]) {
                    link.setAttribute('data-translate', text);
                }
            });

            // Contact button
            const contactBtns = document.querySelectorAll('a[href="#contact"]');
            contactBtns.forEach(btn => {
                if (btn.textContent.includes('CONTACT')) {
                    btn.setAttribute('data-translate', 'CONTACT US');
                }
            });

            // Hero section elements
            const establishedText = document.querySelector('.text-xs.font-bold.uppercase.tracking-widest.text-white.opacity-50');
            if (establishedText && establishedText.textContent.includes('Established')) {
                establishedText.setAttribute('data-translate', 'Established 2020');
            }

            const heroTitle = document.querySelector('h1.text-xl.md\\:text-3xl');
            if (heroTitle) {
                heroTitle.setAttribute('data-translate', 'AL ATHEL ESTABLISHMENT is a comprehensive construction management team and general contractor.');
            }

            const heroDescription = document.querySelector('.text-sm.md\\:text-base.text-white.opacity-60');
            if (heroDescription) {
                heroDescription.setAttribute('data-translate', 'We deliver residential, commercial, and infrastructure projects with safety, sustainability, and on-time delivery—our ingredients for construction excellence.');
            }

            const scrollText = document.querySelector('.floating');
            if (scrollText && scrollText.textContent.includes('Scroll')) {
                scrollText.setAttribute('data-translate', 'Scroll to discover');
            }

            // About section
            const ourStorySpan = document.querySelector('span.text-primary.text-sm.font-bold.uppercase.tracking-widest');
            if (ourStorySpan && ourStorySpan.textContent.includes('OUR STORY')) {
                ourStorySpan.setAttribute('data-translate', 'OUR STORY');
            }

            const laborText = document.querySelector('h2.text-4xl.lg\\:text-6xl .text-gray-dark');
            if (laborText && laborText.textContent.includes('Ours is a labor of')) {
                laborText.setAttribute('data-translate', 'Ours is a labor of');
            }

            const loveText = document.querySelector('h2.text-4xl.lg\\:text-6xl .text-primary');
            if (loveText && loveText.textContent.includes('love')) {
                loveText.setAttribute('data-translate', 'love');
            }
        }
   // Update copyright year dynamically
        document.addEventListener('DOMContentLoaded', function () {
            const currentYear = new Date().getFullYear();
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = currentYear;
            }
        });

        