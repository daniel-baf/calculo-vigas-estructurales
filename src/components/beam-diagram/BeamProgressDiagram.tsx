/**
 * PRESENTATION — Diagrama SVG Progresivo de Viga (Vista de Elevación).
 *
 * Muestra el perfil longitudinal de la viga con el armado de refuerzo
 * construyéndose progresivamente según los pasos completados.
 * Al hacer hover sobre una zona de barras, aparece un tooltip flotante
 * con la información amplificada.
 */

import { useState } from "react"
import { BarGroup, type BarState } from "./BarGroup"
import { formatBarGroup } from "./barLabel"

// ---------------------------------------------------------------------------
// Tipos de Props
// ---------------------------------------------------------------------------

interface BarZoneInput {
  qty1: number | string
  no1: number
  qty2: number | string
  no2: number
  isValid: boolean
}

export interface BeamProgressDiagramProps {
  bw: number
  h: number
  L: number
  currentStep: number
  step4: BarZoneInput
  step5: BarZoneInput
  step6: BarZoneInput
  step7: BarZoneInput
  step8: BarZoneInput
}

// ---------------------------------------------------------------------------
// Tipos internos de la zona hover
// ---------------------------------------------------------------------------

interface HoveredZoneInfo {
  id: string
  momentLabel: string
  position: string
  label: string
  state: BarState
  /** Lado en el que aparece el tooltip: "left" | "center" | "right" */
  side: "left" | "center" | "right"
  /** Arriba o abajo de la viga */
  vertical: "top" | "bottom"
}

// ---------------------------------------------------------------------------
// Constantes del canvas SVG
// ---------------------------------------------------------------------------

const VB_W = 760
const VB_H = 190

const MARGIN_LEFT = 60
const MARGIN_RIGHT = 60
const MARGIN_TOP = 35
const MARGIN_BOT = 35

const BEAM_X0 = MARGIN_LEFT
const BEAM_X1 = VB_W - MARGIN_RIGHT
const BEAM_W = BEAM_X1 - BEAM_X0

const BEAM_Y0 = MARGIN_TOP
const BEAM_Y1 = VB_H - MARGIN_BOT
const BEAM_H = BEAM_Y1 - BEAM_Y0

const COVER = 10
const BASTON_FRAC = 0.35
const BASTON_W = BEAM_W * BASTON_FRAC

const CUT_A_X = BEAM_X0 + BEAM_W * 0.22
const CUT_B_X = BEAM_X0 + BEAM_W * 0.5
const CUT_C_X = BEAM_X0 + BEAM_W * 0.78

const Y_TOP = BEAM_Y0 + COVER + 2
const Y_BOT1 = BEAM_Y1 - COVER - 8
const Y_BOT2 = Y_BOT1 - 8

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stepState(
  stepIndex: number,
  isValid: boolean,
  currentStep: number
): BarState {
  if (currentStep < stepIndex) return "pending"
  if (currentStep === stepIndex) return isValid ? "complete" : "active"
  return isValid ? "complete" : "active"
}

// ---------------------------------------------------------------------------
// Colores para el tooltip
// ---------------------------------------------------------------------------

function stateColors(state: BarState, isBottom: boolean) {
  if (state === "pending")
    return { bg: "bg-zinc-800", border: "border-zinc-700", text: "text-zinc-400", badge: "bg-zinc-700 text-zinc-300" }
  const isAmber = isBottom
  if (state === "active")
    return {
      bg: "bg-zinc-900",
      border: isAmber ? "border-amber-500/50" : "border-blue-500/50",
      text: isAmber ? "text-amber-400" : "text-blue-400",
      badge: isAmber ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300",
    }
  return {
    bg: "bg-zinc-900",
    border: isAmber ? "border-amber-600/40" : "border-blue-600/40",
    text: isAmber ? "text-amber-400" : "text-blue-400",
    badge: isAmber ? "bg-amber-600/15 text-amber-300" : "bg-blue-600/15 text-blue-300",
  }
}

function stateLabel(state: BarState): string {
  if (state === "pending") return "Sin calcular"
  if (state === "active") return "En cálculo"
  return "Completado ✓"
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function BeamProgressDiagram({
  bw,
  h,
  L,
  currentStep,
  step4,
  step5,
  step6,
  step7,
  step8,
}: BeamProgressDiagramProps) {
  const [hoveredZone, setHoveredZone] = useState<HoveredZoneInfo | null>(null)

  const IDX_M2_NEG = 3
  const IDX_M1_NEG = 4
  const IDX_M1_POS = 5
  const IDX_M_CENTER = 6
  const IDX_M2_POS = 7

  const stateTopLeft    = stepState(IDX_M1_NEG, step5.isValid, currentStep)
  const stateTopRight   = stepState(IDX_M2_NEG, step4.isValid, currentStep)
  const stateBotLeft    = stepState(IDX_M1_POS, step6.isValid, currentStep)
  const stateBotCenter  = stepState(IDX_M_CENTER, step7.isValid, currentStep)
  const stateBotRight   = stepState(IDX_M2_POS, step8.isValid, currentStep)

  const labelTopLeft   = formatBarGroup(Number(step5.qty1), step5.no1, Number(step5.qty2), step5.no2)
  const labelTopRight  = formatBarGroup(Number(step4.qty1), step4.no1, Number(step4.qty2), step4.no2)
  const labelBotLeft   = formatBarGroup(Number(step6.qty1), step6.no1, Number(step6.qty2), step6.no2)
  const labelBotCenter = formatBarGroup(Number(step7.qty1), step7.no1, Number(step7.qty2), step7.no2)
  const labelBotRight  = formatBarGroup(Number(step8.qty1), step8.no1, Number(step8.qty2), step8.no2)

  const hasTopLeft2   = Number(step5.qty2) > 0 && step5.no2 > 0
  const hasTopRight2  = Number(step4.qty2) > 0 && step4.no2 > 0
  const hasBotLeft2   = Number(step6.qty2) > 0 && step6.no2 > 0
  const hasBotCenter2 = Number(step7.qty2) > 0 && step7.no2 > 0
  const hasBotRight2  = Number(step8.qty2) > 0 && step8.no2 > 0

  const beamLabel = `${bw}×${h} cm  L=${Number(L).toFixed(2)} m`

  // Definición de zonas hover (como rectángulos invisibles sobre el SVG)
  const hoverZones: Array<{
    id: string
    x: number
    y: number
    w: number
    hh: number
    info: HoveredZoneInfo
  }> = [
    {
      id: "top-left",
      x: BEAM_X0,
      y: BEAM_Y0,
      w: BASTON_W,
      hh: BEAM_H / 2,
      info: { id: "top-left", momentLabel: "M1(−)", position: "Apoyo Izquierdo", label: labelTopLeft || "—", state: stateTopLeft, side: "left", vertical: "top" },
    },
    {
      id: "top-right",
      x: BEAM_X1 - BASTON_W,
      y: BEAM_Y0,
      w: BASTON_W,
      hh: BEAM_H / 2,
      info: { id: "top-right", momentLabel: "M2(−)", position: "Apoyo Derecho", label: labelTopRight || "—", state: stateTopRight, side: "right", vertical: "top" },
    },
    {
      id: "bot-left",
      x: BEAM_X0,
      y: BEAM_Y0 + BEAM_H / 2,
      w: BASTON_W,
      hh: BEAM_H / 2,
      info: { id: "bot-left", momentLabel: "M1(+)", position: "Apoyo Izquierdo", label: labelBotLeft || "—", state: stateBotLeft, side: "left", vertical: "bottom" },
    },
    {
      id: "bot-center",
      x: BEAM_X0 + BASTON_W,
      y: BEAM_Y0 + BEAM_H / 2,
      w: BEAM_W - BASTON_W * 2,
      hh: BEAM_H / 2,
      info: { id: "bot-center", momentLabel: "M(+) Centro", position: "Centro — Corridas", label: labelBotCenter || "—", state: stateBotCenter, side: "center", vertical: "bottom" },
    },
    {
      id: "bot-right",
      x: BEAM_X1 - BASTON_W,
      y: BEAM_Y0 + BEAM_H / 2,
      w: BASTON_W,
      hh: BEAM_H / 2,
      info: { id: "bot-right", momentLabel: "M2(+)", position: "Apoyo Derecho", label: labelBotRight || "—", state: stateBotRight, side: "right", vertical: "bottom" },
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Progreso de Armado — Vista en Elevación
        </h3>
        <span className="text-xs text-muted-foreground">{beamLabel}</span>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-3">
        {/* Tooltip flotante */}
        <div className="relative mb-1 h-0">
          {hoveredZone && (
            <HoverTooltip zone={hoveredZone} beamW={BEAM_W} />
          )}
        </div>

        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full"
          aria-label="Diagrama de armado de viga"
          onMouseLeave={() => setHoveredZone(null)}
        >
          {/* Fondo del concreto */}
          <rect
            x={BEAM_X0}
            y={BEAM_Y0}
            width={BEAM_W}
            height={BEAM_H}
            fill="hsl(220 14% 10%)"
            stroke="hsl(220 13% 30%)"
            strokeWidth={1.5}
            rx={2}
          />

          {/* Textura concreto */}
          {Array.from({ length: 40 }).map((_, i) => (
            <circle
              key={i}
              cx={BEAM_X0 + 40 + ((i * 173) % (BEAM_W - 80))}
              cy={BEAM_Y0 + 18 + ((i * 97) % (BEAM_H - 36))}
              r={1.2}
              fill="hsl(220 13% 22%)"
            />
          ))}

          {/* Líneas de corte verticales */}
          {[
            { x: CUT_A_X, label: "A" },
            { x: CUT_B_X, label: "B" },
            { x: CUT_C_X, label: "C" },
          ].map(({ x, label }) => (
            <g key={label}>
              <line x1={x} y1={BEAM_Y0 - 14} x2={x} y2={BEAM_Y1 + 14}
                stroke="hsl(220 13% 35%)" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={x} y={BEAM_Y0 - 18} textAnchor="middle" fontSize={9}
                fontFamily="'Inter', ui-sans-serif, sans-serif" fontWeight="600"
                fill="hsl(220 13% 50%)">
                {label}
              </text>
              <text x={x} y={BEAM_Y1 + 22} textAnchor="middle" fontSize={9}
                fontFamily="'Inter', ui-sans-serif, sans-serif" fontWeight="600"
                fill="hsl(220 13% 50%)">
                {label}′
              </text>
            </g>
          ))}

          {/* Dimensión h */}
          <line x1={BEAM_X0 - 12} y1={BEAM_Y0} x2={BEAM_X0 - 12} y2={BEAM_Y1}
            stroke="hsl(220 13% 40%)" strokeWidth={0.8} />
          <line x1={BEAM_X0 - 16} y1={BEAM_Y0} x2={BEAM_X0 - 8} y2={BEAM_Y0}
            stroke="hsl(220 13% 40%)" strokeWidth={0.8} />
          <line x1={BEAM_X0 - 16} y1={BEAM_Y1} x2={BEAM_X0 - 8} y2={BEAM_Y1}
            stroke="hsl(220 13% 40%)" strokeWidth={0.8} />
          <text
            x={BEAM_X0 - 22}
            y={(BEAM_Y0 + BEAM_Y1) / 2}
            textAnchor="middle"
            fontSize={8}
            fontFamily="'Inter', ui-sans-serif, sans-serif"
            fill="hsl(220 13% 50%)"
            transform={`rotate(-90, ${BEAM_X0 - 22}, ${(BEAM_Y0 + BEAM_Y1) / 2})`}
          >
            {h} cm
          </text>

          {/* ── BARRAS SUPERIORES ── */}
          <BarGroup
            x1={BEAM_X0 + COVER} x2={BEAM_X0 + BASTON_W}
            y={Y_TOP} label={labelTopLeft} state={stateTopLeft}
            labelPosition="above" hasSecondRow={hasTopLeft2} secondRowOffset={7}
          />
          <BarGroup
            x1={BEAM_X1 - BASTON_W} x2={BEAM_X1 - COVER}
            y={Y_TOP} label={labelTopRight} state={stateTopRight}
            labelPosition="above" hasSecondRow={hasTopRight2} secondRowOffset={7}
          />

          {/* ── BARRAS INFERIORES ── */}
          <BarGroup
            x1={BEAM_X0 + COVER} x2={BEAM_X1 - COVER}
            y={Y_BOT1} label={labelBotCenter} state={stateBotCenter}
            labelPosition="below" hasSecondRow={hasBotCenter2} secondRowOffset={-7}
          />
          <BarGroup
            x1={BEAM_X0 + COVER} x2={BEAM_X0 + BASTON_W}
            y={Y_BOT2} label={labelBotLeft} state={stateBotLeft}
            labelPosition="below" hasSecondRow={hasBotLeft2} secondRowOffset={-7}
          />
          <BarGroup
            x1={BEAM_X1 - BASTON_W} x2={BEAM_X1 - COVER}
            y={Y_BOT2} label={labelBotRight} state={stateBotRight}
            labelPosition="below" hasSecondRow={hasBotRight2} secondRowOffset={-7}
          />

          {/* Borde exterior */}
          <rect
            x={BEAM_X0} y={BEAM_Y0} width={BEAM_W} height={BEAM_H}
            fill="none" stroke="hsl(220 13% 32%)" strokeWidth={1.5} rx={2}
          />

          {/* ── Zonas de hover invisibles ── */}
          {hoverZones.map((zone) => (
            <rect
              key={zone.id}
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.hh}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredZone(zone.info)}
            />
          ))}
        </svg>

        {/* Leyenda */}
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 px-1">
          <LegendItem color="hsl(220 13% 38%)" dashed label="Sin calcular" />
          <LegendItem color="#f59e0b" label="Calculando..." />
          <LegendItem color="#d97706" label="Acero inferior ✓" />
          <LegendItem color="#2563eb" label="Acero superior ✓" />
          <span className="ml-auto text-xs text-muted-foreground/60">
            Pasa el cursor sobre la viga para ampliar
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tooltip flotante
// ---------------------------------------------------------------------------

function HoverTooltip({ zone }: { zone: HoveredZoneInfo; beamW: number }) {
  const isBottom = zone.vertical === "bottom"
  const colors = stateColors(zone.state, isBottom)

  const alignClass =
    zone.side === "left"
      ? "left-0"
      : zone.side === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2"

  return (
    <div
      className={`absolute z-20 ${alignClass} bottom-0 mb-2 pointer-events-none`}
    >
      <div
        className={`
          rounded-lg border px-3.5 py-2.5 shadow-xl
          ${colors.bg} ${colors.border}
          backdrop-blur-sm
          animate-in fade-in-0 zoom-in-95 duration-150
        `}
        style={{ minWidth: 170 }}
      >
        {/* Momento */}
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold tabular-nums ${colors.text}`}>
            {zone.label}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {zone.momentLabel}
          </span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground/80">
            {zone.position}
          </span>
        </div>
        {/* Badge de estado */}
        <div className="mt-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}
          >
            {stateLabel(zone.state)}
          </span>
        </div>
      </div>
    </div>
  )
}

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string
  label: string
  dashed?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="20" height="8" viewBox="0 0 20 8">
        <line
          x1={0} y1={4} x2={20} y2={4}
          stroke={color}
          strokeWidth={3}
          strokeDasharray={dashed ? "4 3" : undefined}
          strokeLinecap="round"
          opacity={dashed ? 0.5 : 1}
        />
      </svg>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
