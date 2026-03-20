import { cn } from "@/lib/utils"

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
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm leading-none font-medium"
      >
        {label}
        {unit && (
          <span className="text-xs font-normal text-muted-foreground">
            ({unit})
          </span>
        )}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input"
        )}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          ⚠ {error}
        </p>
      )}
    </div>
  )
}
