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
    { concepto: "Costes directos",   porcentaje: 40.9, importe: 497200, importeLabel: "497.200 €",  tooltip: "Salarios, cotizaciones y complementos IT pagados durante la baja. El coste más visible y el primero en impactar la cuenta de resultados." },
    { concepto: "Costes indirectos", porcentaje: 18.0, importe: 218498, importeLabel: "218.498 €",  tooltip: "Pérdida de productividad y carga administrativa generada por la ausencia. Suelen subestimarse pero acumulan casi 1 de cada 5 euros del impacto total." },
    { concepto: "Sustituciones",     porcentaje: 16.2, importe: 197510, importeLabel: "197.510 €",  tooltip: "Coste de cubrir el puesto vacante con personal temporal. Incluye selección, onboarding y diferencial salarial del sustituto." },
    { concepto: "Overtime",          porcentaje: 11.9, importe: 144278, importeLabel: "144.278 €",  tooltip: "Horas extra generadas en el equipo para absorber la carga del ausente. Doble impacto: sobrecoste directo y riesgo de fatiga en el equipo cubridor." },
    { concepto: "Pérdida operativa", porcentaje: 13.0, importe: 158173, importeLabel: "158.173 €",  tooltip: "Reducción de capacidad productiva no compensable con sustitución. Afecta directamente al nivel de servicio o a la producción del periodo." }
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
    metricas: [
      {
        key: "tasa", label: "Tasa",
        valores: [0.4, 0.6, 0.8, 1.2, 1.6, 2.1, 2.6, 2.3, 2.0, 1.7, 1.4, 1.1],
        chips: [
          { label: "Variación período", value: "+175%",        sentiment: "negative" },
          { label: "Pico máximo",       value: "2,6% · jul",   sentiment: "neutral"  },
          { label: "Tendencia actual",  value: "Bajista",       sentiment: "positive" }
        ],
        narrativa: "La tasa escala de 0,4% en enero hasta un pico de 2,6% en julio — multiplicándose por 6,5 en solo 7 meses. Desde la intervención el descenso es sostenido, pero el nivel actual de 1,1% sigue siendo un 175% superior al inicio del período. Sin acción adicional en la cohorte restante, la estacionalidad apunta a un repunte en el primer trimestre."
      },
      {
        key: "coste", label: "Coste",
        valores: [48, 72, 96, 144, 192, 253, 312, 276, 241, 204, 168, 132],
        chips: [
          { label: "Coste acumulado",   value: "2.138.000 €",  sentiment: "negative" },
          { label: "Mes más costoso",   value: "312K€ · jul",  sentiment: "neutral"  },
          { label: "Ahorro vs pico",    value: "−180K€/mes",   sentiment: "positive" }
        ],
        narrativa: "El coste mensual del patrón se triplicó entre enero y julio, alcanzando 312.000 € en el peor mes. El ahorro acumulado desde la intervención asciende a 540.000 € teóricos. El ritmo actual de 132.000 €/mes equivale a 1,58M€ anualizados si no se actúa sobre el colectivo restante."
      },
      {
        key: "incidencia", label: "Incidencia",
        valores: [12, 18, 24, 36, 48, 63, 78, 70, 61, 52, 43, 34],
        chips: [
          { label: "Pico de incidencia", value: "78 casos · jul", sentiment: "neutral"  },
          { label: "Casos actuales",     value: "34 casos",        sentiment: "negative" },
          { label: "Reducción vs pico",  value: "−56%",            sentiment: "positive" }
        ],
        narrativa: "La incidencia pasó de 12 casos en enero a 78 en julio — un incremento del 550% en 7 meses. La intervención ha reducido la incidencia activa un 56% desde el pico. Aun así, 34 personas siguen activas en el patrón — el 44% del máximo histórico — lo que mantiene el riesgo sistémico por encima del umbral de alerta."
      },
      {
        key: "dias", label: "Días",
        valores: [143, 214, 286, 428, 571, 750, 928, 833, 726, 619, 512, 405],
        chips: [
          { label: "Días acum. 2025",    value: "6.415 días",   sentiment: "negative" },
          { label: "Pico mensual",       value: "928 · jul",    sentiment: "neutral"  },
          { label: "FTE perdido equiv.", value: "4,1 FTE/año",  sentiment: "negative" }
        ],
        narrativa: "El patrón ha generado 6.415 días de ausencia en 2025, equivalentes a perder 4,1 FTE de forma permanente durante un año completo. Julio concentró el 14,5% del total anual. Con un coste estimado de 333 €/día para este perfil, cada mes de inacción suma más de 134.000 € en impacto directo."
      },
      {
        key: "duracion", label: "Duración",
        valores: [24, 27, 31, 35, 38, 42, 46, 43, 40, 37, 34, 31],
        chips: [
          { label: "Duración media actual", value: "31 días",       sentiment: "negative" },
          { label: "Vs media compañía",     value: "+12 días",       sentiment: "negative" },
          { label: "Pico máximo",           value: "46 días · jul",  sentiment: "neutral"  }
        ],
        narrativa: "La duración media de los episodios es de 31 días — un 63% superior a la media de la compañía (19 días). Los episodios más largos disparan el coste de sustitución y reducen la probabilidad de reincorporación exitosa. La reducción desde el pico de julio es positiva, pero el nivel actual sigue muy por encima del objetivo de 20 días."
      },
      {
        key: "bradford", label: "Bradford",
        valores: [124, 187, 248, 372, 496, 650, 806, 722, 629, 536, 443, 350],
        chips: [
          { label: "Factor Bradford medio", value: "697 puntos",   sentiment: "negative" },
          { label: "Personas > 900 pts",    value: "23 personas",  sentiment: "negative" },
          { label: "Vs umbral crítico",     value: "+337 pts",     sentiment: "negative" }
        ],
        narrativa: "El Factor Bradford medio del colectivo es de 697 puntos — un 94% por encima del umbral de alerta estándar (360 pts). 23 personas superan los 900 puntos, nivel considerado crítico en la mayoría de marcos de gestión del absentismo. Reducir la frecuencia de episodios cortos en este colectivo podría bajar el indicador por debajo del umbral en menos de 6 meses con intervención focalizada."
      }
    ]
  },

  // ── Medición antes/después ───────────────────────────────────
  medicion: {
    intervencion: "2025-07-02",
    pre: {
      label:       "Período Pre",
      valor:       "8%",
      pct:         8,
      rango:       "2025-01-01 – 2025-07-01",
      descripcion: "1 de cada 12 reincorporaciones derivó en nueva baja — nivel de alerta que activó la revisión del protocolo de vuelta al trabajo"
    },
    post: {
      label:       "Período Post",
      valor:       "4,4%",
      pct:         4.4,
      rango:       "2025-07-02 – 2025-12-31",
      descripcion: "Reducción sostenida tras intervención — nivel más bajo registrado en los 12 meses analizados"
    },
    cambioImpacto:      "−24,4%",
    estado:             "Estabilización",
    importeEvitado:     "≈ 292.077 € evitados",
    cambioDescripcion:  "Reducir la tasa del 8% al 4,4% equivale a evitar 36 nuevas bajas en el período. Con un coste medio de 14.300 € por episodio no gestionado, el ahorro estimado en 12 meses es de 292.077 € — sin contar el impacto en productividad ni sustituciones."
  },

  // ── Recomendación de intervención ───────────────────────────
  recomendacion: {
    quePropone:        "Seguimiento individualizado de las activaciones activas y verificación del estado real con la mutua y RRHH, priorizando por nivel de riesgo.",
    porQue:            "85 personas con señal activa, impacto de 1.215.660 € y riesgo de nueva baja del 84,7%. Cada reincorporación no gestionada cuesta de media 14.300 €.",
    impactoEsperado:   "≈ 292.077 € evitados en 12 meses",
    colectivoObjetivo: "85 personas · Colectivo transversal",
    responsable:       "RRHH + Manager directo",
    plazo:             "Primeras 2 semanas tras activación",
    pasos: [
      {
        titulo:      "Identificar y priorizar activaciones",
        descripcion: "Revisar el listado de personas con señal activa y ordenarlas por riesgo. Priorizar las que combinan IT reciente con nómina incompleta en los últimos 30 días."
      },
      {
        titulo:      "Contactar con la mutua y verificar situación",
        descripcion: "Solicitar informe de situación clínica y previsión de alta. Verificar que el parte médico y los datos de nómina son coherentes entre sí."
      },
      {
        titulo:      "Programar entrevista de reincorporación",
        descripcion: "Coordinar con el manager directo una reunión de acogida antes del regreso. Acordar adaptaciones temporales si procede y fijar seguimiento a los 30 días."
      }
    ]
  },

  // ── Evidencia técnica ───────────────────────────────────────
  evidenciaTecnica: {
    poblacion:    "317 empleados en perímetro de análisis",
    periodo:      "Enero 2025 – Diciembre 2025 (12 meses)",
    consistencia: "El patrón se replica en 4 de 6 períodos analizados",
    confianza:    "Confianza del 80% — se recomienda contrastar con experto de dominio antes de tomar decisiones individuales",
    trazabilidad: "Cada activación es trazable a su fuente original. Los umbrales y fuentes son auditados mensualmente para garantizar la calidad del dato.",
    variables: [
      "Salario base del mes",
      "FTE mensual",
      "Días de IT (90d previos)",
      "Conceptos IT en nómina",
      "Días de absentismo (90d previos)"
    ],
    fuentes: [
      "Sistema de nómina",
      "Plantilla (FTE mensual)",
      "Registros de absentismo"
    ],
    advertencias: [
      "Los valores observados pueden variar con la incorporación de nuevos datos al sistema.",
      "Una activación indica una señal estadística, no una certeza — no debe usarse como único criterio de decisión sobre una persona concreta."
    ]
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

  // ── Identificación del patrón ────────────────────────────────
  deteccion:        "12 ene 2024",
  ultimaAparicion:  "mayo 2025",
  apariciones:      255,
  personasUnicas:   119,
  solidezEvidencia: "Alta",

  // ── Descripción narrativa ─────────────────────────────────────
  descripcionPatron: {
    lead:   "La baja larga no es el patrón. El patrón aparece cuando la vuelta al puesto no termina de estabilizarse.",
    cuerpo: "Este patrón se detecta cuando una persona vuelve de una IT larga y, en los días o semanas posteriores, registra una nueva ausencia relevante. La plataforma lo llama «reincorporación frágil» porque en el histórico de la compañía esta secuencia se ha repetido más de lo esperado y se ha asociado a más absentismo posterior."
  },

  // ── Impacto en la empresa (4 tarjetas) ────────────────────────
  impactoEmpresa: [
    { titulo: "Cobertura difícil",   cuerpo: "Afecta a equipos ajustados donde sustituir lleva tiempo." },
    { titulo: "Puestos críticos",    cuerpo: "Puestos con curva de aprendizaje alta o difícil sustitución." },
    { titulo: "Impacto inmediato",   cuerpo: "Una nueva ausencia obliga a reorganizar turnos o carga el mismo día." },
    { titulo: "Efecto en el equipo", cuerpo: "Aumenta la carga y el riesgo de nuevas incidencias en el resto del equipo." }
  ],

  // ── Distribución por centros ──────────────────────────────────
  centrosDistribucion: [
    { nombre: "Madrid Chamartín",         pct: 28, tendencia: "subida",  variacion: "+12%" },
    { nombre: "Barcelona Sants",          pct: 21, tendencia: "bajada",  variacion: "-8%"  },
    { nombre: "Sevilla Santa Justa",      pct: 16, tendencia: "estable", variacion: "0%"   },
    { nombre: "Valencia Joaquín Sorolla", pct: 12, tendencia: "subida",  variacion: "+5%"  },
    { nombre: "Otros centros",            pct: 23, tendencia: "bajada",  variacion: "-4%"  }
  ],

  // ── Por qué importa ──────────────────────────────────────────
  porQueImporta: [
    {
      titulo:      "Riesgo de reincidencia en baja",
      descripcion: "La reincorporación frágil aumenta un 84,7% las probabilidades de volver a baja en los próximos dos meses.",
      tipo:        "riesgo"
    },
    {
      titulo:      "Presión en el equipo",
      descripcion: "La baja productividad por salario reducido afecta al rendimiento del área.",
      tipo:        "equipo"
    },
    {
      titulo:      "Coste oculto de reincorporación",
      descripcion: "Se pagan salarios reducidos por debajo del 66,7% sin justificación clara de productividad.",
      tipo:        "coste"
    }
  ],

  // ── Cómo se ha detectado ────────────────────────────────────
  comoDetectado: {
    fuente:       "Nómina: 'Salario Base' e IT; Absentismo: días de los 90 días previos.",
    periodo:      "Ejercicio 2025 (último año natural completo)",
    solapamiento: "Retén/disponibilidad en persona con IT activa (71 empleados en común) · 14 solo en este patrón",
    lecturaP:     "Es una señal sobre el dato real (correlación), no una causa probada. Conviene validarla con RRHH/mutua antes de actuar."
  },

  // ── Listado de personas afectadas ───────────────────────────
  personasListado: [
    { id: "90061366", centro: "Guerinda",                         turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 43, antiguedad: 19.5, episodios: 7, diasBaja: 267, riesgo: "critico" },
    { id: "90140956", centro: "Alta Tensión Levante",             turno: "Retén/Guardia", categoria: "Oficial de Campo",   edad: 35, antiguedad:  9.3, episodios: 3, diasBaja: 263, riesgo: "critico" },
    { id: "90183117", centro: "Made Este",                        turno: "Retén/Guardia", categoria: "Oficial de Campo",   edad: 41, antiguedad:  7.2, episodios: 4, diasBaja: 258, riesgo: "critico" },
    { id: "90176107", centro: "Burgos",                           turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 38, antiguedad:  3.2, episodios: 5, diasBaja: 224, riesgo: "alto"    },
    { id: "90061419", centro: "Ingeniería Optimización&Control",  turno: "Partido",       categoria: "Administrativo",     edad: 41, antiguedad: 17.5, episodios: 3, diasBaja: 167, riesgo: "critico" },
    { id: "90034807", centro: "Alta Tensión Centro-sur",          turno: "Retén/Guardia", categoria: "Jefe de Base",       edad: 37, antiguedad:  8.7, episodios: 2, diasBaja: 165, riesgo: "medio"   },
    { id: "90035607", centro: "Ingeniería Optimización&Control",  turno: "Mañana",        categoria: "Técnico",            edad: 42, antiguedad: 18.1, episodios: 2, diasBaja: 143, riesgo: "critico" },
    { id: "90140597", centro: "Bonus Coruña",                     turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 34, antiguedad:  9.3, episodios: 2, diasBaja: 143, riesgo: "critico" },
    { id: "90143489", centro: "Alta Tensión Norte",               turno: "Noche",         categoria: "Oficial de Campo",   edad: 44, antiguedad:  9.1, episodios: 5, diasBaja: 141, riesgo: "alto"    },
    { id: "90061345", centro: "Falces",                           turno: "Noche",         categoria: "Oficial de Campo",   edad: 40, antiguedad: 18.5, episodios: 3, diasBaja: 141, riesgo: "medio"   },
    { id: "50054849", centro: "Burgos",                           turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 28, antiguedad:  3.3, episodios: 2, diasBaja: 138, riesgo: "alto"    },
    { id: "90155007", centro: "Zona 10-12",                       turno: "Retén/Guardia", categoria: "Oficial de Campo",   edad: 40, antiguedad:  7.9, episodios: 5, diasBaja: 135, riesgo: "critico" },
    { id: "90181461", centro: "Made Centro",                      turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 37, antiguedad:  7.3, episodios: 5, diasBaja: 127, riesgo: "critico" },
    { id: "90137191", centro: "Made oeste",                       turno: "Noche",         categoria: "Oficial de Campo",   edad: 39, antiguedad:  9.5, episodios: 3, diasBaja: 125, riesgo: "alto"    },
    { id: "90061340", centro: "Sos",                              turno: "Retén/Guardia", categoria: "Oficial de Campo",   edad: 40, antiguedad: 16.8, episodios: 5, diasBaja: 101, riesgo: "critico" },
    { id: "90093604", centro: "Ingeniería Global",                turno: "Retén/Guardia", categoria: "Técnico",            edad: 38, antiguedad: 17.4, episodios: 5, diasBaja:  99, riesgo: "alto"    },
    { id: "90173616", centro: "Codes",                            turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 42, antiguedad:  7.7, episodios: 7, diasBaja:  98, riesgo: "critico" },
    { id: "90174565", centro: "Perdón",                           turno: "Noche",         categoria: "Operario de Planta", edad: 31, antiguedad:  6.7, episodios: 3, diasBaja:  92, riesgo: "critico" },
    { id: "90115285", centro: "Torviscal",                        turno: "Retén/Guardia", categoria: "Operario de Planta", edad: 47, antiguedad: 11.2, episodios: 4, diasBaja:  77, riesgo: "critico" },
    { id: "90061321", centro: "Alaiz",                            turno: "Retén/Guardia", categoria: "Oficial de Campo",   edad: 48, antiguedad: 27.1, episodios: 3, diasBaja:  71, riesgo: "alto"    }
  ],

  // ── Cómo leer este patrón ────────────────────────────────────
  comoLeer: {
    items: [
      {
        label: "Qué lo activa",
        valor: "Trabaja a jornada completa (≥95%), su salario base del mes sigue por debajo del 66,7% de lo habitual y venía de una baja (IT o accidente) de 15 días o más en los 90 días anteriores.",
        tipo:  "texto"
      },
      {
        label:       "Riesgo a 60 días",
        valor:       "84,7%",
        descripcion: "% de empleados activados con ≥60 días de absentismo en el periodo analizado.",
        tipo:        "metrica"
      },
      {
        label:       "Coste directo",
        valor:       "1.215.660,0 €",
        descripcion: "Σ (días de absentismo del empleado en periodo × salario diario real = salario bruto / 220).",
        tipo:        "metrica"
      },
      {
        tipo:  "metrica-par",
        items: [
          { label: "Media por activación", valor: "43,5 días" },
          { label: "Última activación",    valor: "dic 2025"  }
        ]
      },
      {
        label: "Lectura",
        valor: "Identificar reincorporaciones tras bajas largas (15+ días) con salario base inferior al 66,7% de lo habitual.",
        tipo:  "texto"
      }
    ]
  },

  // ── Fórmula visual ────────────────────────────────────────────
  formulaSenal: {
    condiciones: [
      { titulo: "IT larga previa",          subtitulo: "Baja ≥ 30 días" },
      { titulo: "Reincorporación reciente", subtitulo: "Últimos 15 días" },
      { titulo: "Nueva ausencia posterior", subtitulo: "≤ 60 días después" }
    ],
    resultado: "Reincorporación frágil"
  },

  // ── Evidencia histórica (6 meses) ─────────────────────────────
  evidenciaHistorica: {
    meses:       ["dic 24", "ene 25", "feb 25", "mar 25", "abr 25", "may 25"],
    apariciones: [18, 32, 21, 41, 17, 36],
    riesgo60d:   [60, 72, 56, 84, 44, 86],
    resumen:     "4 de los últimos 6 meses mostraron el patrón.",
    mediaRiesgo: "84,7%",
    diferencial: "+31,2 pp por encima de la media general (53,5%)"
  },

  // ── Distribución por colectivo / turno / antigüedad ───────────
  distribucionPor: {
    colectivo: [
      { nombre: "Operación a bordo", pct: 38 },
      { nombre: "Talleres",          pct: 27 },
      { nombre: "Estaciones",        pct: 18 },
      { nombre: "Otros",             pct: 17 }
    ],
    turno: [
      { nombre: "Nocturno", pct: 42 },
      { nombre: "Rotativo", pct: 36 },
      { nombre: "Mañana",   pct: 14 },
      { nombre: "Tarde",    pct:  8 }
    ],
    antiguedad: [
      { nombre: "0–2 años",  pct: 34 },
      { nombre: "2–5 años",  pct: 29 },
      { nombre: "5–10 años", pct: 20 },
      { nombre: "+10 años",  pct: 17 }
    ]
  },

  // ── Datos que mejorarían la lectura ───────────────────────────
  datosQueMejorarian: [
    { fuente: "Mutua",       descripcion: "Permitiría distinguir recaídas, duración prevista, motivos repetidos y posibles cronificaciones." },
    { fuente: "Turnos",      descripcion: "Ayudaría a ver si la reincorporación coincide con noches, descansos insuficientes o cambios exigentes." },
    { fuente: "Organigrama", descripcion: "Mostraría concentración por equipo, mando, dependencia operativa o tamaño de grupo." },
    { fuente: "Operaciones", descripcion: "Conectaría el patrón con carga real de trabajo, picos de actividad, incidencias o falta de cobertura." }
  ],

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
