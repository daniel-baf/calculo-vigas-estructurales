import { Wizard } from '@/components/wizard/Wizard';
import { Button } from '@/components/ui/button';

import { ParametrosBasicosStep } from '@/features/diseno-viga/steps/1-parametros-basicos/ParametrosBasicosStep';
import { useParametrosBasicos } from '@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos';
import { CargasGravitacionalesStep } from '@/features/diseno-viga/steps/2-cargas-gravitacionales/CargasGravitacionalesStep';
import { useCargasGravitacionales } from '@/features/diseno-viga/steps/2-cargas-gravitacionales/useCargasGravitacionales';
import { DisenoFlexionStep } from '@/features/diseno-viga/steps/3-diseno-flexion/DisenoFlexionStep';
import { useDisenoFlexion } from '@/features/diseno-viga/steps/3-diseno-flexion/useDisenoFlexion';

export function DesignWizard() {
  const step1 = useParametrosBasicos();
  const step2 = useCargasGravitacionales(step1.bw, step1.h);
  // Step 3 recibe geometría del Paso 1 para chequeo de sección y tipo de pórtico
  const step3 = useDisenoFlexion(step1.portico, step1.L as number, step1.d, step1.bw, step1.h);

  const steps = [
    {
      id: 'parametros-basicos',
      title: 'Parámetros Básicos',
      component: <ParametrosBasicosStep {...step1} />,
      isValid: step1.isValid,
    },
    {
      id: 'cargas-gravitacionales',
      title: 'Cargas',
      component: <CargasGravitacionalesStep {...step2} />,
      isValid: step2.isValid,
    },
    {
      id: 'diseno-flexion',
      title: 'Flexión',
      component: <DisenoFlexionStep {...step3} />,
      isValid: step3.isValid,
    },
    // TODO: Paso 4 — Diseño de sección (As, verificaciones)
    // TODO: Paso 5 — Resumen y exportación
  ];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8 relative">
        <Wizard steps={steps} />
      </div>

      {/* Botón flotante Global MOCK */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          className="shadow-lg border border-border"
          onClick={() => {
            // Step 1
            step1.setFc(280);
            step1.setGradoAcero('G60'); // fy=4200
            step1.setTipoConcreto('NORMAL'); // lambda=1.00
            step1.setPortico('P.E');
            step1.setBw(25);
            step1.setH(40);
            step1.setRec(4);
            step1.setL(6.05);

            // Step 2
            step2.setAT('13.61');
            step2.setCvKgM2('300');
            step2.setScKgM2('215');
            step2.setSvd('0.2448');

            // Step 3
            step3.setM1('8231.96');
            step3.setMcenter('4304.52');
            step3.setM2('8221.33');
          }}
        >
          🧪 Autollenar Mock
        </Button>
      </div>
    </>
  );
}
