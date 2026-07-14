import { useEffect, useState } from 'react';
import { getNext7Days } from '../../utils/date.js';
import { TIME_SLOTS } from '../../utils/slots.js';
import { fetchBookingsForDate } from '../../api.js';

export default function StepDateTime({ masterId, date, time, onChange, onNext, error }) {
  const [days] = useState(getNext7Days);
  const [selectedDate, setSelectedDate] = useState(date || days[0].date);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!masterId || !selectedDate) return;
    let cancelled = false;
    setLoadingSlots(true);
    setLoadError(false);
    fetchBookingsForDate(selectedDate)
      .then((bookings) => {
        if (cancelled) return;
        const bookedTimes = new Set(
          bookings.filter((b) => b.masterId === masterId).map((b) => b.time),
        );
        setSlots(TIME_SLOTS.map((t) => ({ time: t, booked: bookedTimes.has(t) })));
        setLoadingSlots(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [masterId, selectedDate]);

  function handleDateClick(d) {
    setSelectedDate(d);
    onChange({ date: d, time: null });
  }

  function handleTimeClick(t) {
    onChange({ date: selectedDate, time: t });
  }

  const now = new Date();
  const isToday = selectedDate === days[0].date;

  function isPast(slotTime) {
    if (!isToday) return false;
    const [h] = slotTime.split(':').map(Number);
    return h <= now.getHours();
  }

  return (
    <div className="step-datetime">
      <div className="date-picker-row">
        {days.map((d) => (
          <button
            key={d.date}
            className={`date-chip ${selectedDate === d.date ? 'active' : ''}`}
            onClick={() => handleDateClick(d.date)}
          >
            <span className="date-chip-weekday">{d.isToday ? 'Bugun' : d.weekdayShort}</span>
            <span className="date-chip-num">{d.dayNum}</span>
            <span className="date-chip-month">{d.monthName}</span>
          </button>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="slots-grid">
        {loadError ? (
          <div className="slots-loading">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>
        ) : loadingSlots ? (
          <div className="slots-loading">Yuklanmoqda...</div>
        ) : (
          slots.map((s) => {
            const disabled = s.booked || isPast(s.time);
            return (
              <button
                key={s.time}
                className={`slot-btn ${time === s.time ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                disabled={disabled}
                onClick={() => handleTimeClick(s.time)}
              >
                {s.time}
              </button>
            );
          })
        )}
      </div>

      <button className="btn-primary btn-fixed-bottom" disabled={!selectedDate || !time} onClick={onNext}>
        Davom etish
      </button>
    </div>
  );
}
