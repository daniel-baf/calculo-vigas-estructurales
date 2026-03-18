import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { WizardProgress } from './WizardProgress';
import { Button } from '@/components/ui/button';

interface WizardStepDef {
  id: string;
  title: string;
  component: ReactNode;
  isValid: boolean;
}

interface WizardProps {
  steps: WizardStepDef[];
  className?: string;
  onStepChange?: (index: number) => void;
}

/**
 * Wizard — contenedor genérico de pasos con animaciones CSS.
 */
export function Wizard({ steps, className, onStepChange }: WizardProps) {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animKey,   setAnimKey]   = useState(0);

  const isFirst = current === 0;
  const isLast  = current === steps.length - 1;
  const step    = steps[current];

  function navigate(nextIndex: number) {
    setDirection(nextIndex > current ? 'forward' : 'backward');
    setCurrent(nextIndex);
    setAnimKey(k => k + 1);
    onStepChange?.(nextIndex);
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <WizardProgress steps={steps} current={current} />

      <div
        key={animKey}
        className={cn(
          'wizard-step',
          direction === 'forward' ? 'wizard-step--forward' : 'wizard-step--backward'
        )}
      >
        {step.component}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate(current - 1)}
          disabled={isFirst}
        >
          ← Anterior
        </Button>

        <span className="text-xs text-muted-foreground">
          Paso {current + 1} de {steps.length}
        </span>

        <Button
          onClick={() => navigate(current + 1)}
          disabled={isLast || !step.isValid}
          title={!step.isValid ? 'Completa todos los campos requeridos' : undefined}
        >
          {isLast ? 'Finalizar' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  );
}
