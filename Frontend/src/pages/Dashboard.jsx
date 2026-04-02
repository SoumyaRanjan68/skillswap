import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [stats,   setStats]   = useState({ sent: 0, swaps: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, sentRes, acceptedRes] = await Promise.all([
          API.get('/user/profile'),
          API.get('/request/sent'),
          API.get('/request/accepted'),
        ]);
        setUser(profileRes.data);
        setStats({
          sent:  sentRes.data.length,
          swaps: acceptedRes.data.length,
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) return (
    <div className="db-loading">
      <div className="db-loading-dot" />
      <span>LOADING...</span>
    </div>
  );

  if (error) return (
    <div className="db-loading">
      <span className="db-err">{error}</span>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="db-bg" />
      <div className="db-grid" />
      <div className="db-wrap">

        <div className="db-top">
          <div className="db-kicker"><span className="db-dot" />YOUR PROFILE</div>
          <button className="db-logout" onClick={handleLogout}>LOGOUT →</button>
        </div>

        <div className="db-hero-card">
          <div className="db-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div className="db-hero-info">
            <h1 className="db-name">{user.name?.toUpperCase()}</h1>
            <p className="db-email">{user.email}</p>
            <div className="db-badge-row">
              <span className="db-badge">{user.skillsOffered?.length || 0} SKILLS TEACHING</span>
              <span className="db-badge db-badge--want">{user.skillsWanted?.length || 0} SKILLS LEARNING</span>
            </div>
          </div>
          <div className="db-hero-action">
            <button className="db-cta" onClick={() => navigate('/matches')}>
              <span>FIND MATCHES →</span>
            </button>
          </div>
        </div>

        <div className="db-stats">
          {[
            { num: user.skillsOffered?.length || 0, label: 'Skills offered' },
            { num: user.skillsWanted?.length  || 0, label: 'Skills wanted'  },
            { num: stats.sent,                       label: 'Requests sent'  },
            { num: stats.swaps,                      label: 'Swaps done'     },
          ].map((s, i) => (
            <div key={i} className="db-stat">
              <div className="db-stat-num">{s.num}</div>
              <div className="db-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="db-skills-grid">
          <div className="db-skills-card">
            <div className="db-skills-header">
              <div className="db-skills-title">SKILLS I TEACH</div>
              <div className="db-skills-count">{user.skillsOffered?.length || 0}</div>
            </div>
            <div className="db-skills-list">
              {user.skillsOffered?.length > 0
                ? user.skillsOffered.map((s, i) => (
                    <div key={i} className="db-skill-tag db-skill-tag--teach">
                      <span className="db-skill-dot" />{s}
                    </div>
                  ))
                : <p className="db-empty">No skills added yet</p>
              }
            </div>
          </div>
          <div className="db-skills-card">
            <div className="db-skills-header">
              <div className="db-skills-title">SKILLS I WANT</div>
              <div className="db-skills-count db-skills-count--want">{user.skillsWanted?.length || 0}</div>
            </div>
            <div className="db-skills-list">
              {user.skillsWanted?.length > 0
                ? user.skillsWanted.map((s, i) => (
                    <div key={i} className="db-skill-tag db-skill-tag--want">
                      <span className="db-skill-dot db-skill-dot--want" />{s}
                    </div>
                  ))
                : <p className="db-empty">No skills added yet</p>
              }
            </div>
          </div>
        </div>

        <div className="db-actions">
          <button className="db-action-btn" onClick={() => navigate('/matches')}>
            <div className="db-action-num">01</div>
            <div className="db-action-body">
              <div className="db-action-title">FIND PEERS</div>
              <div className="db-action-sub">Browse matching users</div>
            </div>
            <div className="db-action-arr">→</div>
          </button>
          <button className="db-action-btn" onClick={() => navigate('/requests')}>
            <div className="db-action-num">02</div>
            <div className="db-action-body">
              <div className="db-action-title">REQUESTS</div>
              <div className="db-action-sub">Accept or reject incoming</div>
            </div>
            <div className="db-action-arr">→</div>
          </button>
          <button className="db-action-btn" onClick={() => navigate('/chat')}>
            <div className="db-action-num">03</div>
            <div className="db-action-body">
              <div className="db-action-title">CHAT</div>
              <div className="db-action-sub">Message your peers</div>
            </div>
            <div className="db-action-arr">→</div>
          </button>
        </div>

      </div>
    </div>
  );
}

