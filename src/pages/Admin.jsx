import { useEffect, useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import AdminShell from '../components/admin/AdminShell.jsx';
import { checkAuth, login as loginRequest, logout as logoutRequest } from '../adminApi.js';

export default function Admin() {
  const [status, setStatus] = useState('checking');
  const [checkError, setCheckError] = useState(false);

  useEffect(() => {
    checkAuth()
      .then((data) => setStatus(data.authenticated ? 'authed' : 'anon'))
      .catch(() => setCheckError(true));
  }, []);

  async function handleLogin(password) {
    await loginRequest(password);
    setStatus('authed');
  }

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch {
      // still drop to the login screen locally even if the request fails
    }
    setStatus('anon');
  }

  if (checkError) {
    return <div className="admin-loading">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>;
  }
  if (status === 'checking') {
    return <div className="admin-loading">Yuklanmoqda...</div>;
  }
  if (status === 'anon') {
    return <AdminLogin onLogin={handleLogin} />;
  }
  return <AdminShell onLogout={handleLogout} />;
}
