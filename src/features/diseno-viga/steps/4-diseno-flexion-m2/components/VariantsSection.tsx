import { VariantsTable } from "~/components/flexion/VariantsTable"
import { TipCard } from "~/components/flexion/TipCard"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { ResultadoDisenoM2 } from "../diseno-flexion-m2"
import type { DisenoFlexionM2State } from "../useDisenoFlexionM2"

type Props = Pick<DisenoFlexionM2State, "variantes" | "seleccionarVariante">

export function VariantsSection({ variantes, seleccionarVariante }: Props) {
  if (variantes.length === 0) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-3">
      <TipCard>
        <strong>Tip de optimización:</strong> Mientras más cerca esté el{" "}
        <strong>D/C a 1.00</strong>, el diseño es más eficiente y se requerirá{" "}
        <strong>menos acero de cortante</strong> (estribos).
      </TipCard>
      <VariantsTable<ResultadoDisenoM2>
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
