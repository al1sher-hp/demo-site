import { avatarClassFor } from '../../utils/avatar.js';

export default function StepMaster({ masters, selected, onSelect }) {
  if (masters.length === 0) {
    return <div className="empty-state">Bu xizmat uchun hozircha mutaxassis topilmadi.</div>;
  }

  return (
    <div className="step-master">
      {masters.map((m) => (
        <button
          key={m.id}
          className={`master-card ${selected === m.id ? 'active' : ''}`}
          onClick={() => onSelect(m.id)}
        >
          <div className={`master-avatar ${avatarClassFor(m.id)}`}>{m.name[0]}</div>
          <div className="master-info">
            <div className="master-name">{m.name}</div>
          </div>
          <div className="service-arrow">›</div>
        </button>
      ))}
    </div>
  );
}
