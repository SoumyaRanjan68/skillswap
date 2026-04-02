import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Explore.css';

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'CSS',
  'MongoDB', 'SQL', 'Flutter', 'Java', 'C++', 'Machine Learning',
  'UI/UX', 'Figma', 'DevOps', 'AWS', 'Docker', 'GraphQL'
];

export default function Explore() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const [users,      setUsers]      = useState([]);
  const [sentIds,    setSentIds]    = useState(new Set());
  const [sending,    setSending]    = useState({});
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [activeSkill,setActiveSkill]= useState('ALL');
  const [toast,      setToast]      = useState(null);
  const [view,       setView]       = useState('grid'); // grid | list

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, sentRes] = await Promise.all([
        API.get('/user/all'),
        API.get('/request/sent'),
      ]);
      // exclude self
      setUsers(usersRes.data.filter(u => u._id !== userId));
      setSentIds(new Set(sentRes.data.map(r => r.receiver._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnect = async (uid) => {
    try {
      setSending(prev => ({ ...prev, [uid]: true }));
      await API.post(`/request/send/${uid}`);
      setSentIds(prev => new Set([...prev, uid]));
      showToast('Request sent! Check Requests page.', 'success');
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Already sent or error.', 'error');
    } finally {
      setSending(prev => ({ ...prev, [uid]: false }));
    }
  };

  // Filter logic
  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.skillsOffered?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      u.skillsWanted?.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchSkill =
      activeSkill === 'ALL' ||
      u.skillsOffered?.includes(activeSkill) ||
      u.skillsWanted?.includes(activeSkill);

    return matchSearch && matchSkill;
  });

  // Unique skills from all users for filter bar
  const availableSkills = ['ALL', ...new Set(
    users.flatMap(u => [...(u.skillsOffered || []), ...(u.skillsWanted || [])])
  )];

  if (loading) return (
    <div className="ex-loading">
      <div className="ex-spinner" />
      <span>DISCOVERING PEERS...</span>
    </div>
  );

  return (
    <div className="explore-page">
      <div className="ex-bg" />
      <div className="ex-grid" />

      {toast && (
        <div className={`ex-toast ex-toast--${toast.type}`}>
          {toast.type === 'success' ? '✦' : '✕'} {toast.msg}
        </div>
      )}

      <div className="ex-wrap">

        {/* ── HERO HEADER ── */}
        <div className="ex-hero">
          <div className="ex-hero-left">
            <div className="ex-kicker"><span className="ex-kdot" />COMMUNITY</div>
            <h1 className="ex-title">
              EXPLORE<br /><span className="ex-lime">PEERS.</span>
            </h1>
            <p className="ex-subtitle">
              Discover people to learn from and teach.
              Every connection is a skill exchange.
            </p>
          </div>
          <div className="ex-hero-stats">
            <div className="ex-stat">
              <span className="ex-stat-num">{users.length}</span>
              <span className="ex-stat-label">TOTAL PEERS</span>
            </div>
            <div className="ex-stat-div" />
            <div className="ex-stat">
              <span className="ex-stat-num">{availableSkills.length - 1}</span>
              <span className="ex-stat-label">SKILLS</span>
            </div>
            <div className="ex-stat-div" />
            <div className="ex-stat">
              <span className="ex-stat-num">{sentIds.size}</span>
              <span className="ex-stat-label">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* ── MARQUEE STRIP ── */}
        <div className="ex-marquee-wrap">
          <div className="ex-marquee">
            {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
              <span key={i} className="ex-marquee-item">
                <span className="ex-marquee-dot">✦</span> {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="ex-toolbar">
          <div className="ex-search-wrap">
            <span className="ex-search-icon">⌕</span>
            <input
              className="ex-search"
              placeholder="SEARCH NAME OR SKILL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="ex-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className="ex-view-toggle">
            <button
              className={`ex-view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              title="Grid view"
            >⊞</button>
            <button
              className={`ex-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >☰</button>
          </div>
        </div>

        {/* ── SKILL FILTER PILLS ── */}
        <div className="ex-filters">
          {availableSkills.slice(0, 12).map(skill => (
            <button
              key={skill}
              className={`ex-filter-pill ${activeSkill === skill ? 'active' : ''}`}
              onClick={() => setActiveSkill(skill)}
            >
              {skill}
              {skill !== 'ALL' && (
                <span className="ex-filter-count">
                  {users.filter(u =>
                    u.skillsOffered?.includes(skill) || u.skillsWanted?.includes(skill)
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── RESULTS COUNT ── */}
        <div className="ex-results-bar">
          <span className="ex-results-count">
            <span className="ex-lime">{filtered.length}</span> PEERS FOUND
          </span>
          {(search || activeSkill !== 'ALL') && (
            <button className="ex-clear-all" onClick={() => { setSearch(''); setActiveSkill('ALL'); }}>
              CLEAR FILTERS ✕
            </button>
          )}
        </div>

        {/* ── EMPTY ── */}
        {filtered.length === 0 && (
          <div className="ex-empty">
            <div className="ex-empty-num">00</div>
            <p>No peers found for your search.</p>
            <button className="ex-empty-btn" onClick={() => { setSearch(''); setActiveSkill('ALL'); }}>
              CLEAR FILTERS →
            </button>
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {view === 'grid' && filtered.length > 0 && (
          <div className="ex-grid-cards">
            {filtered.map((user, i) => {
              const sent    = sentIds.has(user._id);
              const loading = sending[user._id];
              return (
                <div
                  key={user._id}
                  className={`ex-card ${sent ? 'ex-card--sent' : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Top accent line */}
                  <div className="ex-card-accent" />

                  <div className="ex-card-head">
                    <div className="ex-av" style={{ '--hue': `${user.name?.charCodeAt(0) * 5 % 360}deg` }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="ex-card-name">{user.name?.toUpperCase()}</div>
                      <div className="ex-card-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="ex-card-body">
                    <div className="ex-skills-section">
                      <div className="ex-skills-label">TEACHES</div>
                      <div className="ex-tags">
                        {user.skillsOffered?.length > 0
                          ? user.skillsOffered.map(s => (
                            <span
                              key={s}
                              className={`ex-tag ex-tag--teach ${activeSkill === s ? 'ex-tag--highlight' : ''}`}
                              onClick={() => setActiveSkill(s)}
                            >{s}</span>
                          ))
                          : <span className="ex-tag-none">—</span>
                        }
                      </div>
                    </div>

                    <div className="ex-skills-section">
                      <div className="ex-skills-label">LEARNING</div>
                      <div className="ex-tags">
                        {user.skillsWanted?.length > 0
                          ? user.skillsWanted.map(s => (
                            <span
                              key={s}
                              className={`ex-tag ex-tag--want ${activeSkill === s ? 'ex-tag--highlight' : ''}`}
                              onClick={() => setActiveSkill(s)}
                            >{s}</span>
                          ))
                          : <span className="ex-tag-none">—</span>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="ex-card-footer">
                    {sent ? (
                      <div className="ex-sent-row">
                        <span className="ex-sent-label">✦ REQUEST SENT</span>
                        <button className="ex-view-btn-sm" onClick={() => navigate('/requests')}>
                          VIEW →
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`ex-connect-btn ${loading ? 'loading' : ''}`}
                        onClick={() => handleConnect(user._id)}
                        disabled={loading}
                      >
                        <span>{loading ? 'SENDING...' : 'CONNECT ✦'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === 'list' && filtered.length > 0 && (
          <div className="ex-list">
            {filtered.map((user, i) => {
              const sent    = sentIds.has(user._id);
              const loading = sending[user._id];
              return (
                <div
                  key={user._id}
                  className={`ex-list-row ${sent ? 'ex-list-row--sent' : ''}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="ex-list-idx">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ex-av ex-av--sm" style={{ '--hue': `${user.name?.charCodeAt(0) * 5 % 360}deg` }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ex-list-info">
                    <div className="ex-card-name">{user.name?.toUpperCase()}</div>
                    <div className="ex-card-email">{user.email}</div>
                  </div>
                  <div className="ex-list-tags">
                    {user.skillsOffered?.slice(0, 3).map(s => (
                      <span key={s} className="ex-tag ex-tag--teach">{s}</span>
                    ))}
                    {user.skillsWanted?.slice(0, 2).map(s => (
                      <span key={s} className="ex-tag ex-tag--want">{s}</span>
                    ))}
                  </div>
                  <div className="ex-list-action">
                    {sent ? (
                      <span className="ex-sent-label">✦ SENT</span>
                    ) : (
                      <button
                        className={`ex-connect-btn ex-connect-btn--sm ${loading ? 'loading' : ''}`}
                        onClick={() => handleConnect(user._id)}
                        disabled={loading}
                      >
                        {loading ? '...' : 'CONNECT'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}