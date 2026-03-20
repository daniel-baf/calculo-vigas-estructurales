import { SegmentedControl } from "@/components/ui/segmented-control"
import type { ParametrosBasicosState } from "../useParametrosBasicos"
import { NumericField } from "./NumericField"
import { CalculatedField } from "./CalculatedField"

interface Props {
  fc: ParametrosBasicosState["fc"]
  setFc: ParametrosBasicosState["setFc"]
  gradoAcero: ParametrosBasicosState["gradoAcero"]
  setGradoAcero: ParametrosBasicosState["setGradoAcero"]
  tipoConcreto: ParametrosBasicosState["tipoConcreto"]
  setTipoConcreto: ParametrosBasicosState["setTipoConcreto"]
  fy: ParametrosBasicosState["fy"]
  lambda: ParametrosBasicosState["lambda"]
  beta: ParametrosBasicosState["beta"]
  GRADOS_ACERO: ParametrosBasicosState["GRADOS_ACERO"]
  TIPOS_CONCRETO: ParametrosBasicosState["TIPOS_CONCRETO"]
  FC_MIN: ParametrosBasicosState["FC_MIN"]
  errors: ParametrosBasicosState["errors"]
}

export function MaterialsSection(props: Props) {
  const {
    fc,
    setFc,
    gradoAcero,
    setGradoAcero,
    tipoConcreto,
    setTipoConcreto,
    fy,
    lambda,
    beta,
    GRADOS_ACERO,
    TIPOS_CONCRETO,
    FC_MIN,
    errors,
  } = props

  const gradoOptions = Object.entries(GRADOS_ACERO).map(([k, v]) => ({
    value: k,
    label: v.label,
  }))
  const concretoOptions = Object.entries(TIPOS_CONCRETO).map(([k, v]) => ({
    value: k,
    label: v.label,
  }))

  return (
    <section>
      <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
        Materiales
      </h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <NumericField
          id="fc"
          label="Resistencia del concreto f'c"
          unit="kgf/cm²"
          value={fc}
          onChange={setFc}
          min={FC_MIN}
          error={errors.fc}
          hint={`Mínimo reglamentario: ${FC_MIN} kgf/cm²`}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm leading-none font-medium">
            Resistencia del acero fy
          </label>
          <SegmentedControl
            options={gradoOptions}
            value={gradoAcero}
            onChange={setGradoAcero as (value: string) => void}
            className="w-full"
          />
          <p className="font-mono text-sm font-semibold text-primary">
            {fy.toLocaleString("es-MX")} kgf/cm²
          </p>
        </div>

        <CalculatedField
          label="Factor β₁"
          value={beta}
          formula="ACI 318 / NSR-10"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm leading-none font-medium">
            Tipo de concreto hidráulico λ
          </label>
          <SegmentedControl
            options={concretoOptions}
            value={tipoConcreto}
            onChange={setTipoConcreto as (value: string) => void}
            className="w-full"
          />
          <p className="font-mono text-sm font-semibold text-primary">
            λ = {lambda}
          </p>
        </div>
      </div>
    </section>
  )
}
