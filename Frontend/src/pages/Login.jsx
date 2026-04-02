import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('ALL FIELDS REQUIRED');
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token',  res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'INVALID CREDENTIALS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* animated bg */}
      <div className="auth-bg" />
      <div className="auth-grid" />
      <div className="auth-ghost">PEERSKILL</div>

      <div className="auth-card">

        {/* top label */}
        <div className="auth-kicker">
          <span className="auth-dot" />
          Skill exchange platform
        </div>

        {/* logo */}
        <div className="auth-logo">
          PEER<span>SKILL</span>
        </div>

        <h1 className="auth-title">WELCOME<br />BACK.</h1>
        <p className="auth-sub">Sign in to continue your skill exchange journey.</p>

        <div className="auth-divider" />

        {/* form */}
        <div className="auth-form">

          <div className="field">
            <label className="field-label">EMAIL</label>
            <input
              className="field-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="field-label">PASSWORD</label>
            <input
              className="field-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className={`auth-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>{loading ? 'SIGNING IN...' : 'SIGN IN →'}</span>
          </button>

        </div>

        <div className="auth-footer">
          <span>NO ACCOUNT?</span>
          <Link to="/register" className="auth-link">CREATE ONE →</Link>
        </div>

      </div>
    </div>
  );
}