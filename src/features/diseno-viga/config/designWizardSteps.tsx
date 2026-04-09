import { lazy, Suspense } from "react"

import type { ParametrosBasicosState } from "@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos"
import type { CargasGravitacionalesState } from "@/features/diseno-viga/steps/2-cargas-gravitacionales/useCargasGravitacionales"
import type { DisenoFlexionState } from "@/features/diseno-viga/steps/3-diseno-flexion/useDisenoFlexion"
import type { DisenoFlexionM2State } from "@/features/diseno-viga/steps/4-diseno-flexion-m2/useDisenoFlexionM2"
import type { DisenoFlexionM1State } from "@/features/diseno-viga/steps/5-diseno-flexion-m1/useDisenoFlexionM1"
import type { M1PosState } from "@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/useDisenoFlexionM1Pos"
import type { DisenoFlexionMCentroState } from "@/features/diseno-viga/steps/7-diseno-flexion-m-center/useDisenoFlexionMCentro"
import type { M2PosState } from "@/features/diseno-viga/steps/8-diseno-flexion-m2-pos/useDisenoFlexionM2Pos"
import type { useMomentoMinimo } from "@/features/diseno-viga/steps/9-momento-minimo/useMomentoMinimo"

type MomentoMinimoState = ReturnType<typeof useMomentoMinimo>

const ParametrosBasicosStep = lazy(() =>
  import("@/features/diseno-viga/steps/1-parametros-basicos/ParametrosBasicosStep").then(
    (m) => ({ default: m.ParametrosBasicosStep })
  )
)
const CargasGravitacionalesStep = lazy(() =>
  import("@/features/diseno-viga/steps/2-cargas-gravitacionales/CargasGravitacionalesStep").then(
    (m) => ({ default: m.CargasGravitacionalesStep })
  )
)
const DisenoFlexionStep = lazy(() =>
  import("@/features/diseno-viga/steps/3-diseno-flexion/DisenoFlexionStep").then(
    (m) => ({ default: m.DisenoFlexionStep })
  )
)
const DisenoFlexionM2Step = lazy(() =>
  import("@/features/diseno-viga/steps/4-diseno-flexion-m2/DisenoFlexionM2Step").then(
    (m) => ({ default: m.DisenoFlexionM2Step })
  )
)
const DisenoFlexionM1Step = lazy(() =>
  import("@/features/diseno-viga/steps/5-diseno-flexion-m1/DisenoFlexionM1Step").then(
    (m) => ({ default: m.DisenoFlexionM1Step })
  )
)
const DisenoFlexionM1PosStep = lazy(() =>
  import("@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/DisenoFlexionM1PosStep").then(
    (m) => ({ default: m.DisenoFlexionM1PosStep })
  )
)
const CortanteResumenStep = lazy(() =>
  import("@/features/diseno-viga/steps/7-cortante-resumen/CortanteResumenStep").then(
    (m) => ({ default: m.CortanteResumenStep })
  )
)
const DisenoFlexionMCentroStep = lazy(() =>
  import("@/features/diseno-viga/steps/7-diseno-flexion-m-center/DisenoFlexionMCentroStep").then(
    (m) => ({ default: m.DisenoFlexionMCentroStep })
  )
)
const DisenoFlexionM2PosStep = lazy(() =>
  import("@/features/diseno-viga/steps/8-diseno-flexion-m2-pos/DisenoFlexionM2PosStep").then(
    (m) => ({ default: m.DisenoFlexionM2PosStep })
  )
)
const MomentoMinimoStep = lazy(() =>
  import("@/features/diseno-viga/steps/9-momento-minimo/MomentoMinimoStep").then(
    (m) => ({ default: m.MomentoMinimoStep })
  )
)

const stepFallback = (
  <div className="py-8 text-center text-sm text-muted-foreground">
    Cargando paso...
  </div>
)

interface CreateDesignWizardStepsProps {
  step1: ParametrosBasicosState
  step2: CargasGravitacionalesState
  step3: DisenoFlexionState
  step4: DisenoFlexionM2State
  step5: DisenoFlexionM1State
  step6: M1PosState
  step7: DisenoFlexionMCentroState
  step8: M2PosState
  step9: MomentoMinimoState
}

export function createDesignWizardSteps({
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  step8,
  step9,
}: CreateDesignWizardStepsProps) {
  return [
    {
      id: "parametros-basicos",
      title: "Datos Generales",
      component: (
        <Suspense fallback={stepFallback}>
          <ParametrosBasicosStep {...step1} />
        </Suspense>
      ),
      isValid: step1.isValid,
    },
    {
      id: "cargas-gravitacionales",
      title: "Cargas Gravitacionales",
      component: (
        <Suspense fallback={stepFallback}>
          <CargasGravitacionalesStep {...step2} />
        </Suspense>
      ),
      isValid: step2.isValid,
    },
    {
      id: "diseno-flexion",
      title: "Diseño de Flexión",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionStep {...step3} />
        </Suspense>
      ),
      isValid: step3.isValid,
    },
    {
      id: "diseno-flexion-m2",
      title: "M2(−) Derecho",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionM2Step {...step4} />
        </Suspense>
      ),
      isValid: step4.isValid,
    },
    {
      id: "diseno-flexion-m1",
      title: "M1(−) Izquierdo",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionM1Step {...step5} />
        </Suspense>
      ),
      isValid: step5.isValid,
    },
    {
      id: "diseno-flexion-m1-pos",
      title: "M1(+) Izquierdo",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionM1PosStep {...step6} />
        </Suspense>
      ),
      isValid: step6.isValid,
    },
    {
      id: "diseno-flexion-m-center",
      title: "M(+) Centro",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionMCentroStep {...step7} />
        </Suspense>
      ),
      isValid: step7.isValid,
    },
    {
      id: "diseno-flexion-m2-pos",
      title: "M2(+) Derecho",
      component: (
        <Suspense fallback={stepFallback}>
          <DisenoFlexionM2PosStep {...step8} />
        </Suspense>
      ),
      isValid: step8.isValid,
    },
    {
      id: "momento-minimo-longitudinal",
      title: "As Min Long.",
      component: (
        <Suspense fallback={stepFallback}>
          <MomentoMinimoStep {...step9} />
        </Suspense>
      ),
      isValid: step9.isValid,
    },
    {
      id: "cortante-resumen",
      title: "Resumen",
      component: (
        <Suspense fallback={stepFallback}>
          <CortanteResumenStep />
        </Suspense>
      ),
      isValid: true,
    },
  ]
}
