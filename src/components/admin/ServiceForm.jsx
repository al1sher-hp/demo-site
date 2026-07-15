import { useState } from 'react';
import { createService, updateService } from '../../adminApi.js';
import { formatPriceInput, parsePriceInput } from '../../utils/priceInput.js';
import { DURATION_OPTIONS, formatDuration } from '../../utils/duration.js';

export default function ServiceForm({ service, onDone, onCancel }) {
  const isEdit = Boolean(service);
  const [name, setName] = useState(service?.name || '');
  const [priceDisplay, setPriceDisplay] = useState(service ? formatPriceInput(String(service.price)) : '');
  const [durationMin, setDurationMin] = useState(service?.durationMin || 60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handlePriceChange(e) {
    setPriceDisplay(formatPriceInput(e.target.value));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const price = parsePriceInput(priceDisplay);
    if (!name.trim()) {
      setError('Xizmat nomini kiriting');
      return;
    }
    if (!price) {
      setError("Narxni kiriting");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = { name: name.trim(), price, durationMin: Number(durationMin) };
      if (isEdit) {
        await updateService({ id: service.id, active: service.active, ...payload });
      } else {
        await createService(payload);
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
        <div className="admin-form-title">{isEdit ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}</div>
        <div style={{ width: 40 }} />
      </div>

      <label className="form-label">Nomi</label>
      <input
        className="form-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Xizmat nomi"
        autoFocus
      />

      <label className="form-label">Narxi (so'm)</label>
      <input
        className="form-input"
        inputMode="numeric"
        value={priceDisplay}
        onChange={handlePriceChange}
        placeholder="150 000"
      />

      <label className="form-label">Davomiyligi</label>
      <select className="form-input" value={durationMin} onChange={(e) => setDurationMin(e.target.value)}>
        {DURATION_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {formatDuration(m)}
          </option>
        ))}
      </select>

      {error && <div className="form-error">{error}</div>}

      <button className="btn-primary btn-fixed-bottom" type="submit" disabled={submitting}>
        {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
      </button>
    </form>
  );
}
