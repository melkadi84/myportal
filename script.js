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
  initDynamicRecommendations();
  initTestimonialsCarousel();
  initCompaniesMarquee();
  initPortfolioSlider();
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
    if (theme === 'dark') {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
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

/* ==========================================================================
   Dynamic LinkedIn Recommendations Loader (Cloudflare D1 API / Local JSON)
   ========================================================================== */
async function initDynamicRecommendations() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  try {
    let recommendations = [];
    let isRemote = false;

    // Attempt 1: Fetch from Cloudflare Worker endpoint if defined
    if (typeof CLOUDFLARE_WORKER_ENDPOINT !== 'undefined' && CLOUDFLARE_WORKER_ENDPOINT) {
      try {
        const res = await fetch(`${CLOUDFLARE_WORKER_ENDPOINT}/api/recommendations`);
        if (res.ok) {
          recommendations = await res.json();
          isRemote = true;
        }
      } catch (err) {
        console.warn('Worker endpoint fetch failed, falling back to local dataset.', err);
      }
    }

    // Attempt 2: Fallback to local data/recommendations.json only if track is empty
    if (!recommendations || recommendations.length === 0) {
      if (track.children.length > 0) {
        // Pre-rendered markup in index.html already contains all 18 authentic recommendations
        return;
      }
      try {
        const localRes = await fetch('data/recommendations.json');
        if (localRes.ok) {
          recommendations = await localRes.json();
        }
      } catch (e) {
        return;
      }
    }

    if (!recommendations || recommendations.length === 0) return;
    if (!isRemote && track.children.length >= 36) return;

    // Helper to render card HTML
    const renderCard = (item, isDuplicate = false) => `
      <div class="testimonial-card-youx" ${isDuplicate ? 'aria-hidden="true"' : ''}>
        <div class="testimonial-quote-icon">“</div>
        <p class="testimonial-text">${escapeHtml(item.quote)}</p>
        <div class="testimonial-author-wrap">
          <img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}" class="testimonial-avatar" loading="lazy" onerror="this.src='profile.jpg'">
          <div>
            <div class="testimonial-author-name">${escapeHtml(item.name)}</div>
            <div class="testimonial-author-role">${escapeHtml(item.position)} • <strong>${escapeHtml(item.company)}</strong></div>
            ${item.verified_linkedin ? `
              <div class="testimonial-badge-linkedin">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span>Verified LinkedIn Recommendation</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Render Set 1 + Set 2 (duplicates for seamless marquee loop)
    const set1 = recommendations.map(item => renderCard(item, false)).join('');
    const set2 = recommendations.map(item => renderCard(item, true)).join('');
    track.innerHTML = set1 + set2;

  } catch (err) {
    console.error('Failed to load dynamic recommendations:', err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   Testimonials Auto-Scrolling Carousel with Drag & Arrow Navigation
   ========================================================================== */
function initTestimonialsCarousel() {
  const wrapper = document.getElementById('testimonialsCarousel');
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');
  if (!wrapper || !track) return;

  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragMoved = false;
  let resumeTimeout = null;
  let lastTimestamp = null;
  let rafId = null;

  // Auto-scroll speed: ~38 pixels per second (comfortable reading and scanning pace)
  const SCROLL_SPEED = 38;

  function getCardStep() {
    const card = track.querySelector('.testimonial-card-youx');
    return card ? (card.offsetWidth + 20) : 320;
  }

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  // Animation frame ticker for smooth continuous scrolling
  function stepScroll(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Cap delta at 0.1s to prevent jumps when waking up from background tabs
    const delta = Math.min(elapsed, 0.1);

    if (!isPaused && !isDragging) {
      wrapper.scrollLeft += SCROLL_SPEED * delta;

      const halfWidth = getHalfWidth();
      if (halfWidth > 0 && wrapper.scrollLeft >= halfWidth) {
        // Seamless reset back to beginning of Set 2 (identical to Set 1)
        wrapper.scrollLeft -= halfWidth;
      }
    }

    rafId = requestAnimationFrame(stepScroll);
  }

  rafId = requestAnimationFrame(stepScroll);

  function pauseAutoScroll(durationMs = 0) {
    isPaused = true;
    if (resumeTimeout) clearTimeout(resumeTimeout);
    if (durationMs > 0) {
      resumeTimeout = setTimeout(() => {
        if (!wrapper.matches(':hover') && !isDragging) {
          isPaused = false;
          lastTimestamp = null;
        }
      }, durationMs);
    }
  }

  function resumeAutoScroll() {
    if (!wrapper.matches(':hover') && !isDragging) {
      isPaused = false;
      lastTimestamp = null;
    }
  }

  // Hover detection: pause auto-scroll when user hovers cards to read
  wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  wrapper.addEventListener('mouseleave', () => {
    if (!isDragging) {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        resumeAutoScroll();
      }, 400);
    }
  });

  // Touch support for mobile devices
  wrapper.addEventListener('touchstart', () => {
    pauseAutoScroll(0);
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    pauseAutoScroll(2000);
  }, { passive: true });

  // Mouse Drag-to-Scroll
  wrapper.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only main left click
    isDragging = true;
    isPaused = true;
    dragMoved = false;
    startX = e.pageX - wrapper.offsetLeft;
    startScrollLeft = wrapper.scrollLeft;
    wrapper.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 4) {
      dragMoved = true;
    }
    wrapper.scrollLeft = startScrollLeft - walk;

    // Seamless wrap during active mouse drag
    const halfWidth = getHalfWidth();
    if (halfWidth > 0) {
      if (wrapper.scrollLeft >= halfWidth) {
        wrapper.scrollLeft -= halfWidth;
        startScrollLeft -= halfWidth;
      } else if (wrapper.scrollLeft <= 0) {
        wrapper.scrollLeft += halfWidth;
        startScrollLeft += halfWidth;
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-dragging');
    pauseAutoScroll(2500);
  });

  // Prevent click events on cards when user was dragging
  wrapper.addEventListener('click', (e) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = false;
    }
  }, true);

  // Arrow Navigation Buttons
  function navigate(direction) {
    pauseAutoScroll(3500);
    const step = getCardStep();
    const halfWidth = getHalfWidth();

    if (halfWidth > 0) {
      if (direction === 'prev' && wrapper.scrollLeft <= 15) {
        wrapper.scrollLeft += halfWidth;
      } else if (direction === 'next' && wrapper.scrollLeft >= halfWidth - 15) {
        wrapper.scrollLeft -= halfWidth;
      }
    }

    const delta = direction === 'next' ? step : -step;
    wrapper.scrollBy({ left: delta, behavior: 'smooth' });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('prev');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('next');
    });
  }

  // Handle native scroll event (touch swipe or trackpad) seamless wrapping
  wrapper.addEventListener('scroll', () => {
    const halfWidth = getHalfWidth();
    if (halfWidth > 0) {
      if (wrapper.scrollLeft >= halfWidth * 1.95) {
        wrapper.scrollLeft -= halfWidth;
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   Companies Marquee Carousel Logic
   ========================================================================== */
function initCompaniesMarquee() {
  const container = document.getElementById('companiesMarquee');
  const track = document.getElementById('companiesTrack');
  if (!container || !track) return;

  // Pause on touchstart, resume on touchend for mobile
  container.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  container.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/* ==========================================================================
   You X Design Portfolio Slider Logic
   ========================================================================== */
function initPortfolioSlider() {
  const track = document.getElementById('portfolioSliderTrack');
  const prevBtn = document.getElementById('portfolioPrevBtn');
  const nextBtn = document.getElementById('portfolioNextBtn');
  if (!track || !prevBtn || !nextBtn) return;

  function getStep() {
    const card = track.querySelector('.portfolio-slider-card');
    if (!card) return 400;
    const gap = parseFloat(getComputedStyle(track).gap) || 34;
    return card.offsetWidth + gap;
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  function updateBtnStates() {
    const maxScroll = track.scrollWidth - track.clientWidth - 10;
    prevBtn.disabled = track.scrollLeft <= 5;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  track.addEventListener('scroll', updateBtnStates, { passive: true });
  window.addEventListener('resize', updateBtnStates);
  // Initial check after layout
  setTimeout(updateBtnStates, 100);
}
