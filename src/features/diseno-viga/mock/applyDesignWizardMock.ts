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

interface ApplyDesignWizardMockProps {
  step1: Pick<
    ParametrosBasicosState,
    | "setFc"
    | "setGradoAcero"
    | "setTipoConcreto"
    | "setPortico"
    | "setBw"
    | "setH"
    | "setRec"
    | "setL"
  >
  step2: Pick<
    CargasGravitacionalesState,
    "setAT" | "setCvKgM2" | "setScKgM2" | "setSvd"
  >
  step3: Pick<DisenoFlexionState, "setM1" | "setMcenter" | "setM2">
  step4: Pick<
    DisenoFlexionM2State,
    "setAsEtabs" | "setQty1" | "setNo1" | "setQty2" | "setNo2"
  >
  step5: Pick<
    DisenoFlexionM1State,
    "setAsEtabs" | "setQty1" | "setNo1" | "setQty2" | "setNo2"
  >
  step6: Pick<M1PosState, "setAsEtabs" | "setQty1" | "setNo1">
  step7: Pick<
    DisenoFlexionMCentroState,
    "setAsEtabs" | "setQty1" | "setNo1" | "setQty2" | "setNo2"
  >
  step8: Pick<M2PosState, "setAsEtabs" | "setQty1" | "setNo1">
  step9: Pick<
    MomentoMinimoState,
    "setQty1" | "setNo1" | "setQty2" | "setNo2" | "setAsMinUser"
  >
}

export function applyDesignWizardMock({
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  step8,
  step9,
}: ApplyDesignWizardMockProps) {
  step1.setFc(280)
  step1.setGradoAcero("G60")
  step1.setTipoConcreto("NORMAL")
  step1.setPortico("P.E")
  step1.setBw(25)
  step1.setH(40)
  step1.setRec(4)
  step1.setL(6.05)

  step2.setAT("13.61")
  step2.setCvKgM2("300")
  step2.setScKgM2("215")
  step2.setSvd("0.2448")

  step3.setM1("8231.96")
  step3.setMcenter("4304.52")
  step3.setM2("8221.33")

  step4.setAsEtabs("6.63")
  step4.setQty1("2")
  step4.setNo1(6)
  step4.setQty2("1")
  step4.setNo2(4)

  step5.setAsEtabs("6.65")
  step5.setQty1("2")
  step5.setNo1(6)
  step5.setQty2("1")
  step5.setNo2(4)

  step6.setAsEtabs("3.18")
  step6.setQty1("3")
  step6.setNo1(4)

  step7.setAsEtabs("3.31")
  step7.setQty1("3")
  step7.setNo1(4)
  step7.setQty2("0")
  step7.setNo2(4)

  step8.setAsEtabs("3.17")
  step8.setQty1("3")
  step8.setNo1(4)

  step9.setQty1("3")
  step9.setNo1(4)
  step9.setQty2("0")
  step9.setNo2(4)
  step9.setAsMinUser("0.58")
}
