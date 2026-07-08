// js/main.js
// Inicialización — detecta la página por data-page en <body>

document.addEventListener("DOMContentLoaded", function() {

  // Sidebar en todas las páginas
  if (typeof SidebarComponent !== "undefined") {
    SidebarComponent.render();
  }

  var page = document.body.dataset.page;
  if (page === "patrones")   initPatronesPage();
  if (page === "pat-detail") initPatDetailPage();
});

// ══════════════════════════════════════════════════════════════
// TABLA DE PATRONES
// ══════════════════════════════════════════════════════════════

var TableComponent = (function() {

  var CAT_LABELS = {
    reincorp: "Reincorporación",
    it:       "Baja médica IT",
    prov:     "Por provincia",
    cat:      "Por categoría",
    reten:    "Retén/disponibilidad",
    dietas:   "Dietas/comida",
    km:       "Kilometraje",
    he:       "Horas extra",
    resp:     "Mandos/jefatura",
    centro:   "Por centro"
  };

  var TOTAL_COST = PATRONES_DATA.patrones.reduce(function(s, p) {
    return s + (parseInt((p.costeDirecto || "").replace(/[^\d]/g, ""), 10) || 0);
  }, 0);

  var TOTAL_DIAS = PATRONES_DATA.patrones.reduce(function(s, p) {
    return s + (parseInt((p.diasAsoc || "").replace(/[^\d]/g, ""), 10) || 0);
  }, 0);

  var BOX_BG = { critico: "#ef4444", alto: "#f97316", medio: "#eab308", bajo: "#3b82f6" };

  var BADGE = {
    critico: "badge--critico",
    alto:    "badge--alto",
    medio:   "badge--medio",
    bajo:    "badge--bajo"
  };

  function getRiskClass(riesgo) {
    var pct = parseFloat(riesgo);
    if (isNaN(pct)) return "badge--bajo";
    if (pct >= 70)  return "badge--critico";
    if (pct >= 50)  return "badge--alto";
    if (pct >= 30)  return "badge--medio";
    return "badge--bajo";
  }

  var ARROW = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

  function mkMetric(value) {
    return '<td class="py-3 px-4 text-right">'
      + '<span style="font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;tabular-nums;">' + value + '</span>'
      + '</td>';
  }

  function render(filtro) {
    var _f = (typeof activePeriodoFactor !== "undefined") ? activePeriodoFactor : 1.0;
    var tbody = document.getElementById("patrones-table-body");
    if (!tbody) return;

    var items = (filtro === "Todos")
      ? PATRONES_DATA.patrones
      : PATRONES_DATA.patrones.filter(function(p) { return p.categoria === filtro; });

    if (typeof sortBy !== "undefined" && sortBy !== "importancia") {
      items = items.slice();
      if (sortBy === "coste") {
        items.sort(function(a, b) {
          var cA = parseInt((a.costeDirecto || "").replace(/[^\d]/g, ""), 10) || 0;
          var cB = parseInt((b.costeDirecto || "").replace(/[^\d]/g, ""), 10) || 0;
          return cB - cA;
        });
      } else if (sortBy === "riesgo") {
        items.sort(function(a, b) {
          var rA = parseFloat((a.riesgo60d || "").replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
          var rB = parseFloat((b.riesgo60d || "").replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
          return rB - rA;
        });
      } else if (sortBy === "empleados") {
        items.sort(function(a, b) {
          return (parseInt(b.empleados) || 0) - (parseInt(a.empleados) || 0);
        });
      }
    }

    tbody.innerHTML = items.map(function(p, idx) {
      var catLabel  = CAT_LABELS[p.categoria] || p.categoria;
      var isCritico = p.criticidad === "critico";
      var rowClass  = "patrones-row cursor-pointer" + (isCritico ? " patrones-row--critico" : "");
      var rowStyle  = isCritico ? ' style="border-left: 2px solid #ef4444;"' : "";
      var nameClass = isCritico
        ? "text-xs font-semibold text-critical-700 leading-tight"
        : "text-xs font-semibold text-surface-800 leading-tight";

      var rank  = idx + 1;
      var desc  = p.descripcionHumana || p.definicion;
      var boxBg = BOX_BG[p.criticidad] || "#64748b";

      var TEND_COLOR = { "Al alza": "#ef4444", "Estable": "#64748b", "Estable o a la baja": "#16a34a" };
      var TEND_ICON  = { "Al alza": "↗", "Estable": "→", "Estable o a la baja": "↘" };

      var numBox = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;width:52px;">'
        + '<div style="width:44px;height:44px;background:' + boxBg + ';border-radius:12px;'
        + 'display:flex;align-items:center;justify-content:center;">'
        + '<span style="font-size:18px;font-weight:700;color:#fff;line-height:1;">' + rank + '</span>'
        + '</div>'
        + '<span class="badge ' + (BADGE[p.criticidad] || "") + '" style="font-size:9px;padding:1px 6px;">' + p.criticidad + '</span>'
        + '</div>';

      var catBadge = '<span style="display:inline-block;margin-top:3px;font-size:10px;font-weight:500;'
        + 'background:#f1f5f9;color:#64748b;padding:1px 8px;border-radius:999px;">' + catLabel + '</span>';

      var tendColor = TEND_COLOR[p.tendencia] || "#64748b";
      var tendIcon  = TEND_ICON[p.tendencia]  || "→";
      var metaRow = '<div style="display:flex;align-items:center;gap:8px;margin-top:5px;">'
        + '<span style="font-size:11px;color:#94a3b8;">Última ocurrencia: ' + (p.ultimaOcurrencia || "—") + '</span>'
        + (p.tendencia
            ? '<span style="font-size:11px;color:#cbd5e1;">&middot;</span>'
              + '<span style="font-size:11px;font-weight:500;color:' + tendColor + ';">' + tendIcon + ' ' + p.tendencia + '</span>'
            : '')
        + '</div>';

      return '<tr class="' + rowClass + '"' + rowStyle + ' onclick="window.location.href=\'' + p.detalle + '\'">'
        + '<td class="py-3 px-5" style="min-width:300px;">'
        + '<div style="display:flex;align-items:flex-start;gap:12px;">'
        + numBox
        + '<div style="flex:1;min-width:0;">'
        + '<p class="' + nameClass + '">' + p.nombre + '</p>'
        + catBadge
        + (desc ? '<p class="text-[11px] text-surface-400 mt-1 leading-snug">' + desc + '</p>' : '')
        + metaRow
        + '</div></div>'
        + '</td>'
        + mkMetric(p.diasAsoc || '—')
        + mkMetric(p.empleados)
        + mkMetric(_f<0.99 ? fmtEurScaled(p.costeDirecto,_f) : p.costeDirecto)
        + mkMetric(p.activaciones ? Math.round(p.activaciones*_f).toLocaleString('es-ES') : '—')
        + '<td class="py-3 px-4 text-right">'
        + '<a href="' + p.detalle + '" style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;padding:5px 12px;border-radius:8px;white-space:nowrap;text-decoration:none;" onclick="event.stopPropagation()">Ver detalle ' + ARROW + '</a>'
        + '</td>'
        + '</tr>';
    }).join("");
  }

  return { render: render };
})();

// Estado por patrón (activo/inactivo) — en memoria, se reinicia al recargar
var ESTADO = {};
var sortBy = "importancia";

// ══════════════════════════════════════════════════════════════
// PÁGINA: PATRONES (listado)
// ══════════════════════════════════════════════════════════════

function initPatronesPage() {
  // Análisis IA — lista numerada con highlights automáticos
  var aiList = document.getElementById("ai-analysis-list");
  if (aiList) {
    var items    = PATRONES_DATA.aiAnalysis;
    var findings = items.filter(function(i) { return i.tipo !== "accion"; });
    var accion   = items.find(function(i)   { return i.tipo === "accion"; });

    function hlValues(text) {
      return text.replace(/([\d.,]+\s*(?:M€|K€|€|pp|%))/g,
        '<strong style="color:#1e40af;font-weight:600;">$1</strong>');
    }

    var html = '<div style="padding:4px 0;">';
    findings.forEach(function(item, idx) {
      var isCrit   = item.tipo === "critico";
      var numBg    = isCrit ? "#fef2f2" : "#eff6ff";
      var numColor = isCrit ? "#dc2626"  : "#2563eb";
      var border   = idx < findings.length - 1 ? "border-bottom:1px solid #f1f5f9;" : "";
      html += '<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 0;' + border + '">'
        + '<span style="min-width:22px;height:22px;border-radius:50%;background:' + numBg + ';color:' + numColor
        + ';font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">'
        + (idx + 1) + '</span>'
        + '<p style="font-size:13px;color:#475569;line-height:1.65;margin:0;">' + hlValues(item.texto) + '</p>'
        + '</div>';
    });
    html += '</div>';

    if (accion) {
      html += '<div style="margin-top:14px;background:#eff6ff;border-radius:8px;padding:14px 16px;border:1px solid #bfdbfe;">'
        + '<div style="display:flex;align-items:flex-start;gap:10px;">'
        + '<svg style="width:15px;height:15px;color:#2563eb;flex-shrink:0;margin-top:2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>'
        + '</svg>'
        + '<p style="font-size:13px;color:#1e40af;line-height:1.65;margin:0;">' + hlValues(accion.texto) + '</p>'
        + '</div></div>';
    }

    aiList.innerHTML = html;
  }

  // Filtros + tabla inicial
  FiltersComponent.render();
  TableComponent.render("Todos");

  // Ordenar por
  var sortSel = document.getElementById("sort-select");
  if (sortSel) {
    sortSel.addEventListener("change", function() {
      sortBy = sortSel.value;
      TableComponent.render(FiltersComponent.getActive());
    });
  }

  // Toggle activo/inactivo desde columna Acciones
  var patTbody = document.getElementById("patrones-table-body");
  if (patTbody) {
    patTbody.addEventListener("change", function(e) {
      var cb = e.target.closest("input[data-toggle-id]");
      if (!cb) return;
      var id = cb.getAttribute("data-toggle-id");
      ESTADO[id] = cb.checked ? "activo" : "inactivo";
      TableComponent.render(FiltersComponent.getActive());
    });
  }

  // ── Qué nuevos patrones podríamos descubrir ─────────────────
  var nuevasEl = document.getElementById("nuevas-fuentes-grid");
  if (nuevasEl) {
    var FUENTES = [
      {
        svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v8m0 0H5m4 0h10m-10 0v8a2 2 0 002 2h4a2 2 0 002-2v-8m-8 0h8"/>',
        titulo: "Historial médico laboral",
        descripcion: "Identificaría bajas recurrentes por la misma patología, estacionalidad médica y empleados con reincidencia por diagnóstico.",
        estimacion: "3–5 nuevos patrones estimados"
      },
      {
        svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
        titulo: "Datos de productividad",
        descripcion: "Revelaría correlaciones entre caída de rendimiento previo y aparición de bajas. Detecta señales tempranas antes de la baja formal.",
        estimacion: "2–4 nuevos patrones estimados"
      },
      {
        svgPath: '<circle cx="12" cy="12" r="9" stroke-width="1.75"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 7v5l3 3"/>',
        titulo: "Registro de turnos y guardias",
        descripcion: "Detectaría fatiga por turnos nocturnos consecutivos, acumulación de guardias y riesgo por rotación excesiva de horarios.",
        estimacion: "4–6 nuevos patrones estimados"
      },
      {
        svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
        titulo: "Encuestas de clima laboral",
        descripcion: "Cruzaría satisfacción del equipo con frecuencia de bajas para identificar centros con bajo clima y mayor absentismo.",
        estimacion: "2–3 nuevos patrones estimados"
      },
      {
        svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
        titulo: "Historial de formación",
        descripcion: "Identificaría si empleados sin formación reciente o en puestos no ajustados a su perfil presentan mayor frecuencia de bajas.",
        estimacion: "1–2 nuevos patrones estimados"
      },
      {
        svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
        titulo: "Datos de rotación y retención",
        descripcion: "Cruzaría probabilidad de abandono con bajas médicas previas, detectando patrones de desvinculación paulatina antes de la salida.",
        estimacion: "2–3 nuevos patrones estimados"
      }
    ];
    nuevasEl.innerHTML = FUENTES.map(function(f) {
      return '<div class="bg-white rounded-xl border border-surface-200 shadow-card p-5">'
        + '<div class="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center mb-3">'
        + '<svg class="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + f.svgPath + '</svg>'
        + '</div>'
        + '<p class="text-sm font-semibold text-surface-900 mb-2">' + f.titulo + '</p>'
        + '<p class="text-xs text-surface-500 leading-relaxed mb-3">' + f.descripcion + '</p>'
        + '<span class="text-[10px] font-medium text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">' + f.estimacion + '</span>'
        + '</div>';
    }).join('');
  }

  // ── Modal: desglose del coste ────────────────────────────────
  var desgloseCharted = false;
  (function() {
    var btn   = document.getElementById("btn-desglose-costes");
    var modal = document.getElementById("modal-desglose");
    var close = document.getElementById("modal-close");
    if (!btn || !modal) return;

    function parseCost(str) {
      return parseInt((str || "").replace(/[^\d]/g, ""), 10) || 0;
    }

    function buildChart() {
      var container = document.getElementById("chart-costes-barra-container");
      if (!container) return;
      var sorted = PATRONES_DATA.patrones.slice().sort(function(a, b) {
        return parseCost(b.costeDirecto) - parseCost(a.costeDirecto);
      });
      var maxCost = parseCost(sorted[0].costeDirecto);
      var COLORS  = { critico: "#ef4444", alto: "#f97316", medio: "#f59e0b", bajo: "#3b82f6" };
      var L = 240, B = 400, rowH = 30, topPad = 10, W = 820;
      var totalH = topPad + sorted.length * rowH + 10;

      var rows = sorted.map(function(p, i) {
        var rawCost = parseCost(p.costeDirecto);
        var cost  = rawCost;
        var bw    = Math.max(4, Math.round((rawCost / maxCost) * B * 0.96));
        var y     = topPad + i * rowH;
        var cy    = y + rowH / 2;
        var color = COLORS[p.criticidad] || "#3b82f6";
        var label = p.nombre.length > 36 ? p.nombre.substring(0, 34) + "…" : p.nombre;
        var bg    = (i % 2 === 0) ? '<rect x="0" y="' + y + '" width="' + W + '" height="' + rowH + '" fill="#f8fafc"/>' : "";
        return bg
          + '<text x="' + (L - 8) + '" y="' + cy + '" dominant-baseline="middle" text-anchor="end"'
          + ' font-size="11.5" fill="#64748b" font-family="Inter,system-ui,sans-serif">' + label + '</text>'
          + '<rect x="' + L + '" y="' + (y + 8) + '" width="' + bw + '" height="' + (rowH - 16) + '" rx="2" fill="' + color + '"/>'
          + '<text x="' + (L + bw + 8) + '" y="' + cy + '" dominant-baseline="middle"'
          + ' font-size="11" font-weight="600" fill="#0f172a" font-family="Inter,system-ui,sans-serif">' + fmtEurScaled(p.costeDirecto, activePeriodoFactor||1.0) + '</text>';
      }).join("");

      var axisLine = '<line x1="' + L + '" y1="' + topPad + '" x2="' + L + '" y2="' + (totalH - 10) + '" stroke="#e2e8f0" stroke-width="1"/>';
      container.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + totalH + '" width="100%" style="display:block;">'
        + rows + axisLine + '</svg>';
    }

    function openModal() {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      if (!desgloseCharted) { desgloseCharted = true; buildChart(); }
    }

    function closeModal() {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", openModal);
    if (close) close.addEventListener("click", closeModal);
    modal.addEventListener("click", function(e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
    });
  })();
}

// ══════════════════════════════════════════════════════════════
// PAT DETAIL: period selector helpers
// ══════════════════════════════════════════════════════════════

var activePeriodoMeses = 12;
var activePeriodoFactor = 1.0;
function fmtEurScaled(s, f) {
  var n = parseInt(s.replace(/[^\d]/g,""),10)||0;
  return Math.round(n*f).toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")+" €";
}

  // ── Selector de periodo ───────────────────────────────────
  var PERIODO_DATA = {
    0:  { detectados: 18, critico: 1, alto: 2, medio: 4, bajo: 11, mayorCoste: "1.420.660 €", total: "7.143.297 €", sub: "18 patrones \xb7 hist\xf3rico completo", prom: "Prom. 397K€ por patr\xf3n" },
    12: { detectados: 18, critico: 1, alto: 2, medio: 4, bajo: 11, mayorCoste: "1.420.660 €", total: "7.143.297 €", sub: "18 patrones \xb7 estimaci\xf3n anual",    prom: "Prom. 397K€ por patr\xf3n" },
    6:  { detectados: 14, critico: 1, alto: 1, medio: 3, bajo: 9,  mayorCoste: "748.320 €",   total: "3.890.450 €", sub: "14 patrones \xb7 \xfaltimos 6 meses",    prom: "Prom. 278K€ por patr\xf3n" },
    3:  { detectados:  9, critico: 1, alto: 1, medio: 2, bajo: 5,  mayorCoste: "402.000 €",   total: "2.072.130 €", sub: "9 patrones \xb7 \xfaltimo trimestre",     prom: "Prom. 230K€ por patr\xf3n" }
  };
  var FACTOR_BY_MESES = { 0: 1.0, 12: 1.0, 6: 0.54, 3: 0.27 };
  function applyPeriodoPatrones(meses) {
    activePeriodoFactor = FACTOR_BY_MESES[meses] !== undefined ? FACTOR_BY_MESES[meses] : 1.0;
    var d = PERIODO_DATA[meses] || PERIODO_DATA[12];
    var el;
    el = document.getElementById("kpi-detectados-count"); if (el) el.textContent = d.detectados;
    el = document.getElementById("kpi-detectados-badges"); if (el) el.innerHTML =
      '<span class="badge badge--critico badge--xs">' + d.critico + ' cr\xedtico</span>'
      + '<span class="badge badge--alto badge--xs">' + d.alto + ' alto</span>'
      + '<span class="badge badge--medio badge--xs">' + d.medio + ' medio</span>'
      + '<span class="badge badge--bajo badge--xs">' + d.bajo + ' bajo</span>';
    el = document.getElementById("kpi-criticos-sub");     if (el) el.textContent = "de " + d.detectados + " patrones detectados";
    el = document.getElementById("kpi-mayor-impacto-coste"); if (el) el.textContent = d.mayorCoste;
    el = document.getElementById("kpi-impacto-total");    if (el) el.textContent = d.total;
    el = document.getElementById("kpi-impacto-sub");      if (el) el.textContent = d.sub;
    el = document.getElementById("kpi-impacto-prom");     if (el) el.textContent = d.prom;
    TableComponent.render(FiltersComponent.getActive());
    desgloseCharted = false;
  }
  var periodoSelPat = document.getElementById("periodo-selector");
  if (periodoSelPat) {
    periodoSelPat.addEventListener("click", function(e) {
      var btn = e.target.closest("button[data-meses]");
      if (!btn) return;
      var meses = parseInt(btn.getAttribute("data-meses"), 10);
      periodoSelPat.querySelectorAll(".periodo-btn").forEach(function(b) {
        b.classList.toggle("active", b === btn);
      });
      applyPeriodoPatrones(meses);
    });
  }


function getCostDataForPeriodo(meses) {
  var costeMetrica = PAT002_DATA.evolucionTemporal.metricas.filter(function(m) { return m.key === 'coste'; })[0];
  if (!costeMetrica) return { valores: [], meses: [] };
  var allValores = costeMetrica.valores;
  var allMeses   = PAT002_DATA.evolucionTemporal.meses;
  if (meses === 0 || meses >= allValores.length) {
    return { valores: allValores, meses: allMeses };
  }
  return { valores: allValores.slice(-meses), meses: allMeses.slice(-meses) };
}

function renderCostHistoryCard(meses) {
  var data     = getCostDataForPeriodo(meses);
  var totalK   = data.valores.reduce(function(s, v) { return s + v; }, 0);
  var totalEur = totalK * 1000;
  var totalFmt = totalEur >= 1000000
    ? (totalEur / 1000000).toFixed(2).replace('.', ',') + ' M€'
    : totalEur.toLocaleString('es-ES') + ' €';

  var totalEl = document.getElementById('cost-period-total');
  if (totalEl) totalEl.textContent = totalFmt;

  var labelEl = document.getElementById('cost-period-label');
  if (labelEl) {
    labelEl.textContent = meses === 0
      ? 'Coste total histórico desde inicio del análisis'
      : 'Coste acumulado en los últimos ' + meses + ' meses';
  }

  var container = document.getElementById('cost-bar-chart');
  var labelsEl  = document.getElementById('cost-bar-labels');
  if (!container) return;

  var maxVal  = Math.max.apply(null, data.valores);
  var CHART_H = 90;
  var MONTH_SHORT = {
    '2025-01': 'ene', '2025-02': 'feb', '2025-03': 'mar', '2025-04': 'abr',
    '2025-05': 'may', '2025-06': 'jun', '2025-07': 'jul', '2025-08': 'ago',
    '2025-09': 'sep', '2025-10': 'oct', '2025-11': 'nov', '2025-12': 'dic'
  };

  container.innerHTML = data.valores.map(function(v) {
    var h      = Math.max(4, Math.round((v / maxVal) * CHART_H));
    var isPeak = v === maxVal;
    return '<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;min-width:0;">'
      + '<span style="font-size:8.5px;color:#94a3b8;margin-bottom:2px;white-space:nowrap;text-align:center;">' + Math.round(v) + 'K</span>'
      + '<div style="width:100%;height:' + h + 'px;background:'
      + (isPeak ? '#1d4ed8' : '#93c5fd')
      + ';border-radius:2px 2px 0 0;"></div>'
      + '</div>';
  }).join('');

  if (labelsEl) {
    labelsEl.innerHTML = data.meses.map(function(m) {
      return '<div style="flex:1;text-align:center;font-size:9px;color:#94a3b8;min-width:0;">'
        + (MONTH_SHORT[m] || m.slice(-2)) + '</div>';
    }).join('');
  }
}

function renderCentersStock(meses) {
  var centersEl = document.getElementById('pat-centers-section');
  if (!centersEl || !PAT002_DATA.centrosDistribucion) return;

  var data   = getCostDataForPeriodo(meses);
  var totalK = data.valores.reduce(function(s, v) { return s + v; }, 0);

  centersEl.innerHTML = PAT002_DATA.centrosDistribucion.map(function(c) {
    var costeEur = Math.round(totalK * c.pct / 100) * 1000;
    var costeFmt = costeEur >= 1000000
      ? (costeEur / 1000000).toFixed(2).replace('.', ',') + ' M€'
      : costeEur.toLocaleString('es-ES') + ' €';

    var isSubida = c.tendencia === 'subida';
    var isBajada = c.tendencia === 'bajada';
    var clr  = isSubida ? '#ef4444' : (isBajada ? '#16a34a' : '#64748b');
    var bg   = isSubida ? '#fef2f2' : (isBajada ? '#f0fdf4' : '#f8fafc');
    var bdr  = isSubida ? '#fecaca' : (isBajada ? '#bbf7d0' : '#e2e8f0');
    var icon = isSubida ? '↑' : (isBajada ? '↓' : '→');

    return '<div class="center-stock-row">'
      + '<div class="center-stock-top">'
      + '<p class="center-stock-name">' + c.nombre + '</p>'
      + '<div class="center-stock-right">'
      + '<span class="center-stock-cost">' + costeFmt + '</span>'
      + '<span class="center-stock-badge" style="color:' + clr + ';background:' + bg + ';border:1px solid ' + bdr + ';">'
      + icon + ' ' + c.variacion
      + '</span>'
      + '</div>'
      + '</div>'
      + '<div class="center-stock-track">'
      + '<div class="center-stock-fill" style="width:' + c.pct + '%;background:' + clr + ';"></div>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// PÁGINA: PAT DETAIL (pat-002)
// ══════════════════════════════════════════════════════════════

function initPatDetailPage() {
  var d = PAT002_DATA;

  // KPIs
  setText("kpi-impacto",   d.kpis.impactoEconomicoLabel);
  setText("kpi-personas",  d.kpis.personas);
  setText("kpi-variables", d.kpis.variables);
  setText("kpi-confianza", d.kpis.confianza);
  setText("pat-resumen",   d.resumen);

  // Señal clave — chips
  var senalEl = document.getElementById("senal-chips");
  if (senalEl && d.senalClave) {
    var chipHtml = d.senalClave.chips.map(function(c) {
      return '<span class="text-xs bg-white border border-surface-200 rounded-full px-3 py-1.5 font-semibold text-surface-700">' + c + "</span>";
    }).join('<span class="text-sm font-bold text-surface-400 px-1">+</span>');
    chipHtml += '<span class="text-sm font-bold text-surface-400 px-1">=</span>';
    chipHtml += '<span class="text-xs bg-primary-50/50 border border-primary-200 rounded-full px-3 py-1.5 font-semibold text-primary-700">' + d.senalClave.resultado + "</span>";
    senalEl.innerHTML = chipHtml;
  }

  // Qué significa
  var qsEl = document.getElementById("que-significa-list");
  if (qsEl && d.queSignifica) {
    qsEl.innerHTML = d.queSignifica.map(function(item, i) {
      return '<div class="px-4 py-3.5 flex items-start gap-3">'
        + '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 text-primary-600 text-[10px] font-bold shrink-0 mt-0.5">' + (i + 1) + "</span>"
        + '<span class="text-sm text-surface-700 leading-relaxed">' + item + "</span>"
        + "</div>";
    }).join("");
  }

  // Qué no significa
  var qnsEl = document.getElementById("que-no-significa-list");
  if (qnsEl && d.queNoSignifica) {
    qnsEl.innerHTML = d.queNoSignifica.map(function(item) {
      return '<div class="px-4 py-3.5 flex items-start gap-3">'
        + '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-100 text-surface-400 text-xs font-bold shrink-0 mt-0.5">✕</span>'
        + '<span class="text-sm text-surface-500 leading-relaxed">' + item + "</span>"
        + "</div>";
    }).join("");
  }

  // Condiciones exactas
  var condEl = document.getElementById("condiciones-lista");
  if (condEl && d.condicionesExactas) {
    condEl.innerHTML = d.condicionesExactas.map(function(c, i) {
      return '<div class="py-3.5 flex items-start gap-4">'
        + '<div class="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center shrink-0 mt-0.5">'
        + '<span class="text-xs font-bold text-surface-500">' + (i + 1) + "</span>"
        + "</div>"
        + '<div class="flex-1">'
        + '<p class="text-sm font-semibold text-surface-900">' + c.condicion + "</p>"
        + '<p class="text-sm text-surface-500 mt-0.5 leading-relaxed">' + c.descripcion + "</p>"
        + "</div>"
        + "</div>";
    }).join("");
  }

  // Por qué importa
  var relEl = document.getElementById("relevancia-cards");
  if (relEl && d.relevanciaEmpresa) {
    var relItems = [
      { titulo: "Impacto operativo",      texto: d.relevanciaEmpresa.impactoOperativo  },
      { titulo: "Materialidad económica", texto: d.relevanciaEmpresa.materialidad      },
      { titulo: "Lectura contextual",     texto: d.relevanciaEmpresa.lecturaContextual },
      { titulo: "Separación de ruido",    texto: d.relevanciaEmpresa.separacionRuido   }
    ];
    relEl.innerHTML = relItems.map(function(item) {
      return '<div class="bg-primary-50/50 rounded-lg p-4 border border-primary-100">'
        + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">' + item.titulo + "</p>"
        + '<p class="text-sm text-surface-700 leading-relaxed">' + item.texto + "</p>"
        + "</div>";
    }).join("");
  }

  // Solapamiento
  var solapEl = document.getElementById("solapamiento-lista");
  if (solapEl && d.solapamiento) {
    solapEl.innerHTML = d.solapamiento.map(function(s) {
      return '<div class="py-3.5">'
        + '<div class="flex items-center justify-between mb-1.5">'
        + '<p class="text-sm font-medium text-surface-800">' + s.patron + "</p>"
        + '<span class="text-xs font-bold text-surface-500 bg-surface-100 px-2.5 py-1 rounded-full shrink-0 ml-3">' + s.porcentaje + "% solape</span>"
        + "</div>"
        + '<p class="text-sm text-surface-500 leading-relaxed">' + s.descripcion + "</p>"
        + "</div>";
    }).join("");
  }

  // Audiencia — cómo debe leerlo cada perfil
  var audEl = document.getElementById("audiencia-cards");
  if (audEl && d.audiencia) {
    audEl.innerHTML = d.audiencia.map(function(a) {
      return '<div class="bg-primary-50/50 rounded-lg p-4 border border-primary-100">'
        + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">' + a.perfil + "</p>"
        + '<p class="text-sm text-surface-700 leading-relaxed">' + a.lectura + "</p>"
        + "</div>";
    }).join("");
  }

  // Impacto desglose (fila horizontal bajo la gráfica)
  var desgloseEl = document.getElementById("impacto-desglose");
  if (desgloseEl) {
    desgloseEl.innerHTML = d.impactoDesglose.map(function(item) {
      var infoIcon = item.tooltip
        ? '<div class="kpi-info-wrap">'
          + '<svg class="kpi-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
          + '<circle cx="12" cy="12" r="9" stroke-width="1.75"/>'
          + '<path d="M12 16v-4M12 8h.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
          + '</svg>'
          + '<div class="kpi-tooltip">' + item.tooltip + '</div>'
          + '</div>'
        : "";
      return '<div class="flex-1 px-4 py-3 border-r border-surface-100 last:border-0">'
        + '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;">'
        + '<p class="text-[11px] text-surface-500 leading-tight">' + item.concepto + "</p>"
        + infoIcon
        + "</div>"
        + '<p class="text-sm font-semibold text-surface-900 tabular-nums">' + item.importeLabel + "</p>"
        + '<p class="text-[10px] text-surface-400 mt-0.5">' + item.porcentaje + "% del total</p>"
        + "</div>";
    }).join("");
  }

  // Localización
  var loc = d.localizacion;
  if (!loc.centrosAfectados.length) setText("centros-list", "Sin datos");
  if (!loc.turnosAfectados.length)  setText("turnos-list",  "Sin datos");

  var perfilesEl = document.getElementById("perfiles-list");
  if (perfilesEl && loc.perfilesPuesto.length) {
    perfilesEl.innerHTML = loc.perfilesPuesto.map(function(p) {
      return '<span class="text-xs bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full font-medium">' + p + "</span>";
    }).join("");
  }

  var equiposEl = document.getElementById("equipos-list");
  if (equiposEl && loc.equiposResponsables.length) {
    equiposEl.innerHTML = loc.equiposResponsables.map(function(e) {
      return '<span class="text-xs bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full font-medium">' + e + "</span>";
    }).join("");
  }

  // Gráfica barras (impacto)
  if (typeof ChartsComponent !== "undefined") {
    ChartsComponent.renderBarChart("chart-impacto", d.impactoDesglose);
  }

  // Evolución temporal — chips + narrativa + gráfica por métrica
  var metricBtns = document.getElementById("metric-buttons");
  if (metricBtns && d.evolucionTemporal && d.evolucionTemporal.metricas) {
    var evMeses    = d.evolucionTemporal.meses;
    var evMetricas = d.evolucionTemporal.metricas;

    var sentimentColor = { negative: "text-critical-600", positive: "text-low-600", neutral: "text-surface-800" };

    function renderMetrica(m) {
      // Chips
      var chipsEl = document.getElementById("evolucion-chips");
      if (chipsEl) {
        chipsEl.innerHTML = m.chips.map(function(c) {
          return '<div class="flex-1 bg-surface-50 border border-surface-100 rounded-lg px-3 py-2.5">'
            + '<p class="text-[10px] text-surface-400 font-medium uppercase tracking-wider leading-tight mb-1">' + c.label + "</p>"
            + '<p class="text-sm font-bold ' + (sentimentColor[c.sentiment] || "text-surface-800") + '">' + c.value + "</p>"
            + "</div>";
        }).join("");
      }
      // Narrativa
      var narEl  = document.getElementById("evolucion-narrativa");
      var narTxt = document.getElementById("evolucion-narrativa-texto");
      if (narEl && narTxt) {
        narTxt.textContent = m.narrativa;
        narEl.style.display = "";
      }
      // Gráfica
      if (typeof ChartsComponent !== "undefined") {
        ChartsComponent.renderLineChart("chart-timeline", { meses: evMeses, valores: m.valores });
      }
    }

    var BRADFORD_INFO = '<div class="kpi-info-wrap" style="display:inline-flex;margin-left:2px;">'
      + '<svg class="kpi-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="1.75"/><path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      + '<div class="kpi-tooltip">Índice Bradford (B = S² × D): mide el impacto de ausencias frecuentes y cortas. S = número de episodios, D = días totales. Un Bradford alto indica muchas ausencias cortas, más disruptivas que una sola larga.</div>'
      + '</div>';
    metricBtns.innerHTML = evMetricas.map(function(m, i) {
      var suffix = m.key === "bradford" ? BRADFORD_INFO : "";
      return '<button class="px-3 py-1.5 text-xs font-medium rounded-md transition-all inline-flex items-center '
        + (i === 0 ? "bg-white text-surface-800 shadow-sm" : "text-surface-500 hover:text-surface-700")
        + '" data-metric="' + i + '">' + m.label + suffix + "</button>";
    }).join("");

    renderMetrica(evMetricas[0]);

    metricBtns.addEventListener("click", function(e) {
      var btn = e.target.closest("button[data-metric]");
      if (!btn) return;
      var idx = parseInt(btn.getAttribute("data-metric"), 10);
      Array.from(metricBtns.querySelectorAll("button")).forEach(function(b) {
        b.className = "px-3 py-1.5 text-xs font-medium rounded-md transition-all inline-flex items-center text-surface-500 hover:text-surface-700";
      });
      btn.className = "px-3 py-1.5 text-xs font-medium rounded-md transition-all inline-flex items-center bg-white text-surface-800 shadow-sm";
      renderMetrica(evMetricas[idx]);
    });
  }

  // Medición antes/después
  var med = d.medicion;
  setText("intervencion-label",  "Intervención: " + med.intervencion);
  setText("pre-label",           med.pre.label);
  setText("pre-valor",           med.pre.valor);
  setText("pre-descripcion",     med.pre.descripcion  || "");
  setText("pre-rango",           med.pre.rango);
  setText("post-label",          med.post.label);
  setText("post-valor",          med.post.valor);
  setText("post-descripcion",    med.post.descripcion || "");
  setText("post-rango",          med.post.rango);
  setText("cambio-valor",        med.cambioImpacto);
  setText("cambio-importe",      med.importeEvitado   || "");
  setText("cambio-estado",       med.estado);
  setText("cambio-descripcion",  med.cambioDescripcion || "");

  // Recomendación
  var rec = d.recomendacion;
  setText("rec-que",         rec.quePropone);
  setText("rec-porque",      rec.porQue);
  setText("rec-impacto",     rec.impactoEsperado);
  setText("rec-colectivo",   rec.colectivoObjetivo);
  setText("rec-responsable", rec.responsable || "—");
  setText("rec-plazo",       rec.plazo       || "—");
  var pasosEl = document.getElementById("rec-pasos");
  if (pasosEl && rec.pasos) {
    pasosEl.innerHTML = rec.pasos.map(function(p, i) {
      return '<div class="flex items-start gap-3">'
        + '<div class="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center shrink-0 mt-0.5"><span class="text-xs font-bold text-surface-500">' + (i + 1) + "</span></div>"
        + '<div>'
        + '<p class="text-sm font-semibold text-surface-800">' + p.titulo + "</p>"
        + '<p class="text-xs text-surface-500 mt-0.5 leading-snug">' + p.descripcion + "</p>"
        + "</div></div>";
    }).join("");
  }

  // Personas afectadas — tabla sortable
  setText("personas-subtitle", "20 empleados reales que activan el patrón · clic en una columna para ordenar");
  var personasContainer = document.getElementById("personas-table-container");
  if (personasContainer && d.personasListado) {
    var pSortKey = "diasBaja";
    var pSortDir = -1;
    var PCOLS = [
      { key: "id",         label: "Empleado",  align: "left"  },
      { key: "centro",     label: "Centro",    align: "left"  },
      { key: "turno",      label: "Turno",     align: "left"  },
      { key: "categoria",  label: "Categoría", align: "left"  },
      { key: "edad",       label: "Edad",      align: "right" },
      { key: "antiguedad", label: "Antig.",    align: "right" },
      { key: "episodios",  label: "Episodios", align: "right" },
      { key: "diasBaja",   label: "Días baja", align: "right" },
      { key: "riesgo",     label: "Riesgo",    align: "right" }
    ];
    var PRIESGO_ORD = { critico: 3, alto: 2, medio: 1, bajo: 0 };
    var PRIESGO_BDGE = {
      critico: "background:#fef2f2;color:#dc2626;border:1px solid #fecaca;",
      alto:    "background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;",
      medio:   "background:#fefce8;color:#ca8a04;border:1px solid #fef08a;",
      bajo:    "background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;"
    };

    function renderPTable() {
      var data = d.personasListado.slice().sort(function(a, b) {
        var va = a[pSortKey], vb = b[pSortKey];
        if (pSortKey === "riesgo") { va = PRIESGO_ORD[va] || 0; vb = PRIESGO_ORD[vb] || 0; }
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        return va < vb ? -pSortDir : va > vb ? pSortDir : 0;
      });

      var thead = "<thead><tr>"
        + PCOLS.map(function(col) {
            var active = col.key === pSortKey;
            var arrow  = active ? (pSortDir === 1 ? "▲" : "▼") : "↕";
            return "<th data-col=\"" + col.key + "\" style=\"text-align:" + col.align + ";"
              + (active ? "color:#2563eb;" : "") + "\">"
              + col.label + " <span style=\"font-size:10px;color:#94a3b8;margin-left:2px;\">" + arrow + "</span></th>";
          }).join("")
        + "</tr></thead>";

      var tbody = "<tbody>"
        + data.map(function(p) {
            var bdg = PRIESGO_BDGE[p.riesgo] || PRIESGO_BDGE.bajo;
            var lbl = p.riesgo.charAt(0).toUpperCase() + p.riesgo.slice(1);
            return "<tr>"
              + "<td>Empleado " + p.id + "</td>"
              + "<td>" + p.centro + "</td>"
              + "<td>" + p.turno + "</td>"
              + "<td>" + p.categoria + "</td>"
              + "<td style=\"text-align:right;\">" + p.edad + "</td>"
              + "<td style=\"text-align:right;\">" + p.antiguedad + "</td>"
              + "<td style=\"text-align:right;\">" + p.episodios + "</td>"
              + "<td style=\"text-align:right;font-weight:700;color:#0f172a;\">" + p.diasBaja + "</td>"
              + "<td style=\"text-align:right;\"><span style=\"font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px;" + bdg + "\">" + lbl + "</span></td>"
              + "</tr>";
          }).join("")
        + "</tbody>";

      personasContainer.innerHTML = "<table class=\"personas-table\">" + thead + tbody + "</table>";

      personasContainer.querySelector("thead").addEventListener("click", function(e) {
        var th = e.target.closest("th[data-col]");
        if (!th) return;
        var col = th.getAttribute("data-col");
        pSortDir = col === pSortKey ? -pSortDir : (["diasBaja","episodios","edad","antiguedad","riesgo"].indexOf(col) >= 0 ? -1 : 1);
        pSortKey = col;
        renderPTable();
      });
    }
    renderPTable();
  }

  // Consultor — contextos
  var ctxEl = document.getElementById("consultor-contextos");
  if (ctxEl) {
    ctxEl.innerHTML = d.consultorContextos.map(function(c) {
      return '<button class="filter-btn text-xs">' + c + "</button>";
    }).join("");
  }

  // Consultor — preguntas rápidas
  var qEl = document.getElementById("consultor-preguntas");
  if (qEl) {
    qEl.innerHTML = d.consultorPreguntas.map(function(q) {
      return '<button class="filter-btn text-xs" onclick="setConsultorInput(\'' + q.replace(/'/g, "\\'") + '\')">' + q + "</button>";
    }).join("");
  }

  // Accordion
  var accordionBtn  = document.getElementById("accordion-btn");
  var accordionBody = document.getElementById("accordion-body");
  var accordionIcon = document.getElementById("accordion-icon");
  if (accordionBtn && accordionBody) {
    accordionBtn.addEventListener("click", function() {
      accordionBody.classList.toggle("open");
      if (accordionIcon) {
        accordionIcon.style.transform = accordionBody.classList.contains("open") ? "rotate(180deg)" : "";
      }
    });
  }

  // ── Cómo se ha detectado ─────────────────────────────────────
  var evContent = document.getElementById("ev-content");
  if (evContent && d.comoDetectado) {
    var cd = d.comoDetectado;
    evContent.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Fuente del dato</p>'
      + '<p class="text-sm text-surface-600 leading-relaxed">' + cd.fuente + '</p>'
      + '</div>'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Periodo analizado</p>'
      + '<p class="text-sm text-surface-600 leading-relaxed">' + cd.periodo + '</p>'
      + '</div>'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Solapamiento principal</p>'
      + '<p class="text-sm text-surface-600 leading-relaxed">' + cd.solapamiento + '</p>'
      + '</div>'
      + '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;">'
      + '<p class="text-xs font-semibold uppercase tracking-wider mb-1.5" style="color:#92400e;">Lectura prudente</p>'
      + '<p class="text-sm leading-relaxed" style="color:#78350f;">' + cd.lecturaP + '</p>'
      + '</div>'
      + '</div>';
  }

  // ── NUEVO: Cabecera — fechas ─────────────────────────────────
  var metaDates = document.getElementById("pat-meta-dates");
  if (metaDates && d.deteccion) {
    metaDates.innerHTML =
      '<span>Detectado el ' + d.deteccion + '</span>'
      + '<span class="text-surface-300 mx-1">·</span>'
      + '<span>Última aparición: ' + d.ultimaAparicion + '</span>';
  }

  // ── NUEVO: KPI strip ──────────────────────────────────────────
  var kpiStrip = document.getElementById("pat-kpi-strip");
  if (kpiStrip) {
    var KPI_TIP = function(tip) {
      return '<div class="kpi-info-wrap">'
        + '<svg class="kpi-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="1.75"/><path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + '<div class="kpi-tooltip">' + tip + '</div>'
        + '</div>';
    };
    var kpiDefs = [
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
        val: "84,7%", valCls: "text-primary-700",
        lbl: "Afectados con baja larga",
        desc: "85 de cada 100 acumulan 60+ días de baja en el periodo",
        tip: "Riesgo histórico sobre 255 apariciones registradas. El más alto del catálogo."
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
        val: d.apariciones, valCls: "text-surface-900",
        lbl: "Apariciones del patrón",
        desc: "en el periodo",
        tip: "Número de veces que las tres condiciones se activaron simultáneamente."
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
        val: d.kpis.personas, valCls: "text-surface-900",
        lbl: "Personas únicas",
        desc: "activaron el patrón al menos una vez",
        tip: "Empleados distintos que activaron el patrón. Una misma persona puede sumar varias apariciones."
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        val: d.kpis.impactoEconomicoLabel, valCls: "text-primary-700",
        lbl: "Coste histórico asociado",
        desc: "puede solaparse con otros fenómenos",
        tip: "Agrupa salarios, sustituciones, horas extra y reorganización. No sumes directamente con otros patrones."
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
        val: "Crítico", valCls: "text-surface-900",
        lbl: "Solidez de la evidencia",
        desc: "consistencia del patrón en el histórico",
        tip: "Se replicó en 4 de los últimos 6 meses analizados con resultados consistentes."
      }
    ];
    kpiStrip.innerHTML = kpiDefs.map(function(k, ki) {
      return '<div class="pat-kpi-cell">'
        + '<div style="width:28px;height:28px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">'
        + '<svg style="width:13px;height:13px;color:#64748b;" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + k.icon + '</svg>'
        + '</div>'
        + '<div class="flex items-center gap-1.5">'
        + '<span id="pkv-' + ki + '" class="text-2xl font-bold tabular-nums leading-none ' + k.valCls + '">' + k.val + '</span>'
        + KPI_TIP(k.tip)
        + '</div>'
        + '<p class="text-[10px] font-semibold text-surface-400 uppercase tracking-wider leading-tight mt-0.5">' + k.lbl + '</p>'
        + '<p class="text-xs text-surface-500 leading-relaxed mt-1">' + k.desc + '</p>'
        + '</div>';
    }).join("");
  }

  // ── Descripción del patrón ───────────────────────────────────
  var descCard = document.getElementById("pat-description-card");
  if (descCard && d.descripcionPatron) {
    descCard.innerHTML =
      '<p class="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-3">Qué está pasando</p>'
      + '<p class="text-sm font-bold text-surface-900 leading-snug mb-3">' + d.descripcionPatron.lead + '</p>'
      + '<p class="text-sm text-surface-600 leading-relaxed">' + d.descripcionPatron.cuerpo + '</p>';
  }

  // ── Por qué importa a tu operación ──────────────────────────
  var formulaCard = document.getElementById("pat-formula-card");
  if (formulaCard && d.porQueImporta) {
    var TIPO_ICONS = {
      riesgo: {
        bg: '#fef2f2', clr: '#ef4444',
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4M12 17h.01"/>'
      },
      equipo: {
        bg: '#fffbeb', clr: '#d97706',
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>'
      },
      coste: {
        bg: '#eff6ff', clr: '#2563eb',
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
      }
    };
    formulaCard.innerHTML =
      '<p class="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-1">Por qué importa a tu operación</p>'
      + '<p style="font-size:11px;color:#64748b;margin-bottom:16px;line-height:1.5;">Interpretación de la IA sobre las implicaciones del patrón</p>'
      + d.porQueImporta.map(function(item, idx) {
          var ti     = TIPO_ICONS[item.tipo] || TIPO_ICONS.riesgo;
          var isLast = idx === d.porQueImporta.length - 1;
          return '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;'
            + (isLast ? '' : 'border-bottom:1px solid #f1f5f9;') + '">'
            + '<div style="width:30px;height:30px;border-radius:8px;background:' + ti.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
            + '<svg style="width:14px;height:14px;color:' + ti.clr + ';" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + ti.svg + '</svg>'
            + '</div>'
            + '<div>'
            + '<p style="font-size:13px;font-weight:600;color:#1e293b;line-height:1.3;">' + item.titulo + '</p>'
            + '<p style="font-size:12px;color:#64748b;margin-top:3px;line-height:1.5;">' + item.descripcion + '</p>'
            + '</div>'
            + '</div>';
        }).join('');
  }

  // ── Centros donde aparece más ────────────────────────────────
  var centersEl = document.getElementById("pat-centers-section");
  if (centersEl && d.centrosDistribucion) {
    centersEl.innerHTML = d.centrosDistribucion.map(function(c) {
      return '<div class="center-row-item">'
        + '<div>'
        + '<p class="center-name">' + c.nombre + '</p>'
        + '<div class="center-track"><div class="center-fill" style="width:' + c.pct + '%"></div></div>'
        + '</div>'
        + '<p class="center-pct">' + c.pct + '%</p>'
        + '</div>';
    }).join("");
  }

  // ── Evidencia histórica — SVG line chart estético ────────────
  var evHistDisc = document.getElementById("ev-historica-disc");
  if (evHistDisc && d.evidenciaHistorica) {
    var evh = d.evidenciaHistorica;
    var evhEl = document.getElementById("ev-historica-body");
    if (evhEl) {
      var allVals = evh.riesgo60d, allMos = evh.meses;

      function evhAvg(arr){ return Math.round(arr.reduce(function(s,v){return s+v;},0)/arr.length); }
      var trimData=[evhAvg(allVals.slice(0,3)),evhAvg(allVals.slice(3,6)),evhAvg(allVals.slice(6,9)),evhAvg(allVals.slice(9,12))];
      var trimMos=['Q3 24','Q4 24','Q1 25','Q2 25'];
      var anioData=[evhAvg(allVals.slice(0,7)),evhAvg(allVals.slice(7,12))];
      var anioMos=['2024','2025'];

      var btnOn ='font-size:11px;font-weight:600;cursor:pointer;padding:2px 10px;border-radius:6px;border:1px solid #2563eb;background:#eff6ff;color:#2563eb;';
      var btnOff='font-size:11px;font-weight:500;cursor:pointer;padding:2px 10px;border-radius:6px;border:1px solid #e2e8f0;background:white;color:#64748b;';

      function buildEvhSvg(vals, mos) {
        var n=vals.length;
        var mxV=Math.max.apply(null,vals), mnV=Math.min.apply(null,vals);
        var step=n<=2?10:20, tMin=Math.floor(mnV/step)*step, tMax=Math.ceil(mxV/step)*step;
        if(tMax===tMin) tMax=tMin+step;
        var ticks=[]; for(var t=tMin;t<=tMax;t+=step) ticks.push(t);
        var vMin=ticks[0], vMax=ticks[ticks.length-1], vRange=vMax-vMin||1;
        var W=560, H=130, padL=40, padR=16, padT=14, padB=26;
        var cW=W-padL-padR, cH=H-padT-padB;
        function xv(i){ return padL+i*cW/(n>1?n-1:1); }
        function yv(v){ return padT+cH*(1-(v-vMin)/vRange); }

        var grids=ticks.map(function(t){
          var gy=yv(t).toFixed(1);
          return '<line x1="'+padL+'" y1="'+gy+'" x2="'+(W-padR)+'" y2="'+gy+'" stroke="#edf0f3" stroke-width="1" stroke-dasharray="4,4"/>'
            +'<text x="'+(padL-8)+'" y="'+(parseFloat(gy)+3.5)+'" text-anchor="end" font-size="8" fill="#94a3b8">'+t+'%</text>';
        }).join('');

        var lp='M '+xv(0).toFixed(1)+' '+yv(vals[0]).toFixed(1);
        for(var si=1;si<n;si++){
          var cx2=((xv(si-1)+xv(si))/2).toFixed(1);
          lp+=' C '+cx2+' '+yv(vals[si-1]).toFixed(1)+' '+cx2+' '+yv(vals[si]).toFixed(1)+' '+xv(si).toFixed(1)+' '+yv(vals[si]).toFixed(1);
        }

        var dots=vals.map(function(v,i){
          return '<circle class="evh-dot" data-idx="'+i+'" cx="'+xv(i).toFixed(1)+'" cy="'+yv(v).toFixed(1)+'" r="2.5" fill="white" stroke="#3b82f6" stroke-width="1.5" style="pointer-events:none;"/>';
        }).join('');

        var xlabs=vals.map(function(v,i){
          return '<text x="'+xv(i).toFixed(1)+'" y="'+(H-5)+'" text-anchor="middle" font-size="'+(n>6?'7.5':'8.5')+'" fill="#94a3b8">'+mos[i]+'</text>';
        }).join('');

        return '<svg id="evhSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block;overflow:visible;">'
          +grids
          +'<line id="evhCursor" x1="-99" y1="'+padT+'" x2="-99" y2="'+(H-padB)+'" stroke="#94a3b8" stroke-width="1" opacity="0" style="pointer-events:none;"/>'
          +'<path d="'+lp+'" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
          +dots+xlabs
          +'<rect id="evhOverlay" x="'+padL+'" y="0" width="'+cW+'" height="'+H+'" fill="transparent"/>'
          +'</svg>';
      }

      function attachEvhHover(vals, mos) {
        var svg=document.getElementById('evhSvg');
        var overlay=document.getElementById('evhOverlay');
        var cursor=document.getElementById('evhCursor');
        var tip=document.getElementById('evhTip');
        if(!svg||!overlay||!tip) return;
        var W=560,padL=40,padR=16,cW=W-padL-padR,n=vals.length;

        overlay.addEventListener('mousemove',function(e){
          var rect=svg.getBoundingClientRect();
          var rawX=(e.clientX-rect.left)*(W/rect.width);
          var idx=Math.round((rawX-padL)/cW*(n-1));
          idx=Math.max(0,Math.min(n-1,idx));
          var px=(padL+idx*cW/(n>1?n-1:1)).toFixed(1);
          cursor.setAttribute('x1',px); cursor.setAttribute('x2',px); cursor.setAttribute('opacity','0.5');
          svg.querySelectorAll('.evh-dot').forEach(function(d){
            var isActive=d.getAttribute('data-idx')===''+idx;
            d.setAttribute('r',isActive?'4':'2.5');
            d.setAttribute('fill',isActive?'#3b82f6':'white');
          });
          tip.innerHTML='<strong style="font-size:11px;color:#0f172a;display:block;margin-bottom:3px;">'+mos[idx]+'</strong>'
            +'<span style="font-size:11px;color:#475569;">&#9679; Riesgo: <strong style="color:#2563eb;">'+vals[idx]+'%</strong></span>';
          tip.style.display='block';
          var cont=tip.parentElement.getBoundingClientRect();
          var tx=e.clientX-cont.left+12, ty=e.clientY-cont.top-52;
          tip.style.left=Math.min(tx,cont.width-140)+'px';
          tip.style.top=Math.max(0,ty)+'px';
        });
        overlay.addEventListener('mouseleave',function(){
          cursor.setAttribute('opacity','0');
          svg.querySelectorAll('.evh-dot').forEach(function(d){ d.setAttribute('r','2.5'); d.setAttribute('fill','white'); });
          tip.style.display='none';
        });
      }

      var kpiHtml='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;">'
        +'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;background:white;">'
        +'<p style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Media histórica</p>'
        +'<p style="font-size:22px;font-weight:800;color:#2563eb;line-height:1;">'+evh.mediaRiesgo+'</p>'
        +'<p style="font-size:11px;color:#94a3b8;margin-top:3px;">riesgo a 60 días</p>'
        +'</div>'
        +'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;background:white;">'
        +'<p style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Diferencial</p>'
        +'<p style="font-size:20px;font-weight:800;color:#16a34a;line-height:1;">+31,2 pp</p>'
        +'<p style="font-size:11px;color:#94a3b8;margin-top:3px;">vs. media general (53,5%)</p>'
        +'</div>'
        +'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;background:white;">'
        +'<p style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Consistencia</p>'
        +'<p style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.2;margin-bottom:3px;">8 / 12 meses</p>'
        +'<p style="font-size:11px;color:#94a3b8;line-height:1.4;">'+evh.resumen+'</p>'
        +'</div>'
        +'<div style="border:1px solid #e2e8f0;border-radius:10px;padding:12px;background:white;">'
        +'<p style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Solidez</p>'
        +'<p style="font-size:11px;color:#475569;line-height:1.5;">Correlación estable entre picos de riesgo y mayor volumen de reincorporaciones.</p>'
        +'</div>'
        +'</div>';

      evhEl.innerHTML=
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
        +'<p style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">% riesgo nueva baja a 60 días</p>'
        +'<div id="evh-filter" style="display:flex;gap:4px;">'
        +'<button data-evhm="mes" style="'+btnOn+'">Mes</button>'
        +'<button data-evhm="trim" style="'+btnOff+'">Trim.</button>'
        +'<button data-evhm="anio" style="'+btnOff+'">Año</button>'
        +'</div>'
        +'</div>'
        +'<div style="position:relative;">'
        +'<div id="evh-chart">'+buildEvhSvg(allVals,allMos)+'</div>'
        +'<div id="evhTip" style="display:none;position:absolute;background:white;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);pointer-events:none;z-index:20;white-space:nowrap;"></div>'
        +'</div>'
        +kpiHtml;

      attachEvhHover(allVals,allMos);

      document.getElementById('evh-filter').addEventListener('click',function(e){
        var btn=e.target.closest('button[data-evhm]');
        if(!btn) return;
        var mode=btn.getAttribute('data-evhm');
        var vd=mode==='mes'?allVals:mode==='trim'?trimData:anioData;
        var md=mode==='mes'?allMos:mode==='trim'?trimMos:anioMos;
        document.getElementById('evh-chart').innerHTML=buildEvhSvg(vd,md);
        document.querySelectorAll('#evh-filter button').forEach(function(b){
          b.style.cssText=b===btn?btnOn:btnOff;
        });
        attachEvhHover(vd,md);
      });
    }
  }

  // ── Cómo leer este patrón — cards 2 columnas ────────────────
  var distribEl = document.getElementById("distrib-body");
  if (distribEl && d.comoLeer) {
    var lblStyle = "font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;";
    var cardBase = "border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:white;";
    var lastIdx  = d.comoLeer.items.length - 1;
    distribEl.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
      + d.comoLeer.items.map(function(item, i) {
          var span = i === lastIdx ? "grid-column:1/-1;" : "";
          if (item.tipo === "metrica") {
            return '<div style="' + cardBase + span + '">'
              + '<p style="' + lblStyle + '">' + item.label + '</p>'
              + '<p style="font-size:22px;font-weight:800;color:#1d4ed8;line-height:1;margin-bottom:5px;">' + item.valor + '</p>'
              + '<p style="font-size:12px;color:#64748b;line-height:1.6;">' + item.descripcion + '</p>'
              + '</div>';
          }
          if (item.tipo === "metrica-par") {
            var subCard = "border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:white;";
            return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;' + span + '">'
              + item.items.map(function(sub) {
                  return '<div style="' + subCard + '">'
                    + '<p style="' + lblStyle + '">' + sub.label + '</p>'
                    + '<p style="font-size:22px;font-weight:800;color:#0f172a;line-height:1;margin-top:4px;">' + sub.valor + '</p>'
                    + '</div>';
                }).join("")
              + '</div>';
          }
          return '<div style="' + cardBase + span + '">'
            + '<p style="' + lblStyle + '">' + item.label + '</p>'
            + '<p style="font-size:12.5px;color:#475569;line-height:1.65;">' + item.valor + '</p>'
            + '</div>';
        }).join("")
      + '</div>';
  }



  // ── Qué datos mejorarían la lectura ─────────────────────────
  var datosMejEl = document.getElementById("datos-mejoran-body");
  if (datosMejEl && d.datosQueMejorarian) {
    datosMejEl.innerHTML =
      '<div class="grid grid-cols-2 gap-3">'
      + d.datosQueMejorarian.map(function(item) {
          return '<div class="bg-white border border-surface-200 rounded-xl p-4">'
            + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-2">' + item.fuente + '</p>'
            + '<p class="text-sm text-surface-700 leading-relaxed">' + item.descripcion + '</p>'
            + '</div>';
        }).join("")
      + '</div>';
  }

  // Consultor — envío
  // ── Period selector init ────────────────────────────────────
  activePeriodoMeses = 12;
  renderCostHistoryCard(activePeriodoMeses);
  renderCentersStock(activePeriodoMeses);

  var periodoSel = document.getElementById('periodo-selector');
  if (periodoSel) {
    periodoSel.addEventListener('click', function(e) {
      var btn = e.target.closest('button[data-meses]');
      if (!btn) return;
      var meses = parseInt(btn.getAttribute('data-meses'), 10);
      activePeriodoMeses = meses;
      periodoSel.querySelectorAll('.periodo-btn').forEach(function(b) {
        b.classList.toggle('active', b === btn);
      });
      renderCostHistoryCard(meses);
      renderCentersStock(meses);
      updatePatKpis(meses);
    });
  }

  var PAT_KPI_PERIODOS = {
    0:  { tasa: "84,7%", apariciones: 255, personas: 85, coste: "1.215.660 €" },
    12: { tasa: "84,7%", apariciones: 255, personas: 85, coste: "1.215.660 €" },
    6:  { tasa: "82,3%", apariciones: 143, personas: 58, coste: "642.810 €"   },
    3:  { tasa: "79,1%", apariciones:  67, personas: 31, coste: "298.440 €"   }
  };
  function updatePatKpis(meses) {
    var k = PAT_KPI_PERIODOS[meses] || PAT_KPI_PERIODOS[12];
    var el;
    el = document.getElementById("pkv-0"); if (el) el.textContent = k.tasa;
    el = document.getElementById("pkv-1"); if (el) el.textContent = k.apariciones;
    el = document.getElementById("pkv-2"); if (el) el.textContent = k.personas;
    el = document.getElementById("pkv-3"); if (el) el.textContent = k.coste;
  }

  var sendBtn  = document.getElementById("consultor-send");
  var inputEl  = document.getElementById("consultor-input");
  var chatArea = document.getElementById("chat-area");
  if (sendBtn && inputEl && chatArea) {
    sendBtn.addEventListener("click", function() { sendConsultorMessage(inputEl, chatArea); });
    inputEl.addEventListener("keypress", function(e) {
      if (e.key === "Enter") sendConsultorMessage(inputEl, chatArea);
    });
  }
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setConsultorInput(text) {
  var input = document.getElementById("consultor-input");
  if (input) { input.value = text; input.focus(); }
}

function sendConsultorMessage(inputEl, chatArea) {
  var text = inputEl.value.trim();
  if (!text) return;

  var placeholder = chatArea.querySelector("p.italic");
  if (placeholder) placeholder.remove();

  var userBubble = document.createElement("div");
  userBubble.className = "flex justify-end";
  userBubble.innerHTML = '<div class="chat-bubble-user">' + text + "</div>";
  chatArea.appendChild(userBubble);
  inputEl.value = "";

  setTimeout(function() {
    var aiBubble = document.createElement("div");
    aiBubble.className = "flex justify-start";
    aiBubble.innerHTML = '<div class="chat-bubble-ai">Analizando el patrón PAT-002 con los datos disponibles… (integración con Mistral pendiente)</div>';
    chatArea.appendChild(aiBubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 600);

  chatArea.scrollTop = chatArea.scrollHeight;
}
