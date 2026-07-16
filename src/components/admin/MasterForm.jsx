import { useState } from 'react';
import { createMaster, updateMaster } from '../../adminApi.js';
import { TIME_OPTIONS } from '../../utils/time.js';

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAY_LABEL = {
  0: 'Yakshanba',
  1: 'Dushanba',
  2: 'Seshanba',
  3: 'Chorshanba',
  4: 'Payshanba',
  5: 'Juma',
  6: 'Shanba',
};

function defaultHours() {
  return Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    isDayOff: false,
    startTime: '09:00',
    endTime: '20:00',
  }));
}

function hoursFromMaster(master) {
  if (!master) return defaultHours();
  return Array.from({ length: 7 }, (_, weekday) => {
    const existing = master.hours.find((h) => h.weekday === weekday);
    return existing || { weekday, isDayOff: true, startTime: '09:00', endTime: '20:00' };
  });
}

export default function MasterForm({ master, services, onDone, onCancel }) {
  const isEdit = Boolean(master);
  const [name, setName] = useState(master?.name || '');
  const [rating, setRating] = useState(master?.rating ?? 4.9);
  const [serviceIds, setServiceIds] = useState(master?.serviceIds || []);
  const [hours, setHours] = useState(() => hoursFromMaster(master));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const activeServices = services.filter((s) => s.active);

  function toggleService(id) {
    setServiceIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  function updateHour(weekday, fields) {
    setHours((list) => list.map((h) => (h.weekday === weekday ? { ...h, ...fields } : h)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Ismni kiriting');
      return;
    }

    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      setError('Reytingni 0 dan 5 gacha kiriting');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = { name: name.trim(), rating: parsedRating, serviceIds, hours };
      if (isEdit) {
        await updateMaster({ id: master.id, active: master.active, ...payload });
      } else {
        await createMaster(payload);
      }
      onDone();
    } catch (err) {
      setError(err.message || "Saqlab bo'lmadi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-header">
        <button type="button" className="icon-btn" onClick={onCancel} aria-label="Orqaga">
          ←
        </button>
        <div className="admin-form-title">{isEdit ? 'Mutaxassisni tahrirlash' : 'Yangi mutaxassis'}</div>
        <div style={{ width: 40 }} />
      </div>

      <label className="form-label">Ismi</label>
      <input
        className="form-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ism"
        autoFocus
      />

      <label className="form-label">Reyting</label>
      <input
        className="form-input"
        type="number"
        inputMode="decimal"
        min="0"
        max="5"
        step="0.1"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="4.9"
      />

      <label className="form-label">Xizmatlari</label>
      <div className="admin-checkbox-list">
        {activeServices.length === 0 && (
          <div className="admin-empty-inline">Avval Xizmatlar bo'limida xizmat qo'shing</div>
        )}
        {activeServices.map((s) => (
          <label className="admin-checkbox-row" key={s.id}>
            <input
              type="checkbox"
              checked={serviceIds.includes(s.id)}
              onChange={() => toggleService(s.id)}
            />
            {s.name}
          </label>
        ))}
      </div>

      <label className="form-label">Haftalik jadval</label>
      <div className="admin-schedule">
        {WEEKDAY_ORDER.map((weekday) => {
          const h = hours.find((x) => x.weekday === weekday);
          return (
            <div className="admin-schedule-row" key={weekday}>
              <span className="admin-schedule-day">{WEEKDAY_LABEL[weekday]}</span>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={!h.isDayOff}
                  onChange={(e) => updateHour(weekday, { isDayOff: !e.target.checked })}
                />
                <span className="admin-toggle-track">
                  <span className="admin-toggle-thumb" />
                </span>
              </label>
              {h.isDayOff ? (
                <span className="admin-schedule-off">Dam olish</span>
              ) : (
                <div className="admin-schedule-time">
                  <select value={h.startTime} onChange={(e) => updateHour(weekday, { startTime: e.target.value })}>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span>–</span>
                  <select value={h.endTime} onChange={(e) => updateHour(weekday, { endTime: e.target.value })}>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <div className="form-error">{error}</div>}

      <button className="btn-primary btn-fixed-bottom" type="submit" disabled={submitting}>
        {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
      </button>
    </form>
  );
}
