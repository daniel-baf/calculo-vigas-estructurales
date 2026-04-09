/**
 * Helper puro para formatear etiquetas de grupos de barras.
 * Convierte (qty, no) → "3Ø#4" o "2Ø#5 + 3Ø#4" para dos capas.
 */
export function formatBarLabel(qty: number, no: number): string {
  if (!qty || !no) return ""
  return `${qty}Ø#${no}`
}

export function formatBarGroup(
  qty1: number,
  no1: number,
  qty2: number,
  no2: number
): string {
  const label1 = formatBarLabel(qty1, no1)
  if (!qty2 || !no2 || qty2 === 0) return label1
  const label2 = formatBarLabel(qty2, no2)
  if (!label1) return label2
  return `${label1} + ${label2}`
}
