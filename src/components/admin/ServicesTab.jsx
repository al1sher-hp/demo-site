import { useCallback, useEffect, useState } from 'react';
import ServiceForm from './ServiceForm.jsx';
import { fetchAdminServices, toggleServiceActive } from '../../adminApi.js';
import { formatPrice } from '../../utils/format.js';
import { formatDuration } from '../../utils/duration.js';

export default function ServicesTab({ showToast }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    fetchAdminServices()
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleActive(service) {
    try {
      await toggleServiceActive(service.id, !service.active);
      showToast(service.active ? "O'chirildi ✓" : 'Yoqildi ✓');
      load();
    } catch {
      showToast("Bajarilmadi, qayta urinib ko'ring");
    }
  }

  if (editing) {
    return (
      <ServiceForm
        service={editing === 'new' ? null : editing}
        onDone={() => {
          setEditing(null);
          load();
          showToast('Saqlandi ✓');
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="tab-services">
      <button className="btn-primary admin-add-btn" onClick={() => setEditing('new')}>
        + Xizmat qo'shish
      </button>

      {loadError ? (
        <div className="admin-empty">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>
      ) : loading ? (
        <div className="admin-empty">Yuklanmoqda...</div>
      ) : services.length === 0 ? (
        <div className="admin-empty">Hali xizmat qo'shilmagan. Yuqoridagi tugma orqali qo'shing.</div>
      ) : (
        <div className="admin-card-list">
          {services.map((s) => (
            <div className={`admin-entity-card ${s.active ? '' : 'inactive'}`} key={s.id}>
              <button className="admin-entity-main" onClick={() => setEditing(s)}>
                <div className="admin-entity-details">
                  <div className="admin-entity-name">
                    {s.name}
                    {!s.active && <span className="admin-inactive-badge">Ishlamayapti</span>}
                  </div>
                  <div className="admin-entity-meta">
                    {formatPrice(s.price)} · {formatDuration(s.durationMin)}
                  </div>
                </div>
              </button>
              <label className="admin-toggle">
                <input type="checkbox" checked={s.active} onChange={() => handleToggleActive(s)} />
                <span className="admin-toggle-track">
                  <span className="admin-toggle-thumb" />
                </span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
