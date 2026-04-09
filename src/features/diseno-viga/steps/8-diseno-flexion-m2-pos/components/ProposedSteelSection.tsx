import { RebarRow } from "~/components/flexion/RebarRow"
import type { M2PosState } from "../useDisenoFlexionM2Pos"

type Props = Pick<
  M2PosState,
  | "n1"
  | "setN1"
  | "no1"
  | "setNo1"
  | "n2"
  | "setN2"
  | "no2"
  | "setNo2"
  | "errors"
>

export function ProposedSteelSection({
  n1,
  setN1,
  no1,
  setNo1,
  n2,
  setN2,
  no2,
  setNo2,
  errors,
}: Props) {
  return (
    <div className="space-y-4">
      <RebarRow
        prefix="v1-m2pos"
        label="Capa 1 (Inf)"
        qty={n1}
        no={no1}
        onQtyChange={setN1}
        onNoChange={setNo1}
        qtyError={errors.n1}
        noError={errors.no1}
        alignLeft
      />
      <RebarRow
        prefix="v2-m2pos"
        label="Capa 2 (Inf)"
        qty={n2}
        no={no2}
        onQtyChange={setN2}
        onNoChange={setNo2}
        qtyError={errors.n2}
        noError={errors.no2}
        optional
        alignLeft
      />
    </div>
  )
}
