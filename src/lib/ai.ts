import { z } from 'zod';
import type { AnswerOption, ExamType, Question } from '../types';
import { generateUUID } from './utils';
import { GKGY_SYLLABUS, AGRUBU_SYLLABUS } from './syllabus';

/**
 * Hugging Face Inference API (free tier available).
 * Model choice can be changed, but keep it reasonably small for free tier.
 */
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

const AnswerOptionSchema = z.enum(['A', 'B', 'C', 'D', 'E']);

const HFQuestionSchema = z.object({
  soru: z.string().min(1),
  secenekler: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
    E: z.string().min(1),
  }),
  dogru: AnswerOptionSchema,
  aciklama: z.string().min(1),
  // opsiyonel alanlar
  konu: z.string().optional(),
  zorluk: z.enum(['kolay', 'orta', 'zor']).optional(),
  adimAdimCozum: z.string().optional(),
});

const HFResponseSchema = z.array(HFQuestionSchema);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractJsonArray(text: string): string {
  let t = text.trim();

  // code fences temizle
  t = t.replace(/```json/gi, '').replace(/```/g, '').trim();

  // ilk '['..']' arası
  const first = t.indexOf('[');
  const last = t.lastIndexOf(']');
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }

  // smart quotes
  t = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // trailing comma fix
  t = t.replace(/,\s*([\]}])/g, '$1');

  return t.trim();
}

async function callHF(apiKey: string, prompt: string) {
  const maxAttempts = 4;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: 0.4,
            max_new_tokens: 900,
            return_full_text: false,
          },
        }),
      });

      const data = await res.json().catch(() => null);

      // HF bazen 503 + { error: "...", estimated_time: 12 }
      const estimated = typeof (data as any)?.estimated_time === 'number' ? (data as any).estimated_time : null;
      const errMsg = typeof (data as any)?.error === 'string' ? (data as any).error : null;

      if (!res.ok) {
        // Model yükleniyor / yoğun -> bekleyip tekrar dene
        const retryable = res.status === 503 || res.status === 429 || res.status === 500;
        if (retryable && attempt < maxAttempts) {
          const wait = estimated ? Math.ceil(estimated * 1000) : 1200 * attempt;
          await sleep(wait);
          continue;
        }
        throw new Error(`HF API hata: ${res.status}${errMsg ? ` | ${errMsg}` : ''}`);
      }

      // Bazı modeller: [{ generated_text: "..." }]
      const text = Array.isArray(data) ? (data as any)[0]?.generated_text : (data as any)?.generated_text;
      if (!text || typeof text !== 'string') {
        throw new Error('HF boş yanıt döndü.');
      }

      const jsonStr = extractJsonArray(text);

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        throw new Error('HF JSON formatı bozuk döndü (parse edilemedi).');
      }

      const validated = HFResponseSchema.safeParse(parsed);
      if (!validated.success) {
        throw new Error('HF JSON şeması beklenen formatta değil.');
      }

      return validated.data;
    } catch (e) {
      lastErr = e;
      if (attempt < maxAttempts) {
        await sleep(500 * attempt);
        continue;
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('HF çağrısı başarısız oldu.');
}

function createPrompt(ders: string, konular: string[], count: number, examType: ExamType) {
  const konularStr = konular.join(', ');
  const mathInstruction =
    ders === 'Matematik'
      ? 'Matematik soruları için "adimAdimCozum" alanını doldur (kısa da olsa).'
      : 'Matematik değilse "adimAdimCozum" alanını boş string "" yap.';

  return `
SADECE ve SADECE geçerli JSON ARRAY döndür.
Markdown kullanma. Açıklama yazma. Kod bloğu kullanma.
Yanıtın ilk karakteri "[" son karakteri "]" olsun.

Sen uzman bir KPSS soru hazırlayıcısısın.
Ders: ${ders}
Konular: ${konularStr}
Soru Sayısı: ${count}
Sınav Tipi: ${examType}

Her obje şeması:
{
  "konu": "Sorunun ait olduğu alt konu",
  "zorluk": "kolay" | "orta" | "zor",
  "soru": "Soru metni",
  "secenekler": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
  "dogru": "A" | "B" | "C" | "D" | "E",
  "aciklama": "Doğru cevabın açıklaması",
  "adimAdimCozum": "Matematikse adım adım çözüm, değilse boş string"
}

Kurallar:
1) Sorular özgün, Türkçe ve KPSS formatında (5 şıklı) olsun.
2) Zorluk dağılımı: %25 kolay, %55 orta, %20 zor olsun.
3) ${mathInstruction}

Şimdi TAM OLARAK ${count} adet obje içeren JSON ARRAY döndür.
`.trim();
}

export async function generateExam(
  examType: ExamType,
  apiKey: string,
  onProgress: (msg: string, percent: number) => void
): Promise<Question[]> {
  const syllabus = examType === 'GK-GY' ? GKGY_SYLLABUS : AGRUBU_SYLLABUS;

  let allQuestions: Question[] = [];
  let generatedCount = 0;
  const totalQuestions = syllabus.reduce((acc, item) => acc + item.soruSayisi, 0);

  for (const lesson of syllabus) {
    onProgress(`${lesson.ders} soruları hazırlanıyor...`, Math.round((generatedCount / totalQuestions) * 100));

    // HF ücretsiz tier için küçük batch daha stabil
    const BATCH_SIZE = 2;
    const batches = Math.ceil(lesson.soruSayisi / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
      const remaining = lesson.soruSayisi - i * BATCH_SIZE;
      const currentBatchSize = remaining > BATCH_SIZE ? BATCH_SIZE : remaining;

      try {
        const prompt = createPrompt(lesson.ders, lesson.konular, currentBatchSize, examType);
        const rawQuestions = await callHF(apiKey, prompt);

        const processed: Question[] = rawQuestions.map((q) => ({
          id: generateUUID(),
          examType,
          ders: lesson.ders,
          konu: q.konu || lesson.konular[0],
          zorluk: q.zorluk || 'orta',
          soru: q.soru,
          secenekler: q.secenekler as Record<AnswerOption, string>,
          dogru: q.dogru,
          aciklama: q.aciklama,
          adimAdimCozum: lesson.ders === 'Matematik' ? (q.adimAdimCozum || '') : '',
        }));

        allQuestions = allQuestions.concat(processed);
        generatedCount += currentBatchSize;
      } catch (err) {
        console.error(`Batch hatası (${lesson.ders}):`, err);
        // Hata olsa bile devam et
      }

      // HF rate limit'e takılmamak için bekle
      await sleep(900);
    }
  }

  onProgress('Tamamlanıyor...', 100);

  const cleaned = allQuestions
    .filter((q) => q.soru && q.secenekler && q.dogru)
    .slice(0, totalQuestions);

  return cleaned;
}
