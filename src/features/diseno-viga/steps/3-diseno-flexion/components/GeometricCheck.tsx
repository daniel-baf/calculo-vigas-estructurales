import { cn } from "@/lib/utils"
import { FormulaRenderer } from "@/shared/components/FormulaRenderer"
import type { DisenoFlexionState } from "../useDisenoFlexion"

type Props = Pick<DisenoFlexionState, "chequeo" | "procesos">

export function GeometricCheck({ chequeo, procesos }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted px-4 py-3">
      <div className="mb-1 flex items-center justify-between gap-2 border-b border-border pb-2">
        <span className="text-sm font-medium">
          Chequeo Geométrico (Secciones)
        </span>
        <span
          className={cn(
            "rounded px-2 py-0.5 font-mono text-sm font-semibold",
            chequeo === "Ok"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : chequeo === "No Ok"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : chequeo === "No chequea"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-muted-foreground/20 text-muted-foreground"
          )}
        >
          {chequeo}
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {procesos?.general && (
          <div className="space-y-1">
            <FormulaRenderer
              formula={procesos.general.formula}
              className="text-sm font-medium"
            />
            <FormulaRenderer
              formula={procesos.general.sustitucion}
              className="text-xs text-muted-foreground"
            />
          </div>
        )}
        {procesos?.condicion1 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-tight text-muted-foreground uppercase">
              Condición 1: Relación de luz
            </p>
            <FormulaRenderer
              formula={procesos.condicion1.formula}
              className="text-sm font-medium"
            />
            <FormulaRenderer
              formula={procesos.condicion1.sustitucion}
              className="text-xs text-muted-foreground"
            />
          </div>
        )}
        {procesos?.condicion2 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-tight text-muted-foreground uppercase">
              Condición 2: Ancho mínimo
            </p>
            <FormulaRenderer
              formula={procesos.condicion2.formula}
              className="text-sm font-medium"
            />
            <FormulaRenderer
              formula={procesos.condicion2.sustitucion}
              className="text-xs text-muted-foreground"
            />
          </div>
        )}
      </div>
    </div>
  )
}
