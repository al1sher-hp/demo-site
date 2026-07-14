import { formatPrice } from '../../utils/format.js';
import { formatDateUzShort } from '../../utils/date.js';

export default function StepConfirm({ service, master, date, time, name, phone, onConfirm, submitting, error }) {
  return (
    <div className="step-confirm">
      <div className="confirm-card">
        <div className="confirm-row">
          <span>Xizmat</span>
          <strong>{service?.name}</strong>
        </div>
        <div className="confirm-row">
          <span>Narx</span>
          <strong>{formatPrice(service?.price || 0)}</strong>
        </div>
        <div className="confirm-row">
          <span>Mutaxassis</span>
          <strong>{master?.name}</strong>
        </div>
        <div className="confirm-row">
          <span>Sana</span>
          <strong>{formatDateUzShort(date)}</strong>
        </div>
        <div className="confirm-row">
          <span>Vaqt</span>
          <strong>{time}</strong>
        </div>
        <div className="confirm-row">
          <span>Ism</span>
          <strong>{name}</strong>
        </div>
        <div className="confirm-row">
          <span>Telefon</span>
          <strong>{phone}</strong>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="btn-primary btn-fixed-bottom" disabled={submitting} onClick={onConfirm}>
        {submitting ? 'Yuborilmoqda...' : 'Yozilishni tasdiqlash'}
      </button>
    </div>
  );
}
