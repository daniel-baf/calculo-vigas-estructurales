import type { ResultadoRefuerzo } from "@/shared/diseno-refuerzo"
import { TipCard } from "~/components/flexion/TipCard"
import { VariantsTable } from "~/components/flexion/VariantsTable"
import { fmtNumber } from "~/components/flexion/fmtNumber"
import type { M1PosState } from "../useDisenoFlexionM1Pos"

type Props = Pick<M1PosState, "variantes" | "seleccionarVariante">

export function VariantsSection({ variantes, seleccionarVariante }: Props) {
  if (variantes.length === 0) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-3">
      <TipCard>
        <strong>Tip de optimización:</strong> Mientras más cerca esté el{" "}
        <strong>D/C a 1.00</strong>, el diseño es más eficiente.
      </TipCard>
      <VariantsTable<ResultadoRefuerzo>
        variantes={variantes}
        onSelect={seleccionarVariante}
        fmt={fmt}
        getArmado={(v) => v.armadoSuperior}
        getAs={(v) => v.asPropuesta}
        getDc={(v) => v.dc}
        getChequeoDc={(v) => v.chequeo_dc as "Ok" | "No Ok"}
        showHorizWarning={(v) => v.inputs.no2 === 0}
      />
    </div>
  )
}
