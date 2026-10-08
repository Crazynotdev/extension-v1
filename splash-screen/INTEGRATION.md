# Intégration SplashScreen

1. Copier `src/components/SplashScreen/` dans le projet.
2. Placer le GIF fourni dans `src/assets/splash/splash.gif`
   (optimiser avant : `gifsicle -O3 --lossy=60 --colors 128 in.gif -o splash.gif`, cible < 1 Mo).
3. Déclarer les GIF si besoin (`src/vite-env.d.ts` contient déjà `/// <reference types="vite/client" />`).
4. `src/main.tsx` ou `App.tsx` :

```tsx
import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <MainApp />                       {/* monté tout de suite : le splash ne bloque rien */}
      <SplashScreen onDone={() => setReady(true)} />
    </>
  );
}
```

5. Pas de flash au démarrage : dans `index.html` et `manifest.webmanifest`
   - `<meta name="theme-color" content="#12090c">`
   - `body { background:#12090c }` en CSS inline dans `<head>`
   - manifest : `"background_color": "#12090c"`, `"theme_color": "#12090c"`
6. Capacitor (`capacitor.config.ts`) : `plugins: { SplashScreen: { launchShowDuration: 0, backgroundColor: '#12090c' } }`
   → le splash natif disparaît immédiatement sur la même couleur, puis le splash React prend le relais.
7. Désactiver / raccourcir : `<SplashScreen config={{ enabled: false }} />` ou modifier `durationMs` / `shortDurationMs` dans `splash.config.ts`.
