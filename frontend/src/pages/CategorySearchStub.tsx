import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/api';
import type { SearxngResponse } from '../services/api';
import CategoryNav from '../components/CategoryNav';
import { useSettings } from '../context/SettingsContext';
import { addHistoryEntry } from '../services/historyStorage';

interface CategorySearchStubProps {
  category: string;
  label: string;
  icon: string;
}

export default function CategorySearchStub({ category, label, icon }: CategorySearchStubProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearxngResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { settings } = useSettings();

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    search(query, {
      categories: category,
      safesearch: settings.safeSearch,
      language: settings.language,
    })
      .then((data) => {
        setResults(data);
        if (settings.searchHistory) {
          addHistoryEntry(query);
        }
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to fetch results.')
      )
      .finally(() => setLoading(false));
  }, [query, category, settings.safeSearch, settings.language, settings.searchHistory]);

  const linkTarget = settings.openLinksInNewTab ? '_blank' : '_self';

  return (
    <div className="w-full flex flex-col">
      <CategoryNav query={query} />

      {!query.trim() && (
        <div className="flex flex-col items-center justify-center py-space-2xl gap-space-md text-center px-gutter">
          <span className="material-symbols-outlined text-[48px] text-outline">{icon}</span>
          <p className="font-headline-sm text-headline-sm text-on-surface-variant">
            Enter a query to search {label}.
          </p>
        </div>
      )}

      {query && loading && (
        <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-xl">
          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="font-body-md text-body-md">Searching {label} for "{query}"…</span>
          </div>
        </div>
      )}

      {query && error && (
        <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-xl">
          <div className="flex items-start gap-space-sm bg-error-container/50 rounded-xl p-space-md">
            <span className="material-symbols-outlined text-error text-[20px]">error</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{error}</p>
          </div>
        </div>
      )}

      {query && !loading && !error && results && (
        <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-md flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="font-mono-metric text-mono-metric text-on-surface-variant">{results.results.length} {label} results for</span>
            <span className="font-mono-metric text-mono-metric text-on-surface font-semibold">"{query}"</span>
          </div>

          {results.results.length === 0 && (
            <div className="text-center font-body-md text-on-surface-variant py-space-xl">
              No {label.toLowerCase()} results found for "{query}".
            </div>
          )}

          <div className="flex flex-col gap-space-md">
            {results.results.map((result, idx) => {
              const hostname = (() => { try { return new URL(result.url).hostname; } catch { return ''; } })();
              return (
                <article
                  key={idx}
                  className={`result-card bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-150 flex flex-col gap-space-xs ${settings.compactResults ? 'p-space-sm' : 'p-space-md'}`}
                >
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                    <span>{result.source || hostname}</span>
                    {result.engine && <span className="font-mono-metric text-mono-metric px-1.5 py-0.5 rounded bg-surface-container-low">{result.engine}</span>}
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    <a href={result.url} target={linkTarget} rel="noopener noreferrer" className="hover:text-primary hover:underline">{result.title}</a>
                  </h2>
                  {result.content && (
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">{result.content}</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
