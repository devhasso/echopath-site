/* ═══════════════════════════════════════════════════════
   PHONE MOCKUP GAMEPLAY DEMO — index.html
   Depends on: utils.js (getDemoPath, drawPath)
═══════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('gameplay-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = 248;
  canvas.height = 496;
  const W = canvas.width, H = canvas.height;
  const PATH = getDemoPath(W, H, 0.88);

  const PHASES = [
    { id: 'watch',  label: 'WATCH',    dur: 160 },
    { id: 'wait',   label: 'REMEMBER', dur:  60 },
    { id: 'trace',  label: 'DRAW',     dur: 160 },
    { id: 'score',  label: 'SCORED',   dur: 110 },
  ];
  let phaseIdx = 0, phaseT = 0;
  let playerPath = [];

  function buildPlayerPath() {
    playerPath = PATH.map(([x, y]) => [
      x + (Math.random() - 0.5) * 7,
      y + (Math.random() - 0.5) * 7,
    ]);
  }
  buildPlayerPath();

  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawFrame() {
    const ph       = PHASES[phaseIdx];
    const progress = Math.min(1, phaseT / ph.dur);

    // Background
    ctx.fillStyle = '#06090f';
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(0,217,255,0.03)';
    ctx.lineWidth   = 1;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    if (ph.id === 'watch') {
      const p = easeInOut(Math.min(1, phaseT / (ph.dur * 0.85)));
      drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.07)', false, 6);
      drawPath(ctx, PATH, p, '#00D9FF', true, 2.8);
      if (p < 1) {
        const idx = Math.min(PATH.length - 2, Math.floor(p * (PATH.length - 1)));
        const fr  = p * (PATH.length - 1) - idx;
        const dx  = PATH[idx][0] + (PATH[idx + 1][0] - PATH[idx][0]) * fr;
        const dy  = PATH[idx][1] + (PATH[idx + 1][1] - PATH[idx][1]) * fr;
        ctx.save(); ctx.shadowColor = '#00D9FF'; ctx.shadowBlur = 16;
        ctx.fillStyle = '#00D9FF'; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    } else if (ph.id === 'wait') {
      const alpha = Math.max(0, 1 - progress * 1.4);
      drawPath(ctx, PATH, 1, `rgba(0,217,255,${alpha * 0.9})`, false, 2.5);
      const pulse = 0.6 + 0.4 * Math.sin(phaseT * 0.18);
      ctx.save();
      ctx.fillStyle = `rgba(0,217,255,${pulse * 0.9})`;
      ctx.font = 'bold 13px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('DRAW FROM MEMORY', W / 2, H * 0.88);
      ctx.restore();
    } else if (ph.id === 'trace') {
      drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.1)', false, 5);
      const p = easeInOut(Math.min(1, phaseT / (ph.dur * 0.85)));
      drawPath(ctx, playerPath, p, '#00FF9F', true, 2.8);
      if (p < 1) {
        const idx = Math.min(playerPath.length - 2, Math.floor(p * (playerPath.length - 1)));
        const fr  = p * (playerPath.length - 1) - idx;
        const dx  = playerPath[idx][0] + (playerPath[idx + 1][0] - playerPath[idx][0]) * fr;
        const dy  = playerPath[idx][1] + (playerPath[idx + 1][1] - playerPath[idx][1]) * fr;
        ctx.save(); ctx.shadowColor = '#00FF9F'; ctx.shadowBlur = 14;
        ctx.fillStyle = '#00FF9F'; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    } else if (ph.id === 'score') {
      drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.25)', false, 2.5);
      drawPath(ctx, playerPath, 1, 'rgba(0,255,159,0.55)', false, 2.5);
      const fadeIn = Math.min(1, progress * 3);
      const cardW = 160, cardH = 100, cx2 = W / 2, cy2 = H * 0.44;
      ctx.save();
      ctx.globalAlpha = fadeIn;
      ctx.fillStyle   = 'rgba(6,9,15,0.88)';
      roundRect(ctx, cx2 - cardW / 2, cy2 - cardH / 2, cardW, cardH, 14); ctx.fill();
      ctx.strokeStyle = 'rgba(0,217,255,0.2)'; ctx.lineWidth = 1;
      roundRect(ctx, cx2 - cardW / 2, cy2 - cardH / 2, cardW, cardH, 14); ctx.stroke();
      const acc = Math.round(progress < 0.5 ? progress * 2 * 89 : 89);
      ctx.fillStyle = '#00D9FF'; ctx.font = 'bold 28px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(acc + '%', cx2, cy2 + 6);
      ctx.fillStyle = 'rgba(240,244,255,0.5)'; ctx.font = '11px Inter,sans-serif';
      ctx.fillText('ACCURACY', cx2, cy2 - 18);
      const starsToShow = progress > 0.85 ? 3 : progress > 0.65 ? 2 : progress > 0.35 ? 1 : 0;
      const starSpacing = 26, starStart = cx2 - (2 * starSpacing) / 2;
      for (let s = 0; s < 3; s++) {
        ctx.fillStyle = s < starsToShow ? '#FFD700' : 'rgba(255,255,255,0.1)';
        ctx.font = '18px sans-serif';
        ctx.fillText('★', starStart + s * starSpacing, cy2 + 32);
      }
      ctx.restore();
    }

    // Phase label pill
    const labelAlpha  = ph.id === 'score' ? Math.min(1, progress * 3) : 1;
    const labelColors = { watch: '#00D9FF', wait: '#00FF9F', trace: '#00FF9F', score: '#FFD700' };
    ctx.save();
    ctx.globalAlpha = labelAlpha;
    ctx.fillStyle   = 'rgba(6,9,15,0.75)';
    const lw = 80, lh = 22, lx = W / 2 - lw / 2, ly = 28;
    roundRect(ctx, lx, ly, lw, lh, 11); ctx.fill();
    ctx.strokeStyle = labelColors[ph.id] + '44'; ctx.lineWidth = 1;
    roundRect(ctx, lx, ly, lw, lh, 11); ctx.stroke();
    ctx.fillStyle = labelColors[ph.id];
    ctx.font = 'bold 10px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(ph.label, W / 2, ly + 15);
    ctx.restore();

    // Advance phase
    phaseT++;
    if (phaseT > ph.dur + 20) {
      phaseT   = 0;
      phaseIdx = (phaseIdx + 1) % PHASES.length;
      if (PHASES[phaseIdx].id === 'trace') buildPlayerPath();
    }
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();
