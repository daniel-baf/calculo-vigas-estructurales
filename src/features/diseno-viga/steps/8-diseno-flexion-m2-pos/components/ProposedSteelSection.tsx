import { RebarRow } from "~/components/flexion/RebarRow"
import type { M2PosState } from "../useDisenoFlexionM2Pos"

type Props = Pick<
  M2PosState,
  | "qty1"
  | "setQty1"
  | "no1"
  | "setNo1"
  | "qty2"
  | "setQty2"
  | "no2"
  | "setNo2"
  | "errors"
>

export function ProposedSteelSection({
  qty1,
  setQty1,
  no1,
  setNo1,
  qty2,
  setQty2,
  no2,
  setNo2,
  errors,
}: Props) {
  return (
    <div className="space-y-4">
      <RebarRow
        prefix="v1"
        label="Capa 1 (Inf)"
        qty={qty1}
        no={no1}
        onQtyChange={setQty1}
        onNoChange={setNo1}
        qtyError={errors.qty1}
        noError={errors.no1}
        alignLeft
      />
      <RebarRow
        prefix="v2"
        label="Capa 2 (Inf)"
        qty={qty2}
        no={no2}
        onQtyChange={setQty2}
        onNoChange={setNo2}
        qtyError={errors.qty2}
        noError={errors.no2}
        optional
        alignLeft
      />
    </div>
  )
}
