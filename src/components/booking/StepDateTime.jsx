import { useEffect, useState } from 'react';
import { getNext7Days, formatDateUzShort, getTashkentMinutesNow } from '../../utils/date.js';
import { generateSlots } from '../../utils/slots.js';
import { fetchBookingsForDate } from '../../api.js';

const PAST_BUFFER_MINUTES = 30;

export default function StepDateTime({ master, date, time, onChange, onNext, error }) {
  const [days] = useState(getNext7Days);
  const [selectedDate, setSelectedDate] = useState(date || days[0].date);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const weekday = new Date(`${selectedDate}T00:00:00`).getDay();
  const todaysHours = master?.hours?.find((h) => h.weekday === weekday);
  const isDayOff = !todaysHours || todaysHours.isDayOff;

  useEffect(() => {
    if (!master?.id || !selectedDate || isDayOff) {
      setSlots([]);
      setLoadingSlots(false);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setLoadError(false);
    fetchBookingsForDate(selectedDate)
      .then((bookings) => {
        if (cancelled) return;
        const bookedTimes = new Set(
          bookings.filter((b) => b.masterId === master.id).map((b) => b.time),
        );
        const timeSlots = generateSlots(todaysHours.startTime, todaysHours.endTime);
        setSlots(timeSlots.map((t) => ({ time: t, booked: bookedTimes.has(t) })));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [master?.id, selectedDate, isDayOff]);

  function handleDateClick(d) {
    setSelectedDate(d);
    onChange({ date: d, time: null });
  }

  function handleTimeClick(t) {
    onChange({ date: selectedDate, time: t });
  }

  const isToday = selectedDate === days[0].date;
  const nowMinutes = getTashkentMinutesNow();

  function isPast(slotTime) {
    if (!isToday) return false;
    const [h, m] = slotTime.split(':').map(Number);
    return h * 60 + m < nowMinutes + PAST_BUFFER_MINUTES;
  }

  const canContinue = Boolean(selectedDate && time);

  return (
    <div className="step-datetime">
      <div className="date-picker-row">
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            className={`date-chip ${selectedDate === d.date ? 'active' : ''}`}
            onClick={() => handleDateClick(d.date)}
            aria-label={formatDateUzShort(d.date)}
            aria-pressed={selectedDate === d.date}
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
        ) : isDayOff ? (
          <div className="slots-loading">Bu kuni dam olish kuni</div>
        ) : loadingSlots ? (
          <div className="slots-loading">Yuklanmoqda...</div>
        ) : (
          slots.map((s) => {
            const disabled = s.booked || isPast(s.time);
            return (
              <button
                key={s.time}
                type="button"
                className={`slot-btn ${time === s.time ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                disabled={disabled}
                aria-disabled={disabled}
                onClick={() => handleTimeClick(s.time)}
              >
                {s.time}
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        className="btn-primary btn-fixed-bottom"
        disabled={!canContinue}
        aria-disabled={!canContinue}
        onClick={onNext}
      >
        Davom etish
      </button>
    </div>
  );
}
