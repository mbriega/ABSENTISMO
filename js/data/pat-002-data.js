// js/data/pat-002-data.js
// Datos completos del detalle PAT-002

const PAT002_DATA = {

  id: "pat-002",
  nombre: "Reincorporación frágil tras IT larga",
  categoria: "reincorp",
  criticidad: "critico",
  tendencia: "estable",
  confianza: 80,

  resumen: "La plataforma detectó que personas en reincorporación tras una IT larga, con nómina incompleta ese mes, tienen un riesgo histórico del 84,7% de nueva ausencia en los 60 días siguientes. Afecta a 85 personas y explica 1.215.660 € de coste observado.",

  // ── KPIs ─────────────────────────────────────────────────────
  kpis: {
    impactoEconomico:      1215660,
    impactoEconomicoLabel: "1.215.660 €",
    personas:              85,
    variables:             3,
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
    "¿Cómo debo gestionar la vuelta al trabajo de estas personas?",
    "¿Qué impacto tiene este patrón en el coste de sustituciones?",
    "¿En qué equipos o centros se concentra más este patrón?"
  ],

  // ── Señal clave ──────────────────────────────────────────────
  senalClave: {
    chips: [
      "FTE ≥ 0,95",
      "Salario base < 66,7% del habitual",
      "IT ≥ 15 días en los 90 d previos"
    ],
    resultado: "Reincorporación frágil"
  },

  // ── Condiciones exactas ──────────────────────────────────────
  condicionesExactas: [
    {
      condicion: "FTE ≥ 0,95",
      descripcion: "Persona a jornada completa o prácticamente completa. El patrón excluye contratos parciales y eventuales."
    },
    {
      condicion: "Salario base < 66,7% del habitual",
      descripcion: "La nómina de ese mes no refleja un mes ordinario completo: señal de baja o interrupción reciente. Se compara contra el propio historial de la persona."
    },
    {
      condicion: "IT/Accidente ≥ 15 días en los 90 días previos",
      descripcion: "La persona viene de una baja larga reciente. El patrón no se activa con ausencias cortas ni sin IT previa registrada."
    }
  ],

  // ── Qué significa / Qué no significa ────────────────────────
  queSignifica: [
    "La persona está trabajando, pero su presencia es frágil: viene de una IT larga y su nómina refleja que ese mes no fue completo.",
    "La señal no surge de un factor aislado, sino de la coincidencia de dos indicadores de fragilidad: reincorporación reciente y nómina incompleta.",
    "Históricamente, cuando aparece esta combinación, el riesgo de nueva ausencia en los 60 días siguientes es del 84,7% — el más alto del catálogo detectado."
  ],
  queNoSignifica: [
    "No es una acusación ni un ranking de empleados problemáticos. Es una señal de fragilidad que merece seguimiento.",
    "No predice el futuro de ninguna persona concreta: muestra lo que históricamente ocurrió en casos similares en esta compañía.",
    "No implica acción disciplinaria. El patrón sugiere acompañamiento y seguimiento con mutua, no sanción.",
    "No significa que toda reincorporación tras IT larga sea problemática: solo se activa cuando coinciden las tres condiciones simultáneamente."
  ],

  // ── Por qué importa en la operación real ────────────────────
  relevanciaEmpresa: {
    impactoOperativo:  "85 personas de jornada completa con señal activa generan 11.099 días de ausencia asociados. Cuando una persona clave recae, la cobertura es difícil de absorber a corto plazo.",
    materialidad:      "Con 1.215.660 € de coste observado, este es el patrón más crítico del catálogo. El coste medio por reincorporación no gestionada es de 14.300 €.",
    lecturaContextual: "El patrón aparece en operarios de línea, técnicos de mantenimiento y almaceneros: puestos donde una ausencia impacta directamente en producción y logística.",
    separacionRuido:   "No toda IT larga activa el patrón. Solo cuando la reincorporación coincide con nómina incompleta se dispara la señal, lo que reduce los falsos positivos."
  },

  // ── Solapamiento con otros patrones ─────────────────────────
  solapamiento: [
    {
      patron:      "IT activa con salario base muy reducido (PAT-003)",
      porcentaje:  34,
      descripcion: "Un 34% de las personas de este patrón también activan PAT-003. El coste no debe sumarse directamente entre ambos."
    },
    {
      patron:      "Bolsa Valencia con IT y nómina incompleta (PAT-010)",
      porcentaje:  12,
      descripcion: "Solapamiento geográfico: parte de las reincorporaciones frágiles se concentran en Valencia y también activan el patrón provincial."
    }
  ],

  // ── Lectura por perfil ───────────────────────────────────────
  audiencia: [
    {
      perfil:  "RRHH",
      lectura: "Revisar el protocolo de vuelta al trabajo y el seguimiento con la mutua en las 4-6 semanas post-reincorporación. 85 personas con señal activa pendientes de gestión."
    },
    {
      perfil:  "Operaciones",
      lectura: "Planificar cobertura preventiva en los equipos donde el patrón es más activo. El 84,7% de riesgo histórico implica que casi 9 de cada 10 activaciones registraron nueva ausencia."
    },
    {
      perfil:  "Finanzas",
      lectura: "1.215.660 € de coste directo observado. La intervención temprana puede reducir entre un 20-25% el impacto en 12 meses (estimación: 292.077 €)."
    }
  ]
};
