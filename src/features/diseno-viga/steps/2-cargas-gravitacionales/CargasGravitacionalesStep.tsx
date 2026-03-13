import { cn } from '@/lib/utils';
import type { CargasGravitacionalesState } from './useCargasGravitacionales';

// ── Subcomponentes ────────────────────────────────────────────────────────────

interface NumericFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: number | string;
  onChange: (v: string) => void;
  min?: number;
  step?: string;
  error?: string;
  hint?: string;
}

function NumericField({ id, label, unit, value, onChange, min, step = 'any', error, hint }: NumericFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-none flex items-center gap-1">
        {label}
        {unit && <span className="text-xs text-muted-foreground font-normal">({unit})</span>}
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
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
        )}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">⚠ {error}</p>}
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: number | null | undefined;
  unit: string;
  highlight?: boolean;
}

function ResultRow({ label, value, unit, highlight }: ResultRowProps) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-lg px-4 py-2.5 gap-4',
      highlight
        ? 'bg-primary text-primary-foreground font-semibold'
        : 'bg-muted'
    )}>
      <span className="text-sm">{label}</span>
      <span className="font-mono text-sm tabular-nums">
        {value !== null && value !== undefined
          ? `${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${unit}`
          : '—'}
      </span>
    </div>
  );
}

interface IntermediateRowProps {
  label1: string;
  label2: string;
  value1: string | number;
  value2: string | number;
  result: number | null;
  unit: string;
}

function IntermediateRow({ label1, label2, value1, value2, result, unit }: IntermediateRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-2.5">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{label1}</p>
        <p>{label2}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-mono">
        <span className="text-primary font-semibold">{value1 || '—'}</span>
        <span className="text-muted-foreground">×</span>
        <span className="text-primary font-semibold">{value2 || '—'}</span>
      </div>
      <div className="text-right text-sm font-mono font-semibold">
        {result !== null && result !== undefined
          ? `${result.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${unit}`
          : '—'}
      </div>
    </div>
  );
}

// ── Paso 2 ────────────────────────────────────────────────────────────────────

/**
 * PRESENTATION LAYER — Paso 2: Cargas Gravitacionales.
 */
export function CargasGravitacionalesStep(props: CargasGravitacionalesState) {
  const {
    AT, setAT,
    cvKgM2, setCvKgM2,
    scKgM2, setScKgM2,
    Svd, setSvd,
    intermedios, resultados, errors,
  } = props;

  return (
    <div className="space-y-6">

      {/* ── Datos de entrada ───────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Datos de Entrada
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <NumericField
            id="AT" label="Área tributaria (AT)" unit="m²"
            value={AT} onChange={setAT} min={0.01} step="0.01"
            error={errors.AT}
          />
          <NumericField
            id="cvKgM2" label="Carga viva (CV)" unit="kg/m²"
            value={cvKgM2} onChange={setCvKgM2} min={0}
            error={errors.cvKgM2}
          />
          <NumericField
            id="scKgM2" label="Sobrecarga (SC)" unit="kg/m²"
            value={scKgM2} onChange={setScKgM2} min={0}
            error={errors.scKgM2}
            hint="Carga muerta adicional (acabados, tabiques, etc.)"
          />
          <NumericField
            id="Svd" label="Sismo vertical (Svd)" unit="—"
            value={Svd} onChange={setSvd} min={0} step="0.0001"
            error={errors.Svd}
            hint="Mientras más decimales ingreses, más preciso será Wu (ej. 0.2448 en vez de 0.24)"
          />
        </div>
      </section>

      {/* ── Cargas intermedias ─────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Cargas Distribuidas (AT × carga/m²)
        </h3>
        <div className="space-y-2">
          <IntermediateRow
            label1="AT (m²) × CV (kg/m²)"
            label2="CV Distribuida"
            value1={AT || ''}
            value2={cvKgM2 || ''}
            result={intermedios?.cvDistribuida ?? null}
            unit="kgf/m"
          />
          <IntermediateRow
            label1="AT (m²) × SC (kg/m²)"
            label2="CM Distribuida"
            value1={AT || ''}
            value2={scKgM2 || ''}
            result={intermedios?.cmDistribuida ?? null}
            unit="kgf/m"
          />
        </div>
      </section>

      {/* ── Tabla de resultados ────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Cargas Gravitacionales
        </h3>
        <div className="space-y-1.5">
          <ResultRow
            label="Carga Viva (CV)"
            value={resultados?.CV}
            unit="kgf/m"
          />
          <ResultRow
            label="Carga Muerta (CM) = peso propio + CM distribuida"
            value={resultados?.CM}
            unit="kgf/m"
          />
          <ResultRow
            label="Sismo vertical (Svd)"
            value={resultados?.Svd}
            unit="—"
          />
          <ResultRow
            label="Carga mayorada Wu = (1.2 + Svd)×CM + CV"
            value={resultados?.Wu}
            unit="kgf/m"
            highlight
          />
        </div>
        {!resultados && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Completa los campos para ver los resultados.
          </p>
        )}
      </section>
    </div>
  );
}
