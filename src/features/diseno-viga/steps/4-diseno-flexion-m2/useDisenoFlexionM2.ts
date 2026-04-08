/**
 * APPLICATION LAYER — Paso 4: Diseño a Flexión M2(−) Lado Derecho.
 *
 * Thin wrapper sobre useDisenoRefuerzo.
 */

import {
  useDisenoRefuerzo,
  type UseDisenoRefuerzoParams,
} from "@/shared/hooks/useDisenoRefuerzo"
import { PHI_FLEXION, BRAZO_J } from "~/steps/3-diseno-flexion/diseno-flexion"
import type {
  ResultadoDisenoM2,
  ErroresDisenoM2,
  AlertasDisenoM2,
} from "./diseno-flexion-m2"

export interface DisenoFlexionM2State {
  asM2Base: number
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
  resultado: ResultadoDisenoM2 | null
  asMin: number
  errors: ErroresDisenoM2
  alertas: AlertasDisenoM2
  isValid: boolean
  nosPermitidos: number[]
  setNosPermitidos: (nos: number[]) => void
  variantes: ResultadoDisenoM2[]
  maxVariantes: string
  setMaxVariantes: (v: string) => void
  soloHorizontales: boolean
  setSoloHorizontales: (v: boolean) => void
  buscarVariantes: () => void
  limpiarVariantes: () => void
  seleccionarVariante: (v: ResultadoDisenoM2) => void
}

export function useDisenoFlexionM2(
  M2: number,
  fc: number,
  fy: number,
  beta: number,
  bw: number,
  d: number
): DisenoFlexionM2State {
  const asM2Base = (M2 * 100) / (PHI_FLEXION * fy * BRAZO_J * d)
  const params: UseDisenoRefuerzoParams = {
    momento: M2,
    momentoLabel: "M2",
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
    asM2Base,
    ...shared,
    resultado: shared.resultado as unknown as ResultadoDisenoM2 | null,
    errors: shared.errors as unknown as ErroresDisenoM2,
    alertas: shared.alertas as unknown as AlertasDisenoM2,
    variantes: shared.variantes as unknown as ResultadoDisenoM2[],
    seleccionarVariante: (v) =>
      shared.seleccionarVariante(
        v as unknown as Parameters<typeof shared.seleccionarVariante>[0]
      ),
  }
}
