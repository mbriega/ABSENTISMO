// js/data/patrones-data.js
// Datos de los 18 patrones detectados

const PATRONES_DATA = {

  // ── Análisis IA ──────────────────────────────────────────────
  aiAnalysis: [
    {
      tipo: "critico",
      titulo: "Patrón más crítico del catálogo",
      texto: "Reincorporación frágil tras IT larga con el riesgo más alto detectado: 84,7% de nueva ausencia en 60 días, 85 empleados afectados y 1.215.660 € de coste directo observado.",
      metricas: ["84,7% riesgo", "85 personas", "1,2M€ coste"]
    },
    {
      tipo: "dato",
      titulo: "Segundo patrón por coste",
      texto: "IT activa con salario base muy reducido: 102 empleados afectados, riesgo del 52,9% y 1.159.840 € de coste directo."
    },
    {
      tipo: "dato",
      titulo: "Mayor volumen de activaciones",
      texto: "Retén/disponibilidad con IT activa: 251 empleados, 796 activaciones y 1.420.660 € de coste con riesgo moderado del 24,7%."
    },
    {
      tipo: "dato",
      titulo: "Focos provinciales",
      texto: "Valencia (63,6% riesgo, 174K€) y Lugo (44,4% riesgo, 176K€) concentran el absentismo por IT con nómina incompleta."
    },
    {
      tipo: "dato",
      titulo: "Focos por centro",
      texto: "Torviscal (46,2% riesgo) y Bonus Pontevedra (25%) son los centros con mayor riesgo de absentismo activo combinado con IT."
    },
    {
      tipo: "dato",
      titulo: "Categorías profesionales",
      texto: "W96-OFICIAL GC8 y W97-OFICIAL GC9 concentran 189 empleados con IT activa y costes de 675K€ y 295K€ respectivamente."
    },
    {
      tipo: "accion",
      titulo: "Acción recomendada",
      texto: "Priorizar la gestión de reincorporaciones tras IT larga y salarios reducidos en IT activa, por su alto riesgo y coste, antes que patrones con menor impacto económico."
    }
  ],

  // ── KPIs resumen ─────────────────────────────────────────────
  kpis: {
    detectados:   18,
    criticos:     1,
    mayorImpacto: { nombre: "Retén/disponibilidad", coste: "1.420.660 €" },
    impactoTotal: "7.143.297 €",
    numPatrones:  18
  },

  // ── Filtros disponibles ───────────────────────────────────────
  filtros: ["Todos", "reincorp", "it", "prov", "cat", "reten", "dietas", "km", "he", "resp", "centro"],

  // ── Tabla de 18 patrones ──────────────────────────────────────
  patrones: [
    {
      id: "pat-002",
      nombre: "Reincorporación frágil tras IT larga",
      descripcionHumana: "La persona viene de una IT larga y su nómina de ese mes no está completa. La combinación indica una reincorporación frágil con el riesgo más alto del catálogo: 84,7% de nueva ausencia en 60 días.",
      categoria: "reincorp",
      definicion: "FTE ≥ 0,95 + salario base del mes < 66,7% del habitual + IT/accidente ≥ 15 días en los 90 días previos.",
      fuente: "Nómina: 'Salario Base' e IT; Absentismo: días de los 90 días previos.",
      activaciones: 255,
      empleados: 85,
      riesgo60d: "84.7%",
      diasAsoc: "11.099",
      media: "43.5 d",
      costeDirecto: "1.215.660 €",
      criticidad: "critico",
      detalle: "pat-002.html"
    },
    {
      id: "pat-003",
      nombre: "IT activa con salario base muy reducido",
      descripcionHumana: "La persona está de baja médica activa y su nómina ese mes refleja un salario muy por debajo de su nivel habitual. El dato de nómina da visibilidad real al estado prolongado de la baja.",
      categoria: "it",
      definicion: "FTE ≥ 0,95 + salario base del mes < 50% del habitual de la persona + concepto IT > 0 €.",
      fuente: "Nómina: 'Salario Base' y conceptos 'Prestaciones/Complementos IT'; Plantilla: FTE mensual.",
      activaciones: 352,
      empleados: 102,
      riesgo60d: "52.9%",
      diasAsoc: "9.889",
      media: "28.1 d",
      costeDirecto: "1.159.840 €",
      criticidad: "alto",
      detalle: "pat-003.html"
    },
    {
      id: "pat-010",
      nombre: "Bolsa Valencia con IT y nómina incompleta",
      descripcionHumana: "Personas en Valencia con IT activa y nómina incompleta ese mes. La geolocalización del patrón identifica una bolsa de absentismo concentrada con el riesgo provincial más alto del catálogo.",
      categoria: "prov",
      definicion: "Provincia = Valencia + salario base del mes < 66,7% del habitual + concepto IT > 0 €.",
      fuente: "Plantilla: 'Provincia'; Nómina: 'Salario Base' e IT.",
      activaciones: 47,
      empleados: 11,
      riesgo60d: "63.6%",
      diasAsoc: "1.370",
      media: "29.1 d",
      costeDirecto: "174.512 €",
      criticidad: "alto",
      detalle: "pat-010.html"
    },
    {
      id: "pat-006",
      nombre: "Bolsa Navarra con IT y nómina incompleta",
      descripcionHumana: "Personas en Navarra con IT activa y nómina incompleta. La combinación de localización geográfica, baja médica y nómina rota identifica el foco provincial de absentismo.",
      categoria: "prov",
      definicion: "Provincia = Navarra + salario base del mes < 66,7% del habitual + concepto IT > 0 €.",
      fuente: "Plantilla: 'Provincia'; Nómina: 'Salario Base' e IT.",
      activaciones: 118,
      empleados: 43,
      riesgo60d: "34.9%",
      diasAsoc: "3.324",
      media: "28.2 d",
      costeDirecto: "420.455 €",
      criticidad: "medio",
      detalle: "pat-006.html"
    },
    {
      id: "pat-009",
      nombre: "Bolsa Lugo con IT y nómina incompleta",
      descripcionHumana: "Personas en Lugo con IT activa y nómina incompleta. El patrón localiza una concentración de bajas con nómina rota y un riesgo del 44,4% de nueva ausencia en 60 días.",
      categoria: "prov",
      definicion: "Provincia = Lugo + salario base del mes < 66,7% del habitual + concepto IT > 0 €.",
      fuente: "Plantilla: 'Provincia'; Nómina: 'Salario Base' e IT.",
      activaciones: 78,
      empleados: 18,
      riesgo60d: "44.4%",
      diasAsoc: "1.546",
      media: "19.8 d",
      costeDirecto: "176.250 €",
      criticidad: "medio",
      detalle: "pat-009.html"
    },
    {
      id: "pat-004",
      nombre: "W96-OFICIAL GC8 con jornada completa e IT activa",
      descripcionHumana: "La categoría profesional W96-OFICIAL GC8 actúa como segmentador: identifica que este colectivo específico concentra 119 personas con baja activa a jornada completa.",
      categoria: "cat",
      definicion: "Categoría = W96-OFICIAL GC8 + FTE ≥ 0,95 + concepto IT > 0 €.",
      fuente: "Plantilla: 'Categoría' y FTE; Nómina: IT.",
      activaciones: 404,
      empleados: 119,
      riesgo60d: "29.4%",
      diasAsoc: "6.438",
      media: "15.9 d",
      costeDirecto: "675.326 €",
      criticidad: "bajo",
      detalle: "pat-004.html"
    },
    {
      id: "pat-001",
      nombre: "Retén/disponibilidad en persona con IT activa",
      descripcionHumana: "Persona con IT activa que cobra retén, guardia o disponibilidad en ese mismo mes. La coexistencia de baja médica y conceptos de disponibilidad en nómina es la señal que activa el patrón.",
      categoria: "reten",
      definicion: "FTE ≥ 0,95 + retén/guardia/disponibilidad en nómina > 0 € + concepto IT > 0 €.",
      fuente: "Nómina: 'Plus Disponibilidad/Guardia' e IT; Plantilla: FTE.",
      activaciones: 796,
      empleados: 251,
      riesgo60d: "24.7%",
      diasAsoc: "12.522",
      media: "15.7 d",
      costeDirecto: "1.420.660 €",
      criticidad: "bajo",
      detalle: "pat-001.html"
    },
    {
      id: "pat-005",
      nombre: "Dietas/comida con IT activa",
      descripcionHumana: "Persona con IT activa y dietas o manutención cobradas ese mismo mes. La coexistencia de baja médica con conceptos de desplazamiento laboral activo es la señal que detecta el patrón.",
      categoria: "dietas",
      definicion: "FTE ≥ 0,95 + dietas/comida en nómina > 0 € + concepto IT > 0 €.",
      fuente: "Nómina: 'Dietas/Comida' e IT; Plantilla: FTE.",
      activaciones: 194,
      empleados: 132,
      riesgo60d: "22%",
      diasAsoc: "5.608",
      media: "28.9 d",
      costeDirecto: "626.526 €",
      criticidad: "bajo",
      detalle: "pat-005.html"
    },
    {
      id: "pat-008",
      nombre: "W95-OFICIAL GC5 con jornada completa e IT activa",
      descripcionHumana: "La categoría W95-OFICIAL GC5 con jornada completa e IT activa localiza el absentismo por baja en este colectivo específico con 44 personas afectadas.",
      categoria: "cat",
      definicion: "Categoría = W95-OFICIAL GC5 + FTE ≥ 0,95 + concepto IT > 0 €.",
      fuente: "Plantilla: 'Categoría' y FTE; Nómina: IT.",
      activaciones: 129,
      empleados: 44,
      riesgo60d: "20.5%",
      diasAsoc: "2.116",
      media: "16.4 d",
      costeDirecto: "275.554 €",
      criticidad: "bajo",
      detalle: "pat-008.html"
    },
    {
      id: "pat-007",
      nombre: "W97-OFICIAL GC9 con jornada completa e IT activa",
      descripcionHumana: "La categoría GC9 concentra 70 personas con baja activa a jornada completa. Riesgo moderado (15,7%) pero con 208 activaciones que generan 2.771 días de ausencia asociados.",
      categoria: "cat",
      definicion: "Categoría = W97-OFICIAL GC9 + FTE ≥ 0,95 + concepto IT > 0 €.",
      fuente: "Plantilla: 'Categoría' y FTE; Nómina: IT.",
      activaciones: 208,
      empleados: 70,
      riesgo60d: "15.7%",
      diasAsoc: "2.771",
      media: "13.3 d",
      costeDirecto: "295.407 €",
      criticidad: "bajo",
      detalle: "pat-007.html"
    },
    {
      id: "pat-011",
      nombre: "Desplazamientos/kilometraje con IT activa",
      descripcionHumana: "Persona con IT activa y kilómetros o desplazamientos cobrados ese mes. La señal detecta una posible anomalía entre la baja declarada y la actividad de desplazamiento registrada en nómina.",
      categoria: "km",
      definicion: "FTE ≥ 0,95 + desplazamientos/kilometraje en nómina > 0 € + concepto IT > 0 €.",
      fuente: "Nómina: 'Kilometraje/Desplazamientos' e IT; Plantilla: FTE.",
      activaciones: 49,
      empleados: 33,
      riesgo60d: "18.2%",
      diasAsoc: "1.529",
      media: "31.2 d",
      costeDirecto: "164.411 €",
      criticidad: "bajo",
      detalle: "pat-011.html"
    },
    {
      id: "pat-012",
      nombre: "Horas extra en mes con IT activa",
      descripcionHumana: "Persona con IT activa que genera horas extra o complementarias ese mismo mes. La coexistencia de baja médica y horas extra en nómina es la señal de anomalía que detecta el patrón.",
      categoria: "he",
      definicion: "FTE ≥ 0,95 + horas extra/complementarias en nómina > 0 € + concepto IT > 0 €.",
      fuente: "Nómina: 'Horas Extra/Complementarias' e IT; Plantilla: FTE.",
      activaciones: 44,
      empleados: 37,
      riesgo60d: "21.6%",
      diasAsoc: "1.565",
      media: "35.6 d",
      costeDirecto: "156.006 €",
      criticidad: "bajo",
      detalle: "pat-012.html"
    },
    {
      id: "pat-014",
      nombre: "Responsabilidad/jefatura con IT activa",
      descripcionHumana: "Persona con plus de responsabilidad o jefatura que entra en IT activa. Los mandos intermedios en baja generan un impacto adicional por la dependencia del equipo de su gestión directa.",
      categoria: "resp",
      definicion: "FTE ≥ 0,95 + responsabilidad/mando en nómina > 0 € + concepto IT > 0 €.",
      fuente: "Nómina: 'Plus Responsabilidad/Mando' e IT; Plantilla: FTE.",
      activaciones: 23,
      empleados: 12,
      riesgo60d: "41.7%",
      diasAsoc: "674",
      media: "29.3 d",
      costeDirecto: "87.902 €",
      criticidad: "medio",
      detalle: "pat-014.html"
    },
    {
      id: "pat-015",
      nombre: "Centro Torviscal con absentismo actual e IT activa",
      descripcionHumana: "El centro Torviscal concentra personas con absentismo activo e IT en el mismo mes. La localización por centro detecta focos geográficos de absentismo con el riesgo más alto entre los centros analizados.",
      categoria: "centro",
      definicion: "Centro = S135800013-Torviscal + absentismo del mes > 0 días + concepto IT > 0 €.",
      fuente: "Plantilla: 'Centro'; Absentismo: días del mes; Nómina: IT.",
      activaciones: 39,
      empleados: 13,
      riesgo60d: "46.2%",
      diasAsoc: "849",
      media: "21.8 d",
      costeDirecto: "76.908 €",
      criticidad: "medio",
      detalle: "pat-015.html"
    },
    {
      id: "pat-013",
      nombre: "Centro Bonus Pontevedra con absentismo actual e IT activa",
      descripcionHumana: "El centro Bonus Pontevedra muestra absentismo e IT activa combinados. El patrón identifica un foco local de absentismo dentro de ese centro específico con 16 personas afectadas.",
      categoria: "centro",
      definicion: "Centro = S135800033-Bonus Pontevedra + absentismo del mes > 0 días + concepto IT > 0 €.",
      fuente: "Plantilla: 'Centro'; Absentismo: días del mes; Nómina: IT.",
      activaciones: 45,
      empleados: 16,
      riesgo60d: "25%",
      diasAsoc: "953",
      media: "21.2 d",
      costeDirecto: "116.621 €",
      criticidad: "bajo",
      detalle: "pat-013.html"
    },
    {
      id: "pat-016",
      nombre: "WD1-TECNICO/A GC4 con jornada completa e IT activa",
      descripcionHumana: "Perfil técnico WD1-GC4 con jornada completa e IT activa. Colectivo pequeño (5 personas) pero con perfil especializado donde una ausencia prolongada tiene impacto operativo relevante.",
      categoria: "cat",
      definicion: "Categoría = WD1-TECNICO/A GC4 + FTE ≥ 0,95 + concepto IT > 0 €.",
      fuente: "Plantilla: 'Categoría' y FTE; Nómina: IT.",
      activaciones: 20,
      empleados: 5,
      riesgo60d: "20%",
      diasAsoc: "398",
      media: "19.9 d",
      costeDirecto: "75.379 €",
      criticidad: "bajo",
      detalle: "pat-016.html"
    },
    {
      id: "pat-017",
      nombre: "Bolsa Castellón con IT y nómina incompleta",
      descripcionHumana: "Personas en Castellón con IT activa y nómina incompleta. La bolsa es pequeña (8 personas) pero con señal de nómina rota que conviene monitorizar para evitar que crezca.",
      categoria: "prov",
      definicion: "Provincia = Castellón + salario base del mes < 66,7% del habitual + concepto IT > 0 €.",
      fuente: "Plantilla: 'Provincia'; Nómina: 'Salario Base' e IT.",
      activaciones: 26,
      empleados: 8,
      riesgo60d: "12.5%",
      diasAsoc: "278",
      media: "10.7 d",
      costeDirecto: "13.184 €",
      criticidad: "bajo",
      detalle: "pat-017.html"
    },
    {
      id: "pat-018",
      nombre: "Centro Zona 3 con absentismo actual e IT activa",
      descripcionHumana: "El centro Zona 3 muestra absentismo activo e IT combinados en el mismo mes. Patrón de seguimiento: colectivo pequeño (9 personas) con señal de foco local que merece monitorización.",
      categoria: "centro",
      definicion: "Centro = S135800035-Zona 3 + absentismo del mes > 0 días + concepto IT > 0 €.",
      fuente: "Plantilla: 'Centro'; Absentismo: días del mes; Nómina: IT.",
      activaciones: 24,
      empleados: 9,
      riesgo60d: "11.1%",
      diasAsoc: "405",
      media: "16.9 d",
      costeDirecto: "12.696 €",
      criticidad: "bajo",
      detalle: "pat-018.html"
    }
  ]
};
