import { RefuerzoProposedSteelSection } from "~/components/flexion/RefuerzoProposedSteelSection"
import type { DisenoFlexionM1State } from "../useDisenoFlexionM1"

type Props = Pick<
  DisenoFlexionM1State,
  | "qty1"
  | "setQty1"
  | "no1"
  | "setNo1"
  | "qty2"
  | "setQty2"
  | "no2"
  | "setNo2"
  | "alertas"
  | "errors"
>

export function ProposedSteelSection(props: Props) {
  return (
    <RefuerzoProposedSteelSection
      qty1={props.qty1}
      setQty1={props.setQty1}
      no1={props.no1}
      setNo1={props.setNo1}
      qty2={props.qty2}
      setQty2={props.setQty2}
      no2={props.no2}
      setNo2={props.setNo2}
      alertas={props.alertas}
      errors={props.errors}
    />
  )
}
