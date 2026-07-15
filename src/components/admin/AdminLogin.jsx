import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onLogin(password);
    } catch (err) {
      setError(err.message || "Parol noto'g'ri");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-mark">N</div>
        <h1>Salon boshqaruvi</h1>
        <p>Davom etish uchun parolni kiriting</p>
        <input
          type="password"
          className="form-input"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <div className="form-error">{error}</div>}
        <button className="btn-primary" type="submit" disabled={submitting || !password}>
          {submitting ? 'Tekshirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
