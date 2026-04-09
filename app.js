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
