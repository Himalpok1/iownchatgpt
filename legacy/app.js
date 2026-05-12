// ============================================
// PAGE ROUTING SYSTEM
// ============================================

// Simple client-side routing
const pages = {
  home: document.getElementById('homePage'),
  contact: document.getElementById('contactPage'),
  privacy: document.getElementById('privacyPage'),
  about: document.getElementById('aboutPage')
};

function showPage(pageName, updateHistory = true) {
  // Hide all pages
  Object.values(pages).forEach(page => {
    if (page) page.classList.remove('active');
  });
  
  // Show requested page
  if (pages[pageName]) {
    pages[pageName].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL hash without page jump
    if (updateHistory) {
      history.pushState(null, null, `#${pageName}`);
    }
    
    // Update page title and meta description for SEO
    updatePageMeta(pageName);
  }
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const offsetTop = target.offsetTop - 70; // Account for fixed navbar
  window.scrollTo({
    top: Math.max(0, offsetTop),
    behavior: 'smooth'
  });
}

function updatePageMeta(pageName) {
  const metaData = {
    home: {
      title: 'iownchatgpt - Free Browser Games and Trending Tech Blog',
      description: 'Play free browser games and read trending AI, tech, crypto, and consumer electronics articles.'
    },
    contact: {
      title: 'Contact Us - iownchatgpt',
      description: 'Get in touch with iownchatgpt. Send us your questions, feedback, or game suggestions.'
    },
    privacy: {
      title: 'Privacy Policy - iownchatgpt',
      description: 'Read our privacy policy to understand how we handle your data and privacy.'
    },
    about: {
      title: 'About Us - iownchatgpt',
      description: 'Learn about iownchatgpt and our mission to publish useful browser games with practical guides.'
    }
  };
  
  if (metaData[pageName]) {
    document.title = metaData[pageName].title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaData[pageName].description);
    }
    
    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', metaData[pageName].title);
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', metaData[pageName].description);
  }
}

// Handle page links
document.querySelectorAll('.page-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageName = link.getAttribute('data-page');
    const href = link.getAttribute('href') || '';
    const sectionId = href.startsWith('#') ? href.substring(1) : '';
    if (pageName) {
      showPage(pageName);
      if (pageName === 'home' && sectionId && sectionId !== 'home') {
        setTimeout(() => {
          scrollToSection(sectionId);
          history.replaceState(null, null, `#${sectionId}`);
        }, 120);
      }
    }
  });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const hash = window.location.hash.substring(1);
  const pageName = hash || 'home';
  if (pages[pageName]) {
    showPage(pageName, false);
  } else {
    showPage('home', false);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 120);
    }
  }
});

// Initialize page on load
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1);
  const pageName = hash || 'home';
  
  if (pages[pageName]) {
    showPage(pageName, false);
  } else {
    showPage('home', false);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 120);
    }
  }
});

// ============================================
// MOBILE MENU
// ============================================

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// ============================================
// GAME REQUEST FORM
// ============================================

const gameRequestForm = document.getElementById('gameRequestForm');
const gameRequestMessage = document.getElementById('gameRequestMessage');

if (gameRequestForm) {
  gameRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('requestName').value.trim();
    const email = document.getElementById('requestEmail').value.trim();
    const gameRequest = document.getElementById('requestGame').value.trim();
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name || !email || !gameRequest) {
      showFormMessage(gameRequestMessage, 'Please fill in all fields.', 'error');
      return;
    }
    
    if (!emailRegex.test(email)) {
      showFormMessage(gameRequestMessage, 'Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable submit button
    const submitButton = gameRequestForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Submit to Web3Forms
    try {
      const formData = new FormData();
      formData.append('access_key', 'ba355a9f-5ad5-4c9d-8d0d-878a486380b0');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', 'Game Request from ' + name);
      formData.append('message', `Game Request: ${gameRequest}`);
      formData.append('from_name', 'iownchatgpt Game Requests');
      formData.append('to_email', 'mailme@himal.info.np');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormMessage(gameRequestMessage, '🎉 Thank you! Your game request has been submitted successfully. We\'ll review it soon!', 'success');
        gameRequestForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showFormMessage(gameRequestMessage, '❌ There was an error submitting your request. Please try again or contact us directly.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Request';
    }
    
    // Reset message after 8 seconds
    setTimeout(() => {
      gameRequestMessage.textContent = '';
      gameRequestMessage.className = 'form-message';
    }, 8000);
  });
}

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name || !email || !subject || !message) {
      showFormMessage(contactFormMessage, 'Please fill in all fields.', 'error');
      return;
    }
    
    if (!emailRegex.test(email)) {
      showFormMessage(contactFormMessage, 'Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Submit to Web3Forms
    try {
      const formData = new FormData();
      formData.append('access_key', 'ba355a9f-5ad5-4c9d-8d0d-878a486380b0');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('from_name', 'iownchatgpt Contact Form');
      formData.append('to_email', 'mailme@himal.info.np');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormMessage(contactFormMessage, '✅ Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showFormMessage(contactFormMessage, '❌ There was an error sending your message. Please try again or contact us directly at mailme@himal.info.np', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
    
    // Reset message after 8 seconds
    setTimeout(() => {
      contactFormMessage.textContent = '';
      contactFormMessage.className = 'form-message';
    }, 8000);
  });
}

// Form message helper function
function showFormMessage(element, message, type) {
  if (element) {
    element.textContent = message;
    element.className = `form-message ${type}`;
  }
}

// Smooth scroll for anchor links (only for same-page anchors)
document.querySelectorAll('a[href^="#"]:not(.page-link)').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Only prevent default for section anchors, not page navigation
    if (href && href.includes('#') && !this.classList.contains('page-link')) {
      const targetId = href.split('#')[1];
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe game cards and feature cards
const animateElements = document.querySelectorAll('.game-card, .feature-card, .coming-soon-card');
animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Active navigation highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinksArray = Array.from(navLinks);

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinksArray.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--color-cyan)';
    }
  });
});

// ============================================
// SEO & PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add structured data for better SEO
function addStructuredData() {
  // This is already in HTML but we can add dynamic data if needed
  console.log('Structured data loaded for SEO');
}

addStructuredData();

// ============================================
// SETUP INSTRUCTIONS FOR USER
// ============================================

console.log('%c🎮 iownchatgpt - Free Browser Arcade Games', 'color: #00ffff; font-size: 16px; font-weight: bold;');
console.log('%c✅ Web3Forms email delivery is active!', 'color: #34c759; font-size: 14px;');
console.log('All form submissions will be sent to mailme@himal.info.np');
