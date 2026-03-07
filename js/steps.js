/* ═══════════════════════════════════════════════════════
   STEP CARD MINI ANIMATIONS — index.html
   Depends on: utils.js (getDemoPath, drawPath)
═══════════════════════════════════════════════════════ */
(function () {
  const configs = [
    { id: 'watch',    fn: drawWatchMini    },
    { id: 'remember', fn: drawRememberMini },
    { id: 'trace',    fn: drawTraceMini    },
    { id: 'score',    fn: drawScoreMini    },
  ];

  configs.forEach(({ id, fn }) => {
    const canvas = document.getElementById('step-canvas-' + id);
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const W    = canvas.width, H = canvas.height;
    const PATH = getDemoPath(W, H, 0.72);
    let t = 0;
    function loop() { fn(ctx, t, W, H, PATH); t++; requestAnimationFrame(loop); }
    loop();
  });

  function bgFill(ctx, W, H) {
    ctx.fillStyle = '#06090f'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,217,255,0.025)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function drawWatchMini(ctx, t, W, H, PATH) {
    bgFill(ctx, W, H);
    const cycle = t % 120, p = Math.min(1, cycle / 80);
    drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.06)', false, 4);
    drawPath(ctx, PATH, p, '#00D9FF', true, 2);
    if (p < 1) {
      const i  = Math.min(PATH.length - 2, Math.floor(p * (PATH.length - 1)));
      const f  = p * (PATH.length - 1) - i;
      const dx = PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * f;
      const dy = PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * f;
      ctx.save(); ctx.shadowColor = '#00D9FF'; ctx.shadowBlur = 12;
      ctx.fillStyle = '#00D9FF'; ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function drawRememberMini(ctx, t, W, H, PATH) {
    bgFill(ctx, W, H);
    const cycle = t % 120;
    const alpha = cycle < 60 ? 1 : Math.max(0, 1 - (cycle - 60) / 30);
    drawPath(ctx, PATH, 1, `rgba(0,217,255,${alpha * 0.85})`, false, 2);
    if (alpha < 0.3) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.15);
      ctx.fillStyle = `rgba(0,255,159,${pulse * 0.7})`;
      ctx.font = 'bold 10px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('YOUR TURN!', W / 2, H * 0.88);
    }
  }

  function drawTraceMini(ctx, t, W, H, PATH) {
    bgFill(ctx, W, H);
    drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.1)', false, 4);
    const p       = Math.min(1, (t % 120) / 90);
    const playerP = PATH.map(([x, y]) => [
      x + (Math.sin(t * 0.05 + x) * 0.5 * 5),
      y + (Math.cos(t * 0.05 + y) * 0.5 * 5),
    ]);
    drawPath(ctx, playerP, p, '#00FF9F', true, 2);
  }

  function drawScoreMini(ctx, t, W, H, PATH) {
    bgFill(ctx, W, H);
    drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.2)', false, 2);
    const acc = Math.round(85 + 8 * Math.sin(t * 0.04));
    ctx.fillStyle = '#00D9FF'; ctx.font = 'bold 20px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(acc + '%', W / 2, H / 2 + 4);
    ctx.fillStyle = 'rgba(240,244,255,0.4)'; ctx.font = '9px Inter,sans-serif';
    ctx.fillText('ACCURACY', W / 2, H / 2 - 14);
    const stars = acc >= 90 ? 3 : acc >= 75 ? 2 : 1;
    for (let s = 0; s < 3; s++) {
      ctx.fillStyle = s < stars ? '#FFD700' : 'rgba(255,255,255,0.1)';
      ctx.font = '13px sans-serif';
      ctx.fillText('★', W / 2 - 18 + s * 18, H / 2 + 24);
    }
  }
})();
