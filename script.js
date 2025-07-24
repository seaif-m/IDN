document.addEventListener('DOMContentLoaded', () => {
    // --- INISIALISASI ELEMEN ---
    const scrollyContainer = document.getElementById('scrolly-container');
    const header = document.getElementById('main-nav');
    const heroScene = document.getElementById('hero-scene');
    const heroContent = document.getElementById('hero-content');
    const featureScene = document.getElementById('feature-scene');
    const regularContent = document.getElementById('regular-content');
    const videoPlaceholder = document.getElementById('video-placeholder');
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const body = document.body;

    // --- LOGIKA SCROLL ---
    const handleScroll = () => {
        if (!scrollyContainer || !regularContent) return;

        const scrollY = window.scrollY;
        const regularContentTop = regularContent.offsetTop;
        const navHeight = 70; // Perkiraan tinggi navbar

        // Kondisi: Apakah kita masih di dalam area scrollytelling?
        if (scrollY < regularContentTop - navHeight) {
            const rect = scrollyContainer.getBoundingClientRect();
            const scrollFraction = Math.max(0, Math.min(1, -rect.top / (scrollyContainer.offsetHeight - window.innerHeight)));

            // Animasi Zoom pada latar belakang hero
            const scale = 1 + scrollFraction * 0.5;
            if (heroScene) heroScene.style.transform = `scale(${scale})`;

            // Animasi Fade-out untuk konten hero
            const contentOpacity = Math.max(0, 1 - scrollFraction * 2.5);
            if (heroContent) heroContent.style.opacity = contentOpacity;
            
            // Kontrol navbar: Fade out dan tetap transparan
            if (header && (!navMenu || !navMenu.classList.contains('active'))) {
                header.classList.remove('scrolled');
                header.style.opacity = Math.max(0, 1 - scrollFraction * 4);
            }

            // PERBAIKAN BUG: Menggunakan nama variabel yang benar (featureScene)
            if(featureScene) {
                const featureOpacity = (scrollFraction - 0.3) / 0.5;
                featureScene.style.opacity = Math.max(0, Math.min(1, featureOpacity));
            }
        } 
        // Kondisi: Kita sudah masuk ke area konten reguler
        else {
            if (header && (!navMenu || !navMenu.classList.contains('active'))) {
                header.classList.add('scrolled'); // Beri latar belakang solid
                header.style.opacity = 1; // Tampilkan kembali sepenuhnya
            }
        }
    };

    // --- LOGIKA MENU MOBILE ---
    const toggleMobileMenu = () => {
        if (!navMenu || !body || !iconMenu || !iconClose) return;

        const isMenuOpen = navMenu.classList.toggle('active');
        body.classList.toggle('no-scroll', isMenuOpen);
        
        iconMenu.classList.toggle('hidden', isMenuOpen);
        iconClose.classList.toggle('hidden', !isMenuOpen);

        if (isMenuOpen) {
            header.classList.add('scrolled');
            header.style.opacity = 1;
        } else {
            handleScroll(); // Setel ulang gaya sesuai posisi scroll saat menu ditutup
        }
    };
    
    // --- LOGIKA PEMUTAR VIDEO YOUTUBE ---
    const playYouTubeVideo = () => {
        if (!videoPlaceholder) return;
        const youtubeId = videoPlaceholder.dataset.youtubeId;
        if (!youtubeId) return;

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');

        while (videoPlaceholder.firstChild) {
            videoPlaceholder.removeChild(videoPlaceholder.firstChild);
        }
        videoPlaceholder.appendChild(iframe);
        videoPlaceholder.style.cursor = 'default';
    };
    
    // --- TAMBAHKAN EVENT LISTENERS ---
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', playYouTubeVideo, { once: true });
    }
    
    // Smooth scroll untuk link internal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (navMenu && navMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Panggil sekali di awal untuk mengatur posisi
    handleScroll();
});
