import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Auth.css';

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Figma', 'UI/UX', 'MongoDB', 'Flutter', 'ML / AI',
  'Java', 'C++', 'DevOps', 'Docker', 'GraphQL',
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    skillsOffered: [], skillsWanted: [],
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleSkill = (skill, field) => {
    const list = form[field];
    setForm({
      ...form,
      [field]: list.includes(skill)
        ? list.filter(s => s !== skill)
        : [...list, skill],
    });
  };

  const handleSubmit = async () => {
    const { name, email, password, skillsOffered, skillsWanted } = form;
    if (!name || !email || !password) { setError('ALL FIELDS REQUIRED'); return; }
    if (skillsOffered.length === 0)   { setError('SELECT AT LEAST 1 SKILL TO TEACH'); return; }
    if (skillsWanted.length === 0)    { setError('SELECT AT LEAST 1 SKILL TO LEARN'); return; }
    try {
      setLoading(true);
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token',  res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'REGISTRATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-grid" />
      <div className="auth-ghost">PEERSKILL</div>

      <div className="auth-card auth-card--wide">

        <div className="auth-kicker">
          <span className="auth-dot" />
          Skill exchange platform
        </div>

        <div className="auth-logo">PEER<span>SKILL</span></div>

        <h1 className="auth-title">JOIN THE<br />EXCHANGE.</h1>
        <p className="auth-sub">Create your account and start swapping skills today.</p>

        <div className="auth-divider" />

        <div className="auth-form">

          {/* row */}
          <div className="field-row">
            <div className="field">
              <label className="field-label">FULL NAME</label>
              <input className="field-input" type="text" name="name"
                placeholder="Soumya Dash" value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label className="field-label">EMAIL</label>
              <input className="field-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">PASSWORD</label>
            <input className="field-input" type="password" name="password"
              placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>

          {/* skills to teach */}
          <div className="field">
            <label className="field-label">
              SKILLS YOU TEACH
              <span className="field-count">{form.skillsOffered.length} selected</span>
            </label>
            <div className="skill-grid">
              {SKILL_OPTIONS.map(s => (
                <button
                  key={s}
                  className={`skill-tag ${form.skillsOffered.includes(s) ? 'skill-tag--on' : ''}`}
                  onClick={() => toggleSkill(s, 'skillsOffered')}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* skills to learn */}
          <div className="field">
            <label className="field-label">
              SKILLS YOU WANT
              <span className="field-count">{form.skillsWanted.length} selected</span>
            </label>
            <div className="skill-grid">
              {SKILL_OPTIONS.map(s => (
                <button
                  key={s}
                  className={`skill-tag ${form.skillsWanted.includes(s) ? 'skill-tag--on skill-tag--learn' : ''}`}
                  onClick={() => toggleSkill(s, 'skillsWanted')}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className={`auth-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}</span>
          </button>

        </div>

        <div className="auth-footer">
          <span>ALREADY HAVE AN ACCOUNT?</span>
          <Link to="/login" className="auth-link">SIGN IN →</Link>
        </div>

      </div>
    </div>
  );
}