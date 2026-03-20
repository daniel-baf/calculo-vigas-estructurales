import { Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/80 dark:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground shadow-sm dark:shadow-primary/20">
              DI
            </span>
            Diseño de Viga
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
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
                  <h4 className="font-medium text-foreground">Uso</h4>
                  <p>
                    Esta herramienta calcula el diseño a flexión, cortante y
                    refuerzo longitudinal de vigas de entrepiso y techo
                    siguiendo los parámetros del ACI 318-19 y la NSR-10. Siga el
                    asistente paso a paso ingresando la geometría, cargas y
                    momentos.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">Créditos</h4>
                  <ul className="list-disc space-y-1 pl-4">
                    <li>
                      <strong className="text-foreground/80">
                        Ingeniero Estructural:
                      </strong>{" "}
                      Carlos Bautista
                    </li>
                    <li>
                      <strong className="text-foreground/80">
                        Diseño y Desarrollo:
                      </strong>{" "}
                      Daniel Bautista (
                      <a
                        href="https://github.com/daniel-baf"
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-primary"
                      >
                        @danibaufu
                      </a>{" "}
                      /{" "}
                      <a
                        href="mailto:danibaufu@gmail.com"
                        className="underline hover:text-primary"
                      >
                        danibaufu@gmail.com
                      </a>
                      )
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                  <p className="mb-1 text-xs font-medium tracking-wider uppercase">
                    Advertencia Legal
                  </p>
                  <p className="text-xs">
                    Los resultados generados por este software son estrictamente
                    con fines académicos y de referencia. Toda memoria de
                    cálculo debe ser revisada y avalada por un ingeniero civil o
                    estructural idóneo con licencia vigente.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
