/**
 * DOMAIN LAYER — Diseño a Flexión para M2(−) Lado Derecho
 * Módulo: Diseño de Viga (DI) — Viga de Techo
 *
 * Re-exporta tipos y funciones genéricas del shared module.
 */

export {
  VARILLAS,
  VARILLA_MAP,
  VARILLA_NOS,
  VARILLA_MIN_RECOMENDADO,
  VARILLA_MAX_RECOMENDADO,
  VARILLA_MAX_DIFF,
  type VarillaInfo,
} from "../../../../shared/diseno-refuerzo/varillas"

export { PHI_FLEXION, BRAZO_J } from "../3-diseno-flexion/diseno-flexion"

import {
  calcularRefuerzo,
  validarRefuerzo,
  generarVariantes,
  type InputsRefuerzo,
  type ResultadoRefuerzo,
  type FiltroVariantes,
} from "../../../../shared/diseno-refuerzo"

export type { InputsRefuerzo, ResultadoRefuerzo, FiltroVariantes }

export interface InputsDisenoM2 {
  M2: number
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

export interface ResultadoDisenoM2 {
  asM2: number
  asPropuesta: number
  chequeoAsEtabs: "Ok" | "No Ok" | "No chequea"
  a: number
  phiMn: number
  dc: number
  chequeo_dc: "Ok" | "No Ok"
  asMin: number
  asMax: number
  chequeoAsMinMax: "Ok" | "No Ok"
  c: number
  chequeoSeccionControlada: "Ok" | "No Ok"
  armadoSuperior: string
  inputs: {
    qty1: number
    no1: number
    qty2: number
    no2: number
  }
  procesos: {
    asM2: { formula: string; sustitucion: string }
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

export function calcularDisenoM2(inp: InputsDisenoM2): ResultadoDisenoM2 {
  const res = calcularRefuerzo({
    momento: inp.M2,
    momentoLabel: "M2",
    phiFlexion: inp.phiFlexion,
    brazoJ: inp.brazoJ,
    fc: inp.fc,
    fy: inp.fy,
    beta: inp.beta,
    bw: inp.bw,
    d: inp.d,
    asEtabs: inp.asEtabs,
    qty1: inp.qty1,
    no1: inp.no1,
    qty2: inp.qty2,
    no2: inp.no2,
  })

  return mapSharedResult(res)
}

export interface ErroresDisenoM2 {
  asEtabs?: string
  qty1?: string
  no1?: string
  qty2?: string
  no2?: string
}

export interface AlertasDisenoM2 {
  no1Caro?: string
  no2Caro?: string
  diffVarillas?: string
}

export function validarDisenoM2(inp: Partial<InputsDisenoM2>): {
  errors: ErroresDisenoM2
  alertas: AlertasDisenoM2
} {
  return validarRefuerzo(inp as Parameters<typeof validarRefuerzo>[0]) as {
    errors: ErroresDisenoM2
    alertas: AlertasDisenoM2
  }
}

export function generarVariantesM2(
  inpBase: Omit<InputsDisenoM2, "qty1" | "no1" | "qty2" | "no2">,
  filtro: FiltroVariantes
): ResultadoDisenoM2[] {
  const sharedRes = generarVariantes(
    {
      momento: inpBase.M2,
      momentoLabel: "M2",
      phiFlexion: inpBase.phiFlexion,
      brazoJ: inpBase.brazoJ,
      fc: inpBase.fc,
      fy: inpBase.fy,
      beta: inpBase.beta,
      bw: inpBase.bw,
      d: inpBase.d,
      asEtabs: inpBase.asEtabs,
    },
    filtro
  )

  return sharedRes.map((r) => mapSharedResult(r))
}

function mapSharedResult(res: ResultadoRefuerzo): ResultadoDisenoM2 {
  return {
    asM2: res.asRequerido,
    asPropuesta: res.asPropuesta,
    chequeoAsEtabs: res.chequeoAsEtabs,
    a: res.a,
    phiMn: res.phiMn,
    dc: res.dc,
    chequeo_dc: res.chequeo_dc as "Ok" | "No Ok",
    asMin: res.asMin,
    asMax: res.asMax,
    chequeoAsMinMax: res.chequeoAsMinMax as "Ok" | "No Ok",
    c: res.c,
    chequeoSeccionControlada: res.chequeoSeccionControlada as "Ok" | "No Ok",
    armadoSuperior: res.armadoSuperior,
    inputs: res.inputs,
    procesos: {
      asM2: res.procesos.asRequerido,
      asPropuesta: res.procesos.asPropuesta,
      a: res.procesos.a,
      phiMn: res.procesos.phiMn,
      dc: res.procesos.dc,
      asMin: res.procesos.asMin,
      asMax: res.procesos.asMax,
      c: res.procesos.c,
      chequeoSeccionControlada: res.procesos.chequeoSeccionControlada,
    },
  } as ResultadoDisenoM2
}
