/**
 * Skyline Elevators — Main Frontend Script (Vanilla JavaScript)
 * Features:
 * - Configurable Enquiry Form Workflow (Submit Enquiry + Instant WhatsApp Enquiry)
 * - Responsive Mobile Navigation & Keyboard Accessibility
 * - Sticky Header & Active Section Highlighting
 * - Scroll-Triggered Reveal Animations (IntersectionObserver + Reduced Motion support)
 * - Native <dialog closedby="any"> Lightbox with Light-Dismiss Fallback
 * - Accessible Form Validation (:user-invalid ARIA sync & WeakMap fallback)
 * - Floating Left-Side WhatsApp Desk Widget (Reference: DemoApps)
 * - Floating Right-Side Draggable Animated "Ask AI" Robotic Assistant & Chatbot Modal (Reference: DemoApps)
 */

(() => {
  'use strict';

  const SITE_CONFIG = {
    formEndpoint: '',
    whatsappNumber: '919553388005',
    whatsappLink:
      'https://wa.me/919553388005?text=Hello%20Skyline%20Elevators%2C%20I%20would%20like%20to%20enquire%20about%20an%20elevator%20solution%20for%20my%20building%20in%20Hyderabad.',
    phones: ['9553388005', '9553388006']
  };

  /* --------------------------------------------------------------------------
   * 1. Dynamic Copyright Year
   * -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* --------------------------------------------------------------------------
   * 2. Responsive Mobile Navigation & Sticky Header
   * -------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  const closeMobileMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  };

  const toggleMobileMenu = () => {
    if (!menuToggle || !primaryNav) return;
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    primaryNav.classList.toggle('is-open', !isExpanded);
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    primaryNav.addEventListener('click', (event) => {
      const target = event.target.closest('a');
      if (target) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && primaryNav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 24);
    }
    if (backToTopBtn) {
      if (scrollY > 480) {
        backToTopBtn.removeAttribute('hidden');
      } else {
        backToTopBtn.setAttribute('hidden', '');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
   * 3. Active Navigation Link Highlighting (IntersectionObserver)
   * -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href') || '';
              if (href.startsWith('#')) {
                link.classList.toggle('active', href === `#${id}`);
              }
            });
          }
        });
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
   * 4. Scroll-Triggered Reveal Animations (Reduced-Motion Safe)
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px 50px 0px',
        threshold: 0.01
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
   * 5. Product / Service Pre-Selection (URL Query Parameter ?item=... & Clicks)
   * -------------------------------------------------------------------------- */
  const serviceSelect = document.getElementById('service');
  const fullNameInput = document.getElementById('fullName');

  const preselectService = (serviceName) => {
    if (!serviceSelect || !serviceName) return;
    const options = Array.from(serviceSelect.options);
    const matchingOption = options.find(
      (opt) => opt.value.toLowerCase() === serviceName.toLowerCase()
    );
    if (matchingOption) {
      serviceSelect.value = matchingOption.value;
    }
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const requestedItem = params.get('item');
    if (requestedItem && serviceSelect) {
      preselectService(requestedItem);
      setTimeout(() => {
        if (fullNameInput) fullNameInput.focus({ preventScroll: true });
      }, 250);
    }
  } catch (_err) {
    // Ignore URLSearchParams errors in restricted environments
  }

  document.querySelectorAll('.service-enquire-btn[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      preselectService(serviceName);
    });
  });

  /* --------------------------------------------------------------------------
   * 6. Project Gallery Lightbox (<dialog closedby="any"> + Fallback)
   * -------------------------------------------------------------------------- */
  const lightboxDialog = document.getElementById('lightbox-dialog');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const projectTriggers = document.querySelectorAll('.project-trigger');

  if (lightboxDialog && lightboxImg) {
    projectTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const fullSrc = trigger.getAttribute('data-full');
        const title = trigger.getAttribute('data-title') || 'Project Preview';
        const caption = trigger.getAttribute('data-caption') || '';
        const thumbImg = trigger.querySelector('img');
        const altText = thumbImg ? thumbImg.getAttribute('alt') : title;

        if (fullSrc) {
          lightboxImg.setAttribute('src', fullSrc);
          lightboxImg.setAttribute('alt', altText);
        }
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCaption) lightboxCaption.textContent = caption;

        if (typeof lightboxDialog.showModal === 'function') {
          lightboxDialog.showModal();
        }
      });
    });

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      lightboxDialog.addEventListener('click', (event) => {
        if (event.target !== lightboxDialog) return;
        const rect = lightboxDialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (isDialogContent) return;
        lightboxDialog.close();
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 7. Form Validation (:user-invalid ARIA Sync + Fallback) & Submission
   * -------------------------------------------------------------------------- */
  const enquiryForm = document.getElementById('enquiry-form');
  const formFeedback = document.getElementById('form-feedback');
  const waEnquiryBtn = document.getElementById('whatsapp-enquiry-btn');

  const UserInvalidFallback = (() => {
    const dirtyState = new WeakMap();

    const updateState = (input) => {
      const isValid = input.checkValidity();
      input.classList.toggle('user-invalid-fallback', !isValid);
      input.classList.toggle('user-valid-fallback', isValid);
      if (!isValid) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    };

    const handleEvent = (event) => {
      const input = event.target;
      if (event.type === 'reset') {
        const controls = input.elements || [];
        for (const control of controls) {
          dirtyState.delete(control);
          control.classList.remove('user-invalid-fallback', 'user-valid-fallback');
          control.removeAttribute('aria-invalid');
        }
        return;
      }

      if (!input || typeof input.checkValidity !== 'function') return;

      if (event.type === 'input' || event.type === 'change') {
        const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        state.hasInteracted = true;
        dirtyState.set(input, state);
        if (state.hasBlurred) updateState(input);
      } else if (event.type === 'blur') {
        const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        state.hasBlurred = true;
        dirtyState.set(input, state);
        if (state.hasInteracted) updateState(input);
      }
    };

    const init = (root = document) => {
      if (window.CSS && CSS.supports && CSS.supports('selector(:user-invalid)')) return;
      root.addEventListener('blur', handleEvent, true);
      root.addEventListener('input', handleEvent);
      root.addEventListener('change', handleEvent);
      root.addEventListener('reset', handleEvent, true);
    };

    return { init, updateState };
  })();

  const syncAriaInvalid = (el) => {
    if (!el || typeof el.matches !== 'function' || !('checkValidity' in el)) return;
    if (window.CSS && CSS.supports && CSS.supports('selector(:user-invalid)')) {
      el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
    }
  };

  if (enquiryForm) {
    UserInvalidFallback.init(enquiryForm);

    enquiryForm.addEventListener('blur', (e) => syncAriaInvalid(e.target), true);
    enquiryForm.addEventListener('input', (e) => {
      if (e.target && e.target.hasAttribute('aria-invalid')) {
        syncAriaInvalid(e.target);
      }
    });

    const validateAndCollectForm = () => {
      const controls = Array.from(enquiryForm.querySelectorAll('input, select, textarea'));
      let firstInvalid = null;

      controls.forEach((control) => {
        if (!control.checkValidity()) {
          control.classList.add('user-invalid-fallback');
          control.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = control;
        } else {
          control.classList.remove('user-invalid-fallback');
          control.setAttribute('aria-invalid', 'false');
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (formFeedback) {
          formFeedback.hidden = false;
          formFeedback.className = 'form-feedback is-error';
          formFeedback.textContent = 'Please review the highlighted fields and complete all required details.';
        }
        return null;
      }

      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value.trim();
      const message = document.getElementById('message').value.trim();

      const summaryLines = [
        'Skyline Elevators — Website Enquiry',
        `Name: ${fullName}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        `System / Service: ${service}`,
        `Requirement Details: ${message}`
      ].filter(Boolean);

      return {
        fullName,
        phone,
        email,
        service,
        message,
        formattedEnquiry: summaryLines.join('\n')
      };
    };

    const renderSuccessFeedback = (formattedEnquiry) => {
      if (!formFeedback) return;
      formFeedback.hidden = false;
      formFeedback.className = 'form-feedback is-success';
      formFeedback.innerHTML = '';

      const titleEl = document.createElement('p');
      titleEl.className = 'feedback-title';
      titleEl.textContent = 'Enquiry Prepared — Connect With Our Team';

      const descEl = document.createElement('p');
      descEl.textContent =
        'Your enquiry details are validated and formatted below. Call our corporate office directly, send on WhatsApp, or copy the summary:';

      const preEl = document.createElement('pre');
      preEl.className = 'feedback-summary';
      preEl.textContent = formattedEnquiry;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'feedback-actions';

      const waBtn = document.createElement('a');
      waBtn.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(formattedEnquiry)}`;
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
      waBtn.className = 'btn btn-whatsapp';
      waBtn.textContent = 'Open in WhatsApp';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn-primary';
      copyBtn.textContent = 'Copy Enquiry Summary';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(formattedEnquiry);
          copyBtn.textContent = 'Copied to Clipboard ✓';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Enquiry Summary';
          }, 2500);
        } catch (_e) {
          copyBtn.textContent = 'Select & Copy Above';
        }
      });

      const callBtn1 = document.createElement('a');
      callBtn1.href = 'tel:+919553388005';
      callBtn1.className = 'btn btn-accent';
      callBtn1.textContent = 'Call 9553388005';

      const callBtn2 = document.createElement('a');
      callBtn2.href = 'tel:+919553388006';
      callBtn2.className = 'btn btn-outline-primary';
      callBtn2.textContent = 'Call 9553388006';

      actionsDiv.append(waBtn, copyBtn, callBtn1, callBtn2);
      formFeedback.append(titleEl, descEl, preEl, actionsDiv);
    };

    enquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = validateAndCollectForm();
      if (!data) return;

      if (SITE_CONFIG.formEndpoint) {
        try {
          const response = await fetch(SITE_CONFIG.formEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            enquiryForm.reset();
            renderSuccessFeedback(data.formattedEnquiry);
            return;
          }
        } catch (_err) {
          // Fall through to static summary
        }
      }

      renderSuccessFeedback(data.formattedEnquiry);
    });

    if (waEnquiryBtn) {
      waEnquiryBtn.addEventListener('click', () => {
        const data = validateAndCollectForm();
        if (!data) return;
        const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(data.formattedEnquiry)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        renderSuccessFeedback(data.formattedEnquiry);
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 8. Floating Left WhatsApp Button & Right Draggable Animated "Ask AI" Robot
   *    (Adapted from DemoApps / DemoSites Reference Architecture)
   * -------------------------------------------------------------------------- */
  const createRobotHeadSVG = (size = 54, showHand = true, idSuffix = 'fab') => `
    <div class="ask-ai-robo-character" style="width:${size}px;height:${size}px;">
      <svg class="ask-ai-robo-svg" viewBox="0 0 100 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id="robo-glow-${idSuffix}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="robo-head-${idSuffix}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="55%" stop-color="#e2e8f0" />
            <stop offset="100%" stop-color="#94a3b8" />
          </linearGradient>
          <linearGradient id="robo-visor-${idSuffix}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0b1329" />
            <stop offset="100%" stop-color="#030712" />
          </linearGradient>
          <linearGradient id="robo-hand-${idSuffix}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#cbd5e1" />
          </linearGradient>
        </defs>

        <!-- Antenna with Signal Waves -->
        <g class="ask-ai-robo-antenna">
          <line x1="42" y1="23" x2="42" y2="12" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
          <circle cx="42" cy="10" r="5" fill="#38bdf8" filter="url(#robo-glow-${idSuffix})" class="ask-ai-antenna-orb" />
          <circle cx="42" cy="10" r="9" stroke="#38bdf8" stroke-width="1.5" class="ask-ai-antenna-wave" />
        </g>

        <!-- Ears / Audio Pods -->
        <rect x="9" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="12.5" cy="47.5" r="2.2" fill="#38bdf8" />
        <rect x="68" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="71.5" cy="47.5" r="2.2" fill="#38bdf8" />

        <!-- Robot Head Outer Shell -->
        <rect x="14" y="23" width="56" height="49" rx="18" fill="url(#robo-head-${idSuffix})" stroke="#cbd5e1" stroke-width="1.5" />
        <path d="M 23 27 Q 42 24 61 27" stroke="rgba(255,255,255,0.85)" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- Dark Visor Screen -->
        <rect x="21" y="31" width="42" height="33" rx="11" fill="url(#robo-visor-${idSuffix})" stroke="#1e293b" stroke-width="1" />
        <path d="M 24 34 L 35 34 L 29 60 L 24 60 Z" fill="rgba(255,255,255,0.08)" />

        <!-- Normal Round Glowing Eyes -->
        <g class="ask-ai-eyes-normal">
          <circle cx="33" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-${idSuffix})" />
          <circle cx="34.5" cy="43.5" r="1.5" fill="#ffffff" />
          <circle cx="51" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-${idSuffix})" />
          <circle cx="52.5" cy="43.5" r="1.5" fill="#ffffff" />
        </g>

        <!-- Happy Squint Eyes -->
        <g class="ask-ai-eyes-happy">
          <path d="M 29 47 Q 33 41 37 47" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" fill="none" filter="url(#robo-glow-${idSuffix})" />
          <path d="M 47 47 Q 51 41 55 47" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" fill="none" filter="url(#robo-glow-${idSuffix})" />
        </g>

        <!-- Digital Smile -->
        <path d="M 38 54 Q 42 58 46 54" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" filter="url(#robo-glow-${idSuffix})" />

        <!-- Cute Cheeks Blush -->
        <ellipse cx="28" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" class="ask-ai-cheeks" />
        <ellipse cx="56" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" class="ask-ai-cheeks" />

        ${
          showHand
            ? `
        <!-- Robot Waving Hand -->
        <g class="ask-ai-robo-hand-assembly">
          <path d="M 68 56 Q 77 53 80 43" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" fill="none" />
          <ellipse cx="81" cy="38" rx="6.5" ry="7.5" fill="url(#robo-hand-${idSuffix})" stroke="#cbd5e1" stroke-width="1.2" />
          <circle cx="81" cy="38" r="2.2" fill="#38bdf8" filter="url(#robo-glow-${idSuffix})" />
          <path d="M 76 39 C 73 37 74 34 77 33" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 79 32 C 79 27 82 26 83 29" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 83 31 C 84 26 87 26 87 29" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 87 33 C 89 29 91 30 90 34" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </g>`
            : ''
        }
      </svg>
    </div>
  `;

  // Synthetic Web Audio Chime Sound Effects (from DemoApps AskAI.jsx)
  let soundEnabled = true;
  const playChime = (type = 'receive') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'send') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        osc2.frequency.setValueAtTime(293.66, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.22);
        osc2.stop(ctx.currentTime + 0.22);
      }
    } catch (_e) {
      // Ignore audio restrictions before gesture
    }
  };

  // Skyline Elevators AI Knowledge Engine
  const getSkylineAIResponse = (input) => {
    const q = input.toLowerCase().trim();

    if (q.includes('mrl') || q.includes('machine room') || q.includes('traction') || q.includes('hydraulic') || q.includes('system') || q.includes('drive')) {
      return {
        text: `⚙️ **Our 3 Main Elevator Systems & Benefits:**\n• **MRL (Machine Room-Less):** Compact gearless drive inside the shaft—saves terrace space with zero overhead machine room & lower power usage.\n• **Traction Elevators:** Balanced steel-rope & counterweight system built for high daily passenger & commercial traffic.\n• **Hydraulic Elevators:** Smooth fluid-driven lift requiring minimal pit depth & headroom—ideal for villas and duplex homes.`,
        links: [
          { label: '⚡ Compare Main Systems', href: 'products.html#main-systems' },
          { label: '📋 Request System Quote', href: 'contact.html?item=MRL%2C+Traction+%26+Hydraulic+Systems' }
        ]
      };
    }

    if (q.includes('passenger') || q.includes('villa') || q.includes('home') || q.includes('apartment') || q.includes('residential')) {
      return {
        text: `🏢 **Passenger & Villa Elevators:**\n• **Passenger Elevators:** Engineered for apartments and commercial offices with MRL/Traction drives, automatic doors, and hairline steel cabins.\n• **Home & Villa Elevators:** Compact, whisper-quiet MRL or Hydraulic lifts tailored for private villas and duplexes with custom interior finishes.`,
        links: [
          { label: '🏢 View Passenger & Villa Lifts', href: 'products.html#elevator-range' },
          { label: '💬 Enquire Villa/Passenger Lift', href: 'contact.html?item=Home+%26+Villa+Elevators' }
        ]
      };
    }

    if (q.includes('hospital') || q.includes('stretcher') || q.includes('goods') || q.includes('freight') || q.includes('industrial') || q.includes('lop') || q.includes('cop') || q.includes('touchfeel')) {
      return {
        text: `🏥 **Specialized Lifts & Touchfeel Controls:**\n• **Hospital Lifts:** Deep stretcher-ready cabins with wide telescopic doors and precision leveling.\n• **Goods Elevators:** Heavy-duty reinforced steel freight cabins with non-slip checkered flooring.\n• **Touchfeel LOP & COP:** Responsive touch-feel Landing & Car Operating Panels with digital floor displays.`,
        links: [
          { label: '🔍 View Specialized Products', href: 'products.html#elevator-range' },
          { label: '📋 Get a Quote', href: 'contact.html' }
        ]
      };
    }

    if (q.includes('service') || q.includes('install') || q.includes('modern') || q.includes('mainten') || q.includes('repair') || q.includes('amc')) {
      return {
        text: `🔧 **Elevator Lifecycle Services in Hyderabad:**\n• **New Lift Installation:** Complete shaft assessment, rail & drive assembly, and multi-point safety commissioning.\n• **Modernization:** Controller retrofits, VVVF door upgrades, Touchfeel COP/LOP panels, and LED cabin refurbishment.\n• **Preventive Maintenance & Repair:** Scheduled safety inspections, leveling calibration, and prompt repair support.`,
        links: [
          { label: '🛠️ Explore Services', href: 'services.html' },
          { label: '📞 Book Service Visit', href: 'contact.html?item=Elevator+Maintenance+%26+Repair' }
        ]
      };
    }

    if (q.includes('office') || q.includes('address') || q.includes('location') || q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('hyderabad') || q.includes('bhel')) {
      return {
        text: `📍 **Skyline Elevators Corporate Office (ISO 9001:2015):**\n• **Address:** H No. 23-34, 1st Floor, Beside Pista House, Jyothi Nagar, BHEL, Ramachandrapuram, Hyderabad, Telangana – 502032.\n• **Phone Numbers:** +91 9553388005 / +91 9553388006`,
        links: [
          { label: '📞 Call 9553388005', href: 'tel:+919553388005' },
          { label: '💬 Chat on WhatsApp', href: SITE_CONFIG.whatsappLink, external: true, isWa: true },
          { label: '📍 Contact & Map Page', href: 'contact.html' }
        ]
      };
    }

    return {
      text: `👋 Welcome to **Skyline Elevators** (ISO 9001:2015 Certified, Hyderabad)! You can ask me about:\n• **Main Systems:** MRL (Machine Room-Less), Traction & Hydraulic benefits\n• **Elevator Range:** Passenger, Home/Villa, Hospital & Goods Lifts\n• **Controls:** Touchfeel LOP & COP panels\n• **Services:** Installation, Modernization & Preventive Maintenance`,
      links: [
        { label: '⚡ View MRL, Traction & Hydraulic', href: 'products.html#main-systems' },
        { label: '💬 Chat on WhatsApp', href: SITE_CONFIG.whatsappLink, external: true, isWa: true }
      ]
    };
  };

  const initFloatingWidgets = () => {
    if (document.querySelector('.floating-wa') || document.querySelector('.ask-ai-fab')) return;

    // 1. Left-Side Floating WhatsApp Button
    const waBtn = document.createElement('button');
    waBtn.type = 'button';
    waBtn.className = 'floating-wa';
    waBtn.setAttribute('aria-label', 'Chat with Skyline Elevators on WhatsApp');
    waBtn.setAttribute('title', 'Chat with Skyline Elevators on WhatsApp');
    waBtn.innerHTML = `
      <span class="floating-wa__pulse" aria-hidden="true"></span>
      <svg class="floating-wa__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span class="floating-wa__tooltip">
        <span class="floating-wa__tooltip-dot"></span>
        <span>WhatsApp Desk • 9553388005</span>
      </span>
    `;
    waBtn.addEventListener('click', () => {
      window.open(SITE_CONFIG.whatsappLink, '_blank', 'noopener,noreferrer');
    });

    // 2. Right-Side Draggable Animated "Ask AI" Robotic Button
    const aiFab = document.createElement('button');
    aiFab.type = 'button';
    aiFab.className = 'ask-ai-fab';
    aiFab.setAttribute('aria-label', 'Ask Skyline Elevators AI Assistant (Draggable)');
    aiFab.setAttribute('title', 'Ask AI Assistant — Click to chat or drag to move');
    aiFab.setAttribute('aria-expanded', 'false');
    aiFab.innerHTML = `
      <span class="ask-ai-fab__pulse" aria-hidden="true"></span>
      <span class="ask-ai-fab__signal-dot" aria-hidden="true"></span>
      ${createRobotHeadSVG(54, true, 'fab')}
      <span class="ask-ai-fab__tooltip">
        <span class="ask-ai-fab__tooltip-dot"></span>
        <span class="ask-ai-fab__tooltip-text">Ask AI</span>
        <span class="ask-ai-fab__tooltip-badge">Online • Drag</span>
      </span>
    `;

    // 3. Interactive Chatbot Modal Overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'ask-ai-modal-overlay';
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalOverlay.innerHTML = `
      <div class="ask-ai-window" role="dialog" aria-label="Skyline Elevators AI Assistant">
        <div class="ask-ai-header">
          <div class="ask-ai-header__brand">
            <div class="ask-ai-header__avatar">
              ${createRobotHeadSVG(32, false, 'header')}
            </div>
            <div class="ask-ai-header__info">
              <div class="ask-ai-header__title">
                <span>Skyline Elevators AI</span>
                <span class="ask-ai-header__badge">● Online</span>
              </div>
              <div class="ask-ai-header__sub">MRL • Traction • Hydraulic Assistant</div>
            </div>
          </div>
          <div class="ask-ai-header__actions">
            <button type="button" class="ask-ai-sound-btn" id="ask-ai-sound-btn" title="Mute sound effects" aria-label="Toggle sound effects">🔔</button>
            <button type="button" class="ask-ai-header__close" id="ask-ai-close-btn" title="Close AI Assistant" aria-label="Close AI Assistant">✕</button>
          </div>
        </div>

        <div class="ask-ai-body" id="ask-ai-body"></div>

        <div class="ask-ai-suggestions">
          <button type="button" class="ask-ai-chip" data-prompt="Compare MRL, Traction & Hydraulic systems">⚙️ MRL, Traction & Hydraulic</button>
          <button type="button" class="ask-ai-chip" data-prompt="Tell me about Passenger & Villa Elevators">🏢 Passenger & Villa Lifts</button>
          <button type="button" class="ask-ai-chip" data-prompt="Tell me about Hospital & Goods Elevators">🏥 Hospital & Goods Lifts</button>
          <button type="button" class="ask-ai-chip" data-prompt="What installation & maintenance services do you offer?">🔧 Services & Modernization</button>
          <button type="button" class="ask-ai-chip" data-prompt="Where is your Hyderabad office & phone number?">📍 Office & Contact</button>
        </div>

        <form class="ask-ai-footer" id="ask-ai-form">
          <input
            type="text"
            class="ask-ai-input"
            id="ask-ai-input"
            placeholder="Ask about MRL, Traction, Hydraulic, or quotes..."
            autocomplete="off"
            aria-label="Ask a question about Skyline Elevators"
          >
          <button type="submit" class="ask-ai-send-btn" aria-label="Send message">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.append(waBtn, aiFab, modalOverlay);

    const chatBody = modalOverlay.querySelector('#ask-ai-body');
    const chatForm = modalOverlay.querySelector('#ask-ai-form');
    const chatInput = modalOverlay.querySelector('#ask-ai-input');
    const closeBtn = modalOverlay.querySelector('#ask-ai-close-btn');
    const soundBtn = modalOverlay.querySelector('#ask-ai-sound-btn');

    let msgCounter = 0;

    const appendMessage = ({ sender, text, links }) => {
      msgCounter += 1;
      const msgDiv = document.createElement('div');
      msgDiv.className = `ask-ai-msg ${sender}`;

      if (sender === 'assistant') {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ask-ai-msg__avatar';
        avatarDiv.innerHTML = createRobotHeadSVG(22, false, `msg-${msgCounter}`);
        msgDiv.appendChild(avatarDiv);
      }

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'ask-ai-msg__bubble';

      text.split('\n').forEach((line, idx) => {
        const p = document.createElement('p');
        if (idx > 0) p.style.marginTop = '5px';
        // Render bold **...** safely
        const parts = line.split(/(\*\*.*?\*\*)/g);
        parts.forEach((part) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            p.appendChild(strong);
          } else {
            p.appendChild(document.createTextNode(part));
          }
        });
        bubbleDiv.appendChild(p);
      });

      if (Array.isArray(links) && links.length > 0) {
        const linksWrap = document.createElement('div');
        linksWrap.className = 'ask-ai-msg__links';
        links.forEach((linkObj) => {
          const a = document.createElement('a');
          a.href = linkObj.href;
          a.className = `ask-ai-msg__link-btn${linkObj.isWa ? ' is-wa' : ''}`;
          a.textContent = linkObj.label;
          if (linkObj.external) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }
          linksWrap.appendChild(a);
        });
        bubbleDiv.appendChild(linksWrap);
      }

      msgDiv.appendChild(bubbleDiv);
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Initial welcome message
    appendMessage({
      sender: 'assistant',
      text: '👋 **Welcome to Skyline Elevators!**\nI am your AI Elevator Assistant. Ask me about our **MRL, Traction & Hydraulic** main systems, Passenger/Villa/Hospital/Goods lifts, or getting a quote in Hyderabad.',
      links: [
        { label: '⚡ Main Systems (MRL • Traction • Hydraulic)', href: 'products.html#main-systems' },
        { label: '📋 Request a Quote', href: 'contact.html' }
      ]
    });

    const toggleModal = (forceState) => {
      const nextState = typeof forceState === 'boolean' ? forceState : !modalOverlay.classList.contains('open');
      modalOverlay.classList.toggle('open', nextState);
      modalOverlay.setAttribute('aria-hidden', String(!nextState));
      aiFab.setAttribute('aria-expanded', String(nextState));
      if (nextState) {
        setTimeout(() => chatInput.focus(), 120);
      }
    };

    const handleUserPrompt = (rawText) => {
      const query = (rawText || '').trim();
      if (!query) return;

      playChime('send');
      appendMessage({ sender: 'user', text: query });
      chatInput.value = '';

      const typingDiv = document.createElement('div');
      typingDiv.className = 'ask-ai-msg assistant';
      typingDiv.innerHTML = `
        <div class="ask-ai-msg__avatar">${createRobotHeadSVG(22, false, 'typing')}</div>
        <div class="ask-ai-msg__bubble ask-ai-typing"><span></span><span></span><span></span></div>
      `;
      chatBody.appendChild(typingDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        typingDiv.remove();
        const reply = getSkylineAIResponse(query);
        playChime('receive');
        appendMessage({
          sender: 'assistant',
          text: reply.text,
          links: reply.links
        });
      }, 420);
    };

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserPrompt(chatInput.value);
    });

    modalOverlay.querySelectorAll('.ask-ai-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        handleUserPrompt(chip.getAttribute('data-prompt'));
      });
    });

    closeBtn.addEventListener('click', () => toggleModal(false));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) toggleModal(false);
    });

    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔔' : '🔕';
      soundBtn.title = soundEnabled ? 'Mute sound effects' : 'Enable sound effects';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        toggleModal(false);
      }
    });

    /* ------------------------------------------------------------------------
     * Smooth Draggable Behaviour for the Ask AI Robot Button (Pointer Events)
     * ------------------------------------------------------------------------ */
    let isPointerDown = false;
    let hasDragged = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const applyPosition = (leftPx, topPx) => {
      const btnWidth = aiFab.offsetWidth || 62;
      const btnHeight = aiFab.offsetHeight || 62;
      const margin = 10;
      const maxLeft = Math.max(margin, window.innerWidth - btnWidth - margin);
      const maxTop = Math.max(margin, window.innerHeight - btnHeight - margin);

      const clampedLeft = Math.min(Math.max(margin, leftPx), maxLeft);
      const clampedTop = Math.min(Math.max(margin, topPx), maxTop);

      aiFab.style.left = `${clampedLeft}px`;
      aiFab.style.top = `${clampedTop}px`;
      aiFab.style.right = 'auto';
      aiFab.style.bottom = 'auto';

      // Flip tooltip to the right if dragged to the left half of the viewport
      aiFab.classList.toggle('tooltip-right', clampedLeft < window.innerWidth / 2);

      try {
        sessionStorage.setItem(
          'skyline_ai_fab_pos',
          JSON.stringify({ left: clampedLeft, top: clampedTop })
        );
      } catch (_e) {
        // Ignore storage errors
      }
    };

    // Restore dragged position within the current session if saved
    try {
      const savedPos = sessionStorage.getItem('skyline_ai_fab_pos');
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.left === 'number' && typeof parsed.top === 'number') {
          applyPosition(parsed.left, parsed.top);
        }
      }
    } catch (_e) {
      // Ignore storage errors
    }

    aiFab.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isPointerDown = true;
      hasDragged = false;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      const rect = aiFab.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      if (typeof aiFab.setPointerCapture === 'function') {
        try {
          aiFab.setPointerCapture(e.pointerId);
        } catch (_err) {
          // Ignore capture errors
        }
      }
    });

    aiFab.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startPointerX;
      const dy = e.clientY - startPointerY;
      if (!hasDragged && Math.hypot(dx, dy) > 6) {
        hasDragged = true;
        aiFab.classList.add('is-dragging');
      }
      if (hasDragged) {
        e.preventDefault();
        applyPosition(initialLeft + dx, initialTop + dy);
      }
    });

    const endDrag = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      aiFab.classList.remove('is-dragging');
      if (typeof aiFab.releasePointerCapture === 'function') {
        try {
          aiFab.releasePointerCapture(e.pointerId);
        } catch (_err) {
          // Ignore release errors
        }
      }
    };

    aiFab.addEventListener('pointerup', (e) => {
      const wasDragging = hasDragged;
      endDrag(e);
      if (!wasDragging) {
        toggleModal();
      }
    });

    aiFab.addEventListener('pointercancel', endDrag);

    // Keyboard activation support (Enter / Space)
    aiFab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleModal();
      }
    });

    window.addEventListener('resize', () => {
      if (aiFab.style.left && aiFab.style.top) {
        applyPosition(parseFloat(aiFab.style.left), parseFloat(aiFab.style.top));
      }
    });
  };

  initFloatingWidgets();
})();
