import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

import { useParametrosBasicos } from "@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos"
import { useCargasGravitacionales } from "@/features/diseno-viga/steps/2-cargas-gravitacionales/useCargasGravitacionales"
import { useDisenoFlexion } from "@/features/diseno-viga/steps/3-diseno-flexion/useDisenoFlexion"
import { useDisenoFlexionM2 } from "@/features/diseno-viga/steps/4-diseno-flexion-m2/useDisenoFlexionM2"
import { useDisenoFlexionM1 } from "@/features/diseno-viga/steps/5-diseno-flexion-m1/useDisenoFlexionM1"
import { useDisenoFlexionM1Pos } from "@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/useDisenoFlexionM1Pos"
import { useDisenoFlexionMCentro } from "@/features/diseno-viga/steps/7-diseno-flexion-m-center/useDisenoFlexionMCentro"
import { useDisenoFlexionM2Pos } from "@/features/diseno-viga/steps/8-diseno-flexion-m2-pos/useDisenoFlexionM2Pos"
import { useMomentoMinimo } from "@/features/diseno-viga/steps/9-momento-minimo/useMomentoMinimo"

import { ChecksBanner } from "@/components/ui/ChecksBanner"
import { Wizard } from "@/components/wizard/Wizard"
import { BeamProgressDiagram } from "@/components/beam-diagram/BeamProgressDiagram"
import { applyDesignWizardMock } from "@/features/diseno-viga/mock/applyDesignWizardMock"
import { createDesignWizardSteps } from "@/features/diseno-viga/config/designWizardSteps"

export function DesignWizard() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const step1 = useParametrosBasicos()
  const step2 = useCargasGravitacionales(step1.bw, step1.h)
  const step3 = useDisenoFlexion(
    step1.portico,
    step1.L as number,
    step1.d,
    step1.bw,
    step1.h
  )
  const step4 = useDisenoFlexionM2(
    Number(step3.M2),
    step1.fc,
    step1.fy,
    step1.beta ?? 0.85,
    step1.bw,
    step1.d
  )
  const step5 = useDisenoFlexionM1(
    Number(step3.M1),
    step1.fc,
    step1.fy,
    step1.beta ?? 0.85,
    step1.bw,
    step1.d
  )

  const step6 = useDisenoFlexionM1Pos({
    fc: step1.fc,
    fy: step1.fy,
    bw: step1.bw,
    h: step1.h,
    d: step1.d,
    rec: step1.rec,
    portico: step1.portico,
    phiMnNeg: step5.resultado?.phiMn || 0,
    asMin: step5.asMin,
  })

  const step7 = useDisenoFlexionMCentro(
    Number(step3.Mcenter),
    step1.fc,
    step1.fy,
    step1.beta ?? 0.85,
    step1.bw,
    step1.d,
    step6.qty1
      ? {
          qty1: step6.qty1,
          no1: step6.no1,
          qty2: step6.qty2,
          no2: step6.no2,
        }
      : undefined
  )

  const step8 = useDisenoFlexionM2Pos({
    fc: step1.fc,
    fy: step1.fy,
    bw: step1.bw,
    d: step1.d,
    beta: step1.beta ?? 0.85,
    portico: step1.portico,
    phiMnNegM2: step4.resultado?.phiMn || 0,
    asMin: step4.resultado?.asMin || 0,
  })

  const step9 = useMomentoMinimo({
    fc: step1.fc,
    fy: step1.fy,
    beta: step1.beta ?? 0.85,
    bw: step1.bw,
    d: step1.d,
    portico: step1.portico,
    phiMnM1Neg: step5.resultado?.phiMn || 0,
    phiMnM2Neg: step4.resultado?.phiMn || 0,
  })

  const showBanner = useMemo(() => {
    if (currentIdx === 2) {
      const filled = !!step3.M1 && !!step3.Mcenter && !!step3.M2
      return filled && step3.chequeo !== "Ok"
    }
    if (currentIdx === 3) {
      const filled = !!step4.asEtabs && !!step4.qty1 && !!step4.no1
      const allChecksOk =
        step4.resultado?.chequeoAsEtabs === "Ok" &&
        step4.resultado?.chequeo_dc === "Ok" &&
        step4.resultado?.chequeoAsMinMax === "Ok" &&
        step4.resultado?.chequeoSeccionControlada === "Ok"
      return filled && !allChecksOk
    }
    if (currentIdx === 4) {
      const filled = !!step5.asEtabs && !!step5.qty1 && !!step5.no1
      const allChecksOk =
        step5.resultado?.chequeoAsEtabs === "Ok" &&
        step5.resultado?.chequeo_dc === "Ok" &&
        step5.resultado?.chequeoAsMinMax === "Ok" &&
        step5.resultado?.chequeoSeccionControlada === "Ok"
      return filled && !allChecksOk
    }
    if (currentIdx === 5) {
      return !!step6.resultado && !step6.resultado.cumpleDC
    }
    if (currentIdx === 6) {
      const filled = !!step7.asEtabs && !!step7.qty1 && !!step7.no1
      const allChecksOk =
        step7.resultado?.chequeoAsEtabs === "Ok" &&
        step7.resultado?.chequeo_dc === "Ok" &&
        step7.resultado?.chequeoAsMinMax === "Ok" &&
        step7.resultado?.chequeoSeccionControlada === "Ok"
      return filled && !allChecksOk
    }
    if (currentIdx === 7) {
      return !!step8.resultado && !step8.resultado.cumpleDC
    }
    if (currentIdx === 8) {
      const filled = !!step9.qty1 && !!step9.no1
      const allChecksOk =
        step9.resultado?.chequeoAsEtabs === "Ok" &&
        step9.resultado?.chequeo_dc === "Ok" &&
        step9.resultado?.chequeoAsMinMax === "Ok" &&
        step9.resultado?.chequeoSeccionControlada === "Ok"
      return filled && !allChecksOk
    }
    return false
  }, [currentIdx, step3, step4, step5, step6, step7, step8, step9])

  const steps = createDesignWizardSteps({
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
    step9,
  })

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      )
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey || isTypingTarget(e.target)) return
      if (e.key.toLowerCase() !== "a") return

      e.preventDefault()
      applyDesignWizardMock({ step1, step2, step3, step4, step5, step6, step7, step8, step9 })
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [step1, step2, step3, step4, step5, step6, step7, step8, step9])

  return (
    <>
      <div className="dashboard-panel relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/8 to-transparent dark:from-primary/14" />
        <ChecksBanner show={showBanner} />
        <Wizard steps={steps} onStepChange={setCurrentIdx} />
      </div>

      {/* Diagrama progresivo de armado — visible cuando la viga tiene datos básicos */}
      {step1.isValid && (
        <div className="dashboard-panel mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <BeamProgressDiagram
            bw={step1.bw}
            h={step1.h}
            L={Number(step1.L)}
            currentStep={currentIdx}
            step4={{
              qty1: step4.qty1,
              no1: step4.no1,
              qty2: step4.qty2,
              no2: step4.no2,
              isValid: step4.isValid,
            }}
            step5={{
              qty1: step5.qty1,
              no1: step5.no1,
              qty2: step5.qty2,
              no2: step5.no2,
              isValid: step5.isValid,
            }}
            step6={{
              qty1: Number(step6.qty1),
              no1: step6.no1,
              qty2: Number(step6.qty2),
              no2: step6.no2,
              isValid: step6.isValid,
            }}
            step7={{
              qty1: step7.qty1,
              no1: step7.no1,
              qty2: step7.qty2,
              no2: step7.no2,
              isValid: step7.isValid,
            }}
            step8={{
              qty1: Number(step8.qty1),
              no1: step8.no1,
              qty2: Number(step8.qty2),
              no2: step8.no2,
              isValid: step8.isValid,
            }}
            step9={{
              qty1: step9.qty1,
              no1: step9.no1,
              qty2: step9.qty2,
              no2: step9.no2,
              isValid: step9.isValid,
            }}
          />
        </div>
      )}

      <div className="fixed right-4 bottom-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          className="border border-border shadow-lg dark:bg-card/90 dark:hover:bg-card"
          title="Ctrl + A"
          onClick={() =>
            applyDesignWizardMock({
              step1,
              step2,
              step3,
              step4,
              step5,
              step6,
              step7,
              step8,
              step9,
            })
          }
        >
          🧪 Autollenar Mock
        </Button>
      </div>
    </>
  )
}
