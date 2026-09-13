import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { getHistory } from '../services/historyStorage';

interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ initialQuery = '', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep input in sync when URL query changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Load history when focused
  const handleFocus = () => {
    if (settings.searchHistory) {
      const h = getHistory();
      setHistoryItems(h);
      if (h.length > 0) setShowHistory(true);
    }
  };

  // Close history dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setDropdownOpen(false);
    setShowHistory(false);

    const currentPath = location.pathname;
    const knownCategoryPaths = ['/search', '/images', '/videos', '/news', '/maps', '/music', '/science', '/files'];
    const targetPath = knownCategoryPaths.includes(currentPath) ? currentPath : '/search';
    navigate(`${targetPath}?q=${encodeURIComponent(trimmed)}`);
  };

  const selectHistoryItem = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    const currentPath = location.pathname;
    const knownCategoryPaths = ['/search', '/images', '/videos', '/news', '/maps', '/music', '/science', '/files'];
    const targetPath = knownCategoryPaths.includes(currentPath) ? currentPath : '/search';
    navigate(`${targetPath}?q=${encodeURIComponent(item)}`);
  };

  const filteredHistory = query
    ? historyItems.filter((h) => h.toLowerCase().includes(query.toLowerCase()) && h !== query)
    : historyItems;

  return (
    <div className="relative w-full group" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative flex items-center w-full bg-surface-container-low rounded-xl px-space-md py-space-xs shadow-inner focus-within:ring-2 focus-within:ring-primary/20">
        <span className="material-symbols-outlined text-primary text-[20px] mr-space-xs select-none">search</span>
        <input
          ref={inputRef}
          autoComplete="off"
          className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none py-space-sm"
          placeholder="Search the web, code, papers..."
          spellCheck="false"
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); }}
          onFocus={handleFocus}
          autoFocus={autoFocus}
        />
        <div className="flex items-center gap-space-xs pr-space-xs">
          {query && (
            <button
              className="flex items-center justify-center w-7 h-7 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
              onClick={() => { setQuery(''); setShowHistory(false); }}
              title="Clear"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
            onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen); setShowHistory(false); }}
            title="Search operators"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">instant_mix</span>
          </button>
          <div className="hidden sm:flex items-center gap-space-2xs pl-space-xs">
            <span className="font-mono-metric text-mono-metric text-primary bg-surface-container-highest px-1.5 py-0.5 rounded font-semibold">/</span>
            <span className="font-mono-metric text-mono-metric text-on-surface-variant text-[10px]">L-PROXY</span>
          </div>
        </div>
      </form>

      {/* History dropdown */}
      {showHistory && filteredHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-space-xs bg-surface-container-lowest rounded-xl shadow-xl z-30 border border-outline-variant overflow-hidden">
          <div className="px-space-sm pt-space-xs pb-space-2xs">
            <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider font-semibold">Recent Searches</span>
          </div>
          {filteredHistory.slice(0, 8).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectHistoryItem(item)}
              className="w-full flex items-center gap-space-sm px-space-md py-space-xs hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">history</span>
              <span className="font-body-md text-body-md text-on-surface truncate">{item}</span>
            </button>
          ))}
        </div>
      )}

      {/* Operators dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-space-xs bg-surface-container-lowest rounded-xl shadow-xl p-space-md z-30 border border-outline-variant">
          <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-outline-variant">
            <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider font-semibold">Bang Operators</span>
            <span className="font-mono-metric text-mono-metric text-primary">Local Proxy Active</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            {[
              ['!g', 'Google Proxy'],
              ['!ddg', 'DuckDuckGo'],
              ['!w', 'Wikipedia'],
              ['!arxiv', 'ArXiv Papers'],
            ].map(([bang, label]) => (
              <button
                key={bang}
                type="button"
                onClick={() => { setQuery(q => q + ' ' + bang); setDropdownOpen(false); }}
                className="p-space-xs rounded bg-surface-container-low text-left hover:bg-surface-container transition-colors"
              >
                <span className="font-mono-code text-mono-code text-primary font-semibold block">{bang}</span>
                <span className="font-body-sm text-body-sm text-secondary block">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
