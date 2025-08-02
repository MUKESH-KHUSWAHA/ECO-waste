// Enhanced script.js for Clean and Healthy Area application

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-xmark');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGallery = [];
    let currentImageIndex = 0;

    // Add lightbox to all gallery images
    const galleryImages = document.querySelectorAll('[data-lightbox]');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            const galleryName = this.getAttribute('data-lightbox');
            currentGallery = Array.from(document.querySelectorAll(`[data-lightbox="${galleryName}"]`));
            currentImageIndex = currentGallery.indexOf(this);
            showLightbox(this.src);
        });
    });

    function showLightbox(src) {
        lightboxImg.src = src;
        lightboxModal.classList.remove('hidden');
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightboxModal.classList.add('hidden');
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            lightboxImg.src = currentGallery[currentImageIndex].src;
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            lightboxImg.src = currentGallery[currentImageIndex].src;
        });
    }

    // Close lightbox on outside click
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            lightboxModal.classList.add('hidden');
        }
    });

    // Slogan rotator
    const slogans = [
        "Cleaner Communities, Greener Future",
        "Every Report Makes a Difference",
        "Building Better Tomorrow Together",
        "Your Voice for Clean Environment"
    ];

    const sloganElement = document.getElementById('slogan-rotator');
    if (sloganElement) {
        let currentSlogan = 0;
        setInterval(() => {
            currentSlogan = (currentSlogan + 1) % slogans.length;
            sloganElement.textContent = slogans[currentSlogan];
        }, 3000);
    }

    // Dashboard and reports functionality
    let reports = [];
    let currentFilter = 'all';

    // Load reports from server
    async function loadReports() {
        try {
            const response = await fetch('/api/reports');
            if (response.ok) {
                reports = await response.json();
                renderStatusList();
                renderDashboard();
                updatePriorityBanner();
                updateFilterSummary();
            }
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    }

    // Status color mapping
    const statusColorMap = {
        'Pending': 'bg-yellow-200 text-yellow-800',
        'In Progress': 'bg-blue-200 text-blue-800',
        'Completed': 'bg-green-200 text-green-800',
        'Cancelled': 'bg-red-200 text-red-800'
    };

    // Priority configuration
    const priorityConfig = {
        'Critical': { color: 'border-red-500 text-red-600 bg-red-50', icon: 'fa-exclamation-triangle' },
        'High': { color: 'border-orange-500 text-orange-600 bg-orange-50', icon: 'fa-exclamation' },
        'Medium': { color: 'border-yellow-500 text-yellow-600 bg-yellow-50', icon: 'fa-info' },
        'Low': { color: 'border-green-500 text-green-600 bg-green-50', icon: 'fa-check' }
    };

    function renderStatusList() {
        const statusList = document.getElementById('status-list');
        if (!statusList) return;

        if (reports.length === 0) {
            statusList.innerHTML = '<p class="text-gray-500 text-center py-8">No reports yet. Be the first to report an issue!</p>';
            return;
        }

        statusList.innerHTML = '';
        const filteredReports = getFilteredReports();

        filteredReports.slice(0, 5).forEach(report => {
            const priority = priorityConfig[report.priority] || priorityConfig['Medium'];
            const card = document.createElement('div');
            card.className = `glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${priority.color.includes('red') ? 'border-red-500' : priority.color.includes('orange') ? 'border-orange-500' : 'border-emerald-500'}`;

            card.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">${report.location}</h3>
                        <p class="text-gray-600 mb-3">${report.description}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                            <span><i class="fa-solid fa-calendar mr-1"></i> ${formatDate(report.timestamp)}</span>
                            <span><i class="fa-solid fa-tag mr-1"></i> ${getTypeLabel(report.type)}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <span class="inline-block px-3 py-1 rounded-full font-semibold text-sm ${statusColorMap[report.status] || 'bg-gray-200 text-gray-700'}">
                            ${report.status}
                        </span>
                        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${priority.color}">
                            <i class="fa-solid ${priority.icon}"></i> 
                            ${report.priority}
                        </span>
                    </div>
                </div>
            `;

            statusList.appendChild(card);
        });
    }

    function renderDashboard() {
        const dashboardMap = document.getElementById('dashboard-map');
        if (!dashboardMap) return;

        if (reports.length === 0) {
            dashboardMap.innerHTML = '<p class="text-gray-500 text-center py-8">No reports to display.</p>';
            return;
        }

        dashboardMap.innerHTML = '';
        const filteredReports = getFilteredReports();

        filteredReports.forEach(report => {
            const priority = priorityConfig[report.priority] || priorityConfig['Medium'];
            const card = document.createElement('div');
            card.className = `glass-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${priority.color.includes('red') ? 'border-red-500' : priority.color.includes('orange') ? 'border-orange-500' : 'border-emerald-500'} min-w-[300px]`;

            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="${report.image}" alt="Report" class="w-16 h-16 rounded-xl object-cover shadow-md">
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-800">${report.location}</h4>
                        <p class="text-gray-600 text-sm truncate">${report.description}</p>
                        <div class="inline-block px-3 py-1 rounded-full font-semibold text-sm mt-2 ${statusColorMap[report.status] || 'bg-gray-200 text-gray-700'}">
                            ${report.status}
                        </div>
                        <div class="text-gray-500 text-xs mt-1">${formatDate(report.timestamp)}</div>
                    </div>
                </div>
            `;

            dashboardMap.appendChild(card);
        });
    }

    function getFilteredReports() {
        if (currentFilter === 'all') return reports;

        const filterMap = {
            'garbage': ['garbage', 'cleaning', 'recycling', 'hazardous'],
            'animal_death': ['animal-death'],
            'animal_adopt': ['animal-adopt', 'animal-care']
        };

        return reports.filter(report => filterMap[currentFilter]?.includes(report.type));
    }

    function updatePriorityBanner() {
        const priorityBanner = document.getElementById('priority-banner');
        if (!priorityBanner) return;

        const criticalReports = reports.filter(report => 
            report.priority === 'Critical' && report.status !== 'Completed'
        );

        if (criticalReports.length > 0) {
            priorityBanner.classList.remove('hidden');
        } else {
            priorityBanner.classList.add('hidden');
        }
    }

    function updateFilterSummary() {
        const typeSummary = document.getElementById('type-summary');
        if (!typeSummary) return;

        const filteredReports = getFilteredReports();
        const pending = filteredReports.filter(r => r.status === 'Pending').length;
        const inProgress = filteredReports.filter(r => r.status === 'In Progress').length;
        const completed = filteredReports.filter(r => r.status === 'Completed').length;

        typeSummary.innerHTML = `
            Showing ${filteredReports.length} reports: 
            ${pending} Pending, ${inProgress} In Progress, ${completed} Completed
        `;
    }

    function getTypeLabel(type) {
        const typeLabels = {
            'garbage': 'Garbage',
            'animal-death': 'Animal Death',
            'animal-adopt': 'Animal Adoption',
            'animal-care': 'Animal Care',
            'cleaning': 'Cleaning',
            'recycling': 'Recycling',
            'hazardous': 'Hazardous',
            'other': 'Other'
        };
        return typeLabels[type] || type;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.type-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600', 'text-white');
                btn.classList.add('bg-gradient-to-r', 'from-emerald-100', 'to-emerald-200', 'text-emerald-700');
            });

            // Add active class to clicked button
            this.classList.remove('bg-gradient-to-r', 'from-emerald-100', 'to-emerald-200', 'text-emerald-700');
            this.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600', 'text-white');

            currentFilter = this.getAttribute('data-type');
            renderStatusList();
            renderDashboard();
            updateFilterSummary();
        });
    });

    // Clear reports functionality
    const clearReportsBtn = document.getElementById('clear-reports');
    if (clearReportsBtn) {
        clearReportsBtn.addEventListener('click', async function() {
            const password = prompt('Enter admin password to clear all reports:');
            if (!password) return;

            try {
                const response = await fetch('/api/clear-reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('All reports cleared!');
                    loadReports();
                } else {
                    alert(result.error || 'Failed to clear reports.');
                }
            } catch (error) {
                alert('Failed to clear reports.');
            }
        });
    }

    // Hero video loop
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('timeupdate', function() {
            if (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 5) {
                heroVideo.currentTime = 0;
                heroVideo.play();
            }
        });
    }

    // Modal functionality
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.getElementById('main-navbar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
        }

        lastScrollTop = scrollTop;
    });
    // Auto-hide navbar on scroll - simplified version
    const mainNavbar = document.getElementById('main-navbar');
    if (mainNavbar) {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                mainNavbar.style.transform = 'translateY(-100%)';
            } else {
                mainNavbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });
    }

    // Optional: Ripple effect for floating report button
    const floatingBtn = document.getElementById('floating-report-btn');
    if (floatingBtn) {
        floatingBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'absolute bg-white opacity-30 rounded-full pointer-events-none';
            ripple.style.width = ripple.style.height = '120px';
            ripple.style.left = (e.offsetX - 60) + 'px';
            ripple.style.top = (e.offsetY - 60) + 'px';
            ripple.style.position = 'absolute';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.5s, opacity 0.5s';
            floatingBtn.appendChild(ripple);
            setTimeout(() => {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            }, 10);
            setTimeout(() => ripple.remove(), 600);
        });
    }
    // Card/button hover/active effects (microinteractions) - responsive safe
    if (window.innerWidth > 768) { // Only on desktop
        document.querySelectorAll('.group, .rounded-2xl, .shadow-lg, .shadow-xl').forEach(card => {
            card.addEventListener('mouseenter', () => card.classList.add('ring-2', 'ring-emerald-300'));
            card.addEventListener('mouseleave', () => card.classList.remove('ring-2', 'ring-emerald-300'));
        });
        document.querySelectorAll('button, a').forEach(btn => {
            btn.addEventListener('mousedown', () => btn.classList.add('scale-95'));
            btn.addEventListener('mouseup', () => btn.classList.remove('scale-95'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('scale-95'));
        });
    }
    // Re-initialize AOS on page load (in case of dynamic content)
    if (window.AOS) AOS.init({ once: true, duration: 900, easing: 'ease-out-cubic' });

    // Initialize the application
    loadReports();
});