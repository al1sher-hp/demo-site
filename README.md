# Nilufar Beauty — onlayn yozilish demo

Toshkentdagi xayoliy go'zallik saloni uchun demo sayt: onlayn yozilish oqimi, Telegram xabarnomasi va to'liq admin paneli bilan.

Frontend — Vite + React. Backend — Vercel serverless funksiyalari (`api/`), ma'lumotlar Postgres'da (Neon) saqlanadi.

## O'rnatish

```
npm install
cp .env.example .env
```

`.env` faylini to'ldiring:

- **DATABASE_URL** — Neon loyihangiz dashboardidagi ulanish satri (Connection string). SSL talab qilinadi, Neon buni avtomatik qo'llaydi.
- **TELEGRAM_BOT_TOKEN** va **TELEGRAM_CHAT_ID** — [@BotFather](https://t.me/BotFather) orqali bot yarating, botga bir marta xabar yuboring, so'ng `https://api.telegram.org/bot<token>/getUpdates` orqali `chat.id` ni toping.
- **ADMIN_PASSWORD** — `/admin` paneliga kirish uchun bitta umumiy parol. O'zingiz xohlagan matnni kiriting.

Barcha jadvallar (`services`, `masters`, `master_services`, `master_hours`, `demo_bookings`) birinchi so'rovda avtomatik yaratiladi va boshlang'ich xizmatlar/mutaxassislar bilan to'ldiriladi (faqat jadvallar bo'sh bo'lsa — tahrirlangan ma'lumotlar hech qachon qayta yozilmaydi). Alohida migratsiya kerak emas.

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

Loyihani Vercelga ulang va **Project Settings → Environment Variables** bo'limida to'rtta o'zgaruvchini kiriting: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_PASSWORD`. Build buyrug'i — `npm run build` (Vite), chiqish papkasi — `dist`. `vercel.json` barcha `/api` bo'lmagan yo'nalishlarni `index.html`ga yo'naltiradi, shu sababli `/yozilish` yoki `/admin` sahifasini yangilash ham to'g'ri ishlaydi.

## Marshrutlar

- `/` — bosh sahifa
- `/yozilish` — onlayn yozilish oqimi
- `/admin` — administrator paneli (parol bilan himoyalangan)

## Admin paneli

Parolni kiritgach uchta bo'lim mavjud:

- **Navbatlar** — kunlar bo'yicha yozilishlar ro'yxati, mijoz raqamiga bevosita qo'ng'iroq, bekor qilish
- **Mutaxassislar** — mutaxassis qo'shish/tahrirlash (xizmatlari, haftalik jadvali), ishlamayapti holatiga o'tkazish
- **Xizmatlar** — xizmat qo'shish/tahrirlash (narx, davomiylik), ishlamayapti holatiga o'tkazish

"Ishlamayapti" holatiga o'tkazilgan xizmat/mutaxassis ommaviy saytda ko'rinmaydi, lekin eski yozilishlar saqlanib qoladi (hard delete yo'q).

## Ma'lumotlar bazasi

Postgres'da (Neon) beshta jadval: `services`, `masters`, `master_services`, `master_hours`, `demo_bookings`. `demo_bookings`dagi `(master_id, date, time)` bo'yicha UNIQUE cheklov bir vaqtning ikki marta band qilinishining oldini oladi. Ommaviy saytdagi mavjud vaqtlar har bir mutaxassisning haftalik jadvaliga (`master_hours`) mos ravishda hisoblanadi — dam olish kuni bo'lsa, o'sha kunga vaqt chiqmaydi.
