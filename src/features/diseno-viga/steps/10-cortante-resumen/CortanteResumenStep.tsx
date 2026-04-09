import { useState } from "react"
import { VARILLA_MAP } from "@/shared/diseno-refuerzo/varillas"
import { StepSection } from "@/features/diseno-viga/components/flexion/StepSection"
import type { ParametrosBasicosState } from "@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos"
import type { DisenoFlexionM2State } from "@/features/diseno-viga/steps/4-diseno-flexion-m2/useDisenoFlexionM2"
import type { DisenoFlexionM1State } from "@/features/diseno-viga/steps/5-diseno-flexion-m1/useDisenoFlexionM1"
import type { M1PosState } from "@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/useDisenoFlexionM1Pos"
import type { DisenoFlexionMCentroState } from "@/features/diseno-viga/steps/7-diseno-flexion-m-center/useDisenoFlexionMCentro"
import type { M2PosState } from "@/features/diseno-viga/steps/8-diseno-flexion-m2-pos/useDisenoFlexionM2Pos"
import type { useMomentoMinimo } from "@/features/diseno-viga/steps/9-momento-minimo/useMomentoMinimo"
import { extractArgs, formatRebar } from "@/shared/diseno-refuerzo/formatUtils"
import { LongitudinalSummaryCard } from "@/features/diseno-viga/steps/10-cortante-resumen/components/LongitudinalSummaryCard"
import { SpacingParametersCard } from "@/features/diseno-viga/steps/10-cortante-resumen/components/SpacingParametersCard"
import { SpacingResultsCard } from "@/features/diseno-viga/steps/10-cortante-resumen/components/SpacingResultsCard"

type MomentoMinimoState = ReturnType<typeof useMomentoMinimo>

interface Props {
  step1?: ParametrosBasicosState
  step4?: DisenoFlexionM2State
  step5?: DisenoFlexionM1State
  step6?: M1PosState
  step7?: DisenoFlexionMCentroState
  step8?: M2PosState
  step9?: MomentoMinimoState
}
export function CortanteResumenStep(props: Props) {
  const [noVarilla, setNoVarilla] = useState("6")
  const [cantVarillas, setCantVarillas] = useState("4")

  const minArgs = extractArgs(props.step9)
  const minText = formatRebar(minArgs)

  const leftTop = formatRebar(extractArgs(props.step5))
  const leftBot = formatRebar(extractArgs(props.step6))

  const centerBot = formatRebar(extractArgs(props.step7))

  const rightTop = formatRebar(extractArgs(props.step4))
  const rightBot = formatRebar(extractArgs(props.step8))

  const bw = props.step1?.bw || 0
  const rec = props.step1?.rec || 0
  const diametro = VARILLA_MAP[Number(noVarilla)]?.diam || 0
  const qty = Number(cantVarillas) || 0

  const separacionLibre =
    qty > 1 ? (bw - 2 * rec - qty * diametro) / (qty - 1) : 0
  const sEje = qty > 1 ? separacionLibre + diametro : 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 10: Resumen y Cortante
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de armado longitudinal final, sustrayendo el acero continuo.
        </p>
      </div>

      <LongitudinalSummaryCard
        minText={minText}
        leftTop={leftTop}
        leftBot={leftBot}
        centerBot={centerBot}
        rightTop={rightTop}
        rightBot={rightBot}
      />

      <StepSection title="Verificación de Separación Libre">
        <div className="grid gap-4 md:grid-cols-2">
          <SpacingParametersCard
            bw={bw}
            rec={rec}
            noVarilla={noVarilla}
            cantVarillas={cantVarillas}
            onNoVarillaChange={setNoVarilla}
            onCantVarillasChange={setCantVarillas}
          />

          <SpacingResultsCard
            separacionLibre={separacionLibre}
            sEje={sEje}
            qty={qty}
          />
        </div>
      </StepSection>
    </div>
  )
}
