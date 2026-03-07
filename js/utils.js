/* ═══════════════════════════════════════════════════════
   UTILS — shared canvas helpers for gameplay animations
═══════════════════════════════════════════════════════ */

/**
 * Returns an array of [x, y] points forming a star-shaped demo path.
 * @param {number} W  - canvas width
 * @param {number} H  - canvas height
 * @param {number} scale - optional scale multiplier (default 1)
 */
function getDemoPath(W, H, scale) {
  const s  = scale || 1;
  const cx = W / 2, cy = H * 0.46;
  const r1 = Math.min(W, H) * 0.34 * s;
  const r2 = r1 * 0.48;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  pts.push(pts[0]);
  return pts;
}

/**
 * Draws a partial path up to a given progress (0–1).
 */
function drawPath(ctx, pts, progress, color, glow, lineWidth) {
  if (pts.length < 2) return;
  const total = pts.length - 1;
  const drawn = progress * total;
  const full  = Math.floor(drawn);
  const frac  = drawn - full;

  ctx.save();
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 14; }
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineWidth || 2.5;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= full; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (frac > 0 && full < total) {
    const ix = pts[full][0] + (pts[full + 1][0] - pts[full][0]) * frac;
    const iy = pts[full][1] + (pts[full + 1][1] - pts[full][1]) * frac;
    ctx.lineTo(ix, iy);
  }
  ctx.stroke();
  ctx.restore();
}
