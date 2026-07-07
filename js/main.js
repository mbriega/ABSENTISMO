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

  function mkMetric(value, label) {
    return '<td class="py-4 px-4 text-right">'
      + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">'
      + '<span style="font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;">' + value + '</span>'
      + '<span style="font-size:10px;color:#94a3b8;white-space:nowrap;">' + label + '</span>'
      + '</div>'
      + '</td>';
  }

  function render(filtro) {
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
        + mkMetric(p.diasAsoc || '—', 'Días de baja')
        + mkMetric(p.empleados, 'Personas')
        + mkMetric(p.costeDirecto, 'Coste')
        + mkMetric(p.activaciones ? p.activaciones.toLocaleString('es-ES') : '—', 'Ocurrencias')
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
  (function() {
    var btn   = document.getElementById("btn-desglose-costes");
    var modal = document.getElementById("modal-desglose");
    var close = document.getElementById("modal-close");
    if (!btn || !modal) return;

    var charted = false;

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
        var cost  = parseCost(p.costeDirecto);
        var bw    = Math.max(4, Math.round((cost / maxCost) * B * 0.96));
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
          + ' font-size="11" font-weight="600" fill="#0f172a" font-family="Inter,system-ui,sans-serif">' + p.costeDirecto + '</text>';
      }).join("");

      var axisLine = '<line x1="' + L + '" y1="' + topPad + '" x2="' + L + '" y2="' + (totalH - 10) + '" stroke="#e2e8f0" stroke-width="1"/>';
      container.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + totalH + '" width="100%" style="display:block;">'
        + rows + axisLine + '</svg>';
    }

    function openModal() {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      if (!charted) { charted = true; buildChart(); }
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
          + '<path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
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

  // Personas
  setText("personas-subtitle", d.personas.total + " personas afectadas por este patrón");
  setText("personas-summary",  d.personas.total + " personas · " + (d.personas.centrosAfectados || "—") + " centros afectados");

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

  // ── Cómo se ha detectado — 4 cards 2×2 gris ─────────────────
  var evContent = document.getElementById("ev-content");
  if (evContent && d.evidenciaTecnica) {
    var ev = d.evidenciaTecnica;
    var warnIcon = '<svg class="w-3.5 h-3.5 text-medium-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4M12 17h.01"/></svg>';
    var reglaTxt = d.formulaSenal
      ? d.formulaSenal.condiciones.map(function(c) { return c.titulo + ' (' + c.subtitulo + ')'; }).join(' + ')
      : ev.trazabilidad;

    evContent.innerHTML =
      '<div class="grid grid-cols-2 gap-3 mb-4">'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-sm font-semibold text-surface-900 mb-1.5">Fuentes utilizadas</p>'
      + '<p class="text-sm text-surface-500 leading-relaxed">' + ev.fuentes.join(', ') + '.</p>'
      + '</div>'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-sm font-semibold text-surface-900 mb-1.5">Regla de activación</p>'
      + '<p class="text-sm text-surface-500 leading-relaxed">' + reglaTxt + '.</p>'
      + '</div>'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-sm font-semibold text-surface-900 mb-1.5">Ventana analizada</p>'
      + '<p class="text-sm text-surface-500 leading-relaxed">' + ev.periodo + ' para apariciones recientes y contraste histórico ampliado.</p>'
      + '</div>'
      + '<div class="border border-surface-200 rounded-xl p-4">'
      + '<p class="text-sm font-semibold text-surface-900 mb-1.5">Lectura técnica</p>'
      + '<p class="text-sm text-surface-500 leading-relaxed">Asociación histórica repetida y medible. No implica causalidad ni decisión automática sobre personas.</p>'
      + '</div>'
      + '</div>'
      + '<div class="bg-medium-50 border border-medium-200 rounded-xl p-4">'
      + '<p class="text-[10px] font-medium text-medium-600 uppercase tracking-wider mb-3">Antes de actuar, ten en cuenta</p>'
      + '<ul class="space-y-2">'
      + ev.advertencias.map(function(w) {
          return '<li class="flex items-start gap-2 text-sm text-medium-700">' + warnIcon + '<span>' + w + '</span></li>';
        }).join('')
      + '</ul>'
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
        val: "84,7%", valCls: "text-primary-700",
        lbl: "Riesgo histórico a 60 días",
        desc: "De cada 100 activaciones del patrón, 85 terminaron en nueva ausencia.",
        tip: "Riesgo histórico sobre 232 apariciones registradas (ene 2024 – may 2025). El más alto del catálogo."
      },
      {
        val: d.apariciones, valCls: "text-surface-900",
        lbl: "Apariciones del patrón",
        desc: "Entre ene 2024 y mayo 2025.",
        tip: "Número de veces que las tres condiciones se activaron simultáneamente."
      },
      {
        val: d.personasUnicas, valCls: "text-surface-900",
        lbl: "Personas únicas",
        desc: "Activaron el patrón al menos una vez.",
        tip: "Empleados distintos que activaron el patrón. Una misma persona puede sumar varias apariciones."
      },
      {
        val: "1,20 M€", valCls: "text-primary-700",
        lbl: "Coste histórico asociado",
        desc: "Puede solaparse con otros fenómenos.",
        tip: "Agrupa salarios, sustituciones, horas extra y reorganización. No sumes directamente con otros patrones."
      },
      {
        val: d.solidezEvidencia, valCls: "text-low-700",
        lbl: "Solidez de la evidencia",
        desc: "El patrón se repite con consistencia.",
        tip: "Se replicó en 4 de los últimos 6 meses analizados con resultados consistentes."
      }
    ];
    kpiStrip.innerHTML = kpiDefs.map(function(k) {
      return '<div class="pat-kpi-cell">'
        + '<div class="flex items-center gap-1.5">'
        + '<span class="text-2xl font-bold tabular-nums leading-none ' + k.valCls + '">' + k.val + '</span>'
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

  // ── Señal detectada ──────────────────────────────────────────
  var formulaCard = document.getElementById("pat-formula-card");
  if (formulaCard && d.formulaSenal) {
    formulaCard.innerHTML =
      '<p class="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-3">Señal detectada</p>'
      + '<p class="text-xs text-surface-400 mb-4">Las tres condiciones deben darse simultáneamente.</p>'
      + '<div class="space-y-3">'
      + d.formulaSenal.condiciones.map(function(c, i) {
          return '<div class="flex items-start gap-3">'
            + '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold shrink-0 mt-0.5">' + (i + 1) + '</span>'
            + '<div><p class="text-sm font-semibold text-surface-900">' + c.titulo + '</p>'
            + '<p class="text-xs text-surface-500 mt-0.5">' + c.subtitulo + '</p></div>'
            + '</div>';
        }).join("")
      + '</div>'
      + '<div class="mt-4 pt-4 border-t border-surface-100">'
      + '<div class="bg-primary-50 border border-primary-100 rounded-lg px-3 py-2.5 flex items-center gap-2">'
      + '<span class="text-xs font-bold text-primary-600">→</span>'
      + '<p class="text-sm font-semibold text-primary-800">' + d.formulaSenal.resultado + '</p>'
      + '</div></div>';
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

  // ── Evidencia histórica (dentro del acordeón, lazy render) ──
  var evHistDisc = document.getElementById("ev-historica-disc");
  if (evHistDisc && d.evidenciaHistorica) {
    evHistDisc.addEventListener("toggle", function() {
      if (!evHistDisc.open || evHistDisc._charted) return;
      evHistDisc._charted = true;
      if (typeof ChartsComponent !== "undefined") {
        ChartsComponent.renderLineChart("chart-evidencia", {
          valores: d.evidenciaHistorica.riesgo60d,
          meses:   d.evidenciaHistorica.meses
        });
      }
    });
    var evh = d.evidenciaHistorica;
    var evhEl = document.getElementById("ev-historica-body");
    if (evhEl) {
      evhEl.innerHTML =
        '<p class="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-3">% riesgo de nueva baja a 60 días por mes</p>'
        + '<canvas id="chart-evidencia" height="200"></canvas>'
        + '<div class="grid grid-cols-4 gap-3 mt-4">'
        + '<div class="bg-primary-50 border border-primary-100 rounded-xl p-4">'
        + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-1">Media histórica</p>'
        + '<p class="text-2xl font-bold tabular-nums text-primary-700 leading-none">' + evh.mediaRiesgo + '</p>'
        + '<p class="text-xs text-surface-500 mt-1">riesgo a 60 días</p>'
        + '</div>'
        + '<div class="bg-low-50 border border-low-200 rounded-xl p-4">'
        + '<p class="text-[10px] font-medium text-low-600 uppercase tracking-wider mb-1">Diferencial</p>'
        + '<p class="text-xl font-bold text-low-700 leading-none">+31,2 pp</p>'
        + '<p class="text-xs text-low-600 mt-1">sobre media general (53,5%)</p>'
        + '</div>'
        + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
        + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-1">Consistencia</p>'
        + '<p class="text-sm font-bold text-surface-900 leading-snug">4 de los últimos 6 meses</p>'
        + '<p class="text-xs text-surface-500 mt-1 leading-relaxed">' + evh.resumen + '</p>'
        + '</div>'
        + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
        + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-1">Solidez</p>'
        + '<p class="text-xs text-surface-700 leading-relaxed">Los picos de riesgo coinciden con los meses de mayor volumen de reincorporaciones. Correlación estable y replicable.</p>'
        + '</div>'
        + '</div>';
    }
  }

  // ── Dónde aparece más ────────────────────────────────────────
  var distribEl = document.getElementById("distrib-body");
  if (distribEl && d.distribucionPor) {
    var dist = d.distribucionPor;
    var mkDistTable = function(items, nota) {
      return '<div class="mt-2">'
        + items.map(function(it) {
            return '<div class="distrib-row"><span>' + it.nombre + '</span><strong>' + it.pct + '%</strong></div>';
          }).join("")
        + '</div>'
        + '<p class="text-xs text-surface-400 mt-2">' + nota + '</p>';
    };
    distribEl.innerHTML =
      '<div class="grid grid-cols-3 gap-3">'
      + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4"><p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider">Por colectivo</p>' + mkDistTable(dist.colectivo, "% sobre apariciones") + '</div>'
      + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4"><p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider">Por turno</p>'     + mkDistTable(dist.turno,     "% sobre apariciones") + '</div>'
      + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4"><p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider">Por antigüedad</p>' + mkDistTable(dist.antiguedad, "% sobre personas únicas") + '</div>'
      + '</div>';
  }

  // ── Análisis del coste — donut + cards ───────────────────────
  var costeEl = document.getElementById("coste-detalle-body");
  if (costeEl && d.impactoDesglose) {
    var cItems = d.impactoDesglose;
    var cTotal = cItems.reduce(function(s, it) { return s + it.porcentaje; }, 0);
    var cColors = ['#1d4ed8','#2563eb','#3b82f6','#60a5fa','#93c5fd'];
    var r = 66, cx = 90, cy = 90, sw = 26;
    var circ = 2 * Math.PI * r;
    var cOffset = 0;
    var segs = cItems.map(function(it, i) {
      var dd = (it.porcentaje / cTotal) * circ;
      var s = '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none"'
        + ' stroke="'+cColors[i]+'" stroke-width="'+sw+'"'
        + ' stroke-dasharray="'+dd.toFixed(2)+' '+(circ-dd).toFixed(2)+'"'
        + ' stroke-dashoffset="'+(-cOffset).toFixed(2)+'"'
        + ' transform="rotate(-90 '+cx+' '+cy+')" stroke-linecap="butt"/>';
      cOffset += dd;
      return s;
    }).join('');
    var donutSvg = '<svg viewBox="0 0 180 180" style="width:180px;height:180px;display:block;">'
      + segs
      + '<text x="'+cx+'" y="'+(cy-8)+'" text-anchor="middle" font-size="17" font-weight="800" fill="#1d4ed8" font-family="Inter,system-ui,sans-serif">1,20 M€</text>'
      + '<text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="Inter,system-ui,sans-serif">coste histórico</text>'
      + '</svg>';

    var legend = '<div class="flex-1">'
      + cItems.map(function(it, i) {
          return '<div class="flex items-center py-1.5 border-b border-surface-100 last:border-0">'
            + '<div style="width:9px;height:9px;border-radius:2px;background:'+cColors[i]+';flex-shrink:0;margin-right:8px;"></div>'
            + '<span class="text-xs text-surface-700" style="flex:1;min-width:0;">' + it.concepto + '</span>'
            + '<span class="text-xs font-bold text-surface-900 tabular-nums">' + it.porcentaje.toFixed(1) + '%</span>'
            + '</div>';
        }).join('')
      + '</div>';

    var metricas = '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4 ml-4" style="min-width:210px;">'
      + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-3">Métricas derivadas</p>'
      + '<div class="distrib-row"><span>Coste medio/aparición</span><strong>5.172 €</strong></div>'
      + '<div class="distrib-row"><span>Coste medio/persona</span><strong>10.084 €</strong></div>'
      + '<div class="distrib-row"><span>Casos con baja posterior</span><strong>≈ 196</strong></div>'
      + '<div class="distrib-row"><span>Coste por caso confirmado</span><strong>6.122 €</strong></div>'
      + '</div>';

    var row1 = '<div class="flex items-center gap-4 mb-4">'
      + '<div class="flex-shrink-0">' + donutSvg + '</div>'
      + legend
      + metricas
      + '</div>';

    var row2 = '<div class="grid grid-cols-2 gap-3 mb-4">'
      + cItems.map(function(it, i) {
          return '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
            + '<div class="flex items-center justify-between mb-2">'
            + '<div class="flex items-center gap-2">'
            + '<div style="width:8px;height:8px;border-radius:2px;background:'+cColors[i]+';flex-shrink:0;"></div>'
            + '<p class="text-xs font-semibold text-surface-900">' + it.concepto + '</p>'
            + '</div>'
            + '<span class="text-sm font-bold text-surface-700 tabular-nums shrink-0 ml-2">' + it.porcentaje.toFixed(1) + '%</span>'
            + '</div>'
            + '<p class="text-sm font-bold text-surface-900 tabular-nums mb-1.5">' + it.importeLabel + '</p>'
            + '<p class="text-xs text-surface-600 leading-relaxed">' + it.tooltip + '</p>'
            + '</div>';
        }).join("")
      + '</div>';

    var row3 = '<div class="bg-medium-50 border border-medium-200 rounded-xl p-3">'
      + '<p class="text-xs font-medium text-medium-700 leading-relaxed"><strong>Lectura prudente:</strong> el coste está asociado al patrón y puede solaparse con otros fenómenos. Sirve para dimensionar el impacto histórico y priorizar su peso dentro del modelo predictivo, pero no debe interpretarse como ahorro directo garantizado.</p>'
      + '</div>';

    costeEl.innerHTML = row1 + row2 + row3;
  }

  // ── Qué datos mejorarían la lectura ─────────────────────────
  var datosMejEl = document.getElementById("datos-mejoran-body");
  if (datosMejEl && d.datosQueMejorarian) {
    datosMejEl.innerHTML =
      '<div class="grid grid-cols-2 gap-3">'
      + d.datosQueMejorarian.map(function(item) {
          return '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
            + '<p class="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-2">' + item.fuente + '</p>'
            + '<p class="text-sm text-surface-700 leading-relaxed">' + item.descripcion + '</p>'
            + '</div>';
        }).join("")
      + '</div>';
  }

  // Consultor — envío
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
