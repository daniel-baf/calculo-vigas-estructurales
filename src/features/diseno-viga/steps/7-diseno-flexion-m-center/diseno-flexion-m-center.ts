/**
 * DOMAIN LAYER — Diseño a Flexión para Momento en el Centro de la Viga M(+)
 * Módulo: Diseño de Viga (DI) — Viga de Techo
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
import { mapRefuerzoResult } from "~/components/flexion/mapRefuerzo"

export type { InputsRefuerzo, ResultadoRefuerzo, FiltroVariantes }

export interface InputsDisenoMCentro {
  Mcenter: number
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

export interface ResultadoDisenoMCentro {
  asMcenter: number
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
    asMcenter: { formula: string; sustitucion: string }
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

export function calcularDisenoMCentro(
  inp: InputsDisenoMCentro
): ResultadoDisenoMCentro {
  const res = calcularRefuerzo({
    momento: inp.Mcenter,
    momentoLabel: "M(+) Centro",
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

  const mapped = mapRefuerzoResult(res)

  return {
    asMcenter: mapped.asRequerido,
    asPropuesta: mapped.asPropuesta,
    chequeoAsEtabs: mapped.chequeoAsEtabs,
    a: mapped.a,
    phiMn: mapped.phiMn,
    dc: mapped.dc,
    chequeo_dc: mapped.chequeo_dc,
    asMin: mapped.asMin,
    asMax: mapped.asMax,
    chequeoAsMinMax: mapped.chequeoAsMinMax,
    c: mapped.c,
    chequeoSeccionControlada: mapped.chequeoSeccionControlada,
    armadoSuperior: mapped.armadoSuperior,
    inputs: mapped.inputs,
    procesos: {
      asMcenter: mapped.procesos.asRequerido,
      asPropuesta: mapped.procesos.asPropuesta,
      a: mapped.procesos.a,
      phiMn: mapped.procesos.phiMn,
      dc: mapped.procesos.dc,
      asMin: mapped.procesos.asMin,
      asMax: mapped.procesos.asMax,
      c: mapped.procesos.c,
      chequeoSeccionControlada: mapped.procesos.chequeoSeccionControlada,
    },
  }
}

export interface ErroresDisenoMCentro {
  asEtabs?: string
  qty1?: string
  no1?: string
  qty2?: string
  no2?: string
}

export interface AlertasDisenoMCentro {
  no1Caro?: string
  no2Caro?: string
  diffVarillas?: string
}

export function validarDisenoMCentro(inp: Partial<InputsDisenoMCentro>): {
  errors: ErroresDisenoMCentro
  alertas: AlertasDisenoMCentro
} {
  return validarRefuerzo(inp as Parameters<typeof validarRefuerzo>[0]) as {
    errors: ErroresDisenoMCentro
    alertas: AlertasDisenoMCentro
  }
}

export function generarVariantesMCentro(
  inpBase: Omit<InputsDisenoMCentro, "qty1" | "no1" | "qty2" | "no2">,
  filtro: FiltroVariantes
): ResultadoDisenoMCentro[] {
  const sharedRes = generarVariantes(
    {
      momento: inpBase.Mcenter,
      momentoLabel: "M(+) Centro",
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

  return sharedRes.map((r): ResultadoDisenoMCentro => {
    const mapped = mapRefuerzoResult(r)
    return {
      asMcenter: mapped.asRequerido,
      asPropuesta: mapped.asPropuesta,
      chequeoAsEtabs: mapped.chequeoAsEtabs,
      a: mapped.a,
      phiMn: mapped.phiMn,
      dc: mapped.dc,
      chequeo_dc: mapped.chequeo_dc,
      asMin: mapped.asMin,
      asMax: mapped.asMax,
      chequeoAsMinMax: mapped.chequeoAsMinMax,
      c: mapped.c,
      chequeoSeccionControlada: mapped.chequeoSeccionControlada,
      armadoSuperior: mapped.armadoSuperior,
      inputs: mapped.inputs,
      procesos: {
        asMcenter: mapped.procesos.asRequerido,
        asPropuesta: mapped.procesos.asPropuesta,
        a: mapped.procesos.a,
        phiMn: mapped.procesos.phiMn,
        dc: mapped.procesos.dc,
        asMin: mapped.procesos.asMin,
        asMax: mapped.procesos.asMax,
        c: mapped.procesos.c,
        chequeoSeccionControlada: mapped.procesos.chequeoSeccionControlada,
      },
    }
  })
}
