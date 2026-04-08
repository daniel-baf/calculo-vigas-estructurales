import { RefuerzoVariantsSection } from "~/components/flexion/RefuerzoVariantsSection"
import type { ResultadoDisenoM1 } from "../diseno-flexion-m1"
import type { DisenoFlexionM1State } from "../useDisenoFlexionM1"

type Props = Pick<DisenoFlexionM1State, "variantes" | "seleccionarVariante">

export function VariantsSection({ variantes, seleccionarVariante }: Props) {
  return (
    <RefuerzoVariantsSection<ResultadoDisenoM1>
      variantes={variantes}
      seleccionarVariante={seleccionarVariante}
      getArmado={(v) => v.armadoSuperior}
      getAs={(v) => v.asPropuesta}
      getDc={(v) => v.dc}
      getChequeoDc={(v) => v.chequeo_dc}
      showHorizWarning={(v) => v.inputs.no2 === 0}
    />
  )
}
