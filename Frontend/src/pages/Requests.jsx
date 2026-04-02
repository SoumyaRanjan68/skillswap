// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../services/api';
// import './Requests.css';

// export default function Requests() {
//   const navigate = useNavigate();
//   const [incoming, setIncoming] = useState([]);
//   const [sent,     setSent]     = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [acting,   setActing]   = useState({});
//   const [tab,      setTab]      = useState('incoming');

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [inRes, sentRes] = await Promise.all([
//           API.get('/request/incoming'),
//           API.get('/request/sent'),
//         ]);
//         setIncoming(inRes.data);
//         setSent(sentRes.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const handleAccept = async (id) => {
//     try {
//       setActing(prev => ({ ...prev, [id]: 'accepting' }));
//       await API.put(`/request/accept/${id}`);
//       setIncoming(prev => prev.map(r => r._id === id ? { ...r, status: 'accepted' } : r));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActing(prev => ({ ...prev, [id]: null }));
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       setActing(prev => ({ ...prev, [id]: 'rejecting' }));
//       await API.put(`/request/reject/${id}`);
//       setIncoming(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActing(prev => ({ ...prev, [id]: null }));
//     }
//   };

//   if (loading) return (
//     <div className="rq-loading">
//       <div className="rq-dot" />
//       <span>LOADING REQUESTS...</span>
//     </div>
//   );

//   return (
//     <div className="requests-page">
//       <div className="rq-bg" />
//       <div className="rq-grid-bg" />

//       <div className="rq-wrap">

//         {/* header */}
//         <div className="rq-header">
//           <div className="rq-kicker"><span className="rq-kdot" />SWAP REQUESTS</div>
//           <div className="rq-head-row">
//             <h1 className="rq-title">
//               MANAGE<br /><span className="lime">REQUESTS.</span>
//             </h1>
//             <button className="rq-back" onClick={() => navigate('/dashboard')}>
//               ← DASHBOARD
//             </button>
//           </div>
//         </div>

//         {/* tabs */}
//         <div className="rq-tabs">
//           <button
//             className={`rq-tab ${tab === 'incoming' ? 'rq-tab--active' : ''}`}
//             onClick={() => setTab('incoming')}
//           >
//             INCOMING
//             <span className="rq-tab-count">{incoming.length}</span>
//           </button>
//           <button
//             className={`rq-tab ${tab === 'sent' ? 'rq-tab--active' : ''}`}
//             onClick={() => setTab('sent')}
//           >
//             SENT
//             <span className="rq-tab-count">{sent.length}</span>
//           </button>
//         </div>

//         {/* INCOMING */}
//         {tab === 'incoming' && (
//           <div className="rq-list">
//             {incoming.length === 0 && (
//               <div className="rq-empty">
//                 <div className="rq-empty-num">00</div>
//                 <p>No incoming requests yet.</p>
//               </div>
//             )}
//             {incoming.map((req, i) => (
//               <div key={req._id} className="rq-card" style={{ animationDelay: `${i * 0.08}s` }}>
//                 <div className="rq-card-left">
//                   <div className="rq-card-idx">{String(i + 1).padStart(2, '0')}</div>
//                   <div className="rq-card-av">
//                     {req.sender?.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="rq-card-info">
//                     <div className="rq-card-name">
//                       {req.sender?.name?.toUpperCase()}
//                     </div>
//                     <div className="rq-card-email">{req.sender?.email}</div>
//                   </div>
//                 </div>

//                 <div className="rq-card-status-wrap">
//                   {req.status === 'pending' ? (
//                     <div className="rq-card-actions">
//                       <button
//                         className={`rq-btn rq-btn--accept ${acting[req._id] === 'accepting' ? 'acting' : ''}`}
//                         onClick={() => handleAccept(req._id)}
//                         disabled={!!acting[req._id]}
//                       >
//                         {acting[req._id] === 'accepting' ? '...' : 'ACCEPT'}
//                       </button>
//                       <button
//                         className={`rq-btn rq-btn--reject ${acting[req._id] === 'rejecting' ? 'acting' : ''}`}
//                         onClick={() => handleReject(req._id)}
//                         disabled={!!acting[req._id]}
//                       >
//                         {acting[req._id] === 'rejecting' ? '...' : 'REJECT'}
//                       </button>
//                     </div>
//                   ) : (
//                     <div className={`rq-status rq-status--${req.status}`}>
//                       {req.status.toUpperCase()} ✦
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SENT */}
//         {tab === 'sent' && (
//           <div className="rq-list">
//             {sent.length === 0 && (
//               <div className="rq-empty">
//                 <div className="rq-empty-num">00</div>
//                 <p>No sent requests yet. Go to matches to connect!</p>
//                 <button className="rq-empty-btn" onClick={() => navigate('/matches')}>
//                   FIND MATCHES →
//                 </button>
//               </div>
//             )}
//             {sent.map((req, i) => (
//               <div key={req._id} className="rq-card" style={{ animationDelay: `${i * 0.08}s` }}>
//                 <div className="rq-card-left">
//                   <div className="rq-card-idx">{String(i + 1).padStart(2, '0')}</div>
//                   <div className="rq-card-av">
//                     {req.receiver?.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="rq-card-info">
//                     <div className="rq-card-name">
//                       {req.receiver?.name?.toUpperCase()}
//                     </div>
//                     <div className="rq-card-email">{req.receiver?.email}</div>
//                   </div>
//                 </div>
//                 <div className="rq-card-status-wrap">
//                   <div className={`rq-status rq-status--${req.status}`}>
//                     {req.status.toUpperCase()} ✦
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Requests.css';

export default function Requests() {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState({});
  const [tab, setTab] = useState('incoming');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [inRes, sentRes] = await Promise.all([
        API.get('/request/incoming'),
        API.get('/request/sent'),
      ]);
      setIncoming(inRes.data);
      setSent(sentRes.data);
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

  const handleAccept = async (id) => {
    try {
      setActing(prev => ({ ...prev, [id]: 'accepting' }));
      await API.put(`/request/accept/${id}`);
      setIncoming(prev =>
        prev.map(r => r._id === id ? { ...r, status: 'accepted' } : r)
      );
      showToast('Request accepted! You can now chat.', 'success');
    } catch (err) {
      showToast('Something went wrong.', 'error');
    } finally {
      setActing(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    try {
      setActing(prev => ({ ...prev, [id]: 'rejecting' }));
      await API.put(`/request/reject/${id}`);
      setIncoming(prev =>
        prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r)
      );
      showToast('Request rejected.', 'error');
    } catch (err) {
      showToast('Something went wrong.', 'error');
    } finally {
      setActing(prev => ({ ...prev, [id]: null }));
    }
  };

  const pendingIncoming = incoming.filter(r => r.status === 'pending');
  const resolvedIncoming = incoming.filter(r => r.status !== 'pending');

  if (loading) return (
    <div className="rq-loading">
      <div className="rq-spinner" />
      <span>LOADING REQUESTS...</span>
    </div>
  );

  return (
    <div className="requests-page">
      <div className="rq-bg" />
      <div className="rq-grid-bg" />

      {/* Toast notification */}
      {toast && (
        <div className={`rq-toast rq-toast--${toast.type}`}>
          <span>{toast.type === 'success' ? '✦' : '✕'}</span>
          {toast.msg}
        </div>
      )}

      <div className="rq-wrap">

        {/* Header */}
        <div className="rq-header">
          <div className="rq-kicker"><span className="rq-kdot" />SWAP REQUESTS</div>
          <div className="rq-head-row">
            <h1 className="rq-title">
              MANAGE<br /><span className="lime">REQUESTS.</span>
            </h1>
            <div className="rq-head-actions">
              <button className="rq-back" onClick={() => navigate('/dashboard')}>
                ← DASHBOARD
              </button>
              <button className="rq-chat-btn" onClick={() => navigate('/chat')}>
                OPEN CHAT →
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="rq-stats">
          <div className="rq-stat">
            <span className="rq-stat-num">{pendingIncoming.length}</span>
            <span className="rq-stat-label">PENDING</span>
          </div>
          <div className="rq-stat-divider" />
          <div className="rq-stat">
            <span className="rq-stat-num">{incoming.filter(r => r.status === 'accepted').length}</span>
            <span className="rq-stat-label">ACCEPTED</span>
          </div>
          <div className="rq-stat-divider" />
          <div className="rq-stat">
            <span className="rq-stat-num">{sent.length}</span>
            <span className="rq-stat-label">SENT</span>
          </div>
          <div className="rq-stat-divider" />
          <div className="rq-stat">
            <span className="rq-stat-num">{sent.filter(r => r.status === 'accepted').length}</span>
            <span className="rq-stat-label">CONNECTED</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="rq-tabs">
          <button
            className={`rq-tab ${tab === 'incoming' ? 'rq-tab--active' : ''}`}
            onClick={() => setTab('incoming')}
          >
            INCOMING
            {pendingIncoming.length > 0 && (
              <span className="rq-tab-badge">{pendingIncoming.length}</span>
            )}
          </button>
          <button
            className={`rq-tab ${tab === 'sent' ? 'rq-tab--active' : ''}`}
            onClick={() => setTab('sent')}
          >
            SENT
            <span className="rq-tab-count">{sent.length}</span>
          </button>
        </div>

        {/* INCOMING TAB */}
        {tab === 'incoming' && (
          <div className="rq-list">
            {incoming.length === 0 ? (
              <div className="rq-empty">
                <div className="rq-empty-num">00</div>
                <p>No incoming requests yet.</p>
                <p className="rq-empty-sub">When someone sends you a request, it'll appear here.</p>
              </div>
            ) : (
              <>
                {/* Pending requests first */}
                {pendingIncoming.length > 0 && (
                  <div className="rq-section-label">● AWAITING YOUR RESPONSE</div>
                )}
                {pendingIncoming.map((req, i) => (
                  <div key={req._id} className="rq-card rq-card--pending" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="rq-card-left">
                      <div className="rq-card-idx">{String(i + 1).padStart(2, '0')}</div>
                      <div className="rq-card-av">
                        {req.sender?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="rq-card-info">
                        <div className="rq-card-name">{req.sender?.name?.toUpperCase()}</div>
                        <div className="rq-card-email">{req.sender?.email}</div>
                        <div className="rq-card-skills">
                          {req.sender?.skillsOffered?.slice(0, 3).map(s => (
                            <span key={s} className="rq-skill rq-skill--teach">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rq-card-status-wrap">
                      <div className="rq-card-actions">
                        <button
                          className={`rq-btn rq-btn--accept ${acting[req._id] === 'accepting' ? 'acting' : ''}`}
                          onClick={() => handleAccept(req._id)}
                          disabled={!!acting[req._id]}
                        >
                          {acting[req._id] === 'accepting' ? '...' : '✓ ACCEPT'}
                        </button>
                        <button
                          className={`rq-btn rq-btn--reject ${acting[req._id] === 'rejecting' ? 'acting' : ''}`}
                          onClick={() => handleReject(req._id)}
                          disabled={!!acting[req._id]}
                        >
                          {acting[req._id] === 'rejecting' ? '...' : '✕ REJECT'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Resolved requests */}
                {resolvedIncoming.length > 0 && (
                  <>
                    <div className="rq-section-label">● RESOLVED</div>
                    {resolvedIncoming.map((req, i) => (
                      <div key={req._id} className={`rq-card rq-card--${req.status}`} style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="rq-card-left">
                          <div className="rq-card-idx">{String(i + 1).padStart(2, '0')}</div>
                          <div className="rq-card-av">
                            {req.sender?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="rq-card-info">
                            <div className="rq-card-name">{req.sender?.name?.toUpperCase()}</div>
                            <div className="rq-card-email">{req.sender?.email}</div>
                          </div>
                        </div>
                        <div className="rq-card-status-wrap">
                          <div className={`rq-status rq-status--${req.status}`}>
                            {req.status === 'accepted' ? '✦ ACCEPTED' : '✕ REJECTED'}
                          </div>
                          {req.status === 'accepted' && (
                            <button className="rq-chat-now" onClick={() => navigate('/chat')}>
                              CHAT NOW →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* SENT TAB */}
        {tab === 'sent' && (
          <div className="rq-list">
            {sent.length === 0 ? (
              <div className="rq-empty">
                <div className="rq-empty-num">00</div>
                <p>No sent requests yet.</p>
                <p className="rq-empty-sub">Find peers and send them a connect request.</p>
                <button className="rq-empty-btn" onClick={() => navigate('/matches')}>
                  FIND MATCHES →
                </button>
              </div>
            ) : (
              sent.map((req, i) => (
                <div key={req._id} className={`rq-card rq-card--${req.status}`} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="rq-card-left">
                    <div className="rq-card-idx">{String(i + 1).padStart(2, '0')}</div>
                    <div className="rq-card-av">
                      {req.receiver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="rq-card-info">
                      <div className="rq-card-name">{req.receiver?.name?.toUpperCase()}</div>
                      <div className="rq-card-email">{req.receiver?.email}</div>
                      <div className="rq-card-skills">
                        {req.receiver?.skillsOffered?.slice(0, 3).map(s => (
                          <span key={s} className="rq-skill rq-skill--teach">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rq-card-status-wrap">
                    <div className={`rq-status rq-status--${req.status}`}>
                      {req.status === 'pending' && '⏳ PENDING'}
                      {req.status === 'accepted' && '✦ ACCEPTED'}
                      {req.status === 'rejected' && '✕ REJECTED'}
                    </div>
                    {req.status === 'accepted' && (
                      <button className="rq-chat-now" onClick={() => navigate('/chat')}>
                        CHAT NOW →
                      </button>
                    )}
                    {req.status === 'rejected' && (
                      <button className="rq-retry-btn" onClick={() => navigate('/matches')}>
                        FIND OTHERS →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}