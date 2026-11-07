/**
 * Mohamed Elkadi - Personal Brand Website
 * Executive Interactive Logic & Optimized Micro-Interactions
 * Light Default & Dark Suite Navy Mode Switcher
 */

// Configuration: Enter your deployed Cloudflare Worker URL here:
// Example: 'https://mk-contactme.<your-subdomain>.workers.dev'
const CLOUDFLARE_WORKER_ENDPOINT = 'https://mk-contactme.mohamed-osn4.workers.dev/api/contact';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initAppFilters();
  initContactForm();
  initSmoothScroll();
  initTimelineScrollAnimation();
  initBackToTop();
  initTimelineDateClicks();
  initYouTemplateSlider();
  initCompaniesMarquee();
  initPortfolioSlider();
  initScrollProgressBar();
  initScrollReveals();
  initStatCounters();
  initCertViewer();
  initCertFilter();
  initTypewriterAnimation();
});

/* ==========================================================================
   1. Theme Switcher (Light Default & Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('elkadi_theme') || 'light';

  // Apply saved or default theme
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
   2. Navigation Bar & Mobile Drawer (With Fixed Active-Link Spy)
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

  // Mobile menu drawer
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

  // Current page detection from URL pathname
  let currentFile = window.location.pathname.split('/').pop().toLowerCase();
  if (!currentFile || currentFile === '') currentFile = 'index.html';

  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentFile || (currentFile === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Active section highlighting for anchor links ONLY (starts with #)
  const anchorLinks = Array.from(navLinks).filter(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
  });

  if (anchorLinks.length > 0 && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          anchorLinks.forEach(link => {
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
}

/* ==========================================================================
   3. Applications & Solutions Filtering (portfolio.html)
   ========================================================================== */
function initAppFilters() {
  const filterButtons = document.querySelectorAll('.apps-filter-bar .filter-btn');
  const appCards = document.querySelectorAll('.apps-grid .app-card');

  if (!filterButtons.length || !appCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      appCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const matches = filterValue === 'all' ||
                        category === filterValue ||
                        category.split(/\s+/).includes(filterValue) ||
                        (filterValue === 'power-platform' && category.includes('power-platform'));
        if (matches) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Contact Form with Anti-Spam Honeypot & Email Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check Honeypot spam trap
    const trap = document.getElementById('botTrapField');
    if (trap && trap.value.trim() !== '') {
      showStatus('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      return;
    }

    const name = (document.getElementById('senderName')?.value || '').trim();
    const email = (document.getElementById('senderEmail')?.value || '').trim();
    const subject = (document.getElementById('senderSubject')?.value || '').trim();
    const company = (document.getElementById('senderCompany')?.value || '').trim();
    const role = (document.getElementById('senderRole')?.value || '').trim();
    const rawMessage = (document.getElementById('senderMessage')?.value || '').trim();
    // The database has no company/role columns yet, so they travel at the top of the message.
    const details = [company && `Company: ${company}`, role && `Role: ${role}`].filter(Boolean).join('\n');
    const message = details ? `${details}\n\n${rawMessage}` : rawMessage;

    if (!name || !email || !subject || !rawMessage) {
      showStatus('Fill in your name, email, topic and message, then send again.', 'error');
      return;
    }

    // Precise Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      showStatus('Enter an email address in the format name@company.com.', 'error');
      return;
    }

    // Loading UI state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending…</span>`;

    const payload = {
      name,
      email,
      subject: subject || 'Portfolio Contact',
      message,
      timestamp: new Date().toISOString()
    };

    try {
      if (CLOUDFLARE_WORKER_ENDPOINT) {
        const res = await fetch(CLOUDFLARE_WORKER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error('Failed to deliver message');
        }

        showStatus('Message sent. I will reply as soon as I can.', 'success');
      } else {
        // No backend is configured, so nothing can be delivered. Say so instead of faking success.
        throw new Error('CLOUDFLARE_WORKER_ENDPOINT is not set');
      }

      form.reset();
    } catch (err) {
      console.error('Contact Form Error:', err);
      showStatus('Your message was not sent. Try again in a minute, or message me on LinkedIn.', 'error');
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
   5. Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/* ==========================================================================
   6. Experience Timeline Scroll Animation
   ========================================================================== */
function initTimelineScrollAnimation() {
  const timeline = document.querySelector('.experience-timeline');
  const items = document.querySelectorAll('.timeline-item');
  if (!timeline || !items.length) return;

  timeline.classList.add('timeline-animated');

  function updateTimeline() {
    const viewportHeight = window.innerHeight;
    const enterThreshold = viewportHeight * 0.88;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < enterThreshold) {
        item.classList.add('timeline-visible');
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
   7. Floating Back to Top Button
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
   8. Clickable Timeline Dates & Role Focus Spotlight
   ========================================================================== */
function initTimelineDateClicks() {
  const dateButtons = document.querySelectorAll('.timeline-year-badge');

  dateButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      const targetItem = document.getElementById(targetId);
      if (!targetItem) return;

      targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
   9. Testimonials Slider (8 featured endorsements, manual controls)
   ========================================================================== */
function initYouTemplateSlider() {
  const viewport = document.getElementById('youSliderViewport');
  const track = document.getElementById('youSliderTrack');
  const prevBtn = document.getElementById('youSliderPrevBtn');
  const nextBtn = document.getElementById('youSliderNextBtn');
  const counterCurrent = document.getElementById('youSliderCurrent');
  const counterTotal = document.getElementById('youSliderTotal');
  let slides = Array.from(document.querySelectorAll('.you-slide'));
  let dots = Array.from(document.querySelectorAll('.you-slider-dot'));

  if (!viewport || !track || !slides.length) return;

  const featuredIndexes = [4, 3, 11, 1, 5, 6, 7, 13];
  const featuredIndexSet = new Set(featuredIndexes);
  slides.forEach(slide => {
    if (!featuredIndexSet.has(Number(slide.getAttribute('data-slide-index')))) {
      slide.remove();
    }
  });
  const slidesByOriginalIndex = new Map(
    slides.filter(slide => slide.isConnected)
      .map(slide => [Number(slide.getAttribute('data-slide-index')), slide])
  );
  slides = featuredIndexes.map(index => slidesByOriginalIndex.get(index)).filter(Boolean);
  slides.forEach(slide => track.appendChild(slide));
  dots.forEach(dot => {
    if (!featuredIndexSet.has(Number(dot.getAttribute('data-slide-target')))) {
      dot.remove();
    }
  });
  const dotsByOriginalIndex = new Map(
    dots.filter(dot => dot.isConnected)
      .map(dot => [Number(dot.getAttribute('data-slide-target')), dot])
  );
  dots = featuredIndexes.map(index => dotsByOriginalIndex.get(index)).filter(Boolean);
  dots.forEach(dot => dot.parentElement.appendChild(dot));
  dots.forEach((dot, index) => {
    dot.setAttribute('data-slide-target', String(index));
    dot.setAttribute('aria-label', `Go to featured recommendation ${index + 1}`);
  });

  let currentIndex = 0;
  const total = slides.length;
  let isDragging = false;
  let startX = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoRotate = !reduceMotion;
  let autoRotateTimer = null;
  const sliderOuter = viewport.closest('.you-slider-outer');

  if (counterTotal) counterTotal.textContent = String(total);
  viewport.setAttribute('aria-live', 'polite');
  viewport.setAttribute('aria-atomic', 'true');
  viewport.tabIndex = 0;

  function updateSlider(index, smooth = true) {
    if (index < 0) {
      currentIndex = total - 1;
    } else if (index >= total) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transition = smooth && !reduceMotion ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      const isActive = (i === currentIndex);
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-pressed', i === currentIndex ? 'true' : 'false');
    });

    if (counterCurrent) {
      counterCurrent.textContent = currentIndex + 1;
    }
  }

  function clearAutoRotateTimer() {
    if (autoRotateTimer !== null) {
      window.clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function syncAutoRotate() {
    clearAutoRotateTimer();
    const shouldRotate = autoRotate && !document.hidden &&
      !sliderOuter?.matches(':hover') &&
      !sliderOuter?.contains(document.activeElement);
    viewport.setAttribute('aria-live', autoRotate ? 'off' : 'polite');
    if (shouldRotate) {
      autoRotateTimer = window.setInterval(() => updateSlider(currentIndex + 1), 6000);
    }
  }

  if (sliderOuter) {
    sliderOuter.addEventListener('pointerenter', syncAutoRotate);
    sliderOuter.addEventListener('pointerleave', syncAutoRotate);
    sliderOuter.addEventListener('focusin', syncAutoRotate);
    sliderOuter.addEventListener('focusout', event => {
      if (!sliderOuter.contains(event.relatedTarget)) syncAutoRotate();
    });
  }
  document.addEventListener('visibilitychange', syncAutoRotate);

  // Button navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlider(currentIndex - 1);
      syncAutoRotate();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlider(currentIndex + 1);
      syncAutoRotate();
    });
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(dot.getAttribute('data-slide-target'), 10);
      if (!isNaN(target)) {
        updateSlider(target);
        syncAutoRotate();
      }
    });
  });

  // Touch Support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        updateSlider(currentIndex + 1);
      } else {
        updateSlider(currentIndex - 1);
      }
      syncAutoRotate();
    }
  }, { passive: true });

  // Mouse Drag Support
  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    viewport.classList.add('is-dragging');
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        updateSlider(currentIndex + 1);
      } else {
        updateSlider(currentIndex - 1);
      }
      syncAutoRotate();
    }
  });

  // Keyboard navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlider(currentIndex - 1);
      syncAutoRotate();
    } else if (e.key === 'ArrowRight') {
      updateSlider(currentIndex + 1);
      syncAutoRotate();
    }
  });

  updateSlider(0);
  syncAutoRotate();
}

/* ==========================================================================
   10. Companies Marquee Touch Interaction
   ========================================================================== */
function initCompaniesMarquee() {
  const container = document.getElementById('companiesMarquee');
  const track = document.getElementById('companiesTrack');
  if (!container || !track) return;

  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach(image => image.setAttribute('alt', ''));
    track.appendChild(clone);
  });

  container.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  container.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/* ==========================================================================
   11. You X Portfolio Slider
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
  setTimeout(updateBtnStates, 100);
}

/* ==========================================================================
   12. Reading Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
  let bar = document.getElementById('scrollProgressBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.className = 'scroll-progress-bar';
    document.body.prepend(bar);
  }

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      bar.style.width = '0%';
      return;
    }
    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    bar.style.width = `${progress}%`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* ==========================================================================
   13. Universal Scroll-Triggered Reveal Animations
   ========================================================================== */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const selectors = [
    '.section-header',
    '.portal-achievement-card',
    '.app-card',
    '.cert-card-premium',
    '.youx-portfolio-card',
    '.about-card',
    '.side-card',
    '.metric-card',
    '.companies-carousel-header',
    '.contact-section-card'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  if (!elements.length) return;

  const parentMap = new Map();
  elements.forEach(el => {
    const parent = el.parentElement;
    if (!parentMap.has(parent)) {
      parentMap.set(parent, []);
    }
    parentMap.get(parent).push(el);
  });

  parentMap.forEach(group => {
    group.forEach((el, index) => {
      el.classList.add('reveal-item');
      const delayIdx = (index % 4) + 1;
      el.classList.add(`reveal-delay-${delayIdx}`);
    });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   14. Animated Stat Counters
   ========================================================================== */
function initStatCounters() {
  const statElements = document.querySelectorAll('.beverr-stat-number, .metric-number, .stat-number');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);

        const originalText = el.textContent.trim();
        const match = originalText.match(/^([^\d]*)([\d,]+)(.*)$/);
        if (!match) return;

        const prefix = match[1] || '';
        const targetValue = parseInt(match[2].replace(/,/g, ''), 10);
        const suffix = match[3] || '';

        const duration = 1400; // ms
        const startTime = performance.now();

        function easeOutQuart(x) {
          return 1 - Math.pow(1 - x, 4);
        }

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(1, elapsed / duration);
          const currentCount = Math.round(easeOutQuart(progress) * targetValue);

          const displayCount = originalText.includes(',') ? currentCount.toLocaleString('en-US') : currentCount;
          el.textContent = `${prefix}${displayCount}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = originalText;
          }
        }

        requestAnimationFrame(updateCounter);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   15. Typewriter Animation (about.html)
   ========================================================================== */
function initTypewriterAnimation() {
  const elements = document.getElementsByClassName('typewrite');
  if (!elements || elements.length === 0) return;

  function TxtType(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
  }

  TxtType.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + (this.txt || '&nbsp;') + '</span>';

    const that = this;
    let delta = 150 - Math.random() * 60;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function() {
      that.tick();
    }, delta);
  };

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const toRotate = el.getAttribute('data-type');
    const period = el.getAttribute('data-period');
    if (toRotate) {
      try {
        new TxtType(el, JSON.parse(toRotate), period);
      } catch (err) {
        console.error('Typewriter JSON parse error:', err);
      }
    }
  }
}


/* ==========================================================================
   Certificate viewer (Training page)
   ========================================================================== */
function initCertViewer() {
  const dialog = document.getElementById('certViewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const titleEl = document.getElementById('certViewerTitle');
  const captionEl = document.getElementById('certViewerCaption');
  const imgEl = document.getElementById('certViewerImg');
  const countEl = document.getElementById('certViewerCount');
  const fullEl = document.getElementById('certViewerFull');
  const prevBtn = document.getElementById('certViewerPrev');
  const nextBtn = document.getElementById('certViewerNext');
  const closeBtn = document.getElementById('certViewerClose');
  const detailEl = document.getElementById('certViewerDetail');

  let items = [];
  let index = 0;
  let opener = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const [src, caption] = items[index];
    imgEl.src = src;
    imgEl.alt = caption;
    captionEl.textContent = caption;
    fullEl.href = src;
    countEl.textContent = items.length > 1 ? `${index + 1} of ${items.length}` : '';
    prevBtn.hidden = nextBtn.hidden = items.length < 2;
  }

  document.querySelectorAll('.cert2-open').forEach(link => {
    link.addEventListener('click', event => {
      let data;
      try { data = JSON.parse(link.dataset.images || '[]'); } catch (err) { data = []; }
      if (!data.length) return;
      event.preventDefault();
      items = data;
      opener = link;
      titleEl.textContent = link.dataset.title || 'Certificate';
      const card = link.closest('.cert2-card');
      detailEl.textContent = '';
      if (card) {
        const rows = [
          ['Status', card.querySelector('.cert2-status')],
          ['Date', card.querySelector('.cert2-date')],
          ['Provider', card.querySelector('.cert2-issuer')],
          ['Note', card.querySelector('.cert2-note')]
        ];
        rows.forEach(([label, node]) => {
          if (!node || !node.textContent.trim()) return;
          const wrap = document.createElement('div');
          const dt = document.createElement('dt'); dt.textContent = label;
          const dd = document.createElement('dd'); dd.textContent = node.textContent.trim();
          wrap.append(dt, dd); detailEl.append(wrap);
        });
      }
      show(0);
      dialog.showModal();
      document.body.classList.add('cert2-lock');
    });
  });

  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (items.length < 2) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('cert2-lock');
    imgEl.removeAttribute('src');
    if (opener) opener.focus();
  });
}


function initCertFilter() {
  const section = document.getElementById('certifications');
  const search = document.getElementById('certSearch');
  const main = document.getElementById('certMain');
  if (!section || !search || !main) return;
  const srcChips = [...section.querySelectorAll('.cert2-chip[data-src]')];
  const compBtns = [...section.querySelectorAll('.cert2-acomp')];
  const viewBtns = [...section.querySelectorAll('.cert2-view-btn')];
  const cards = [...section.querySelectorAll('.cert2-card')];
  const groups = [...section.querySelectorAll('.cert2-group')];
  const subs = [...section.querySelectorAll('.cert2-sub')];
  const empty = document.getElementById('certEmpty');
  const shownEl = document.getElementById('certShown');
  let src = 'all', comp = 'all';

  cards.forEach(card => { card._text = card.textContent.toLowerCase().replace(/\s+/g, ' '); });
  const COMP = {};
  compBtns.forEach(b => { if (b.dataset.comp !== 'all') COMP[b.dataset.comp] = b.querySelector('.cert2-acomp-name').textContent.trim(); });
  srcChips.forEach(chip => {
    const f = chip.dataset.src;
    chip.querySelector('b').textContent = f === 'all' ? cards.length : cards.filter(c => c.dataset.src === f).length;
  });

  function apply() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const ok = (src === 'all' || card.dataset.src === src) &&
        (comp === 'all' || card.dataset.comp === comp) &&
        (!q || card._text.includes(q));
      card.hidden = !ok;
      if (ok) shown++;
    });
    subs.forEach(x => { x.hidden = !x.querySelector('.cert2-card:not([hidden])'); });
    groups.forEach(g => { g.hidden = !g.querySelector('.cert2-card:not([hidden])'); });
    if (empty) empty.hidden = shown > 0;
    if (shownEl) shownEl.textContent = 'Showing ' + shown + ' of ' + cards.length;
    compBtns.forEach(b => b.classList.toggle('is-active', b.dataset.comp === comp));
    section.querySelectorAll('.cert2-bar, .cert2-rlabel').forEach(b => b.classList.toggle('is-active', b.dataset.comp === comp));
  }
  function setComp(c) { comp = (comp === c) ? 'all' : c; apply(); }
  srcChips.forEach(chip => chip.addEventListener('click', () => {
    src = chip.dataset.src;
    srcChips.forEach(c => c.classList.toggle('is-active', c === chip));
    apply();
  }));
  compBtns.forEach(b => b.addEventListener('click', () => { comp = b.dataset.comp; apply(); }));
  search.addEventListener('input', apply);

  /* View modes: grid, list, table */
  document.querySelectorAll('.cert2-grid, .cert2-rows').forEach(box => {
    const head = document.createElement('div');
    head.className = 'cert2-thead'; head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<span></span><span>Certificate</span><span>Provider</span><span>Date</span><span>Competency</span>';
    box.prepend(head);
  });
  function setView(v) {
    main.dataset.view = v;
    viewBtns.forEach(b => { const on = b.dataset.view === v; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    try { localStorage.setItem('certView', v); } catch (e) {}
  }
  viewBtns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  let saved = 'grid';
  try { saved = localStorage.getItem('certView') || 'grid'; } catch (e) {}
  setView(['grid', 'list', 'table'].includes(saved) ? saved : 'grid');
  cards.forEach(card => card.addEventListener('click', e => {
    if (main.dataset.view === 'grid' || e.target.closest('a, button')) return;
    const a = card.querySelector('.cert2-open'); if (a) a.click();
  }));

  /* Competencies: stats are calculated from the cards in the page */
  const stats = {}, years = {};
  cards.forEach(c => {
    const k = c.dataset.comp; if (!k) return;
    const st = stats[k] || (stats[k] = { n: 0, min: 0 });
    st.n++; st.min += Number(c.dataset.min || 0);
    if (c.dataset.year) years[c.dataset.year] = (years[c.dataset.year] || 0) + 1;
  });
  const order = Object.keys(stats).sort((a, b) => stats[b].n - stats[a].n);
  const max = Math.max(...order.map(k => stats[k].n));

  const chart = document.getElementById('compChart');
  if (chart) {
    order.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cert2-bar'; b.dataset.comp = k; b.setAttribute('role', 'listitem');
      const h = Math.round(stats[k].min / 60);
      b.innerHTML = '<span class="cert2-bar-label"></span><span class="cert2-bar-track"><span class="cert2-bar-fill"></span></span><span class="cert2-bar-val"></span>';
      b.querySelector('.cert2-bar-label').textContent = COMP[k] || k;
      b.querySelector('.cert2-bar-val').innerHTML = stats[k].n + (h ? '<small>' + h + ' h stated</small>' : '');
      b.addEventListener('click', () => { setComp(k); document.getElementById('certToolbar').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      chart.append(b);
    });
  }

  const radar = document.getElementById('compRadar');
  const SHORT = { cyber: 'Cybersecurity', data: 'Data, Python & AI', digital: 'Digital Solutions', infra: 'IT Infrastructure', pm: 'Project & Agile', quality: 'Quality & Audit', lead: 'Leadership', comp: 'Compliance' };
  const axes = ['cyber', 'data', 'digital', 'infra', 'pm', 'quality', 'lead', 'comp'].filter(k => stats[k]);
  if (radar && axes.length > 2) {
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 220, cy = 190, R = 118, top = Math.ceil(max / 5) * 5;
    const el = (n, a, parent) => { const e = document.createElementNS(NS, n); Object.entries(a || {}).forEach(([k, v]) => e.setAttribute(k, v)); (parent || radar).append(e); return e; };
    const ang = i => -Math.PI / 2 + i * 2 * Math.PI / axes.length;
    const pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
    for (let l = 1; l <= 4; l++) {
      const pts = axes.map((_, i) => pt(i, R * l / 4).join(',')).join(' ');
      el('polygon', { points: pts, class: 'cert2-rring' });
      const t = el('text', { x: cx + 4, y: cy - R * l / 4 - 3, class: 'cert2-rtick' }); t.textContent = Math.round(top * l / 4);
    }
    axes.forEach((_, i) => { const [x, y] = pt(i, R); el('line', { x1: cx, y1: cy, x2: x, y2: y, class: 'cert2-raxis' }); });
    const poly = el('polygon', { points: axes.map((k, i) => pt(i, R * stats[k].n / top).join(',')).join(' '), class: 'cert2-rpoly' });
    axes.forEach((k, i) => {
      const [x, y] = pt(i, R * stats[k].n / top);
      const d = el('circle', { cx: x, cy: y, r: 4.5, class: 'cert2-rdot' });
      el('title', {}, d).textContent = (COMP[k] || k) + ': ' + stats[k].n + ' certificates';
      const [lx, ly] = pt(i, R + 20), c = Math.cos(ang(i));
      const t = el('text', { x: lx, y: ly, class: 'cert2-rlabel', 'data-comp': k, 'text-anchor': c > 0.3 ? 'start' : (c < -0.3 ? 'end' : 'middle'), tabindex: 0, role: 'button' });
      const t1 = el('tspan', { x: lx, dy: Math.sin(ang(i)) > 0.5 ? '0.9em' : (Math.sin(ang(i)) < -0.5 ? '-0.2em' : '0.1em') }, t); t1.textContent = SHORT[k] || k;
      const t2 = el('tspan', { x: lx, dy: '1.25em', class: 'cert2-rlabel-n' }, t); t2.textContent = stats[k].n;
      t.addEventListener('click', () => setComp(k));
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setComp(k); } });
    });
    radar._poly = poly;
  }

  const yearChart = document.getElementById('yearChart');
  if (yearChart) {
    const yk = Object.keys(years).sort();
    const ymax = Math.max(...yk.map(y => years[y]));
    for (let y = Number(yk[0]); y <= Number(yk[yk.length - 1]); y++) {
      const n = years[y] || 0;
      const d = document.createElement('div'); d.className = 'cert2-year';
      d.innerHTML = '<span class="cert2-year-n"></span><span class="cert2-year-col"></span><span class="cert2-year-lbl"></span>';
      d.querySelector('.cert2-year-n').textContent = n || '';
      d.querySelector('.cert2-year-lbl').textContent = "'" + String(y).slice(2);
      d.dataset.h = n ? Math.max(6, Math.round(n / ymax * 100)) : 0;
      yearChart.append(d);
    }
  }
  const foot = document.getElementById('compFoot');
  if (foot) foot.textContent = 'Strongest: ' + order.slice(0, 3).map(k => COMP[k]).join(', ') + '. Hours count only certificates that state a duration.';
  const grow = () => {
    chart.querySelectorAll('.cert2-bar').forEach(b => { b.querySelector('.cert2-bar-fill').style.width = Math.round(stats[b.dataset.comp].n / max * 100) + '%'; });
    yearChart.querySelectorAll('.cert2-year').forEach(d => { d.querySelector('.cert2-year-col').style.height = d.dataset.h + '%'; });
    if (radar) radar.classList.add('is-in');
  };
  const compSection = document.getElementById('competencies');
  if ('IntersectionObserver' in window && compSection) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { grow(); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(compSection);
  } else { grow(); }

  /* Aside: highlight the section in view */
  const links = [...section.querySelectorAll('.cert2-anav')];
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) links.forEach((a, i) => a.classList.toggle('is-current', targets[i] === e.target)); });
    }, { rootMargin: '-20% 0px -65% 0px' });
    targets.forEach(t => t && spy.observe(t));
  }
  apply();
}
