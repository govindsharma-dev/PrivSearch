export interface SearxngResult {
  title: string;
  url: string;
  content: string;
  // Web result fields
  img_src?: string;
  thumbnail?: string;
  engine: string;
  parsed_url: string | string[];
  category: string;
  publishedDate?: string | null;
  pubdate?: string;
  // Image-specific fields (from SearXNG images category)
  thumbnail_src?: string;
  resolution?: string;
  img_format?: string;
  source?: string;
  filesize?: string;
  // Common optional
  engines?: string | string[];
  score?: number;
}

export interface SearxngResponse {
  query: string;
  number_of_results: number;
  results: SearxngResult[];
  answers: unknown[];
  corrections: unknown[];
  infoboxes: unknown[];
  suggestions: string[];
}

export interface SearchOptions {
  categories?: string;
  page?: number;
  safesearch?: 0 | 1 | 2;
  language?: string;
}

export const search = async (
  query: string,
  options: SearchOptions | string = {}
): Promise<SearxngResponse> => {
  if (!query.trim()) {
    throw new Error('Empty query');
  }

  // Support old-style: search(query, 'images') for backwards compat
  let opts: SearchOptions;
  if (typeof options === 'string') {
    opts = { categories: options };
  } else {
    opts = options;
  }

  const { categories = 'general', page = 1, safesearch, language } = opts;

  const params = new URLSearchParams({
    q: query,
    categories,
    pageno: page.toString(),
    format: 'json',
  });

  if (safesearch !== undefined) {
    params.set('safesearch', safesearch.toString());
  }

  if (language && language !== 'auto') {
    params.set('language', language);
  }

  const isDesktop = typeof window !== 'undefined' && (window.location.protocol === 'file:' || !!window.electronAPI?.isElectron);
  const endpoint = isDesktop ? 'http://127.0.0.1:8080/search' : '/search';

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`);

    if (!response.ok) {
      if (response.status >= 500) {
        window.dispatchEvent(new CustomEvent('privsearch:backend-offline'));
      }
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    window.dispatchEvent(new CustomEvent('privsearch:backend-offline'));
    throw err;
  }
};

