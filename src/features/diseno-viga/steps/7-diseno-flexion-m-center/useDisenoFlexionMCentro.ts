/**
 * APPLICATION LAYER — Paso 7: Diseño a Flexión M(+) Centro de Viga.
 */

import {
  useDisenoRefuerzo,
  type UseDisenoRefuerzoParams,
} from "@/shared/hooks/useDisenoRefuerzo"
import { PHI_FLEXION, BRAZO_J } from "~/steps/3-diseno-flexion/diseno-flexion"
import type {
  ResultadoDisenoMCentro,
  ErroresDisenoMCentro,
  AlertasDisenoMCentro,
} from "./diseno-flexion-m-center"

export interface DisenoFlexionMCentroState {
  asMcenterBase: number
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
  resultado: ResultadoDisenoMCentro | null
  asMin: number
  errors: ErroresDisenoMCentro
  alertas: AlertasDisenoMCentro
  isValid: boolean
  nosPermitidos: number[]
  setNosPermitidos: (nos: number[]) => void
  variantes: ResultadoDisenoMCentro[]
  maxVariantes: string
  setMaxVariantes: (v: string) => void
  soloHorizontales: boolean
  setSoloHorizontales: (v: boolean) => void
  buscarVariantes: () => void
  limpiarVariantes: () => void
  seleccionarVariante: (v: ResultadoDisenoMCentro) => void
}

export function useDisenoFlexionMCentro(
  Mcenter: number,
  fc: number,
  fy: number,
  beta: number,
  bw: number,
  d: number
): DisenoFlexionMCentroState {
  const asMcenterBase = (Mcenter * 100) / (PHI_FLEXION * fy * BRAZO_J * d)
  const params: UseDisenoRefuerzoParams = {
    momento: Mcenter,
    momentoLabel: "M(+) Centro",
    phiFlexion: PHI_FLEXION,
    brazoJ: BRAZO_J,
    fc,
    fy,
    beta,
    bw,
    d,
  }

  const shared = useDisenoRefuerzo(params)
  const customErrors = { ...shared.errors }
  if (Number(shared.qty2) === 0) delete customErrors.qty2
  const isValid =
    !!shared.asEtabs &&
    !!shared.qty1 &&
    !!shared.no1 &&
    shared.resultado !== null

  return {
    asMcenterBase,
    ...shared,
    resultado: shared.resultado as unknown as ResultadoDisenoMCentro | null,
    errors: customErrors as unknown as ErroresDisenoMCentro,
    alertas: shared.alertas as unknown as AlertasDisenoMCentro,
    isValid,
    variantes: shared.variantes as unknown as ResultadoDisenoMCentro[],
    seleccionarVariante: (v) =>
      shared.seleccionarVariante(
        v as unknown as Parameters<typeof shared.seleccionarVariante>[0]
      ),
  }
}
