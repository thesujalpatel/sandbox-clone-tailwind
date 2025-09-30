document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navOptions = document.querySelector(".nav-options");
  const carouselLeftIndicator = document.getElementById(
    "carouselLeftIndicator"
  );
  const carouselRightIndicator = document.getElementById(
    "carouselRightIndicator"
  );
  const carousel = document.querySelector(".project-carousel");

  if (navToggle && navOptions) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navOptions.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        !navToggle.contains(event.target) &&
        !navOptions.contains(event.target)
      ) {
        navToggle.classList.remove("active");
        navOptions.classList.remove("active");
      }
    });

    const navOptionsList = navOptions.querySelectorAll(".nav-option");
    navOptionsList.forEach((option) => {
      option.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navOptions.classList.remove("active");
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navToggle.classList.remove("active");
        navOptions.classList.remove("active");
      }
    });
  }

  // Carousel Navigation
  if (carousel && carouselLeftIndicator && carouselRightIndicator) {
    let currentIndex = 0;
    const items = carousel.children;
    const totalItems = items.length;

    // Get current breakpoint to ensure JS and CSS are in sync
    function getCurrentBreakpoint() {
      const width = window.innerWidth;
      if (width <= 640) return "mobile-small"; // Small mobile with different padding
      if (width <= 768) return "mobile";
      if (width <= 920) return "tablet";
      return "desktop";
    }

    // Calculate precise scroll distance for perfect centering
    function getScrollDistance() {
      const container = carousel.parentElement;
      const containerWidth = container.offsetWidth;
      const breakpoint = getCurrentBreakpoint();

      if (breakpoint === "mobile-small" || breakpoint === "mobile") {
        // Mobile: Use actual item width measurement for precision
        const firstItem = carousel.children[0];
        if (firstItem) {
          const itemStyle = window.getComputedStyle(firstItem);
          const itemWidth = firstItem.offsetWidth;
          const gap = parseInt(itemStyle.marginRight) || 30;
          return itemWidth + gap;
        }

        // Fallback calculation
        const gap = 30;
        let padding;
        if (breakpoint === "mobile-small") {
          padding = 40; // 20px on each side for small mobile
        } else {
          padding = 100; // 50px on each side for regular mobile
        }
        const availableWidth = containerWidth - padding;
        return availableWidth + gap;
      } else if (breakpoint === "tablet") {
        // Tablet: 48% width items, calculate exact item width + gap
        const gap = 30;
        const padding = 100; // 50px on each side
        const availableWidth = containerWidth - padding;
        const itemWidth = availableWidth * 0.48;
        return itemWidth + gap;
      } else {
        // Desktop: 49% width items, calculate exact item width + gap
        const gap = 30;
        const padding = 100; // 50px on each side
        const availableWidth = containerWidth - padding;
        const itemWidth = availableWidth * 0.49;
        return itemWidth + gap;
      }
    }

    // Get maximum number of steps based on visible items
    function getMaxSteps() {
      const breakpoint = getCurrentBreakpoint();
      if (breakpoint === "mobile-small" || breakpoint === "mobile") {
        return Math.max(0, totalItems - 1); // Show 1 item at a time on mobile
      } else {
        return Math.max(0, totalItems - 2); // Show 2 items at a time on desktop/tablet
      }
    }

    // Update carousel position with smooth transition
    function updateCarouselPosition(disableTransition = false) {
      if (disableTransition) {
        // Temporarily disable transition for resize events
        const originalTransition = carousel.style.transition;
        carousel.style.transition = "none";

        setTimeout(() => {
          carousel.style.transition = originalTransition;
        }, 50);
      }

      const distance = currentIndex * getScrollDistance();
      carousel.style.transform = `translateX(-${distance}px)`;
    }

    // Left arrow click
    carouselLeftIndicator.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarouselPosition();

        // Update button states
        updateNavigationButtons();
      }
    });

    // Right arrow click
    carouselRightIndicator.addEventListener("click", function () {
      const maxSteps = getMaxSteps();
      if (currentIndex < maxSteps) {
        currentIndex++;
        updateCarouselPosition();

        // Update button states
        updateNavigationButtons();
      }
    });

    // Update navigation button states
    function updateNavigationButtons() {
      const maxSteps = getMaxSteps();

      // Update left button state
      if (currentIndex <= 0) {
        carouselLeftIndicator.style.opacity = "0.5";
        carouselLeftIndicator.style.pointerEvents = "none";
      } else {
        carouselLeftIndicator.style.opacity = "1";
        carouselLeftIndicator.style.pointerEvents = "auto";
      }

      // Update right button state
      if (currentIndex >= maxSteps) {
        carouselRightIndicator.style.opacity = "0.5";
        carouselRightIndicator.style.pointerEvents = "none";
      } else {
        carouselRightIndicator.style.opacity = "1";
        carouselRightIndicator.style.pointerEvents = "auto";
      }
    }

    // Initialize button states
    updateNavigationButtons();

    // Handle window resize with debouncing to prevent animation glitches
    let resizeTimeout;
    let lastBreakpoint = getCurrentBreakpoint();

    window.addEventListener("resize", function () {
      // Clear previous timeout
      clearTimeout(resizeTimeout);

      // Debounce resize events to prevent rapid recalculations
      resizeTimeout = setTimeout(() => {
        const currentBreakpoint = getCurrentBreakpoint();

        // Only recalculate if breakpoint actually changed
        if (currentBreakpoint !== lastBreakpoint) {
          lastBreakpoint = currentBreakpoint;

          // Recalculate position after breakpoint change
          const maxSteps = getMaxSteps();
          currentIndex = Math.min(currentIndex, maxSteps);
          updateCarouselPosition(true); // Disable transition during resize
        } else {
          // Just update position for same breakpoint (handles zooming, etc.)
          updateCarouselPosition(true);
        }
      }, 150); // 150ms debounce delay
    });

    // Optional: Add touch/swipe support
    // let startX = 0;
    // let isDragging = false;

    // carousel.addEventListener("touchstart", function (e) {
    //   startX = e.touches[0].clientX;
    //   isDragging = true;
    // });

    // carousel.addEventListener("touchmove", function (e) {
    //   if (!isDragging) return;
    //   e.preventDefault();
    // });

    // carousel.addEventListener("touchend", function (e) {
    //   if (!isDragging) return;
    //   isDragging = false;

    //   const endX = e.changedTouches[0].clientX;
    //   const diffX = startX - endX;

    //   if (Math.abs(diffX) > 50) {
    //     // Minimum swipe distance
    //     if (diffX > 0) {
    //       // Swipe left - go to next
    //       carouselRightIndicator.click();
    //     } else {
    //       // Swipe right - go to previous
    //       carouselLeftIndicator.click();
    //     }
    //   }
    // });

    // Mouse wheel support
    // carousel.addEventListener("wheel", function (e) {
    //   if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    //     // Horizontal scroll - let it pass
    //     return;
    //   }

    //   // Vertical scroll - convert to carousel navigation
    //   e.preventDefault();
    //   if (e.deltaY > 0) {
    //     carouselRightIndicator.click();
    //   } else {
    //     carouselLeftIndicator.click();
    //   }
    // });
  }

  const chooseUsDetails = document.querySelectorAll(".choose-us-detail");

  chooseUsDetails.forEach((detail) => {
    const label = detail.querySelector(".choose-us-detail-label");
    const content = detail.querySelector(".choose-us-detail-content");

    if (label && content) {
      label.setAttribute("tabindex", "0");
      label.setAttribute("role", "button");
      label.setAttribute("aria-expanded", "false");

      const toggleDropdown = function () {
        const isActive = detail.classList.contains("active");

        chooseUsDetails.forEach((otherDetail) => {
          if (otherDetail !== detail) {
            otherDetail.classList.remove("active");
            const otherLabel = otherDetail.querySelector(
              ".choose-us-detail-label"
            );
            if (otherLabel) {
              otherLabel.setAttribute("aria-expanded", "false");
            }
          }
        });

        if (isActive) {
          detail.classList.remove("active");
          label.setAttribute("aria-expanded", "false");
        } else {
          detail.classList.add("active");
          label.setAttribute("aria-expanded", "true");
        }
      };

      label.addEventListener("click", toggleDropdown);

      label.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDropdown();
        }
      });
    }
  });

  const faqCards = document.querySelectorAll(".faq-card");

  faqCards.forEach((card) => {
    const question = card.querySelector(".faq-card-question");
    const answer = card.querySelector(".faq-card-answer");

    if (question && answer) {
      card.classList.remove("active");

      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-expanded", "false");

      const toggleFAQ = function () {
        const isActive = card.classList.contains("active");

        faqCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("active");
            otherCard.setAttribute("aria-expanded", "false");
          }
        });

        if (isActive) {
          card.classList.remove("active");
          card.setAttribute("aria-expanded", "false");
        } else {
          card.classList.add("active");
          card.setAttribute("aria-expanded", "true");
        }
      };

      card.addEventListener("click", toggleFAQ);
    }
  });
});
