/**
 * Birthmark IT Solutions - Enhanced Main JavaScript File
 * Includes:
 * - Accessible navigation
 * - Form validation
 * - Testimonial slider
 * - Service tabs
 * - FAQ accordion
 * - Pricing toggle
 */

document.addEventListener('DOMContentLoaded', function() {
  // ===== Mobile Menu Toggle =====
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      navList.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // ===== Accessible Dropdown Menus =====
  document.querySelectorAll('[aria-haspopup="true"]').forEach(dropdownTrigger => {
    dropdownTrigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        
        // Close other dropdowns
        document.querySelectorAll('[aria-haspopup="true"]').forEach(item => {
          if (item !== this) {
            item.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
      document.querySelectorAll('[aria-haspopup="true"]').forEach(item => {
        item.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ===== Service Tabs =====
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length && tabContents.length) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Hide all tab contents
        tabContents.forEach(content => {
          content.hidden = true;
          content.classList.remove('active');
        });
        
        // Deactivate all buttons
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        
        // Activate clicked button
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Show corresponding content
        const tabId = this.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
          tabContent.hidden = false;
          tabContent.classList.add('active');
        }
      });
    });
    
    // Activate first tab by default
    tabButtons[0].click();
  }

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      const answer = document.getElementById(this.getAttribute('aria-controls'));
      answer.setAttribute('aria-hidden', expanded);
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    });
  });

  // ===== Pricing Toggle =====
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', function() {
      document.querySelectorAll('.price').forEach(price => {
        price.style.display = 'none';
      });
      
      const period = this.checked ? 'annually' : 'monthly';
      document.querySelectorAll(`.price.${period}`).forEach(price => {
        price.style.display = 'block';
      });
    });
    
    // Trigger change event to set initial state
    billingToggle.dispatchEvent(new Event('change'));
  }

  // ===== Form Validation =====
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const showValidationError = (element, message) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    } else {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.id = `${element.id}-error`;
      errorElement.setAttribute('role', 'alert');
      element.parentNode.insertBefore(errorElement, element.nextSibling);
    }
    element.classList.add('error');
    element.parentNode.classList.add('error');
  };

  const clearValidationError = (element) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.style.display = 'none';
    }
    element.classList.remove('error');
    element.parentNode.classList.remove('error');
  };

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      // Name validation
      const name = this.querySelector('#name');
      if (!name.value.trim()) {
        showValidationError(name, 'Please enter your name');
        isValid = false;
      } else {
        clearValidationError(name);
      }
      
      // Email validation
      const email = this.querySelector('#email');
      if (!email.value.trim()) {
        showValidationError(email, 'Please enter your email');
        isValid = false;
      } else if (!validateEmail(email.value)) {
        showValidationError(email, 'Please enter a valid email');
        isValid = false;
      } else {
        clearValidationError(email);
      }
      
      // Message validation
      const message = this.querySelector('#message');
      if (!message.value.trim()) {
        showValidationError(message, 'Please enter your message');
        isValid = false;
      } else {
        clearValidationError(message);
      }
      
      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <h3>Thank you for your message!</h3>
          <p>We'll get back to you within 24 hours.</p>
        `;
        this.parentNode.replaceChild(successMsg, this);
        
        // In production, you would add AJAX form submission here
        // const formData = new FormData(this);
        // fetch('process-form.php', {
        //   method: 'POST',
        //   body: formData
        // }).then(response => {
        //   if (response.ok) {
        //     this.parentNode.replaceChild(successMsg, this);
        //   }
        // });
      }
    });
  }

  // ===== Testimonial Slider =====
  const initSlider = () => {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentIndex = 0;
    let interval;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    // Navigation
    const goToSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.setAttribute('aria-hidden', i !== index);
      });
      
      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-current', i === index);
      });
      
      currentIndex = index;
      resetInterval();
    };

    // Auto-rotation control
    const resetInterval = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, 5000);
    };

    // Initialize
    goToSlide(0);

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', resetInterval);

    // Button controls
    document.querySelector('.slider-prev')?.addEventListener('click', () => {
      goToSlide((currentIndex - 1 + slides.length) % slides.length);
    });
    
    document.querySelector('.slider-next')?.addEventListener('click', () => {
      goToSlide((currentIndex + 1) % slides.length);
    });
  };

  // Initialize slider
  initSlider();

  // ===== Smooth Scrolling for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
// Ticker Strip Functionality
document.addEventListener('DOMContentLoaded', function() {
  const ticker = document.querySelector('.ticker-content');
  if (ticker) {
    // Double the content for seamless looping
    const tickerItems = ticker.innerHTML;
    ticker.innerHTML = tickerItems + tickerItems;
    
    // Calculate width and set animation duration based on content
    const tickerWidth = ticker.scrollWidth/2;
    const duration = Math.max(20, tickerWidth/50); // Minimum 20s
    
    // Apply dynamic duration
    ticker.style.animationDuration = duration + 's';
    
    // Reset animation when tab becomes visible
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        ticker.style.animation = 'none';
        void ticker.offsetWidth; // Trigger reflow
        ticker.style.animation = `ticker ${duration}s linear infinite`;
      }
    });
  }
});

  // ===== Current Year in Footer =====
  document.getElementById('year').textContent = new Date().getFullYear();
});