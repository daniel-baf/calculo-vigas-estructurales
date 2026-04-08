import { StepSection } from "~/components/flexion/StepSection"
import { AsCalculadoCard } from "~/components/flexion/AsCalculadoCard"
import type { DisenoFlexionMCentroState } from "./useDisenoFlexionMCentro"
import { AreaEtabsSection } from "./components/AreaEtabsSection"
import { RefuerzoVariantsSection } from "~/components/flexion/RefuerzoVariantsSection"
import { RefuerzoProposedSteelSection } from "~/components/flexion/RefuerzoProposedSteelSection"
import { ResultsSection } from "./components/ResultsSection"
import { ArmadoSummary } from "./components/ArmadoSummary"
import type { ResultadoDisenoMCentro } from "./diseno-flexion-m-center"

export function DisenoFlexionMCentroStep(props: DisenoFlexionMCentroState) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 7: Diseño a Flexión para Momento en el Centro de la Viga M(+)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diseño del refuerzo longitudinal para el momento positivo en el centro
          del claro.
        </p>
      </div>

      <StepSection title="Acero As_M(+)">
        <AsCalculadoCard
          title="Acero As_M(+) calculado"
          value={props.asMcenterBase}
          compareTo={props.resultado?.asPropuesta}
        />
        <AreaEtabsSection
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
        />
        <RefuerzoVariantsSection<ResultadoDisenoMCentro>
          variantes={props.variantes}
          seleccionarVariante={props.seleccionarVariante}
          getArmado={(v) => v.armadoSuperior}
          getAs={(v) => v.asPropuesta}
          getDc={(v) => v.dc}
          getChequeoDc={(v) => v.chequeo_dc}
          showHorizWarning={(v) => v.inputs.no2 === 0}
        />
      </StepSection>

      <StepSection title="Acero propuesto para momento">
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
      </StepSection>

      {props.resultado && (
        <>
          <StepSection title="Chequeos de diseño">
            <ResultsSection
              resultado={props.resultado}
              asEtabs={props.asEtabs}
            />
          </StepSection>
          <div className="h-px bg-border" />
          <StepSection title="Armado superior">
            <ArmadoSummary resultado={props.resultado} />
          </StepSection>
        </>
      )}
    </div>
  )
}
