// ============ CONFIG: update these with your real links ============
const LINKS = {
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-profile"
};
document.querySelectorAll('#githubLink, #githubLink2').forEach(el => el.href = LINKS.github);
document.querySelectorAll('#linkedinLink, #linkedinLink2').forEach(el => el.href = LINKS.linkedin);

// ============ TYPED ROLE ROTATION ============
const roles = [
  "AI / ML Engineer",
  "Multi-Agent Systems Builder",
  "TEDxTIET Events and Outreach Lead",
  "GenAI Explorer"
];
const typedEl = document.getElementById('typedRole');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}

if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    typeLoop();
  }
}

// ============ HERO AGENT-GRAPH BACKGROUND ============
(function initGraph() {
  const container = document.getElementById('graphCanvas');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, nodes = [];
  const NODE_COUNT = 22;
  const LINK_DIST = 170;

  function resize() {
    w = container.offsetWidth;
    h = container.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }

  function makeNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 1.4
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(94, 234, 212, ${0.14 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 107, 74, 0.55)';
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();

  window.addEventListener('resize', () => {
    resize();
    makeNodes();
    if (reduceMotion) step();
  });
})();

// ============ MOBILE NAV TOGGLE ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-links--open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('nav-links--open'));
  });
}

// ============ SCROLL REVEAL ============
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.project-card, .role-card, .timeline-item, .stat, .skill-group'
  );
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));
}