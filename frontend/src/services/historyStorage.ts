const HISTORY_KEY = 'privsearch_history';
const MAX_ENTRIES = 50;

export function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function addHistoryEntry(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const history = getHistory().filter((h) => h !== trimmed);
  history.unshift(trimmed);
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
