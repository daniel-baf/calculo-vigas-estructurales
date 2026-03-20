import { cn } from '@/lib/utils';
import { ResultRow } from '@/components/ui/ResultRow';
import type { CargasGravitacionalesState } from './useCargasGravitacionales';
import { FormulaRenderer } from '@/shared/components/FormulaRenderer';

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
    resultados, errors,
  } = props;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 2: Cargas Gravitacionales
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ingresa el área tributaria y las cargas vivas y muertas para calcular la carga mayorada Wu.
        </p>
      </div>

      {/* ── Datos de entrada ───────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
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

      {/* ── Tabla de resultados ────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Cálculo de Cargas Gravitacionales
        </h3>
        <div className="space-y-3">
          <ResultRow
            label="Peso propio de la viga (Wpp)"
            value={resultados?.pesoPropio}
            unit="kgf/m"
            proceso={resultados?.procesos.pesoPropio}
          />
          <ResultRow
            label="Carga Viva (CV)"
            value={resultados?.CV}
            unit="kgf/m"
            proceso={resultados?.procesos.CV}
          />
          <ResultRow
            label="Carga Muerta (CM)"
            value={resultados?.CM}
            unit="kgf/m"
            proceso={resultados?.procesos.CM}
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
            proceso={resultados?.procesos.Wu}
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
