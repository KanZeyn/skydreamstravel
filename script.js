/* ════════════════════════════════════════════════════════════
   SKY DREAMS TRAVEL — PREMIUM JAVASCRIPT
   Fethiye Ölüdeniz Paragliding | Interactive & Conversion
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM READY ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initFAQ();
  initWhatsAppTooltip();
  initFooterYear();
  initReelSound();

});

/* ════════════════════════════════════════════════════════════
   1. NAVBAR — Scroll'da şeffaf/opak geçiş
   ════════════════════════════════════════════════════════════ */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}

/* ════════════════════════════════════════════════════════════
   2. MOBILE MENU — Hamburger toggle
   ════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !menu) return;

  const openMenu = () => {
    toggle.classList.add('open');
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    // Prevent background scroll AND page shift
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = scrollY;
  };

  const closeMenu = () => {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    // Restore scroll position
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Overlay tıklayınca kapat
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Menüdeki bir linke tıklayınca kapat
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Dışarı tıklayınca kapat (fallback)
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && e.target !== overlay) {
      closeMenu();
    }
  });

  // ESC tuşu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ════════════════════════════════════════════════════════════
   3. SCROLL REVEAL — Elemanlar görünüm alanına girince
   ════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .feature-card, .package-card, .review-card, .faq-item, .gallery-item, .stat-item');

  if (!targets.length) return;

  // Kartlara reveal class ekle (eğer yoksa)
  targets.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Bir kez tetikle
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   4. COUNTER ANIMATION — Sayılar 0'dan hedefe
   ════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseFloat(el.getAttribute('data-target'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    const duration = 1800; // ms
    const stepTime = 16;   // ~60fps
    const steps    = duration / stepTime;
    const increment = target / steps;

    let current = 0;
    let frame   = 0;

    const update = () => {
      frame++;
      // Ease-out: yavaşlayan artış
      const progress = frame / steps;
      const eased    = 1 - Math.pow(1 - progress, 3);
      current        = target * eased;

      if (decimals > 0) {
        el.textContent = current.toFixed(decimals) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString('tr-TR') + suffix;
      }

      if (frame < steps) {
        requestAnimationFrame(update);
      } else {
        // Kesin hedef değer
        if (decimals > 0) {
          el.textContent = target.toFixed(decimals) + suffix;
        } else {
          el.textContent = target.toLocaleString('tr-TR') + suffix;
        }
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Kısa gecikme sonra başlat (daha dramatik)
        const delay = parseInt(entry.target.closest('.stat-item')?.getAttribute('data-delay') || '0', 10);
        setTimeout(() => animateCounter(entry.target), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el, i) => {
    // Her sayaç için sıralı gecikme
    el.closest('.stat-item')?.setAttribute('data-delay', i * 150);
    observer.observe(el);
  });
}

/* ════════════════════════════════════════════════════════════
   5. SMOOTH SCROLL — Anchor linkleri için
   ════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════════════════════
   6. FAQ ACCORDION — Details/Summary smooth açılış
   ════════════════════════════════════════════════════════════ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');

      // Diğerlerini kapat (accordion davranışı)
      faqItems.forEach(other => {
        if (other !== item && other.hasAttribute('open')) {
          other.removeAttribute('open');
        }
      });

      // Toggle mevcut
      if (isOpen) {
        item.removeAttribute('open');
      } else {
        item.setAttribute('open', '');
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   7. WHATSAPP TOOLTIP — 10s sonra ve scroll %50'de balon göster
   ════════════════════════════════════════════════════════════ */
function initWhatsAppTooltip() {
  const btn     = document.getElementById('floatingWhatsapp');
  if (!btn) return;

  const tooltip = btn.querySelector('.floating-whatsapp-tooltip');
  if (!tooltip) return;

  let shown     = false;
  let timer     = null;

  const showTooltip = () => {
    if (shown) return;
    shown = true;

    // Mesajı güncelle
    tooltip.textContent = '💬 Uçuş tarihinizi birlikte planlayalım!';

    // Sağ taraf oku için pseudo-element CSS'de — span olarak ekle
    tooltip.classList.add('show');

    // 5 saniye sonra kapat
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 5000);

    // Sonra her 20 saniyede bir tekrar göster
    setTimeout(() => {
      shown = false;
    }, 25000);
  };

  // Tetikleyici 1: 10 saniye sonra
  timer = setTimeout(showTooltip, 10000);

  // Tetikleyici 2: Sayfanın %50'sine gelince
  const onScrollCheck = () => {
    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && scrolled / docHeight >= 0.5) {
      clearTimeout(timer);
      showTooltip();
      window.removeEventListener('scroll', onScrollCheck);
    }
  };
  window.addEventListener('scroll', onScrollCheck, { passive: true });

  // Hover'da tooltip'i göster
  btn.addEventListener('mouseenter', () => {
    tooltip.classList.add('show');
  });
  btn.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
  });
}

/* ════════════════════════════════════════════════════════════
   8. FOOTER YEAR — Otomatik yıl
   ════════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ════════════════════════════════════════════════════════════
   9. PERFORMANCE — Passive event listeners & rAF throttle
   ════════════════════════════════════════════════════════════ */

// Scroll event throttling (scroll reveal zaten passive: true)
// Gallery lazy-load fallback
(function lazyImageFallback() {
  if ('loading' in HTMLImageElement.prototype) return; // Native support

  const images = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      }
    });
  });

  images.forEach(img => observer.observe(img));
})();

/* ════════════════════════════════════════════════════════════
   10. PACKAGE CARD — Touch device'lar için tilt efekti
   ════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  // Sadece pointer (mouse) cihazlarda çalış
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.package-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;  // max ±6deg
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform     = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition     = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   11. WHY-US PREMIUM ANIMATIONS
   ════════════════════════════════════════════════════════════ */
(function initWhyUs() {
  const section    = document.getElementById('why-us');
  const cards      = document.querySelectorAll('#why-us .feature-card');
  const trustStrip = document.querySelector('.why-us-trust-strip');
  if (!section || !cards.length) return;

  // 1) Orb'ları bölüm görünüme girince aç
  const orbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add('orbs-visible');
        orbObserver.unobserve(section);
      }
    });
  }, { threshold: 0.10 });
  orbObserver.observe(section);

  // 2) Feature kartları sıralı giriş animasyonu
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const index = parseInt(card.getAttribute('data-fc-index') || '0', 10);
        setTimeout(() => card.classList.add('fc-visible'), index * 90);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  cards.forEach((card, i) => {
    card.setAttribute('data-fc-index', i);
    cardObserver.observe(card);
  });

  // 3) Trust şeridini göster
  if (trustStrip) {
    const stripObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trustStrip.classList.add('ts-visible');
          stripObserver.unobserve(trustStrip);
        }
      });
    }, { threshold: 0.30 });
    stripObserver.observe(trustStrip);
  }
})();

/* ════════════════════════════════════════════════════════════
   12. REEL SOUND — Rehber videosu tıklayınca ses aç/kapat
   ════════════════════════════════════════════════════════════ */
function initReelSound() {
  const rehberReel = document.getElementById('reelRehber');
  if (!rehberReel) return;

  const video = rehberReel.querySelector('.gallery-reel-video');
  const hint  = rehberReel.querySelector('.reel-sound-hint');
  if (!video) return;

  video.muted = true;
  video.play().catch(() => {});

  rehberReel.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Playlist reel'i de sustur
    const pv = document.getElementById('videoPlaylist');
    const pr = document.getElementById('reelPlaylist');
    if (pv) { pv.muted = true; }
    if (pr) { pr.classList.remove('sound-on'); const pi = pr.querySelector('.reel-sound-hint i'); if(pi) pi.className='fas fa-volume-mute'; }

    video.muted = !video.muted;
    const hi = hint ? hint.querySelector('i') : null;
    if (!video.muted) {
      rehberReel.classList.add('sound-on');
      if (hi) hi.className = 'fas fa-volume-high';
    } else {
      rehberReel.classList.remove('sound-on');
      if (hi) hi.className = 'fas fa-volume-mute';
    }
  });
}

/* ════════════════════════════════════════════════════════════
   12b. PLAYLIST — Uçuş Anları mp1/mp3/mp4/mp5 otomatik sıralı
   ════════════════════════════════════════════════════════════ */
(function initPlaylist() {
  // Playlist videoları — mp1, mp3, mp4, mp5 (ve ileride eklenecekler)
  const sources = [
    'assets/mp1.mp4',
    'assets/mp3.mp4',
    'assets/mp4.mp4',
    'assets/mp5.mp4'
  ];

  const video     = document.getElementById('videoPlaylist');
  const reel      = document.getElementById('reelPlaylist');
  const dotsWrap  = document.getElementById('playlistDots');
  const prevBtn   = document.getElementById('playlistPrev');
  const nextBtn   = document.getElementById('playlistNext');
  const soundHint = document.getElementById('playlistSoundHint');

  if (!video || !reel) return;

  let current = 0;

  // Sadece mevcut dosyaları kontrol et (404'den kaçın)
  // Başlangıçta ilk videoyu yükle
  function loadVideo(index) {
    current = ((index % sources.length) + sources.length) % sources.length;
    video.src = sources[current];
    video.muted = true;
    reel.classList.remove('sound-on');
    if (soundHint) { const i = soundHint.querySelector('i'); if(i) i.className='fas fa-volume-mute'; }
    video.play().catch(() => {});
    updateDots();
  }

  // Nokta indikatörleri oluştur
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    sources.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'playlist-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); loadVideo(i); });
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.playlist-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Video bitince sonraki
  video.addEventListener('ended', () => loadVideo(current + 1));

  // Prev / Next butonları
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); loadVideo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); loadVideo(current + 1); });

  // Reel tıklaması → ses toggle (rehberi sustur)
  reel.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rehber = document.getElementById('videoRehber');
    const rehberReel = document.getElementById('reelRehber');
    if (rehber) { rehber.muted = true; }
    if (rehberReel) { rehberReel.classList.remove('sound-on'); const ri = rehberReel.querySelector('.reel-sound-hint i'); if(ri) ri.className='fas fa-volume-mute'; }

    video.muted = !video.muted;
    const hi = soundHint ? soundHint.querySelector('i') : null;
    if (!video.muted) {
      reel.classList.add('sound-on');
      if (hi) hi.className = 'fas fa-volume-high';
    } else {
      reel.classList.remove('sound-on');
      if (hi) hi.className = 'fas fa-volume-mute';
    }
  });

  buildDots();
  loadVideo(0);
})();

/* ════════════════════════════════════════════════════════════
   13b. PHOTO SLIDER — 3 saniyede bir otomatik kayan fotoğraflar
   ════════════════════════════════════════════════════════════ */
(function initPhotoSlider() {
  const track = document.getElementById('photoTrack');
  if (!track) return;

  const items = track.querySelectorAll('.insta-item');
  if (!items.length) return;

  const total = items.length;
  // Kaç fotoğraf aynı anda görünecek (CSS'e göre 3)
  const visibleCount = () => {
    if (window.innerWidth <= 520) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  };

  let current = 0;
  let timer = null;
  let paused = false;

  function getItemWidth() {
    if (!items[0]) return 0;
    const rect = items[0].getBoundingClientRect();
    const gap = 10; // CSS gap: 10px
    return rect.width + gap;
  }

  function slideTo(index) {
    const vc = visibleCount();
    const maxIndex = total - vc;
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    current = index;
    const offset = getItemWidth() * current;
    track.style.transform = `translateX(-${offset}px)`;
  }

  function next() {
    slideTo(current + 1);
  }

  function startAuto() {
    timer = setInterval(next, 3000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  // Pause on hover
  const slider = document.getElementById('photoSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => { paused = true; stopAuto(); });
    slider.addEventListener('mouseleave', () => { paused = false; startAuto(); });

    // ── Manuel kaydırma: Mouse drag ──
    let dragStartX = 0;
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => {
      dragStartX = e.clientX;
      isDragging = true;
      stopAuto();
      slider.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      slider.style.cursor = '';
      const diff = dragStartX - e.clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? slideTo(current + 1) : slideTo(current - 1);
      }
      startAuto();
    });

    // ── Manuel kaydırma: Touch (mobil) ──
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? slideTo(current + 1) : slideTo(current - 1);
      }
      startAuto();
    }, { passive: true });
  }

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { slideTo(current); }, 200);
  });

  startAuto();
})();

/* ════════════════════════════════════════════════════════════
   13. ACTIVE NAV LINK — Scroll'a göre aktif link vurgusu
   ════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
})();
