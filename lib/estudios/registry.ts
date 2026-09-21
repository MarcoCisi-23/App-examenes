import { z } from "zod";

export const TIPOS_ESTUDIO = [
  "CLINICO_GENERAL",
  "AUDIOMETRIA",
  "LABORATORIO_BIOQUIMICO",
  "ESPIROMETRIA_RX",
] as const;
export type TipoEstudio = (typeof TIPOS_ESTUDIO)[number];

export interface CampoEstudio {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "file";
  unit?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface DefinicionEstudio {
  tipo: TipoEstudio;
  label: string;
  icon: string;
  descripcion: string;
  campos: CampoEstudio[];
  schema: z.ZodTypeAny;
}

const clinicoGeneralSchema = z.object({
  presionArterial: z.string().min(1, "Requerido"),
  frecuenciaCardiaca: z.coerce.number().int().positive(),
  peso: z.coerce.number().positive(),
  talla: z.coerce.number().positive(),
  agudezaVisual: z.string().min(1, "Requerido"),
  auscultacion: z.string().min(1, "Requerido"),
});

const audiometriaSchema = z.object({
  oidoDerechoDb: z.coerce.number().min(0),
  oidoIzquierdoDb: z.coerce.number().min(0),
  observaciones: z.string().optional().default(""),
});

const laboratorioBioquimicoSchema = z.object({
  fechaMuestra: z.string().min(1, "Requerido"),
  archivoNombre: z.string().optional().default(""),
  observaciones: z.string().optional().default(""),
});

const espirometriaRxSchema = z.object({
  resultado: z.enum(["NORMAL", "PATOLOGICO"]),
  archivoNombre: z.string().optional().default(""),
  observaciones: z.string().optional().default(""),
});

export const ESTUDIOS_REGISTRY: Record<TipoEstudio, DefinicionEstudio> = {
  CLINICO_GENERAL: {
    tipo: "CLINICO_GENERAL",
    label: "Examen Clínico General y Anamnesis",
    icon: "stethoscope",
    descripcion: "Signos vitales y evaluación clínica general",
    schema: clinicoGeneralSchema,
    campos: [
      {
        name: "presionArterial",
        label: "Presión Arterial",
        type: "text",
        unit: "mmHg",
        placeholder: "120/80",
      },
      {
        name: "frecuenciaCardiaca",
        label: "Frecuencia Cardíaca",
        type: "number",
        unit: "bpm",
        placeholder: "72",
      },
      { name: "peso", label: "Peso", type: "number", unit: "kg" },
      { name: "talla", label: "Talla", type: "number", unit: "m" },
      {
        name: "agudezaVisual",
        label: "Agudeza Visual",
        type: "text",
        placeholder: "10/10 (Ambos ojos)",
      },
      {
        name: "auscultacion",
        label: "Auscultación Cardiorrespiratoria",
        type: "select",
        options: [
          {
            value: "Normal - Buena mecánica vent. R1 y R2 normofonéticos",
            label: "Normal - Buena mecánica vent. R1 y R2 normofonéticos",
          },
          { value: "Ruidos agregados / Soplos", label: "Ruidos agregados / Soplos" },
          {
            value: "Hipoventilación bilateral",
            label: "Hipoventilación bilateral",
          },
        ],
      },
    ],
  },
  AUDIOMETRIA: {
    tipo: "AUDIOMETRIA",
    label: "Audiometría Tonal Laboral",
    icon: "hearing",
    descripcion: "Vía aérea y ósea bilateral (dB)",
    schema: audiometriaSchema,
    campos: [
      { name: "oidoDerechoDb", label: "Oído Derecho", type: "number", unit: "dB" },
      { name: "oidoIzquierdoDb", label: "Oído Izquierdo", type: "number", unit: "dB" },
      { name: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  LABORATORIO_BIOQUIMICO: {
    tipo: "LABORATORIO_BIOQUIMICO",
    label: "Laboratorio Bioquímico",
    icon: "science",
    descripcion: "Protocolo de laboratorio adjunto",
    schema: laboratorioBioquimicoSchema,
    campos: [
      { name: "fechaMuestra", label: "Fecha de Muestra", type: "text", placeholder: "DD/MM/AAAA" },
      { name: "archivoNombre", label: "Protocolo (archivo)", type: "file" },
      { name: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  ESPIROMETRIA_RX: {
    tipo: "ESPIROMETRIA_RX",
    label: "Espirometría / Rx Tórax",
    icon: "air",
    descripcion: "Sin informe de imágenes adjunto",
    schema: espirometriaRxSchema,
    campos: [
      {
        name: "resultado",
        label: "Resultado",
        type: "select",
        options: [
          { value: "NORMAL", label: "Normal" },
          { value: "PATOLOGICO", label: "Patológico" },
        ],
      },
      { name: "archivoNombre", label: "Informe de imágenes (archivo)", type: "file" },
      { name: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
};

export const ORDEN_ESTUDIOS: TipoEstudio[] = [
  "CLINICO_GENERAL",
  "AUDIOMETRIA",
  "LABORATORIO_BIOQUIMICO",
  "ESPIROMETRIA_RX",
];
