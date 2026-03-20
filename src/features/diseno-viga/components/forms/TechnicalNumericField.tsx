import { cn } from "@/lib/utils"

interface TechnicalNumericFieldProps {
  id: string
  label: string
  unit?: string
  value: number | string
  onChange: (v: string) => void
  min?: number
  step?: string
  error?: string
  hint?: string
  placeholder?: string
  disabled?: boolean
}

export function TechnicalNumericField({
  id,
  label,
  unit,
  value,
  onChange,
  min,
  step = "any",
  error,
  hint,
  placeholder,
  disabled,
}: TechnicalNumericFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm leading-none font-semibold text-foreground"
      >
        {label}
        {unit && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">
            {unit}
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
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        className={cn(
          "flex h-10 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-all",
          "bg-background/95 text-foreground placeholder:text-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring/65 focus-visible:outline-none",
          "dark:bg-card/70 dark:backdrop-blur-sm",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-destructive/70 focus-visible:ring-destructive/45"
            : "border-input"
        )}
      />

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
