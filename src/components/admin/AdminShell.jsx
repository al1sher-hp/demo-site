import { useCallback, useState } from 'react';
import BookingsTab from './BookingsTab.jsx';
import MastersTab from './MastersTab.jsx';
import ServicesTab from './ServicesTab.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { CalendarIcon, PeopleIcon, ScissorsIcon, CheckCircleIcon } from '../icons/UiIcons.jsx';

const TABS = [
  { key: 'bookings', label: 'Navbatlar', Icon: CalendarIcon },
  { key: 'masters', label: 'Mutaxassislar', Icon: PeopleIcon },
  { key: 'services', label: 'Xizmatlar', Icon: ScissorsIcon },
];

export default function AdminShell({ onLogout }) {
  const [tab, setTab] = useState('bookings');
  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const askConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  function resolveConfirm(result) {
    confirmState?.resolve(result);
    setConfirmState(null);
  }

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
            <t.Icon className="admin-tab-icon" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'bookings' && <BookingsTab showToast={showToast} askConfirm={askConfirm} />}
        {tab === 'masters' && <MastersTab showToast={showToast} askConfirm={askConfirm} />}
        {tab === 'services' && <ServicesTab showToast={showToast} />}
      </div>

      {toast && (
        <div className="admin-toast">
          <CheckCircleIcon className="admin-toast-icon" />
          <span>{toast}</span>
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirmState)}
        title={confirmState?.title}
        body={confirmState?.body || ''}
        confirmLabel={confirmState?.confirmLabel}
        cancelLabel={confirmState?.cancelLabel}
        destructive={confirmState?.destructive}
        onConfirm={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />
    </div>
  );
}
