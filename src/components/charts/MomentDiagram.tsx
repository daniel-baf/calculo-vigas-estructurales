/**
 * MomentDiagram — Diagrama de momentos flectores para viga con
 * momentos negativos en apoyos (M1, M2) y positivo en el centro.
 *
 * Convenciones visuales (igual que la imagen de referencia):
 *   - Negativo → zona SUPERIOR → rojo con rayas
 *   - Positivo → zona INFERIOR → azul con rayas
 */

interface MomentDiagramProps {
  M1: number;       // momento izquierdo (valor positivo → se grafica negativo)
  Mcenter: number;  // momento central (positivo)
  M2: number;       // momento derecho (valor positivo → se grafica negativo)
  width?: number;
  height?: number;
}

export function MomentDiagram({
  M1,
  Mcenter,
  M2,
  width = 520,
  height = 220,
}: MomentDiagramProps) {
  const PAD  = { top: 36, bottom: 36, left: 8, right: 8 };
  const W    = width  - PAD.left - PAD.right;
  const H    = height - PAD.top  - PAD.bottom;
  const cy   = PAD.top + H / 2; // línea de cero
  const ox   = PAD.left;

  // Escala: el mayor valor absoluto ocupa el 95% de la mitad disponible
  const maxM = Math.max(Math.abs(M1), Math.abs(M2), Math.abs(Mcenter), 1);
  const scale = (H / 2 * 0.92) / maxM;

  // Helpers
  const px = (frac: number) => ox + frac * W;
  // Valor positivo → baja (debajo del eje), negativo en imagen → sube
  // M1 y M2 se ingresan como positivos y se GRAFICAN arriba (negativos)
  // Mcenter es positivo y se grafica abajo
  const py = (val: number) => cy + val * scale;

  // Fracciones de posición a lo largo del span
  const X = {
    start : 0.00,
    lPeak : 0.24,  // pico M1
    lZero : 0.40,  // cruce con cero
    center: 0.50,  // pico Mcenter
    rZero : 0.60,  // cruce con cero
    rPeak : 0.76,  // pico M2
    end   : 1.00,
  };

  // Valores Y (M1 y M2 se invierten para graficar como negativos)
  const Y = {
    zero  : cy,
    lPeak : py(-M1),      // arriba del eje → negativo
    center: py(Mcenter),  // abajo del eje  → positivo
    rPeak : py(-M2),      // arriba del eje → negativo
  };

  // ── Paths SVG ──────────────────────────────────────────────────────────────
  // Región negativa izquierda (roja)
  const pathNegLeft = [
    `M ${px(X.start)} ${cy}`,
    `C ${px(0.08)} ${Y.lPeak} ${px(0.16)} ${Y.lPeak} ${px(X.lPeak)} ${Y.lPeak}`,
    `C ${px(0.32)} ${Y.lPeak} ${px(0.38)} ${cy} ${px(X.lZero)} ${cy}`,
    `Z`,
  ].join(' ');

  // Región positiva central (azul)
  const pathPos = [
    `M ${px(X.lZero)} ${cy}`,
    `C ${px(0.44)} ${Y.center} ${px(0.46)} ${Y.center} ${px(X.center)} ${Y.center}`,
    `C ${px(0.54)} ${Y.center} ${px(0.56)} ${cy} ${px(X.rZero)} ${cy}`,
    `Z`,
  ].join(' ');

  // Región negativa derecha (roja)
  const pathNegRight = [
    `M ${px(X.rZero)} ${cy}`,
    `C ${px(0.62)} ${Y.rPeak} ${px(0.68)} ${Y.rPeak} ${px(X.rPeak)} ${Y.rPeak}`,
    `C ${px(0.84)} ${Y.rPeak} ${px(0.92)} ${cy} ${px(X.end)} ${cy}`,
    `Z`,
  ].join(' ');

  // Línea de contorno (todo el diagrama)
  const pathLine = [
    `M ${px(X.start)} ${cy}`,
    `C ${px(0.08)} ${Y.lPeak} ${px(0.16)} ${Y.lPeak} ${px(X.lPeak)} ${Y.lPeak}`,
    `C ${px(0.32)} ${Y.lPeak} ${px(0.36)} ${cy} ${px(X.lZero)} ${cy}`,
    `C ${px(0.44)} ${Y.center} ${px(0.46)} ${Y.center} ${px(X.center)} ${Y.center}`,
    `C ${px(0.54)} ${Y.center} ${px(0.56)} ${cy} ${px(X.rZero)} ${cy}`,
    `C ${px(0.62)} ${Y.rPeak} ${px(0.68)} ${Y.rPeak} ${px(X.rPeak)} ${Y.rPeak}`,
    `C ${px(0.84)} ${Y.rPeak} ${px(0.92)} ${cy} ${px(X.end)} ${cy}`,
  ].join(' ');

  const fmt = (v: number) =>
    v.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width }}
      className="overflow-visible"
      aria-label="Diagrama de momentos flectores"
    >
      <defs>
        <pattern id="hatchRed" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6" />
        </pattern>
        <pattern id="hatchBlue" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
        </pattern>
      </defs>

      {/* Título */}
      <text x={width / 2} y={14} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} fontFamily="inherit">
        Moment Diagram (kgf·m)
      </text>

      {/* Línea cero */}
      <line x1={ox} y1={cy} x2={ox + W} y2={cy} stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} />

      {/* Regiones rellenas */}
      <path d={pathNegLeft}  fill="url(#hatchRed)"  stroke="#ef4444" strokeWidth={1.5} />
      <path d={pathPos}      fill="url(#hatchBlue)" stroke="#6366f1" strokeWidth={1.5} />
      <path d={pathNegRight} fill="url(#hatchRed)"  stroke="#ef4444" strokeWidth={1.5} />

      {/* Línea de contorno */}
      <path d={pathLine} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={0.5} />

      {/* Valores — negativos (arriba del eje) */}
      <text x={px(X.lPeak)} y={Y.lPeak - 6} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="monospace" fontWeight="bold">
        -{fmt(M1)}
      </text>
      <text x={px(X.rPeak)} y={Y.rPeak - 6} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="monospace" fontWeight="bold">
        -{fmt(M2)}
      </text>

      {/* Valor — positivo (debajo del eje) */}
      <text x={px(X.center)} y={Y.center + 14} textAnchor="middle" fontSize={10} fill="#6366f1" fontFamily="monospace" fontWeight="bold">
        +{fmt(Mcenter)}
      </text>

      {/* Viga (línea inferior) */}
      <rect x={ox} y={cy + H / 2 + 4} width={W} height={6} rx={2} fill="currentColor" opacity={0.15} />
    </svg>
  );
}
