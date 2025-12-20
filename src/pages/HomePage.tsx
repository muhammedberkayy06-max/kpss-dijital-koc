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

  const history = useMemo<HistoryItem[]>(() => storage.getHistory(), []);

  useEffect(() => {
    setApiKey(storage.getApiKey());
  }, []);

  const startExam = async (type: ExamType) => {
    const key = apiKey || storage.getApiKey();
    if (!key) {
      alert("Lütfen önce Ayarlar'dan Hugging Face API Anahtarınızı girin.");
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

      navigate('/exam', {
        state: {
          examType: type,
          questions,
        },
      });
    } catch (e) {
      console.error(e);
      alert('Soru üretimi başarısız oldu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Merhaba 👋</h1>
          <p className="text-gray-600 mt-1">Bugün hangi sınava hazırlanmak istersin?</p>
        </div>
      </div>

      {!storage.getApiKey() && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-yellow-700 mt-0.5" size={20} />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900">API Anahtarı Eksik</div>
            <div className="text-sm text-yellow-800 mt-1">
              Soru üretebilmek için Ayarlar'dan Hugging Face API anahtarını girmelisin.
            </div>
            <div className="mt-3">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Ayarlara Git
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 font-medium mb-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Üretiliyor...</span>
          </div>
          <div className="text-sm text-gray-600 mb-3">{progressMsg}</div>
          <ProgressBar value={progressVal} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="font-bold text-lg">GK-GY Denemesi</div>
                <div className="text-sm text-gray-600">Türkçe, Matematik, Tarih, Coğrafya, Vatandaşlık, Güncel</div>
              </div>
            </div>
            <Badge className="bg-gray-100 text-gray-700">120 SORU</Badge>
          </div>

          <div className="mt-4">
            <Button onClick={() => startExam('GK-GY')} disabled={loading} className="w-full">
              Başla
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <GraduationCap className="text-purple-600" size={20} />
              </div>
              <div>
                <div className="font-bold text-lg">A Grubu Denemesi</div>
                <div className="text-sm text-gray-600">İktisat, Hukuk, Maliye gibi alan dersleri</div>
              </div>
            </div>
            <Badge className="bg-gray-100 text-gray-700">200 SORU</Badge>
          </div>

          <div className="mt-4">
            <Button onClick={() => startExam('A-GRUBU')} disabled={loading} className="w-full">
              Başla
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Clock size={18} />
          <span>Geçmiş Sonuçlar</span>
        </div>

        {history.length === 0 ? (
          <div className="text-sm text-gray-600 mt-2">Henüz kayıtlı sonuç yok.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {history.map((h) => (
              <Card key={h.id} className="p-4">
                <div className="font-semibold">{h.title}</div>
                <div className="text-xs text-gray-600 mt-1">{new Date(h.date).toLocaleString()}</div>

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
