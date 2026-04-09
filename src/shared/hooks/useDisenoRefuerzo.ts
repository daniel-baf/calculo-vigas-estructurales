/**
 * APPLICATION LAYER — Hook genérico para diseño de refuerzo a flexión
 * Módulo: shared/hooks
 *
 * Reutilizable para M1, M2, M+, M-, Mcenter, etc.
 */

import { useState, useMemo } from "react"
import {
  calcularRefuerzo,
  validarRefuerzo,
  generarVariantes,
  type ResultadoRefuerzo,
  type ErroresRefuerzo,
  type AlertasRefuerzo,
} from "../diseno-refuerzo"

export interface DisenoRefuerzoState {
  asEtabs: string
  setAsEtabs: (v: string) => void
  qty1: string
  setQty1: (v: string) => void
  no1: number
  setNo1: (v: number) => void
  qty2: string
  setQty2: (v: string) => void
  no2: number
  setNo2: (v: number) => void
  resultado: ResultadoRefuerzo | null
  asMin: number
  errors: ErroresRefuerzo
  alertas: AlertasRefuerzo
  isValid: boolean
  nosPermitidos: number[]
  setNosPermitidos: (nos: number[]) => void
  variantes: ResultadoRefuerzo[]
  maxVariantes: string
  setMaxVariantes: (v: string) => void
  soloHorizontales: boolean
  setSoloHorizontales: (v: boolean) => void
  buscarVariantes: () => void
  limpiarVariantes: () => void
  seleccionarVariante: (v: ResultadoRefuerzo) => void
}

export interface UseDisenoRefuerzoInitialValues {
  qty1?: string
  no1?: number
  qty2?: string
  no2?: number
}

export interface UseDisenoRefuerzoParams {
  momento: number
  momentoLabel: string
  phiFlexion: number
  brazoJ: number
  fc: number
  fy: number
  beta: number
  bw: number
  d: number
  initialValues?: UseDisenoRefuerzoInitialValues
}

export function useDisenoRefuerzo(
  params: UseDisenoRefuerzoParams
): DisenoRefuerzoState {
  const {
    momento,
    momentoLabel,
    phiFlexion,
    brazoJ,
    fc,
    fy,
    beta,
    bw,
    d,
    initialValues,
  } = params

  const [asEtabs, setAsEtabs] = useState("")
  const [qty1, setQty1] = useState(initialValues?.qty1 ?? "")
  const [no1, setNo1] = useState<number>(initialValues?.no1 ?? 6)
  const [qty2, setQty2] = useState(initialValues?.qty2 ?? "")
  const [no2, setNo2] = useState<number>(initialValues?.no2 ?? 0)

  const [nosPermitidos, setNosPermitidos] = useState<number[]>([3, 4, 5, 6])
  const [variantes, setVariantes] = useState<ResultadoRefuerzo[]>([])
  const [maxVariantes, setMaxVariantes] = useState("20")
  const [soloHorizontales, setSoloHorizontales] = useState(false)

  const { errors, alertas } = useMemo(
    () =>
      validarRefuerzo({
        asEtabs: Number(asEtabs),
        qty1: Number(qty1),
        no1,
        qty2: Number(qty2),
        no2,
      }),
    [asEtabs, qty1, no1, qty2, no2]
  )

  const resultado = useMemo<ResultadoRefuerzo | null>(() => {
    const hasBase = !!asEtabs && !!qty1 && !!no1
    if (!hasBase) return null
    return calcularRefuerzo({
      momento,
      momentoLabel,
      phiFlexion,
      brazoJ,
      fc,
      fy,
      beta,
      bw,
      d,
      asEtabs: Number(asEtabs),
      qty1: Number(qty1),
      no1,
      qty2: Number(qty2),
      no2,
    })
  }, [
    momento,
    momentoLabel,
    phiFlexion,
    brazoJ,
    fc,
    fy,
    beta,
    bw,
    d,
    asEtabs,
    qty1,
    no1,
    qty2,
    no2,
  ])

  const isValid =
    Object.keys(errors).length === 0 &&
    !!asEtabs &&
    !!qty1 &&
    !!no1 &&
    resultado !== null &&
    resultado.chequeoAsEtabs === "Ok" &&
    resultado.chequeo_dc === "Ok" &&
    resultado.chequeoAsMinMax === "Ok" &&
    resultado.chequeoSeccionControlada === "Ok"

  const buscarVariantes = () => {
    if (!asEtabs || isNaN(Number(asEtabs))) return
    const res = generarVariantes(
      {
        momento,
        momentoLabel,
        phiFlexion,
        brazoJ,
        fc,
        fy,
        beta,
        bw,
        d,
        asEtabs: Number(asEtabs),
      },
      {
        nosPermitidos,
        maxOpciones: Number(maxVariantes) || 20,
        soloHorizontales,
      }
    )
    setVariantes(res)
  }

  const seleccionarVariante = (v: ResultadoRefuerzo) => {
    setQty1(v.inputs.qty1.toString())
    setNo1(v.inputs.no1)
    setQty2(v.inputs.qty2 === 0 ? "" : v.inputs.qty2.toString())
    setNo2(v.inputs.no2)
  }

  return {
    asEtabs,
    setAsEtabs,
    qty1,
    setQty1,
    no1,
    setNo1,
    qty2,
    setQty2,
    no2,
    setNo2,
    resultado,
    asMin: resultado?.asMin ?? 0,
    errors,
    alertas,
    isValid,
    nosPermitidos,
    setNosPermitidos,
    variantes,
    maxVariantes,
    setMaxVariantes,
    soloHorizontales,
    setSoloHorizontales,
    buscarVariantes,
    limpiarVariantes: () => setVariantes([]),
    seleccionarVariante,
  }
}
