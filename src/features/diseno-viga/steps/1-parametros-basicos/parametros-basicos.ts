/**
 * DOMAIN LAYER — Cálculos de Parámetros Básicos de Viga
 * Módulo: Diseño de Viga Entrepiso (DI) — Viga de Techo
 *
 * Unidades: kgf/cm² para resistencias, cm para dimensiones, m para luces.
 * Todas las funciones son PURAS (sin side-effects).
 */

// ── Límites mínimos reglamentarios ───────────────────────────────────────────
export const FC_MIN = 210 // kgf/cm² (NSR-10 C.5.1.1)
export const BW_MIN = 25 // cm
export const H_MIN = 40 // cm
export const REC_MIN = 4 // cm

// ── Catálogos ─────────────────────────────────────────────────────────────────
export const GRADOS_ACERO = {
  G60: { label: "Grado 60", fy: 4200 },
  G40: { label: "Grado 40", fy: 2810 },
} as const

export type GradoAceroKey = keyof typeof GRADOS_ACERO

export const TIPOS_CONCRETO = {
  NORMAL: { label: "Concreto Normal", lambda: 1.0 },
  LIGERO: { label: "Concreto Ligero", lambda: 0.75 },
} as const

export type TipoConcretoKey = keyof typeof TIPOS_CONCRETO

export interface TipoPortico {
  value: string
  label: string
  descripcion: string
}

export const TIPOS_PORTICO: TipoPortico[] = [
  { value: "P.E", label: "P.E", descripcion: "Pórtico Especial" },
  { value: "P.I", label: "P.I", descripcion: "Pórtico Intermedio" },
  { value: "P.O", label: "P.O", descripcion: "Pórtico Ordinario" },
]

// ── Funciones de cálculo ──────────────────────────────────────────────────────

/**
 * Calcula el factor β₁ (ACI 318-19 / NSR-10 C.10.2.7.3).
 * Fórmula exacta de la hoja de cálculo de referencia.
 *
 * @param fc - Resistencia del concreto en kgf/cm²
 */
export function calcularBeta(fc: number): number | null {
  if (!fc || fc <= 0) return null
  if (fc >= 175.76 && fc <= 281.228) {
    return 0.85
  }
  if (fc > 281.228 && fc < 562.45) {
    return parseFloat((0.85 - (0.05 * fc - 210) / 1000).toFixed(4))
  }
  if (fc >= 562.45) {
    return 0.65
  }
  return null
}

/**
 * Peralte efectivo: d = h − rec
 */
export function calcularPeralteEfectivo(h: number, rec: number): number {
  return parseFloat((h - rec).toFixed(2))
}

export interface ErroresParametros {
  fc?: string
  bw?: string
  h?: string
  rec?: string
  L?: string
}

export interface InputsParametros {
  fc: number
  bw: number
  h: number
  rec: number
  L: number
}

/**
 * Valida los campos del paso 1.
 * Retorna un objeto vacío si todos los campos son válidos.
 */
export function validarParametrosBasicos({
  fc,
  bw,
  h,
  rec,
  L,
}: InputsParametros): ErroresParametros {
  const errors: ErroresParametros = {}

  if (fc == null) errors.fc = "Campo requerido"
  else if (isNaN(fc)) errors.fc = "Debe ser un número"
  else if (fc < FC_MIN) errors.fc = `Mínimo ${FC_MIN} kgf/cm²`

  if (bw == null) errors.bw = "Campo requerido"
  else if (isNaN(bw)) errors.bw = "Debe ser un número"
  else if (bw < BW_MIN) errors.bw = `Mínimo ${BW_MIN} cm`

  if (h == null) errors.h = "Campo requerido"
  else if (isNaN(h)) errors.h = "Debe ser un número"
  else if (h < H_MIN) errors.h = `Mínimo ${H_MIN} cm`

  if (rec == null) errors.rec = "Campo requerido"
  else if (isNaN(rec)) errors.rec = "Debe ser un número"
  else if (rec < REC_MIN) errors.rec = `Mínimo ${REC_MIN} cm`

  if (L == null) errors.L = "Campo requerido"
  else if (isNaN(L)) errors.L = "Debe ser un número"
  else if (L <= 0) errors.L = "Debe ser mayor a 0"

  return errors
}
