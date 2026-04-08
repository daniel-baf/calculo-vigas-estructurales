import { RefuerzoVariantsSection } from "~/components/flexion/RefuerzoVariantsSection"
import type { ResultadoDisenoM2 } from "../diseno-flexion-m2"
import type { DisenoFlexionM2State } from "../useDisenoFlexionM2"

type Props = Pick<DisenoFlexionM2State, "variantes" | "seleccionarVariante">

export function VariantsSection({ variantes, seleccionarVariante }: Props) {
  return (
    <RefuerzoVariantsSection<ResultadoDisenoM2>
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
