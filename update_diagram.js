const fs = require('fs');

let content = fs.readFileSync('src/components/beam-diagram/BeamProgressDiagram.tsx', 'utf8');

// Remove props
content = content.replace(/  lightMode\?: boolean\n/, '');
content = content.replace(/  lightMode = false,\n/, '');

// Replace texts and classes
content = content.replace(/className=\{cn\("text-sm font-semibold tracking-tight", lightMode \? "text-black" : "text-foreground"\)\}/, 'className="text-sm font-semibold tracking-tight text-foreground"');
content = content.replace(/className=\{cn\("text-xs", lightMode \? "text-slate-600" : "text-muted-foreground"\)\}/, 'className="text-xs text-muted-foreground"');
content = content.replace(/className=\{cn\("rounded-xl border p-3 shadow-sm", lightMode \? "bg-white border-slate-300" : "border-border bg-card\/60"\)\}/, 'className="rounded-xl border p-3 shadow-sm border-border bg-card/60"');
content = content.replace(/\{!lightMode && \(/, '{true && (');

// SVG styles - concrete rect
content = content.replace(
  /fill=\{lightMode \? "white" : "hsl\(220 14% 10%\)"\}\n\s*className=\{cn\(lightMode \? "stroke-black" : "stroke-\[hsl\(220,13%,30%\)\]"\)\}/g,
  'className="fill-white stroke-black dark:fill-[hsl(220,14%,10%)] dark:stroke-[hsl(220,13%,30%)]"'
);

// SVG styles - concrete dots
content = content.replace(
  /fill=\{lightMode \? "#e2e8f0" : "hsl\(220 13% 22%\)"\}/g,
  'className="fill-slate-200 dark:fill-[hsl(220,13%,22%)]"'
);

// SVG styles - cut lines
content = content.replace(
  /stroke=\{lightMode \? "black" : "hsl\(220 13% 35%\)"\} strokeWidth=\{0\.8\} strokeDasharray="4 3"/g,
  'className="stroke-black dark:stroke-[hsl(220,13%,35%)]" strokeWidth={0.8} strokeDasharray="4 3"'
);

// SVG styles - cut text
content = content.replace(
  /fill=\{lightMode \? "black" : "hsl\(220 13% 50%\)"\}/g,
  'className="fill-black dark:fill-[hsl(220,13%,50%)]"'
);

// SVG styles - dimension h lines
content = content.replace(
  /stroke=\{lightMode \? "black" : "hsl\(220 13% 40%\)"\} strokeWidth=\{0\.8\}/g,
  'className="stroke-black dark:stroke-[hsl(220,13%,40%)]" strokeWidth={0.8}'
);

fs.writeFileSync('src/components/beam-diagram/BeamProgressDiagram.tsx', content, 'utf8');

// Also update BeamCrossSection.tsx
let cross = fs.readFileSync('src/components/beam-diagram/BeamCrossSection.tsx', 'utf8');
cross = cross.replace(/  lightMode\?: boolean\n/, '');
cross = cross.replace(/  lightMode = false,\n/, '');
cross = cross.replace(/\{hovered && !lightMode && \(/, '{hovered && (');
fs.writeFileSync('src/components/beam-diagram/BeamCrossSection.tsx', cross, 'utf8');

// Also update DetalleArmadoReporteStep.tsx
let report = fs.readFileSync('src/features/diseno-viga/steps/11-detalle-armado-reporte/DetalleArmadoReporteStep.tsx', 'utf8');
report = report.replace(/\s*lightMode=\{false\} \/\/ Make it follow system theme by default/g, '');
fs.writeFileSync('src/features/diseno-viga/steps/11-detalle-armado-reporte/DetalleArmadoReporteStep.tsx', report, 'utf8');

console.log('Update complete');
