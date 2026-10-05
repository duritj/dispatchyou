/* ---------- Sticky header shadow ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.classList.remove('open');
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

/* ---------- Forms (demo behaviour) ---------- */
document.querySelectorAll('form.specialist__card, #specialistForm').forEach((specialistForm) => {
  specialistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = specialistForm.querySelector('.form-msg');
    if (msg) msg.hidden = false;
    const btn = specialistForm.querySelector('button[type="submit"]');
    if (btn) btn.textContent = 'REQUEST SENT';
  });
});

const newsForm = document.getElementById('newsForm');
if (newsForm) {
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsForm.querySelector('button');
    btn.textContent = 'SUBSCRIBED';
    newsForm.querySelector('input').value = '';
  });
}

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
