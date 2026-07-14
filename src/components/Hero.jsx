import { useNavigate } from 'react-router-dom';
import HeroIllustration from './HeroIllustration.jsx';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <HeroIllustration />
      <div className="hero-badge">⭐ 4.9 · 500+ mamnun mijoz</div>
      <h1>
        Go'zallikning <em>yangi</em>
        <br />
        manzili — Toshkentda
      </h1>
      <p className="hero-subtitle">
        Nilufar Beauty salonida professional ustalar, individual yondashuv va yoqimli muhit sizni kutmoqda.
        Navbatga yozilish endi ikki daqiqalik ish.
      </p>
      <div className="hero-actions">
        <button className="btn-primary" onClick={() => navigate('/yozilish')}>
          Onlayn yozilish
        </button>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <strong>5+</strong>
          <span>Xizmat turi</span>
        </div>
        <div className="hero-stat">
          <strong>3</strong>
          <span>Tajribali usta</span>
        </div>
        <div className="hero-stat">
          <strong>09–20</strong>
          <span>Har kuni</span>
        </div>
      </div>
    </section>
  );
}
