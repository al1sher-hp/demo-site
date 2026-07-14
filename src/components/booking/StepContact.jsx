import { useState } from 'react';
import { formatPhoneInput, isValidPhone } from '../../utils/phone.js';

export default function StepContact({ name, phone, onChange, onNext }) {
  const [touched, setTouched] = useState(false);

  function handlePhoneChange(e) {
    onChange({ phone: formatPhoneInput(e.target.value) });
  }

  const nameValid = name.trim().length >= 2;
  const phoneValid = isValidPhone(phone);
  const canContinue = nameValid && phoneValid;

  return (
    <div className="step-contact">
      <label className="form-label">Ismingiz</label>
      <input
        className="form-input"
        type="text"
        placeholder="Ismingizni kiriting"
        value={name}
        onChange={(e) => onChange({ name: e.target.value })}
        onBlur={() => setTouched(true)}
      />
      {touched && !nameValid && <div className="form-error">Ismingizni to'liq kiriting</div>}

      <label className="form-label">Telefon raqam</label>
      <input
        className="form-input"
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={handlePhoneChange}
        onFocus={(e) => {
          if (!e.target.value) onChange({ phone: '+998 ' });
        }}
        onBlur={() => setTouched(true)}
        placeholder="+998 90 123 45 67"
      />
      {touched && !phoneValid && <div className="form-error">Telefon raqamni to'liq kiriting</div>}

      <button className="btn-primary btn-fixed-bottom" disabled={!canContinue} onClick={onNext}>
        Davom etish
      </button>
    </div>
  );
}
