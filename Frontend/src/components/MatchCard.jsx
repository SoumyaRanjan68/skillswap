import { useEffect, useRef } from 'react';
import './MatchCard.css';

export default function MatchCard({ index, initials, name, location, teaches, wants, match }) {
  const cardRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const fill = fillRef.current;
    if (!card) return;

    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        card.style.transition = `opacity .7s ${index * 0.12}s ease, transform .7s ${index * 0.12}s ease`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        if (fill) {
          setTimeout(() => { fill.style.width = match + '%'; }, index * 120);
        }
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(card);
    return () => observer.disconnect();
  }, [index, match]);

  return (
    <div className="card" ref={cardRef}>
      <div className="c-idx">{String(index + 1).padStart(2, '0')}</div>
      <div className="c-av">{initials}</div>
      <div className="c-name">{name.toUpperCase()}</div>
      <div className="c-loc">{location}</div>
      <div className="c-div" />
      <div className="c-skill teaches">Teaches {teaches}</div>
      <div className="c-skill">Wants {wants}</div>
      <div className="c-bar-wrap">
        <div className="c-bar-top">
          <span className="c-bar-lbl">Match</span>
          <span className="c-bar-val">{match}%</span>
        </div>
        <div className="c-track">
          <div className="c-fill" ref={fillRef} style={{ width: 0 }} />
        </div>
      </div>
      <button className="c-btn">
        CONNECT <span className="c-arr">→</span>
      </button>
    </div>
  );
}
