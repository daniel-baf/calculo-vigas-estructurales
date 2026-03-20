/**
 * DOMAIN LAYER — Cálculo de refuerzo a flexión
 * Módulo: shared/diseno-refuerzo
 *
 * Unidades: kgf/cm² para resistencias, cm para dimensiones,
 *           kgf·m para momentos, cm² para áreas de acero.
 * Todas las funciones son PURAS.
 */

import { VARILLA_MAP } from "./varillas"

export type ChequeoResult = "Ok" | "No Ok" | "No chequea"

export interface InputsRefuerzo {
  momento: number
  momentoLabel: string
  phiFlexion: number
  brazoJ: number
  fc: number
  fy: number
  beta: number
  bw: number
  d: number
  asEtabs: number
  qty1: number
  no1: number
  qty2: number
  no2: number
}

export interface ResultadoRefuerzo {
  asRequerido: number
  asPropuesta: number
  chequeoAsEtabs: ChequeoResult
  a: number
  phiMn: number
  dc: number
  chequeo_dc: ChequeoResult
  asMin: number
  asMax: number
  chequeoAsMinMax: ChequeoResult
  c: number
  chequeoSeccionControlada: ChequeoResult
  armadoSuperior: string
  inputs: {
    qty1: number
    no1: number
    qty2: number
    no2: number
  }
  procesos: {
    asRequerido: { formula: string; sustitucion: string }
    asPropuesta: { formula: string; sustitucion: string }
    a: { formula: string; sustitucion: string }
    phiMn: { formula: string; sustitucion: string }
    dc: { formula: string; sustitucion: string }
    asMin: { formula: string; sustitucion: string }
    asMax: { formula: string; sustitucion: string }
    c: { formula: string; sustitucion: string }
    chequeoSeccionControlada: { formula: string; sustitucion: string }
  }
}

export function calcularRefuerzo(inp: InputsRefuerzo): ResultadoRefuerzo {
  const {
    momento,
    phiFlexion,
    brazoJ,
    fc,
    fy,
    beta,
    bw,
    d,
    asEtabs,
    qty1,
    no1,
    qty2,
    no2,
  } = inp

  const v1 = VARILLA_MAP[no1] ?? { area: 0 }
  const v2 = VARILLA_MAP[no2] ?? { area: 0 }

  const asRequerido = (momento * 100) / (phiFlexion * fy * brazoJ * d)
  const asPropuesta = qty1 * v1.area + (no2 !== 0 ? qty2 * v2.area : 0)

  const chequeoAsEtabs: ChequeoResult =
    asEtabs > 0 ? (asPropuesta >= asEtabs ? "Ok" : "No Ok") : "No chequea"

  const a = (asPropuesta * fy) / (0.85 * fc * bw)
  const phiMn = (phiFlexion * asPropuesta * fy * (d - a / 2)) / 100
  const dc = phiMn > 0 ? momento / phiMn : Infinity
  const chequeo_dc: ChequeoResult = dc <= 1 ? "Ok" : "No Ok"

  const asMin = Math.max(
    (0.8 * Math.sqrt(fc) * bw * d) / fy,
    (14 * bw * d) / fy
  )
  const asMax = 0.025 * bw * d
  const chequeoAsMinMax: ChequeoResult =
    asMin <= asPropuesta && asPropuesta <= asMax ? "Ok" : "No Ok"

  const c = beta > 0 ? a / beta : 0
  const limiteC = 0.375 * d
  const chequeoSeccionControlada: ChequeoResult = c < limiteC ? "Ok" : "No Ok"

  const armadoSuperior =
    no2 === 0 || qty2 === 0
      ? `${qty1}No.${no1}`
      : `${qty1}No.${no1}+${qty2}No.${no2}`

  return {
    asRequerido,
    asPropuesta,
    chequeoAsEtabs,
    a,
    phiMn,
    dc,
    chequeo_dc,
    asMin,
    asMax,
    chequeoAsMinMax,
    c,
    chequeoSeccionControlada,
    armadoSuperior,
    inputs: { qty1, no1, qty2, no2 },
    procesos: {
      asRequerido: {
        formula: `As = (M × 100) / (φ × fy × j × d)`,
        sustitucion: `= (${momento} × 100) / (${phiFlexion} × ${fy} × ${brazoJ} × ${d}) = ${asRequerido.toFixed(2)} cm^2`,
      },
      asPropuesta: {
        formula:
          no2 !== 0
            ? `As = n1 × Av1 + n2 × Av2`
            : `As = n1 × Av1`,
        sustitucion:
          no2 !== 0
            ? `= ${qty1} × ${v1.area} + ${qty2} × ${v2.area} = ${asPropuesta.toFixed(2)} cm^2`
            : `= ${qty1} × ${v1.area} = ${asPropuesta.toFixed(2)} cm^2`,
      },
      a: {
        formula: `a = (As × fy) / (0.85 × f'c × bw)`,
        sustitucion: `= (${asPropuesta.toFixed(2)} × ${fy}) / (0.85 × ${fc} × ${bw}) = ${a.toFixed(2)} cm`,
      },
      phiMn: {
        formula: `φ Mn = (φ × As × fy × (d - a/2)) / 100`,
        sustitucion: `= (${phiFlexion} × ${asPropuesta.toFixed(2)} × ${fy} × (${d} - ${a.toFixed(2)}/2)) / 100 = ${phiMn.toFixed(2)} kgf·m`,
      },
      dc: {
        formula: `D/C = M / φ Mn`,
        sustitucion: `= ${momento} / ${phiMn.toFixed(2)} = ${dc.toFixed(4)}`,
      },
      asMin: {
        formula: `As,min = max(0.8 √ f'c × bw × d / fy, 14 × bw × d / fy)`,
        sustitucion: `= max(0.8 × ${Math.sqrt(fc).toFixed(4)} × ${bw} × ${d} / ${fy}, 14 × ${bw} × ${d} / ${fy}) = ${asMin.toFixed(2)} cm^2`,
      },
      asMax: {
        formula: `As,max = 0.025 × bw × d`,
        sustitucion: `= 0.025 × ${bw} × ${d} = ${asMax.toFixed(2)} cm^2`,
      },
      c: {
        formula: `c = a / β 1`,
        sustitucion: `= ${a.toFixed(2)} / ${beta} = ${c.toFixed(2)} cm`,
      },
      chequeoSeccionControlada: {
        formula: `c < 0.375d`,
        sustitucion: `= ${c.toFixed(2)} < 0.375 × ${d} = ${limiteC.toFixed(2)} → ${chequeoSeccionControlada === 'Ok' ? 'Ok' : 'No Ok'}`,
      },
    },
  }
}
