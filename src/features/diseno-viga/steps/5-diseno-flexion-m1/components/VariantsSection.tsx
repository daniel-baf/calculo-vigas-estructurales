import { VariantsTable } from "~/components/flexion/VariantsTable"
import { TipCard } from "~/components/flexion/TipCard"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { ResultadoDisenoM1 } from "../diseno-flexion-m1"
import type { DisenoFlexionM1State } from "../useDisenoFlexionM1"

type Props = Pick<DisenoFlexionM1State, "variantes" | "seleccionarVariante">

export function VariantsSection({ variantes, seleccionarVariante }: Props) {
  if (variantes.length === 0) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-3">
      <TipCard>
        <strong>Tip de optimización:</strong> Un diseño con{" "}
        <strong>D/C cercano a 1.00</strong> reduce la necesidad de estribos por
        cortante.
      </TipCard>
      <VariantsTable<ResultadoDisenoM1>
        variantes={variantes}
        onSelect={seleccionarVariante}
        fmt={fmt}
        getArmado={(v) => v.armadoSuperior}
        getAs={(v) => v.asPropuesta}
        getDc={(v) => v.dc}
        getChequeoDc={(v) => v.chequeo_dc}
        showHorizWarning={(v) => v.inputs.no2 === 0}
      />
    </div>
  )
}
