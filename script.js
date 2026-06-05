document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ==========================================================================
  // THEME SWITCHING SYSTEM
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme preference or default to system preference (dark theme is default)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      showToast('Switched to Light Mode', 'sun');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      showToast('Switched to Dark Mode', 'moon');
    }
  });

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    
    // Toggle mobile menu icon from hamburger to cross
    if (isOpen) {
      mobileToggle.querySelector('.menu-icon').style.display = 'none';
      mobileToggle.querySelector('.close-icon').style.display = 'block';
      body.style.overflow = 'hidden'; // Stop page scrolling when menu is open
    } else {
      mobileToggle.querySelector('.menu-icon').style.display = 'block';
      mobileToggle.querySelector('.close-icon').style.display = 'none';
      body.style.overflow = '';
    }
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile navigation drawer when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Sticky navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const words = [
    'Full-Stack Web Experiences',
    'Robust E-Commerce Sites',
    'Optimized Web3 Components',
    'Responsive User Interfaces'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      // Typing characters
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Determine state changes
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Launch typewriter animation
  typeEffect();

  // ==========================================================================
  // INTERSECTION OBSERVERS (SCROLL SPY & REVEAL EFFECTS)
  // ==========================================================================
  
  // 1. Scrollspy Active Link Tracker
  const sections = document.querySelectorAll('section');
  const scrollspyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in middle of viewport
    threshold: 0
  };

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollspyOptions);

  sections.forEach(section => scrollspyObserver.observe(section));

  // 2. Scroll Reveal Animations (Elements fading/sliding in)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px', // Trigger slightly before element enters view
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, revealOptions);

  revealElements.forEach(element => revealObserver.observe(element));

  // ==========================================================================
  // FORM SUBMISSION HANDLING
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccessAlert = document.getElementById('form-success');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate button state to sending
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Sending...</span>
      <div class="loader-spinner"></div>
    `;

    // Add inline styles for loading spinner spinner
    if (!document.getElementById('spinner-style')) {
      const style = document.createElement('style');
      style.id = 'spinner-style';
      style.textContent = `
        .loader-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Simulate backend submission delay
    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      
      // Show success alert
      formSuccessAlert.classList.remove('hidden');
      showToast('Message sent successfully!', 'check-circle');

      // Hide success alert after 5 seconds
      setTimeout(() => {
        formSuccessAlert.classList.add('hidden');
      }, 5000);
    }, 1500);
  });

  // ==========================================================================
  // CUSTOM TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message, iconName = 'info') {
    // Remove existing toast if present
    const oldToast = document.querySelector('.custom-toast');
    if (oldToast) oldToast.remove();

    // Create Toast elements
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    // CSS Styling for dynamic toast
    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = `
        .custom-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-sm);
          z-index: 1001;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-title);
          font-size: 0.9rem;
          font-weight: 600;
          animation: slideUpToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), fadeOutToast 0.4s ease 3.6s forwards;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .custom-toast i {
          color: var(--accent);
          width: 1.25rem;
          height: 1.25rem;
        }
        @keyframes slideUpToast {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOutToast {
          from { opacity: 1; }
          to { opacity: 0; transform: translateY(10px); visibility: hidden; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    lucide.createIcons();

    // Remove toast from DOM after animations complete
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  // Handle Mock Demo Links
  const demoLinks = document.querySelectorAll('.demo-alert');
  demoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Demo link clicked. Live environment is simulated!', 'sparkles');
    });
  });
});
