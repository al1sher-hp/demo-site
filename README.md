# Nilufar Beauty — onlayn yozilish demo

Fictional Tashkent beauty salon demo with a live booking flow and Telegram notifications.

## Setup

```
npm install
cp .env.example .env
```

Fill in `.env` with a bot token and chat id from [@BotFather](https://t.me/BotFather) (create a bot, then message it once and use `https://api.telegram.org/bot<token>/getUpdates` to find your chat id).

## Run

```
npm run dev
```

Frontend: http://localhost:5173 (proxies `/api` to the Express server)
Backend: http://localhost:3001

## Production

```
npm run build
npm run start
```

Single Node process on port 3001 (or `PORT` env var) serves both the built frontend and the API.

## Routes

- `/` — landing page
- `/yozilish` — booking wizard
- `/admin` — today's bookings (no auth, demo only)

## Storage

Bookings persist to `server/bookings.json` (gitignored). Delete/reset it to clear the demo calendar.
