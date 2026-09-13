import { useState, useEffect, useCallback } from 'react';
import { Play, RefreshCw, CheckCircle2, Server } from 'lucide-react';

export default function BackendOfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    setStatusMessage(null);
    try {
      if (window.electronAPI?.checkBackend) {
        const alive = await window.electronAPI.checkBackend();
        setIsOffline(!alive);
        setIsChecking(false);
        return alive;
      }

      // Fallback for browser
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('/search?q=test&format=json', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const alive = res.ok;
      setIsOffline(!alive);
      setIsChecking(false);
      return alive;
    } catch {
      setIsOffline(true);
      setIsChecking(false);
      return false;
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkConnection();

    const handleOfflineEvent = () => {
      setIsOffline(true);
    };

    window.addEventListener('privsearch:backend-offline', handleOfflineEvent);
    return () => {
      window.removeEventListener('privsearch:backend-offline', handleOfflineEvent);
    };
  }, [checkConnection]);

  const handleStartBackend = async () => {
    if (window.electronAPI?.startBackend) {
      setIsStarting(true);
      setStatusMessage('Starting Docker backend (docker compose up -d)...');
      try {
        const result = await window.electronAPI.startBackend();
        if (result.success) {
          setStatusMessage('Waiting for SearXNG to initialize...');
          // Poll for up to 15 seconds
          let attempts = 0;
          const interval = setInterval(async () => {
            attempts++;
            const alive = await window.electronAPI!.checkBackend();
            if (alive) {
              clearInterval(interval);
              setIsStarting(false);
              setIsOffline(false);
              setIsSuccess(true);
              setStatusMessage('Backend connected successfully!');
              setTimeout(() => {
                setIsSuccess(false);
                setStatusMessage(null);
              }, 4000);
            } else if (attempts >= 8) {
              clearInterval(interval);
              setIsStarting(false);
              setStatusMessage('Backend command executed, but SearXNG is still booting. Try clicking "Retry Connection" in a moment.');
            }
          }, 2000);
        } else {
          setIsStarting(false);
          setStatusMessage(
            result.message
              ? `Error: ${result.message}. Please ensure Docker Desktop is open.`
              : 'Failed to start backend. Please verify Docker Desktop is running.'
          );
        }
      } catch (err: unknown) {
        setIsStarting(false);
        const msg = err instanceof Error ? err.message : String(err);
        setStatusMessage(`Error: ${msg}. Please ensure Docker Desktop is running.`);
      }
    } else {
      setStatusMessage(
        'In your terminal, run: cd C:\\Users\\GameXspace\\PrivSearch\\searxng && docker compose up -d'
      );
    }
  };

  const handleRetry = async () => {
    const alive = await checkConnection();
    if (alive) {
      setIsOffline(false);
      setIsSuccess(true);
      setStatusMessage('Connected to SearXNG backend!');
      setTimeout(() => {
        setIsSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } else {
      setStatusMessage('Backend is still unreachable at http://127.0.0.1:8080');
    }
  };

  if (!isOffline && !isSuccess) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-sm flex items-center justify-between shadow-md transition-all">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{statusMessage || 'Connected to SearXNG backend.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="bg-amber-500/15 dark:bg-amber-950/40 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-3 shadow-sm transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">PrivSearch backend is offline.</span>
              <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-800 dark:text-amber-300 font-mono">
                http://127.0.0.1:8080
              </span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              SearXNG is required for search results. You can start it via Docker or retry the connection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleStartBackend}
            disabled={isStarting || isChecking}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isStarting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isStarting ? 'Starting...' : 'Start Backend'}</span>
          </button>

          <button
            type="button"
            onClick={handleRetry}
            disabled={isStarting || isChecking}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/80 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Retry Connection'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="max-w-6xl mx-auto mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
