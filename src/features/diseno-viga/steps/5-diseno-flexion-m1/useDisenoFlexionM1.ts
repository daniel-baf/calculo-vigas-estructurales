/**
 * APPLICATION LAYER — Paso 5: Diseño a Flexión M1(−) Lado Izquierdo.
 *
 * Thin wrapper sobre useDisenoRefuerzo.
 */

import {
  useDisenoRefuerzo,
  type UseDisenoRefuerzoParams,
} from "@/shared/hooks/useDisenoRefuerzo"
import { PHI_FLEXION, BRAZO_J } from "~/steps/3-diseno-flexion/diseno-flexion"
import type {
  ResultadoDisenoM1,
  ErroresDisenoM1,
  AlertasDisenoM1,
} from "./diseno-flexion-m1"

export interface DisenoFlexionM1State {
  asM1Base: number
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
  resultado: ResultadoDisenoM1 | null
  asMin: number
  errors: ErroresDisenoM1
  alertas: AlertasDisenoM1
  isValid: boolean
  nosPermitidos: number[]
  setNosPermitidos: (nos: number[]) => void
  variantes: ResultadoDisenoM1[]
  maxVariantes: string
  setMaxVariantes: (v: string) => void
  soloHorizontales: boolean
  setSoloHorizontales: (v: boolean) => void
  buscarVariantes: () => void
  limpiarVariantes: () => void
  seleccionarVariante: (v: ResultadoDisenoM1) => void
}

export function useDisenoFlexionM1(
  M1: number,
  fc: number,
  fy: number,
  beta: number,
  bw: number,
  d: number
): DisenoFlexionM1State {
  const asM1Base = (M1 * 100) / (PHI_FLEXION * fy * BRAZO_J * d)
  const params: UseDisenoRefuerzoParams = {
    momento: M1,
    momentoLabel: "M1",
    phiFlexion: PHI_FLEXION,
    brazoJ: BRAZO_J,
    fc,
    fy,
    beta,
    bw,
    d,
  }

  const shared = useDisenoRefuerzo(params)

  return {
    asM1Base,
    ...shared,
    resultado: shared.resultado as unknown as ResultadoDisenoM1 | null,
    errors: shared.errors as unknown as ErroresDisenoM1,
    alertas: shared.alertas as unknown as AlertasDisenoM1,
    variantes: shared.variantes as unknown as ResultadoDisenoM1[],
    seleccionarVariante: (v) =>
      shared.seleccionarVariante(
        v as unknown as Parameters<typeof shared.seleccionarVariante>[0]
      ),
  }
}
