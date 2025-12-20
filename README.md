# KPSS Dijital Koç (PWA)

## Kurulum
```bash
npm install
npm run dev
```

## GitHub Pages Deploy

1. Repoyu oluştur: `kpss-dijital-koc`
2. `.env` oluştur (opsiyonel, base değiştirmek için):
   - `VITE_BASE=/kpss-dijital-koc/`
3. Build:
```bash
npm run build
```
4. `dist/` içeriğini GitHub Pages'e yayınla (Actions önerilir).

Not: Router `basename` otomatik olarak `import.meta.env.BASE_URL` üzerinden ayarlanır.

## GitHub Actions ile otomatik deploy (önerilen)

1. GitHub'da repo adını `kpss-dijital-koc` yap.
2. Repo > Settings > Pages:
   - **Build and deployment**: "GitHub Actions" seç.
3. `main` branch'e push yapınca otomatik olarak build alır ve Pages'e deploy eder.

> Repo adın farklıysa `.github/workflows/deploy.yml` içindeki `VITE_BASE` değerini `/repo-adi/` olacak şekilde güncelle.
