import { ResultRow } from "@/components/ui/ResultRow"
import type { DisenoFlexionState } from "../useDisenoFlexion"

type Props = Pick<DisenoFlexionState, "PHI_FLEXION" | "BRAZO_J" | "procesos">

export function CheckCards({ PHI_FLEXION, BRAZO_J, procesos }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ResultRow
        label="Factor φ a flexión"
        value={PHI_FLEXION}
        proceso={"\phi = 0.90"}
      />
      <ResultRow
        label="Brazo J (asumido)"
        value={BRAZO_J}
        highlight
        proceso={procesos?.brazoJ}
      />
    </div>
  )
}
