import type { HistoryItem } from '../types';

const KEY_API = 'AI_API_KEY';
const KEY_HISTORY = 'kpss_exam_history';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const storage = {
  getApiKey: () => localStorage.getItem(KEY_API),
  setApiKey: (key: string) => localStorage.setItem(KEY_API, key),
  removeApiKey: () => localStorage.removeItem(KEY_API),

  getHistory: (): HistoryItem[] => safeParse<HistoryItem[]>(localStorage.getItem(KEY_HISTORY), []),
  saveResult: (result: HistoryItem) => {
    const history = storage.getHistory();
    history.unshift(result); // newest first
    localStorage.setItem(KEY_HISTORY, JSON.stringify(history.slice(0, 50))); // cap
  },
  clearHistory: () => localStorage.removeItem(KEY_HISTORY),
};
