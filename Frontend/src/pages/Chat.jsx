// import { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import API from '../services/api';
// import './Chat.css';

// const socket = io('http://localhost:5000');

// export default function Chat() {
//   const navigate = useNavigate();
//   const userId   = localStorage.getItem('userId');

//   const [peers,      setPeers]      = useState([]);
//   const [activePeer, setActivePeer] = useState(null);
//   const [messages,   setMessages]   = useState([]);
//   const [input,      setInput]      = useState('');
//   const [loading,    setLoading]    = useState(true);
//   const bottomRef  = useRef(null);
//   const activePeerRef = useRef(null); // ← keep activePeer accessible in socket listener

//   // Keep ref in sync with state
//   useEffect(() => {
//     activePeerRef.current = activePeer;
//   }, [activePeer]);

//   // Join socket room + listen for messages
//   useEffect(() => {
//     if (!userId) return;
//     socket.emit('join', userId);

//     socket.on('receiveMessage', (data) => {
//       // Only show message if it's from the currently active peer
//       const currentPeer = activePeerRef.current;
//       if (currentPeer && data.senderId === currentPeer._id) {
//         setMessages(prev => [...prev, data]);
//       }
//     });

//     return () => socket.off('receiveMessage');
//   }, [userId]);

//   // Fetch accepted peers — deduplicated by peer _id
//   useEffect(() => {
//     const fetchPeers = async () => {
//       try {
//         const res = await API.get('/request/accepted');
//         const seen = new Set();
//         const peerList = [];

//         res.data.forEach(req => {
//           const isMe = req.sender?._id === userId || req.sender === userId;
//           const peer = isMe ? req.receiver : req.sender;
//           if (peer && !seen.has(peer._id)) {
//             seen.add(peer._id);
//             peerList.push({ reqId: req._id, peer });
//           }
//         });

//         setPeers(peerList);
//       } catch (err) {
//         console.error('Failed to fetch peers:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPeers();
//   }, [userId]);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim() || !activePeer) return;

//     const data = {
//       senderId:   userId,
//       receiverId: activePeer._id,
//       message:    input.trim(),
//       time:       new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     socket.emit('sendMessage', data);
//     setMessages(prev => [...prev, data]); // show immediately for sender
//     setInput('');
//   };

//   const handleKey = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const selectPeer = (peerObj) => {
//     setActivePeer(peerObj.peer);
//     setMessages([]); // clear messages when switching peer
//   };

//   if (loading) return (
//     <div className="ch-loading">
//       <div className="ch-spinner" />
//       <span>LOADING CHAT...</span>
//     </div>
//   );

//   return (
//     <div className="chat-page">
//       <div className="ch-bg" />
//       <div className="ch-grid" />

//       <div className="ch-wrap">

//         {/* SIDEBAR */}
//         <div className="ch-sidebar">
//           <div className="ch-sidebar-header">
//             <div className="ch-kicker"><span className="ch-dot" />MESSAGES</div>
//             <div className="ch-peer-count">{peers.length} PEERS</div>
//           </div>

//           {peers.length === 0 ? (
//             <div className="ch-no-peers">
//               <p>No accepted connections yet.</p>
//               <button onClick={() => navigate('/requests')}>
//                 GO TO REQUESTS →
//               </button>
//             </div>
//           ) : (
//             <div className="ch-peer-list">
//               {peers.map((peerObj) => {
//                 const peer     = peerObj.peer;
//                 const isActive = activePeer?._id === peer?._id;
//                 return (
//                   <div
//                     key={peerObj.reqId}
//                     className={`ch-peer-item ${isActive ? 'ch-peer-item--active' : ''}`}
//                     onClick={() => selectPeer(peerObj)}
//                   >
//                     <div className="ch-peer-av">
//                       {peer?.name?.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="ch-peer-info">
//                       <div className="ch-peer-name">{peer?.name?.toUpperCase()}</div>
//                       <div className="ch-peer-sub">
//                         {isActive ? '● chatting now' : 'click to chat'}
//                       </div>
//                     </div>
//                     {isActive && <div className="ch-active-bar" />}
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           <button className="ch-back" onClick={() => navigate('/dashboard')}>
//             ← DASHBOARD
//           </button>
//         </div>

//         {/* CHAT AREA */}
//         <div className="ch-main">
//           {!activePeer ? (
//             <div className="ch-empty">
//               <div className="ch-empty-ghost">CHAT</div>
//               <div className="ch-empty-text">
//                 <div className="ch-empty-title">SELECT A PEER</div>
//                 <p>
//                   {peers.length > 0
//                     ? 'Choose someone from the left to start chatting.'
//                     : 'Accept a request first to unlock chat.'}
//                 </p>
//                 {peers.length === 0 && (
//                   <button className="ch-empty-btn" onClick={() => navigate('/requests')}>
//                     GO TO REQUESTS →
//                   </button>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Chat header */}
//               <div className="ch-header">
//                 <div className="ch-header-av">
//                   {activePeer.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="ch-header-info">
//                   <div className="ch-header-name">{activePeer.name?.toUpperCase()}</div>
//                   <div className="ch-header-status">
//                     <span className="ch-online-dot" />ONLINE
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="ch-messages">
//                 {messages.length === 0 && (
//                   <div className="ch-no-msgs">
//                     Say hello to {activePeer.name} 👋
//                   </div>
//                 )}
//                 {messages.map((msg, i) => {
//                   const isMe = msg.senderId === userId;
//                   return (
//                     <div key={i} className={`ch-msg ${isMe ? 'ch-msg--me' : 'ch-msg--them'}`}>
//                       <div className="ch-msg-bubble">
//                         <div className="ch-msg-text">{msg.message}</div>
//                         {msg.time && <div className="ch-msg-time">{msg.time}</div>}
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div ref={bottomRef} />
//               </div>

//               {/* Input */}
//               <div className="ch-input-row">
//                 <input
//                   className="ch-input"
//                   placeholder="TYPE A MESSAGE..."
//                   value={input}
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={handleKey}
//                   autoFocus
//                 />
//                 <button
//                   className="ch-send"
//                   onClick={sendMessage}
//                   disabled={!input.trim()}
//                 >
//                   SEND →
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../services/api';
import './Chat.css';

// const socket = io('http://localhost:5000');
const socket = io("https://skillswap-eitr.onrender.com");

export default function Chat() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const [peers,      setPeers]      = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(true);
  const [histLoading, setHistLoading] = useState(false);
  const bottomRef     = useRef(null);
  const activePeerRef = useRef(null);

  useEffect(() => { activePeerRef.current = activePeer; }, [activePeer]);

  useEffect(() => {
    if (!userId) return;
    socket.emit('join', userId);
    socket.on('receiveMessage', (data) => {
      const currentPeer = activePeerRef.current;
      if (currentPeer && data.senderId === currentPeer._id) {
        setMessages(prev => [...prev, {
          sender:    { _id: data.senderId },
          receiver:  { _id: data.receiverId },
          message:   data.message,
          createdAt: new Date().toISOString(),
          _time:     data.time,
        }]);
      }
    });
    return () => socket.off('receiveMessage');
  }, [userId]);

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        const res = await API.get('/request/accepted');
        const seen = new Set();
        const peerList = [];
        res.data.forEach(req => {
          const isMe = req.sender?._id === userId || req.sender === userId;
          const peer = isMe ? req.receiver : req.sender;
          if (peer && !seen.has(peer._id)) {
            seen.add(peer._id);
            peerList.push({ reqId: req._id, peer });
          }
        });
        setPeers(peerList);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPeers();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectPeer = async (peerObj) => {
    setActivePeer(peerObj.peer);
    setMessages([]);
    setHistLoading(true);
    try {
      const res = await API.get(`/message/history/${peerObj.peer._id}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
    finally { setHistLoading(false); }
  };

  const sendMessage = () => {
    if (!input.trim() || !activePeer) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const data = { senderId: userId, receiverId: activePeer._id, message: input.trim(), time };
    socket.emit('sendMessage', data);
    setMessages(prev => [...prev, {
      sender: { _id: userId }, receiver: { _id: activePeer._id },
      message: input.trim(), createdAt: new Date().toISOString(), _time: time,
    }]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (msg) => {
    if (msg._time) return msg._time;
    if (msg.createdAt) return new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '';
  };

  const isMyMessage = (msg) => {
    const senderId = msg.sender?._id || msg.sender || msg.senderId;
    return senderId === userId;
  };

  if (loading) return (
    <div className="ch-loading"><div className="ch-spinner" /><span>LOADING CHAT...</span></div>
  );

  return (
    <div className="chat-page">
      <div className="ch-bg" /><div className="ch-grid" />
      <div className="ch-wrap">
        <div className="ch-sidebar">
          <div className="ch-sidebar-header">
            <div className="ch-kicker"><span className="ch-dot" />MESSAGES</div>
            <div className="ch-peer-count">{peers.length} PEERS</div>
          </div>
          {peers.length === 0 ? (
            <div className="ch-no-peers">
              <p>No accepted connections yet.</p>
              <button onClick={() => navigate('/requests')}>GO TO REQUESTS →</button>
            </div>
          ) : (
            <div className="ch-peer-list">
              {peers.map((peerObj) => {
                const peer = peerObj.peer;
                const isActive = activePeer?._id === peer?._id;
                return (
                  <div key={peerObj.reqId} className={`ch-peer-item ${isActive ? 'ch-peer-item--active' : ''}`} onClick={() => selectPeer(peerObj)}>
                    <div className="ch-peer-av">{peer?.name?.charAt(0).toUpperCase()}</div>
                    <div className="ch-peer-info">
                      <div className="ch-peer-name">{peer?.name?.toUpperCase()}</div>
                      <div className="ch-peer-sub">{isActive ? '● chatting now' : 'click to chat'}</div>
                    </div>
                    {isActive && <div className="ch-active-bar" />}
                  </div>
                );
              })}
            </div>
          )}
          <button className="ch-back" onClick={() => navigate('/dashboard')}>← DASHBOARD</button>
        </div>
        <div className="ch-main">
          {!activePeer ? (
            <div className="ch-empty">
              <div className="ch-empty-ghost">CHAT</div>
              <div className="ch-empty-text">
                <div className="ch-empty-title">SELECT A PEER</div>
                <p>{peers.length > 0 ? 'Choose someone from the left to start chatting.' : 'Accept a request first to unlock chat.'}</p>
                {peers.length === 0 && <button className="ch-empty-btn" onClick={() => navigate('/requests')}>GO TO REQUESTS →</button>}
              </div>
            </div>
          ) : (
            <>
              <div className="ch-header">
                <div className="ch-header-av">{activePeer.name?.charAt(0).toUpperCase()}</div>
                <div className="ch-header-info">
                  <div className="ch-header-name">{activePeer.name?.toUpperCase()}</div>
                  <div className="ch-header-status"><span className="ch-online-dot" />ONLINE</div>
                </div>
              </div>
              <div className="ch-messages">
                {histLoading && <div className="ch-hist-loading">Loading history...</div>}
                {!histLoading && messages.length === 0 && <div className="ch-no-msgs">Say hello to {activePeer.name} 👋</div>}
                {messages.map((msg, i) => {
                  const isMe = isMyMessage(msg);
                  return (
                    <div key={i} className={`ch-msg ${isMe ? 'ch-msg--me' : 'ch-msg--them'}`}>
                      <div className="ch-msg-bubble">
                        <div className="ch-msg-text">{msg.message}</div>
                        <div className="ch-msg-time">{formatTime(msg)}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="ch-input-row">
                <input className="ch-input" placeholder="TYPE A MESSAGE..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} autoFocus />
                <button className="ch-send" onClick={sendMessage} disabled={!input.trim()}>SEND →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}