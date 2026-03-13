import { Info } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Logo / Título del header */}
          <span className="font-bold tracking-tight text-sm flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-md flex items-center justify-center text-xs">DI</span>
            Diseño de Viga
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de Información (Modal) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Info className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Información</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Acerca de la Aplicación</DialogTitle>
                <DialogDescription>
                  Módulo de Diseño Estructural para Vigas de Techo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <h4 className="text-foreground font-medium">Uso</h4>
                  <p>
                    Esta herramienta calcula el diseño a flexión, cortante y
                    refuerzo longitudinal de vigas de entrepiso y techo siguiendo
                    los parámetros del ACI 318-19 y la NSR-10. Siga el asistente
                    paso a paso ingresando la geometría, cargas y momentos.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-foreground font-medium">Créditos</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="text-foreground/80">Ingeniero Estructural:</strong> Carlos Bautista</li>
                    <li><strong className="text-foreground/80">Diseño y Desarrollo:</strong> Daniel Bautista (<a href="https://github.com/daniel-baf" target="_blank" rel="noreferrer" className="underline hover:text-primary">@danibaufu</a> / <a href="mailto:danibaufu@gmail.com" className="underline hover:text-primary">danibaufu@gmail.com</a>)</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                  <p className="font-medium text-xs uppercase tracking-wider mb-1">Advertencia Legal</p>
                  <p className="text-xs">
                    Los resultados generados por este software son estrictamente
                    con fines académicos y de referencia. Toda memoria de cálculo
                    debe ser revisada y avalada por un ingeniero civil o estructural
                    idóneo con licencia vigente.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Toggle Modo Oscuro/Claro */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
