// js/data/pat-002-data.js
// Datos completos del detalle PAT-002

const PAT002_DATA = {

  id: "pat-002",
  nombre: "Reincorporación frágil tras IT larga",
  categoria: "reincorp",
  criticidad: "critico",
  tendencia: "estable",
  confianza: 80,

  resumen: "Patrón detectado afectando a 85 personas con impacto de 1,215,660 EUR. Confianza: 80%.",

  // ── KPIs ─────────────────────────────────────────────────────
  kpis: {
    impactoEconomico:      1215660,
    impactoEconomicoLabel: "1.215.660 €",
    personas:              85,
    variables:             0,
    confianza:             "80%"
  },

  // ── Impacto económico desglose ───────────────────────────────
  impactoDesglose: [
    { concepto: "Costes directos",   porcentaje: 40.9, importe: 497200, importeLabel: "497.200 €"  },
    { concepto: "Costes indirectos", porcentaje: 18.0, importe: 218498, importeLabel: "218.498 €"  },
    { concepto: "Sustituciones",     porcentaje: 16.2, importe: 197510, importeLabel: "197.510 €"  },
    { concepto: "Overtime",          porcentaje: 11.9, importe: 144278, importeLabel: "144.278 €"  },
    { concepto: "Pérdida operativa", porcentaje: 13.0, importe: 158173, importeLabel: "158.173 €"  }
  ],

  // ── Localización del impacto ─────────────────────────────────
  localizacion: {
    centrosAfectados:    [],
    turnosAfectados:     [],
    perfilesPuesto:      ["Operario de línea", "Técnico mantenimiento", "Almacenero"],
    equiposResponsables: ["Equipo Producción A", "Equipo Logística B"]
  },

  // ── Evolución temporal (12 meses 2025) ───────────────────────
  evolucionTemporal: {
    meses: [
      "2025-01","2025-02","2025-03","2025-04","2025-05","2025-06",
      "2025-07","2025-08","2025-09","2025-10","2025-11","2025-12"
    ],
    tasa: [0.4, 0.6, 0.8, 1.2, 1.6, 2.1, 2.6, 2.3, 2.0, 1.7, 1.4, 1.1]
  },

  // ── Medición antes/después ───────────────────────────────────
  medicion: {
    intervencion: "2025-07-02",
    pre: {
      label: "Período Pre",
      valor: "8%",
      rango: "2025-01-01 – 2025-07-01"
    },
    post: {
      label: "Período Post",
      valor: "4.4%",
      rango: "2025-07-02 – 2025-12-31"
    },
    cambioImpacto: "-24.4%",
    estado:        "Estabilización"
  },

  // ── Recomendación de intervención ───────────────────────────
  recomendacion: {
    quePropone:        "Seguimiento individualizado de las activaciones y verificación con la mutua/RRHH.",
    porQue:            "Este patrón afecta a 85 personas con un impacto de 1,215,660 EUR y riesgo operativo muy alto. La tendencia es estable.",
    impactoEsperado:   "292.077 EUR en 12 meses",
    colectivoObjetivo: "85 personas en Transversal"
  },

  // ── Personas identificadas ───────────────────────────────────
  personas: {
    total:            85,
    centrosAfectados: 0,
    listado:          []
  },

  // ── Consultor de patrón ──────────────────────────────────────
  consultorContextos: ["RRHH", "Finanzas", "Dirección", "Operaciones"],
  consultorPreguntas: [
    "¿Qué acciones de RRHH se recomiendan para este patrón?",
    "¿Qué perfil de empleado es más afectado?"
  ]
};
