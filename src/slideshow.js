"use strict";

import { includesReady } from './directives/x-include-html.js';

; (() => {

  // Slideshow
  /**
   * Initialise every `.slideshow` on the page: slide switching, controls,
   * indicators and autoplay.
   */
  const initSlideshow = () => {
    document.querySelectorAll('.slideshow').forEach((slideshow) => {
      let currentIndex = 0;
      const slides = slideshow.querySelectorAll('.slide');
      const totalSlides = slides.length;
      if (!totalSlides) return;
      const nextBtn = slideshow.querySelector('.next');
      const prevBtn = slideshow.querySelector('.prev');
      let indicators = slideshow.querySelector('.indicators');
      let intervalId;
      const intervalTime = parseInt(slideshow.getAttribute('data-interval')) || 5000;

      /**
       * Show one slide by index, update indicators and restart autoplay.
       * @param {number} index - Zero-based index of the slide to show.
       */
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
            });
            indicatorContainer.appendChild(indicator);
          });
          slideshow.appendChild(indicatorContainer);
          indicators = indicatorContainer; // remember it, otherwise a new container is appended on every slide
        }
        currentIndex = index;
        resetInterval();
      };
      /** Advance to the next slide (wraps around to the first). */
      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
      };
      /** Go back to the previous slide (wraps around to the last). */
      const prevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
      };
      /** Restart the autoplay interval so manual navigation doesn't race it. */
      const resetInterval = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, intervalTime);
      };

      if (nextBtn) nextBtn.addEventListener('click', nextSlide);
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      showSlide(currentIndex);
    });
  }
  // Init after x-include-html has inlined fragments (they may contain slideshows)
  includesReady.then(initSlideshow);

})();
