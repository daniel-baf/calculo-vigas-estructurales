import type { DisenoFlexionMCentroState } from "../useDisenoFlexionMCentro"
import { RefuerzoAreaEtabsSection } from "~/components/flexion/RefuerzoAreaEtabsSection"

type Props = Pick<
  DisenoFlexionMCentroState,
  | "asEtabs"
  | "setAsEtabs"
  | "soloHorizontales"
  | "setSoloHorizontales"
  | "nosPermitidos"
  | "setNosPermitidos"
  | "maxVariantes"
  | "setMaxVariantes"
  | "buscarVariantes"
  | "limpiarVariantes"
  | "variantes"
  | "errors"
>

export function AreaEtabsSection(props: Props) {
  return (
    <RefuerzoAreaEtabsSection
      asEtabs={props.asEtabs}
      setAsEtabs={props.setAsEtabs}
      soloHorizontales={props.soloHorizontales}
      setSoloHorizontales={props.setSoloHorizontales}
      nosPermitidos={props.nosPermitidos}
      setNosPermitidos={props.setNosPermitidos}
      maxVariantes={props.maxVariantes}
      setMaxVariantes={props.setMaxVariantes}
      buscarVariantes={props.buscarVariantes}
      limpiarVariantes={props.limpiarVariantes}
      variantes={props.variantes}
      errors={props.errors}
      label="Área de acero por SAP"
      hint="Valor de As directamente del análisis (momento positivo)"
    />
  )
}
