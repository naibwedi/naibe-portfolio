// Respect users who prefer reduced motion
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// PARTICLES — connection lines disabled on mobile for performance
const cvs = document.getElementById('cvs');
if (cvs && !REDUCED) {
  const ctx2 = cvs.getContext('2d');
  let W, H, pts = [];
  const isMobile = () => window.innerWidth < 768;

  const resize = () => { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; };
  const mkP = () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.8 + .4, a: Math.random() });
  const init = () => {
    pts = [];
    const n = Math.min(isMobile() ? 25 : 70, Math.floor(W * H / 14000));
    for (let i = 0; i < n; i++) pts.push(mkP());
  };
  const draw = () => {
    ctx2.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx2.beginPath(); ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx2.fillStyle = `rgba(201,150,58,${p.a * .3})`; ctx2.fill();
    });
    if (!isMobile()) {
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx2.beginPath(); ctx2.moveTo(pts[i].x, pts[i].y); ctx2.lineTo(pts[j].x, pts[j].y);
          ctx2.strokeStyle = `rgba(201,150,58,${.08 * (1 - d / 110)})`; ctx2.lineWidth = .5; ctx2.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); });
}

// CURSOR — pointer devices only, skipped for reduced motion / touch
const cdot = document.getElementById('cdot'), cring = document.getElementById('cring');
if (cdot && cring && !REDUCED && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function ac() {
    rx += (mx - rx) * .14; ry += (my - ry) * .14;
    cdot.style.left = mx + 'px'; cdot.style.top = my + 'px';
    cring.style.left = rx + 'px'; cring.style.top = ry + 'px';
    requestAnimationFrame(ac);
  })();
} else if (cdot && cring) {
  cdot.style.display = cring.style.display = 'none';
}

// HAMBURGER
const ham = document.getElementById('ham'), mnav = document.getElementById('mnav');
if (ham && mnav) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mnav.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
}
function closeMenu() {
  if (!ham || !mnav) return;
  ham.classList.remove('open');
  mnav.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  mnav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// SCROLL TO TOP
const sttBtn = document.getElementById('stt');
if (sttBtn) {
  window.addEventListener('scroll', () => {
    sttBtn.classList.toggle('vis', window.scrollY > 400);
  }, { passive: true });
  sttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.r');
if (revealEls.length) {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => { el.style.transitionDelay = (i % 6) * .07 + 's'; obs.observe(el); });
}

// COUNTER
const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const co = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, t = parseInt(el.dataset.target, 10) || 0;
        if (REDUCED) { el.textContent = t; co.unobserve(el); return; }
        let c = 0;
        const tm = setInterval(() => { c = Math.min(c + 1, t); el.textContent = c; if (c >= t) clearInterval(tm); }, 50);
        co.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(el => co.observe(el));
}

// TYPED
const tel = document.getElementById('typed');
if (tel) {
  const roles = ['Full-Stack Developer', 'Data Engineer', 'UI/UX Designer', 'C# / .NET Specialist', 'React Developer', 'Mobile App Builder'];
  if (REDUCED) {
    tel.textContent = roles[0];
  } else {
    let ri = 0, ci = 0, del = false;
    const type = () => {
      const r = roles[ri];
      if (!del) { tel.textContent = r.slice(0, ++ci); if (ci === r.length) { del = true; setTimeout(type, 1800); return; } }
      else { tel.textContent = r.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); return; } }
      setTimeout(type, del ? 55 : 90);
    };
    type();
  }
}

// PROJECT FILTER
document.querySelectorAll('.fb').forEach(b => {
  b.addEventListener('click', function () {
    document.querySelectorAll('.fb').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    const f = this.dataset.f;
    document.querySelectorAll('.pc').forEach(c => { c.style.display = f === 'all' || c.dataset.c === f ? '' : 'none'; });
  });
});

// NAV ACTIVE with aria-current
const secs = document.querySelectorAll('section[id]');
const nls = document.querySelectorAll('.nl a');
if (secs.length && nls.length) {
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
    nls.forEach(a => {
      const active = a.getAttribute('href') === '#' + cur;
      a.style.color = active ? 'var(--gold)' : '';
      a.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }, { passive: true });
}
