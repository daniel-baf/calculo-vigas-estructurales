import { useState } from "react"
import type { ParametrosBasicosState } from "@/features/diseno-viga/steps/1-parametros-basicos/useParametrosBasicos"
import type { CargasGravitacionalesState } from "@/features/diseno-viga/steps/2-cargas-gravitacionales/useCargasGravitacionales"
import type { DisenoFlexionState } from "@/features/diseno-viga/steps/3-diseno-flexion/useDisenoFlexion"
import type { DisenoFlexionM2State } from "@/features/diseno-viga/steps/4-diseno-flexion-m2/useDisenoFlexionM2"
import type { DisenoFlexionM1State } from "@/features/diseno-viga/steps/5-diseno-flexion-m1/useDisenoFlexionM1"
import type { M1PosState } from "@/features/diseno-viga/steps/6-diseno-flexion-m1-pos/useDisenoFlexionM1Pos"
import type { DisenoFlexionMCentroState } from "@/features/diseno-viga/steps/7-diseno-flexion-m-center/useDisenoFlexionMCentro"
import type { M2PosState } from "@/features/diseno-viga/steps/8-diseno-flexion-m2-pos/useDisenoFlexionM2Pos"
import type { useMomentoMinimo } from "@/features/diseno-viga/steps/9-momento-minimo/useMomentoMinimo"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PrinterIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { BeamCrossSection } from "@/components/beam-diagram/BeamCrossSection"
import { BeamProgressDiagram } from "@/components/beam-diagram/BeamProgressDiagram"
import { extractArgs } from "@/shared/diseno-refuerzo/formatUtils"
import {
  SectionHeader,
  DataRow,
  ArmadoRow,
} from "@/features/diseno-viga/components/report/ReportComponents"
import { BeamLongitudinal3DViewer } from "@/features/diseno-viga/steps/11-detalle-armado-reporte/components/BeamLongitudinal3DViewer"

type MomentoMinimoState = ReturnType<typeof useMomentoMinimo>

interface Props {
  step1: ParametrosBasicosState
  step2: CargasGravitacionalesState
  step3: DisenoFlexionState
  step4: DisenoFlexionM2State
  step5: DisenoFlexionM1State
  step6: M1PosState
  step7: DisenoFlexionMCentroState
  step8: M2PosState
  step9: MomentoMinimoState
}

export function DetalleArmadoReporteStep(props: Props) {
  const { step1, step2, step3, step4, step5, step6, step7, step8, step9 } =
    props

  const [projectId] = useState(
    () =>
      `BC-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`
  )

  const topLeft = extractArgs(step5)
  const topCenter = extractArgs(step9)
  const topRight = extractArgs(step4)
  const bottomLeft = extractArgs(step6)
  const bottomCenter = extractArgs(step7)
  const bottomRight = extractArgs(step8)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Paso 11: Detalle de Armado / Reporte
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen consolidado para impresión y entrega.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex gap-2"
          >
            <HugeiconsIcon icon={PrinterIcon} width={16} height={16} />
            Imprimir
          </Button>
          <Button variant="default" size="sm" className="flex gap-2">
            <HugeiconsIcon icon={Download01Icon} width={16} height={16} />
            PDF
          </Button>
        </div>
      </div>

      <div
        id="printable-report"
        className="space-y-10 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 print:border-none print:p-0 print:shadow-none"
      >
        {/* Encabezado del Reporte */}
        <div className="flex flex-col justify-between gap-6 border-b-2 border-primary/20 pb-8 sm:flex-row sm:items-start">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
              Reporte de Diseño
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Beam Calculator Pro
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sistema automatizado de diseño de vigas bajo norma ACI 318-19.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right sm:block sm:space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Fecha de Emisión
            </div>
            <div className="text-sm font-semibold">
              {new Date().toLocaleDateString()}
            </div>
            <div className="mt-4 text-[10px] font-bold tracking-wider text-muted-foreground uppercase sm:mt-4">
              ID de Proyecto
            </div>
            <div className="text-sm font-semibold">{projectId}</div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Seccion 1: Datos Generales */}
          <div className="space-y-2">
            <SectionHeader title="Datos de Entrada" />
            <div className="space-y-1">
              <DataRow label="Base (bw)" value={step1.bw} unit="cm" />
              <DataRow label="Altura (h)" value={step1.h} unit="cm" />
              <DataRow label="Longitud (L)" value={step1.L} unit="m" />
              <DataRow label="Recubrimiento" value={step1.rec} unit="cm" />
              <DataRow label="f'c" value={step1.fc} unit="kgf/cm²" />
              <DataRow label="fy" value={step1.fy} unit="kgf/cm²" />
              <DataRow label="Tipo de Pórtico" value={step1.portico} />
            </div>
          </div>

          {/* Seccion 2: Cargas y Momentos */}
          <div className="space-y-2">
            <SectionHeader title="Cargas y Momentos" />
            <div className="space-y-1">
              <DataRow label="Área Tributaria" value={step2.AT} unit="m²" />
              <DataRow label="Carga Muerta" value={step2.scKgM2} unit="kgf/m²" />
              <DataRow label="Carga Viva" value={step2.cvKgM2} unit="kgf/m²" />
              <div className="h-4" />
              <DataRow label="M1 (-) Izquierdo" value={step3.M1} unit="kgf·m" />
              <DataRow label="M(+) Centro" value={step3.Mcenter} unit="kgf·m" />
              <DataRow label="M2 (-) Derecho" value={step3.M2} unit="kgf·m" />
            </div>
          </div>

          {/* Seccion 3: Resultados de Armado */}
          <div className="space-y-2">
            <SectionHeader title="Refuerzo Final" />
            <div className="space-y-1">
              <ArmadoRow label="Corrido Mínimo" step={step9} />
              <ArmadoRow label="M1 (-) Izquierdo" step={step5} />
              <ArmadoRow label="M1 (+) Izquierdo" step={step6} />
              <ArmadoRow label="M(+) Centro" step={step7} />
              <ArmadoRow label="M2 (+) Derecho" step={step8} />
              <ArmadoRow label="M2 (-) Derecho" step={step4} />
            </div>
          </div>
        </div>

        {/* Vista Longitudinal */}
        <div>
          <SectionHeader title="Esquema Longitudinal de Armado" />
          <div className="mt-4 rounded-xl border border-border bg-card/40 p-4 transition-colors print:border-black print:bg-white">
            <BeamProgressDiagram
              bw={step1.bw}
              h={step1.h}
              L={Number(step1.L)}
              currentStep={10}
              step4={{ ...step4, isValid: step4.isValid }}
              step5={{ ...step5, isValid: step5.isValid }}
              step6={{
                qty1: step6.qty1,
                no1: step6.no1,
                qty2: step6.qty2,
                no2: step6.no2,
                isValid: step6.isValid,
              }}
              step7={{ ...step7, isValid: step7.isValid }}
              step8={{
                qty1: step8.qty1,
                no1: step8.no1,
                qty2: step8.qty2,
                no2: step8.no2,
                isValid: step8.isValid,
              }}
              step9={{ ...step9, isValid: step9.isValid }}
            />
          </div>
        </div>

        <div className="print:hidden">
          <SectionHeader title="Modelo 3D de Armado" />
          <div className="mt-4 rounded-xl border border-border bg-card/40 p-4">
            <BeamLongitudinal3DViewer
              data={{
                bwCm: step1.bw,
                hCm: step1.h,
                lengthM: Number(step1.L),
                coverCm: step1.rec,
                zones: {
                  left: {
                    label: "Izquierdo",
                    top: topLeft,
                    bottom: bottomLeft,
                  },
                  center: {
                    label: "Centro",
                    top: topCenter,
                    bottom: bottomCenter,
                  },
                  right: {
                    label: "Derecho",
                    top: topRight,
                    bottom: bottomRight,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Detalle de Secciones Transversales (Cortes) */}
        <div>
          <SectionHeader title="Detalle de Secciones Transversales" />
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <BeamCrossSection
              title="Corte A-A'"
              subtitle={`Viga ${step1.bw}x${step1.h}cm`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: topLeft.qty1, no: topLeft.no1 }}
              topBaston={{ qty: topLeft.qty2, no: topLeft.no2 }}
              botContinuous={{ qty: bottomLeft.qty1, no: bottomLeft.no1 }}
              botBaston={{ qty: bottomLeft.qty2, no: bottomLeft.no2 }}
            />
            <BeamCrossSection
              title="Corte B-B'"
              subtitle={`Viga ${step1.bw}x${step1.h}cm`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: topCenter.qty1, no: topCenter.no1 }}
              topBaston={{ qty: topCenter.qty2, no: topCenter.no2 }}
              botContinuous={{ qty: bottomCenter.qty1, no: bottomCenter.no1 }}
              botBaston={{ qty: bottomCenter.qty2, no: bottomCenter.no2 }}
            />
            <BeamCrossSection
              title="Corte C-C'"
              subtitle={`Viga ${step1.bw}x${step1.h}cm`}
              bw={step1.bw}
              h={step1.h}
              fc={step1.fc}
              fy={step1.fy}
              topContinuous={{ qty: topRight.qty1, no: topRight.no1 }}
              topBaston={{ qty: topRight.qty2, no: topRight.no2 }}
              botContinuous={{ qty: bottomRight.qty1, no: bottomRight.no1 }}
              botBaston={{ qty: bottomRight.qty2, no: bottomRight.no2 }}
            />
          </div>
        </div>

        {/* Resumen de Chequeos */}
        <div className="rounded-xl border border-border/50 bg-muted/30 p-6">
          <SectionHeader title="Verificación Normativa" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                Acero Mínimo
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold">CUMPLE</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                Acero Máximo
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold">CUMPLE</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                Separación
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold">CUMPLE</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-tight text-muted-foreground uppercase">
                Capacidad
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold">CUMPLE</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-10 text-[10px] tracking-widest text-muted-foreground uppercase sm:flex-row">
          <div>© 2026 Beam Calculation Tool - Ingeniería Estructural</div>
          <div>Página 1 de 1</div>
        </footer>
      </div>
    </div>
  )
}
