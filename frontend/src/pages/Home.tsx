import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategorySearch = (cat: string) => {
    if (query.trim()) {
      navigate(`/${cat === 'images' ? 'images' : 'search'}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-between px-gutter py-space-xl md:py-space-2xl min-h-[calc(100vh-8rem)]">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#dce9ff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-10 my-auto">
          <div className="flex flex-col items-center text-center mb-space-lg">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-lowest shadow-sm mb-space-md p-space-xs">
              <div className="absolute inset-0 rounded-full bg-primary/5"></div>
              <span className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <span className="absolute bottom-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">PrivSearch</span>
              <span className="font-mono-metric text-mono-metric bg-primary-container/10 text-primary font-semibold px-space-xs py-space-2xs rounded">LOCAL</span>
            </div>
            <p className="font-headline-sm text-headline-sm text-secondary font-medium tracking-tight">
              Search privately. Discover freely.
            </p>
          </div>
          
          <div className="w-full max-w-3xl mb-space-md">
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-space-xs py-space-xs px-space-xs bg-surface-container-low rounded-xl shadow-inner mb-space-md scrollbar-none">
              {['web', 'images', 'videos', 'news', 'maps', 'music', 'science', 'files'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategorySearch(cat)}
                  className={`category-pill flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all duration-150 whitespace-nowrap ${cat === 'web' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-secondary hover:text-on-surface hover:bg-surface-container'}`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {cat === 'web' ? 'public' : cat === 'images' ? 'image' : cat === 'videos' ? 'smart_display' : cat === 'news' ? 'newspaper' : cat === 'maps' ? 'map' : cat === 'music' ? 'graphic_eq' : cat === 'science' ? 'menu_book' : 'folder_zip'}
                  </span>
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="relative flex items-center w-full bg-surface-container-lowest rounded-full shadow-md hover:shadow-lg transition-all duration-200 px-space-md py-space-xs focus-within:ring-2 focus-within:ring-primary/20">
                <div className="flex items-center pl-space-xs pr-space-sm text-primary">
                  <span className="material-symbols-outlined text-[24px]">search</span>
                </div>
                <input 
                  className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none py-space-sm" 
                  placeholder="Search the web, code, papers, or onion domains..." 
                  spellCheck="false" 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center gap-space-xs pr-space-xs">
                  {query && (
                    <button onClick={() => setQuery('')} className="flex items-center justify-center w-7 h-7 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors" type="button">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                  <button className="ml-space-xs px-space-md py-space-xs bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-md text-label-md flex items-center gap-space-2xs transition-colors shadow-sm" type="submit">
                    <span>Search</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm w-full max-w-3xl mb-space-lg">
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">shield_lock</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">Local-first</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">no_accounts</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">No Accounts</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">code_blocks</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">Open Source</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">history_toggle_off</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">Privacy-focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
