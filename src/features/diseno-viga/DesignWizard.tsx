import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

import { ParametrosBasicosStep } from '@/features/diseno-viga/steps/1-parametros-basicos/ParametrosBasicosStep';
import { useParametrosBasicos } from '@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos';
import { CargasGravitacionalesStep } from '@/features/diseno-viga/steps/2-cargas-gravitacionales/CargasGravitacionalesStep';
import { useCargasGravitacionales } from '@/features/diseno-viga/steps/2-cargas-gravitacionales/useCargasGravitacionales';
import { DisenoFlexionStep } from '@/features/diseno-viga/steps/3-diseno-flexion/DisenoFlexionStep';
import { useDisenoFlexion } from '@/features/diseno-viga/steps/3-diseno-flexion/useDisenoFlexion';
import { DisenoFlexionM2Step } from '@/features/diseno-viga/steps/4-diseno-flexion-m2/DisenoFlexionM2Step';
import { useDisenoFlexionM2 } from '@/features/diseno-viga/steps/4-diseno-flexion-m2/useDisenoFlexionM2';
import { DisenoFlexionM1Step } from '@/features/diseno-viga/steps/5-diseno-flexion-m1/DisenoFlexionM1Step';
import { useDisenoFlexionM1 } from '@/features/diseno-viga/steps/5-diseno-flexion-m1/useDisenoFlexionM1';
import { DisenoFlexionM1PosStep } from '@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/DisenoFlexionM1PosStep';
import { useDisenoFlexionM1Pos } from '@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/useDisenoFlexionM1Pos';
import { Sparkles } from 'lucide-react';

import { ChecksBanner } from '@/components/ui/ChecksBanner';
import { Wizard } from '@/components/wizard/Wizard';

function CortanteResumenStep() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">Paso 6: Cortante y Resumen</h2>
        <p className="text-muted-foreground text-sm max-w-[280px] mx-auto mt-1">
          Aquí se implementará el diseño por cortante y el resumen final del proyecto.
        </p>
      </div>
    </div>
  );
}

export function DesignWizard() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const step1 = useParametrosBasicos();
  const step2 = useCargasGravitacionales(step1.bw, step1.h);
  // Step 3 recibe geometría del Paso 1 para chequeo de sección y tipo de pórtico
  const step3 = useDisenoFlexion(step1.portico, step1.L as number, step1.d, step1.bw, step1.h);
  const step4 = useDisenoFlexionM2(
    Number(step3.M2),
    step1.fc,
    step1.fy,
    step1.beta ?? 0.85,
    step1.bw,
    step1.d,
  );
  const step5 = useDisenoFlexionM1(
    Number(step3.M1),
    step1.fc,
    step1.fy,
    step1.beta ?? 0.85,
    step1.bw,
    step1.d,
  );

  const step6 = useDisenoFlexionM1Pos({
    fc: step1.fc,
    fy: step1.fy,
    bw: step1.bw,
    h: step1.h,
    d: step1.d,
    rec: step1.rec,
    portico: step1.portico,
    phiMnNeg: step5.resultado?.phiMn || 0,
    asMin: step3.asMin,
  });

  // Determinar si mostrar banner (chequeos fallidos pero campos completos)
  const showBanner = useMemo(() => {
    if (currentIdx === 2) {
      // Step 3: Flexión
      const filled = !!step3.M1 && !!step3.Mcenter && !!step3.M2;
      return filled && step3.chequeo !== 'Ok';
    }
    if (currentIdx === 3) {
      // Step 4: M2
      const filled = !!step4.asEtabs && !!step4.qty1 && !!step4.no1;
      const allChecksOk =
        step4.resultado?.chequeoAsEtabs === 'Ok' &&
        step4.resultado?.chequeo_dc === 'Ok' &&
        step4.resultado?.chequeoAsMinMax === 'Ok' &&
        step4.resultado?.chequeoSeccionControlada === 'Ok';
      return filled && !allChecksOk;
    }
    if (currentIdx === 4) {
      // Step 5: M1
      const filled = !!step5.asEtabs && !!step5.qty1 && !!step5.no1;
      const allChecksOk =
        step5.resultado?.chequeoAsEtabs === 'Ok' &&
        step5.resultado?.chequeo_dc === 'Ok' &&
        step5.resultado?.chequeoAsMinMax === 'Ok' &&
        step5.resultado?.chequeoSeccionControlada === 'Ok';
      return filled && !allChecksOk;
    }
    if (currentIdx === 5) {
      // Step 6: M1+
      return !!step6.resultado && !step6.resultado.cumpleDC;
    }
    return false;
  }, [currentIdx, step3, step4, step5, step6]);

  const steps = [
    {
      id: 'parametros-basicos',
      title: 'Datos Generales',
      component: <ParametrosBasicosStep {...step1} />,
      isValid: step1.isValid,
    },
    {
      id: 'cargas-gravitacionales',
      title: 'Cargas Gravitacionales',
      component: <CargasGravitacionalesStep {...step2} />,
      isValid: step2.isValid,
    },
    {
      id: 'diseno-flexion',
      title: 'Diseño de Flexión',
      component: <DisenoFlexionStep {...step3} />,
      isValid: step3.isValid,
    },
    {
      id: 'diseno-flexion-m2',
      title: 'M2(−) Derecho',
      component: <DisenoFlexionM2Step {...step4} />,
      isValid: step4.isValid,
    },
    {
      id: 'diseno-flexion-m1',
      title: 'M1(−) Izquierdo',
      component: <DisenoFlexionM1Step {...step5} />,
      isValid: step5.isValid,
    },
    {
      id: 'diseno-flexion-m1-pos',
      title: 'M1(+) Izquierdo',
      component: <DisenoFlexionM1PosStep {...step6} />,
      isValid: step6.isValid,
    },
    {
      id: 'cortante-resumen',
      title: 'Resumen',
      component: <CortanteResumenStep />,
      isValid: true,
    },
  ];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <ChecksBanner show={showBanner} />
        <Wizard steps={steps} onStepChange={setCurrentIdx} />
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

            // Step 4
            step4.setAsEtabs('6.63');
            step4.setQty1('2');
            step4.setNo1(6);
            step4.setQty2('1');
            step4.setNo2(4);

            // Step 5
            step5.setAsEtabs('6.65');
            step5.setQty1('2');
            step5.setNo1(6);
            step5.setQty2('1');
            step5.setNo2(4);

            // Step 6
            step6.setN1('3');
            step6.setNo1('4');
          }}
        >
          🧪 Autollenar Mock
        </Button>
      </div>
    </>
  );
}
