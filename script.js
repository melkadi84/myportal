/**
 * Mohamed Elkadi - Personal Brand Website
 * Interactive Logic, Theme Switching (Light/Dark), & Cloudflare Form Handler
 */

// Configuration: Enter your Cloudflare Worker URL here once deployed:
// Example: 'https://melkadi-contact.your-subdomain.workers.dev'
const CLOUDFLARE_WORKER_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initAppFilters();
  initCatalogSearch();
  initContactForm();
  initSmoothScroll();
  initTimelineScrollAnimation();
  initBackToTop();
  initCollapsibleSections();
  initTimelineDateClicks();
});

/* ==========================================================================
   Theme Switcher (Light Default & Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('elkadi_theme') || 'light';

  // Apply theme
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('elkadi_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

/* ==========================================================================
   Navigation Bar
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll handler to decrease fixed navbar size when scrolled
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section highlighting
  const observer = new IntersectionObserver((entries) => {
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
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   Applications & Solutions Filtering
   ========================================================================== */
function initAppFilters() {
  const filterButtons = document.querySelectorAll('.apps-filter-bar .filter-btn');
  const appCards = document.querySelectorAll('.apps-grid .app-card');
  const appsWrapper = document.getElementById('appsCollapsible');
  const appsShowMoreArea = document.getElementById('appsShowMoreArea');

  if (!filterButtons.length || !appCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      appCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (filterValue === 'm365' && category.includes('m365'))) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      // When filtering to a specific sub-category, show all cards matching it
      if (filterValue !== 'all') {
        if (appsWrapper) appsWrapper.classList.remove('collapsed');
        if (appsShowMoreArea) appsShowMoreArea.style.display = 'none';
      } else {
        // When showing all solutions, restore the toggle area
        if (appsShowMoreArea) appsShowMoreArea.style.display = 'flex';
        const appsToggleBtn = document.getElementById('appsToggleBtn');
        if (appsToggleBtn && !appsToggleBtn.classList.contains('expanded')) {
          if (appsWrapper) appsWrapper.classList.add('collapsed');
        }
      }
    });
  });
}

/* ==========================================================================
   SELP & Courses Catalog Search & Year Filter
   ========================================================================== */
function initCatalogSearch() {
  const searchInput = document.getElementById('catalogSearchInput');
  const yearButtons = document.querySelectorAll('.year-filter-btn');
  const yearGroups = document.querySelectorAll('.catalog-year-groups .year-group');

  let activeYear = 'all';
  let searchTerm = '';

  function applyCatalogFilter() {
    yearGroups.forEach(group => {
      const groupYear = group.getAttribute('data-year');
      const yearMatches = activeYear === 'all' || activeYear === groupYear;

      let hasVisibleChild = false;
      const itemsInGroup = group.querySelectorAll('.course-item');

      itemsInGroup.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);

        if (yearMatches && matchesSearch) {
          item.style.display = 'flex';
          hasVisibleChild = true;
        } else {
          item.style.display = 'none';
        }
      });

      group.style.display = hasVisibleChild ? 'block' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyCatalogFilter();
    });
  }

  if (yearButtons.length) {
    yearButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        yearButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeYear = btn.getAttribute('data-year');
        applyCatalogFilter();
      });
    });
  }
}

/* ==========================================================================
   Contact Form connected to Cloudflare D1 / Worker
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span>`;

    const payload = {
      name,
      email,
      subject: subject || 'Portfolio Contact',
      message,
      timestamp: new Date().toISOString()
    };

    try {
      if (CLOUDFLARE_WORKER_ENDPOINT) {
        // Live Cloudflare Worker request
        const res = await fetch(CLOUDFLARE_WORKER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error('Failed to deliver message');
        }

        const result = await res.json();
        showStatus(result.message || 'Thank you! Your message has been sent successfully. I will get back to you shortly.', 'success');
      } else {
        // Fallback simulation & local storage log
        const existingMessages = JSON.parse(localStorage.getItem('melkadi_messages') || '[]');
        existingMessages.push(payload);
        localStorage.setItem('melkadi_messages', JSON.stringify(existingMessages));

        showStatus('Thank you! Your message has been sent successfully. I will get back to you shortly.', 'success');
      }

      form.reset();
    } catch (err) {
      console.error('Contact Form Error:', err);
      showStatus('An error occurred while sending your message. Please try again or reach out on LinkedIn.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function showStatus(text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = `form-status ${type}`;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   Experience Timeline Scroll Animation & Hide Scrolled Items
   ========================================================================== */
function initTimelineScrollAnimation() {
  const timeline = document.querySelector('.experience-timeline');
  const items = document.querySelectorAll('.timeline-item');
  if (!timeline || !items.length) return;

  timeline.classList.add('timeline-animated');

  function updateTimeline() {
    const viewportHeight = window.innerHeight;
    const enterThreshold = viewportHeight * 0.88;
    const exitThreshold = 40;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();

      if (rect.bottom < exitThreshold) {
        // Scrolled past the top of the screen: hide smoothly
        item.classList.remove('timeline-visible');
        item.classList.add('timeline-scrolled-past');
      } else if (rect.top < enterThreshold) {
        // Active in viewport: show with smooth animation
        item.classList.add('timeline-visible');
        item.classList.remove('timeline-scrolled-past');
      } else {
        // Not yet reached (below viewport)
        item.classList.remove('timeline-visible');
        item.classList.remove('timeline-scrolled-past');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateTimeline, { passive: true });
  updateTimeline();
}

/* ==========================================================================
   Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  function handleBackToTopVisibility() {
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Collapsible Sections System (Default Heights & Show More / Show Less)
   ========================================================================== */
function initCollapsibleSections() {
  const configs = [
    {
      btnId: 'appsToggleBtn',
      wrapperId: 'appsCollapsible',
      moreText: 'Show More Solutions',
      moreBadge: '+9 More',
      lessText: 'Show Fewer Solutions',
      lessBadge: 'Collapse',
      sectionId: 'applications'
    },
    {
      btnId: 'experienceToggleBtn',
      wrapperId: 'experienceCollapsible',
      moreText: 'Show Earlier Experience',
      moreBadge: '+4 Earlier Roles',
      lessText: 'Show Recent Roles Only',
      lessBadge: 'Collapse',
      sectionId: 'experience'
    },
    {
      btnId: 'certsToggleBtn',
      wrapperId: 'certsCollapsible',
      moreText: 'Show More Certifications',
      moreBadge: '+6 More',
      lessText: 'Show Fewer Certifications',
      lessBadge: 'Collapse',
      sectionId: 'certifications'
    }
  ];

  configs.forEach(cfg => {
    const btn = document.getElementById(cfg.btnId);
    const wrapper = document.getElementById(cfg.wrapperId);
    if (!btn || !wrapper) return;

    btn.addEventListener('click', () => {
      const isCollapsed = wrapper.classList.contains('collapsed');

      if (isCollapsed) {
        // Expand section
        wrapper.classList.remove('collapsed');
        btn.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        const textSpan = btn.querySelector('.btn-show-more-text');
        const badgeSpan = btn.querySelector('.badge-count');
        if (textSpan) textSpan.textContent = cfg.lessText;
        if (badgeSpan) badgeSpan.textContent = cfg.lessBadge;
      } else {
        // Collapse section
        wrapper.classList.add('collapsed');
        btn.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        const textSpan = btn.querySelector('.btn-show-more-text');
        const badgeSpan = btn.querySelector('.badge-count');
        if (textSpan) textSpan.textContent = cfg.moreText;
        if (badgeSpan) badgeSpan.textContent = cfg.moreBadge;

        // Smooth scroll back to section header so user stays oriented
        const section = document.getElementById(cfg.sectionId);
        if (section) {
          const headerOffset = 70;
          const sectionPos = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: sectionPos, behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   Clickable Timeline Dates & Role Focus Spotlight
   ========================================================================== */
function initTimelineDateClicks() {
  const dateButtons = document.querySelectorAll('.timeline-year-badge');
  const expWrapper = document.getElementById('experienceCollapsible');
  const expBtn = document.getElementById('experienceToggleBtn');

  dateButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      const targetItem = document.getElementById(targetId);
      if (!targetItem) return;

      // If the timeline is currently collapsed, expand it so the role is fully visible
      if (expWrapper && expWrapper.classList.contains('collapsed')) {
        expWrapper.classList.remove('collapsed');
        if (expBtn) {
          expBtn.classList.add('expanded');
          expBtn.setAttribute('aria-expanded', 'true');
          const textSpan = expBtn.querySelector('.btn-show-more-text');
          const badgeSpan = expBtn.querySelector('.badge-count');
          if (textSpan) textSpan.textContent = 'Show Recent Roles Only';
          if (badgeSpan) badgeSpan.textContent = 'Collapse';
        }
      }

      // Smooth scroll to the target role card
      targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight the corresponding role card with spotlight effect
      const card = targetItem.querySelector('.timeline-card');
      if (card) {
        document.querySelectorAll('.timeline-card.card-highlighted').forEach(c => c.classList.remove('card-highlighted'));
        card.classList.add('card-highlighted');
        setTimeout(() => {
          card.classList.remove('card-highlighted');
        }, 1800);
      }
    });
  });
}


