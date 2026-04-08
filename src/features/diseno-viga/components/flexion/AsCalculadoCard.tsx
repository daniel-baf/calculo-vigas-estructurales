import { AsPropuestaPill } from "~/components/flexion/AsPropuestaPill"

export interface AsCalculadoCardProps {
  title: string
  value: number
  compareTo?: number
  formula?: string
}

export function AsCalculadoCard({
  title,
  value,
  compareTo,
  formula = "As = (M · 100) / (φ · fy · j · d)",
}: AsCalculadoCardProps) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-muted/40 px-5 py-4">
      <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-foreground">
          {value.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span className="text-sm text-muted-foreground">cm²</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{formula}</div>
      {compareTo !== undefined && (
        <div className="mt-2">
          <AsPropuestaPill cumple={value <= compareTo} />
        </div>
      )}
    </div>
  )
}
