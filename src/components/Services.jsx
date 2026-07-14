import { useNavigate } from 'react-router-dom';
import { SERVICE_ICONS } from './icons/ServiceIcons.jsx';
import { formatPrice } from '../utils/format.js';

export default function Services({ services }) {
  const navigate = useNavigate();

  return (
    <section className="section" id="xizmatlar">
      <div className="section-inner">
        <div className="section-head">
          <span className="section-eyebrow">Xizmatlar</span>
          <h2 className="section-title">Bizning xizmatlarimiz</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Har bir xizmat yuqori sifat va g'amxo'rlik bilan bajariladi.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-tile" key={s.id}>
              <div className="service-tile-icon">{SERVICE_ICONS[s.id] || SERVICE_ICONS.default}</div>
              <div className="service-tile-name">{s.name}</div>
              <div className="service-tile-price">{formatPrice(s.price)}</div>
              <button
                className="service-tile-cta"
                onClick={() => navigate('/yozilish', { state: { serviceId: s.id } })}
              >
                Yozilish →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
