import splashGif from '../../assets/splash/splash.gif';

/** Tout ce qu'on peut modifier sans toucher à la logique du composant. */
export const splashConfig = {
  enabled: true,
  /** Durée totale visible, sortie comprise (ms). 2000–4000 recommandé. */
  durationMs: 3200,
  /** Durée du fondu de sortie (ms). */
  exitMs: 450,
  /** Si true, les lancements suivants utilisent `shortDurationMs`. */
  shortenAfterFirstRun: true,
  shortDurationMs: 1400,
  /** Touche / clic pour passer le splash. */
  skippable: true,
  gif: splashGif, // remplacer le fichier dans src/assets/splash/ suffit
  gifAlt: '',
  title: { left: 'COME', right: 'FIGHT' },
  tagline: 'by CRAZY TECH',
  colors: {
    bg: '#12090c',
    bgGlow: '#2a1015',
    text: '#f3e9dc',
    accent: '#c8372d',
    accentSoft: '#e0a23b',
  },
} as const;

export type SplashConfig = typeof splashConfig;
