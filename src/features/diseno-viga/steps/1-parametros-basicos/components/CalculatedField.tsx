interface CalculatedFieldProps {
  label: string
  value: number | null | undefined
  unit?: string
  formula?: string
}

export function CalculatedField({
  label,
  value,
  unit,
  formula,
}: CalculatedFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-sm leading-none font-medium text-muted-foreground">
        🔒 {label}
        {unit && <span className="text-xs font-normal">({unit})</span>}
      </label>
      <div className="flex h-9 items-center gap-2 rounded-md border border-dashed border-border bg-muted px-3 font-mono text-sm">
        <span className="font-semibold">
          {value !== null && value !== undefined ? value : "—"}
        </span>
        {formula && (
          <span className="ml-auto text-xs text-muted-foreground">
            {formula}
          </span>
        )}
      </div>
    </div>
  )
}
