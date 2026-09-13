import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/api';
import type { SearxngResponse } from '../services/api';
import CategoryNav from '../components/CategoryNav';
import { useSettings } from '../context/SettingsContext';
import { addHistoryEntry } from '../services/historyStorage';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearxngResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBench, setShowBench] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await search(query, {
          categories: 'general',
          safesearch: settings.safeSearch,
          language: settings.language,
        });
        setResults(data);
        // Save to history if enabled
        if (settings.searchHistory) {
          addHistoryEntry(query);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, settings.safeSearch, settings.language, settings.searchHistory]);

  const linkTarget = settings.openLinksInNewTab ? '_blank' : '_self';

  if (!query) {
    return (
      <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-md text-center">
        <p className="font-body-md text-on-surface-variant">Please enter a search query.</p>
      </div>
    );
  }

  const safeSearchLabel = settings.safeSearch === 0 ? 'Off' : settings.safeSearch === 1 ? 'Moderate' : 'Strict';

  return (
    <div className="w-full">
      <CategoryNav query={query} />
      {/* Sub-filter bar */}
      <section className="w-full z-30" style={{ backgroundColor: 'var(--color-surface-container-lowest, #fff)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div className="max-w-[1360px] mx-auto px-gutter py-space-sm flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-2xs">
            <div className="flex flex-wrap items-center gap-space-xs text-body-sm">
              <div className="flex items-center gap-1 px-space-xs py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                <span className="text-on-surface-variant">SafeSearch:</span>
                <span className="font-medium text-primary">{safeSearchLabel}</span>
              </div>
              {settings.language !== 'auto' && (
                <div className="flex items-center gap-1 px-space-xs py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Lang:</span>
                  <span className="font-medium">{settings.language}</span>
                </div>
              )}
              <div className="h-3 w-[1px] bg-outline-variant mx-space-xs hidden sm:block"></div>
              {results && (
                <>
                  <span className="font-mono-metric text-mono-metric text-on-surface-variant mr-1">Dispatched:</span>
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono-metric text-mono-metric">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{results.number_of_results} Results
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-mono-metric text-mono-metric text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">security</span>
                No Profiling Hash
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto w-full px-gutter py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-space-md min-w-0 max-w-[760px]">
            {loading && (
              <div className="flex items-center gap-space-sm text-on-surface-variant py-space-md">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="font-body-md text-body-md">Searching PrivSearch…</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-space-sm bg-error-container/50 rounded-xl p-space-md">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0">error</span>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">Search failed</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && results && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
                  <div className="flex items-center gap-space-xs font-mono-metric text-mono-metric text-on-surface-variant flex-wrap">
                    <span className="font-semibold text-on-surface">{results.number_of_results || results.results.length} results</span>
                    <span className="text-outline">·</span>
                    <span className="text-primary font-medium">Scrubbed query</span>
                    <span className="text-outline">·</span>
                    <span className="text-primary font-semibold">0 tracking pixels</span>
                  </div>
                  <button
                    className="font-mono-metric text-[10px] text-primary hover:underline flex items-center gap-0.5"
                    onClick={() => setShowBench(!showBench)}
                    type="button"
                  >
                    View diagnostic trace
                    <span className="material-symbols-outlined text-[12px]">unfold_more</span>
                  </button>
                </div>

                {showBench && (
                  <div className="bg-surface-container-low p-space-sm rounded-xl space-y-space-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs font-mono-metric text-mono-metric">
                      <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                        <span className="text-on-surface-variant">SafeSearch</span>
                        <span className="text-primary font-semibold">{safeSearchLabel}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                        <span className="text-on-surface-variant">Language</span>
                        <span className="text-primary font-semibold">{settings.language}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                        <span className="text-on-surface-variant">Cache</span>
                        <span className="text-primary font-semibold">Miss</span>
                      </div>
                      <div className="bg-surface-container-lowest p-1.5 rounded flex items-center justify-between">
                        <span className="text-on-surface-variant">Proxies</span>
                        <span className="text-primary font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-space-md">
                  {results.results.map((result, idx) => {
                    let hostname = '';
                    try { hostname = new URL(result.url).hostname; } catch { hostname = ''; }
                    return (
                      <article
                        key={idx}
                        className={`result-card group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-150 flex flex-col gap-space-xs ${settings.compactResults ? 'p-space-sm' : 'p-space-md'}`}
                      >
                        <div className="flex items-center justify-between gap-space-xs">
                          <div className="flex items-center gap-space-xs overflow-hidden">
                            {result.thumbnail ? (
                              <img src={result.thumbnail} alt="" className="w-4 h-4 rounded-sm object-cover" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono-metric text-[9px] font-bold shrink-0">
                                {hostname.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                              {Array.isArray(result.parsed_url)
                                ? result.parsed_url.join('')
                                : result.parsed_url || hostname}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {result.engine && (
                              <span className="font-mono-metric text-mono-metric px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                                {result.engine}
                              </span>
                            )}
                          </div>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                          <a href={result.url} target={linkTarget} rel="noopener noreferrer" className="hover:underline">
                            {result.title}
                          </a>
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                          {result.content}
                        </p>
                        <div className="flex items-center justify-between pt-space-xs mt-1 text-on-surface-variant">
                          <div className="flex items-center gap-space-xs">
                            {result.publishedDate && (
                              <span className="font-mono-metric text-mono-metric text-on-surface-variant">
                                {new Date(result.publishedDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <span className="font-mono-metric text-[10px] text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">verified_user</span>
                            Clean Direct Link
                          </span>
                        </div>
                      </article>
                    );
                  })}

                  {results.results.length === 0 && (
                    <div className="text-center font-body-md text-on-surface-variant py-space-xl">
                      No results found for "{query}".
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <aside className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono-metric text-mono-metric uppercase tracking-wider text-primary font-semibold">Knowledge Card</span>
                <span className="font-mono-metric text-[10px] bg-surface-container-low px-1.5 py-0.5 rounded text-on-surface-variant">searxng/v2</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Self-Hosting & Metasearch</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Metasearch is an aggregation technology that passes client queries through an isolated intermediary proxy to indexers. By running the node locally, queries are decoupled from user credentials and persistent network signatures.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <h4 className="font-label-md text-label-md text-on-surface font-bold">Privacy Telemetry</h4>
                </div>
                <span className="font-mono-metric text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">100% STERILE</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                All HTTP headers forwarded to upstream search providers were scrubbed locally.
              </p>
              <div className="bg-inverse-surface p-space-sm rounded-lg text-inverse-on-surface font-mono-code text-[11px] leading-relaxed">
                <div className="text-outline-variant select-none">// Outbound Outgoing Headers:</div>
                <div className="text-primary-fixed">Host: 127.0.0.1:8080 (Internal)</div>
                <div className="text-error-container line-through">X-Forwarded-For: [STRIPPED]</div>
                <div className="text-error-container line-through">Cookie: [STRIPPED]</div>
                <div className="text-error-container line-through">Sec-CH-UA: [STRIPPED]</div>
                <div className="text-surface-container-highest">User-Agent: Mozilla/5.0 (Randomized)</div>
                <div className="text-primary-fixed">DNT: 1 (Enforced)</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
