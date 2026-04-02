import MatchCard from '../components/MatchCard';
import Marquee from '../components/Marquee';
import './Home.css';

const PEERS = [
  { initials:'RK', name:'Rahul Kumar',   location:'Delhi, India',     teaches:'React',   wants:'Python',     match:91 },
  { initials:'AP', name:'Ananya Pillai', location:'Bangalore, India', teaches:'Figma',   wants:'JavaScript', match:85 },
  { initials:'MS', name:'Mohit Sharma',  location:'Pune, India',      teaches:'ML',      wants:'UI/UX',      match:78 },
  { initials:'VN', name:'Vidya Nair',    location:'Chennai, India',   teaches:'Node.js', wants:'Flutter',    match:72 },
];

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-animated-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid-bg" />
        <div className="hero-ghost">PEERSKILL PEERSKILL PEERSKILL PEERSKILL</div>
        <div className="hero-overlay" />

        <div className="hero-body">
          <div className="h-kicker">Skill exchange platform — 2025</div>
          <div className="h-row">
            <h1 className="h-title">
              LEARN<br />
              <span className="lime">FROM</span><br />
              YOUR<br />
              <span className="outline">PEERS.</span>
              <span className="h-sm">No money. Just knowledge.</span>
            </h1>
            <div className="h-right">
              <p className="h-sub">
                Match with people who have skills you want. Teach what you know.{' '}
                <strong>No money exchanged</strong> — just pure peer-to-peer knowledge transfer.
              </p>
              <div className="h-cta-wrap">
                <button className="h-cta"><span>FIND YOUR PEER</span></button>
                <button className="h-link">HOW IT WORKS</button>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-bar">
          {[
            { n:'4.2', acc:'K', label:'Active peers'  },
            { n:'180', acc:'+', label:'Skills listed'  },
            { n:'94',  acc:'%', label:'Satisfaction'   },
            { n:'12',  acc:'K', label:'Sessions done'  },
          ].map((s) => (
            <div key={s.label} className="stat">
              <span className="s-num">{s.n}<span className="s-acc">{s.acc}</span></span>
              <span className="s-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="scroll-ind">
          <div className="s-line" />
          <span className="s-txt">SCROLL TO EXPLORE</span>
        </div>
      </section>

      <Marquee />

      <section className="cards-section">
        <div className="cs-head">
          <h2 className="cs-title">TOP<br /><span className="lime">MATCHES</span><br />FOR YOU.</h2>
          <div className="cs-meta">
            <div className="cs-count">04 PEERS FOUND</div>
            <button className="cs-view">VIEW ALL →</button>
          </div>
        </div>
        <div className="cards-grid">
          {PEERS.map((p, i) => (
            <MatchCard key={i} index={i} {...p} />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="f-logo">PEER<span>SKILL</span></div>
        <div className="f-palette">
          {['#080808','#d1ff00','#f0f0f0'].map(c => (
            <div key={c} className="fp" style={{ background: c, outline: c==='#080808'?'1px solid rgba(255,255,255,0.1)':'' }} />
          ))}
        </div>
        <div className="f-copy">UNBOUNDED · DM SANS · 2025</div>
      </footer>
    </main>
  );
}
