document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navOptions = document.querySelector(".nav-options");

  if (navToggle && navOptions) {
    navToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      navOptions.classList.toggle("active");
      // Toggle Tailwind classes for visibility
      if (navOptions.classList.contains("active")) {
        navOptions.classList.remove(
          "opacity-0",
          "invisible",
          "-translate-y-2.5"
        );
        navOptions.classList.add("opacity-100", "visible", "translate-y-0");
      } else {
        navOptions.classList.remove("opacity-100", "visible", "translate-y-0");
        navOptions.classList.add("opacity-0", "invisible", "-translate-y-2.5");
      }
    });

    document.addEventListener("click", function (event) {
      if (
        navOptions.classList.contains("active") &&
        !navToggle.contains(event.target) &&
        !navOptions.contains(event.target)
      ) {
        navOptions.classList.remove("active");
        navOptions.classList.remove("opacity-100", "visible", "translate-y-0");
        navOptions.classList.add("opacity-0", "invisible", "-translate-y-2.5");
      }
    });

    const navOptionsList = navOptions.querySelectorAll(".nav-option");
    navOptionsList.forEach((option) => {
      option.addEventListener("click", function () {
        navOptions.classList.remove("active");
        navOptions.classList.remove("opacity-100", "visible", "translate-y-0");
        navOptions.classList.add("opacity-0", "invisible", "-translate-y-2.5");
      });
    });
  }

  // Carousel Navigation
  const carouselLeftIndicator = document.getElementById(
    "carouselLeftIndicator"
  );
  const carouselRightIndicator = document.getElementById(
    "carouselRightIndicator"
  );
  const carousel = document.querySelector(".project-carousel");

  if (carousel && carouselLeftIndicator && carouselRightIndicator) {
    let currentIndex = 0;
    const items = Array.from(carousel.children);
    const totalItems = items.length;

    function getVisibleItems() {
      if (window.innerWidth < 640) return 1;
      return 2;
    }

    function updateCarousel() {
      const visibleItems = getVisibleItems();
      const itemWidth = items[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(carousel).gap) || 30;
      const scrollAmount = currentIndex * (itemWidth + gap);

      carousel.style.transform = `translateX(-${scrollAmount}px)`;

      carouselLeftIndicator.disabled = currentIndex === 0;
      carouselLeftIndicator.style.opacity = currentIndex === 0 ? "0.5" : "1";

      const maxIndex = totalItems - visibleItems;
      carouselRightIndicator.disabled = currentIndex >= maxIndex;
      carouselRightIndicator.style.opacity =
        currentIndex >= maxIndex ? "0.5" : "1";
    }

    carouselLeftIndicator.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    carouselRightIndicator.addEventListener("click", () => {
      const visibleItems = getVisibleItems();
      const maxIndex = totalItems - visibleItems;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const visibleItems = getVisibleItems();
        const maxIndex = totalItems - visibleItems;
        if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }
        updateCarousel();
      }, 250);
    });

    // Initial setup
    updateCarousel();
  }

  // Accordion for "Why Choose Us" section
  const chooseUsDetails = document.querySelectorAll(".choose-us-detail");
  chooseUsDetails.forEach((detail) => {
    const label = detail.querySelector(".choose-us-detail-label");
    if (label) {
      const toggleAccordion = () => {
        const wasActive = detail.classList.contains("active");

        chooseUsDetails.forEach((d) => d.classList.remove("active"));

        if (!wasActive) {
          detail.classList.add("active");
        }
      };

      label.addEventListener("click", toggleAccordion);
      label.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleAccordion();
        }
      });
    }
  });

  // Accordion for FAQ section
  const faqCards = document.querySelectorAll(".faq-card");
  faqCards.forEach((card, index) => {
    // Initially open the first FAQ item
    if (index === 0) {
      card.classList.add("active");
    }

    const toggleFAQ = () => {
      const wasActive = card.classList.contains("active");
      faqCards.forEach((c) => c.classList.remove("active"));
      if (!wasActive) {
        card.classList.add("active");
      }
    };

    card.addEventListener("click", toggleFAQ);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFAQ();
      }
    });
  });
});
