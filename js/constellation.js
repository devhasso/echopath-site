/* ═══════════════════════════════════════════════════════
   CONSTELLATION NETWORK — shared across all pages
═══════════════════════════════════════════════════════ */
(function () {
  const canvas  = document.getElementById('constellation-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H, t   = 0;

  const COUNT   = 58;
  const LINK_D  = 155;
  const LINK_D2 = LINK_D * LINK_D;
  let nodes     = [];

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    nodes = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.30,
      vy:    (Math.random() - 0.5) * 0.30,
      r:     Math.random() * 1.3 + 0.7,
      cyan:  Math.random() < 0.62,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // Move & wrap
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -40)   n.x = W + 40;
      else if (n.x > W + 40) n.x = -40;
      if (n.y < -40)   n.y = H + 40;
      else if (n.y > H + 40) n.y = -40;
    });

    // Connecting lines
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b  = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_D2) {
          const alpha    = (1 - Math.sqrt(d2) / LINK_D) * 0.13;
          const [r, g, bl] = (!a.cyan && !b.cyan) ? [0, 255, 159] : [0, 217, 255];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // Nodes with glow halos
    nodes.forEach(n => {
      const pulse      = 0.55 + 0.45 * Math.sin(t * 0.75 + n.phase);
      const [r, g, b]  = n.cyan ? [0, 217, 255] : [0, 255, 159];
      const nr         = n.r * (0.85 + 0.3 * pulse);

      // Soft radial halo
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, nr * 6);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${0.22 * pulse})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${0.08 * pulse})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, nr * 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.save();
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.shadowBlur  = 6 * pulse;
      ctx.fillStyle   = `rgba(${r},${g},${b},${0.65 * pulse})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, nr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();
