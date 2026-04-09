import { VARILLAS } from "@/shared/diseno-refuerzo/varillas"
import { TechnicalNumericField } from "@/features/diseno-viga/components/forms/TechnicalNumericField"
import { CalculatedField } from "@/features/diseno-viga/steps/1-parametros-basicos/components/CalculatedField"

interface SpacingParametersCardProps {
  bw: number
  rec: number
  noVarilla: string
  cantVarillas: string
  onNoVarillaChange: (value: string) => void
  onCantVarillasChange: (value: string) => void
}

export function SpacingParametersCard({
  bw,
  rec,
  noVarilla,
  cantVarillas,
  onNoVarillaChange,
  onCantVarillasChange,
}: SpacingParametersCardProps) {
  const anchoDisponible = bw - 2 * rec

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
        Parámetros
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TechnicalNumericField
            id="resumen-rec"
            label="Recubrimiento"
            unit="cm"
            value={rec.toFixed(2)}
            onChange={() => {}}
            disabled
          />

          <TechnicalNumericField
            id="resumen-bw"
            label="Base"
            unit="cm"
            value={bw.toFixed(2)}
            onChange={() => {}}
            disabled
          />

          <CalculatedField
            label="Ancho disponible"
            unit="cm"
            value={anchoDisponible}
            formula="bw - 2*rec"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-foreground">
            No. Varilla
          </label>
          <select
            value={noVarilla}
            onChange={(event) => onNoVarillaChange(event.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background/95 px-3 py-1 text-sm text-foreground shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-ring/65 focus-visible:outline-none dark:bg-card/70 dark:backdrop-blur-sm"
          >
            {VARILLAS.filter((varilla) => varilla.no > 0).map((varilla) => (
              <option
                key={varilla.no}
                value={varilla.no}
                className="bg-popover text-popover-foreground"
              >
                No. {varilla.no} (d = {varilla.diam} cm)
              </option>
            ))}
          </select>
        </div>

        <TechnicalNumericField
          id="resumen-cant"
          label="Cantidad de varillas"
          value={cantVarillas}
          onChange={onCantVarillasChange}
          min={2}
        />
      </div>
    </div>
  )
}
