export function fmtNumber(
  v: number | undefined | null,
  dec = 2,
  locale: string = "es-MX"
): string {
  if (v === undefined || v === null || Number.isNaN(v)) return "—"
  return v.toLocaleString(locale, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}
