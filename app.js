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



// ===== ACCORDION =====
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const body = document.getElementById(header.dataset.target);
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open');
    header.classList.toggle('open');
  });
});

// ===== WELCOME COLLAPSIBLE =====
const welcomeToggle = document.getElementById('welcomeToggle');
const welcomeBody = document.getElementById('welcomeBody');
if (welcomeToggle && welcomeBody) {
  welcomeToggle.addEventListener('click', () => {
    welcomeToggle.classList.toggle('collapsed');
    welcomeBody.classList.toggle('collapsed');
  });
}

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close when a link is tapped
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== STICKY NAV =====
const stickyNav = document.querySelector('.sticky-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    stickyNav.classList.add('scrolled');
  } else {
    stickyNav.classList.remove('scrolled');
  }
}, { passive: true });

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
