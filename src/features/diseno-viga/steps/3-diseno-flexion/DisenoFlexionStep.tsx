import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MomentDiagram } from '@/components/charts/MomentDiagram';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { DisenoFlexionState } from './useDisenoFlexion';

// ── Subcomponentes ────────────────────────────────────────────────────────────

interface NumericFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
}

function NumericField({ id, label, unit, value, onChange, error, hint }: NumericFieldProps) {
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
        min={0}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className={cn(
          'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
        )}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">⚠ {error}</p>}
    </div>
  );
}

// ── Paso 3 ────────────────────────────────────────────────────────────────────

/**
 * PRESENTATION LAYER — Paso 3: Diseño a Flexión.
 */
export function DisenoFlexionStep(props: DisenoFlexionState) {
  const {
    M1, setM1,
    Mcenter, setMcenter,
    M2, setM2,
    PHI_FLEXION,
    BRAZO_J,
    errors,
  } = props;

  const [modoIngreso, setModoIngreso] = useState<'manual' | 'combinaciones'>('manual');

  // Alerta cuando seleccionan "Generar combinaciones"
  const handleModoChange = (v: string) => {
    if (v === 'combinaciones') {
      alert('Se implementará en el futuro. De momento, solo se permite ingresar los momentos manualmente.');
      return;
    }
    setModoIngreso(v as typeof modoIngreso);
  };

  const hasValues = !!M1 && !!Mcenter && !!M2;

  return (
    <div className="space-y-6">

      {/* ── Chequeo de sección ──────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Chequeo de Sección
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {/* φ flexión */}
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2.5">
            <span className="text-sm">Factor φ a flexión</span>
            <span className="font-mono font-semibold text-sm">{PHI_FLEXION}</span>
          </div>

          {/* Chequeo de secciones */}
          <div className="flex flex-col gap-1 rounded-lg bg-muted px-4 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm">Chequeo de secciones</span>
              <span className={cn(
                'font-mono font-semibold text-sm px-2 py-0.5 rounded',
                props.chequeo === 'Ok'         ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                props.chequeo === 'No Ok'      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                props.chequeo === 'No chequea' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                           'bg-muted-foreground/20 text-muted-foreground'
              )}>
                {props.chequeo}
              </span>
            </div>
            {props.chequeoProceso && (
              <p className="text-[10px] font-mono text-muted-foreground break-all leading-relaxed">
                {props.chequeoProceso}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* ── Modo de ingreso ──────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Momentos de Diseño
        </h3>

        {/* Toggle modo */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium">Modo de ingreso</label>
          <SegmentedControl
            options={[
              { value: 'manual',        label: 'Manual' },
              { value: 'combinaciones', label: 'Generar combinaciones' },
            ]}
            value={modoIngreso}
            onChange={handleModoChange}
          />
        </div>

        {/* Aviso de convención de signos */}
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 px-3 py-2.5 mb-4">
          <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <strong>Convención de signos:</strong> M1 y M2 son momentos negativos (hogging).
            Ingresa el valor <strong>positivo</strong> — el sistema aplicará el signo negativo internamente.
          </p>
        </div>

        {/* Campos de momentos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumericField
            id="M1"
            label="M1(−) — Izquierdo"
            unit="kgf·m"
            value={M1}
            onChange={setM1}
            error={errors.M1}
            hint="Ingresa valor positivo"
          />
          <NumericField
            id="Mcenter"
            label="Centro (+)"
            unit="kgf·m"
            value={Mcenter}
            onChange={setMcenter}
            error={errors.Mcenter}
          />
          <NumericField
            id="M2"
            label="M2(−) — Derecho"
            unit="kgf·m"
            value={M2}
            onChange={setM2}
            error={errors.M2}
            hint="Ingresa valor positivo"
          />
        </div>
      </section>

      {/* ── Diagrama de momentos ─────────────────────────────────── */}
      {hasValues && (
        <>
          <div className="h-px bg-border" />
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Diagrama de Momentos
            </h3>
            <div className="rounded-lg border border-border bg-card p-3">
              <MomentDiagram
                M1={Math.abs(Number(M1))}
                Mcenter={Number(Mcenter)}
                M2={Math.abs(Number(M2))}
              />
              <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-400 opacity-70" />
                  Negativo (hogging)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-indigo-400 opacity-70" />
                  Positivo (sagging)
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="h-px bg-border" />

      {/* ── Brazo J ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2.5">
          <div>
            <span className="text-sm font-medium">Brazo J (asumido)</span>
            <p className="text-xs text-muted-foreground mt-0.5">Quizá se implementen más opciones en el futuro.</p>
          </div>
          <span className="font-mono font-semibold text-primary">{BRAZO_J}</span>
        </div>
      </section>
    </div>
  );
}
