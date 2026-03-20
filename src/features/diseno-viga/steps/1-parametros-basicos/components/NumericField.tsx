import { TechnicalNumericField } from "@/features/diseno-viga/components/forms/TechnicalNumericField"

interface NumericFieldProps {
  id: string
  label: string
  unit?: string
  value: number | string
  onChange: (v: string) => void
  min?: number
  step?: string
  error?: string
  hint?: string
}

export function NumericField({
  id,
  label,
  unit,
  value,
  onChange,
  min,
  step = "any",
  error,
  hint,
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
      placeholder="Ej: 25"
    />
  )
}
