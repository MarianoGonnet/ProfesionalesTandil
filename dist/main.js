// ── MODAL REGISTRO ──
function abrirModal() {
  const m = document.getElementById('modal-registro');
  if (!m) return;
  // Cerrar sidebar si está abierto
  document.getElementById('sidebar')?.classList.remove('abierto');
  document.getElementById('overlay')?.classList.remove('visible');
  m.classList.add('visible');
  m.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => m.querySelector('input:not([type=hidden]):not([tabindex="-1"])')?.focus(), 60);
}

function cerrarModal() {
  const m = document.getElementById('modal-registro');
  if (!m) return;
  m.classList.remove('visible');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

(function initModal() {
  const modal = document.getElementById('modal-registro');
  if (!modal) return;

  // Click fuera del card → cerrar
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  // ESC → cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('visible')) cerrarModal();
  });

  // Contador de caracteres en descripción
  const ta = document.getElementById('f-desc');
  const ct = document.getElementById('desc-count');
  if (ta && ct) ta.addEventListener('input', () => { ct.textContent = `${ta.value.length} / 300`; });

  const form = document.getElementById('form-registro');
  if (!form) return;

  // Limpiar error al corregir el campo
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      const g = el.closest('.form-group');
      if (!g) return;
      g.classList.remove('error');
      g.querySelector('.campo-error')?.remove();
    });
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Honeypot — si está relleno, es un bot
    if (form.querySelector('[name="_gotcha"]').value) return;
    if (!validarForm(form)) return;

    const btn = form.querySelector('.btn-enviar');
    const textoOrig = btn.innerHTML;
    btn.textContent = 'Enviando…';
    btn.disabled = true;
    form.querySelector('.form-error-global')?.remove();

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.hidden = true;
        document.getElementById('form-exito').hidden = false;
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = textoOrig;
      btn.disabled = false;
      const p = document.createElement('p');
      p.className = 'form-error-global';
      p.textContent = 'No se pudo enviar. Verificá tu conexión e intentá de nuevo.';
      btn.before(p);
    }
  });
})();

function validarForm(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    const g = el.closest('.form-group');
    if (!g) return;
    g.classList.remove('error');
    g.querySelector('.campo-error')?.remove();
    const val = el.value.trim();
    let msg = '';
    if (!val) msg = 'Campo obligatorio.';
    else if (el.minLength > 0 && val.length < el.minLength) msg = `Mínimo ${el.minLength} caracteres.`;
    if (msg) {
      g.classList.add('error');
      const span = document.createElement('span');
      span.className = 'campo-error';
      span.textContent = msg;
      g.appendChild(span);
      ok = false;
    }
  });
  if (!ok) form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea')?.focus();
  return ok;
}

// ── SIDEBAR ──
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.toggle('abierto');
  if (overlay) overlay.classList.toggle('visible');
}

// ── CARRUSEL CONTINUO ──
(function () {
  const GAP   = 12;   // debe coincidir con gap del CSS
  const SPEED = 0.5;  // px por frame (~30px/seg a 60fps)

  function initCarrusel() {
    const track = document.getElementById('carrusel-track');
    if (!track) return;

    const originals = Array.from(track.querySelectorAll('.carrusel-slide'));
    if (!originals.length) return;

    // Duplicar slides para que el loop sea seamless
    originals.forEach(s => track.appendChild(s.cloneNode(true)));

    // El JS controla el transform directamente: desactivar transition CSS
    track.style.transition = 'none';

    let pos           = 0;
    let paused        = false;
    let originalWidth = 0;

    function calcWidth() {
      // Ancho del set original = suma de cada slide + el gap que lo separa del siguiente
      originalWidth = originals.reduce((sum, s) => sum + s.offsetWidth + GAP, 0);
    }

    function tick() {
      if (!paused) {
        pos += SPEED;
        if (pos >= originalWidth) pos -= originalWidth; // loop seamless
        track.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(tick);
    }

    const wrap = track.parentElement;
    wrap.addEventListener('mouseenter', () => { paused = true;  });
    wrap.addEventListener('mouseleave', () => { paused = false; });
    wrap.addEventListener('touchstart', () => { paused = true;  }, { passive: true });
    wrap.addEventListener('touchend',   () => { paused = false; }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calcWidth();
        if (pos >= originalWidth) pos %= originalWidth;
      }, 150);
    });

    calcWidth();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarrusel);
  } else {
    initCarrusel();
  }
})();

// ── FADE-IN TARJETAS AL SCROLL ──
(function () {
  function initFadeIn() {
    const fichas = document.querySelectorAll('.ficha');
    if (!fichas.length || !('IntersectionObserver' in window)) return;

    fichas.forEach((f, i) => {
      f.setAttribute('data-animate', '');
      f.style.transitionDelay = `${(i % 3) * 70}ms`; // escalonado por columna
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('appeared');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    fichas.forEach(f => obs.observe(f));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFadeIn);
  } else {
    initFadeIn();
  }
})();
