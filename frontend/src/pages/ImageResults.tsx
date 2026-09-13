import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/api';
import type { SearxngResult, SearxngResponse } from '../services/api';
import CategoryNav from '../components/CategoryNav';
import { useSettings } from '../context/SettingsContext';
import { addHistoryEntry } from '../services/historyStorage';

// ─── Lightbox ────────────────────────────────────────────────────────────────

interface LightboxProps {
  result: SearxngResult;
  onClose: () => void;
  openInNewTab: boolean;
}

function Lightbox({ result, onClose, openInNewTab }: LightboxProps) {
  const imgUrl = result.img_src || result.thumbnail_src || '';
  const hostname = (() => { try { return new URL(result.url).hostname; } catch { return result.source || ''; } })();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-space-md"
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-space-sm right-space-sm z-10 w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex-1 flex items-center justify-center bg-surface-container-low min-h-[240px] max-h-[60vh] md:max-h-[90vh] overflow-hidden">
          <img
            src={imgUrl}
            alt={result.title}
            className="max-w-full max-h-full object-contain"
            loading="eager"
          />
        </div>

        <div className="w-full md:w-72 flex flex-col gap-space-sm p-space-lg shrink-0 overflow-y-auto">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug">{result.title || 'Image'}</h2>
          {result.content && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">{result.content}</p>
          )}
          <div className="flex flex-col gap-space-xs font-mono-metric text-mono-metric">
            {result.source && (
              <div className="flex items-center gap-space-xs">
                <span className="text-on-surface-variant">Source:</span>
                <span className="text-on-surface font-medium">{result.source}</span>
              </div>
            )}
            {hostname && !result.source && (
              <div className="flex items-center gap-space-xs">
                <span className="text-on-surface-variant">Domain:</span>
                <span className="text-on-surface font-medium">{hostname}</span>
              </div>
            )}
            {result.resolution && (
              <div className="flex items-center gap-space-xs">
                <span className="text-on-surface-variant">Resolution:</span>
                <span className="text-primary font-semibold">{result.resolution}</span>
              </div>
            )}
            {result.img_format && (
              <div className="flex items-center gap-space-xs">
                <span className="text-on-surface-variant">Format:</span>
                <span className="text-on-surface font-medium">{result.img_format}</span>
              </div>
            )}
            {result.engine && (
              <div className="flex items-center gap-space-xs">
                <span className="text-on-surface-variant">Engine:</span>
                <span className="text-on-surface font-medium">{result.engine}</span>
              </div>
            )}
          </div>
          <a
            href={result.url}
            target={openInNewTab ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary rounded-full font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Open Source
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Image Card ──────────────────────────────────────────────────────────────

interface ImageCardProps {
  result: SearxngResult;
  onPreview: (r: SearxngResult) => void;
}

function ImageCard({ result, onPreview }: ImageCardProps) {
  // Prefer thumbnail_src (Bing-CDN), fall back to img_src
  const thumbUrl = result.thumbnail_src || result.img_src || '';
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  const hostname = (() => { try { return new URL(result.url).hostname.replace('www.', ''); } catch { return result.source || ''; } })();

  if (!thumbUrl) return null;

  return (
    <div
      className="group relative bg-surface-container-low rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
      onClick={() => onPreview(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPreview(result); }}
      aria-label={`Preview: ${result.title}`}
    >
      <div className="relative w-full bg-surface-container" style={{ paddingBottom: '75%' }}>
        {!loaded && !broken && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-outline animate-pulse text-[32px]">image</span>
          </div>
        )}
        {broken ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="material-symbols-outlined text-outline text-[28px]">broken_image</span>
            <span className="font-mono-metric text-mono-metric text-outline">Failed to load</span>
          </div>
        ) : (
          <img
            src={thumbUrl}
            alt={result.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setBroken(true)}
          />
        )}
        <div className="absolute inset-0 bg-inverse-surface/0 group-hover:bg-inverse-surface/20 transition-colors duration-200 flex items-end">
          <div className="w-full p-space-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="flex items-center gap-1 px-space-xs py-space-2xs rounded-full bg-surface-container-lowest/90 font-mono-metric text-mono-metric text-primary w-fit">
              <span className="material-symbols-outlined text-[12px]">zoom_in</span>
              Preview
            </span>
          </div>
        </div>
      </div>

      <div className="px-space-xs pt-space-2xs pb-space-xs">
        <p className="font-label-sm text-label-sm text-on-surface truncate font-semibold leading-tight" title={result.title}>
          {result.title || hostname}
        </p>
        <div className="flex items-center justify-between mt-space-2xs">
          <span className="font-mono-metric text-mono-metric text-on-surface-variant truncate">{hostname}</span>
          {result.resolution && (
            <span className="font-mono-metric text-mono-metric text-primary shrink-0 ml-1">{result.resolution}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ImageResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearxngResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<SearxngResult | null>(null);
  const { settings } = useSettings();

  const closePreview = useCallback(() => setPreview(null), []);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      setResults(null);
      try {
        const data = await search(query, {
          categories: 'images',
          safesearch: settings.safeSearch,
          language: settings.language,
        });
        setResults(data);
        if (settings.searchHistory) {
          addHistoryEntry(query);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch image results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, settings.safeSearch, settings.language, settings.searchHistory]);

  return (
    <>
      {preview && <Lightbox result={preview} onClose={closePreview} openInNewTab={settings.openLinksInNewTab} />}

      <div className="w-full flex flex-col">
        <CategoryNav query={query} />

        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-space-2xl gap-space-md text-center px-gutter">
            <span className="material-symbols-outlined text-[48px] text-outline">image_search</span>
            <p className="font-headline-sm text-headline-sm text-on-surface-variant">Enter a query in the search bar to find images.</p>
          </div>
        )}

        {query && loading && (
          <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-xl">
            <div className="flex items-center gap-space-sm text-on-surface-variant">
              <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="font-body-md text-body-md">Searching images for "{query}"…</span>
            </div>
          </div>
        )}

        {query && error && (
          <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-xl">
            <div className="flex items-start gap-space-sm bg-error-container/50 rounded-xl p-space-md">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">Image search failed</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        {query && !loading && !error && results && (
          <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-md">
            <div className="flex items-center gap-space-sm mb-space-md">
              <span className="font-mono-metric text-mono-metric text-on-surface-variant">
                {results.results.length} image results for
              </span>
              <span className="font-mono-metric text-mono-metric text-on-surface font-semibold">"{query}"</span>
              <span className="font-mono-metric text-mono-metric text-primary bg-surface-container-low px-space-xs py-space-2xs rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">security</span>
                Private
              </span>
            </div>

            {results.results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-space-2xl gap-space-md text-center">
                <span className="material-symbols-outlined text-[48px] text-outline">image_not_supported</span>
                <p className="font-headline-sm text-headline-sm text-on-surface-variant">No image results found for "{query}".</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Try a different search term or check your SearXNG engine configuration.</p>
              </div>
            )}

            {/* Responsive image grid: 2 col mobile → 4 tablet → 5 desktop → 6 xl */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-space-sm">
              {results.results.map((result, idx) => (
                <ImageCard key={`${idx}-${result.url}`} result={result} onPreview={setPreview} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
