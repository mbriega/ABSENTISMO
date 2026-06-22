// js/components/charts.js
// Gráficas con Canvas API nativo — sin dependencias externas

const ChartsComponent = (() => {

  const COLORS = {
    primary:      "#2563eb",
    primary15:    "rgba(37, 99, 235, 0.15)",
    primary01:    "rgba(37, 99, 235, 0.01)",
    surface200:   "#e2e8f0",
    surface400:   "#94a3b8",
    surface700:   "#334155",
    intervention: "#f97316"
  };

  // ── HiDPI helper ─────────────────────────────────────────────
  function prepareCanvas(canvas, cssHeight) {
    var dpr  = window.devicePixelRatio || 1;
    canvas.style.width  = "100%";
    canvas.style.height = cssHeight + "px";
    var cssW = canvas.getBoundingClientRect().width || canvas.parentElement.clientWidth;
    canvas.width  = cssW  * dpr;
    canvas.height = cssHeight * dpr;
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx: ctx, W: cssW, H: cssHeight };
  }

  // ── 1. Barras horizontales — Impacto económico ───────────────
  function renderBarChart(canvasId, items) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var res    = prepareCanvas(canvas, 220);
    var ctx    = res.ctx;
    var W      = res.W;

    var padL   = 140;
    var padR   = 20;
    var padT   = 10;
    var barH   = 22;
    var gap    = 14;
    var maxV   = Math.max.apply(null, items.map(function(d) { return d.importe; }));
    var chartW = W - padL - padR;

    items.forEach(function(item, i) {
      var y    = padT + i * (barH + gap);
      var barW = (item.importe / maxV) * chartW;

      ctx.fillStyle    = COLORS.surface700;
      ctx.font         = "12px Inter, system-ui, sans-serif";
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(item.concepto, padL - 8, y + barH / 2);

      ctx.fillStyle = COLORS.surface200;
      ctx.beginPath();
      ctx.roundRect(padL, y, chartW, barH, 4);
      ctx.fill();

      ctx.fillStyle = COLORS.primary;
      ctx.beginPath();
      ctx.roundRect(padL, y, Math.max(barW, 4), barH, 4);
      ctx.fill();
    });

    // Marcas eje X
    var axisY = padT + items.length * (barH + gap) + 6;
    var marks = [0, 150000, 300000, 450000, 600000];
    ctx.fillStyle    = COLORS.surface400;
    ctx.font         = "11px Inter, system-ui, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "top";
    marks.forEach(function(v) {
      var x = padL + (v / maxV) * chartW;
      ctx.fillText(v === 0 ? "0K" : (v / 1000) + "K", x, axisY);
    });
  }

  // ── 2. Línea temporal — Evolución ────────────────────────────
  function renderLineChart(canvasId, data) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var res    = prepareCanvas(canvas, 300);
    var ctx    = res.ctx;
    var W      = res.W;

    var padL   = 54;
    var padR   = 16;
    var padT   = 8;
    var padB   = 38;
    var chartW = W - padL - padR;
    var chartH = 300 - padT - padB;

    var values = data.tasa;
    var labels = data.meses;
    var maxV   = Math.max.apply(null, values);

    // Nice Y scale: find step yielding 4-6 ticks
    var steps = [0.25, 0.5, 1, 2, 5, 10];
    var niceMax = maxV, tickStep = maxV / 4;
    for (var si = 0; si < steps.length; si++) {
      var nm = Math.ceil(maxV / steps[si]) * steps[si];
      var nt = Math.round(nm / steps[si]) + 1;
      if (nt >= 4 && nt <= 6) { niceMax = nm; tickStep = steps[si]; break; }
    }
    var numTicks = Math.round(niceMax / tickStep) + 1;

    function toX(i) { return padL + i * (chartW / (labels.length - 1)); }
    function toY(v) { return padT + chartH - (v / niceMax) * chartH; }

    // Grid lines + Y-axis labels
    for (var ti = 0; ti < numTicks; ti++) {
      var tv = Math.round(ti * tickStep * 1000) / 1000;
      var ty = toY(tv);
      ctx.strokeStyle = COLORS.surface200;
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, ty);
      ctx.lineTo(padL + chartW, ty);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle    = COLORS.surface400;
      ctx.font         = "11px Inter, system-ui, sans-serif";
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      ctx.fillText((+tv.toFixed(2)) + "%", padL - 5, ty);
    }

    // X-axis baseline
    ctx.strokeStyle = COLORS.surface200;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT + chartH);
    ctx.lineTo(padL + chartW, padT + chartH);
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle    = COLORS.surface400;
    ctx.font         = "11px Inter, system-ui, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "top";
    labels.forEach(function(lbl, i) {
      ctx.fillText(lbl, toX(i), padT + chartH + 6);
    });

    // Smooth line — quadratic bezier midpoint
    var pts = values.map(function(v, i) { return { x: toX(i), y: toY(v) }; });
    ctx.beginPath();
    ctx.strokeStyle = "#0891b2";
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = "round";
    ctx.lineCap     = "round";
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var pi = 0; pi < pts.length - 1; pi++) {
      var xc = (pts[pi].x + pts[pi + 1].x) / 2;
      var yc = (pts[pi].y + pts[pi + 1].y) / 2;
      ctx.quadraticCurveTo(pts[pi].x, pts[pi].y, xc, yc);
    }
    ctx.quadraticCurveTo(pts[pts.length - 2].x, pts[pts.length - 2].y, pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();

    // Dots
    pts.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle   = "#ffffff";
      ctx.strokeStyle = "#0891b2";
      ctx.lineWidth   = 2;
      ctx.fill();
      ctx.stroke();
    });
  }

  return {
    renderBarChart:  renderBarChart,
    renderLineChart: renderLineChart
  };

})();
