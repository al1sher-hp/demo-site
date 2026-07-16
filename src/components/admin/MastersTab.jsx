import { useCallback, useEffect, useState } from 'react';
import MasterForm from './MasterForm.jsx';
import { fetchAdminMasters, fetchAdminServices, toggleMasterActive } from '../../adminApi.js';
import { workdaysSummary } from '../../utils/schedule.js';
import { avatarClassFor } from '../../utils/avatar.js';

export default function MastersTab({ showToast, askConfirm }) {
  const [masters, setMasters] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    Promise.all([fetchAdminMasters(), fetchAdminServices()])
      .then(([m, s]) => {
        setMasters(m);
        setServices(s);
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

  function serviceNames(master) {
    return master.serviceIds.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean);
  }

  async function handleToggleActive(master) {
    if (master.active) {
      const ok = await askConfirm({
        body: "Mutaxassis yangi navbatlarda ko'rinmaydi, eski navbatlari saqlanadi. Davom etasizmi?",
      });
      if (!ok) return;
    }
    try {
      await toggleMasterActive(master.id, !master.active);
      showToast(master.active ? "O'chirildi" : 'Yoqildi');
      load();
    } catch {
      showToast("Bajarilmadi, qayta urinib ko'ring");
    }
  }

  if (editing) {
    return (
      <MasterForm
        master={editing === 'new' ? null : editing}
        services={services}
        onDone={() => {
          setEditing(null);
          load();
          showToast('Saqlandi');
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="tab-masters">
      <button className="btn-primary admin-add-btn" onClick={() => setEditing('new')}>
        + Mutaxassis qo'shish
      </button>

      {loadError ? (
        <div className="admin-empty">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>
      ) : loading ? (
        <div className="admin-empty">Yuklanmoqda...</div>
      ) : masters.length === 0 ? (
        <div className="admin-empty">Hali mutaxassis qo'shilmagan. Yuqoridagi tugma orqali qo'shing.</div>
      ) : (
        <div className="admin-card-list">
          {masters.map((m) => (
            <div className={`admin-entity-card ${m.active ? '' : 'inactive'}`} key={m.id}>
              <button className="admin-entity-main" onClick={() => setEditing(m)}>
                <div className={`admin-entity-avatar ${avatarClassFor(m.id)}`}>{m.name[0]}</div>
                <div className="admin-entity-details">
                  <div className="admin-entity-name">
                    {m.name}
                    {!m.active && <span className="admin-inactive-badge">Ishlamayapti</span>}
                  </div>
                  <div className="admin-chip-row">
                    {serviceNames(m).map((name) => (
                      <span className="admin-chip" key={name}>
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="admin-entity-meta">{workdaysSummary(m.hours)}</div>
                </div>
              </button>
              <label className="admin-toggle">
                <input type="checkbox" checked={m.active} onChange={() => handleToggleActive(m)} />
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
