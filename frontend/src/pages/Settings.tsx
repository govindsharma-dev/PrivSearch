import { useRef, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { getHistory, clearHistory as clearHistoryService } from '../services/historyStorage';
import type { Theme, SafeSearch, BgSize, BgPosition } from '../context/SettingsContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="ps-switch" aria-label="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ps-switch-track" />
      <span className="ps-switch-thumb" />
    </label>
  );
}

function SectionHeader({ icon, tag, title }: { icon: string; tag: string; title: string }) {
  return (
    <div className="flex items-center justify-between mb-space-lg">
      <div>
        <span className="font-mono-metric text-mono-metric text-primary uppercase font-bold tracking-wider">{tag}</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mt-space-2xs">{title}</h2>
      </div>
      <span className="material-symbols-outlined text-outline text-[24px]">{icon}</span>
    </div>
  );
}

// ─── Accent presets ───────────────────────────────────────────────────────────

const ACCENT_PRESETS = [
  { label: 'PrivSearch Teal', value: '#005c55' },
  { label: 'Ocean Blue',      value: '#1d4ed8' },
  { label: 'Violet',          value: '#7c3aed' },
  { label: 'Amber',           value: '#d97706' },
  { label: 'Rose',            value: '#e11d48' },
  { label: 'Emerald',         value: '#059669' },
];

const LANGUAGES = [
  { label: 'Auto (SearXNG default)', value: 'auto' },
  { label: 'English',  value: 'en' },
  { label: 'Hindi',    value: 'hi' },
  { label: 'German',   value: 'de' },
  { label: 'French',   value: 'fr' },
  { label: 'Spanish',  value: 'es' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Chinese (Simplified)', value: 'zh' },
  { label: 'Russian',  value: 'ru' },
  { label: 'Arabic',   value: 'ar' },
];

// ─── Main Settings Page ───────────────────────────────────────────────────────

export default function Settings() {
  const { settings, backgroundImage, updateSetting, uploadBackground, removeBackground, resetSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [activeSection, setActiveSection] = useState('appearance');
  const [historyCount, setHistoryCount] = useState(() => getHistory().length);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      await uploadBackground(file);
    } catch {
      setUploadError('Failed to upload image. Please try a smaller file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    await removeBackground();
  };

  const handleClearHistory = () => {
    clearHistoryService();
    setHistoryCount(0);
  };

  const handleReset = async () => {
    await resetSettings();
    setShowReset(false);
    setResetDone(true);
    setHistoryCount(0);
    setTimeout(() => setResetDone(false), 3000);
  };

  const navItems = [
    { id: 'appearance', icon: 'palette',       label: 'Appearance' },
    { id: 'background', icon: 'wallpaper',     label: 'Background' },
    { id: 'search',     icon: 'manage_search', label: 'Search Preferences' },
    { id: 'engines',    icon: 'hub',           label: 'Search Engines' },
    { id: 'privacy',    icon: 'security',      label: 'Privacy & Data' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full px-gutter py-space-xl max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-xl">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-xs font-mono-metric text-mono-metric text-on-surface-variant">
            <span>INST_LOCAL</span><span>/</span><span>CONFIG</span><span>/</span>
            <span className="text-primary font-semibold">PREFERENCES</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Preferences & Engine Parameters</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            All configuration is compiled client-side and persisted in isolated browser storage. No data leaves your device.
          </p>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-mono-metric text-mono-metric text-on-surface font-medium">LOCAL_DB: CONNECTED</span>
        </div>
      </div>

      {resetDone && (
        <div className="mb-space-lg flex items-center gap-space-sm bg-primary-container/20 text-on-surface px-space-md py-space-sm rounded-xl border border-primary/20">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span className="font-label-md text-label-md">Settings reset to defaults.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Sidebar nav */}
        <nav className="lg:col-span-4 flex flex-row lg:flex-col gap-space-2xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm lg:sticky lg:top-20 overflow-x-auto lg:overflow-visible scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-all duration-150 whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-primary-container/20 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span className="hidden sm:block">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Settings content */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl min-w-0">

          {/* ──────────────────────────────────────────────────────
              SECTION 1: Appearance
          ────────────────────────────────────────────────────── */}
          <section className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl shadow-sm" id="appearance">
            <SectionHeader icon="tune" tag="Interface Styling" title="General & Appearance" />

            {/* Theme */}
            <div className="space-y-space-sm mb-space-lg">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">Application Theme</label>
              <div className="grid grid-cols-3 gap-space-sm">
                {(['light', 'dark', 'system'] as Theme[]).map((t) => {
                  const icons = { light: 'light_mode', dark: 'dark_mode', system: 'desktop_windows' };
                  const labels = { light: 'Light', dark: 'Dark', system: 'System' };
                  const isActive = settings.theme === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateSetting('theme', t)}
                      className={`relative flex flex-col items-center gap-space-xs p-space-md rounded-xl cursor-pointer transition-all duration-150 border-2 ${
                        isActive
                          ? 'border-primary bg-surface-container-low shadow-sm'
                          : 'border-transparent bg-surface-container-lowest hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px] text-primary">{icons[t]}</span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">{labels[t]}</span>
                      {isActive && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-space-sm mb-space-lg">
              <label className="font-label-md text-label-md text-on-surface font-semibold block">Accent Color</label>
              <div className="flex flex-wrap gap-space-sm">
                {ACCENT_PRESETS.map((preset) => {
                  const isActive = settings.accentColor === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.label}
                      onClick={() => updateSetting('accentColor', preset.value)}
                      className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded-full border-2 transition-all font-label-sm text-label-sm ${
                        isActive ? 'border-on-surface' : 'border-outline-variant hover:border-outline'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-outline-variant/50 shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className="text-on-surface hidden sm:block">{preset.label}</span>
                    </button>
                  );
                })}
                {/* Custom picker */}
                <label className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded-full border-2 cursor-pointer transition-all font-label-sm text-label-sm ${
                  !ACCENT_PRESETS.some(p => p.value === settings.accentColor)
                    ? 'border-on-surface'
                    : 'border-outline-variant hover:border-outline'
                }`}>
                  <input
                    type="color"
                    className="w-4 h-4 rounded-full cursor-pointer border-0 p-0 appearance-none bg-transparent"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting('accentColor', e.target.value)}
                    title="Custom color"
                  />
                  <span className="text-on-surface hidden sm:block">Custom</span>
                </label>
              </div>
              <div className="flex items-center gap-space-sm mt-space-xs">
                <span className="font-mono-metric text-mono-metric text-on-surface-variant">Current:</span>
                <span
                  className="w-5 h-5 rounded-full border border-outline-variant"
                  style={{ backgroundColor: settings.accentColor }}
                />
                <span className="font-mono-metric text-mono-metric text-on-surface">{settings.accentColor}</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-space-md">
              <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Animations</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Enable UI transitions and animations</p>
                </div>
                <Toggle checked={settings.showAnimations} onChange={(v) => updateSetting('showAnimations', v)} />
              </div>
              <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Compact Results</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Reduce spacing in search result cards</p>
                </div>
                <Toggle checked={settings.compactResults} onChange={(v) => updateSetting('compactResults', v)} />
              </div>
              <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Open Links in New Tab</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Search result links open in a new browser tab</p>
                </div>
                <Toggle checked={settings.openLinksInNewTab} onChange={(v) => updateSetting('openLinksInNewTab', v)} />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────
              SECTION 2: Background
          ────────────────────────────────────────────────────── */}
          <section className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl shadow-sm" id="background">
            <SectionHeader icon="wallpaper" tag="Visual Layer" title="Custom Background" />

            {/* Preview */}
            {backgroundImage && (
              <div className="relative mb-space-lg rounded-xl overflow-hidden border border-outline-variant" style={{ height: '160px' }}>
                <img
                  src={backgroundImage}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: settings.backgroundPosition }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'rgba(248,249,255,0.5)',
                    backdropFilter: settings.backgroundBlur > 0 ? `blur(${settings.backgroundBlur / 3}px)` : undefined,
                  }}
                />
                <div className="absolute bottom-2 left-2">
                  <span className="font-mono-metric text-mono-metric bg-surface-container-lowest/90 px-2 py-0.5 rounded text-primary">Preview</span>
                </div>
              </div>
            )}

            {!backgroundImage && (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant mb-space-lg py-space-xl gap-space-sm">
                <span className="material-symbols-outlined text-[40px] text-outline">add_photo_alternate</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">No background image set</p>
              </div>
            )}

            {/* Upload / Remove buttons */}
            <div className="flex flex-wrap gap-space-sm mb-space-lg">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
                id="bg-file-input"
              />
              <label
                htmlFor="bg-file-input"
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
              >
                {uploading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                )}
                {backgroundImage ? 'Change Background' : 'Upload Background'}
              </label>
              {backgroundImage && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-error-container/50 text-on-error-container font-label-md text-label-md hover:bg-error-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Remove Background
                </button>
              )}
            </div>
            {uploadError && (
              <p className="text-error font-body-sm text-body-sm mb-space-sm">{uploadError}</p>
            )}

            {/* Background controls — only show if image exists */}
            {backgroundImage && (
              <div className="space-y-space-lg">
                {/* Enabled toggle */}
                <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">Show Background</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Display the uploaded image across all pages</p>
                  </div>
                  <Toggle
                    checked={settings.backgroundEnabled}
                    onChange={(v) => updateSetting('backgroundEnabled', v)}
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">Overlay Opacity</label>
                    <span className="font-mono-metric text-mono-metric text-primary">{settings.backgroundOpacity}%</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Higher opacity = more transparent overlay = image more visible</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.backgroundOpacity}
                    onChange={(e) => updateSetting('backgroundOpacity', parseInt(e.target.value))}
                    className="w-full accent-primary"
                    style={{ accentColor: 'var(--accent-color)' }}
                  />
                </div>

                {/* Blur */}
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">Background Blur</label>
                    <span className="font-mono-metric text-mono-metric text-primary">{settings.backgroundBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={settings.backgroundBlur}
                    onChange={(e) => updateSetting('backgroundBlur', parseInt(e.target.value))}
                    className="w-full"
                    style={{ accentColor: 'var(--accent-color)' }}
                  />
                </div>

                {/* Size */}
                <div className="space-y-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold block">Background Size</label>
                  <div className="grid grid-cols-3 gap-space-xs">
                    {(['cover', 'contain', 'auto'] as BgSize[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateSetting('backgroundSize', s)}
                        className={`py-space-xs rounded-lg font-label-md text-label-md capitalize transition-colors ${
                          settings.backgroundSize === s
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-space-xs">
                  <label className="font-label-md text-label-md text-on-surface font-semibold block">Background Position</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-space-xs">
                    {(['center', 'top', 'bottom', 'left', 'right'] as BgPosition[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateSetting('backgroundPosition', p)}
                        className={`py-space-xs rounded-lg font-label-md text-label-md capitalize transition-colors ${
                          settings.backgroundPosition === p
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ──────────────────────────────────────────────────────
              SECTION 3: Search Preferences
          ────────────────────────────────────────────────────── */}
          <section className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl shadow-sm" id="search">
            <SectionHeader icon="manage_search" tag="Search Dispatch" title="Search Preferences" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
              {/* Safe Search */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold block">SafeSearch</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Sent as <span className="font-mono-code text-mono-code">safesearch=</span> to SearXNG</p>
                <div className="grid grid-cols-3 gap-space-2xs bg-surface-container-low p-space-2xs rounded-xl">
                  {([
                    { label: 'Off',      value: 0 },
                    { label: 'Moderate', value: 1 },
                    { label: 'Strict',   value: 2 },
                  ] as { label: string; value: SafeSearch }[]).map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateSetting('safeSearch', value)}
                      className={`py-space-xs font-label-md text-label-md rounded-lg text-center transition-colors ${
                        settings.safeSearch === value
                          ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold block">Language</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Sent as <span className="font-mono-code text-mono-code">language=</span> to SearXNG</p>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full rounded-xl px-space-md py-space-sm font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:ring-2 bg-surface-container-low transition-colors"
                  style={{ '--tw-ring-color': 'var(--accent-color)' } as React.CSSProperties}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Results per page (informational) */}
              <div className="space-y-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold block">Results Per Page</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">SearXNG returns up to this many results per request</p>
                <div className="grid grid-cols-4 gap-space-2xs bg-surface-container-low p-space-2xs rounded-xl">
                  {[10, 20, 30, 50].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => updateSetting('resultsPerPage', n)}
                      className={`py-space-xs font-label-md text-label-md rounded-lg text-center transition-colors ${
                        settings.resultsPerPage === n
                          ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────
              SECTION 4: Search Engines (Honest)
          ────────────────────────────────────────────────────── */}
          <section className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl shadow-sm" id="engines">
            <SectionHeader icon="hub" tag="Backend Routing" title="Search Engines" />

            <div className="flex items-start gap-space-sm bg-surface-container-low rounded-xl p-space-md mb-space-lg">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-space-2xs">info</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">Engine configuration is managed by SearXNG</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs leading-relaxed">
                  Which search engines are active (Google, Bing, DuckDuckGo, Brave, etc.) is controlled by the local SearXNG server configuration at{' '}
                  <span className="font-mono-code text-mono-code text-primary">searxng/core-config/settings.yml</span>.
                  The frontend cannot enable or disable individual engines — that would require modifying the SearXNG backend.
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Your local instance is using <span className="font-mono-code text-mono-code text-primary">use_default_settings: true</span>, which means all default SearXNG engines are enabled. Search categories (Web, Images, News, etc.) are routed correctly to SearXNG via the <span className="font-mono-code text-mono-code text-primary">categories=</span> parameter.
                </p>
              </div>
            </div>

            {/* Category routing reference */}
            <div className="space-y-space-xs">
              <p className="font-label-md text-label-md text-on-surface font-semibold mb-space-sm">Category → SearXNG Parameter Mapping</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                {[
                  { cat: 'Web',     param: 'general' },
                  { cat: 'Images',  param: 'images' },
                  { cat: 'Videos',  param: 'videos' },
                  { cat: 'News',    param: 'news' },
                  { cat: 'Maps',    param: 'map' },
                  { cat: 'Music',   param: 'music' },
                  { cat: 'Science', param: 'science' },
                  { cat: 'Files',   param: 'files' },
                ].map(({ cat, param }) => (
                  <div key={cat} className="flex flex-col bg-surface-container-low rounded-lg p-space-sm">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{cat}</span>
                    <span className="font-mono-code text-mono-code text-primary text-[11px]">categories={param}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────
              SECTION 5: Privacy & Local Data
          ────────────────────────────────────────────────────── */}
          <section className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-xl shadow-sm" id="privacy">
            <SectionHeader icon="security" tag="Data Management" title="Privacy & Local Data" />

            {/* Storage facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-lg">
              {[
                { icon: 'person_off',      label: 'No Account Required',    detail: 'PrivSearch works without any sign-in' },
                { icon: 'shield',          label: 'Local-First',             detail: 'All settings stored in your browser only' },
                { icon: 'database',        label: 'Background in IndexedDB', detail: 'Images stored locally, never uploaded' },
                { icon: 'manage_history',  label: 'Search History',          detail: 'Stored in localStorage, never sent to a server' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-space-sm bg-surface-container-low rounded-xl p-space-md">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">{item.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search history toggle */}
            <div className="space-y-space-md">
              <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Save Search History</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                    {settings.searchHistory
                      ? `${historyCount} search${historyCount !== 1 ? 'es' : ''} stored locally`
                      : 'New searches will not be saved'}
                  </p>
                </div>
                <Toggle checked={settings.searchHistory} onChange={(v) => updateSetting('searchHistory', v)} />
              </div>

              {/* Clear history */}
              {historyCount > 0 && (
                <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">Clear Search History</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">{historyCount} recent searches will be deleted</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-error-container/50 text-on-error-container font-label-md text-label-md hover:bg-error-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    Clear History
                  </button>
                </div>
              )}

              {/* Clear background */}
              {backgroundImage && (
                <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">Clear Background Image</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">Remove the stored background from IndexedDB</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-error-container/50 text-on-error-container font-label-md text-label-md hover:bg-error-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">hide_image</span>
                    Clear Image
                  </button>
                </div>
              )}

              {/* Reset all */}
              <div className="flex items-center justify-between py-space-sm border-t border-outline-variant">
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Reset All Settings</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                    Restore all preferences to defaults, clear history and background image
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-error-container/60 text-on-error-container font-label-md text-label-md hover:bg-error-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Reset confirmation modal */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-space-md backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowReset(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl p-space-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-space-md mb-space-lg">
              <span className="material-symbols-outlined text-error text-[28px] shrink-0">warning</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Reset All Settings?</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                  This will reset your theme, accent color, background, search preferences, and clear all search history. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-space-sm justify-end">
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="px-space-md py-space-sm rounded-xl font-label-md text-label-md bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-space-md py-space-sm rounded-xl font-label-md text-label-md bg-error text-on-error hover:opacity-90 transition-opacity"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
