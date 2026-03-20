import { cn } from '@/lib/utils';
import { FormulaRenderer } from '@/shared/components/FormulaRenderer';
import { ResultRow } from '@/components/ui/ResultRow';
import {
  Sparkles,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import type { M1PosState } from './useDisenoFlexionM1Pos';
import {
  VARILLAS,
  VARILLA_MAP,
  type ResultadoRefuerzo,
} from '@/shared/diseno-refuerzo';

// ── Subcomponentes locales (Copiados de Step 4 para consistencia) ─────────────

interface NumericFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  step?: string;
  error?: string;
  hint?: string;
}

function NumericField({
  id,
  label,
  unit,
  value,
  onChange,
  min,
  step = 'any',
  error,
  hint,
}: NumericFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none flex items-center gap-1"
      >
        {label}
        {unit && (
          <span className="text-xs text-muted-foreground font-normal">
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
          'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-input'
        )}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

interface RebarRowProps {
  prefix: string;
  label: string;
  qty: string;
  no: string | number;
  onQtyChange: (v: string) => void;
  onNoChange: (v: number) => void;
  qtyError?: string;
  noError?: string;
  optional?: boolean;
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
  const area = VARILLA_MAP[Number(no)]?.area ?? 0;
  const diam = VARILLA_MAP[Number(no)]?.diam ?? 0;
  const options = optional ? VARILLAS : VARILLAS.filter((v) => v.no !== 0);

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-end gap-3">
      {/* Cantidad */}
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

      {/* No. de varilla */}
      <div className="flex flex-col gap-1.5 text-left">
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
            'flex h-9 w-full cursor-pointer rounded-md border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors',
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
            noError ? 'border-destructive' : 'border-input'
          )}
        >
          {options.map((v) => (
            <option
              key={v.no}
              value={v.no}
              className="bg-popover text-popover-foreground"
            >
              {v.no === 0
                ? '— Sin segunda varilla —'
                : `No. ${v.no}  (${v.area} cm²  ·  Ø${v.diam} cm)`}
            </option>
          ))}
        </select>
        {noError && <p className="text-xs text-destructive">⚠ {noError}</p>}
      </div>

      {/* Área de la varilla (display) */}
      <div className="flex flex-col gap-1.5 text-left">
        <span className="text-sm leading-none font-medium text-muted-foreground">
          Área
        </span>
        <div className="flex h-9 items-center rounded-md bg-muted px-3 font-mono text-sm">
          {area.toFixed(2)} cm²
        </div>
      </div>
    </div>
  );
}

function Badge({ value, variant }: { value: string; variant: 'ok' | 'nook' | 'na' | 'neutral' | 'warn' }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 font-mono text-sm font-semibold",
        variant === "ok" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        variant === "nook" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        variant === "na" && "bg-muted-foreground/20 text-muted-foreground",
        variant === "warn" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        variant === "neutral" && "text-foreground"
      )}
    >
      {value}
    </span>
  );
}

interface BarSelectorProps {
  selected: number[];
  onChange: (nos: number[]) => void;
}

function BarSelector({ selected, onChange }: BarSelectorProps) {
  const options = [2, 3, 4, 5, 6, 7, 8];
  const toggle = (n: number) => {
    if (selected.includes(n)) {
      if (selected.length > 1) onChange(selected.filter((x) => x !== n));
    } else {
      onChange([...selected, n].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => toggle(n)}
          className={cn(
            'flex h-9 w-12 items-center justify-center rounded-md border text-sm font-bold transition-all',
            selected.includes(n)
              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
              : 'border-input bg-background text-muted-foreground hover:border-primary hover:text-primary'
          )}
        >
          #{n}
        </button>
      ))}
    </div>
  );
}

interface VariantsTableProps {
  variantes: ResultadoRefuerzo[];
  onSelect: (v: ResultadoRefuerzo) => void;
  fmt: (v: number) => string;
}

function VariantsTable({ variantes, onSelect, fmt }: VariantsTableProps) {
  if (variantes.length === 0) return null;

  return (
    <div className="mt-4 animate-in overflow-hidden rounded-xl border border-border bg-card shadow-sm duration-500 fade-in slide-in-from-top-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold text-muted-foreground">Armado</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">As (cm²)</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">D/C</th>
              <th className="w-24 px-4 py-3 text-right font-semibold text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {variantes.map((v, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-muted/30">
                <td className="flex items-center gap-2 px-4 py-3 font-mono font-bold text-primary">
                  {v.armadoSuperior}
                  {v.inputs.no2 === 0 && (
                    <span title="Solo horizontales">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">{fmt(v.asPropuesta)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge value={fmt(v.dc)} variant={v.chequeo_dc === 'Ok' ? 'ok' : 'nook'} />
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
  );
}

// ── Componente Principal ─────────────────────────────────────────────────────

export function DisenoFlexionM1PosStep(props: M1PosState) {
  const {
    asEtabs,
    setAsEtabs,
    n1,
    setN1,
    no1,
    setNo1,
    n2,
    setN2,
    no2,
    setNo2,
    resultado,
    errors,
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
  } = props;

  const fmt = (v: number | undefined | null, dec = 2) => {
    if (v === undefined || v === null || isNaN(v)) return '—';
    return v.toLocaleString('es-MX', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 6: Diseño a Flexión para Momento M1(+) Lado Izquierdo
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Diseño del refuerzo longitudinal para el momento positivo en el apoyo izquierdo.
        </p>
      </div>

      {/* ── Área por SAP/ETABS ───────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Acero As_M1(+)
        </h3>
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          <NumericField
            id="asEtabs"
            label="Área de acero por SAP/ETABS"
            unit="cm²"
            value={asEtabs}
            onChange={setAsEtabs}
            error={errors.asEtabs}
            hint="Valor de As directamente del análisis sísmico"
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
                    incluir unicamente horizontales
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
                  onClick={buscarVariantes}
                  className={cn(
                    'flex h-9 items-center justify-center gap-2 rounded-lg bg-primary/10 px-6 text-sm font-bold text-primary transition-all active:scale-[0.98]',
                    'border border-primary/20 whitespace-nowrap shadow-sm hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50'
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
              <span className="text-sm text-indigo-600 dark:text-indigo-400">💡</span>
              <p className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                <strong>Tip de optimización:</strong> Mientras más cerca esté el <strong>D/C a 1.00</strong>, el diseño es más eficiente.
              </p>
            </div>
            <VariantsTable variantes={variantes} onSelect={seleccionarVariante} fmt={fmt} />
          </div>
        )}
      </section>

      {/* ── Momento de Diseño ─────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Momento de Diseño M1(+)
        </h3>
        {resultado && (
          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <ResultRow
              label="Momento sísmico mínimo M1(+)"
              value={`${fmt(resultado.muSismico)} kgf-m`}
              proceso={resultado.proceso.muSismico}
            />
            <ResultRow
              label="Momento de diseño Mu (final)"
              value={`${fmt(resultado.mu)} kgf-m`}
              hint="Max entre sísmico y derivado de ETABS"
            />
            <ResultRow
              label="Área de acero requerida As"
              value={`${fmt(resultado.asReq)} cm²`}
              proceso={resultado.proceso.asReq}
            />
            <div className="flex items-center gap-2 p-2 bg-blue-500/5 text-blue-600 rounded-lg text-xs font-medium">
              <Info className="h-4 w-4" />
              <span>El momento de diseño se calcula sobre la capacidad negativa phiMn- según NSR-10.</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Acero Propuesto ───────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Acero propuesto para momento
        </h3>

        <div className="space-y-4">
          <RebarRow
            prefix="v1"
            label="Capa 1 (Inf)"
            qty={n1}
            no={no1}
            onQtyChange={setN1}
            onNoChange={setNo1}
            qtyError={errors.n1}
            noError={errors.no1}
          />
          <RebarRow
            prefix="v2"
            label="Capa 2 (Inf)"
            qty={n2}
            no={no2}
            onQtyChange={setN2}
            onNoChange={setNo2}
            qtyError={errors.n2}
            noError={errors.no2}
            optional
          />
        </div>
      </section>

      {/* ── Chequeos de Diseño ────────────────────────────────────── */}
      {resultado && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
            Chequeos de Diseño
          </h3>
          <div className="space-y-2">
            <ResultRow
              label="Área de acero propuesta As"
              value={`${fmt(resultado.asPropuesta)} cm²`}
              status={resultado.cumpleAsMin ? 'ok' : 'no ok'}
              hint={`Min: ${fmt(resultado.asMin)} cm²`}
            />

            <ResultRow
              label="Profundidad del bloque de compresión (a)"
              value={`${fmt(resultado.a)} cm`}
              proceso={resultado.proceso.a}
            />

            <ResultRow
              label="Momento nominal ϕMn"
              value={`${fmt(resultado.phiMn)} kgf-m`}
              proceso={resultado.proceso.phiMn}
            />

            <ResultRow
              label="Relación Demanda/Capacidad (D/C)"
              value={fmt(resultado.dc)}
              status={resultado.cumpleDC ? 'ok' : 'no ok'}
              proceso={resultado.proceso.dc}
            />

            <ResultRow
              label="Sección controlada por tensión"
              status={resultado.esSeccionControlada ? 'ok' : 'no ok'}
              proceso={resultado.proceso.seccionControlada}
            />

            <div className={cn(
              "mt-6 p-4 rounded-xl border flex items-center gap-4 transition-all duration-500",
              resultado.cumpleDC
                ? "bg-green-500/10 border-green-500/20 text-green-700"
                : "bg-red-500/10 border-red-500/20 text-red-700"
            )}>
              {resultado.cumpleDC ? (
                <>
                  <CheckCircle2 className="h-8 w-8 shrink-0" />
                  <div>
                    <p className="font-bold">Diseño Adecuado</p>
                    <p className="text-xs opacity-80 text-balance">El refuerzo propuesto cumple con la resistencia requerida y el armado mínimo sísmico.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 shrink-0" />
                  <div>
                    <p className="font-bold">Ajustar Refuerzo</p>
                    <p className="text-xs opacity-80 text-balance">La capacidad de la sección es insuficiente o no cumple con el acero mínimo.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
