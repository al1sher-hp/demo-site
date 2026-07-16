import { useCallback, useEffect, useRef, useState } from 'react';
import { getDayRange, todayIso, formatDateUzShort } from '../../utils/date.js';
import { formatPrice } from '../../utils/format.js';
import { fetchAdminBookings, cancelBooking } from '../../adminApi.js';

const DAYS = getDayRange(-7, 14);

export default function BookingsTab({ showToast, askConfirm }) {
  const today = todayIso();
  const [selectedDate, setSelectedDate] = useState(today);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestRef = useRef({ id: 0, date: null });

  const load = useCallback((date) => {
    const requestId = ++requestRef.current.id;
    requestRef.current.date = date;
    setLoading(true);
    setLoadError(false);
    fetchAdminBookings(date)
      .then((data) => {
        if (requestRef.current.id !== requestId) return;
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        if (requestRef.current.id !== requestId) return;
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load(selectedDate);
  }, [selectedDate, load]);

  useEffect(() => {
    function onFocus() {
      load(selectedDate);
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [selectedDate, load]);

  async function handleCancel(booking) {
    const ok = await askConfirm({
      title: 'Navbatni bekor qilasizmi?',
      body: "Bu amalni qaytarib bo'lmaydi. Mijozning navbati o'chiriladi va vaqt yana bo'sh bo'ladi.",
      confirmLabel: 'Ha, bekor qilish',
      cancelLabel: 'Ortga',
      destructive: true,
    });
    if (!ok) return;
    try {
      await cancelBooking(booking.id);
      setBookings((list) => list.filter((b) => b.id !== booking.id));
      showToast('Bekor qilindi');
    } catch {
      showToast("Bekor qilib bo'lmadi, qayta urinib ko'ring");
    }
  }

  const total = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const dayLabel = selectedDate === today ? 'Bugun' : formatDateUzShort(selectedDate);

  return (
    <div className="tab-bookings">
      <div className="admin-day-strip">
        {DAYS.map((d) => (
          <button
            key={d.date}
            className={`admin-day-chip ${selectedDate === d.date ? 'active' : ''}`}
            onClick={() => setSelectedDate(d.date)}
            aria-label={formatDateUzShort(d.date)}
            aria-pressed={selectedDate === d.date}
          >
            <span className="admin-day-chip-weekday">{d.isToday ? 'Bugun' : d.weekdayShort}</span>
            <span className="admin-day-chip-num">{d.dayNum}</span>
            <span className="admin-day-chip-month">{d.monthName}</span>
          </button>
        ))}
      </div>

      {loadError ? (
        <div className="admin-empty">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>
      ) : loading ? (
        <div className="admin-empty">Yuklanmoqda...</div>
      ) : bookings.length === 0 ? (
        <div className="admin-empty">Bu kunga hali navbat yo'q</div>
      ) : (
        <>
          <div className="admin-summary">
            {dayLabel}: {bookings.length} ta navbat · {formatPrice(total)}
          </div>
          <div className="admin-booking-list">
            {bookings.map((b) => (
              <div className="admin-booking-card" key={b.id}>
                <div className="admin-booking-time">{b.time}</div>
                <div className="admin-booking-body">
                  <div className="admin-booking-name">{b.name}</div>
                  <a className="admin-booking-phone" href={`tel:${b.phone.replace(/\s+/g, '')}`}>
                    {b.phone}
                  </a>
                  <div className="admin-booking-meta">
                    {b.serviceName} · {b.masterName} · {formatPrice(b.price)}
                  </div>
                </div>
                <button className="admin-cancel-btn" onClick={() => handleCancel(b)}>
                  Bekor qilish
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
