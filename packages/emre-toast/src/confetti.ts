/**
 * Lightweight canvas confetti burst - zero dependencies.
 * Fires particles from a point, suitable for success toast celebrations.
 */
const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#22c55e", "#3b82f6", "#f59e0b"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export function fireConfetti(container: HTMLElement, x: number, y: number): void {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    document.body.removeChild(canvas);
    return;
  }
  const ctx: CanvasRenderingContext2D = context;

  const rect = container.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const particles: Particle[] = [];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 4,
      life: 1,
    });
  }

  let raf: number;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let allDead = true;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= 0.015;

      if (p.life > 0) {
        allDead = false;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    if (!allDead) {
      raf = requestAnimationFrame(tick);
    } else {
      document.body.removeChild(canvas);
      cancelAnimationFrame(raf);
    }
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  raf = requestAnimationFrame(tick);
}
