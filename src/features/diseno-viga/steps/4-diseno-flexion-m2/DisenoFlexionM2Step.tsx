import { cn } from '@/lib/utils';
import { VARILLAS, VARILLA_MAP, type ResultadoDisenoM2 } from './diseno-flexion-m2';
import type { DisenoFlexionM2State } from './useDisenoFlexionM2';
import { Sparkles, Trash2, AlertTriangle } from 'lucide-react';

// ── Subcomponentes ────────────────────────────────────────────────────────────

interface NumericFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  min?: number;
  step?: string;
}

function NumericField({ id, label, unit, value, onChange, error, hint, min = 0, step = 'any' }: NumericFieldProps) {
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
        placeholder="0.00"
        className={cn(
          'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
        )}
      />
      {hint  && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">⚠ {error}</p>}
    </div>
  );
}

interface RebarRowProps {
  /** Prefijo único para IDs de los inputs */
  prefix: string;
  label: string;
  qty: string;
  no: number;
  onQtyChange: (v: string) => void;
  onNoChange: (v: number) => void;
  qtyError?: string;
  noError?: string;
  /** Si es true, se puede omitir (no2 = 0) */
  optional?: boolean;
}

function RebarRow({ prefix, label, qty, no, onQtyChange, onNoChange, qtyError, noError, optional }: RebarRowProps) {
  const area = VARILLA_MAP[no]?.area ?? 0;
  const options = optional
    ? VARILLAS                            // incluye No. 0
    : VARILLAS.filter((v) => v.no !== 0); // excluye No. 0

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] gap-3 items-end">
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${prefix}-no`} className="text-sm font-medium leading-none">
          No. de varilla
        </label>
        <select
          id={`${prefix}-no`}
          value={no}
          onChange={(e) => onNoChange(Number(e.target.value))}
          className={cn(
            'flex h-9 w-full rounded-md border bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            noError ? 'border-destructive' : 'border-input'
          )}
        >
          {options.map((v) => (
            <option key={v.no} value={v.no} className="bg-popover text-popover-foreground">
              {v.no === 0 ? '— Sin segunda varilla —' : `No. ${v.no}  (${v.area} cm²  ·  Ø${v.diam} cm)`}
            </option>
          ))}
        </select>
        {noError && <p className="text-xs text-destructive">⚠ {noError}</p>}
      </div>

      {/* Área de la varilla (display) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium leading-none text-muted-foreground">Área</span>
        <div className="flex h-9 items-center rounded-md bg-muted px-3 text-sm font-mono">
          {area.toFixed(2)} cm²
        </div>
      </div>
    </div>
  );
}

type BadgeVariant = 'ok' | 'nook' | 'na' | 'neutral' | 'warn';

function Badge({ value, variant }: { value: string; variant: BadgeVariant }) {
  return (
    <span className={cn(
      'font-mono font-semibold text-sm px-2 py-0.5 rounded',
      variant === 'ok'      && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      variant === 'nook'    && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      variant === 'na'      && 'bg-muted-foreground/20 text-muted-foreground',
      variant === 'warn'    && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      variant === 'neutral' && 'text-foreground',
    )}>
      {value}
    </span>
  );
}

function badgeFor(v: 'Ok' | 'No Ok' | 'No chequea'): BadgeVariant {
  if (v === 'Ok') return 'ok';
  if (v === 'No Ok') return 'nook';
  return 'warn';
}

// ── Paso 4 ────────────────────────────────────────────────────────────────────

/** Línea de resultado en la tabla de chequeos */
function ResultRow({
  label,
  value,
  unit,
  badge,
  formula,
}: {
  label: string;
  value?: string;
  unit?: string;
  badge?: { text: string; variant: BadgeVariant };
  formula?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-muted px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {value !== undefined && (
            <span className="font-mono font-medium text-sm tabular-nums">
              {value}
              {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
            </span>
          )}
          {badge && <Badge value={badge.text} variant={badge.variant} />}
        </div>
      </div>
      {formula && (
        <p className="text-[10px] font-mono text-muted-foreground break-all leading-relaxed">
          {formula}
        </p>
      )}
    </div>
  );
}

// ── Búsqueda de Variantes (UI) ────────────────────────────────────────────────

interface BarSelectorProps {
  selected: number[];
  onChange: (nos: number[]) => void;
}

function BarSelector({ selected, onChange }: BarSelectorProps) {
  const options = [2, 3, 4, 5, 6, 7, 8];
  
  const toggle = (n: number) => {
    if (selected.includes(n)) {
      if (selected.length > 1) onChange(selected.filter(x => x !== n));
    } else {
      onChange([...selected, n].sort((a,b) => a-b));
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
            "flex h-9 w-12 items-center justify-center rounded-md border text-sm font-bold transition-all",
            selected.includes(n) 
              ? "bg-primary text-primary-foreground border-primary shadow-sm" 
              : "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary"
          )}
        >
          #{n}
        </button>
      ))}
    </div>
  );
}

interface VariantsTableProps {
  variantes: ResultadoDisenoM2[];
  onSelect: (v: ResultadoDisenoM2) => void;
  fmt: (v: number) => string;
}

function VariantsTable({ variantes, onSelect, fmt }: VariantsTableProps) {
  if (variantes.length === 0) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 font-semibold text-muted-foreground">Armado</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">As (cm²)</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground text-center">D/C</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground text-right w-24">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {variantes.map((v, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3 font-mono font-bold text-primary flex items-center gap-2">
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
                     variant={v.chequeo_dc === 'Ok' ? 'ok' : 'nook'} 
                   />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelect(v)}
                    className="inline-flex items-center justify-center rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-primary border border-primary hover:bg-primary/5 transition-colors"
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

/**
 * PRESENTATION LAYER — Paso 4: Diseño a Flexión M2(−) Lado Derecho.
 */
export function DisenoFlexionM2Step(props: DisenoFlexionM2State) {
  const {
    asEtabs, setAsEtabs,
    qty1, setQty1, no1, setNo1,
    qty2, setQty2, no2, setNo2,
    resultado,
    errors, alertas,
    // Variantes
    nosPermitidos, setNosPermitidos,
    variantes, maxVariantes, setMaxVariantes,
    soloHorizontales, setSoloHorizontales,
    buscarVariantes, limpiarVariantes, seleccionarVariante,
  } = props;

  const fmt = (v: number, dec = 2) =>
    v.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  return (
    <div className="space-y-6">

      {/* ── Área por ETABS ───────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Acero As_M2(−)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <NumericField
            id="asEtabs"
            label="Área de acero por ETABS"
            unit="cm²"
            value={asEtabs}
            onChange={setAsEtabs}
            error={errors.asEtabs}
            hint="Valor de As directamente del análisis en ETABS"
          />
          
          <div className="space-y-4">
             <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Números de varilla a considerar</label>
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <input
                     type="checkbox"
                     className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                     checked={soloHorizontales}
                     onChange={(e) => setSoloHorizontales(e.target.checked)}
                   />
                   <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                     incluir unicamente horizontales
                   </span>
                 </label>
               </div>
               <BarSelector selected={nosPermitidos} onChange={setNosPermitidos} />
             </div>
             
             <div className="flex gap-4 items-end">
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
                      "hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 shadow-sm whitespace-nowrap"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    Sugerir
                  </button>
                  {variantes.length > 0 && (
                    <button
                      type="button"
                      onClick={limpiarVariantes}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                      title="Ocultar sugerencias"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Tabla de variantes */}
        {variantes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 border border-indigo-100 dark:border-indigo-900/30">
              <span className="text-indigo-600 dark:text-indigo-400 text-sm">💡</span>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                <strong>Tip de optimización:</strong> Mientras más cerca esté el <strong>D/C a 1.00</strong>, el diseño es más eficiente y se requerirá <strong>menos acero de cortante</strong> (estribos).
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

      <div className="h-px bg-border" />

      {/* ── Acero propuesto ───────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
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

          {/* Alerta No. 1 caro */}
          {alertas.no1Caro && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 px-3 py-2.5">
              <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
              <p className="text-xs text-amber-700 dark:text-amber-300">{alertas.no1Caro}</p>
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
            <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/10 px-3 py-2 border border-red-100 dark:border-red-900/20 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">
                NO SE RECOMIENDA HACER ESTO: Se prefiere diseño con adicionales (transversales)
              </span>
            </div>
          )}

          {/* Alerta No. 2 caro */}
          {alertas.no2Caro && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 px-3 py-2.5">
              <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
              <p className="text-xs text-amber-700 dark:text-amber-300">{alertas.no2Caro}</p>
            </div>
          )}

          {/* Alerta diferencia entre varillas */}
          {alertas.diffVarillas && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 px-3 py-2.5">
              <span className="text-red-600 dark:text-red-400 mt-0.5">⛔</span>
              <p className="text-xs text-red-700 dark:text-red-300">{alertas.diffVarillas}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Resultados ───────────────────────────────────────────── */}
      {resultado && (
        <>
          <div className="h-px bg-border" />
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Chequeos de diseño
            </h3>
            <div className="space-y-2">
              <ResultRow
                label="Área de acero propuesta As"
                value={fmt(resultado.asPropuesta)}
                unit="cm²"
                badge={{
                  text: resultado.chequeoAsEtabs,
                  variant: badgeFor(resultado.chequeoAsEtabs),
                }}
                formula={resultado.procesos.asPropuesta}
              />
              <ResultRow
                label="Área de acero por ETABS"
                value={fmt(Number(asEtabs))}
                unit="cm²"
              />
              <ResultRow 
                label="a" 
                value={fmt(resultado.a)} 
                unit="cm" 
                formula={resultado.procesos.a}
              />
              <ResultRow
                label="Momento nominal φMn"
                value={fmt(resultado.phiMn)}
                unit="kgf·m"
                formula={resultado.procesos.phiMn}
              />
              <ResultRow
                label="D/C"
                value={fmt(resultado.dc)}
                badge={{ text: resultado.chequeo_dc, variant: badgeFor(resultado.chequeo_dc) }}
                formula={resultado.procesos.dc}
              />
              <ResultRow
                label="Acero mínimo a flexión As min"
                value={fmt(resultado.asMin)}
                unit="cm²"
                formula={resultado.procesos.asMin}
              />
              <ResultRow
                label="Acero máximo a flexión As max"
                value={fmt(resultado.asMax)}
                unit="cm²"
                badge={{ text: resultado.chequeoAsMinMax, variant: badgeFor(resultado.chequeoAsMinMax) }}
                formula={resultado.procesos.asMax}
              />
              <ResultRow 
                label="c = a/β₁" 
                value={fmt(resultado.c)} 
                unit="cm" 
                formula={resultado.procesos.c}
              />
              <ResultRow
                label="Chequeo por sección controlada"
                badge={{ text: resultado.chequeoSeccionControlada, variant: badgeFor(resultado.chequeoSeccionControlada) }}
              />
            </div>
          </section>

          {/* ── Armado superior ──────────────────────────────────── */}
          <div className="h-px bg-border" />
          <section>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
              <span className="text-sm font-semibold">Armado superior</span>
              <span className="font-mono font-bold text-lg text-primary tracking-wide">
                {resultado.armadoSuperior}
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
