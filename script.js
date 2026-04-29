/* ============================================================
   GENERATIVE AI SUMMER CAMP — script.js
   ============================================================ */

/* ── 1. PARTICLE CANVAS BACKGROUND ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  /* Resize canvas to fill window */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* Particle class */
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.6 + 0.1;
      /* random neon color */
      const colors = ['0,245,255', '168,85,247', '244,114,182', '59,130,246', '34,211,160'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${this.color})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color},0.8)`;
      ctx.fill();
      ctx.restore();
    }
  }

  /* Create particles */
  function createParticles(n) {
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  /* Animate loop */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  createParticles(120);
  loop();
})();


/* ── 2. NAVBAR SCROLL EFFECT & MOBILE TOGGLE ── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');

  /* Scroll shrink */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* Mobile hamburger */
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    /* animate bars */
    const bars = toggle.querySelectorAll('span');
    if (links.classList.contains('open')) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  /* Close on link click (mobile) */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
})();


/* ── 3. DARK / LIGHT THEME TOGGLE ── */
(function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const storageKey = 'genaiTheme';

  if (!themeToggle) return;

  function setTheme(theme) {
    const isLight = theme === 'light';
    body.classList.toggle('theme-light', isLight);
    body.classList.toggle('theme-dark', !isLight);
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '🌙' : '☀️';
    themeToggle.querySelector('.theme-label').textContent = isLight ? 'Dark' : 'Light';
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    localStorage.setItem(storageKey, theme);
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('theme-light') ? 'dark' : 'light';
    setTheme(nextTheme);
  });

  setTheme(getInitialTheme());
})();


/* ── 4. TYPING ANIMATION ── */
(function initTyping() {
  const el       = document.getElementById('typingText');
  const phrases  = [
    'Exploring AI tools for creativity, coding, and innovation',
    'Learning to build websites with AI assistance',
    'Generating images, apps, and documents with AI',
    'Writing prompts. Making things. Imagining futures.',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let delay      = 80;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 70;
    }

    if (!isDeleting && charIdx === current.length) {
      /* Pause at end */
      isDeleting = true;
      delay = 1800;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  /* Small initial delay so page loads first */
  setTimeout(type, 800);
})();


/* ── 4. SCROLL REVEAL ── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger: delay based on card index within its parent */
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx      = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ── 5. COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = target === 100 ? '%' : '+';
        const start  = performance.now();
        const dur    = 1600; /* ms */

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          /* ease out cubic */
          const eased  = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + (progress === 1 ? suffix : '');
          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── 6. SKILL BAR ANIMATION ── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.dataset.width;
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 300);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ── 7. ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── 8. TOOL CARD MOUSE-TRACK GLOW ── */
(function initCardTilt() {
  document.querySelectorAll('.tool-card, .skill-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -6;   /* max ±6deg */
      const rotY   = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── 9. SMOOTH SCROLL FOR ALL ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; /* navbar height */
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 10. RANDOM NEON FLICKER ON LOGO ── */
(function initLogoFlicker() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;

  setInterval(() => {
    const flicker = Math.random() > 0.97;
    if (flicker) {
      logo.style.textShadow = '0 0 8px rgba(0,245,255,0.9), 0 0 20px rgba(0,245,255,0.5)';
      setTimeout(() => { logo.style.textShadow = ''; }, 80);
    }
  }, 200);
})();
