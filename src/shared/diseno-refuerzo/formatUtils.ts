/**
 * Utilidades puras para extracción y formateo estandarizado de varillas de refuerzo.
 */

export interface RebarArgs {
  qty1: number
  no1: number
  qty2: number
  no2: number
}

/**
 * Extrae de forma segura la cantidad y número de varillas desde cualquier paso (step),
 * homogeneizando las diferencias históricas de nombres en las interfaces (n1 vs qty1).
 */
export function extractArgs(step: any): RebarArgs {
  if (!step) return { qty1: 0, no1: 0, qty2: 0, no2: 0 }
  
  // Soporte dual para "qty1" o "n1"
  const qty1 = Number(step.qty1 ?? step.n1) || 0
  const no1 = Number(step.no1) || 0
  
  const qty2 = Number(step.qty2 ?? step.n2) || 0
  const no2 = Number(step.no2) || 0
  
  return { qty1, no1, qty2, no2 }
}

/**
 * Formatea un set de datos de acero en una cadena textual estándar.
 * Ejemplo: "2No.6 + 1No.4" o "3No.4" o "-" si no hay acero.
 */
export function formatRebar(args: RebarArgs): string {
  const parts = []
  if (args.qty1 > 0 && args.no1 > 0) parts.push(`${args.qty1}No.${args.no1}`)
  if (args.qty2 > 0 && args.no2 > 0) parts.push(`${args.qty2}No.${args.no2}`)
  
  if (parts.length === 0) return "-"
  return parts.join(" + ")
}

/**
 * Backwards compatibility para BeamProgressDiagram.tsx (que usaba Ø)
 * Puedes modificar esto si prefieres que todo el proyecto use "No." en vez de "Ø#"
 */
export function formatBarGroup(qty1: number, no1: number, qty2: number, no2: number): string {
  return formatRebar({ qty1, no1, qty2, no2 })
}
