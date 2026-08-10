/* =========================================================
   Padel UP — interactions
   nav · language (EN/AR + RTL) · reveals · counters ·
   booking → WhatsApp · today's hours · fab
   ========================================================= */
(function () {
  'use strict';

  /** Club WhatsApp number in international format, digits only. */
  var WHATSAPP = '966506940479';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- sticky nav + mobile menu ---------------- */
  var nav      = $('#nav');
  var navLinks = $('#navLinks');
  var burger   = $('#burger');
  var fab      = $('.fab');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 24);
    if (fab) fab.classList.toggle('is-shown', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
  }

  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });

  $$('#navLinks a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------------- active section highlight ---------------- */
  var sectionIds = $$('#navLinks a')
    .map(function (a) { return a.getAttribute('href'); })
    .filter(function (h) { return h && h.charAt(0) === '#'; });

  var sections = sectionIds
    .map(function (id) { return document.querySelector(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        $$('#navLinks a').forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- reveal on scroll ---------------- */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-visible'); }, Math.min(i, 6) * 70);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { revealer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* also flag the step cards so their top-border animation fires */
  $$('.step').forEach(function (el) {
    el.addEventListener('transitionend', function () { el.classList.add('is-visible'); }, { once: true });
  });

  /* ---------------- animated counters ---------------- */
  function countUp(el) {
    var target   = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var start    = null;
    var DURATION = 1400;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObs.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute('data-count'))
        .toFixed(parseInt(el.getAttribute('data-decimals') || '0', 10));
    });
  }

  /* ---------------- language toggle (EN ⇄ AR) ---------------- */
  var langBtn   = $('#langToggle');
  var langLabel = $('[data-lang-label]');

  function applyLang(lang) {
    var isAr = lang === 'ar';

    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

    $$('[data-en][data-ar]').forEach(function (el) {
      var val = el.getAttribute(isAr ? 'data-ar' : 'data-en');
      if (val === null || val === '') return;          // empty = keep existing text
      if (val.indexOf('<br>') !== -1) el.innerHTML = val;
      else el.textContent = val;
    });

    $$('[data-ph-en][data-ph-ar]').forEach(function (el) {
      el.placeholder = el.getAttribute(isAr ? 'data-ph-ar' : 'data-ph-en');
    });

    /* review bodies: show the Arabic original alone when browsing in Arabic */
    $$('.review .en').forEach(function (el) { el.hidden = isAr; });

    if (langLabel) langLabel.textContent = isAr ? 'English' : 'العربية';
    langBtn.setAttribute('aria-label', isAr ? 'Switch to English' : 'التبديل إلى العربية');

    try { localStorage.setItem('padelup-lang', lang); } catch (e) { /* private mode */ }
  }

  /* Arabic is the served default — the markup ships Arabic text and dir="rtl", so a
     first-time visitor never sees a flash of English. Applying it again on load is a
     no-op for the text and also syncs the bits that only live in JS (placeholders,
     the toggle label). Only a returning visitor who chose English gets switched. */
  var savedLang;
  try { savedLang = localStorage.getItem('padelup-lang'); } catch (e) { savedLang = null; }
  applyLang(savedLang === 'en' ? 'en' : 'ar');

  langBtn.addEventListener('click', function () {
    applyLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
  });

  /* ---------------- booking form → WhatsApp ---------------- */
  var form = $('#bookForm');

  /* default the date picker to today, and block past dates */
  var dateInput = $('#bf-date');
  if (dateInput) {
    var now = new Date();
    var iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    dateInput.value = iso;
    dateInput.min = iso;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var isAr = document.documentElement.lang === 'ar';

    var lines = isAr
      ? [
          'مرحباً بادل اب 👋 أرغب بحجز ملعب:',
          '',
          'الاسم: '      + data.get('name'),
          'الرياضة: '    + data.get('sport'),
          'التاريخ: '    + data.get('date'),
          'الوقت: '      + data.get('time'),
          'المدة: '      + data.get('duration') + ' دقيقة',
          'عدد اللاعبين: ' + data.get('players')
        ]
      : [
          'Hi Padel UP 👋 I\'d like to book a court:',
          '',
          'Name: '     + data.get('name'),
          'Sport: '    + data.get('sport'),
          'Date: '     + data.get('date'),
          'Time: '     + data.get('time'),
          'Duration: ' + data.get('duration') + ' minutes',
          'Players: '  + data.get('players')
        ];

    var notes = (data.get('notes') || '').trim();
    if (notes) lines.push((isAr ? 'ملاحظات: ' : 'Notes: ') + notes);

    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
  });

  /* ---------------- hours: highlight today, and label the hero pill ---------------- */
  var rows = $$('.hours tbody tr');
  if (rows.length === 7) {
    /* table starts on Sunday, matching getDay() === 0 */
    var todayRow = rows[new Date().getDay()];
    todayRow.classList.add('is-today');

    /* the club opens at 4 PM Sun–Wed but 3 PM Thu–Sat, so read it off the row */
    var pill = $('#todayHours');
    var opens = todayRow.getAttribute('data-opens');
    if (pill && opens) {
      var hour24 = parseInt(opens.split(':')[0], 10);
      var hour12 = ((hour24 + 11) % 12) + 1;
      pill.setAttribute('data-en', 'Open from ' + hour12 + ' PM');
      pill.setAttribute('data-ar', 'نفتح ' + hour12 + ' عصراً');
      pill.textContent = pill.getAttribute(
        document.documentElement.lang === 'ar' ? 'data-ar' : 'data-en'
      );
    }
  }

  /* ---------------- gallery lightbox ---------------- */
  var shots = $$('.shot');
  var lb      = $('#lightbox');
  var lbImg   = $('#lbImg');
  var lbCap   = $('#lbCap');
  var lbIndex = 0;
  var lastFocused = null;

  function showShot(i) {
    lbIndex = (i + shots.length) % shots.length;
    var fig = shots[lbIndex];
    var img = fig.querySelector('img');
    /* jump straight to the wide file rather than the thumbnail */
    lbImg.src = img.currentSrc ? img.currentSrc.replace('-600.webp', '-1200.webp')
                               : img.src.replace('-600.webp', '-1200.webp');
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector('figcaption').textContent;
  }

  function openLightbox(i) {
    lastFocused = document.activeElement;
    showShot(i);
    lb.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('#lbClose').focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  }

  shots.forEach(function (fig, i) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', function () { openLightbox(i); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  if (lb) {
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', function () { showShot(lbIndex - 1); });
    $('#lbNext').addEventListener('click', function () { showShot(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showShot(lbIndex + 1);
      if (e.key === 'ArrowLeft')  showShot(lbIndex - 1);
    });
  }

  /* ---------------- footer year ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
