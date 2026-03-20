import { useState } from "react"
import type { DisenoFlexionState } from "./useDisenoFlexion"
import { Header } from "./components/Header"
import { CheckCards } from "./components/CheckCards"
import { GeometricCheck } from "./components/GeometricCheck"
import { ModeSelector } from "./components/ModeSelector"
import { SignConventionNotice } from "./components/SignConventionNotice"
import { MomentInputs } from "./components/MomentInputs"
import { MomentDiagramCard } from "./components/MomentDiagramCard"

/**
 * PRESENTATION LAYER — Paso 3: Diseño a Flexión.
 */
export function DisenoFlexionStep(props: DisenoFlexionState) {
  const {
    M1,
    setM1,
    Mcenter,
    setMcenter,
    M2,
    setM2,
    PHI_FLEXION,
    BRAZO_J,
    procesos,
    chequeo,
    errors,
  } = props

  const [modoIngreso, setModoIngreso] = useState<"manual" | "combinaciones">(
    "manual"
  )

  const hasValues = !!M1 && !!Mcenter && !!M2

  return (
    <div className="space-y-8">
      <Header />

      <section>
        <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
          Chequeo de Sección
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <CheckCards
            PHI_FLEXION={PHI_FLEXION}
            BRAZO_J={BRAZO_J}
            procesos={procesos}
          />
          <GeometricCheck chequeo={chequeo} procesos={procesos} />
        </div>
      </section>

      <section>
        <h3 className="mb-4 border-b border-primary/10 pb-2 text-sm font-bold tracking-widest text-primary uppercase">
          Momentos de Diseño
        </h3>

        <ModeSelector
          value={modoIngreso}
          onChange={setModoIngreso}
          onBlockedAttempt={() =>
            alert(
              "Se implementará en el futuro. De momento, solo se permite ingresar los momentos manualmente."
            )
          }
        />

        <SignConventionNotice />
        <MomentInputs
          M1={M1}
          setM1={setM1}
          Mcenter={Mcenter}
          setMcenter={setMcenter}
          M2={M2}
          setM2={setM2}
          errors={errors}
        />
      </section>

      {hasValues && (
        <MomentDiagramCard
          M1={Math.abs(Number(M1))}
          Mcenter={Number(Mcenter)}
          M2={Math.abs(Number(M2))}
        />
      )}
    </div>
  )
}
