import type { ResultadoRefuerzo } from "@/shared/diseno-refuerzo"

export type ChequeoTexto = "Ok" | "No Ok" | "No chequea"

export interface RefuerzoProcessos {
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

export interface RefuerzoMappedResult {
  asRequerido: number
  asPropuesta: number
  chequeoAsEtabs: ChequeoTexto
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
  procesos: RefuerzoProcessos
}

export function mapRefuerzoResult(
  res: ResultadoRefuerzo
): RefuerzoMappedResult {
  return {
    asRequerido: res.asRequerido,
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
      asRequerido: res.procesos.asRequerido,
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
