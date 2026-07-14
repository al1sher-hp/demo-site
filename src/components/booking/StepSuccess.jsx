import { formatDateUzShort } from '../../utils/date.js';

export default function StepSuccess({ service, master, date, time, onDone }) {
  return (
    <div className="step-success">
      <div className="success-icon">✅</div>
      <h1>Siz yozildingiz!</h1>
      <p>Salon administratori siz bilan bog'lanadi.</p>
      <div className="success-details">
        <div>
          {service?.name} — {master?.name}
        </div>
        <div>
          {formatDateUzShort(date)}, {time}
        </div>
      </div>
      <div className="success-note">📩 Egasiga hozirgina Telegram'da xabar bordi</div>
      <button className="btn-primary" onClick={onDone}>
        Bosh sahifaga qaytish
      </button>
    </div>
  );
}
