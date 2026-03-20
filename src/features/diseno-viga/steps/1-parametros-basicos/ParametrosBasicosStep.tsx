import { cn } from '@/lib/utils';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { ParametrosBasicosState } from './useParametrosBasicos';

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
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

interface CalculatedFieldProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
  formula?: string;
}

function CalculatedField({ label, value, unit, formula }: CalculatedFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium leading-none flex items-center gap-1 text-muted-foreground">
        🔒 {label}
        {unit && <span className="text-xs font-normal">({unit})</span>}
      </label>
      <div className="flex h-9 items-center rounded-md border border-dashed border-border bg-muted px-3 text-sm font-mono gap-2">
        <span className="font-semibold">
          {value !== null && value !== undefined ? value : '—'}
        </span>
        {formula && (
          <span className="text-xs text-muted-foreground ml-auto">{formula}</span>
        )}
      </div>
    </div>
  );
}

// ── Separador simple ──────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-border my-1" />;
}

// ── Paso 1 ────────────────────────────────────────────────────────────────────

/**
 * PRESENTATION LAYER — Paso 1: Parámetros Básicos de la Viga.
 * Recibe el estado del hook useParametrosBasicos (spread desde App).
 */
export function ParametrosBasicosStep(props: ParametrosBasicosState) {
  const {
    fc, setFc, gradoAcero, setGradoAcero,
    tipoConcreto, setTipoConcreto, portico, setPortico,
    bw, setBw, h, setH, rec, setRec, L, setL,
    fy, lambda, beta, d, errors,
    GRADOS_ACERO, TIPOS_CONCRETO, TIPOS_PORTICO,
    FC_MIN, BW_MIN, H_MIN, REC_MIN,
  } = props;

  const gradoOptions    = Object.entries(GRADOS_ACERO).map(([k, v]) => ({ value: k, label: v.label }));
  const concretoOptions = Object.entries(TIPOS_CONCRETO).map(([k, v]) => ({ value: k, label: v.label }));
  const porticoOptions  = TIPOS_PORTICO.map((p) => ({ value: p.value, label: p.label }));
  const porticoActual   = TIPOS_PORTICO.find((p) => p.value === portico);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Paso 1: Datos Generales
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define los materiales, el sistema estructural y la geometría de la viga.
        </p>
      </div>

      {/* ── Materiales ───────────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Materiales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <NumericField
            id="fc" label="Resistencia del concreto f'c" unit="kgf/cm²"
            value={fc} onChange={setFc} min={FC_MIN}
            error={errors.fc} hint={`Mínimo reglamentario: ${FC_MIN} kgf/cm²`}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none">Resistencia del acero fy</label>
            <SegmentedControl options={gradoOptions} value={gradoAcero} onChange={setGradoAcero as (value: string) => void} className="w-full" />
            <p className="text-sm font-mono font-semibold text-primary">
              {fy.toLocaleString('es-MX')} kgf/cm²
            </p>
          </div>

          <CalculatedField label="Factor β₁" value={beta} formula="ACI 318 / NSR-10" />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium leading-none">Tipo de concreto hidráulico λ</label>
            <SegmentedControl options={concretoOptions} value={tipoConcreto} onChange={setTipoConcreto as (value: string) => void} className="w-full" />
            <p className="text-sm font-mono font-semibold text-primary">λ = {lambda}</p>
          </div>
        </div>
      </section>

      {/* ── Sistema Estructural ───────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Sistema Estructural
        </h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none">Pórtico</label>
          <SegmentedControl options={porticoOptions} value={portico} onChange={setPortico} />
          {/* TODO: el tipo de pórtico (P.E / P.I / P.O) afecta validaciones
              y factores de diseño en pasos posteriores. */}
          {porticoActual && (
            <p className="text-sm font-medium text-primary">{porticoActual.descripcion}</p>
          )}
          <p className="text-xs text-muted-foreground">Afecta los factores de diseño en pasos posteriores.</p>
        </div>
      </section>

      {/* ── Geometría ────────────────────────────────────────────── */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/10 pb-2">
          Geometría
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <NumericField
            id="bw" label="Ancho de viga (bw)" unit="cm"
            value={bw} onChange={setBw} min={BW_MIN}
            error={errors.bw} hint={`Mínimo: ${BW_MIN} cm`}
          />
          <NumericField
            id="h" label="Altura de viga (h)" unit="cm"
            value={h} onChange={setH} min={H_MIN}
            error={errors.h} hint={`Mínimo: ${H_MIN} cm`}
          />
          <NumericField
            id="rec" label="Recubrimiento (rec)" unit="cm"
            value={rec} onChange={setRec} min={REC_MIN}
            error={errors.rec} hint={`Mínimo: ${REC_MIN} cm`}
          />
          <CalculatedField label="Peralte efectivo (d)" value={d} unit="cm" formula="h − rec" />
          <div className="sm:col-span-2">
            <NumericField
              id="L" label="Luz entre apoyos (L)" unit="m"
              value={L} onChange={setL} min={0.01} step="0.01"
              error={errors.L}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
