import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  deleteBackgroundImage,
  getBackgroundImage,
  saveBackgroundImage,
} from '../services/backgroundStorage';
import { clearHistory } from '../services/historyStorage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system';
export type SafeSearch = 0 | 1 | 2;
export type BgSize = 'cover' | 'contain' | 'auto';
export type BgPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top center'
  | 'bottom center';

export interface PrivSearchSettings {
  theme: Theme;
  accentColor: string;
  backgroundEnabled: boolean;
  backgroundOpacity: number; // 0-100
  backgroundBlur: number;    // 0-20
  backgroundSize: BgSize;
  backgroundPosition: BgPosition;
  safeSearch: SafeSearch;
  language: string;
  resultsPerPage: number;
  openLinksInNewTab: boolean;
  showAnimations: boolean;
  compactResults: boolean;
  searchHistory: boolean;
}

const DEFAULTS: PrivSearchSettings = {
  theme: 'system',
  accentColor: '#005c55',
  backgroundEnabled: false,
  backgroundOpacity: 60,
  backgroundBlur: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  safeSearch: 1,
  language: 'auto',
  resultsPerPage: 10,
  openLinksInNewTab: true,
  showAnimations: true,
  compactResults: false,
  searchHistory: true,
};

const STORAGE_KEY = 'privsearch_settings';

function loadSettings(): PrivSearchSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(s: PrivSearchSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SettingsContextValue {
  settings: PrivSearchSettings;
  backgroundImage: string | null;
  updateSetting: <K extends keyof PrivSearchSettings>(
    key: K,
    value: PrivSearchSettings[K]
  ) => void;
  uploadBackground: (file: File) => Promise<void>;
  removeBackground: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ─── Helper: apply theme to DOM ──────────────────────────────────────────────

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

// ─── Helper: apply accent color ───────────────────────────────────────────────

function applyAccent(color: string): void {
  document.documentElement.style.setProperty('--accent-color', color);
  // Derive a soft/muted version for backgrounds (20% opacity)
  document.documentElement.style.setProperty('--accent-color-soft', color + '33');
}

// ─── Helper: apply animations pref ───────────────────────────────────────────

function applyAnimations(enabled: boolean): void {
  if (enabled) {
    document.documentElement.removeAttribute('data-no-animations');
  } else {
    document.documentElement.setAttribute('data-no-animations', 'true');
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PrivSearchSettings>(loadSettings);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // Track if IndexedDB image has been loaded so we don't double-load
  const bgLoaded = useRef(false);

  // Load background image from IndexedDB on mount
  useEffect(() => {
    if (bgLoaded.current) return;
    bgLoaded.current = true;
    getBackgroundImage().then((img) => {
      if (img) setBackgroundImage(img);
    });
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(settings.theme);

    // Also listen for system preference changes when in system mode
    if (settings.theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings.theme]);

  // Apply accent color
  useEffect(() => {
    applyAccent(settings.accentColor);
  }, [settings.accentColor]);

  // Apply animations
  useEffect(() => {
    applyAnimations(settings.showAnimations);
  }, [settings.showAnimations]);

  // Apply theme immediately on first render (before paint) is handled
  // by the inline script in index.html — see implementation there.

  const updateSetting = useCallback(
    <K extends keyof PrivSearchSettings>(key: K, value: PrivSearchSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const uploadBackground = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        try {
          await saveBackgroundImage(dataUrl);
          setBackgroundImage(dataUrl);
          setSettings((prev) => {
            const next = { ...prev, backgroundEnabled: true };
            saveSettings(next);
            return next;
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }, []);

  const removeBackground = useCallback(async (): Promise<void> => {
    await deleteBackgroundImage();
    setBackgroundImage(null);
    setSettings((prev) => {
      const next = { ...prev, backgroundEnabled: false };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(async (): Promise<void> => {
    await deleteBackgroundImage();
    clearHistory();
    localStorage.removeItem(STORAGE_KEY);
    setBackgroundImage(null);
    setSettings({ ...DEFAULTS });
    applyTheme(DEFAULTS.theme);
    applyAccent(DEFAULTS.accentColor);
    applyAnimations(DEFAULTS.showAnimations);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        backgroundImage,
        updateSetting,
        uploadBackground,
        removeBackground,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
