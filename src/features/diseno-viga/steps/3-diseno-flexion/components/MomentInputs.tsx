import { NumericField } from "./NumericField"
import type { DisenoFlexionState } from "../useDisenoFlexion"

type Props = Pick<
  DisenoFlexionState,
  "M1" | "setM1" | "Mcenter" | "setMcenter" | "M2" | "setM2" | "errors"
>

export function MomentInputs({
  M1,
  setM1,
  Mcenter,
  setMcenter,
  M2,
  setM2,
  errors,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <NumericField
        id="M1"
        label="M1(−) — Izquierdo"
        unit="kgf·m"
        value={M1}
        onChange={setM1}
        error={errors.M1}
        hint="Ingresa valor positivo"
      />
      <NumericField
        id="Mcenter"
        label="Centro (+)"
        unit="kgf·m"
        value={Mcenter}
        onChange={setMcenter}
        error={errors.Mcenter}
      />
      <NumericField
        id="M2"
        label="M2(−) — Derecho"
        unit="kgf·m"
        value={M2}
        onChange={setM2}
        error={errors.M2}
        hint="Ingresa valor positivo"
      />
    </div>
  )
}
