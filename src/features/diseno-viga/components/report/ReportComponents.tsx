import { extractArgs, formatRebar } from "@/shared/diseno-refuerzo/formatUtils"

export function SectionHeader({ title }: { title: string }) {
  return (
    <h4 className="mt-6 mb-3 text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
      {title}
    </h4>
  )
}

export function DataRow({ label, value, unit = "" }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border/40 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">
        {value} {unit}
      </span>
    </div>
  )
}

/**
 * Muestra una fila de armado usando el formato estandarizado.
 * Puede recibir el step directo para autocompletar q1/n1/q2/n2 o recibirlos manualmente.
 */
export function ArmadoRow({ 
  label, 
  step,
  qty1, no1, qty2, no2 
}: { 
  label: string;
  step?: any;
  qty1?: string | number;
  no1?: number;
  qty2?: string | number;
  no2?: number;
}) {
  let args = { qty1: 0, no1: 0, qty2: 0, no2: 0 }
  
  if (step) {
    args = extractArgs(step)
  } else {
    args.qty1 = Number(qty1) || 0
    args.no1 = Number(no1) || 0
    args.qty2 = Number(qty2) || 0
    args.no2 = Number(no2) || 0
  }

  const armado = formatRebar(args)

  return (
    <div className="flex justify-between py-1.5 border-b border-border/40 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-primary">{armado !== "-" ? armado : "Sin acero"}</span>
    </div>
  )
}
