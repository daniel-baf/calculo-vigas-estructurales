import { StepSection } from "~/components/flexion/StepSection"
import type { DisenoFlexionM2State } from "./useDisenoFlexionM2"
import { AreaEtabsSection } from "./components/AreaEtabsSection"
import { VariantsSection } from "./components/VariantsSection"
import { ProposedSteelSection } from "./components/ProposedSteelSection"
import { ResultsSection } from "./components/ResultsSection"
import { ArmadoSummary } from "./components/ArmadoSummary"

/**
 * PRESENTATION LAYER — Paso 4: Diseño a Flexión M2(−) Lado Derecho.
 */
export function DisenoFlexionM2Step(props: DisenoFlexionM2State) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 4: Diseño a Flexión para Momento M2(−) Lado Derecho
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diseño del refuerzo longitudinal para el momento negativo en el apoyo
          derecho.
        </p>
      </div>

      <StepSection title="Acero As_M2(−)">
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
        <VariantsSection
          variantes={props.variantes}
          seleccionarVariante={props.seleccionarVariante}
        />
      </StepSection>

      <StepSection title="Acero propuesto para momento">
        <ProposedSteelSection
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
