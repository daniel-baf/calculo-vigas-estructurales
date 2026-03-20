/**
 * DOMAIN LAYER — Diseño a Flexión
 * Módulo: Diseño de Viga Entrepiso (DI) — Viga de Techo
 */

// ── Constantes fijas ──────────────────────────────────────────────────────────
export const PHI_FLEXION = 0.9;  // factor de reducción a flexión (ACI 318-19 21.2.2)
export const BRAZO_J     = 0.9;  // brazo de palanca asumido (jd = 0.9d)

// ── Chequeo de sección ────────────────────────────────────────────────────────

export type ChequeoResult = 'Ok' | 'No Ok' | 'No chequea';

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
export interface ChequeoSeccionDetailed {
  result: ChequeoResult;
  procesos?: {
    condicion1?: { formula: string; sustitucion: string };
    condicion2?: { formula: string; sustitucion: string };
    general?: { formula: string; sustitucion: string };
    brazoJ?: { formula: string; sustitucion: string };
  };
}

export function chequearSeccion(
  portico: string,
  L: number,
  d: number,
  bw: number,
  h: number
): ChequeoSeccionDetailed {
  const procesoBrazoJ = {
    formula: 'jd \\approx 0.9d',
    sustitucion: `jd \\approx 0.9(${d}) = ${(0.9 * d).toFixed(2)} \\text{ cm}`
  };

  if (portico === 'P.I') {
    return { 
      result: 'Ok', 
      procesos: {
        general: {
          formula: '\\text{Pórtico Intermedio (P.I)}',
          sustitucion: '\\text{No requiere chequeo geométrico adicional según NSR-10/ACI 318.}'
        },
        brazoJ: procesoBrazoJ
      }
    };
  }
  
  if (portico === 'P.E') {
    const cond1 = L * 100 >= 4 * d;            // L (m→cm) ≥ 4d
    const valMaxBw = Math.max(0.3 * h, 25);
    const cond2 = bw >= valMaxBw;             // bw ≥ max(0.3h, 25)
    
    return { 
      result: cond1 && cond2 ? 'Ok' : 'No Ok', 
      procesos: {
        condicion1: {
          formula: 'L_{n} \\ge 4d',
          sustitucion: `${(L * 100).toFixed(2)} \\text{ cm} \\ge 4(${d}) = ${(4 * d).toFixed(2)} \\text{ cm} \\rightarrow ${cond1 ? '\\text{Ok}' : '\\text{No Ok}'}`
        },
        condicion2: {
          formula: 'b_w \\ge \\max(0.3h, 25 \\text{ cm})',
          sustitucion: `${bw} \\text{ cm} \\ge \\max(0.3 \\cdot ${h}, 25) = ${valMaxBw.toFixed(2)} \\text{ cm} \\rightarrow ${cond2 ? '\\text{Ok}' : '\\text{No Ok}'}`
        },
        brazoJ: procesoBrazoJ
      }
    };
  }
  
  return { 
    result: 'No chequea', 
    procesos: {
      general: {
        formula: '\\text{Pórtico Ordinario (P.O) o No definido}',
        sustitucion: '\\text{Chequeo no definido para este tipo de pórtico.}'
      },
      brazoJ: procesoBrazoJ
    }
  };
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
