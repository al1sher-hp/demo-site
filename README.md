# Nilufar Beauty — onlayn yozilish demo

Toshkentdagi xayoliy go'zallik saloni uchun demo sayt: onlayn yozilish oqimi va Telegram xabarnomasi bilan.

Frontend — Vite + React. Backend — Vercel serverless funksiyalari (`api/`), ma'lumotlar Postgres'da (Neon) saqlanadi.

## O'rnatish

```
npm install
cp .env.example .env
```

`.env` faylini to'ldiring:

- **DATABASE_URL** — Neon loyihangiz dashboardidagi ulanish satri (Connection string). SSL talab qilinadi, Neon buni avtomatik qo'llaydi.
- **TELEGRAM_BOT_TOKEN** va **TELEGRAM_CHAT_ID** — [@BotFather](https://t.me/BotFather) orqali bot yarating, botga bir marta xabar yuboring, so'ng `https://api.telegram.org/bot<token>/getUpdates` orqali `chat.id` ni toping.

Jadval (`demo_bookings`) birinchi so'rovda avtomatik yaratiladi — alohida migratsiya kerak emas.

## Lokal ishga tushirish

Loyiha Vercel serverless funksiyalaridan foydalangani uchun lokal rivojlantirish `vercel dev` orqali amalga oshiriladi:

```
npm i -g vercel   # global CLI (bir marta)
vercel login      # bir marta
vercel link       # loyihani ushbu papkaga bog'lash (bir marta)
npm run dev
```

`vercel dev` bitta manzilda (odatda http://localhost:3000) ham frontendni, ham `/api/*` funksiyalarini ishga tushiradi va `.env` faylini avtomatik o'qiydi.

## Production (Vercel)

Loyihani Vercelga ulang va **Project Settings → Environment Variables** bo'limida uchta o'zgaruvchini kiriting: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Build buyrug'i — `npm run build` (Vite), chiqish papkasi — `dist`. `vercel.json` barcha `/api` bo'lmagan yo'nalishlarni `index.html`ga yo'naltiradi, shu sababli `/yozilish` yoki `/admin` sahifasini yangilash ham to'g'ri ishlaydi.

## Marshrutlar

- `/` — bosh sahifa
- `/yozilish` — onlayn yozilish oqimi
- `/admin` — bugungi yozilishlar ro'yxati (autentifikatsiyasiz, faqat demo uchun)

## Ma'lumotlar bazasi

Yozilishlar Postgres'dagi (Neon) `demo_bookings` jadvalida saqlanadi. `(master_id, date, time)` bo'yicha UNIQUE cheklov bir vaqtning ikki marta band qilinishining oldini oladi.
