import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface BarInfo {
  qty: number
  no: number
}

interface CrossSectionData {
  title: string
  subtitle: string
  bw: number
  h: number
  fc: number
  fy: number
  topContinuous: BarInfo
  topBaston: BarInfo | null
  botContinuous: BarInfo
  botBaston: BarInfo | null
  className?: string
}

export function BeamCrossSection({
  title,
  subtitle,
  fc,
  fy,
  topContinuous,
  topBaston,
  botContinuous,
  botBaston,
  className,
}: CrossSectionData) {
  const [hovered, setHovered] = useState<"top" | "bottom" | null>(null)

  const VB_W = 200
  const VB_H = 280

  const BEAM_W_PX = 100
  const BEAM_H_PX = 160
  const X0 = (VB_W - BEAM_W_PX) / 2
  const Y0 = 40

  const STIRRUP_X0 = X0 + 5
  const STIRRUP_Y0 = Y0 + 5
  const STIRRUP_W = BEAM_W_PX - 10
  const STIRRUP_H = BEAM_H_PX - 10

  const totalTopQty = topContinuous.qty + (topBaston?.qty || 0)
  const totalBotQty = botContinuous.qty + (botBaston?.qty || 0)

  // Render bars
  const renderBars = (qty: number, y: number, isTop: boolean) => {
    if (qty <= 0) return null
    const bars = []
    const spacing = (STIRRUP_W - 10) / (qty - 1 || 1)
    const startX = STIRRUP_X0 + 5
    
    for (let i = 0; i < qty; i++) {
      const cx = qty === 1 ? STIRRUP_X0 + STIRRUP_W / 2 : startX + i * spacing
      bars.push(
        <circle
          key={`${isTop ? "t" : "b"}-${i}`}
          cx={cx}
          cy={y}
          r={3}
          className={cn(
            "fill-foreground stroke-background transition-all duration-300",
            hovered === (isTop ? "top" : "bottom") ? "r-[5] fill-primary" : ""
          )}
          strokeWidth={0.5}
        />
      )
    }
    return bars
  }

  const formatLabel = (corr: BarInfo, bast: BarInfo | null) => {
    let label = ""
    if (corr && corr.qty > 0) {
      label = `${corr.qty}#${corr.no}`
    }
    if (bast && bast.qty > 0) {
      if (label) label += " + "
      label += `${bast.qty}#${bast.no}`
    }
    return label || "—"
  }

  return (
    <div className={cn("group relative flex flex-col items-center", className)}>
      {/* Tooltip */}
      {hovered && (
        <div 
          className={cn(
            "absolute z-30 -top-6 left-1/2 -translate-x-1/2 rounded-lg border border-primary/30 bg-card/95 p-2 shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-none",
            hovered === "bottom" ? "top-auto -bottom-4" : ""
          )}
        >
          <div className="text-[10px] font-bold text-primary uppercase tracking-tighter">
            Refuerzo {hovered === "top" ? "Superior" : "Inferior"}
          </div>
          <div className="text-sm font-black text-foreground tabular-nums">
            {hovered === "top" 
              ? formatLabel(topContinuous, topBaston)
              : formatLabel(botContinuous, botBaston)
            }
          </div>
        </div>
      )}

      <svg 
        viewBox={`0 0 ${VB_W} ${VB_H}`} 
        className="w-full max-w-[200px] h-auto rounded-xl border border-border bg-card shadow-sm transition-all duration-300 group-hover:shadow-md print:bg-white print:border-black"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Concreto */}
        <rect 
          x={X0} y={Y0} width={BEAM_W_PX} height={BEAM_H_PX} 
          className="fill-muted/20 stroke-foreground print:fill-white print:stroke-black" 
          strokeWidth={1.5} 
        />
        
        {/* Textura puntos concrete */}
        {Array.from({ length: 15 }).map((_, i) => (
          <circle key={i} cx={X0 + (i * 37) % BEAM_W_PX} cy={Y0 + (i * 23) % BEAM_H_PX} r={0.5} className="fill-muted-foreground/30 print:fill-gray-400" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M${X0 + (i * 41 + 10) % BEAM_W_PX} ${Y0 + (i * 31 + 5) % BEAM_H_PX} l2 -1 l-1 2 z`} className="fill-muted-foreground/40 print:fill-gray-500" />
        ))}

        {/* Estribo */}
        <rect 
          x={STIRRUP_X0} y={STIRRUP_Y0} width={STIRRUP_W} height={STIRRUP_H} 
          fill="none" className="stroke-foreground/60 print:stroke-black" 
          strokeWidth={1} rx={2} 
        />

        {/* Barras Superiores */}
        {renderBars(totalTopQty, STIRRUP_Y0 + 5, true)}
        
        {/* Barras Inferiores */}
        {renderBars(totalBotQty, STIRRUP_Y0 + STIRRUP_H - 5, false)}

        {/* Líneas de Etiqueta Top */}
        <line x1={X0 - 10} y1={STIRRUP_Y0 + 5} x2={STIRRUP_X0 + 5} y2={STIRRUP_Y0 + 5} className="stroke-foreground/40 print:stroke-black" strokeWidth={0.8} />
        <line x1={X0 - 10} y1={STIRRUP_Y0 + 5} x2={X0 - 10} y2={STIRRUP_Y0 - 10} className="stroke-foreground/40 print:stroke-black" strokeWidth={0.8} />
        <text x={X0 - 15} y={STIRRUP_Y0 - 5} textAnchor="end" fontSize={9} fontWeight="bold" className="fill-foreground font-sans print:fill-black">
          {formatLabel(topContinuous, topBaston)}
        </text>

        {/* Líneas de Etiqueta Bot */}
        <line x1={X0 - 10} y1={STIRRUP_Y0 + STIRRUP_H - 5} x2={STIRRUP_X0 + 5} y2={STIRRUP_Y0 + STIRRUP_H - 5} className="stroke-foreground/40 print:stroke-black" strokeWidth={0.8} />
        <line x1={X0 - 10} y1={STIRRUP_Y0 + STIRRUP_H - 5} x2={X0 - 10} y2={STIRRUP_Y0 + STIRRUP_H + 10} className="stroke-foreground/40 print:stroke-black" strokeWidth={0.8} />
        <text x={X0 - 15} y={STIRRUP_Y0 + STIRRUP_H + 10} textAnchor="end" fontSize={9} fontWeight="bold" className="fill-foreground font-sans print:fill-black">
          {formatLabel(botContinuous, botBaston)}
        </text>

        {/* Títulos Inferiores */}
        <text x={VB_W / 2} y={Y0 + BEAM_H_PX + 25} textAnchor="middle" fontSize={10} fontWeight="black" className="fill-foreground font-sans uppercase print:fill-black">
          {title}
        </text>
        <text x={VB_W / 2} y={Y0 + BEAM_H_PX + 40} textAnchor="middle" fontSize={8} className="fill-muted-foreground font-sans font-medium uppercase print:fill-black">
          {subtitle}
        </text>
        <text x={VB_W / 2} y={Y0 + BEAM_H_PX + 52} textAnchor="middle" fontSize={8} className="fill-muted-foreground font-sans font-medium uppercase print:fill-black">
          FY={fy} KGF/CM2
        </text>
        <text x={VB_W / 2} y={Y0 + BEAM_H_PX + 64} textAnchor="middle" fontSize={8} className="fill-muted-foreground font-sans font-medium uppercase print:fill-black">
          F'C= {fc} KGF/CM2
        </text>

        {/* Hover Areas */}
        <rect 
          x={X0} y={Y0} width={BEAM_W_PX} height={BEAM_H_PX / 2} 
          fill="transparent" className="cursor-crosshair"
          onMouseEnter={() => setHovered("top")}
        />
        <rect 
          x={X0} y={Y0 + BEAM_H_PX / 2} width={BEAM_W_PX} height={BEAM_H_PX / 2} 
          fill="transparent" className="cursor-crosshair"
          onMouseEnter={() => setHovered("bottom")}
        />
      </svg>
    </div>
  )
}
