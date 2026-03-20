import { cn } from "@/lib/utils"
import {
  VARILLAS,
  VARILLA_MAP,
} from "../../steps/4-diseno-flexion-m2/diseno-flexion-m2"
import { NumericField } from "./NumericField"

export interface RebarRowProps {
  prefix: string
  label: string
  qty: string
  no: number | string
  onQtyChange: (v: string) => void
  onNoChange: (v: number) => void
  qtyError?: string
  noError?: string
  optional?: boolean
  alignLeft?: boolean
}

export function RebarRow({
  prefix,
  label,
  qty,
  no,
  onQtyChange,
  onNoChange,
  qtyError,
  noError,
  optional,
  alignLeft,
}: RebarRowProps) {
  const area = VARILLA_MAP[Number(no)]?.area ?? 0
  const options = optional ? VARILLAS : VARILLAS.filter((v) => v.no !== 0)

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-end gap-3">
      <NumericField
        id={`${prefix}-qty`}
        label={label}
        unit="cant."
        value={qty}
        onChange={onQtyChange}
        error={qtyError}
        min={optional ? 0 : 1}
        step="1"
      />

      <div
        className={cn(
          "flex flex-col gap-1.5",
          alignLeft ? "text-left" : undefined
        )}
      >
        <label
          htmlFor={`${prefix}-no`}
          className="text-sm leading-none font-medium"
        >
          No. de varilla
        </label>
        <select
          id={`${prefix}-no`}
          value={no}
          onChange={(e) => onNoChange(Number(e.target.value))}
          className={cn(
            "flex h-9 w-full cursor-pointer rounded-md border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
            noError ? "border-destructive" : "border-input"
          )}
        >
          {options.map((v) => (
            <option
              key={v.no}
              value={v.no}
              className="bg-popover text-popover-foreground"
            >
              {v.no === 0
                ? "— Sin segunda varilla —"
                : `No. ${v.no}  (${v.area} cm²  ·  Ø${v.diam} cm)`}
            </option>
          ))}
        </select>
        {noError && <p className="text-xs text-destructive">⚠ {noError}</p>}
      </div>

      <div
        className={cn(
          "flex flex-col gap-1.5",
          alignLeft ? "text-left" : undefined
        )}
      >
        <span className="text-sm leading-none font-medium text-muted-foreground">
          Área
        </span>
        <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm">
          {area.toFixed(2)} cm²
        </div>
      </div>
    </div>
  )
}
