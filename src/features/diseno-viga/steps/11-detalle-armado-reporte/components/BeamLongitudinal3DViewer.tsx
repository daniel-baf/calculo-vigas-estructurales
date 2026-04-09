import { useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { cn } from "@/lib/utils"
import {
  createLongitudinalRods,
  getBeam3DBaseDimensions,
  type BeamLongitudinal3DData,
  type BeamRodSpec,
} from "@/shared/diseno-refuerzo/beamLongitudinal3d"

interface BeamLongitudinal3DViewerProps {
  data: BeamLongitudinal3DData
  className?: string
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false

  try {
    const canvas = document.createElement("canvas")
    const context =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    return !!(window.WebGLRenderingContext && context)
  } catch {
    return false
  }
}

function BeamScene({
  data,
  rods,
  hoveredRod,
  onHoverRod,
  onLeaveRod,
}: {
  data: BeamLongitudinal3DData
  rods: BeamRodSpec[]
  hoveredRod: BeamRodSpec | null
  onHoverRod: (rod: BeamRodSpec) => void
  onLeaveRod: () => void
}) {
  const { bwCm, hCm, lengthCm } = getBeam3DBaseDimensions(data)
  const sceneMax = Math.max(lengthCm, bwCm * 6, hCm * 6)

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[sceneMax * 0.5, sceneMax * 0.7, sceneMax * 0.4]}
        intensity={1.1}
      />
      <directionalLight
        position={[-sceneMax * 0.35, sceneMax * 0.3, -sceneMax * 0.25]}
        intensity={0.45}
      />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[bwCm, hCm, lengthCm]} />
        <meshStandardMaterial
          color="#D6D9DF"
          transparent
          opacity={0.2}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {rods.map((rod) => (
        <mesh
          key={rod.id}
          position={[rod.x, rod.y, rod.z]}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerOver={(event) => {
            event.stopPropagation()
            onHoverRod(rod)
          }}
          onPointerOut={(event) => {
            event.stopPropagation()
            onLeaveRod()
          }}
        >
          <cylinderGeometry args={[rod.radius, rod.radius, rod.length, 20]} />
          <meshStandardMaterial
            color={rod.layer === "top" ? "#2563eb" : "#d97706"}
            roughness={0.35}
            metalness={0.25}
            emissive={hoveredRod?.id === rod.id ? "#f59e0b" : "#000000"}
            emissiveIntensity={hoveredRod?.id === rod.id ? 0.3 : 0}
          />

          {hoveredRod?.id === rod.id && (
            <Html
              center
              transform={false}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: "none" }}
            >
              <div className="min-w-[144px] rounded-lg border border-primary/40 bg-card/95 px-3 py-2.5 text-base font-bold text-foreground shadow-xl backdrop-blur-sm">
                <div className="leading-tight">No. {rod.barNo || "-"}</div>
                <div className="mt-0.5 text-sm leading-tight font-medium text-muted-foreground">
                  {rod.layer === "top" ? "Superior" : "Inferior"} -{" "}
                  {rod.zoneLabel}
                </div>
              </div>
            </Html>
          )}
        </mesh>
      ))}

      <gridHelper
        args={[Math.max(lengthCm * 1.2, 120), 18, "#94a3b8", "#cbd5e1"]}
        position={[0, -hCm / 2 - 8, 0]}
      />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={sceneMax * 0.12}
        maxDistance={sceneMax * 4}
      />
    </>
  )
}

export function BeamLongitudinal3DViewer({
  data,
  className,
}: BeamLongitudinal3DViewerProps) {
  const rods = useMemo(() => createLongitudinalRods(data), [data])
  const canRender = useMemo(() => supportsWebGL(), [])
  const [hoveredRod, setHoveredRod] = useState<BeamRodSpec | null>(null)

  const { bwCm, hCm, lengthCm } = getBeam3DBaseDimensions(data)
  const sceneMax = Math.max(lengthCm, bwCm * 6, hCm * 6)

  if (!canRender) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        No se pudo inicializar WebGL en este navegador. El modelo 3D requiere
        aceleracion grafica.
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Modelo 3D interactivo - armado longitudinal
        </h3>
        <span className="text-xs text-muted-foreground">
          Arrastra para rotar, rueda para zoom, Shift + arrastre para paneo
        </span>
      </div>

      <div className="h-[320px] overflow-hidden rounded-xl border border-border bg-card/70 md:h-[420px]">
        <Canvas
          camera={{
            position: [sceneMax * 0.62, sceneMax * 0.45, sceneMax * 0.86],
            fov: 38,
          }}
          dpr={[1, 1.8]}
        >
          <BeamScene
            data={data}
            rods={rods}
            hoveredRod={hoveredRod}
            onHoverRod={setHoveredRod}
            onLeaveRod={() => setHoveredRod(null)}
          />
        </Canvas>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          Barras superiores
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
          Barras inferiores
        </span>
        <span className="ml-auto font-medium">
          Escala geometrica real en cm
        </span>
      </div>
    </div>
  )
}
