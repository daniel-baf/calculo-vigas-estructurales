import type { CargasGravitacionalesState } from "../useCargasGravitacionales"
import { NumericField } from "./NumericField"

type Props = Pick<
  CargasGravitacionalesState,
  | "AT"
  | "setAT"
  | "cvKgM2"
  | "setCvKgM2"
  | "scKgM2"
  | "setScKgM2"
  | "Svd"
  | "setSvd"
  | "errors"
>

export function InputGrid({
  AT,
  setAT,
  cvKgM2,
  setCvKgM2,
  scKgM2,
  setScKgM2,
  Svd,
  setSvd,
  errors,
}: Props) {
  return (
    <section>
      <h3 className="step-block-title">Datos de Entrada</h3>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <NumericField
          id="AT"
          label="Área tributaria (AT)"
          unit="m²"
          value={AT}
          onChange={setAT}
          min={0.01}
          step="0.01"
          error={errors.AT}
        />
        <NumericField
          id="cvKgM2"
          label="Carga viva (CV)"
          unit="kg/m²"
          value={cvKgM2}
          onChange={setCvKgM2}
          min={0}
          error={errors.cvKgM2}
        />
        <NumericField
          id="scKgM2"
          label="Sobrecarga (SC)"
          unit="kg/m²"
          value={scKgM2}
          onChange={setScKgM2}
          min={0}
          error={errors.scKgM2}
          hint="Carga muerta adicional (acabados, tabiques, etc.)"
        />
        <NumericField
          id="Svd"
          label="Sismo vertical (Svd)"
          unit="—"
          value={Svd}
          onChange={setSvd}
          min={0}
          step="0.0001"
          error={errors.Svd}
          hint="Mientras más decimales ingreses, más preciso será Wu (ej. 0.2448 en vez de 0.24)"
        />
      </div>
    </section>
  )
}
