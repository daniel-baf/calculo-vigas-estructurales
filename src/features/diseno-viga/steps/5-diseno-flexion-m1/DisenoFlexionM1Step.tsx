import { cn } from "@/lib/utils"
import { VARILLAS, VARILLA_MAP } from "../4-diseno-flexion-m2/diseno-flexion-m2"
import type { ResultadoDisenoM1 } from "./diseno-flexion-m1"
import { ResultRow } from "@/components/ui/ResultRow"
import type { DisenoFlexionM1State } from "./useDisenoFlexionM1"
import { Sparkles, Trash2, AlertTriangle } from "lucide-react"
import { FormulaRenderer } from "@/shared/components/FormulaRenderer"

// ── Subcomponentes (Reutilizados del concepto de M2) ───────────────────────────

interface NumericFieldProps {
  id: string
  label: string
  unit?: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  min?: number
  step?: string
}

function NumericField({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  hint,
  min = 0,
  step = "any",
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
        placeholder="0.00"
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input"
        )}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">⚠ {error}</p>}
    </div>
  )
}

interface RebarRowProps {
  prefix: string
  label: string
  qty: string
  no: number
  onQtyChange: (v: string) => void
  onNoChange: (v: number) => void
  qtyError?: string
  noError?: string
  optional?: boolean
}

function RebarRow({
  prefix,
  label,
  qty,
  no,
  onQtyChange,
  onNoChange,
  qtyError,
  noError,
  optional,
}: RebarRowProps) {
  const area = VARILLA_MAP[no]?.area ?? 0
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
      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-col gap-1.5">
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

type BadgeVariant = "ok" | "nook" | "na" | "neutral" | "warn"

function Badge({ value, variant }: { value: string; variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 font-mono text-sm font-semibold",
        variant === "ok" &&
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        variant === "nook" &&
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        variant === "na" && "bg-muted-foreground/20 text-muted-foreground",
        variant === "warn" &&
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        variant === "neutral" && "text-foreground"
      )}
    >
      {value}
    </span>
  )
}





interface BarSelectorProps {
  selected: number[]
  onChange: (nos: number[]) => void
}

function BarSelector({ selected, onChange }: BarSelectorProps) {
  const options = [2, 3, 4, 5, 6, 7, 8]
  const toggle = (n: number) => {
    if (selected.includes(n)) {
      if (selected.length > 1) onChange(selected.filter((x) => x !== n))
    } else {
      onChange([...selected, n].sort((a, b) => a - b))
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => toggle(n)}
          className={cn(
            "flex h-9 w-12 items-center justify-center rounded-md border text-sm font-bold transition-all",
            selected.includes(n)
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-input bg-background text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          #{n}
        </button>
      ))}
    </div>
  )
}

interface VariantsTableProps {
  variantes: ResultadoDisenoM1[]
  onSelect: (v: ResultadoDisenoM1) => void
  fmt: (v: number) => string
}

function VariantsTable({ variantes, onSelect, fmt }: VariantsTableProps) {
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
                  {v.armadoSuperior}
                  {v.inputs.no2 === 0 && (
                    <span title="Solo horizontales">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {fmt(v.asPropuesta)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    value={fmt(v.dc)}
                    variant={v.chequeo_dc === "Ok" ? "ok" : "nook"}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelect(v)}
                    className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
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

// ── Paso 5 ────────────────────────────────────────────────────────────────────

/**
 * PRESENTATION LAYER — Paso 5: Diseño a Flexión M1(−) Lado Izquierdo.
 */
export function DisenoFlexionM1Step(props: DisenoFlexionM1State) {
  const {
    asEtabs,
    setAsEtabs,
    qty1,
    setQty1,
    no1,
    setNo1,
    qty2,
    setQty2,
    no2,
    setNo2,
    resultado,
    errors,
    alertas,
    nosPermitidos,
    setNosPermitidos,
    variantes,
    maxVariantes,
    setMaxVariantes,
    soloHorizontales,
    setSoloHorizontales,
    buscarVariantes,
    limpiarVariantes,
    seleccionarVariante,
  } = props

  const fmt = (v: number | undefined | null, dec = 2) => {
    if (v === undefined || v === null || isNaN(v)) return "—"
    return v.toLocaleString("es-MX", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 5: Diseño a Flexión para Momento M1(−) Lado Izquierdo
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Diseño del refuerzo longitudinal para el momento negativo en el apoyo izquierdo.
        </p>
      </div>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Acero As_M1(−) L. Izquierdo
        </h3>
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          <NumericField
            id="asEtabs"
            label="Área de acero por ETABS/SAP"
            unit="cm²"
            value={asEtabs}
            onChange={setAsEtabs}
            error={errors.asEtabs}
            hint="Valor de As directamente del análisis (Lado Izquierdo)"
          />

          <div className="space-y-4">
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
                    incluir únicamente horizontales
                  </span>
                </label>
              </div>
              <BarSelector
                selected={nosPermitidos}
                onChange={setNosPermitidos}
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <NumericField
                  id="maxVariantes"
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
                  disabled={!asEtabs}
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
          </div>
        </div>

        {variantes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 dark:border-indigo-900/30 dark:bg-indigo-900/20">
              <span className="text-sm text-indigo-600 dark:text-indigo-400">
                💡
              </span>
              <p className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                <strong>Tip de optimización:</strong> Un diseño con{" "}
                <strong>D/C cercano a 1.00</strong> reduce la necesidad de
                estribos por cortante.
              </p>
            </div>
            <VariantsTable
              variantes={variantes}
              onSelect={seleccionarVariante}
              fmt={fmt}
            />
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Acero propuesto para momento
        </h3>
        <div className="space-y-4">
          <RebarRow
            prefix="v1"
            label="Longitudinales"
            qty={qty1}
            no={no1}
            onQtyChange={setQty1}
            onNoChange={setNo1}
            qtyError={errors.qty1}
            noError={errors.no1}
          />

          {alertas.no1Caro && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-900/20">
              <span className="mt-0.5 text-amber-600 dark:text-amber-400">
                ⚠
              </span>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {alertas.no1Caro}
              </p>
            </div>
          )}

          <RebarRow
            prefix="v2"
            label="Transversales"
            qty={qty2}
            no={no2}
            onQtyChange={setQty2}
            onNoChange={setNo2}
            noError={errors.qty2}
            optional
          />

          {no2 === 0 && (
            <div className="flex animate-in items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 duration-300 fade-in slide-in-from-top-1 dark:border-red-900/20 dark:bg-red-900/10">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase dark:text-red-300">
                NO SE RECOMIENDA HACER ESTO: Se prefiere diseño con adicionales
                (transversales)
              </span>
            </div>
          )}

          {alertas.no2Caro && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-900/20">
              <span className="mt-0.5 text-amber-600 dark:text-amber-400">
                ⚠
              </span>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {alertas.no2Caro}
              </p>
            </div>
          )}

          {alertas.diffVarillas && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-900/20">
              <span className="mt-0.5 text-red-600 dark:text-red-400">⛔</span>
              <p className="text-xs text-red-700 dark:text-red-300">
                {alertas.diffVarillas}
              </p>
            </div>
          )}
        </div>
      </section>

      {resultado && (
        <>
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
              Chequeos de diseño
            </h3>
            <div className="space-y-2">
              <ResultRow
                label="Área de acero propuesta As"
                value={fmt(resultado.asPropuesta)}
                unit="cm²"
                status={resultado.chequeoAsEtabs === 'Ok' ? 'ok' : 'no ok'}
                proceso={resultado.procesos.asPropuesta}
              />
              <ResultRow
                label="Área de acero por ETABS/SAP"
                value={fmt(Number(asEtabs))}
                unit="cm²"
              />
              <ResultRow
                label="a"
                value={fmt(resultado.a)}
                unit="cm"
                proceso={resultado.procesos.a}
              />
              <ResultRow
                label="Momento nominal φMn"
                value={fmt(resultado.phiMn)}
                unit="kgf·m"
                proceso={resultado.procesos.phiMn}
              />
              <ResultRow
                label="D/C"
                value={fmt(resultado.dc)}
                status={resultado.chequeo_dc === 'Ok' ? 'ok' : 'no ok'}
                proceso={resultado.procesos.dc}
              />
              <ResultRow
                label="Acero mínimo a flexión As min"
                value={fmt(resultado.asMin)}
                unit="cm²"
                proceso={resultado.procesos.asMin}
              />
              <ResultRow
                label="Acero máximo a flexión As max"
                value={fmt(resultado.asMax)}
                unit="cm²"
                status={resultado.chequeoAsMinMax === 'Ok' ? 'ok' : 'no ok'}
                proceso={resultado.procesos.asMax}
              />
              <ResultRow
                label="c = a/β₁"
                value={fmt(resultado.c)}
                unit="cm"
                proceso={resultado.procesos.c}
              />
              <ResultRow
                label="Chequeo por sección controlada"
                status={resultado.chequeoSeccionControlada === 'Ok' ? 'ok' : 'no ok'}
                proceso={resultado.procesos.chequeoSeccionControlada}
              />
            </div>
          </section>

          <div className="h-px bg-border" />
          <section>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
              <span className="text-sm font-semibold">
                Armado superior (L. Izquierdo)
              </span>
              <span className="font-mono text-lg font-bold tracking-wide text-primary">
                {resultado.armadoSuperior}
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
