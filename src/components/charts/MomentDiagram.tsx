/**
 * MomentDiagram — Diagrama de momentos flectores para viga con
 * momentos negativos en apoyos (M1, M2) y positivo en el centro.
 *
 * Convenciones visuales:
 *   - Negativo → zona SUPERIOR → rojo con rayas   (esquinas rectas en apoyos)
 *   - Positivo → zona INFERIOR → azul con rayas   (forma de colina suave)
 */

interface MomentDiagramProps {
  M1: number;       // momento izquierdo (valor positivo → se grafica negativo)
  Mcenter: number;  // momento central (positivo)
  M2: number;       // momento derecho (valor positivo → se grafica negativo)
}

// Dimensiones internas fijas del viewBox; el SVG escala al 100% del contenedor.
const VW = 520;
const VH = 220;

export function MomentDiagram({ M1, Mcenter, M2 }: MomentDiagramProps) {
  const PAD = { top: 36, bottom: 36, left: 8, right: 8 };
  const W   = VW - PAD.left - PAD.right;
  const H   = VH - PAD.top  - PAD.bottom;
  const cy  = PAD.top + H / 2; // línea de cero
  const ox  = PAD.left;

  // Escala
  const maxM  = Math.max(Math.abs(M1), Math.abs(M2), Math.abs(Mcenter), 1);
  const scale = (H / 2 * 0.92) / maxM;

  const px = (frac: number) => ox + frac * W;
  const py = (val: number)  => cy + val * scale;

  // Posiciones horizontales clave
  const X = {
    start : 0.00,
    lZero : 0.28,  // cruce izquierdo con cero
    center: 0.50,  // pico central
    rZero : 0.72,  // cruce derecho con cero
    end   : 1.00,
  };

  // Posiciones verticales
  const lPeakY  = py(-M1);       // pico M1 (arriba del eje)
  const centerY = py(Mcenter);   // pico Mcenter (abajo del eje)
  const rPeakY  = py(-M2);       // pico M2 (arriba del eje)

  // ── Paths ────────────────────────────────────────────────────────────────────

  // Región negativa izquierda — esquina recta en el apoyo izquierdo (start)
  // start → sube vertical al pico → curva suave hacia cruce cero
  const pathNegLeft = [
    `M ${px(X.start)} ${cy}`,
    `L ${px(X.start)} ${lPeakY}`,                                          // esquina recta
    `C ${px(0.10)} ${lPeakY} ${px(0.22)} ${lPeakY} ${px(X.lZero)} ${cy}`, // curva hacia cero
    `Z`,
  ].join(' ');

  // Región positiva central — colina suave simétrica
  const pathPos = [
    `M ${px(X.lZero)} ${cy}`,
    `C ${px(0.36)} ${cy} ${px(0.40)} ${centerY} ${px(X.center)} ${centerY}`,
    `C ${px(0.60)} ${centerY} ${px(0.64)} ${cy} ${px(X.rZero)} ${cy}`,
    `Z`,
  ].join(' ');

  // Región negativa derecha — esquina recta en el apoyo derecho (end)
  const pathNegRight = [
    `M ${px(X.rZero)} ${cy}`,
    `C ${px(0.78)} ${rPeakY} ${px(0.90)} ${rPeakY} ${px(X.end)} ${rPeakY}`, // curva hacia pico
    `L ${px(X.end)} ${cy}`,                                                    // esquina recta
    `Z`,
  ].join(' ');

  // Línea de contorno del diagrama completo
  const pathLine = [
    `M ${px(X.start)} ${cy}`,
    `L ${px(X.start)} ${lPeakY}`,
    `C ${px(0.10)} ${lPeakY} ${px(0.22)} ${lPeakY} ${px(X.lZero)} ${cy}`,
    `C ${px(0.36)} ${cy} ${px(0.40)} ${centerY} ${px(X.center)} ${centerY}`,
    `C ${px(0.60)} ${centerY} ${px(0.64)} ${cy} ${px(X.rZero)} ${cy}`,
    `C ${px(0.78)} ${rPeakY} ${px(0.90)} ${rPeakY} ${px(X.end)} ${rPeakY}`,
    `L ${px(X.end)} ${cy}`,
  ].join(' ');

  const fmt = (v: number) =>
    v.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
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
      <text x={VW / 2} y={14} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} fontFamily="inherit">
        Moment Diagram (kgf·m)
      </text>

      {/* Línea cero */}
      <line x1={ox} y1={cy} x2={ox + W} y2={cy} stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} />

      {/* Regiones rellenas */}
      <path d={pathNegLeft}  fill="url(#hatchRed)"  stroke="#ef4444" strokeWidth={1.5} />
      <path d={pathPos}      fill="url(#hatchBlue)" stroke="#6366f1" strokeWidth={1.5} />
      <path d={pathNegRight} fill="url(#hatchRed)"  stroke="#ef4444" strokeWidth={1.5} />

      {/* Línea de contorno */}
      <path d={pathLine} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.75} />

      {/* Valores negativos (arriba del eje) */}
      <text x={px(X.start + 0.07)} y={lPeakY - 6} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="monospace" fontWeight="bold">
        -{fmt(M1)}
      </text>
      <text x={px(X.end - 0.07)} y={rPeakY - 6} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="monospace" fontWeight="bold">
        -{fmt(M2)}
      </text>

      {/* Valor positivo (debajo del eje) */}
      <text x={px(X.center)} y={centerY + 14} textAnchor="middle" fontSize={10} fill="#6366f1" fontFamily="monospace" fontWeight="bold">
        +{fmt(Mcenter)}
      </text>

      {/* Viga (línea inferior) */}
      <rect x={ox} y={cy + H / 2 + 4} width={W} height={6} rx={0} fill="currentColor" opacity={0.15} />
    </svg>
  );
}
