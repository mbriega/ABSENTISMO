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

  function render(filtro) {
    var tbody = document.getElementById("patrones-table-body");
    if (!tbody) return;

    var items = (filtro === "Todos")
      ? PATRONES_DATA.patrones
      : PATRONES_DATA.patrones.filter(function(p) { return p.categoria === filtro; });

    tbody.innerHTML = items.map(function(p) {
      var isCritico = p.criticidad === "critico";
      var rowClass  = "patrones-row cursor-pointer" + (isCritico ? " patrones-row--critico" : "");
      var rowStyle  = isCritico ? ' style="border-left: 2px solid #ef4444;"' : "";
      var nameClass = isCritico
        ? "text-xs font-semibold text-critical-700 leading-tight"
        : "text-xs font-semibold text-surface-800 leading-tight";

      var desc = p.descripcionHumana || p.definicion;
      return '<tr class="' + rowClass + '"' + rowStyle + ' onclick="window.location.href=\'' + p.detalle + '\'">'
        + '<td class="py-2.5 px-5">'
        + '<p class="' + nameClass + '">' + p.nombre + "</p>"
        + (desc ? '<p class="text-[11px] text-surface-400 mt-0.5 leading-snug">' + desc + "</p>" : "")
        + "</td>"
        + '<td class="py-2.5 px-3 text-right text-xs font-semibold text-surface-700 tabular-nums">' + p.activaciones.toLocaleString("es-ES") + "</td>"
        + '<td class="py-2.5 px-3 text-right text-xs text-surface-600 tabular-nums">' + p.empleados + "</td>"
        + '<td class="py-2.5 px-3 text-right tabular-nums"><span class="badge ' + getRiskClass(p.riesgo60d) + '">' + p.riesgo60d + "</span></td>"
        + '<td class="py-2.5 px-3 text-right text-xs text-surface-600 tabular-nums">' + p.diasAsoc + "</td>"
        + '<td class="py-2.5 px-3 text-right text-xs text-surface-600 tabular-nums">' + p.media + "</td>"
        + '<td class="py-2.5 px-3 text-right text-xs font-semibold text-high-600 tabular-nums">' + p.costeDirecto + "</td>"
        + '<td class="py-2.5 px-3 text-center"><span class="badge ' + (BADGE[p.criticidad] || "") + '">' + p.criticidad + "</span></td>"
        + '<td class="py-2.5 px-3 text-right">'
        + '<a href="' + p.detalle + '" class="text-xs text-primary-600 hover:text-primary-800 font-medium whitespace-nowrap inline-flex items-center gap-1 transition-colors" onclick="event.stopPropagation()">Detalle ' + ARROW + "</a>"
        + "</td>"
        + "</tr>";
    }).join("");
  }

  return { render: render };
})();

// ══════════════════════════════════════════════════════════════
// PÁGINA: PATRONES (listado)
// ══════════════════════════════════════════════════════════════

function initPatronesPage() {
  // Análisis IA — card grid con jerarquía visual
  var aiList = document.getElementById("ai-analysis-list");
  if (aiList) {
    var items   = PATRONES_DATA.aiAnalysis;
    var critico = items.find(function(i) { return i.tipo === "critico"; });
    var datos   = items.filter(function(i) { return i.tipo === "dato"; });
    var accion  = items.find(function(i) { return i.tipo === "accion"; });
    var html    = "";

    // Card crítico
    if (critico) {
      html += '<div class="bg-white rounded-lg p-4 border border-critical-200 mb-3">'
        + '<div class="flex items-start justify-between gap-4 flex-wrap">'
        + '<div class="flex-1 min-w-0">'
        + '<p class="text-xs font-semibold text-critical-600 uppercase tracking-wider mb-1.5">' + critico.titulo + "</p>"
        + '<p class="text-sm text-surface-700 leading-relaxed">' + critico.texto + "</p>"
        + "</div>";
      if (critico.metricas) {
        html += '<div class="flex flex-wrap gap-1.5 shrink-0">';
        critico.metricas.forEach(function(m) {
          html += '<span class="text-xs font-semibold text-critical-600 bg-critical-50 px-2.5 py-1 rounded-full whitespace-nowrap">' + m + "</span>";
        });
        html += "</div>";
      }
      html += "</div></div>";
    }

    // Grid de datos
    if (datos.length) {
      html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">';
      datos.forEach(function(item) {
        html += '<div class="bg-surface-50 rounded-lg p-4 border border-surface-100">'
          + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">' + item.titulo + "</p>"
          + '<p class="text-sm text-surface-600 leading-relaxed">' + item.texto + "</p>"
          + "</div>";
      });
      html += "</div>";
    }

    // Card de acción
    if (accion) {
      html += '<div class="bg-primary-50/50 rounded-lg p-4 border border-primary-100">'
        + '<div class="flex items-start gap-3">'
        + '<svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>'
        + "</svg>"
        + '<div>'
        + '<p class="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1.5">' + accion.titulo + "</p>"
        + '<p class="text-sm text-primary-700/90 leading-relaxed">' + accion.texto + "</p>"
        + "</div></div></div>";
    }

    aiList.innerHTML = html;
  }

  // Filtros + tabla inicial
  FiltersComponent.render();
  TableComponent.render("Todos");
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

  // Evidencia técnica — 4 tarjetas en lenguaje de negocio
  var evContent = document.getElementById("ev-content");
  if (evContent && d.evidenciaTecnica) {
    var ev = d.evidenciaTecnica;
    var pill = function(t) {
      return '<span class="text-xs bg-surface-100 text-surface-700 px-2.5 py-1 rounded-full font-medium">' + t + "</span>";
    };
    var warnIcon = '<svg class="w-3.5 h-3.5 text-medium-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4M12 17h.01"/></svg>';

    evContent.innerHTML =
      // Fila 1: universo + fiabilidad
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">'
      + '<div class="bg-primary-50 border border-primary-100 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">¿Sobre qué universo trabaja?</p>'
      + '<p class="text-sm font-semibold text-surface-900">' + ev.poblacion + "</p>"
      + '<p class="text-xs text-surface-500 mt-1">' + ev.periodo + "</p>"
      + "</div>"
      + '<div class="bg-low-50 border border-low-200 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-low-600 uppercase tracking-wider mb-3">¿Cuánto podemos fiarnos?</p>'
      + '<p class="text-sm font-semibold text-surface-900">' + ev.consistencia + "</p>"
      + '<p class="text-xs text-surface-600 mt-1.5 leading-snug">' + ev.confianza + "</p>"
      + "</div>"
      + "</div>"
      // Fila 2: variables + fuentes
      + '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">'
      + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Variables que analiza el modelo</p>'
      + '<div class="flex flex-wrap gap-1.5">' + ev.variables.map(pill).join("") + "</div>"
      + "</div>"
      + '<div class="bg-surface-50 border border-surface-100 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Fuentes de datos</p>'
      + '<div class="flex flex-wrap gap-1.5">' + ev.fuentes.map(pill).join("") + "</div>"
      + '<p class="text-xs text-surface-500 mt-3 leading-snug">' + ev.trazabilidad + "</p>"
      + "</div>"
      + "</div>"
      // Fila 3: advertencias
      + '<div class="bg-medium-50 border border-medium-200 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-medium-700 uppercase tracking-wider mb-3">Antes de actuar, ten en cuenta</p>'
      + '<ul class="space-y-2">'
      + ev.advertencias.map(function(w) {
          return '<li class="flex items-start gap-2 text-sm text-medium-700">' + warnIcon + "<span>" + w + "</span></li>";
        }).join("")
      + "</ul>"
      + "</div>";
  }

  // ── NUEVO: Cabecera del patrón — fechas ──────────────────────
  var metaDates = document.getElementById("pat-meta-dates");
  if (metaDates && d.deteccion) {
    metaDates.innerHTML =
      '<span>Detectado el ' + d.deteccion + '</span>'
      + '<span class="text-surface-300 mx-1">·</span>'
      + '<span>Última aparición: ' + d.ultimaAparicion + '</span>';
  }

  // ── NUEVO: KPI strip (5 métricas en cabecera) ─────────────────
  var kpiStrip = document.getElementById("pat-kpi-strip");
  if (kpiStrip) {
    var INFO_ICON = function(tip, below) {
      return '<div class="kpi-info-wrap" style="display:inline-flex;margin-left:3px;">'
        + '<svg class="kpi-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="1.75"/><path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + '<div class="kpi-tooltip' + (below ? ' kpi-tooltip--below' : '') + '">' + tip + '</div>'
        + '</div>';
    };
    var kpiDefs = [
      {
        val: "84,7%", cls: "purple",
        lbl: "Riesgo histórico<br>a 60 días",
        desc: "De cada 100 veces que apareció este patrón, 85 terminaron en nueva ausencia posterior.",
        tip: "Riesgo histórico sobre 232 apariciones registradas entre ene 2024 y may 2025. Es el resultado más alto del catálogo.",
        ico: null, icoCls: ""
      },
      {
        val: d.apariciones, cls: "",
        lbl: "Apariciones<br>del patrón",
        desc: "Entre ene 2024 y mayo 2025.",
        tip: "Número de veces que el patrón se activó simultáneamente en las tres condiciones.",
        ico: "◉", icoCls: ""
      },
      {
        val: d.personasUnicas, cls: "",
        lbl: "Personas<br>únicas",
        desc: "Activaron el patrón al menos una vez.",
        tip: "Empleados diferentes que activaron el patrón en el período analizado. Una persona puede haber generado varias apariciones.",
        ico: "👥", icoCls: ""
      },
      {
        val: "1,20 M€", cls: "purple",
        lbl: "Coste histórico<br>asociado",
        desc: "Puede solaparse con otros fenómenos.",
        tip: "Coste asociado al patrón: salarios, sustituciones, horas extra y reorganización operativa. No sumes directamente con otros patrones.",
        ico: "€", icoCls: ""
      },
      {
        val: d.solidezEvidencia, cls: "red",
        lbl: "Solidez de<br>la evidencia",
        desc: "El patrón se repite y muestra consistencia.",
        tip: "El patrón se replicó en 4 de los 6 últimos meses analizados con resultados consistentes.",
        ico: "🔴", icoCls: "red"
      }
    ];
    kpiStrip.innerHTML = kpiDefs.map(function(k) {
      return '<div class="pat-kpi-cell">'
        + '<div class="pat-kpi-head">'
        + '<div>'
        + '<div style="display:flex;align-items:center;gap:2px;">'
        + '<strong class="pat-kpi-val ' + k.cls + '">' + k.val + '</strong>'
        + INFO_ICON(k.tip, false)
        + '</div>'
        + '<label class="pat-kpi-lbl">' + k.lbl + '</label>'
        + '</div>'
        + (k.ico ? '<div class="pat-kpi-ico ' + k.icoCls + '">' + k.ico + '</div>' : '')
        + '</div>'
        + '<p class="pat-kpi-desc">' + k.desc + '</p>'
        + '</div>';
    }).join("");
  }

  // ── NUEVO: Descripción del patrón ─────────────────────────────
  var descCard = document.getElementById("pat-description-card");
  if (descCard && d.descripcionPatron) {
    var impactCards = "";
    if (d.impactoEmpresa && d.impactoEmpresa.length) {
      impactCards = '<div class="impact-grid-2x2">'
        + d.impactoEmpresa.map(function(item) {
            return '<div class="impact-card">'
              + '<strong>' + item.titulo + '</strong>'
              + '<p>' + item.cuerpo + '</p>'
              + '</div>';
          }).join("")
        + '</div>';
    }
    descCard.innerHTML =
      '<h2 class="text-sm font-semibold text-surface-900 mb-3">Descripción del patrón</h2>'
      + '<p><span class="desc-lead-text">' + d.descripcionPatron.lead + '</span>'
      + d.descripcionPatron.cuerpo + '</p>'
      + impactCards;
  }

  // ── NUEVO: Centros distribución ───────────────────────────────
  var centrosCard = document.getElementById("pat-centers-card");
  if (centrosCard && d.centrosDistribucion) {
    centrosCard.innerHTML =
      '<h2 class="text-sm font-semibold text-surface-900 mb-4">Centros donde más aparece</h2>'
      + d.centrosDistribucion.map(function(c) {
          return '<div class="center-row-item">'
            + '<div>'
            + '<div>' + c.nombre + '</div>'
            + '<div class="center-track"><div class="center-fill" style="width:' + c.pct + '%"></div></div>'
            + '</div>'
            + '<strong>' + c.pct + '%</strong>'
            + '</div>';
        }).join("")
      + '<p class="text-xs text-surface-400 mt-2">% sobre apariciones totales del patrón</p>';
  }

  // ── NUEVO: Fórmula visual ─────────────────────────────────────
  var formulaEl = document.getElementById("pat-formula");
  if (formulaEl && d.formulaSenal) {
    formulaEl.innerHTML =
      d.formulaSenal.condiciones.map(function(c, i) {
        return (i > 0 ? '<div class="formula-op">+</div>' : '')
          + '<div class="formula-chip-new">' + c.titulo + '<span>' + c.subtitulo + '</span></div>';
      }).join("")
      + '<div class="formula-op">=</div>'
      + '<div class="formula-chip-new final">' + d.formulaSenal.resultado + '</div>';
  }

  // ── NUEVO: Evidencia histórica (cuerpo del acordeón) ──────────
  var evHistEl = document.getElementById("ev-historica-body");
  if (evHistEl && d.evidenciaHistorica) {
    var ev = d.evidenciaHistorica;
    var maxAp = Math.max.apply(null, ev.apariciones);
    var minR  = Math.min.apply(null, ev.riesgo60d);
    var maxR  = Math.max.apply(null, ev.riesgo60d);
    var rangeR = maxR - minR || 1;

    var xPos = [75, 165, 255, 345, 435, 525];

    var barsSvg = ev.apariciones.map(function(v, i) {
      var bH = Math.round(v / maxAp * 140);
      var bY = 150 - bH;
      var bX = xPos[i] - 30;
      return '<rect x="' + bX + '" y="' + bY + '" width="60" height="' + bH + '" fill="#c4b5fd" rx="4"/>'
        + '<text x="' + xPos[i] + '" y="' + (bY - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">' + v + '</text>'
        + '<text x="' + xPos[i] + '" y="172" text-anchor="middle" font-size="11" fill="#64748b">' + ev.meses[i] + '</text>';
    }).join("");

    var linePts = ev.riesgo60d.map(function(v, i) {
      var y = Math.round(10 + (maxR - v) / rangeR * 130);
      return xPos[i] + "," + y;
    }).join(" ");

    var dotsSvg = ev.riesgo60d.map(function(v, i) {
      var y = Math.round(10 + (maxR - v) / rangeR * 130);
      return '<circle cx="' + xPos[i] + '" cy="' + y + '" r="7" fill="#4f46e5"/>';
    }).join("");

    evHistEl.innerHTML =
      '<div class="ev-hist-layout">'

      // Columna izquierda
      + '<div class="bg-white border border-surface-100 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Lectura rápida</p>'
      + '<p class="text-sm text-surface-600 leading-relaxed">El patrón se repite con regularidad y vuelve a activarse en períodos recientes.</p>'
      + '<span class="block text-2xl font-bold text-primary-700 my-3">4 de los últimos 6 meses</span>'
      + '<p class="text-sm text-surface-600">mostraron el patrón.</p>'
      + '<div class="mt-4 space-y-2">'
      + '<div class="flex items-center gap-2 text-xs text-surface-500"><div class="ev-legend-dot"></div>Riesgo histórico a 60 días (%)</div>'
      + '<div class="flex items-center gap-2 text-xs text-surface-500"><div class="ev-legend-bar"></div>Apariciones (nº)</div>'
      + '</div>'
      + '</div>'

      // Gráfica SVG
      + '<div class="bg-white border border-surface-100 rounded-xl" style="min-height:220px;">'
      + '<svg viewBox="0 0 600 190" style="width:100%;height:220px;display:block;" preserveAspectRatio="xMidYMid meet">'
      + barsSvg
      + '<polyline points="' + linePts + '" fill="none" stroke="#4f46e5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
      + dotsSvg
      + '</svg>'
      + '</div>'

      // Resultado
      + '<div class="bg-white border border-surface-100 rounded-xl p-4">'
      + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Resultado histórico a 60 días</p>'
      + '<strong class="block text-[36px] font-bold leading-none tracking-tight text-primary-700 my-3">' + ev.mediaRiesgo + '</strong>'
      + '<p class="text-sm text-surface-600">Media de los meses donde apareció el patrón.</p>'
      + '<div class="mt-4 bg-low-50 border border-low-200 rounded-xl p-3">'
      + '<strong class="block text-xl font-bold text-low-700 mb-1">+31,2 pp</strong>'
      + '<p class="text-xs text-low-600">por encima de la media general (53,5%)</p>'
      + '</div>'
      + '</div>'

      + '</div>';
  }

  // ── NUEVO: Dónde aparece más (distribución) ───────────────────
  var distribEl = document.getElementById("distrib-body");
  if (distribEl && d.distribucionPor) {
    var dist = d.distribucionPor;
    var mkTable = function(items, nota) {
      return '<div class="space-y-0.5 mt-2">'
        + items.map(function(it) {
            return '<div class="distrib-row"><span>' + it.nombre + '</span><strong>' + it.pct + '%</strong></div>';
          }).join("")
        + '</div>'
        + '<p class="text-xs text-surface-400 mt-2">' + nota + '</p>';
    };
    distribEl.innerHTML =
      '<div class="grid grid-cols-3 gap-3">'
      + '<div class="bg-white border border-surface-100 rounded-xl p-4"><h3 class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Por colectivo</h3>' + mkTable(dist.colectivo, "% sobre apariciones") + '</div>'
      + '<div class="bg-white border border-surface-100 rounded-xl p-4"><h3 class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Por turno</h3>' + mkTable(dist.turno, "% sobre apariciones") + '</div>'
      + '<div class="bg-white border border-surface-100 rounded-xl p-4"><h3 class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Por antigüedad</h3>' + mkTable(dist.antiguedad, "% sobre personas únicas") + '</div>'
      + '</div>';
  }

  // ── NUEVO: Coste — categorías detalladas ─────────────────────
  var costeCatEl = document.getElementById("coste-categorias");
  if (costeCatEl && d.impactoDesglose) {
    var shown = d.impactoDesglose.slice(0, 3);
    costeCatEl.innerHTML = shown.map(function(item, i) {
      return '<div class="bg-white border border-surface-100 rounded-xl p-4">'
        + '<h3 class="text-xs font-semibold text-surface-900 mb-2">' + (i + 1) + '. ' + item.concepto + '</h3>'
        + '<p class="text-xs text-surface-500 leading-relaxed mb-3">' + item.tooltip + '</p>'
        + '<div class="space-y-1">'
        + '<div class="distrib-row"><span>Peso en el patrón</span><strong>' + item.porcentaje + '%</strong></div>'
        + '<div class="distrib-row"><span>Importe observado</span><strong>' + item.importeLabel + '</strong></div>'
        + '</div>'
        + '</div>';
    }).join("");
  }

  // ── NUEVO: Qué datos mejorarían la lectura ────────────────────
  var datosMejEl = document.getElementById("datos-mejoran-body");
  if (datosMejEl && d.datosQueMejorarian) {
    datosMejEl.innerHTML =
      '<div class="grid grid-cols-2 gap-3">'
      + d.datosQueMejorarian.map(function(item) {
          return '<div class="bg-white border border-surface-100 rounded-xl p-4">'
            + '<strong class="text-sm font-semibold text-surface-900 block mb-1">' + item.fuente + '</strong>'
            + '<p class="text-sm text-surface-500 leading-relaxed">' + item.descripcion + '</p>'
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
