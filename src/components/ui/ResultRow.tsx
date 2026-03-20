import { cn } from '@/lib/utils';
import { FormulaRenderer } from '@/shared/components/FormulaRenderer';

export type ResultStatus = 'ok' | 'no ok' | 'warn';

interface ResultRowProps {
  label: string;
  value?: string | number;
  unit?: string;
  status?: ResultStatus;
  highlight?: boolean;
  hint?: string;
  proceso?: string | { formula: string; sustitucion: string };
}

export function ResultRow({
  label,
  value,
  unit,
  status,
  highlight,
  hint,
  proceso,
}: ResultRowProps) {
  return (
    <div className={cn(
      'flex flex-col gap-1 rounded-lg px-4 py-2.5 transition-all',
      highlight
        ? 'bg-primary/10 border border-primary/20'
        : 'bg-muted/50 border border-transparent'
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className={cn(
            "text-sm",
            highlight ? "font-semibold text-primary" : "text-foreground"
          )}>
            {label}
          </span>
          {hint && <span className="text-[10px] text-muted-foreground uppercase font-medium">{hint}</span>}
        </div>
        <div className="flex items-center gap-3">
          {value !== undefined && (
            <span className={cn(
              "font-mono text-sm tabular-nums",
              highlight ? "font-bold text-primary" : "font-medium"
            )}>
              {typeof value === 'number'
                ? value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : value}
              {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
            </span>
          )}
          {status && (
            <span className={cn(
              "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
              status === 'ok' && "bg-green-500/10 text-green-600 border-green-500/20",
              status === 'no ok' && "bg-red-500/10 text-red-600 border-red-500/20",
              status === 'warn' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
            )}>
              {status === 'ok' ? 'Ok' : status === 'no ok' ? 'No Ok' : '⚠️'}
            </span>
          )}
        </div>
      </div>

      {proceso && (
        <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2">
          {typeof proceso === 'string' ? (
            <div className="overflow-x-auto">
              <FormulaRenderer formula={proceso} className="text-sm" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <FormulaRenderer
                  formula={proceso.formula}
                  className="font-medium text-foreground text-sm"
                />
              </div>
              <div className="overflow-x-auto">
                <FormulaRenderer
                  formula={proceso.sustitucion}
                  className="text-muted-foreground text-xs"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
