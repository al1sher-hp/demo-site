import { formatDateUz } from './dateUtil.js';

function formatPrice(n) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

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

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('[telegram] API returned error:', data);
    }
  } catch (err) {
    console.error('[telegram] Failed to send notification:', err);
  }
}
