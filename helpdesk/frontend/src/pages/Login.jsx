import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { authed, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  if (authed) return <Navigate to={location.state?.from?.pathname || '/'} replace />;

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.username.trim()) next.username = 'Enter your username.';
    if (!form.password) next.password = 'Enter your password.';
    if (!Object.keys(next).length && !login(form.username.trim(), form.password)) {
      next.general = 'Incorrect username or password.';
    }
    setErrors(next);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={submit} noValidate>
        <h1>IT Helpdesk</h1>
        <p className="muted">Log in to manage service tickets.</p>
        {errors.general && <p className="alert" role="alert">{errors.general}</p>}
        <label className={errors.username ? 'invalid' : ''}>
          Username
          <input value={form.username} onChange={set('username')} autoComplete="username" autoFocus />
          {errors.username && <span className="err">{errors.username}</span>}
        </label>
        <label className={errors.password ? 'invalid' : ''}>
          Password
          <input type="password" value={form.password} onChange={set('password')} autoComplete="current-password" />
          {errors.password && <span className="err">{errors.password}</span>}
        </label>
        <button className="btn primary" type="submit">Log in</button>
      </form>
    </div>
  );
}
