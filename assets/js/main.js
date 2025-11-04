document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const visible = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!visible));
      menu.style.display = visible ? 'none' : 'block';
    });
  }

  // Lightweight image and video preview
  document.querySelectorAll('[data-lightbox] a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
      
      if (href.endsWith('.mp4')) {
        // Video modal
        const video = document.createElement('video');
        video.src = href;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '92%';
        video.style.maxHeight = '92%';
        video.style.borderRadius = '12px';
        video.style.boxShadow = '0 20px 60px rgba(0,0,0,.6)';
        overlay.appendChild(video);
      } else {
        // Image modal
        const img = document.createElement('img');
        img.src = href;
        img.style.maxWidth = '92%';
        img.style.maxHeight = '92%';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 20px 60px rgba(0,0,0,.6)';
        overlay.appendChild(img);
      }
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
        }
      });
      document.body.appendChild(overlay);
    });
  });

  // Video thumbnail hover preview
  document.querySelectorAll('.gallery .video-item video').forEach(video => {
    video.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // Carousel functionality
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselDots = document.getElementById('carouselDots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  if (carouselTrack && carouselDots) {
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let slidesPerView = 1;
    
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) slidesPerView = 3;
      else if (window.innerWidth >= 768) slidesPerView = 2;
      else slidesPerView = 1;
    };
    
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      carouselDots.appendChild(dot);
    });
    
    const updateCarousel = () => {
      const slideWidth = carouselTrack.offsetWidth / slidesPerView;
      carouselTrack.scrollLeft = currentIndex * slideWidth;
      
      // Update dots
      carouselDots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      
      // Update button states
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    };
    
    const goToSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    };
    
    const nextSlide = () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    };
    
    const prevSlide = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    };
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play carousel (optional)
    let autoplayInterval = setInterval(() => {
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }, 4000);
    
    // Pause autoplay on hover
    const carouselContainer = carouselTrack.closest('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
          if (currentIndex >= maxIndex) {
            currentIndex = 0;
          } else {
            currentIndex++;
          }
          updateCarousel();
        }, 4000);
      });
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) nextSlide();
      if (touchEndX > touchStartX + 50) prevSlide();
    };
    
    updateCarousel();
  }
});

