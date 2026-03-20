import { useState, useMemo } from "react"
import {
  chequearSeccion,
  validarDisenoFlexion,
  PHI_FLEXION,
  BRAZO_J,
  type ChequeoResult,
  type ErroresDisenoFlexion,
} from "./diseno-flexion"

export interface DisenoFlexionState {
  // Inputs
  M1: string
  setM1: (v: string) => void
  Mcenter: string
  setMcenter: (v: string) => void
  M2: string
  setM2: (v: string) => void
  // Derived
  chequeo: ChequeoResult
  procesos?: {
    condicion1?: { formula: string; sustitucion: string }
    condicion2?: { formula: string; sustitucion: string }
    general?: { formula: string; sustitucion: string }
    brazoJ?: { formula: string; sustitucion: string }
  }
  PHI_FLEXION: number
  BRAZO_J: number
  // Validation
  errors: ErroresDisenoFlexion
  isValid: boolean
}

/**
 * APPLICATION LAYER — Estado y lógica del Paso 3: Diseño a Flexión.
 *
 * @param portico - Tipo de pórtico del Paso 1
 * @param L  - Luz (m) del Paso 1
 * @param d  - Peralte efectivo (cm) del Paso 1
 * @param bw - Ancho (cm) del Paso 1
 * @param h  - Altura (cm) del Paso 1
 */
export function useDisenoFlexion(
  portico: string,
  L: number,
  d: number,
  bw: number,
  h: number
): DisenoFlexionState {
  const [M1, setM1] = useState("")
  const [Mcenter, setMcenter] = useState("")
  const [M2, setM2] = useState("")

  const chequeo = useMemo(
    () => chequearSeccion(portico, L, d, bw, h),
    [portico, L, d, bw, h]
  )

  const errors = useMemo(
    () =>
      validarDisenoFlexion({
        M1: Number(M1),
        Mcenter: Number(Mcenter),
        M2: Number(M2),
      }),
    [M1, Mcenter, M2]
  )
  const isValid =
    Object.keys(errors).length === 0 &&
    !!M1 &&
    !!Mcenter &&
    !!M2 &&
    chequeo.result === "Ok"

  return {
    M1,
    setM1,
    Mcenter,
    setMcenter,
    M2,
    setM2,
    chequeo: chequeo.result,
    procesos: chequeo.procesos,
    PHI_FLEXION,
    BRAZO_J,
    errors,
    isValid,
  }
}
