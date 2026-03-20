/**
 * DOMAIN LAYER — Tabla de varillas (ASTM / NTC)
 * Módulo: shared/diseno-refuerzo
 *
 * Unidades: cm² para áreas, cm para diámetros.
 */

export interface VarillaInfo {
  no: number
  area: number
  diam: number
}

export const VARILLAS: VarillaInfo[] = [
  { no: 2, area: 0.32, diam: 0.64 },
  { no: 3, area: 0.71, diam: 0.95 },
  { no: 4, area: 1.29, diam: 1.27 },
  { no: 5, area: 2.0, diam: 1.59 },
  { no: 6, area: 2.84, diam: 1.91 },
  { no: 7, area: 3.87, diam: 2.22 },
  { no: 8, area: 5.1, diam: 2.54 },
  { no: 9, area: 6.45, diam: 2.86 },
  { no: 10, area: 8.19, diam: 3.18 },
  { no: 11, area: 10.06, diam: 3.49 },
  { no: 14, area: 14.52, diam: 4.45 },
  { no: 18, area: 25.81, diam: 5.72 },
  { no: 0, area: 0.0, diam: 0.0 },
]

export const VARILLA_MAP: Record<number, VarillaInfo> = Object.fromEntries(
  VARILLAS.map((v) => [v.no, v])
)

export const VARILLA_NOS = VARILLAS.map((v) => v.no)

export const VARILLA_MIN_RECOMENDADO = 2
export const VARILLA_MAX_RECOMENDADO = 6
export const VARILLA_MAX_DIFF = 2
