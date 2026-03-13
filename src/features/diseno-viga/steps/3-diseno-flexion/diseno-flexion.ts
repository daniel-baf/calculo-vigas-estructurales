/**
 * DOMAIN LAYER — Diseño a Flexión
 * Módulo: Diseño de Viga Entrepiso (DI) — Viga de Techo
 */

// ── Constantes fijas ──────────────────────────────────────────────────────────
export const PHI_FLEXION = 0.9;  // factor de reducción a flexión (ACI 318-19 21.2.2)
export const BRAZO_J     = 0.9;  // brazo de palanca asumido (jd = 0.9d)

// ── Chequeo de sección ────────────────────────────────────────────────────────

export type ChequeoResult = 'Ok' | 'No Ok' | 'N/A';

/**
 * Verifica si la sección cumple los requisitos geométricos según el tipo de pórtico.
 * Fórmula: =IF(D13="P.I","Ok",IF(D13="P.E",IF(AND(D18*100>=4*D17,D14>=MAX(0.3*D15,25)),"Ok","No Ok")))
 *
 * @param portico - Tipo de pórtico: 'P.E' | 'P.I' | 'P.O'
 * @param L  - Luz entre apoyos (m)
 * @param d  - Peralte efectivo (cm)  — viene del Paso 1
 * @param bw - Ancho de viga (cm)    — viene del Paso 1
 * @param h  - Altura de viga (cm)   — viene del Paso 1
 */
export function chequearSeccion(
  portico: string,
  L: number,
  d: number,
  bw: number,
  h: number
): ChequeoResult {
  if (portico === 'P.I') return 'Ok';
  if (portico === 'P.E') {
    const cond1 = L * 100 >= 4 * d;            // L (m→cm) ≥ 4d
    const cond2 = bw >= Math.max(0.3 * h, 25); // bw ≥ max(0.3h, 25)
    return cond1 && cond2 ? 'Ok' : 'No Ok';
  }
  return 'N/A'; // P.O — no especificado en la fórmula
}

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface MomentosDiseño {
  /** M1 — Momento lado izquierdo (valor positivo ingresado, se trata como negativo) */
  M1: number;
  /** Mcenter — Momento en el centro de la viga (positivo) */
  Mcenter: number;
  /** M2 — Momento lado derecho (valor positivo ingresado, se trata como negativo) */
  M2: number;
}

export interface ErroresDisenoFlexion {
  M1?: string;
  Mcenter?: string;
  M2?: string;
}

export function validarDisenoFlexion(m: Partial<MomentosDiseño>): ErroresDisenoFlexion {
  const e: ErroresDisenoFlexion = {};
  if (!m.M1 && m.M1 !== 0)       e.M1      = 'Campo requerido';
  else if (m.M1 < 0)              e.M1      = 'Ingresa el valor positivo';
  if (!m.Mcenter && m.Mcenter !== 0) e.Mcenter = 'Campo requerido';
  else if (m.Mcenter < 0)            e.Mcenter = 'Ingresa el valor positivo';
  if (!m.M2 && m.M2 !== 0)       e.M2      = 'Campo requerido';
  else if (m.M2 < 0)             e.M2      = 'Ingresa el valor positivo';
  return e;
}
