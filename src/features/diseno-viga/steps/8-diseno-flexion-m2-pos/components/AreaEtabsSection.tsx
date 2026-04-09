import { Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { NumericField } from "~/components/flexion/NumericField"
import { BarSelector } from "~/components/flexion/BarSelector"
import type { M2PosState } from "../useDisenoFlexionM2Pos"

type Props = Pick<
  M2PosState,
  | "asEtabs"
  | "setAsEtabs"
  | "soloHorizontales"
  | "setSoloHorizontales"
  | "nosPermitidos"
  | "setNosPermitidos"
  | "maxVariantes"
  | "setMaxVariantes"
  | "buscarVariantes"
  | "limpiarVariantes"
  | "variantes"
  | "errors"
>

export function AreaEtabsSection(props: Props) {
  const {
    asEtabs,
    setAsEtabs,
    soloHorizontales,
    setSoloHorizontales,
    nosPermitidos,
    setNosPermitidos,
    maxVariantes,
    setMaxVariantes,
    buscarVariantes,
    limpiarVariantes,
    variantes,
    errors,
  } = props

  return (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
      <NumericField
        id="asEtabs-m2pos"
        label="Área de acero por SAP/ETABS"
        unit="cm²"
        value={asEtabs}
        onChange={setAsEtabs}
        error={errors.asEtabs}
        hint="Valor de As directamente del análisis sísmico"
      />

      <div className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <NumericField
              id="maxVariantes-m2pos"
              label="Máx. de opciones"
              value={maxVariantes}
              onChange={setMaxVariantes}
              min={1}
              step="1"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={buscarVariantes}
              className={cn(
                "flex h-9 items-center justify-center gap-2 rounded-lg bg-primary/10 px-6 text-sm font-bold text-primary transition-all active:scale-[0.98]",
                "border border-primary/20 whitespace-nowrap shadow-sm hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Sugerir
            </button>
            {variantes.length > 0 && (
              <button
                type="button"
                onClick={limpiarVariantes}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700"
                title="Ocultar sugerencias"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Números de varilla a considerar
            </label>
            <label className="group flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                checked={soloHorizontales}
                onChange={(e) => setSoloHorizontales(e.target.checked)}
              />
              <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                incluir unicamente horizontales
              </span>
            </label>
          </div>
          <BarSelector selected={nosPermitidos} onChange={setNosPermitidos} />
        </div>
      </div>
    </div>
  )
}
