import { TechnicalNumericField } from "@/features/diseno-viga/components/forms/TechnicalNumericField"

export interface NumericFieldProps {
  id: string
  label: string
  unit?: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  min?: number
  step?: string
}

export function NumericField({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  hint,
  min = 0,
  step = "any",
}: NumericFieldProps) {
  return (
    <TechnicalNumericField
      id={id}
      label={label}
      unit={unit}
      value={value}
      onChange={onChange}
      min={min}
      step={step}
      error={error}
      hint={hint}
      placeholder="0.00"
    />
  )
}
