import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('AI_API_KEY') || ''
  );

  const saveKey = () => {
    localStorage.setItem('AI_API_KEY', apiKey.trim());
    alert('API anahtarı kaydedildi');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ayarlar</h1>

      <p className="mb-3 text-sm text-gray-700">
        Bu uygulama <b>ücretsiz Hugging Face</b> modeli kullanır.
        Aşağıdan kendi Hugging Face API anahtarını girmen gerekir.
      </p>

      <p className="mb-4 text-sm">
        Anahtar almak için:{' '}
        <a
          href="https://huggingface.co/settings/tokens"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          https://huggingface.co/settings/tokens
        </a>
        <br />
        <span className="text-xs text-gray-500">
          (Read yetkisi yeterlidir)
        </span>
      </p>

      <label className="block text-sm font-medium mb-1">
        Hugging Face API Key
      </label>

      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="hf_xxxxxxxxxxxxxxxxx"
      />

      <button
        onClick={saveKey}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Kaydet
      </button>
    </div>
  );
}
