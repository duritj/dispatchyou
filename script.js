/* ---------- Sticky header shadow ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.setAttribute('aria-expanded', 'false');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq__item').forEach((item, index) => {
  const btn = item.querySelector('.faq__q');
  const panel = item.querySelector('.faq__a');
  if (!btn || !panel) return;
  const id = panel.id || ('faq-panel-' + index);
  panel.id = id;
  btn.setAttribute('aria-controls', id);
});
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---------- Chat launcher ---------- */
const launcher = document.createElement('button');
launcher.type = 'button';
launcher.className = 'chat-launcher';
launcher.setAttribute('aria-haspopup', 'dialog');
launcher.innerHTML = '<span aria-hidden="true">●</span> Ask DispatchYou';
document.body.appendChild(launcher);
const chatScript = document.createElement('script');
chatScript.src = 'js/chat.js';
chatScript.defer = true;
document.body.appendChild(chatScript);

/* ---------- Cookie bar ---------- */
const cookie = document.getElementById('cookie');
try {
  if (localStorage.getItem('cookieChoice')) cookie.classList.add('hide');
} catch (_) {}
cookie.querySelectorAll('[data-cookie]').forEach(b => b.addEventListener('click', () => {
  try { localStorage.setItem('cookieChoice', b.dataset.cookie); } catch (_) {}
  cookie.classList.add('hide');
}));

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
