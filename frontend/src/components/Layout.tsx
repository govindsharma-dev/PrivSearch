import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BackendOfflineBanner from './BackendOfflineBanner';
import { useSettings } from '../context/SettingsContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const currentQuery = new URLSearchParams(location.search).get('q') || '';
  const { settings, backgroundImage, updateSetting } = useSettings();

  // Build a nav link that preserves the current query
  const navHref = (path: string) =>
    currentQuery ? `${path}?q=${encodeURIComponent(currentQuery)}` : path;

  // Apply compact mode to body
  useEffect(() => {
    if (settings.compactResults) {
      document.body.setAttribute('data-compact', 'true');
    } else {
      document.body.removeAttribute('data-compact');
    }
  }, [settings.compactResults]);

  // Cycle through theme modes: light → dark → system → light
  const cycleTheme = () => {
    const next =
      settings.theme === 'light'
        ? 'dark'
        : settings.theme === 'dark'
        ? 'system'
        : 'light';
    updateSetting('theme', next);
  };

  const themeIcon =
    settings.theme === 'dark'
      ? 'dark_mode'
      : settings.theme === 'light'
      ? 'light_mode'
      : 'desktop_windows';

  // Background layer styles
  const hasBg = settings.backgroundEnabled && backgroundImage;
  const bgLayerStyle: React.CSSProperties = hasBg
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: settings.backgroundSize,
        backgroundPosition: settings.backgroundPosition,
        filter: settings.backgroundBlur > 0 ? `blur(${settings.backgroundBlur}px)` : undefined,
        transform: settings.backgroundBlur > 0 ? 'scale(1.05)' : undefined, // prevent edge artifacts from blur
      }
    : {};

  const overlayOpacity = hasBg ? (100 - settings.backgroundOpacity) / 100 : 1;
  const bgOverlayStyle: React.CSSProperties = hasBg
    ? { opacity: overlayOpacity }
    : { display: 'none' };

  return (
    <div
      className="font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-surface, #f8f9ff)' }}
    >
      {/* Background image layer */}
      <div id="ps-bg-layer" style={bgLayerStyle} />
      {/* Readability overlay */}
      <div id="ps-bg-overlay" style={bgOverlayStyle} />

      {/* Header — z-50 stays above background */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-container-lowest, #fff) 95%, transparent)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <div className="h-16 w-full px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md shrink-0">
            <Link to="/" className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">PrivSearch</span>
            </Link>
            <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full" style={{ backgroundColor: 'var(--color-surface-container-low, #eff4ff)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--color-primary, #005c55)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--color-primary, #005c55)' }}></span>
              </span>
              <span className="font-mono-metric text-mono-metric text-primary font-medium tracking-normal">127.0.0.1:8080</span>
              <span className="font-mono-metric text-mono-metric text-outline">·</span>
              <span className="font-mono-metric text-mono-metric text-on-surface-variant">Local</span>
            </div>
          </div>

          {/* Search bar — shown on all non-home pages */}
          {!isHome && (
            <div className="flex-1 max-w-2xl mx-space-md">
              <SearchBar initialQuery={currentQuery} />
            </div>
          )}

          <nav className="hidden md:flex items-center gap-space-xs shrink-0">
            <Link
              to={navHref('/settings')}
              className={`px-space-sm py-space-xs rounded-lg font-label-md text-label-md transition-colors duration-150 ${location.pathname.startsWith('/settings') ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
            >Settings</Link>
            <Link
              to="/about"
              className={`px-space-sm py-space-xs rounded-lg font-label-md text-label-md transition-colors duration-150 ${location.pathname.startsWith('/about') ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
            >About</Link>
            <Link
              to="/privacy"
              className={`px-space-sm py-space-xs rounded-lg font-label-md text-label-md transition-colors duration-150 ${location.pathname.startsWith('/privacy') ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
            >Privacy</Link>
          </nav>

          <div className="flex items-center gap-space-sm shrink-0">
            <button
              type="button"
              title={`Theme: ${settings.theme} — click to cycle`}
              onClick={cycleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors duration-150"
            >
              <span className="material-symbols-outlined text-[20px]">{themeIcon}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content — z-10 relative so it sits above background layers */}
      <main className="w-full pt-16 flex-1 relative z-10" style={{ backgroundColor: hasBg ? 'transparent' : 'var(--color-surface, #f8f9ff)' }}>
        <BackendOfflineBanner />
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full relative z-10" style={{ backgroundColor: hasBg ? 'transparent' : 'var(--color-surface-container-lowest, #fff)', boxShadow: '0 -1px 8px rgba(0,0,0,0.03)' }}>
        <div className="w-full px-gutter py-space-md flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm text-center md:text-left">
            <span className="font-mono-metric text-mono-metric text-on-surface font-medium">PrivSearch</span>
            <span className="font-mono-metric text-mono-metric text-outline">·</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Powered by SearXNG</span>
            <span className="font-mono-metric text-mono-metric text-outline">·</span>
            <span className="inline-flex items-center font-mono-metric text-mono-metric text-primary font-medium bg-surface-container-low px-space-xs py-space-2xs rounded-lg">Local-First</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <Link to="/about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-150">Documentation</Link>
            <Link to="/privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-150">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
