/**
 * APPLICATION LAYER — Paso 8: Diseño a Flexión M2(+) L. Derecho.
 */

import { useState, useMemo } from "react"
import {
  type M2PosInput,
  calcularDisenoM2Pos,
  buscarVariantesM2Pos,
} from "./diseno-flexion-m2-pos"
import type { ResultadoRefuerzo } from "@/shared/diseno-refuerzo"

export interface UseM2PosProps {
  fc: number
  fy: number
  bw: number
  d: number
  beta: number
  portico: string
  phiMnNegM2: number // φMn del Paso 4 (M2 negativo)
  asMin: number
}

export function useDisenoFlexionM2Pos({
  fc,
  fy,
  bw,
  d,
  beta,
  portico,
  phiMnNegM2,
  asMin,
}: UseM2PosProps) {
  const [asEtabs, setAsEtabs] = useState("")
  const [n1, setN1] = useState("3")
  const [no1, setNo1] = useState<number>(4)
  const [n2, setN2] = useState("0")
  const [no2, setNo2] = useState<number>(4)

  // Configuración de variantes
  const [nosPermitidos, setNosPermitidos] = useState<number[]>([3, 4, 5])
  const [variantes, setVariantes] = useState<ResultadoRefuerzo[]>([])
  const [maxVariantes, setMaxVariantes] = useState("5")
  const [soloHorizontales, setSoloHorizontales] = useState(true)

  const input: M2PosInput = { asEtabs, n1, no1, n2, no2 }

  const params = useMemo(
    () => ({
      fc,
      fy,
      bw,
      d,
      beta,
      portico,
      phiMnNegM2,
      asMin,
    }),
    [fc, fy, bw, d, beta, portico, phiMnNegM2, asMin]
  )

  const resultado = useMemo(() => {
    return calcularDisenoM2Pos(params, input)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, input])

  // Validaciones de UI
  const errors: Record<string, string> = { ...(resultado?.errors || {}) }
  if (parseFloat(asEtabs) < 0) errors.asEtabs = "No puede ser negativo"

  const isValid = !!resultado && resultado.cumpleDC

  const buscarVariantes = () => {
    const res = buscarVariantesM2Pos(
      params,
      parseFloat(asEtabs) || 0,
      nosPermitidos,
      parseInt(maxVariantes) || 5,
      soloHorizontales
    )
    setVariantes(res)
  }

  const limpiarVariantes = () => setVariantes([])

  const seleccionarVariante = (v: ResultadoRefuerzo) => {
    setN1(v.inputs.qty1.toString())
    setNo1(v.inputs.no1)
    setN2(v.inputs.qty2.toString())
    setNo2(v.inputs.no2)
    setVariantes([])
  }

  return {
    asEtabs,
    setAsEtabs,
    n1,
    setN1,
    no1,
    setNo1,
    n2,
    setN2,
    no2,
    setNo2,
    resultado,
    errors,
    isValid,
    nosPermitidos,
    setNosPermitidos,
    variantes,
    maxVariantes,
    setMaxVariantes,
    soloHorizontales,
    setSoloHorizontales,
    buscarVariantes,
    limpiarVariantes,
    seleccionarVariante,
  }
}

export type M2PosState = ReturnType<typeof useDisenoFlexionM2Pos>
