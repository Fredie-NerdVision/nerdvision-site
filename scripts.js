/* NerdVision — interactions. No dependencies. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- split headings into words (keeps .hl spans intact) ---------- */
  $$('.split').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          w.style.setProperty('--wd', `${Math.min(i++ * 0.045, 0.9)}s`);
          frag.appendChild(w);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        [...node.childNodes].forEach(wrap);
      }
    };
    [...el.childNodes].forEach(wrap);
  });

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .split').forEach((el) => io.observe(el));

  /* ---------- header state + scroll progress + active nav ---------- */
  const header = $('.site-header');
  const bar = $('.progress span');
  const navLinks = $$('.site-nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s; });
    navLinks.forEach((a) => a.classList.toggle('is-active', current && a.getAttribute('href') === `#${current.id}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const toggle = $('.nav-toggle');
  const mobile = $('.mobile-nav');
  if (toggle && mobile) {
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); mobile.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobile.classList.toggle('is-open', !open);
    });
    $$('a', mobile).forEach((a) => a.addEventListener('click', close));
  }

  /* ---------- cursor glow + magnetic buttons + tilt cards ---------- */
  const glow = $('.cursor-glow');
  if (glow && matchMedia('(hover: hover)').matches && !reduce) {
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; document.body.classList.add('has-pointer'); }, { passive: true });
    const loop = () => {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    $$('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- hero canvas: soft floating grid dots ---------- */
  const canvas = $('.hero-canvas');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [], mouse = { x: -9999, y: -9999 };
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = r.width * devicePixelRatio;
      h = canvas.height = r.height * devicePixelRatio;
      dots = [];
      const gap = 42 * devicePixelRatio;
      for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) dots.push({ x, y, ox: x, oy: y, s: Math.random() * Math.PI * 2 });
    };
    resize();
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    let t = 0, visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible) return;
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        const dx = d.ox - mouse.x, dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const push = Math.max(0, 1 - dist / (180 * devicePixelRatio));
        const x = d.ox + Math.sin(t + d.s) * 3 * devicePixelRatio + dx / (dist || 1) * push * 26 * devicePixelRatio;
        const y = d.oy + Math.cos(t * 0.8 + d.s) * 3 * devicePixelRatio + dy / (dist || 1) * push * 26 * devicePixelRatio;
        const r = (1.4 + push * 3) * devicePixelRatio;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = push > 0.02 ? `rgba(38,198,218,${0.35 + push * 0.6})` : 'rgba(62,50,43,0.16)';
        ctx.fill();
      });
    };
    draw();
  }

  /* ---------- before / after compare ---------- */
  $$('[data-compare]').forEach((root) => {
    const frame = $('.compare-frame', root);
    const range = $('.compare-range', root);
    const set = (v) => frame.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => set(range.value));
    set(range.value);
    // auto-tease once when it scrolls into view
    if (!reduce) {
      new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const start = +range.value, t0 = performance.now();
        const tease = (now) => {
          const p = Math.min((now - t0) / 1800, 1);
          const v = start + Math.sin(p * Math.PI * 2) * 22 * (1 - p);
          range.value = v; set(v);
          if (p < 1) requestAnimationFrame(tease);
        };
        requestAnimationFrame(tease);
      }, { threshold: 0.5 }).observe(frame);
    }
  });

  /* ---------- counters ---------- */
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const counters = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count) || 0, t0 = performance.now(), dur = 1400;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * ease(p)).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      if (reduce) el.textContent = end.toLocaleString(); else requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach((c) => counters.observe(c));

  /* ---------- ACF demo: edit a field, watch the "site" update ---------- */
  $$('[data-acf-demo]').forEach((demo) => {
    const save = $('.demo-save', demo);
    const site = $('.demo-site', demo);
    let timer;
    const flash = (el) => { el.classList.remove('is-updating'); void el.offsetWidth; el.classList.add('is-updating'); };
    const markSaved = () => {
      save.textContent = 'Saving…'; save.classList.add('is-dirty');
      clearTimeout(timer);
      timer = setTimeout(() => { save.textContent = 'Saved'; save.classList.remove('is-dirty'); }, 600);
    };
    $$('[data-demo]', demo).forEach((input) => {
      const outs = $$(`[data-demo-out="${input.dataset.demo}"]`, demo);
      input.addEventListener('input', () => {
        outs.forEach((o) => { o.textContent = input.value || '\u00a0'; flash(o); });
        markSaved();
      });
    });
    $$('[data-demo-color]', demo).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('[data-demo-color]', demo).forEach((b) => b.classList.toggle('is-active', b === btn));
        site.style.setProperty('--accent', btn.dataset.demoColor);
        markSaved();
      });
    });
  });

  /* ---------- process line follows scroll ---------- */
  const steps = $('[data-steps]');
  if (steps) {
    const line = $('.steps-line', steps);
    const update = () => {
      const r = steps.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.8 - r.top) / r.height, 0), 1);
      line.style.setProperty('--progress', `${p * 100}%`);
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- package CTA pre-selects the form option ---------- */
  const select = $('#f-package');
  $$('[data-package]').forEach((a) => a.addEventListener('click', () => {
    if (select) select.value = a.dataset.package;
  }));

  /* ---------- contact form ---------- */
  const form = $('#enquiry');
  if (form) {
    const status = $('.form-status', form);
    const show = (msg, err) => {
      status.hidden = false;
      status.textContent = msg;
      status.classList.toggle('form-status--error', !!err);
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.company_url.value) return; // honeypot
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      const endpoint = form.dataset.endpoint;
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error('bad response');
        } else {
          await new Promise((r) => setTimeout(r, 700));
        }
        show('Got it! We read every message ourselves and will reply within one business day.');
        form.reset();
      } catch {
        show('Something went wrong sending that. Email us directly at hello@nerdvision.tech and we will sort it out.', true);
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
