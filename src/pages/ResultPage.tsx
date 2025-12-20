import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { storage } from '../lib/storage';
import type { AnswerOption, HistoryItem, Question } from '../types';
import { Home } from 'lucide-react';
import { generateUUID } from '../lib/utils';

type ResultState = {
  questions: Question[];
  answers: Record<string, AnswerOption>;
  duration: number;
  date: number;
  type: 'GK-GY' | 'A-GRUBU';
};

export function ResultPage() {
  const { state } = useLocation() as { state: ResultState | null };
  const navigate = useNavigate();

  const computed = useMemo(() => {
    if (!state) return null;
    const total = state.questions.length;

    let correct = 0;
    let incorrect = 0;
    let empty = 0;

    state.questions.forEach((q) => {
      const ans = state.answers[q.id];
      if (!ans) empty++;
      else if (ans === q.dogru) correct++;
      else incorrect++;
    });

    const net = correct - incorrect / 4;

    const item: HistoryItem = {
      id: generateUUID(),
      date: state.date,
      type: state.type,
      durationMs: state.duration,
      total,
      correct,
      incorrect,
      empty,
      net,
    };

    return { total, correct, incorrect, empty, net, item };
  }, [state]);

  useEffect(() => {
    if (computed?.item) storage.saveResult(computed.item);
  }, [computed]);

  if (!state || !computed) {
    return (
      <div className="space-y-4">
        <Card>
          <p>Sonuç bulunamadı. Ana sayfaya dön.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            <Home size={18} /> Ana Sayfa
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Sınav Sonucu</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Doğru" value={computed.correct} color="bg-green-100 text-green-700" />
        <StatCard label="Yanlış" value={computed.incorrect} color="bg-red-100 text-red-700" />
        <StatCard label="Boş" value={computed.empty} color="bg-gray-100 text-gray-700" />
        <StatCard label="Net" value={computed.net.toFixed(2)} color="bg-blue-100 text-blue-700" />
      </div>

      <Card className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">Tebrikler! 🎉</h3>
        <p className="text-gray-500 mb-6">
          Sınavı tamamladın. Eksik olduğun konuları hedefleyerek bir sonraki denemede daha iyi olabilirsin.
        </p>
        <Button onClick={() => navigate('/')} className="w-full md:w-auto">
          <Home size={18} /> Ana Sayfaya Dön
        </Button>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`p-4 rounded-xl text-center ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-semibold uppercase opacity-80">{label}</div>
    </div>
  );
}
