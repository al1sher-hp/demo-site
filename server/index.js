import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { services, masters, getTimeSlots } from './data.js';
import { getBookingsForMasterDate, addBooking, getTodayBookings, isSlotTaken } from './store.js';
import { sendTelegramNotification } from './telegram.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/masters', (req, res) => {
  res.json(masters);
});

app.get('/api/slots', (req, res) => {
  const { masterId, date } = req.query;
  const allSlots = getTimeSlots();

  if (!masterId || !date) {
    return res.json(allSlots.map((time) => ({ time, booked: false })));
  }

  const bookedTimes = getBookingsForMasterDate(masterId, date).map((b) => b.time);
  res.json(allSlots.map((time) => ({ time, booked: bookedTimes.includes(time) })));
});

app.post('/api/bookings', async (req, res) => {
  const { serviceId, masterId, date, time, name, phone } = req.body || {};

  if (!serviceId || !masterId || !date || !time || !name || !phone) {
    return res.status(400).json({ error: "Ma'lumotlar to'liq emas" });
  }

  const service = services.find((s) => s.id === serviceId);
  const master = masters.find((m) => m.id === masterId);

  if (!service || !master || !master.services.includes(serviceId)) {
    return res.status(400).json({ error: "Noto'g'ri xizmat yoki usta tanlandi" });
  }

  if (isSlotTaken(masterId, date, time)) {
    return res.status(409).json({ error: 'Kechirasiz, bu vaqt band qilindi. Boshqa vaqtni tanlang.' });
  }

  const booking = addBooking({
    serviceId,
    masterId,
    date,
    time,
    name: String(name).trim(),
    phone: String(phone).trim(),
    serviceName: service.name,
    masterName: master.name,
    price: service.price,
  });

  try {
    await sendTelegramNotification(booking);
  } catch (err) {
    console.error('[bookings] Telegram notification threw unexpectedly:', err);
  }

  res.json({ success: true, booking });
});

app.get('/api/bookings/today', (req, res) => {
  res.json(getTodayBookings());
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Nilufar Beauty server ishga tushdi: http://localhost:${PORT}`);
});
