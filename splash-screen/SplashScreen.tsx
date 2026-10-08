import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { splashConfig, type SplashConfig } from './splash.config';
import './SplashScreen.css';

const SEEN_KEY = 'caf:splash-seen';

export interface SplashScreenProps {
  /** Appelé quand le splash est totalement retiré. */
  onDone?: () => void;
  /** Surcharges partielles de la config (ex. désactiver en test). */
  config?: Partial<SplashConfig>;
}

function hasSeenSplash(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export default function SplashScreen({ onDone, config }: SplashScreenProps) {
  const cfg = useMemo(() => ({ ...splashConfig, ...config }), [config]);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(cfg.enabled);
  const [gifFailed, setGifFailed] = useState(false);
  const finished = useRef(false);

  const duration = useMemo(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return 900;
    return cfg.shortenAfterFirstRun && hasSeenSplash() ? cfg.shortDurationMs : cfg.durationMs;
  }, [cfg]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setExiting(true);
    window.setTimeout(() => {
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* stockage indisponible : on ignore */
      }
      setVisible(false);
      onDone?.();
    }, cfg.exitMs);
  }, [cfg.exitMs, onDone]);

  useEffect(() => {
    if (!cfg.enabled) {
      onDone?.();
      return;
    }
    const t = window.setTimeout(finish, Math.max(0, duration - cfg.exitMs));
    return () => window.clearTimeout(t);
  }, [cfg.enabled, cfg.exitMs, duration, finish, onDone]);

  if (!visible) return null;

  const { colors } = cfg;
  const style = {
    '--caf-bg': colors.bg,
    '--caf-glow': colors.bgGlow,
    '--caf-text': colors.text,
    '--caf-accent': colors.accent,
    '--caf-gold': colors.accentSoft,
    '--caf-exit': `${cfg.exitMs}ms`,
  } as React.CSSProperties;

  return (
    <div
      className={`caf-splash${exiting ? ' caf-splash--exit' : ''}`}
      style={style}
      role="img"
      aria-label={`${cfg.title.left}-${cfg.title.right}`}
      onClick={cfg.skippable ? finish : undefined}
    >
      <div className="caf-splash__stage">
        <div className="caf-splash__media">
          {gifFailed ? (
            <div className="caf-splash__fallback" aria-hidden="true" />
          ) : (
            <img
              className="caf-splash__gif"
              src={cfg.gif}
              alt={cfg.gifAlt}
              decoding="async"
              draggable={false}
              onError={() => setGifFailed(true)}
            />
          )}
        </div>

        <h1 className="caf-splash__title" aria-hidden="true">
          <span className="caf-splash__word caf-splash__word--left">{cfg.title.left}</span>
          <span className="caf-splash__dash" />
          <span className="caf-splash__word caf-splash__word--right">{cfg.title.right}</span>
        </h1>

        {cfg.tagline && <p className="caf-splash__tagline">{cfg.tagline}</p>}
      </div>
    </div>
  );
}
