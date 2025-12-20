export type ExamType = 'GK-GY' | 'A-GRUBU';
export type Difficulty = 'kolay' | 'orta' | 'zor';
export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Question {
  id: string;
  examType: ExamType;
  ders: string;
  konu: string;
  zorluk: Difficulty;
  soru: string;
  secenekler: Record<AnswerOption, string>;
  dogru: AnswerOption;
  aciklama: string;
  adimAdimCozum?: string; // Sadece matematik için
  userAnswer?: AnswerOption | null; // Kullanıcının cevabı (opsiyonel)
}

export interface ExamSession {
  id: string;
  date: number;
  type: ExamType;
  questions: Question[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  score: {
    correct: number;
    incorrect: number;
    empty: number;
    net: number;
  };
}

export interface SyllabusItem {
  ders: string;
  konular: string[];
  soruSayisi: number;
}

export interface WeightMap {
  [konu: string]: number;
}

export interface HistoryItem {
  id: string;
  date: number;
  type: ExamType;
  durationMs: number;
  total: number;
  correct: number;
  incorrect: number;
  empty: number;
  net: number;
}
