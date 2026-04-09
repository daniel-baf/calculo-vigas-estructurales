/**
 * Componente SVG — Grupo de barras de refuerzo.
 * Renderiza una o dos líneas de barra con su etiqueta lateral.
 */

export type BarState = "pending" | "active" | "complete"

interface BarGroupProps {
  /** Coordenada X de inicio */
  x1: number
  /** Coordenada X de fin */
  x2: number
  /** Coordenada Y base (centro de la primera línea de barra) */
  y: number
  /** Etiqueta textual del armado, p.ej. "3Ø#4 + 2Ø#5" */
  label: string
  /** Estado visual */
  state: BarState
  /** Posición del label: "above" | "below" */
  labelPosition?: "above" | "below"
  /** Offset Y para la segunda capa de barra (si hay) */
  secondRowOffset?: number
  /** Mostrar segunda fila de barra (cuando hay 2 capas) */
  hasSecondRow?: boolean
}

const BAR_STROKE_WIDTH = 3.5
const PENDING_DASH = "6 4"

function getStrokeColor(state: BarState, isBottom: boolean): string {
  if (state === "pending") return "#3f3f46" // zinc-700
  if (state === "active") return isBottom ? "#f59e0b" : "#3b82f6" // amber/blue
  return isBottom ? "#d97706" : "#2563eb" // amber-600 / blue-600
}

function getLabelColor(state: BarState): string {
  if (state === "pending") return "#52525b"
  if (state === "active") return "#fbbf24"
  return "#94a3b8"
}

export function BarGroup({
  x1,
  x2,
  y,
  label,
  state,
  labelPosition = "above",
  secondRowOffset = 7,
  hasSecondRow = false,
}: BarGroupProps) {
  const isBottom = labelPosition === "below"
  const stroke = getStrokeColor(state, isBottom)
  const strokeDasharray = state === "pending" ? PENDING_DASH : undefined
  const opacity = state === "pending" ? 0.4 : 1
  const labelColor = getLabelColor(state)
  const labelY =
    labelPosition === "above" ? y - 10 : y + (hasSecondRow ? secondRowOffset : 0) + 12

  return (
    <g opacity={opacity}>
      {/* Primera fila de barra */}
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={stroke}
        strokeWidth={BAR_STROKE_WIDTH}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
      {/* Segunda fila de barra (bastones adicionales) */}
      {hasSecondRow && (
        <line
          x1={x1}
          y1={y + secondRowOffset}
          x2={x2}
          y2={y + secondRowOffset}
          stroke={stroke}
          strokeWidth={BAR_STROKE_WIDTH - 1}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          opacity={0.75}
        />
      )}
      {/* Etiqueta */}
      {label && state !== "pending" && (
        <text
          x={(x1 + x2) / 2}
          y={labelY}
          textAnchor="middle"
          fontSize={11}
          fontFamily="'Inter', 'ui-sans-serif', sans-serif"
          fontWeight="600"
          fill={labelColor}
          style={{ userSelect: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
