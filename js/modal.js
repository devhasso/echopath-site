/* ═══════════════════════════════════════════════════════
   HOW-TO-PLAY MODAL SYSTEM — index.html
   Depends on: utils.js (getDemoPath, drawPath)
═══════════════════════════════════════════════════════ */

const MODAL_CONFIG = {
  watch: {
    label: 'Step 1 — Watch',
    title: 'The Echo Plays',
    desc:  'The echo path draws itself on screen, segment by segment. Watch every curve and corner — you\'ll need to reproduce it from memory. The path glows cyan as it animates so nothing is missed.',
    fn:    modalWatch,
  },
  remember: {
    label: 'Step 2 — Remember',
    title: 'Hold It In Your Mind',
    desc:  'The path vanishes. Your turn begins. Hold the shape in your mind — its start point, its curves, where it ends. The clock is ticking. The clearer your mental image, the more accurate your trace.',
    fn:    modalRemember,
  },
  trace: {
    label: 'Step 3 — Trace',
    title: 'Draw From Memory',
    desc:  'Drag your finger (or mouse) to reproduce the path you watched. A faint ghost may help guide you. Every deviation costs you accuracy — smooth, confident strokes score the highest.',
    fn:    modalTrace,
  },
  score: {
    label: 'Step 4 — Score',
    title: 'See How You Did',
    desc:  'Your accuracy is calculated and stars are awarded. Hit 92%+ for 3 stars. Earn coins with each success. Chain levels together for win streak bonuses. Try to beat your own personal best.',
    fn:    modalScore,
  },
};

let modalAnimHandle = null;
let currentModal    = null;

function openModal(type) {
  const cfg = MODAL_CONFIG[type];
  if (!cfg) return;
  document.getElementById('modal-label').textContent = cfg.label;
  document.getElementById('modal-title').textContent = cfg.title;
  document.getElementById('modal-desc').textContent  = cfg.desc;

  const overlay = document.getElementById('step-modal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  currentModal       = type;
  const canvas       = document.getElementById('modal-canvas');
  canvas.width       = canvas.offsetWidth  || 480;
  canvas.height      = canvas.offsetHeight || 260;

  if (modalAnimHandle) cancelAnimationFrame(modalAnimHandle);
  let t      = 0;
  const ctx  = canvas.getContext('2d');
  const W    = canvas.width, H = canvas.height;
  const PATH = getDemoPath(W, H, 0.78);

  function loop() {
    if (currentModal !== type) return;
    cfg.fn(ctx, t, W, H, PATH);
    t++;
    modalAnimHandle = requestAnimationFrame(loop);
  }
  loop();
}

function closeModal() {
  document.getElementById('step-modal').classList.remove('open');
  document.body.style.overflow = '';
  currentModal = null;
  if (modalAnimHandle) { cancelAnimationFrame(modalAnimHandle); modalAnimHandle = null; }
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('step-modal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Modal canvas renderers ── */

function mBg(ctx, W, H) {
  ctx.fillStyle = '#06090f'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,217,255,0.03)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function modalWatch(ctx, t, W, H, PATH) {
  mBg(ctx, W, H);
  const cycle = t % 200, p = Math.min(1, cycle / 140);
  drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.07)', false, 7);
  drawPath(ctx, PATH, p, '#00D9FF', true, 3);
  if (p < 1) {
    const i  = Math.min(PATH.length - 2, Math.floor(p * (PATH.length - 1)));
    const f  = p * (PATH.length - 1) - i;
    const dx = PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * f;
    const dy = PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * f;
    ctx.save(); ctx.shadowColor = '#00D9FF'; ctx.shadowBlur = 20;
    ctx.fillStyle = '#00D9FF'; ctx.beginPath(); ctx.arc(dx, dy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  const barW = 200, barX = W / 2 - barW / 2, barY = H - 22;
  ctx.fillStyle = 'rgba(0,217,255,0.1)';
  ctx.beginPath(); ctx.roundRect(barX, barY, barW, 6, 3); ctx.fill();
  ctx.fillStyle = '#00D9FF';
  ctx.beginPath(); ctx.roundRect(barX, barY, barW * Math.max(0, 1 - p), 6, 3); ctx.fill();
  ctx.fillStyle = 'rgba(240,244,255,0.35)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('WATCH PHASE — Follow the path', W / 2, H - 30);
}

function modalRemember(ctx, t, W, H, PATH) {
  mBg(ctx, W, H);
  const cycle = t % 180;
  const alpha = cycle < 90 ? 1 : Math.max(0, 1 - (cycle - 90) / 50);
  drawPath(ctx, PATH, 1, `rgba(0,217,255,${alpha * 0.9})`, cycle < 90, 3);
  const sec = Math.max(0, 3 - Math.floor(cycle / 60));
  if (sec > 0 && alpha < 0.5) {
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.2);
    ctx.fillStyle = `rgba(0,217,255,${pulse})`;
    ctx.font = 'bold 48px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(sec, W / 2, H / 2 + 16);
    ctx.font = '11px Inter,sans-serif'; ctx.fillStyle = 'rgba(240,244,255,0.4)';
    ctx.fillText('YOUR TURN IN...', W / 2, H / 2 - 28);
  }
  if (alpha === 0) {
    const pulse = 0.6 + 0.4 * Math.sin(t * 0.14);
    ctx.fillStyle = `rgba(0,255,159,${pulse})`;
    ctx.font = 'bold 14px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('GO! DRAW IT FROM MEMORY', W / 2, H / 2 + 6);
  }
}

function modalTrace(ctx, t, W, H, PATH) {
  mBg(ctx, W, H);
  drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.1)', false, 6);
  const cycle = t % 200, p = Math.min(1, cycle / 150);
  const pPath = PATH.map(([x, y], i) => [
    x + Math.sin(t * 0.04 + i) * 0.5 * 7,
    y + Math.cos(t * 0.04 + i) * 0.5 * 7,
  ]);
  drawPath(ctx, pPath, p, '#00FF9F', true, 3);
  if (p < 1) {
    const i  = Math.min(pPath.length - 2, Math.floor(p * (pPath.length - 1)));
    const f  = p * (pPath.length - 1) - i;
    const dx = pPath[i][0] + (pPath[i + 1][0] - pPath[i][0]) * f;
    const dy = pPath[i][1] + (pPath[i + 1][1] - pPath[i][1]) * f;
    ctx.save(); ctx.shadowColor = '#00FF9F'; ctx.shadowBlur = 18;
    ctx.fillStyle = '#00FF9F'; ctx.beginPath(); ctx.arc(dx, dy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('☝', dx, dy - 16);
    ctx.restore();
  }
  const accVal = Math.round(75 + 15 * p);
  ctx.fillStyle = 'rgba(0,255,159,0.7)'; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('ACCURACY: ' + accVal + '%', W / 2, H - 18);
}

function modalScore(ctx, t, W, H, PATH) {
  mBg(ctx, W, H);
  drawPath(ctx, PATH, 1, 'rgba(0,217,255,0.22)', false, 2.5);
  const pPath = PATH.map(([x, y]) => [x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3]);
  drawPath(ctx, pPath, 1, 'rgba(0,255,159,0.55)', false, 2.5);
  const cycle = t % 240, fadeIn = Math.min(1, cycle / 40);
  const cW = 200, cH = 120, cx = W / 2, cy = H / 2 + 10;
  ctx.save();
  ctx.globalAlpha = fadeIn;
  ctx.fillStyle   = 'rgba(6,9,15,0.9)';
  ctx.beginPath(); ctx.roundRect(cx - cW / 2, cy - cH / 2, cW, cH, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(0,217,255,0.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(cx - cW / 2, cy - cH / 2, cW, cH, 16); ctx.stroke();
  const acc = Math.round(Math.min(89, (cycle / 240) * 2 * 89));
  ctx.fillStyle = 'rgba(240,244,255,0.45)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('ACCURACY', cx, cy - 30);
  ctx.fillStyle = '#00D9FF'; ctx.font = 'bold 36px Inter,sans-serif';
  ctx.fillText(acc + '%', cx, cy + 6);
  const stars = acc >= 85 ? 3 : acc >= 65 ? 2 : 1;
  for (let s = 0; s < 3; s++) {
    const starScale = s < stars ? 1 : 0.7;
    ctx.fillStyle = s < stars ? '#FFD700' : 'rgba(255,255,255,0.1)';
    ctx.font = `${20 * starScale}px sans-serif`;
    ctx.fillText('★', cx - 24 + s * 24, cy + 40);
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(240,244,255,0.3)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(acc >= 92 ? '🎯 PERFECT!' : acc >= 75 ? '⭐ GREAT!' : '👍 KEEP GOING', cx, H - 16);
}
