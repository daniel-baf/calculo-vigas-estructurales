import { cn } from '@/lib/utils';

interface ChecksBannerProps {
  show: boolean;
  className?: string;
}

/**
 * ChecksBanner — Marca de agua que indica que hay chequeos pendientes o fallidos.
 * Se posiciona absolutamente sobre su contenedor relativo (p.ej. el Wizard).
 */
export function ChecksBanner({ show, className }: ChecksBannerProps) {
  if (!show) return null;

  // SVG de marca de agua repetitiva
  // Nota: Usamos un color fijo (rojo-500: #ef4444) porque currentColor no siempre hereda en background-image
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250">
    <g transform="rotate(-25, 200, 125)" fill="#ef4444" font-family="sans-serif" font-weight="900" font-size="32" opacity="0.15">
      <text x="200" y="105" text-anchor="middle">REVISA LOS</text>
      <text x="200" y="145" text-anchor="middle">CHEQUEOS</text>
    </g>
  </svg>`;
  const encodedSvg = btoa(svg);
  const backgroundUrl = `url("data:image/svg+xml;base64,${encodedSvg}")`;

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 pointer-events-none overflow-hidden',
        'animate-in fade-in duration-500',
        className
      )}
      style={{
        backgroundImage: backgroundUrl,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
}
