// ===== SCROLL VIDEO AUTOPLAY =====
['techVideo', 'tetrahVideo'].forEach(id => {
  const vid = document.getElementById(id);
  if (vid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          vid.play();
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(vid);
  }
});

// ===== LOGO BANNER SHRINK =====
const logoBanner = document.querySelector('.logo-banner');

if (logoBanner) {
  const minHeight = 80;
  let fullHeight;

  function measureBanner() {
    logoBanner.style.height = '';
    fullHeight = logoBanner.offsetHeight;
    logoBanner.style.height = Math.max(minHeight, fullHeight - window.scrollY) + 'px';
  }

  window.addEventListener('load', measureBanner);
  window.addEventListener('resize', measureBanner);

  window.addEventListener('scroll', () => {
    if (!fullHeight) return;
    const newHeight = Math.max(minHeight, fullHeight - window.scrollY * 0.4);
    logoBanner.style.height = newHeight + 'px';
  });
}



// ===== TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabPanels.forEach(p => p.classList.remove('active'));
document.getElementById('tab-hardware').classList.add('active');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    syncNavTabs(btn.dataset.tab);
    if (btn.dataset.tab === 'hardware') {
      requestAnimationFrame(openHardwareAccordions);
    }
  });
});

// ===== ACCORDION =====
const manuallyClosed = new Set();

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const body = document.getElementById(header.dataset.target);
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open');
    header.classList.toggle('open');
    if (isOpen) {
      manuallyClosed.add(header.dataset.target);
    } else {
      manuallyClosed.delete(header.dataset.target);
    }
  });
});

function openHardwareAccordions() {
  document.querySelectorAll('#tab-hardware .accordion-header').forEach(header => {
    const body = document.getElementById(header.dataset.target);
    if (!manuallyClosed.has(header.dataset.target)) {
      body.style.transition = 'none';
      body.style.opacity = '1';
      body.classList.add('open');
      header.classList.add('open');
      requestAnimationFrame(() => {
        body.style.transition = '';
        body.style.opacity = '';
      });
    }
  });
}

openHardwareAccordions();

// ===== DRAWER =====
const navToggle = document.getElementById('navToggle');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');
const drawerContactLink = document.getElementById('drawerContactLink');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
}

navToggle.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

drawerContactLink.addEventListener('click', (e) => {
  e.preventDefault();
  closeDrawer();
  syncNavTabs('opportunity');
  setTimeout(() => {
    const target = document.getElementById('the-future');
    const top = target.getBoundingClientRect().top + window.scrollY - stickyNav.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 50);
});

// ===== STICKY NAV =====
const stickyNav = document.querySelector('.sticky-nav');

function setNavHeight() {
  document.documentElement.style.setProperty('--nav-height', stickyNav.offsetHeight + 'px');
}
setNavHeight();
window.addEventListener('resize', setNavHeight);

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    stickyNav.classList.add('scrolled');
    setNavHeight();
  } else {
    stickyNav.classList.remove('scrolled');
    setNavHeight();
  }
}, { passive: true });

// ===== NAV TAB BAR (appears in header on scroll) =====
const tabBar = document.querySelector('.tab-bar');
const navTabBar = document.getElementById('navTabBar');
const navTabBtns = document.querySelectorAll('.nav-tab-btn');

function syncNavTabs(activeTab) {
  navTabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === activeTab);
  });
  tabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === activeTab);
  });
  tabPanels.forEach(p => p.classList.remove('active'));
  const target = document.getElementById('tab-' + activeTab);
  void target.offsetWidth; // force reflow so tabFadeIn animation restarts
  target.classList.add('active');
}

navTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    syncNavTabs(btn.dataset.tab);
    if (btn.dataset.tab === 'hardware') {
      requestAnimationFrame(openHardwareAccordions);
    }
  });
});

new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
    stickyNav.classList.add('tabs-visible');
  } else {
    stickyNav.classList.remove('tabs-visible');
  }
}, { threshold: 0 }).observe(tabBar);

// ===== SECTION REVEAL ON SCROLL =====
const revealSections = document.querySelectorAll('.scroll-shrink');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

revealSections.forEach(s => revealObserver.observe(s));

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let W, H, particles;

const TEAL = 'rgba(0, 200, 180,';
const COUNT = 80;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function initParticles() {
  particles = Array.from({ length: COUNT }, () => ({
    x: randomBetween(0, W),
    y: randomBetween(0, H),
    r: randomBetween(0.4, 1.8),
    vx: randomBetween(-0.15, 0.15),
    vy: randomBetween(-0.25, -0.05),
    alpha: randomBetween(0.1, 0.55),
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const lineAlpha = (1 - dist / 120) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `${TEAL} ${lineAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${TEAL} ${p.alpha})`;
    ctx.fill();
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    // wrap around
    if (p.y < -5) p.y = H + 5;
    if (p.x < -5) p.x = W + 5;
    if (p.x > W + 5) p.x = -5;
  }
}

function loop() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(loop);
}

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

resize();
initParticles();
loop();
