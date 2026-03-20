import { useState, useMemo } from "react"
import {
  calcularBeta,
  calcularPeralteEfectivo,
  validarParametrosBasicos,
  GRADOS_ACERO,
  TIPOS_CONCRETO,
  TIPOS_PORTICO,
  FC_MIN,
  BW_MIN,
  H_MIN,
  REC_MIN,
  type GradoAceroKey,
  type TipoConcretoKey,
  type ErroresParametros,
} from "./parametros-basicos"

export interface ParametrosBasicosState {
  // Inputs
  fc: number
  setFc: (v: number | string) => void
  gradoAcero: GradoAceroKey
  setGradoAcero: (v: GradoAceroKey) => void
  tipoConcreto: TipoConcretoKey
  setTipoConcreto: (v: TipoConcretoKey) => void
  portico: string
  setPortico: (v: string) => void
  bw: number
  setBw: (v: number | string) => void
  h: number
  setH: (v: number | string) => void
  rec: number
  setRec: (v: number | string) => void
  L: number | string
  setL: (v: number | string) => void
  // Derived
  fy: number
  lambda: number
  beta: number | null
  d: number
  // Validation
  errors: ErroresParametros
  isValid: boolean
  getData: () => Record<string, unknown>
  // Catálogos (para la UI)
  GRADOS_ACERO: typeof GRADOS_ACERO
  TIPOS_CONCRETO: typeof TIPOS_CONCRETO
  TIPOS_PORTICO: typeof TIPOS_PORTICO
  FC_MIN: number
  BW_MIN: number
  H_MIN: number
  REC_MIN: number
}

/**
 * APPLICATION LAYER — Estado y lógica del Paso 1: Parámetros Básicos.
 *
 * Gestiona todos los inputs, calcula los valores derivados en tiempo real
 * y valida los campos antes de permitir avanzar al siguiente paso.
 */
export function useParametrosBasicos(): ParametrosBasicosState {
  const [fc, setFc] = useState<number>(FC_MIN)
  const [gradoAcero, setGradoAcero] = useState<GradoAceroKey>("G60")
  const [tipoConcreto, setTipoConcreto] = useState<TipoConcretoKey>("NORMAL")
  const [portico, setPortico] = useState<string>("P.O")
  const [bw, setBw] = useState<number>(BW_MIN)
  const [h, setH] = useState<number>(H_MIN)
  const [rec, setRec] = useState<number>(REC_MIN)
  const [L, setL] = useState<number | string>("")

  const fy = GRADOS_ACERO[gradoAcero].fy
  const lambda = TIPOS_CONCRETO[tipoConcreto].lambda
  const beta = useMemo(() => calcularBeta(Number(fc)), [fc])
  const d = useMemo(
    () => calcularPeralteEfectivo(Number(h), Number(rec)),
    [h, rec]
  )

  const errors = useMemo(
    () =>
      validarParametrosBasicos({
        fc: Number(fc),
        bw: Number(bw),
        h: Number(h),
        rec: Number(rec),
        L: Number(L),
      }),
    [fc, bw, h, rec, L]
  )
  const isValid = Object.keys(errors).length === 0

  const getData = () => ({
    fc: Number(fc),
    fy,
    lambda,
    beta,
    d,
    gradoAcero,
    tipoConcreto,
    portico,
    bw: Number(bw),
    h: Number(h),
    rec: Number(rec),
    L: Number(L),
  })

  // Helpers para aceptar string|number desde inputs HTML
  const numSetter = (setter: (v: number) => void) => (v: number | string) =>
    setter(v === "" ? 0 : Number(v))

  return {
    fc,
    setFc: numSetter(setFc),
    gradoAcero,
    setGradoAcero,
    tipoConcreto,
    setTipoConcreto,
    portico,
    setPortico,
    bw,
    setBw: numSetter(setBw),
    h,
    setH: numSetter(setH),
    rec,
    setRec: numSetter(setRec),
    L,
    setL,
    fy,
    lambda,
    beta,
    d,
    errors,
    isValid,
    getData,
    GRADOS_ACERO,
    TIPOS_CONCRETO,
    TIPOS_PORTICO,
    FC_MIN,
    BW_MIN,
    H_MIN,
    REC_MIN,
  }
}
