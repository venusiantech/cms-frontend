'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Module-level signal — survives across renders so TemplateA click handlers can trigger it
let _start: (() => void) | null = null;

/** Call this before router.push() to light up the progress bar immediately. */
export function signalNavigationStart() {
  _start?.();
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [fading, setFading] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  // Register the "start navigation" callback with the module-level slot
  useEffect(() => {
    _start = () => {
      clear();
      setFading(false);
      setVisible(true);
      setWidth(0);
      after(() => setWidth(72), 30); // fast crawl to ~72 %
    };
    return () => {
      _start = null;
      clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Path changed → route finished loading → complete the bar and fade out
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    clear();
    setWidth(100);
    setFading(false);
    after(() => setFading(true), 180);           // start fading after bar fills
    after(() => { setVisible(false); setWidth(0); setFading(false); }, 580);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 99999, pointerEvents: 'none' }}
    >
      {/* Green bar — matches Template A's btn-green (#5cb85c) */}
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #4cae4c 0%, #5cb85c 60%, #7dcc7d 100%)',
          opacity: fading ? 0 : 1,
          transition: fading
            ? 'opacity 0.38s ease'
            : width <= 72
              ? 'width 0.65s cubic-bezier(0.08, 0.05, 0, 1)'
              : 'width 0.18s ease-out',
          boxShadow: '0 0 10px rgba(92,184,92,0.65), 0 0 4px rgba(92,184,92,0.4)',
          borderRadius: '0 3px 3px 0',
        }}
      />
      {/* Glowing tip */}
      <div
        style={{
          position: 'absolute',
          top: -1,
          right: `${100 - width}%`,
          width: 80,
          height: 5,
          background: 'radial-gradient(ellipse at center, rgba(92,184,92,0.6) 0%, transparent 80%)',
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.38s ease' : 'right 0.65s cubic-bezier(0.08, 0.05, 0, 1)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
