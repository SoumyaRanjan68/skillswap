// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../services/api';
// import './Matches.css';

// export default function Matches() {
//   const navigate = useNavigate();
//   const [matches, setMatches]   = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [sending, setSending]   = useState({});
//   const [sent,    setSent]      = useState({});
//   const [error,   setError]     = useState('');

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const res = await API.get('/user/matches');
//         setMatches(res.data);
//       } catch (err) {
//         setError('Failed to load matches');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMatches();
//   }, []);

//   const sendRequest = async (userId) => {
//     try {
//       setSending(prev => ({ ...prev, [userId]: true }));
//       await API.post(`/request/send/${userId}`);
//       setSent(prev => ({ ...prev, [userId]: true }));
//     } catch (err) {
//       const msg = err.response?.data?.msg || 'Failed to send';
//       alert(msg);
//     } finally {
//       setSending(prev => ({ ...prev, [userId]: false }));
//     }
//   };

//   if (loading) return (
//     <div className="m-loading">
//       <div className="m-loading-dot" />
//       <span>FINDING PEERS...</span>
//     </div>
//   );

//   return (
//     <div className="matches-page">
//       <div className="m-bg" />
//       <div className="m-grid" />

//       <div className="m-wrap">

//         {/* header */}
//         <div className="m-header">
//           <div className="m-kicker">
//             <span className="m-dot" />
//             SKILL EXCHANGE
//           </div>
//           <div className="m-head-row">
//             <h1 className="m-title">
//               YOUR<br /><span className="lime">MATCHES.</span>
//             </h1>
//             <div className="m-head-right">
//               <div className="m-count">{matches.length} PEERS FOUND</div>
//               <button className="m-back" onClick={() => navigate('/dashboard')}>
//                 ← DASHBOARD
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* no matches */}
//         {matches.length === 0 && !error && (
//           <div className="m-empty">
//             <div className="m-empty-num">00</div>
//             <p className="m-empty-text">
//               No matches found yet. Add more skills to find peers.
//             </p>
//             <button className="m-empty-btn" onClick={() => navigate('/dashboard')}>
//               GO TO DASHBOARD →
//             </button>
//           </div>
//         )}

//         {error && (
//           <div className="m-error">{error}</div>
//         )}

//         {/* cards grid */}
//         <div className="m-grid-cards">
//           {matches.map((peer, i) => (
//             <div key={peer._id} className="m-card" style={{ animationDelay: `${i * 0.1}s` }}>

//               <div className="m-card-top">
//                 <div className="m-card-idx">{String(i + 1).padStart(2, '0')}</div>
//                 <div className="m-card-av">
//                   {peer.name?.charAt(0).toUpperCase()}
//                 </div>
//               </div>

//               <div className="m-card-name">{peer.name?.toUpperCase()}</div>
//               <div className="m-card-email">{peer.email}</div>

//               <div className="m-card-divider" />

//               {/* teaches */}
//               <div className="m-card-section">
//                 <div className="m-card-section-label">TEACHES</div>
//                 <div className="m-card-tags">
//                   {peer.skillsOffered?.slice(0, 3).map((s, j) => (
//                     <span key={j} className="m-tag m-tag--teach">{s}</span>
//                   ))}
//                   {peer.skillsOffered?.length > 3 && (
//                     <span className="m-tag m-tag--more">+{peer.skillsOffered.length - 3}</span>
//                   )}
//                 </div>
//               </div>

//               {/* wants */}
//               <div className="m-card-section">
//                 <div className="m-card-section-label">WANTS</div>
//                 <div className="m-card-tags">
//                   {peer.skillsWanted?.slice(0, 3).map((s, j) => (
//                     <span key={j} className="m-tag m-tag--want">{s}</span>
//                   ))}
//                   {peer.skillsWanted?.length > 3 && (
//                     <span className="m-tag m-tag--more">+{peer.skillsWanted.length - 3}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="m-card-divider" />

//               {/* connect button */}
//               {sent[peer._id] ? (
//                 <div className="m-sent">REQUEST SENT ✦</div>
//               ) : (
//                 <button
//                   className={`m-connect ${sending[peer._id] ? 'sending' : ''}`}
//                   onClick={() => sendRequest(peer._id)}
//                   disabled={sending[peer._id]}
//                 >
//                   <span>{sending[peer._id] ? 'SENDING...' : 'CONNECT →'}</span>
//                 </button>
//               )}

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Matches.css';

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [sentIds, setSentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState({});
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch matches and already-sent requests in parallel
      const [matchRes, sentRes] = await Promise.all([
        API.get('/user/matches'),
        API.get('/request/sent'),
      ]);
      setMatches(matchRes.data);

      // Mark which users already have a request sent
      const alreadySent = new Set(sentRes.data.map(r => r.receiver._id));
      setSentIds(alreadySent);
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

  const handleConnect = async (userId) => {
    try {
      setSending(prev => ({ ...prev, [userId]: true }));
      await API.post(`/request/send/${userId}`);
      setSentIds(prev => new Set([...prev, userId]));
      showToast('Request sent! Check your Requests page.', 'success');
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Something went wrong.';
      showToast(msg, 'error');
    } finally {
      setSending(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filtered = matches.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.skillsOffered?.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    user.skillsWanted?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="matches-loading">
      <div className="ml-spinner" />
      <span>FINDING YOUR MATCHES...</span>
    </div>
  );

  return (
    <div className="matches-page">
      <div className="m-bg" />
      <div className="m-grid" />

      {/* Toast */}
      {toast && (
        <div className={`m-toast m-toast--${toast.type}`}>
          <span>{toast.type === 'success' ? '✦' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      <div className="m-wrap">

        {/* Header */}
        <div className="m-header">
          <div className="m-kicker"><span className="m-kdot" />SKILL MATCHING</div>
          <div className="m-head-row">
            <h1 className="m-title">
              YOUR<br /><span className="m-lime">MATCHES.</span>
            </h1>
            <div className="m-head-actions">
              <button className="m-back" onClick={() => navigate('/dashboard')}>← DASHBOARD</button>
              <button className="m-req-btn" onClick={() => navigate('/requests')}>
                REQUESTS →
              </button>
            </div>
          </div>
        </div>

        {/* Stats + Search */}
        <div className="m-toolbar">
          <div className="m-count">
            <span className="m-count-num">{filtered.length}</span>
            <span className="m-count-label">PEERS FOUND</span>
          </div>
          <div className="m-search-wrap">
            <span className="m-search-icon">⌕</span>
            <input
              className="m-search"
              type="text"
              placeholder="SEARCH BY NAME OR SKILL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* How it works */}
        <div className="m-how">
          <div className="m-how-step">
            <span className="m-how-num">01</span>
            <span>Find a peer whose skills match yours</span>
          </div>
          <div className="m-how-arrow">→</div>
          <div className="m-how-step">
            <span className="m-how-num">02</span>
            <span>Hit <strong>CONNECT</strong> to send a request</span>
          </div>
          <div className="m-how-arrow">→</div>
          <div className="m-how-step">
            <span className="m-how-num">03</span>
            <span>They accept → you both can <strong>CHAT</strong></span>
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="m-empty">
            <div className="m-empty-num">00</div>
            <p>No matches found.</p>
            <p className="m-empty-sub">
              {search
                ? 'Try a different search term.'
                : 'Register more users with opposite skills to see matches here.'}
            </p>
            {!search && (
              <button className="m-empty-btn" onClick={() => navigate('/register')}>
                ADD ANOTHER ACCOUNT →
              </button>
            )}
          </div>
        ) : (
          <div className="m-grid-cards">
            {filtered.map((user, i) => {
              const alreadySent = sentIds.has(user._id);
              const isSending = sending[user._id];
              return (
                <div
                  key={user._id}
                  className={`m-card ${alreadySent ? 'm-card--sent' : ''}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* Index */}
                  <div className="m-card-idx">{String(i + 1).padStart(2, '0')}</div>

                  {/* Avatar + name */}
                  <div className="m-card-top">
                    <div className="m-av">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="m-card-name">{user.name?.toUpperCase()}</div>
                      <div className="m-card-email">{user.email}</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="m-skills-block">
                    <div className="m-skills-label">TEACHES</div>
                    <div className="m-skills">
                      {user.skillsOffered?.length > 0
                        ? user.skillsOffered.map(s => (
                          <span key={s} className="m-tag m-tag--teach">{s}</span>
                        ))
                        : <span className="m-tag-none">—</span>
                      }
                    </div>
                  </div>

                  <div className="m-skills-block">
                    <div className="m-skills-label">WANTS TO LEARN</div>
                    <div className="m-skills">
                      {user.skillsWanted?.length > 0
                        ? user.skillsWanted.map(s => (
                          <span key={s} className="m-tag m-tag--want">{s}</span>
                        ))
                        : <span className="m-tag-none">—</span>
                      }
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="m-card-divider" />

                  {/* CTA */}
                  {alreadySent ? (
                    <div className="m-card-sent">
                      <span>✦ REQUEST SENT</span>
                      <button className="m-view-req" onClick={() => navigate('/requests')}>
                        VIEW →
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`m-connect-btn ${isSending ? 'sending' : ''}`}
                      onClick={() => handleConnect(user._id)}
                      disabled={isSending}
                    >
                      {isSending ? 'SENDING...' : 'CONNECT ✦'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}