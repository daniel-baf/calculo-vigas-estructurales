import { AlertTriangle } from "lucide-react"
import { Badge, type BadgeVariant } from "./Badge"
import { cn } from "@/lib/utils"

export interface VariantsTableProps<T> {
  variantes: T[]
  onSelect: (v: T) => void
  fmt: (v: number) => string
  getArmado: (v: T) => string
  getAs: (v: T) => number
  getDc: (v: T) => number
  getChequeoDc: (v: T) => "Ok" | "No Ok"
  showHorizWarning?: (v: T) => boolean
}

export function VariantsTable<T>({
  variantes,
  onSelect,
  fmt,
  getArmado,
  getAs,
  getDc,
  getChequeoDc,
  showHorizWarning,
}: VariantsTableProps<T>) {
  if (variantes.length === 0) return null

  return (
    <div className="mt-4 animate-in overflow-hidden rounded-xl border border-border bg-card shadow-sm duration-500 fade-in slide-in-from-top-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold text-muted-foreground">
                Armado
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">
                As (cm²)
              </th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">
                D/C
              </th>
              <th className="w-24 px-4 py-3 text-right font-semibold text-muted-foreground">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {variantes.map((v, idx) => (
              <tr
                key={idx}
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="flex items-center gap-2 px-4 py-3 font-mono font-bold text-primary">
                  {getArmado(v)}
                  {showHorizWarning?.(v) && (
                    <span title="Solo horizontales">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {fmt(getAs(v))}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    value={fmt(getDc(v))}
                    variant={
                      (getChequeoDc(v) === "Ok" ? "ok" : "nook") as BadgeVariant
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelect(v)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
                    )}
                  >
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
