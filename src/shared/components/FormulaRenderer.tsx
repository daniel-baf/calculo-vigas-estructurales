import { useMemo } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface FormulaRendererProps {
  formula: string
  className?: string
}

function convertToLatex(formula: string): string {
  const latex = formula
    .replace(/(\w+)_(\w+)/g, "{$1}_{$2}")
    .replace(/(\w+)\^(\d+)/g, "{$1}^{$2}")
    .replace(/\^(\w+)/g, "^{$1}")
    .replace(/φ/g, " \\phi ")
    .replace(/√/g, " \\sqrt ")
    .replace(/≤/g, " \\leq ")
    .replace(/≥/g, " \\geq ")
    .replace(/×/g, " \\times ")
    .replace(/÷/g, " \\div ")
    .replace(/·/g, " \\cdot ")
    .replace(/α/g, " \\alpha ")
    .replace(/β/g, " \\beta ")
    .replace(/γ/g, " \\gamma ")
    .replace(/ρ/g, " \\rho ")
    .replace(/σ/g, " \\sigma ")
    .replace(/μ/g, " \\mu ")
    .replace(/Δ/g, " \\Delta ")
    .replace(/Σ/g, " \\Sigma ")
    .replace(/∞/g, " \\infty ")
    .replace(/=/g, " = ")
    .replace(/→/g, " \\rightarrow ")
    .replace(/↔/g, " \\leftrightarrow ")

  return latex
}

export function FormulaRenderer({
  formula,
  className = "",
}: FormulaRendererProps) {
  const renderedHtml = useMemo(() => {
    try {
      const latex = convertToLatex(formula)
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        output: "html",
      })
    } catch {
      return `<span class="text-muted-foreground">${formula}</span>`
    }
  }, [formula])

  return (
    <div
      className={`formula-renderer text-[11px] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  )
}
