import { useCallback, useState } from 'react';
import BookingsTab from './BookingsTab.jsx';
import MastersTab from './MastersTab.jsx';
import ServicesTab from './ServicesTab.jsx';

const TABS = [
  { key: 'bookings', label: 'Navbatlar', icon: '📅' },
  { key: 'masters', label: 'Mutaxassislar', icon: '👥' },
  { key: 'services', label: 'Xizmatlar', icon: '✂️' },
];

export default function AdminShell({ onLogout }) {
  const [tab, setTab] = useState('bookings');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <div className="admin-app">
      <div className="admin-topbar">
        <div className="admin-topbar-title">Salon boshqaruvi</div>
        <button className="admin-logout-btn" onClick={onLogout}>
          Chiqish
        </button>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`admin-tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span className="admin-tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'bookings' && <BookingsTab showToast={showToast} />}
        {tab === 'masters' && <MastersTab showToast={showToast} />}
        {tab === 'services' && <ServicesTab showToast={showToast} />}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
