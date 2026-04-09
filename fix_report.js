const fs = require('fs');
let content = fs.readFileSync('src/features/diseno-viga/steps/11-detalle-armado-reporte/DetalleArmadoReporteStep.tsx', 'utf8');

// We will replace the entire CrossSection rendering part
// First, let's remove the getBaston function
content = content.replace(/function getBaston[\s\S]*?return \{ qty: q, no: n \}\n\}\n/, '');

// Now let's replace the BeamCrossSection calls
const oldCrossSections = `<BeamCrossSection
              title="Corte A-A'"
              subtitle={\`Viga \$\{step1.bw\}x\$\{step1.h\}cm\`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              topBaston={getBaston(step5, step9)}
              botContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              botBaston={getBaston(step6, step9)}
            />
            <BeamCrossSection
              title="Corte B-B'"
              subtitle={\`Viga \$\{step1.bw\}x\$\{step1.h\}cm\`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              topBaston={null}
              botContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              botBaston={getBaston(step7, step9)}
            />
            <BeamCrossSection
              title="Corte C-C'"
              subtitle={\`Viga \$\{step1.bw\}x\$\{step1.h\}cm\`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              topBaston={getBaston(step4, step9)}
              botContinuous={{ qty: extractArgs(step9).q1, no: extractArgs(step9).n1 }}
              botBaston={getBaston(step8, step9)}
            />`;

// Wait, the actual file content might have been modified since my earlier reading, let me just do a regex replace or just rewrite the file safely.
