import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { storage } from '../lib/storage';
import { generateExam } from '../lib/ai';
import type { ExamType, HistoryItem } from '../types';
import { BookOpen, GraduationCap, AlertCircle, Loader2, Clock } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressVal, setProgressVal] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setApiKey(storage.getApiKey());
    setHistory(storage.getHistory());
  }, []);

  const startExam = async (type: ExamType) => {
    const key = storage.getApiKey(); // her seferinde storage'dan oku
    if (!key) {
      alert("Lütfen önce Ayarlar'dan Hugging Face API anahtarını girin.");
      navigate('/settings');
      return;
    }

    setLoading(true);
    setProgressVal(0);

    try {
      const questions = await generateExam(type, key, (msg, val) => {
        setProgressMsg(msg);
        setProgressVal(val);
      });

      if (questions.length === 0) throw new Error('Soru üretilemedi.');

      navigate('/exam', { state: { questions, type } });
    } catch (error) {
      alert('Sınav oluşturulurken bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const historyTitle = useMemo(
    () => (history.length ? `Geçmiş Sonuçlar (${history.length})` : 'Geçmiş Sonuçlar'),
    [history.length]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="animate-spin text-ios-blue" size={48} />
        <h2 className="text-xl font-semibold text-slate-800">Sınav Hazırlanıyor</h2>
        <div className="w-full max-w-md px-4">
          <ProgressBar progress={progressVal} label={progressMsg} />
        </div>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Yapay zeka soruları sizin için üretiyor. İnternet hızınıza göre 1-2 dakika sürebilir.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Merhaba 👋</h1>
        <p className="text-slate-500">Bugün hangi sınava hazırlanmak istersin?</p>
      </header>

      {!apiKey && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="shrink-0" />
          <div>
            <p className="font-semibold">API Anahtarı Eksik</p>
            <p className="text-sm mt-1">Soru üretebilmek için Ayarlar'dan Hugging Face API anahtarını girmelisin.</p>
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => navigate('/settings')}>
              Ayarlara Git
            </Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card onClick={() => startExam('GK-GY')} className="group border-l-4 border-l-ios-blue hover:border-l-ios-blue/80">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-full text-ios-blue">
              <BookOpen size={24} />
            </div>
            <Badge>120 SORU</Badge>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">GK-GY Denemesi</h3>
          <p className="text-slate-500 text-sm mb-4">
            Türkçe, Matematik, Tarih, Coğrafya, Vatandaşlık ve Güncel Bilgi derslerini kapsayan tam deneme.
          </p>
          <Button className="w-full group-hover:bg-blue-600">Başla</Button>
        </Card>

        <Card onClick={() => startExam('A-GRUBU')} className="group border-l-4 border-l-purple-500 hover:border-l-purple-500/80">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <GraduationCap size={24} />
            </div>
            <Badge>200 SORU</Badge>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">A Grubu Denemesi</h3>
          <p className="text-slate-500 text-sm mb-4">İktisat, Hukuk, Maliye gibi alan derslerini içeren uzmanlık denemesi.</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Başla</Button>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{historyTitle}</h2>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                storage.clearHistory();
                setHistory([]);
              }}
            >
              Temizle
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            Henüz sınav çözmediniz.
          </div>
        ) : (
          <div className="grid gap-3">
            {history.slice(0, 10).map((h) => (
              <Card key={h.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">{h.type === 'GK-GY' ? 'GK-GY' : 'A Grubu'} Denemesi</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(h.date).toLocaleString('tr-TR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ios-blue">Net: {h.net.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-1">
                      <Clock size={14} /> {Math.max(1, Math.round(h.durationMs / 60000))} dk
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 flex gap-2 flex-wrap">
                  <Badge className="bg-green-100 text-green-700">D: {h.correct}</Badge>
                  <Badge className="bg-red-100 text-red-700">Y: {h.incorrect}</Badge>
                  <Badge className="bg-gray-100 text-gray-700">B: {h.empty}</Badge>
                  <Badge className="bg-blue-100 text-blue-700">Toplam: {h.total}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
