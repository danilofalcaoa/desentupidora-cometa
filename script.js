/* ================================================
   DESENTUPIDORA COMETA — script.js
   Vanilla JS, sem dependências
   ================================================ */

/* === ANIMAÇÕES FADE-UP (IntersectionObserver) ====== */
(function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(el => observer.observe(el));
})();


/* === FAQ ACCORDION ================================= */
(function initFaq() {
  const btns = document.querySelectorAll('.faq-item__question');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      /* Fechar todos */
      btns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.hidden = true;
      });

      /* Abrir o clicado se estava fechado */
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.hidden = false;
      }
    });
  });
})();


/* === NAVBAR — encolhe ao scrollar ================== */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 80) {
      navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.25)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastY = y;
  }, { passive: true });
})();


/* === CONTADOR ANIMADO (stats section) ============== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        el.textContent = current + '+';
        if (step >= steps) clearInterval(timer);
      }, duration / steps);

      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();


/* === CARROSSEL ANTES/DEPOIS ======================== */
(function initBeforeAfterCarousel() {
  const track     = document.getElementById('baTrack');
  const prevBtn   = document.getElementById('baPrev');
  const nextBtn   = document.getElementById('baNext');
  const dotsWrap  = document.getElementById('baDots');
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const slides = track.querySelectorAll('.ba-slide');
  const total  = slides.length;
  let current  = 0;
  let timer    = null;

  /* Gerar dots */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className  = 'ba-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1) + ' de ' + total);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.ba-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === current)
    );
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() { timer = setInterval(next, 4500); }
  function stopTimer()  { clearInterval(timer); }
  function resetTimer() { stopTimer(); startTimer(); }

  prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  nextBtn.addEventListener('click', () => { next(); resetTimer(); });

  /* Pausa ao passar o mouse */
  const carousel = track.closest('.ba-carousel');
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  /* Swipe touch */
  let touchX = 0;
  carousel.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].clientX;
    stopTimer();
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) dx < 0 ? next() : prev();
    startTimer();
  }, { passive: true });

  /* Teclado (acessibilidade) */
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
  });

  startTimer();
})();


/* === MENU HAMBURGUER =============================== */
(function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function close() {
    toggle.classList.remove('is-open');
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Fechar ao clicar em qualquer link do menu */
  menu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', close);
  });

  /* Fechar ao clicar fora */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) close();
  });
})();


/* === SCROLL SUAVE para links âncora ================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navbarH = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
