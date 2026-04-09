/**
 * APPLICATION LAYER — Hook para Diseño por Momento Mínimo Longitudinal (Paso 9).
 */

import React, { useMemo, useEffect } from "react"
import {
  useDisenoRefuerzo,
  type UseDisenoRefuerzoParams,
} from "@/shared/hooks/useDisenoRefuerzo"
import { PHI_FLEXION, BRAZO_J } from "~/steps/3-diseno-flexion/diseno-flexion"

export interface UseMomentoMinimoParams {
  fc: number
  fy: number
  beta: number
  bw: number
  d: number
  portico: string
  phiMnM1Neg: number
  phiMnM2Neg: number
}

export function useMomentoMinimo(params: UseMomentoMinimoParams) {
  const { fc, fy, beta, bw, d, portico, phiMnM1Neg, phiMnM2Neg } = params

  const maxMomentoCaras = useMemo(() => {
    return Math.max(phiMnM1Neg, phiMnM2Neg)
  }, [phiMnM1Neg, phiMnM2Neg])

  const momentoMinimoDemandado = useMemo(() => {
    if (portico === "P.I") return maxMomentoCaras / 5
    if (portico === "P.E") return maxMomentoCaras / 4
    return 0
  }, [maxMomentoCaras, portico])

  const asRequerido = useMemo(() => {
    return (momentoMinimoDemandado * 100) / (PHI_FLEXION * fy * BRAZO_J * d)
  }, [momentoMinimoDemandado, fy, d])

  const disenoParams: UseDisenoRefuerzoParams = {
    momento: momentoMinimoDemandado,
    momentoLabel: "M_min",
    phiFlexion: PHI_FLEXION,
    brazoJ: BRAZO_J,
    fc,
    fy,
    beta,
    bw,
    d,
  }

  const shared = useDisenoRefuerzo(disenoParams)
  const { setAsEtabs } = shared

  const [asMinUser, setAsMinUser] = React.useState("")

  // Sync auto-calculated AsRequerido with hook's internal "asEtabs"
  // This allows shared validations (AsPropuesto >= asEtabs) to work correctly serving as our AsPropuesto >= AsReq.
  useEffect(() => {
    if (asRequerido > 0) {
      setAsEtabs(asRequerido.toFixed(2))
    }
  }, [asRequerido, setAsEtabs])

  // Enhance Validations manually for Step 9 specific checks if necessary
  const roundedAsMinUser = Number(asMinUser) || 0

  const resultadoExt = useMemo(() => {
    if (!shared.resultado) return null

    // Excel para el Paso 9 calcula "a" usando AsRequerido ("Acero As", D152) y no AsPropuesta
    const customA = (asRequerido * fy) / (0.85 * fc * bw)
    const customPhiMn = (PHI_FLEXION * shared.resultado.asPropuesta * fy * (d - customA / 2)) / 100
    const customDc = customPhiMn > 0 ? momentoMinimoDemandado / customPhiMn : Infinity

    const customC = beta > 0 ? customA / beta : 0
    const limiteC = 0.375 * d
    const customChequeoSeccionControlada: ("Ok" | "No Ok") = customC < limiteC ? "Ok" : "No Ok"

    return {
      ...shared.resultado,
      asMin: roundedAsMinUser,
      chequeoAsMinMax: (shared.resultado.asPropuesta >= roundedAsMinUser ? "Ok" : "No Ok") as "Ok" | "No Ok",
      a: customA,
      phiMn: customPhiMn,
      dc: customDc,
      chequeo_dc: (customDc <= 1 ? "Ok" : "No Ok") as "Ok" | "No Ok",
      c: customC,
      chequeoSeccionControlada: customChequeoSeccionControlada,
      procesos: {
        ...shared.resultado.procesos,
        a: {
          formula: `a = (As,req × fy) / (0.85 × f'c × bw)`,
          sustitucion: `= (${asRequerido.toFixed(2)} × ${fy}) / (0.85 × ${fc} × ${bw}) = ${customA.toFixed(2)} cm`,
        },
        phiMn: {
          formula: `φ Mn = (φ × As,prop × fy × (d - a/2)) / 100`,
          sustitucion: `= (${PHI_FLEXION} × ${shared.resultado.asPropuesta.toFixed(2)} × ${fy} × (${d} - ${customA.toFixed(2)}/2)) / 100 = ${customPhiMn.toFixed(2)} kgf·m`,
        },
        dc: {
          formula: `D/C = M,min / φ Mn`,
          sustitucion: `= ${momentoMinimoDemandado.toFixed(2)} / ${customPhiMn.toFixed(2)} = ${customDc.toFixed(2)}`,
        },
      }
    }
  }, [shared.resultado, roundedAsMinUser, asRequerido, fy, fc, bw, d, momentoMinimoDemandado, beta])

  const checkAsMinMaxExt = shared.resultado?.asPropuesta && shared.resultado.asPropuesta >= roundedAsMinUser ? "Ok" : "No Ok"

  const isValidExt =
    shared.isValid &&
    !!asMinUser &&
    shared.resultado !== null &&
    checkAsMinMaxExt === "Ok" &&
    shared.resultado.chequeoSeccionControlada === "Ok"

  return {
    ...shared,
    maxMomentoCaras,
    momentoMinimoDemandado,
    asRequerido,
    asMinUser,
    setAsMinUser,
    resultado: resultadoExt,
    isValid: isValidExt,
  }
}
