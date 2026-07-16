import { avatarClassFor } from '../../utils/avatar.js';
import { StarIcon } from '../icons/UiIcons.jsx';

export default function StepMaster({ masters, selected, onSelect }) {
  if (masters.length === 0) {
    return <div className="empty-state">Bu xizmat uchun hozircha mutaxassis topilmadi.</div>;
  }

  return (
    <div className="step-master">
      {masters.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`master-card ${selected === m.id ? 'active' : ''}`}
          onClick={() => onSelect(m.id)}
        >
          <div className={`master-avatar ${avatarClassFor(m.id)}`}>{m.name[0]}</div>
          <div className="master-info">
            <div className="master-name">{m.name}</div>
            {typeof m.rating === 'number' && (
              <div className="master-rating">
                <StarIcon className="master-rating-icon" />
                {m.rating.toFixed(1)}
              </div>
            )}
          </div>
          <div className="service-arrow">›</div>
        </button>
      ))}
    </div>
  );
}
