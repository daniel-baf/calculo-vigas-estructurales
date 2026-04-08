import { VariantsTable } from "~/components/flexion/VariantsTable"
import { TipCard } from "~/components/flexion/TipCard"
import { fmtNumber } from "~/components/flexion/fmtNumber"

export interface RefuerzoVariantsSectionProps<T> {
  variantes: T[]
  seleccionarVariante: (v: T) => void
  getArmado: (v: T) => string
  getAs: (v: T) => number
  getDc: (v: T) => number
  getChequeoDc: (v: T) => "Ok" | "No Ok"
  showHorizWarning?: (v: T) => boolean
}

export function RefuerzoVariantsSection<T>(
  props: RefuerzoVariantsSectionProps<T>
) {
  const {
    variantes,
    seleccionarVariante,
    getArmado,
    getAs,
    getDc,
    getChequeoDc,
    showHorizWarning,
  } = props

  if (variantes.length === 0) return null

  const fmt = (v: number | undefined | null, dec = 2) => fmtNumber(v, dec)

  return (
    <div className="space-y-3">
      <TipCard>
        <strong>Tip de optimización:</strong> Mientras más cerca esté el{" "}
        <strong>D/C a 1.00</strong>, el diseño es más eficiente y se requerirá{" "}
        <strong>menos acero de cortante</strong> (estribos).
      </TipCard>
      <VariantsTable<T>
        variantes={variantes}
        onSelect={seleccionarVariante}
        fmt={fmt}
        getArmado={getArmado}
        getAs={getAs}
        getDc={getDc}
        getChequeoDc={getChequeoDc}
        showHorizWarning={showHorizWarning}
      />
    </div>
  )
}
