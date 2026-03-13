import { cn } from '@/lib/utils';

interface WizardStep {
  id: string;
  title: string;
}

interface WizardProgressProps {
  steps: WizardStep[];
  current: number;
}

/**
 * WizardProgress — indicador visual de pasos con círculos numerados.
 */
export function WizardProgress({ steps, current }: WizardProgressProps) {
  return (
    <nav aria-label="Pasos del formulario" className="mb-8">
      <ol className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isDone   = i < current;
          const isActive = i === current;

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border-2 transition-all duration-300',
                    isDone
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                      ? 'bg-card border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  )}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    'hidden sm:block text-[10px] font-medium text-center leading-tight max-w-[80px]',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500',
                    i < current ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
