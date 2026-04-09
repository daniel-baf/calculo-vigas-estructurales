import { StepSection } from "~/components/flexion/StepSection"
import { AsCalculadoCard } from "~/components/flexion/AsCalculadoCard"
import { TechnicalNumericField } from "@/features/diseno-viga/components/forms/TechnicalNumericField"
import type { useMomentoMinimo } from "./useMomentoMinimo"
import { ProposedSteelSection } from "./components/ProposedSteelSection"
import { ResultsSection } from "./components/ResultsSection"

type MomentoMinimoState = ReturnType<typeof useMomentoMinimo>

export function MomentoMinimoStep(props: MomentoMinimoState) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 9: Diseño por Momento Mínimo Longitudinal
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verificación del refuerzo longitudinal mínimo requerido a lo largo de toda la viga.
        </p>
      </div>

      <StepSection title="Cálculos Base Demandados">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-sm font-medium text-muted-foreground">Momento máximo de las caras (-)</span>
            <div className="mt-1 text-2xl font-bold">
              {props.maxMomentoCaras.toLocaleString("en-US", { maximumFractionDigits: 2 })} kgf-m
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <span className="text-sm font-medium text-muted-foreground">Momento mínimo demandado</span>
            <div className="mt-1 text-2xl font-bold">
              {props.momentoMinimoDemandado.toLocaleString("en-US", { maximumFractionDigits: 2 })} kgf-m
            </div>
          </div>
        </div>
      </StepSection>

      <StepSection title="Acero Requerido (As)">
        <AsCalculadoCard
          title="Acero requerido calculado"
          value={props.asRequerido}
          compareTo={props.resultado?.asPropuesta}
        />
        <div className="mt-4 rounded-xl border border-input bg-card p-5 max-w-md">
          <TechnicalNumericField
            id="asMinUser"
            label="Área de acero mín longitudinal"
            unit="cm²"
            value={props.asMinUser}
            onChange={props.setAsMinUser}
            min={0}
            step="0.01"
            placeholder="Ej: 0.58"
          />
        </div>
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
          errors={props.errors}
          alertas={props.alertas}
        />
      </StepSection>

      {props.resultado && (
        <>
          <StepSection title="Chequeos de diseño">
            <ResultsSection resultado={props.resultado} />
          </StepSection>
          <div className="h-px bg-border" />
          <StepSection title="Armado longitudinal (en toda la viga)">
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
              <span className="text-sm font-medium text-muted-foreground">
                Resumen de armado longitudinal
              </span>
              <span className="text-lg font-bold tracking-tight text-primary">
                {props.resultado.armadoSuperior}
              </span>
            </div>
          </StepSection>
        </>
      )}
    </div>
  )
}
