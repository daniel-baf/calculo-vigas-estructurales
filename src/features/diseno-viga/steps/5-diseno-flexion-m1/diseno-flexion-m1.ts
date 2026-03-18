/**
 * DOMAIN LAYER — Diseño a Flexión para M1(−) Lado Izquierdo
 * Módulo: Diseño de Viga (DI) — Viga de Techo
 *
 * Unidades: kgf/cm² para resistencias, cm para dimensiones,
 *           kgf·m para momentos, cm² para áreas de acero.
 * Todas las funciones son PURAS.
 */

import { VARILLA_MAP, VARILLA_MAX_RECOMENDADO, VARILLA_MIN_RECOMENDADO, VARILLA_MAX_DIFF } from '../4-diseno-flexion-m2/diseno-flexion-m2';

// ── Inputs / Outputs ──────────────────────────────────────────────────────────

export interface InputsDisenoM1 {
  // Del paso 3
  M1: number;         // kgf·m (valor positivo ingresado en paso 3)
  phiFlexion: number; // 0.9
  brazoJ: number;     // 0.9
  // Del paso 1
  fc: number;         // kgf/cm²
  fy: number;         // kgf/cm²
  beta: number;       // β₁
  bw: number;         // cm
  d: number;          // cm (peralte efectivo)
  // Inputs de este paso
  asEtabs: number;    // cm² (ingresado por usuario)
  qty1: number;
  no1: number;
  qty2: number;
  no2: number;        // 0 = sin segunda fila
}

export interface ResultadoDisenoM1 {
  asM1: number;           // cm² — acero requerido analítico [As por M1(-)]
  asPropuesta: number;    // cm² — acero propuesto por varillas
  chequeoAsEtabs: 'Ok' | 'No Ok' | 'No chequea';
  a: number;              // cm — profundidad bloque rectangular
  phiMn: number;          // kgf·m — momento nominal resistente
  dc: number;             // ratio D/C
  chequeo_dc: 'Ok' | 'No Ok';
  asMin: number;          // cm²
  asMax: number;          // cm²
  chequeoAsMinMax: 'Ok' | 'No Ok';
  c: number;              // cm — eje neutro
  chequeoSeccionControlada: 'Ok' | 'No Ok';
  armadoSuperior: string; // p.ej. "2No.6+1No.4"
  inputs: {
    qty1: number;
    no1: number;
    qty2: number;
    no2: number;
  };
  /** Detalles de los cálculos para mostrar en UI (fórmulas planteadas) */
  procesos: {
    asM1: string;
    asPropuesta: string;
    a: string;
    phiMn: string;
    dc: string;
    asMin: string;
    asMax: string;
    c: string;
  };
}

// ── Función principal ─────────────────────────────────────────────────────────

export function calcularDisenoM1(inp: InputsDisenoM1): ResultadoDisenoM1 {
  const { M1, phiFlexion, brazoJ, fc, fy, beta, bw, d,
          asEtabs, qty1, no1, qty2, no2 } = inp;

  const v1 = VARILLA_MAP[no1] ?? { area: 0 };
  const v2 = VARILLA_MAP[no2] ?? { area: 0 };

  // As requerido analítico
  const asM1 = (M1 * 100) / (phiFlexion * fy * brazoJ * d);

  // As propuesta
  const asPropuesta = qty1 * v1.area + (no2 !== 0 ? qty2 * v2.area : 0);

  // Chequeo As propuesta ≥ As ETABS/SAP
  const chequeoAsEtabs: ResultadoDisenoM1['chequeoAsEtabs'] =
    asEtabs > 0
      ? asPropuesta >= asEtabs ? 'Ok' : 'No Ok'
      : 'No chequea';

  // a = (As × fy) / (0.85 × fc × bw)
  const a = (asPropuesta * fy) / (0.85 * fc * bw);

  // φMn = φ × As × fy × (d − a/2) / 100   [kgf·m]
  const phiMn = (phiFlexion * asPropuesta * fy * (d - a / 2)) / 100;

  // D/C
  const dc = phiMn > 0 ? M1 / phiMn : Infinity;
  const chequeo_dc: 'Ok' | 'No Ok' = dc <= 1 ? 'Ok' : 'No Ok';

  // As min / max
  const asMin = Math.max(
    (0.8 * Math.sqrt(fc) * bw * d) / fy,
    (14 * bw * d) / fy
  );
  const asMax = 0.025 * bw * d;
  const chequeoAsMinMax: 'Ok' | 'No Ok' =
    asMin <= asPropuesta && asPropuesta <= asMax ? 'Ok' : 'No Ok';

  // c = a / β₁
  const c = beta > 0 ? a / beta : 0;

  // Sección controlada: c < 0.375 × d
  const chequeoSeccionControlada: 'Ok' | 'No Ok' =
    c < 0.375 * d ? 'Ok' : 'No Ok';

  // Armado superior
  const armadoSuperior =
    no2 === 0 || qty2 === 0
      ? `${qty1}No.${no1}`
      : `${qty1}No.${no1}+${qty2}No.${no2}`;

  return {
    asM1, asPropuesta, chequeoAsEtabs,
    a, phiMn, dc, chequeo_dc,
    asMin, asMax, chequeoAsMinMax,
    c, chequeoSeccionControlada,
    armadoSuperior,
    inputs: { qty1, no1, qty2, no2 },
    procesos: {
      asM1: `As_req = (M1 × 100) / (φ × fy × j × d) = (${M1} × 100) / (${phiFlexion} × ${fy} × ${brazoJ} × ${d})`,
      asPropuesta: no2 !== 0 
        ? `As_prop = (${qty1} × ${v1.area}) + (${qty2} × ${v2.area})`
        : `As_prop = ${qty1} × ${v1.area}`,
      a: `a = (As × fy) / (0.85 × fc' × bw) = (${asPropuesta.toFixed(2)} × ${fy}) / (0.85 × ${fc} × ${bw})`,
      phiMn: `φMn = φ × As × fy × (d - a/2) / 100 = (${phiFlexion} × ${asPropuesta.toFixed(2)} × ${fy} × (${d} - ${a.toFixed(2)}/2)) / 100`,
      dc: `D/C = M1 / φMn = ${M1} / ${phiMn.toFixed(2)}`,
      asMin: `As_min = max(0.8√fc'×bw×d/fy, 14×bw×d/fy) = max(${((0.8 * Math.sqrt(fc) * bw * d) / fy).toFixed(2)}, ${((14 * bw * d) / fy).toFixed(2)})`,
      asMax: `As_max = 0.025 × bw × d = 0.025 × ${bw} × ${d}`,
      c: `c = a / β₁ = ${a.toFixed(2)} / ${beta}`,
    },
  };
}

// ── Validaciones y alertas ─────────────────────────────────────────────────────

export interface ErroresDisenoM1 {
  asEtabs?: string;
  qty1?: string;
  no1?: string;
  qty2?: string;
  no2?: string;
}

export interface AlertasDisenoM1 {
  no1Caro?: string;
  no2Caro?: string;
  diffVarillas?: string;
}

export function validarDisenoM1(
  inp: Partial<InputsDisenoM1>
): { errors: ErroresDisenoM1; alertas: AlertasDisenoM1 } {
  const errors: ErroresDisenoM1 = {};
  const alertas: AlertasDisenoM1 = {};

  if (inp.asEtabs == null || isNaN(inp.asEtabs) || inp.asEtabs < 0)
    errors.asEtabs = 'Ingresa el área de acero por ETABS/SAP (≥ 0)';

  if (!inp.qty1 || inp.qty1 <= 0)
    errors.qty1 = 'Cantidad requerida';

  if (!inp.no1)
    errors.no1 = 'Selecciona el No. de varilla';

  if (inp.no2 && inp.no2 !== 0) {
    if (!inp.qty2 || inp.qty2 <= 0)
      errors.qty2 = 'Cantidad requerida';
  }

  // Alertas de costo
  if (inp.no1 && inp.no1 > VARILLA_MAX_RECOMENDADO)
    alertas.no1Caro = `No. ${inp.no1} es posible pero costoso. Se recomienda No. ${VARILLA_MIN_RECOMENDADO}–${VARILLA_MAX_RECOMENDADO}.`;

  if (inp.no2 && inp.no2 !== 0 && inp.no2 > VARILLA_MAX_RECOMENDADO)
    alertas.no2Caro = `No. ${inp.no2} es posible pero costoso. Se recomienda No. ${VARILLA_MIN_RECOMENDADO}–${VARILLA_MAX_RECOMENDADO}.`;

  // Diferencia máxima entre números de varilla
  if (inp.no1 && inp.no2 && inp.no2 !== 0) {
    const diff = Math.abs(inp.no1 - inp.no2);
    if (diff > VARILLA_MAX_DIFF)
      alertas.diffVarillas = `Diferencia entre No. ${inp.no1} y No. ${inp.no2} es de ${diff} — máx recomendado: ${VARILLA_MAX_DIFF}.`;
  }

  return { errors, alertas };
}

// ── Generador de Variantes ──────────────────────────────────────────────────

export interface FiltroVariantes {
  nosPermitidos: number[];
  maxOpciones?: number;
  soloHorizontales?: boolean;
}

export function generarVariantesM1(
  inpBase: Omit<InputsDisenoM1, 'qty1' | 'no1' | 'qty2' | 'no2'>,
  filtro: FiltroVariantes
): ResultadoDisenoM1[] {
  const { nosPermitidos, maxOpciones = 20, soloHorizontales = false } = filtro;
  const resultados: ResultadoDisenoM1[] = [];
  const nos = Array.from(new Set(nosPermitidos)).sort((a, b) => a - b);

  for (const s1 of nos) {
    if (s1 === 0) continue;
    const opcionesS2 = soloHorizontales ? [0, ...nos] : [...nos];

    for (const s2 of opcionesS2) {
      if (s2 !== 0 && s1 === s2) continue;
      
      for (let q1 = 2; q1 <= 6; q1++) {
        const startQ2 = s2 === 0 ? 0 : 1;
        const endQ2   = s2 === 0 ? 0 : 4;

        for (let q2 = startQ2; q2 <= endQ2; q2++) {
          const res = calcularDisenoM1({
            ...inpBase,
            qty1: q1,
            no1: s1,
            qty2: q2,
            no2: s2,
          });

          if (
            res.chequeoAsEtabs === 'Ok' &&
            res.chequeo_dc === 'Ok' &&
            res.chequeoAsMinMax === 'Ok' &&
            res.chequeoSeccionControlada === 'Ok'
          ) {
            resultados.push(res);
          }
        }
      }
    }
  }

  resultados.sort((a, b) => a.asPropuesta - b.asPropuesta);
  const finalResults: ResultadoDisenoM1[] = [];
  const seenArmados = new Set<string>();

  for (const r of resultados) {
    if (!seenArmados.has(r.armadoSuperior)) {
      seenArmados.add(r.armadoSuperior);
      finalResults.push(r);
    }
    if (finalResults.length >= maxOpciones) break;
  }

  return finalResults;
}
