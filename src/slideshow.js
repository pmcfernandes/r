"use strict";

; (() => {

  // Slideshow
  const initSlideshow = () => {
    document.querySelectorAll('.slideshow').forEach((slideshow) => {
      let currentIndex = 0;
      const slides = slideshow.querySelectorAll('.slide');
      const totalSlides = slides.length;
      const nextBtn = slideshow.querySelector('.next');
      const prevBtn = slideshow.querySelector('.prev');
      const indicators = slideshow.querySelector('.indicators');
      let intervalId;
      const intervalTime = parseInt(slideshow.getAttribute('data-interval')) || 5000;

      const showSlide = (index) => {
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? 'block' : 'none';
        });
        if (indicators) {
          indicators.querySelectorAll('.indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
          });
        } else {
          // Create indicators if they don't exist
          const indicatorContainer = document.createElement('div');
          indicatorContainer.className = 'indicators';
          slides.forEach((_, i) => {
            const indicator = document.createElement('span');
            indicator.className = 'indicator' + (i === index ? ' active' : '');
            indicator.addEventListener('click', () => {
              currentIndex = i;
              showSlide(currentIndex);
              resetInterval();
            });
            indicatorContainer.appendChild(indicator);
          });
          slideshow.appendChild(indicatorContainer);
        }
        currentIndex = index;
        resetInterval();
      };
      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
      };
      const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
      };
      const resetInterval = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, intervalTime);
      };

      if (nextBtn) nextBtn.addEventListener('click', nextSlide);
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      showSlide(currentIndex);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlideshow);
  } else {
    initSlideshow();
  }

})();
