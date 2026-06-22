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

  function render(filtro) {
    var tbody = document.getElementById("patrones-table-body");
    if (!tbody) return;

    var items = (filtro === "Todos")
      ? PATRONES_DATA.patrones
      : PATRONES_DATA.patrones.filter(function(p) { return p.categoria === filtro; });

    tbody.innerHTML = items.map(function(p) {
      var desc = p.descripcionHumana || p.definicion;
      return '<tr class="patrones-row cursor-pointer" onclick="window.location.href=\'' + p.detalle + '\'">'
        + '<td class="px-5 py-4">'
        + '<p class="text-sm font-medium text-surface-900 leading-tight">' + p.nombre + "</p>"
        + '<p class="text-xs text-surface-400 mt-1 leading-relaxed">' + desc + "</p>"
        + "</td>"
        + '<td class="px-4 py-4 text-right text-sm font-semibold text-surface-900 tabular-nums">' + p.activaciones.toLocaleString("es-ES") + "</td>"
        + '<td class="px-4 py-4 text-right text-sm font-semibold text-surface-900 tabular-nums">' + p.empleados + "</td>"
        + '<td class="px-4 py-4 text-right text-sm font-semibold text-surface-700 tabular-nums">' + p.riesgo60d + "</td>"
        + '<td class="px-4 py-4 text-right text-sm text-surface-600 tabular-nums">' + p.diasAsoc + "</td>"
        + '<td class="px-4 py-4 text-right text-sm text-surface-600 tabular-nums">' + p.media + "</td>"
        + '<td class="px-4 py-4 text-right text-sm font-semibold text-surface-900 tabular-nums">' + p.costeDirecto + "</td>"
        + '<td class="px-4 py-4 text-center"><span class="badge ' + (BADGE[p.criticidad] || "") + '">' + p.criticidad + "</span></td>"
        + '<td class="px-4 py-4">'
        + '<a href="' + p.detalle + '" class="text-xs font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap transition-colors" onclick="event.stopPropagation()">Ver patrón →</a>'
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
    qsEl.innerHTML = d.queSignifica.map(function(item) {
      return '<li class="flex items-start gap-2.5">'
        + '<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"></span>'
        + '<span class="text-sm text-surface-700 leading-relaxed">' + item + "</span>"
        + "</li>";
    }).join("");
  }

  // Qué no significa
  var qnsEl = document.getElementById("que-no-significa-list");
  if (qnsEl && d.queNoSignifica) {
    qnsEl.innerHTML = d.queNoSignifica.map(function(item) {
      return '<li class="flex items-start gap-2.5">'
        + '<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-surface-300 shrink-0"></span>'
        + '<span class="text-sm text-surface-600 leading-relaxed">' + item + "</span>"
        + "</li>";
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
      return '<div class="bg-surface-50 rounded-lg p-4 border border-surface-100">'
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
      return '<div class="bg-surface-50 rounded-lg p-4 border border-surface-100">'
        + '<p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">' + a.perfil + "</p>"
        + '<p class="text-sm text-surface-700 leading-relaxed">' + a.lectura + "</p>"
        + "</div>";
    }).join("");
  }

  // Impacto desglose (lista derecha)
  var desgloseEl = document.getElementById("impacto-desglose");
  if (desgloseEl) {
    desgloseEl.innerHTML = d.impactoDesglose.map(function(item) {
      return '<div class="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">'
        + "<div>"
        + '<p class="text-sm font-medium text-surface-800">' + item.concepto + "</p>"
        + '<p class="text-xs text-surface-400">' + item.porcentaje + "% del total</p>"
        + "</div>"
        + '<p class="text-sm font-semibold text-surface-900 tabular-nums">' + item.importeLabel + "</p>"
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
      return '<span class="text-sm text-surface-600 flex items-center gap-1.5">'
        + '<span class="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"></span>'
        + e + "</span>";
    }).join("");
  }

  // Gráfica barras (impacto)
  if (typeof ChartsComponent !== "undefined") {
    ChartsComponent.renderBarChart("chart-impacto", d.impactoDesglose);
  }

  // Botones de métrica (timeline)
  var metricBtns = document.getElementById("metric-buttons");
  if (metricBtns) {
    metricBtns.innerHTML = '<button class="metric-btn active" data-metric="0">Tasa (%)</button>';
  }

  // Gráfica línea (evolución) — índice 6 = julio (intervención)
  if (typeof ChartsComponent !== "undefined") {
    ChartsComponent.renderLineChart("chart-timeline", d.evolucionTemporal, 6);
  }

  // Medición antes/después
  var med = d.medicion;
  setText("intervencion-label", "Intervención: " + med.intervencion);
  setText("pre-label",          med.pre.label);
  setText("pre-valor",          med.pre.valor);
  setText("pre-rango",          med.pre.rango);
  setText("post-label",         med.post.label);
  setText("post-valor",         med.post.valor);
  setText("post-rango",         med.post.rango);
  setText("cambio-valor",       med.cambioImpacto);
  setText("cambio-estado",      med.estado);

  // Recomendación
  var rec = d.recomendacion;
  setText("rec-que",       rec.quePropone);
  setText("rec-porque",    rec.porQue);
  setText("rec-impacto",   rec.impactoEsperado);
  setText("rec-colectivo", rec.colectivoObjetivo);

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
