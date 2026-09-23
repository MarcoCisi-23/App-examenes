import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";
import { hashPassword } from "../lib/auth/password";
import { ORDEN_ESTUDIOS, type TipoEstudio } from "../lib/estudios/registry";
import { toJson } from "../lib/json";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_CUIT = "20345891239"; // 20-34589123-9
const DEMO_PASSWORD = "ExamenLaboral2024";

function fechaNacimientoDesdeEdad(edad: number): Date {
  const anioNacimiento = 2026 - edad;
  return new Date(`${anioNacimiento}-03-15T00:00:00.000Z`);
}

/** Fecha relativa a hoy, para que los lotes "vencidos"/"próximos a vencer" sigan
 * teniendo sentido sin importar cuándo se corra el seed. */
function diasDesdeHoy(dias: number): Date {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

interface TrabajadorSeed {
  dni: string;
  nombre: string;
  apellido: string;
  sexo: "M" | "F" | "X";
  edad: number;
  puesto: string;
  antiguedadAnios: number;
  factoresRiesgo: string[];
  estado: "PENDIENTE" | "EN_CURSO" | "COMPLETADO";
  turnoEtiqueta?: string;
  dictamen?: "APTO" | "APTO_CON_PREEXISTENCIAS" | "NO_APTO_TEMPORAL";
  observacionesMedicas?: string;
}

const datosEstudioCompleto: Record<TipoEstudio, Record<string, unknown>> = {
  CLINICO_GENERAL: {
    presionArterial: "120/80",
    frecuenciaCardiaca: 72,
    peso: 78,
    talla: 1.75,
    agudezaVisual: "10/10 (Ambos ojos)",
    auscultacion: "Normal - Buena mecánica vent. R1 y R2 normofonéticos",
  },
  AUDIOMETRIA: {
    oidoDerechoDb: 15,
    oidoIzquierdoDb: 18,
    observaciones: "Sin hallazgos patológicos.",
  },
  LABORATORIO_BIOQUIMICO: {
    fechaMuestra: "05/09/2026",
    archivoNombre: "Certificado_Firma_Digital.pdf",
    observaciones: "Valores dentro de parámetros normales.",
  },
  ESPIROMETRIA_RX: {
    resultado: "NORMAL",
    archivoNombre: "Informe_Rx_Torax.pdf",
    observaciones: "",
  },
};

async function crearAsignacion(
  trabajadorId: string,
  loteId: string,
  seed: TrabajadorSeed,
  evaluadorId: string,
) {
  const asignacion = await prisma.asignacionExamen.create({
    data: {
      loteId,
      trabajadorId,
      estado: seed.estado,
      dictamen: seed.dictamen,
      observacionesMedicas: seed.observacionesMedicas,
      turnoEtiqueta: seed.turnoEtiqueta,
      evaluadorId: seed.estado === "PENDIENTE" ? null : evaluadorId,
      completadoEn: seed.estado === "COMPLETADO" ? new Date() : null,
    },
  });

  for (const [index, tipo] of ORDEN_ESTUDIOS.entries()) {
    const estudioRequerido = await prisma.estudioRequerido.create({
      data: { asignacionId: asignacion.id, tipo, orden: index },
    });

    // Rodríguez (EN_CURSO) tiene solo el primer estudio cargado.
    const estudioCargado =
      seed.estado === "COMPLETADO" ||
      (seed.estado === "EN_CURSO" && index === 0);

    await prisma.estudioResultado.create({
      data: {
        estudioRequeridoId: estudioRequerido.id,
        estado: estudioCargado ? "CARGADO" : "PENDIENTE",
        datos: estudioCargado ? toJson(datosEstudioCompleto[tipo]) : null,
        completadoEn: estudioCargado ? new Date() : null,
      },
    });
  }

  return asignacion;
}

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.estudioResultado.deleteMany();
  await prisma.estudioRequerido.deleteMany();
  await prisma.asignacionExamen.deleteMany();
  await prisma.trabajador.deleteMany();
  await prisma.lote.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.evaluador.deleteMany();

  console.log("Creando evaluador demo...");
  const evaluador = await prisma.evaluador.create({
    data: {
      cuit: DEMO_CUIT,
      passwordHash: await hashPassword(DEMO_PASSWORD),
      nombre: "Marco",
      apellido: "Cisilino",
      especialidad: "Medicina Laboral y Salud Ocupacional",
      matriculaNacional: "MN 142.859",
      matriculaProvincial: "MP 45.221",
      cuitProfesional: "27324891024",
      centroMedico: "Sanidad Laboral Quilmes Centro",
    },
  });

  console.log("Creando empresas y lotes...");
  const techlog = await prisma.empresa.create({
    data: { cuit: "30714892019", razonSocial: "TechLog S.A.", rubro: "Logística Industrial" },
  });
  const loteTechlog = await prisma.lote.create({
    data: {
      codigo: "OP-2024-81",
      campaniaNombre: "Campaña Periódica 2024",
      empresaId: techlog.id,
      tipoExamen: "Periódico Anual Riesgo Físico / Químico",
      ubicacion: "Polo Químico Zárate",
      periodicidad: "ANUAL",
      fechaLimite: diasDesdeHoy(60),
      estado: "EN_CURSO",
    },
  });

  const pampeana = await prisma.empresa.create({
    data: { cuit: "30712345678", razonSocial: "Transportes Pampeana S.R.L.", rubro: "Transporte de Larga Distancia" },
  });
  const lotePampeana = await prisma.lote.create({
    data: {
      codigo: "OP-2024-94",
      campaniaNombre: "Campaña Periódica 2024",
      empresaId: pampeana.id,
      tipoExamen: "Periódico Auditivo y Psicotécnico (Larga Distancia)",
      ubicacion: "Base Operativa Sur",
      periodicidad: "ANUAL",
      fechaLimite: diasDesdeHoy(5),
      estado: "PRIORIDAD_ALTA",
    },
  });

  const construcciones = await prisma.empresa.create({
    data: { cuit: "30798765432", razonSocial: "Construcciones Del Plata - Obra Central", rubro: "Construcción" },
  });
  const loteConstrucciones = await prisma.lote.create({
    data: {
      codigo: "OP-2024-102",
      campaniaNombre: "Campaña Periódica 2024",
      empresaId: construcciones.id,
      tipoExamen: "Examen Biológico y Ergonómico (Posturas Forzadas)",
      ubicacion: "Av. Costanera 1420",
      periodicidad: "SEMESTRAL",
      fechaLimite: diasDesdeHoy(-10),
      estado: "PENDIENTE",
    },
  });

  const metalurgica = await prisma.empresa.create({
    data: { cuit: "30787654321", razonSocial: "Metalúrgica San Jorge", rubro: "Metalurgia" },
  });
  const loteMetalurgica = await prisma.lote.create({
    data: {
      codigo: "OP-2024-65",
      campaniaNombre: "Campaña Periódica 2024",
      empresaId: metalurgica.id,
      tipoExamen: "Monitoreo Semestral Ruido Industrial",
      ubicacion: "Parque Ind. Almirante Brown",
      periodicidad: "SEMESTRAL",
      fechaLimite: diasDesdeHoy(-30),
      estado: "FINALIZADO",
    },
  });

  console.log("Creando trabajadores y asignaciones...");

  const trabajadoresTechlog: TrabajadorSeed[] = [
    {
      dni: "34892110",
      nombre: "Marcos Hernán",
      apellido: "González",
      sexo: "M",
      edad: 38,
      puesto: "Operador Autoelevador",
      antiguedadAnios: 6,
      factoresRiesgo: ["Manejo de cargas", "Ruido industrial"],
      estado: "COMPLETADO",
      turnoEtiqueta: "Hoy 09:30 hs",
      dictamen: "APTO",
      observacionesMedicas: "Sin observaciones restrictivas para la tarea habitual.",
    },
    {
      dni: "38412905",
      nombre: "Rocío Belén",
      apellido: "Álvarez",
      sexo: "F",
      edad: 31,
      puesto: "Inspectora Control de Calidad",
      antiguedadAnios: 4,
      factoresRiesgo: ["Movimientos repetitivos", "Iluminación", "Bipedestación prolongada"],
      estado: "PENDIENTE",
      turnoEtiqueta: "Turno disponible ahora",
    },
    {
      dni: "29741002",
      nombre: "Carlos Alberto",
      apellido: "Benítez",
      sexo: "M",
      edad: 47,
      puesto: "Mantenimiento Mecánico",
      antiguedadAnios: 12,
      factoresRiesgo: ["Manejo de herramientas", "Posturas forzadas"],
      estado: "COMPLETADO",
      turnoEtiqueta: "Ayer 14:10 hs",
      dictamen: "APTO_CON_PREEXISTENCIAS",
      observacionesMedicas: "Apto con adecuaciones ergonómicas. Reevaluación en 6 meses.",
    },
    {
      dni: "41209873",
      nombre: "Lucía Valeria",
      apellido: "Fernández",
      sexo: "F",
      edad: 26,
      puesto: "Operaria Línea Envasado",
      antiguedadAnios: 2,
      factoresRiesgo: ["Movimientos repetitivos", "Bipedestación prolongada"],
      estado: "PENDIENTE",
      turnoEtiqueta: "Recepción confirmada",
    },
    {
      dni: "32551490",
      nombre: "Diego Martín",
      apellido: "Rodríguez",
      sexo: "M",
      edad: 41,
      puesto: "Soldador Calificado",
      antiguedadAnios: 9,
      factoresRiesgo: ["Humos de soldadura", "Radiación UV", "Ruido industrial"],
      estado: "EN_CURSO",
      turnoEtiqueta: "Box 4: Espirometría",
    },
    {
      dni: "36120044",
      nombre: "Valentina",
      apellido: "Suárez",
      sexo: "F",
      edad: 29,
      puesto: "Administrativa de Planta",
      antiguedadAnios: 3,
      factoresRiesgo: ["Trabajo prolongado en PC"],
      estado: "PENDIENTE",
    },
    {
      dni: "27890112",
      nombre: "Héctor Raúl",
      apellido: "Ibáñez",
      sexo: "M",
      edad: 52,
      puesto: "Supervisor de Depósito",
      antiguedadAnios: 18,
      factoresRiesgo: ["Manejo de cargas", "Ruido industrial"],
      estado: "COMPLETADO",
      turnoEtiqueta: "Hoy 08:15 hs",
      dictamen: "APTO",
      observacionesMedicas: "Sin observaciones restrictivas para la tarea habitual.",
    },
  ];

  const trabajadoresPampeana: TrabajadorSeed[] = [
    {
      dni: "30456789",
      nombre: "Jorge Luis",
      apellido: "Paredes",
      sexo: "M",
      edad: 44,
      puesto: "Chofer Larga Distancia",
      antiguedadAnios: 10,
      factoresRiesgo: ["Vibración de cuerpo entero", "Fatiga por manejo prolongado"],
      estado: "PENDIENTE",
      turnoEtiqueta: "Prioridad: cerca del vencimiento",
    },
    {
      dni: "33987654",
      nombre: "Natalia Soledad",
      apellido: "Cabrera",
      sexo: "F",
      edad: 36,
      puesto: "Despachante de Cargas",
      antiguedadAnios: 5,
      factoresRiesgo: ["Manejo de cargas"],
      estado: "PENDIENTE",
    },
    {
      dni: "31223344",
      nombre: "Ricardo Ariel",
      apellido: "Molina",
      sexo: "M",
      edad: 39,
      puesto: "Chofer Larga Distancia",
      antiguedadAnios: 7,
      factoresRiesgo: ["Vibración de cuerpo entero", "Ruido de cabina"],
      estado: "COMPLETADO",
      dictamen: "APTO",
      observacionesMedicas: "Apto para conducción de larga distancia.",
    },
    {
      dni: "35667788",
      nombre: "Patricia Ester",
      apellido: "Roldán",
      sexo: "F",
      edad: 48,
      puesto: "Administrativa de Tráfico",
      antiguedadAnios: 15,
      factoresRiesgo: ["Trabajo prolongado en PC"],
      estado: "PENDIENTE",
    },
    {
      dni: "29112233",
      nombre: "Sergio Damián",
      apellido: "Correa",
      sexo: "M",
      edad: 55,
      puesto: "Chofer Larga Distancia",
      antiguedadAnios: 20,
      factoresRiesgo: ["Vibración de cuerpo entero", "Fatiga por manejo prolongado"],
      estado: "EN_CURSO",
      turnoEtiqueta: "Box 2: Laboratorio",
    },
  ];

  const trabajadoresConstrucciones: TrabajadorSeed[] = [
    {
      dni: "37556677",
      nombre: "Emanuel",
      apellido: "Torres",
      sexo: "M",
      edad: 33,
      puesto: "Oficial Albañil",
      antiguedadAnios: 6,
      factoresRiesgo: ["Posturas forzadas", "Trabajo en altura"],
      estado: "PENDIENTE",
    },
    {
      dni: "39887766",
      nombre: "Yamila",
      apellido: "Acosta",
      sexo: "F",
      edad: 27,
      puesto: "Ingeniera de Obra",
      antiguedadAnios: 3,
      factoresRiesgo: ["Trabajo prolongado en PC"],
      estado: "PENDIENTE",
    },
    {
      dni: "28445566",
      nombre: "Rubén Darío",
      apellido: "Medina",
      sexo: "M",
      edad: 49,
      puesto: "Encargado de Obra",
      antiguedadAnios: 14,
      factoresRiesgo: ["Posturas forzadas", "Manejo de cargas"],
      estado: "PENDIENTE",
    },
    {
      dni: "40112299",
      nombre: "Brian",
      apellido: "Villalba",
      sexo: "M",
      edad: 24,
      puesto: "Ayudante de Obra",
      antiguedadAnios: 1,
      factoresRiesgo: ["Posturas forzadas", "Trabajo en altura"],
      estado: "PENDIENTE",
    },
  ];

  const trabajadoresMetalurgica: TrabajadorSeed[] = [
    {
      dni: "26778899",
      nombre: "Adrián",
      apellido: "Ferreyra",
      sexo: "M",
      edad: 50,
      puesto: "Operario de Prensa",
      antiguedadAnios: 22,
      factoresRiesgo: ["Ruido industrial"],
      estado: "COMPLETADO",
      dictamen: "APTO",
      observacionesMedicas: "Sin observaciones. Continúa en monitoreo semestral.",
    },
    {
      dni: "30998877",
      nombre: "Claudia",
      apellido: "Herrera",
      sexo: "F",
      edad: 42,
      puesto: "Control de Calidad",
      antiguedadAnios: 11,
      factoresRiesgo: ["Ruido industrial"],
      estado: "COMPLETADO",
      dictamen: "APTO",
      observacionesMedicas: "Sin observaciones. Continúa en monitoreo semestral.",
    },
    {
      dni: "33221100",
      nombre: "Gastón",
      apellido: "Domínguez",
      sexo: "M",
      edad: 37,
      puesto: "Operario de Prensa",
      antiguedadAnios: 8,
      factoresRiesgo: ["Ruido industrial"],
      estado: "COMPLETADO",
      dictamen: "APTO_CON_PREEXISTENCIAS",
      observacionesMedicas: "Hipoacusia leve. Reevaluación en 6 meses.",
    },
    {
      dni: "31556644",
      nombre: "Mariela",
      apellido: "Ojeda",
      sexo: "F",
      edad: 45,
      puesto: "Supervisora de Planta",
      antiguedadAnios: 16,
      factoresRiesgo: ["Ruido industrial"],
      estado: "COMPLETADO",
      dictamen: "APTO",
      observacionesMedicas: "Sin observaciones. Continúa en monitoreo semestral.",
    },
  ];

  const grupos: { empresaId: string; loteId: string; trabajadores: TrabajadorSeed[] }[] = [
    { empresaId: techlog.id, loteId: loteTechlog.id, trabajadores: trabajadoresTechlog },
    { empresaId: pampeana.id, loteId: lotePampeana.id, trabajadores: trabajadoresPampeana },
    { empresaId: construcciones.id, loteId: loteConstrucciones.id, trabajadores: trabajadoresConstrucciones },
    { empresaId: metalurgica.id, loteId: loteMetalurgica.id, trabajadores: trabajadoresMetalurgica },
  ];

  for (const grupo of grupos) {
    for (const seed of grupo.trabajadores) {
      const trabajador = await prisma.trabajador.create({
        data: {
          dni: seed.dni,
          nombre: seed.nombre,
          apellido: seed.apellido,
          sexo: seed.sexo,
          fechaNacimiento: fechaNacimientoDesdeEdad(seed.edad),
          puesto: seed.puesto,
          empresaId: grupo.empresaId,
          antiguedadAnios: seed.antiguedadAnios,
          factoresRiesgo: toJson(seed.factoresRiesgo),
        },
      });
      await crearAsignacion(trabajador.id, grupo.loteId, seed, evaluador.id);
    }
  }

  console.log("\nListo. Iniciá sesión con:");
  console.log(`  CUIT:      20-34589123-9`);
  console.log(`  Contraseña: ${DEMO_PASSWORD}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
