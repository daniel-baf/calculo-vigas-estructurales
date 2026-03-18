import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/layout/app-header';
import { DesignWizard } from '@/features/diseno-viga/DesignWizard';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppHeader />
      <div className="min-h-[calc(100vh-3.5rem)] bg-background px-4 sm:px-6 py-8 sm:py-12 relative flex flex-col items-center">
        {/* Encabezado */}
        <header className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            MC · Módulo de Diseño Estructural
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            DISEÑO DE VIGA (DI)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">VIGA DE TECHO</p>
          <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto">
            Cálculo paso a paso según ACI 318-19 / NSR-10.
            Todo se procesa localmente en el navegador, sin servidor.
          </p>
        </header>

        {/* Wizard */}
        <main className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl relative">
          <DesignWizard />
        </main>

        <footer className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl text-center mt-8 text-xs text-muted-foreground">
          Los resultados son de referencia. Verificar con un ingeniero estructural certificado.
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;

