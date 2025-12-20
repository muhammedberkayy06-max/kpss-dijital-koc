import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnswerOption, Question } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { cn } from '../lib/utils';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Menu, X, Lightbulb } from 'lucide-react';

type LocationState = { questions: Question[]; type: 'GK-GY' | 'A-GRUBU' };

export function ExamPage() {
  const { state } = useLocation() as { state: LocationState | null };
  const navigate = useNavigate();

  const [questions] = useState<Question[]>(state?.questions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!state?.questions?.length) navigate('/');
  }, [state, navigate]);

  const currentQ = questions[currentIndex];
  const selectedOption = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = !!selectedOption;

  const handleOptionClick = (opt: AnswerOption) => {
    if (!currentQ || isAnswered) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let empty = 0;

    for (const q of questions) {
      const ans = answers[q.id];
      if (!ans) empty++;
      else if (ans === q.dogru) correct++;
      else incorrect++;
    }
    const net = correct - incorrect / 4;
    return { correct, incorrect, empty, net };
  }, [answers, questions]);

  const handleFinish = () => {
    if (!state) return;
    if (confirm('Sınavı bitirmek istediğinize emin misiniz?')) {
      const results = {
        questions,
        answers,
        duration: Date.now() - startTime,
        date: Date.now(),
        type: state.type,
      };
      navigate('/result', { state: results });
    }
  };

  const nextQ = () => currentIndex < questions.length - 1 && setCurrentIndex((c) => c + 1);
  const prevQ = () => currentIndex > 0 && setCurrentIndex((c) => c - 1);

  if (!currentQ) return null;

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-ios-bg">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0',
          showDrawer ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Sorular</h2>
          <button onClick={() => setShowDrawer(false)} className="md:hidden" aria-label="Kapat">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 text-xs text-gray-600 flex justify-between">
          <span>D: {stats.correct} • Y: {stats.incorrect} • B: {stats.empty}</span>
          <span className="font-semibold">Net: {stats.net.toFixed(2)}</span>
        </div>

        <div className="p-2 overflow-y-auto h-full pb-20 grid grid-cols-4 gap-2">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            let colorClass = 'bg-gray-100 text-gray-600';
            if (ans) colorClass = ans === q.dogru ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
            if (idx === currentIndex) colorClass += ' ring-2 ring-ios-blue ring-offset-1';

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowDrawer(false);
                }}
                className={cn('h-10 rounded-lg text-sm font-medium border border-transparent transition-all', colorClass)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowDrawer(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Menü">
              <Menu size={20} />
            </button>
            <div className="text-sm font-medium text-gray-500">
              {currentQ.ders} • {currentQ.konu}
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleFinish}>
            Bitir
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold text-ios-blue">Soru {currentIndex + 1}</span>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-1 rounded uppercase',
                    currentQ.zorluk === 'kolay'
                      ? 'bg-green-100 text-green-700'
                      : currentQ.zorluk === 'orta'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  )}
                >
                  {currentQ.zorluk}
                </span>
              </div>
              <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium">{currentQ.soru}</p>
            </Card>

            <div className="space-y-3">
              {(Object.entries(currentQ.secenekler) as Array<[AnswerOption, string]>).map(([key, val]) => {
                const isSelected = selectedOption === key;
                const isCorrect = currentQ.dogru === key;

                let btnStyle = 'bg-white border-gray-200 hover:border-ios-blue hover:bg-blue-50';
                if (isAnswered) {
                  if (isCorrect) btnStyle = 'bg-green-50 border-green-500 text-green-800';
                  else if (isSelected) btnStyle = 'bg-red-50 border-red-500 text-red-800';
                  else btnStyle = 'bg-gray-50 text-gray-400 border-gray-100';
                } else if (isSelected) {
                  btnStyle = 'bg-blue-50 border-ios-blue text-ios-blue ring-1 ring-ios-blue';
                }

                return (
                  <button
                    key={key}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(key)}
                    className={cn('w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 text-base', btnStyle)}
                  >
                    <span
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border',
                        isAnswered && isCorrect
                          ? 'bg-green-500 border-green-500 text-white'
                          : isAnswered && isSelected
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-gray-300 text-gray-500'
                      )}
                    >
                      {key}
                    </span>
                    <span>{val}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="ml-auto text-green-600" size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto text-red-600" size={20} />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Lightbulb size={18} /> Çözüm
                </h4>
                <p className="text-blue-900 text-sm leading-relaxed mb-3">{currentQ.aciklama}</p>

                {!!currentQ.adimAdimCozum && (
                  <div className="mt-3 pt-3 border-t border-blue-200/50">
                    <p className="font-semibold text-blue-800 text-xs uppercase mb-1">Adım Adım İşlem</p>
                    <p className="text-blue-900 text-sm whitespace-pre-line font-mono bg-white/50 p-2 rounded">{currentQ.adimAdimCozum}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex justify-between items-center safe-area-bottom">
          <Button variant="secondary" onClick={prevQ} disabled={currentIndex === 0}>
            <ArrowLeft size={18} /> Önceki
          </Button>
          <span className="text-sm font-medium text-gray-500">
            {currentIndex + 1} / {questions.length}
          </span>
          <Button variant="primary" onClick={nextQ} disabled={currentIndex === questions.length - 1}>
            Sonraki <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
