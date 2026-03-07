/* ═══════════════════════════════════════════════════════
   AURORA BACKGROUND — shared across all pages
═══════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('aurora-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, t  = 0;

  const WAVES = [
    { amp: 0.10, freq: 0.0020, speed: 0.22, yBase: 0.30, r: 0, g: 217, b: 255, baseAlpha: 0.038, breathSpeed: 0.38, breathOffset: 0.00 },
    { amp: 0.07, freq: 0.0031, speed: 0.15, yBase: 0.52, r: 0, g: 255, b: 159, baseAlpha: 0.028, breathSpeed: 0.29, breathOffset: 1.10 },
    { amp: 0.08, freq: 0.0016, speed: 0.18, yBase: 0.74, r: 0, g: 200, b: 255, baseAlpha: 0.022, breathSpeed: 0.23, breathOffset: 2.30 },
  ];

  const HARMONICS = [
    { freqMul: 1.000, ampMul: 1.00, phaseOff: 0.0 },
    { freqMul: 1.618, ampMul: 0.45, phaseOff: 1.2 },
    { freqMul: 2.414, ampMul: 0.22, phaseOff: 2.7 },
    { freqMul: 3.303, ampMul: 0.11, phaseOff: 0.9 },
  ];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function waveY(wave, x) {
    let y = 0;
    HARMONICS.forEach(h => {
      y += Math.sin(x * wave.freq * h.freqMul + t * wave.speed * h.freqMul + h.phaseOff) * h.ampMul;
    });
    return wave.yBase * H + y * wave.amp * H;
  }

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    WAVES.forEach(wave => {
      const breath = 0.5 + 0.5 * Math.sin(t * wave.breathSpeed + wave.breathOffset);
      const alpha  = wave.baseAlpha * (0.7 + 0.6 * breath);
      const height = 0.13 * H * (0.85 + 0.3 * breath);
      const cy     = waveY(wave, W / 2);

      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) ctx.lineTo(x, waveY(wave, x));
      ctx.lineTo(W, H);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, cy - height, 0, cy + height * 0.4);
      grad.addColorStop(0,   `rgba(${wave.r},${wave.g},${wave.b},0)`);
      grad.addColorStop(0.3, `rgba(${wave.r},${wave.g},${wave.b},${alpha})`);
      grad.addColorStop(0.7, `rgba(${wave.r},${wave.g},${wave.b},${alpha * 0.5})`);
      grad.addColorStop(1,   `rgba(${wave.r},${wave.g},${wave.b},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
