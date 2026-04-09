import { VARILLA_MAP } from "@/shared/diseno-refuerzo/varillas"

export interface RebarGroupInput {
  qty1: number
  no1: number
  qty2: number
  no2: number
}

export interface BeamLongitudinalZoneInput {
  label: string
  top: RebarGroupInput
  bottom: RebarGroupInput
}

export interface BeamLongitudinal3DData {
  bwCm: number
  hCm: number
  lengthM: number
  coverCm: number
  zones: {
    left: BeamLongitudinalZoneInput
    center: BeamLongitudinalZoneInput
    right: BeamLongitudinalZoneInput
  }
  stirrups?: Array<{
    fromCm: number
    toCm: number
    spacingCm: number
    no: number
  }>
}

export interface BeamRodSpec {
  id: string
  x: number
  y: number
  z: number
  length: number
  radius: number
  barNo: number
  barSet: "primary" | "secondary"
  zoneLabel: string
  layer: "top" | "bottom"
}

interface BeamBaseDimensions {
  bwCm: number
  hCm: number
  coverCm: number
  lengthCm: number
}

function clampPositive(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback
  return value
}

export function getBeam3DBaseDimensions(
  data: BeamLongitudinal3DData
): BeamBaseDimensions {
  return {
    bwCm: clampPositive(Number(data.bwCm), 25),
    hCm: clampPositive(Number(data.hCm), 45),
    coverCm: clampPositive(Number(data.coverCm), 4),
    lengthCm: Math.max(clampPositive(Number(data.lengthM), 3) * 100, 50),
  }
}

function barAxisXPositions(
  count: number,
  bwCm: number,
  coverCm: number,
  radius: number
): number[] {
  if (count <= 0) return []

  const halfAvailable = Math.max(0, bwCm / 2 - coverCm - radius)
  if (count === 1 || halfAvailable === 0) return [0]

  const spacing = (halfAvailable * 2) / (count - 1)
  return Array.from({ length: count }, (_, i) => -halfAvailable + i * spacing)
}

function buildZoneRods(
  zoneLabel: string,
  zCenter: number,
  zLength: number,
  bwCm: number,
  hCm: number,
  coverCm: number,
  layer: "top" | "bottom",
  bars: RebarGroupInput
): BeamRodSpec[] {
  const qtyA = Math.max(0, Math.floor(Number(bars.qty1) || 0))
  const qtyB = Math.max(0, Math.floor(Number(bars.qty2) || 0))
  const barNoA = Math.max(0, Math.floor(Number(bars.no1) || 0))
  const barNoB = Math.max(0, Math.floor(Number(bars.no2) || 0))
  const diamA = clampPositive(VARILLA_MAP[bars.no1]?.diam ?? 0, 0.64)
  const diamB = clampPositive(VARILLA_MAP[bars.no2]?.diam ?? 0, diamA)

  const radiusA = diamA / 2
  const radiusB = diamB / 2

  const firstRowY =
    layer === "top" ? hCm / 2 - coverCm - radiusA : -hCm / 2 + coverCm + radiusA
  const secondRowOffset = Math.max(radiusA + radiusB + 0.7, 1)
  const secondRowY =
    layer === "top" ? firstRowY - secondRowOffset : firstRowY + secondRowOffset

  const rods: BeamRodSpec[] = []

  const rowAX = barAxisXPositions(qtyA, bwCm, coverCm, radiusA)
  rowAX.forEach((x, index) => {
    rods.push({
      id: `${zoneLabel}-${layer}-a-${index}`,
      x,
      y: firstRowY,
      z: zCenter,
      length: zLength,
      radius: radiusA,
      barNo: barNoA,
      barSet: "primary",
      zoneLabel,
      layer,
    })
  })

  const rowBX = barAxisXPositions(qtyB, bwCm, coverCm, radiusB)
  rowBX.forEach((x, index) => {
    rods.push({
      id: `${zoneLabel}-${layer}-b-${index}`,
      x,
      y: secondRowY,
      z: zCenter,
      length: zLength,
      radius: radiusB,
      barNo: barNoB,
      barSet: "secondary",
      zoneLabel,
      layer,
    })
  })

  return rods
}

export function createLongitudinalRods(
  data: BeamLongitudinal3DData
): BeamRodSpec[] {
  const { bwCm, hCm, coverCm, lengthCm } = getBeam3DBaseDimensions(data)

  const minCenterLength = Math.max(lengthCm * 0.12, 10)
  let sideLength = lengthCm * 0.35
  if (sideLength * 2 > lengthCm - minCenterLength) {
    sideLength = Math.max((lengthCm - minCenterLength) / 2, 8)
  }

  const centerLength = Math.max(lengthCm - sideLength * 2, minCenterLength)

  const zLeft = -lengthCm / 2 + sideLength / 2
  const zCenter = 0
  const zRight = lengthCm / 2 - sideLength / 2

  return [
    ...buildZoneRods(
      data.zones.left.label,
      zLeft,
      sideLength,
      bwCm,
      hCm,
      coverCm,
      "top",
      data.zones.left.top
    ),
    ...buildZoneRods(
      data.zones.left.label,
      zLeft,
      sideLength,
      bwCm,
      hCm,
      coverCm,
      "bottom",
      data.zones.left.bottom
    ),
    ...buildZoneRods(
      data.zones.center.label,
      zCenter,
      centerLength,
      bwCm,
      hCm,
      coverCm,
      "top",
      data.zones.center.top
    ),
    ...buildZoneRods(
      data.zones.center.label,
      zCenter,
      centerLength,
      bwCm,
      hCm,
      coverCm,
      "bottom",
      data.zones.center.bottom
    ),
    ...buildZoneRods(
      data.zones.right.label,
      zRight,
      sideLength,
      bwCm,
      hCm,
      coverCm,
      "top",
      data.zones.right.top
    ),
    ...buildZoneRods(
      data.zones.right.label,
      zRight,
      sideLength,
      bwCm,
      hCm,
      coverCm,
      "bottom",
      data.zones.right.bottom
    ),
  ]
}
