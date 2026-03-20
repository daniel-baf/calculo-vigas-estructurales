/**
 * DOMAIN LAYER — Generador de variantes de refuerzo
 * Módulo: shared/diseno-refuerzo
 */

import {
  calcularRefuerzo,
  type InputsRefuerzo,
  type ResultadoRefuerzo,
} from "./calculo-refuerzo"

export interface FiltroVariantes {
  nosPermitidos: number[]
  maxOpciones?: number
  soloHorizontales?: boolean
}

export function generarVariantes(
  inpBase: Omit<InputsRefuerzo, "qty1" | "no1" | "qty2" | "no2">,
  filtro: FiltroVariantes
): ResultadoRefuerzo[] {
  const { nosPermitidos, maxOpciones = 20, soloHorizontales = false } = filtro
  const resultados: ResultadoRefuerzo[] = []

  const nos = Array.from(new Set(nosPermitidos)).sort((a, b) => a - b)

  for (const s1 of nos) {
    if (s1 === 0) continue
    const opcionesS2 = soloHorizontales ? [0, ...nos] : [...nos]

    for (const s2 of opcionesS2) {
      if (s2 !== 0 && s1 === s2) continue

      for (let q1 = 2; q1 <= 6; q1++) {
        const startQ2 = s2 === 0 ? 0 : 1
        const endQ2 = s2 === 0 ? 0 : 4

        for (let q2 = startQ2; q2 <= endQ2; q2++) {
          const res = calcularRefuerzo({
            ...inpBase,
            qty1: q1,
            no1: s1,
            qty2: q2,
            no2: s2,
          })

          if (
            res.chequeoAsEtabs === "Ok" &&
            res.chequeo_dc === "Ok" &&
            res.chequeoAsMinMax === "Ok" &&
            res.chequeoSeccionControlada === "Ok"
          ) {
            resultados.push(res)
          }
        }
      }
    }
  }

  resultados.sort((a, b) => a.asPropuesta - b.asPropuesta)

  const finalResults: ResultadoRefuerzo[] = []
  const seenArmados = new Set<string>()

  for (const r of resultados) {
    if (!seenArmados.has(r.armadoSuperior)) {
      seenArmados.add(r.armadoSuperior)
      finalResults.push(r)
    }
    if (finalResults.length >= maxOpciones) break
  }

  return finalResults
}
