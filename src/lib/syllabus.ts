import type { SyllabusItem, WeightMap } from '../types';

export const GKGY_SYLLABUS: SyllabusItem[] = [
  {
    ders: 'Türkçe',
    soruSayisi: 30,
    konular: ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf', 'Ses Bilgisi', 'Sözcükte Yapı', 'Sözcük Türleri', 'Cümlenin Türleri', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Anlatım Bozuklukları', 'Sözel Mantık']
  },
  {
    ders: 'Matematik',
    soruSayisi: 30,
    konular: ['Temel Kavramlar', 'Sayılar', 'Ebob-Ekok', 'Denklemler', 'Rasyonel Sayılar', 'Eşitsizlik & Mutlak Değer', 'Üslü ve Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran-Orantı', 'Problemler', 'Kümeler', 'Permütasyon Kombinasyon Olasılık', 'Tablo & Grafikler', 'Sayısal Mantık']
  },
  {
    ders: 'Tarih',
    soruSayisi: 27,
    konular: ['İslamiyet Öncesi Türk Tarihi', 'İlk Müslüman Türk Devletleri', 'Osmanlı Tarihi', 'Yenileşme ve Demokratikleşme Hareketleri', 'XX. Yüzyıl Osmanlı', 'Kurtuluş Savaşı', 'Cumhuriyet Dönemi', 'Atatürk Dönemi Dış Politika', 'Çağdaş Türk & Dünya Tarihi']
  },
  {
    ders: 'Coğrafya',
    soruSayisi: 18,
    konular: ['Türkiye Coğrafi Konumu', 'Türkiye İklimi & Bitki Örtüsü', 'Fiziki Özellikler', 'Nüfus & Yerleşme', 'Ekonomik Coğrafya', 'Bölgeler Coğrafyası']
  },
  {
    ders: 'Vatandaşlık',
    soruSayisi: 9,
    konular: ['Temel Hukuk', 'Anayasa ve Devlet Yapısı', '1982 Anayasası İlkeleri', 'Temel Hak & Hürriyetler', 'Yasama Yürütme Yargı', 'İdare Hukuku']
  },
  {
    ders: 'Güncel Bilgi',
    soruSayisi: 6,
    konular: ['Uluslararası Kuruluşlar', 'Güncel Kültürel Olaylar', 'Bilim ve Teknoloji', 'Sanat ve Edebiyat', 'Spor Organizasyonları', 'UNESCO Miras Listesi']
  }
];

export const AGRUBU_SYLLABUS: SyllabusItem[] = [
  { ders: 'İktisat', soruSayisi: 40, konular: ['Mikro İktisat', 'Makro İktisat', 'Para-Banka-Kredi', 'Uluslararası İktisat', 'Kalkınma & Büyüme', 'Türkiye Ekonomisi'] },
  { ders: 'Hukuk', soruSayisi: 40, konular: ['Anayasa Hukuku', 'İdare Hukuku', 'Ceza Hukuku', 'Borçlar Hukuku', 'Medeni Hukuk', 'Ticaret Hukuku', 'İcra-İflas Hukuku'] },
  { ders: 'Maliye', soruSayisi: 40, konular: ['Maliye Teorisi', 'Kamu Harcamaları', 'Kamu Gelirleri', 'Devlet Borçlanması', 'Bütçe', 'Vergi Hukuku'] },
  { ders: 'Kamu Yönetimi', soruSayisi: 40, konular: ['Siyaset Bilimi', 'Anayasa', 'Yönetim Bilimleri', 'Yönetim Hukuku', 'Kentleşme & Çevre', 'Türk Siyasi Hayatı'] },
  { ders: 'Uluslararası İlişkiler', soruSayisi: 40, konular: ['Uluslararası İlişkiler Teorisi', 'Uluslararası Hukuk', 'Siyasi Tarih', 'Türk Dış Politikası'] }
];

export const TOPIC_WEIGHTS: WeightMap = {
  'Paragraf': 3,
  'Problemler': 2,
  'Osmanlı Tarihi': 2,
  'Türkiye Coğrafi Konumu': 2,
  'Anayasa ve Devlet Yapısı': 1.5,
  'Sözel Mantık': 1.5,
  'Sayısal Mantık': 1.5
};
