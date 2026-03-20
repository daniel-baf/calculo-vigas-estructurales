import { useState, useMemo } from "react"
import {
  calcularCargasGravitacionales,
  calcularCargasIntermedias,
  validarCargasGravitacionales,
  type InputsCargasGravitacionales,
  type ResultadosCargasTabla,
  type ResultadosCargasIntermedios,
  type ErroresCargas,
} from "./cargas-gravitacionales"

export interface CargasGravitacionalesState {
  // Inputs
  AT: number | string
  setAT: (v: string) => void
  cvKgM2: number | string
  setCvKgM2: (v: string) => void
  scKgM2: number | string
  setScKgM2: (v: string) => void
  Svd: number | string
  setSvd: (v: string) => void
  // Derived (intermedios)
  intermedios: ResultadosCargasIntermedios | null
  // Derived (tabla)
  resultados: ResultadosCargasTabla | null
  // Validation
  errors: ErroresCargas
  isValid: boolean
  getData: () => Record<string, unknown>
}

/**
 * APPLICATION LAYER — Estado y lógica del Paso 2: Cargas Gravitacionales.
 *
 * Recibe bw y h del Paso 1 para calcular el peso propio de la viga.
 */
export function useCargasGravitacionales(
  bw: number,
  h: number
): CargasGravitacionalesState {
  const [AT, setATRaw] = useState<string>("")
  const [cvKgM2, setCvKgM2Raw] = useState<string>("")
  const [scKgM2, setScKgM2Raw] = useState<string>("")
  const [Svd, setSvdRaw] = useState<string>("0")

  const setAT = (v: string) => setATRaw(v)
  const setCvKgM2 = (v: string) => setCvKgM2Raw(v)
  const setScKgM2 = (v: string) => setScKgM2Raw(v)
  const setSvd = (v: string) => setSvdRaw(v)

  const inputs = useMemo<InputsCargasGravitacionales>(
    () => ({
      AT: Number(AT),
      cvKgM2: Number(cvKgM2),
      scKgM2: Number(scKgM2),
      Svd: Number(Svd),
      bw,
      h,
    }),
    [AT, cvKgM2, scKgM2, Svd, bw, h]
  )

  const errors = useMemo(() => validarCargasGravitacionales(inputs), [inputs])
  const isValid = Object.keys(errors).length === 0

  const intermedios = useMemo<ResultadosCargasIntermedios | null>(() => {
    if (!Number(AT) || (!Number(cvKgM2) && Number(cvKgM2) !== 0)) return null
    return calcularCargasIntermedias({
      AT: Number(AT),
      cvKgM2: Number(cvKgM2),
      scKgM2: Number(scKgM2),
    })
  }, [AT, cvKgM2, scKgM2])

  const resultados = useMemo<ResultadosCargasTabla | null>(() => {
    if (!isValid) return null
    return calcularCargasGravitacionales(inputs)
  }, [isValid, inputs])

  const getData = () => ({ ...inputs, intermedios, resultados })

  return {
    AT,
    setAT,
    cvKgM2,
    setCvKgM2,
    scKgM2,
    setScKgM2,
    Svd,
    setSvd,
    intermedios,
    resultados,
    errors,
    isValid,
    getData,
  }
}
