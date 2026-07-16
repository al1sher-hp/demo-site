import { formatDateUzShort } from '../../utils/date.js';
import SuccessCheckIcon from '../icons/SuccessCheckIcon.jsx';
import { SendIcon } from '../icons/UiIcons.jsx';

export default function StepSuccess({ service, master, date, time, onDone }) {
  return (
    <div className="step-success">
      <SuccessCheckIcon />
      <h1>Bo'ldi! Siz navbatga yozildingiz</h1>
      <p>Salon administratori siz bilan bog'lanadi.</p>
      <div className="success-details">
        <div>
          {service?.name} — {master?.name}
        </div>
        <div>
          {formatDateUzShort(date)}, {time}
        </div>
      </div>
      <div className="success-note">
        <SendIcon className="success-note-icon" />
        Egasiga hozirgina Telegram'da xabar bordi
      </div>
      <button className="btn-primary" onClick={onDone}>
        Bosh sahifaga qaytish
      </button>
    </div>
  );
}
