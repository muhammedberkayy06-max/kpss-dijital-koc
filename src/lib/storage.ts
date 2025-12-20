import type { HistoryItem } from '../types';

const KEY_API_NEW = 'AI_API_KEY';
const KEY_API_OLD = 'kpss_gemini_key';
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
  // Yeni anahtar varsa onu oku, yoksa eski gemini anahtarına da bak (geri uyumluluk)
  getApiKey: () => localStorage.getItem(KEY_API_NEW) || localStorage.getItem(KEY_API_OLD),

  // Artık sadece yeni anahtara yaz
  setApiKey: (key: string) => {
    const k = key.trim();
    localStorage.setItem(KEY_API_NEW, k);
    // Eskisini temizle
    localStorage.removeItem(KEY_API_OLD);
  },

  removeApiKey: () => {
    localStorage.removeItem(KEY_API_NEW);
    localStorage.removeItem(KEY_API_OLD);
  },

  getHistory: (): HistoryItem[] => safeParse<HistoryItem[]>(localStorage.getItem(KEY_HISTORY), []),

  saveResult: (result: HistoryItem) => {
    const history = storage.getHistory();
    history.unshift(result);
    localStorage.setItem(KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  },

  clearHistory: () => localStorage.removeItem(KEY_HISTORY),
};
