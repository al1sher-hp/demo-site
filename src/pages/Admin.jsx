import { useEffect, useState, useCallback } from 'react';
import { fetchTodayBookings } from '../api.js';
import { formatPrice } from '../utils/format.js';

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetchTodayBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div className="admin-title">Bugungi yozilishlar</div>
        <span className="admin-badge">Administrator paneli (demo)</span>
      </div>
      <button className="admin-refresh" onClick={load}>
        ⟳ Yangilash
      </button>

      {loading ? (
        <div className="admin-empty">Yuklanmoqda...</div>
      ) : bookings.length === 0 ? (
        <div className="admin-empty">Bugun uchun hali yozilishlar yo'q.</div>
      ) : (
        <div className="admin-list">
          {bookings.map((b) => (
            <div className="admin-row" key={b.id}>
              <div className="admin-row-time">{b.time}</div>
              <div className="admin-row-body">
                <div className="admin-row-name">
                  {b.name} — {b.phone}
                </div>
                <div className="admin-row-meta">
                  {b.serviceName} ({formatPrice(b.price)}) · Usta: {b.masterName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
