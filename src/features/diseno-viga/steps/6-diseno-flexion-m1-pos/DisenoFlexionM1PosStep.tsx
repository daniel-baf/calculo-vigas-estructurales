import { StepSection } from "~/components/flexion/StepSection"
import type { M1PosState } from "./useDisenoFlexionM1Pos"
import { AreaEtabsSection } from "./components/AreaEtabsSection"
import { VariantsSection } from "./components/VariantsSection"
import { DesignMomentSection } from "./components/DesignMomentSection"
import { ProposedSteelSection } from "./components/ProposedSteelSection"
import { ChecksSection } from "./components/ChecksSection"

export function DisenoFlexionM1PosStep(props: M1PosState) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 6: Diseño a Flexión para Momento M1(+) Lado Izquierdo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diseño del refuerzo longitudinal para el momento positivo en el apoyo
          izquierdo.
        </p>
      </div>

      <StepSection title="Acero As_M1(+)">
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

      <StepSection title="Momento de Diseño M1(+)">
        <DesignMomentSection resultado={props.resultado} />
      </StepSection>

      <StepSection title="Acero propuesto para momento">
        <ProposedSteelSection
          n1={props.n1}
          setN1={props.setN1}
          no1={props.no1}
          setNo1={props.setNo1}
          n2={props.n2}
          setN2={props.setN2}
          no2={props.no2}
          setNo2={props.setNo2}
          errors={props.errors}
        />
      </StepSection>

      {props.resultado && (
        <StepSection title="Chequeos de Diseño">
          <ChecksSection resultado={props.resultado} />
        </StepSection>
      )}
    </div>
  )
}
