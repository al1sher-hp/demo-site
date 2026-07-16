import { SERVICE_ICONS } from '../icons/ServiceIcons.jsx';
import { formatPrice } from '../../utils/format.js';

export default function StepService({ services, selected, onSelect }) {
  return (
    <div className="step-service">
      {services.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`service-card ${selected === s.id ? 'active' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          <div className="service-icon">{SERVICE_ICONS[s.id] || SERVICE_ICONS.default}</div>
          <div className="service-info">
            <div className="service-name">{s.name}</div>
            <div className="service-price">{formatPrice(s.price)}</div>
          </div>
          <div className="service-arrow">›</div>
        </button>
      ))}
    </div>
  );
}
