/**
 * DOMAIN LAYER — Diseño a Flexión para M1(−) Lado Izquierdo
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
} from "@/shared/diseno-refuerzo/varillas"

export { PHI_FLEXION, BRAZO_J } from "~/steps/3-diseno-flexion/diseno-flexion"

import {
  calcularRefuerzo,
  validarRefuerzo,
  generarVariantes,
  type InputsRefuerzo,
  type ResultadoRefuerzo,
  type FiltroVariantes,
} from "@/shared/diseno-refuerzo"

export type { InputsRefuerzo, ResultadoRefuerzo, FiltroVariantes }

export interface InputsDisenoM1 {
  M1: number
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

export interface ResultadoDisenoM1 {
  asM1: number
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
    asM1: { formula: string; sustitucion: string }
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

export function calcularDisenoM1(inp: InputsDisenoM1): ResultadoDisenoM1 {
  const res = calcularRefuerzo({
    momento: inp.M1,
    momentoLabel: "M1",
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

  return {
    asM1: res.asRequerido,
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
      asM1: res.procesos.asRequerido,
      asPropuesta: res.procesos.asPropuesta,
      a: res.procesos.a,
      phiMn: res.procesos.phiMn,
      dc: res.procesos.dc,
      asMin: res.procesos.asMin,
      asMax: res.procesos.asMax,
      c: res.procesos.c,
      chequeoSeccionControlada: res.procesos.chequeoSeccionControlada,
    },
  }
}

export interface ErroresDisenoM1 {
  asEtabs?: string
  qty1?: string
  no1?: string
  qty2?: string
  no2?: string
}

export interface AlertasDisenoM1 {
  no1Caro?: string
  no2Caro?: string
  diffVarillas?: string
}

export function validarDisenoM1(inp: Partial<InputsDisenoM1>): {
  errors: ErroresDisenoM1
  alertas: AlertasDisenoM1
} {
  return validarRefuerzo(inp as Parameters<typeof validarRefuerzo>[0]) as {
    errors: ErroresDisenoM1
    alertas: AlertasDisenoM1
  }
}

export function generarVariantesM1(
  inpBase: Omit<InputsDisenoM1, "qty1" | "no1" | "qty2" | "no2">,
  filtro: FiltroVariantes
): ResultadoDisenoM1[] {
  const sharedRes = generarVariantes(
    {
      momento: inpBase.M1,
      momentoLabel: "M1",
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

  return sharedRes.map(
    (r): ResultadoDisenoM1 => ({
      asM1: r.asRequerido,
      asPropuesta: r.asPropuesta,
      chequeoAsEtabs: r.chequeoAsEtabs,
      a: r.a,
      phiMn: r.phiMn,
      dc: r.dc,
      chequeo_dc: r.chequeo_dc as "Ok" | "No Ok",
      asMin: r.asMin,
      asMax: r.asMax,
      chequeoAsMinMax: r.chequeoAsMinMax as "Ok" | "No Ok",
      c: r.c,
      chequeoSeccionControlada: r.chequeoSeccionControlada as "Ok" | "No Ok",
      armadoSuperior: r.armadoSuperior,
      inputs: r.inputs,
      procesos: {
        asM1: r.procesos.asRequerido,
        asPropuesta: r.procesos.asPropuesta,
        a: r.procesos.a,
        phiMn: r.procesos.phiMn,
        dc: r.procesos.dc,
        asMin: r.procesos.asMin,
        asMax: r.procesos.asMax,
        c: r.procesos.c,
        chequeoSeccionControlada: r.procesos.chequeoSeccionControlada,
      },
    })
  )
}
