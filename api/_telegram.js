const MONTHS_UZ = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

const WEEKDAYS_UZ = [
  'yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba',
];

function formatDateUz(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDate();
  const month = MONTHS_UZ[d.getMonth()];
  const weekday = WEEKDAYS_UZ[d.getDay()];
  return `${day}-${month}, ${weekday}`;
}

function formatPrice(n) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

const TELEGRAM_TIMEOUT_MS = 3000;

export async function sendTelegramNotification(booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notification');
    return;
  }

  const text =
    `🆕 Yangi yozilish!\n` +
    `👤 ${booking.name} — ${booking.phone}\n` +
    `💇 ${booking.serviceName} (${formatPrice(booking.price)})\n` +
    `👩‍🎨 Usta: ${booking.masterName}\n` +
    `🕐 ${formatDateUz(booking.date)}, ${booking.time}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('[telegram] API returned error:', data);
    }
  } catch (err) {
    console.error('[telegram] Failed to send notification (or timed out):', err);
  } finally {
    clearTimeout(timer);
  }
}
