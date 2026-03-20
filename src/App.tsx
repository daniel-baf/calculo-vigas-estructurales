import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/layout/app-header"
import { DesignWizard } from "@/features/diseno-viga/DesignWizard"

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppHeader />
      <div className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 w-full max-w-2xl text-center md:max-w-3xl lg:max-w-5xl">
          <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
            MC · Módulo de Diseño Estructural
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            DISEÑO DE VIGA (DI)
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            VIGA DE TECHO
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground">
            Cálculo paso a paso según ACI 318-19 / NSR-10. Todo se procesa
            localmente en el navegador, sin servidor.
          </p>
        </header>

        <main className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-5xl">
          <DesignWizard />
        </main>

        <footer className="mt-8 w-full max-w-2xl text-center text-xs text-muted-foreground md:max-w-3xl lg:max-w-5xl">
          Los resultados son de referencia. Verificar con un ingeniero
          estructural certificado.
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
