import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark">N</span>
        Nilufar Beauty
      </div>
      <button className="header-cta" onClick={() => navigate('/yozilish')}>
        Yozilish
      </button>
    </header>
  );
}
