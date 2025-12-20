import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { storage } from '../lib/storage';
import { Save, Trash2, Key, ShieldAlert } from 'lucide-react';

export function SettingsPage() {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const k = storage.getApiKey();
    if (k) {
      setKey(k);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (key.trim().length > 10) {
      storage.setApiKey(key.trim());
      setSaved(true);
      alert('API Anahtarı (Hugging Face) kaydedildi!');
    } else {
      alert('Geçersiz anahtar formatı');
    }
  };

  const handleClear = () => {
    storage.removeApiKey();
    setKey('');
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <Key size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Gemini API Anahtarı (Hugging Face)</h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl flex items-start gap-3 mb-4">
          <ShieldAlert className="shrink-0 mt-0.5" size={18} />
          <p className="text-sm">
            Not: API anahtarı tarayıcınızda (localStorage) tutulur. Bu demo amaçlıdır. Üretim ortamında en güvenlisi, bir backend proxy
            üzerinden çağırmaktır.
          </p>
        </div>

        <p className="text-slate-500 text-sm mb-4">
          Soru üretimi için Hugging Face (Inference API) anahtarına ihtiyacımız var.
          <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-ios-blue underline ml-1">
            Buradan ücretsiz alabilirsiniz.
          </a>
          </a>
        </p>

        <div className="space-y-3">
          <Input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIzaSy..."
            className="font-mono text-sm"
          />

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Save size={18} /> Kaydet
            </Button>
            {saved && (
              <Button onClick={handleClear} variant="danger" className="flex-1">
                <Trash2 size={18} /> Sil
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Hakkında</h2>
        <p className="text-slate-500 text-sm">
          KPSS Dijital Koç – Ultimate v1.1
          <br />
          PWA destekli, AI tabanlı sınav hazırlık asistanı.
        </p>
      </Card>
    </div>
  );
}
