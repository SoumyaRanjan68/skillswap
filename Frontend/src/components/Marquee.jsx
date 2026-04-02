import './Marquee.css';

const ITEMS = [
  'PEERSKILL', 'LEARN FROM PEERS', 'TEACH WHAT YOU KNOW',
  'NO MONEY · JUST KNOWLEDGE', 'SKILL EXCHANGE REIMAGINED', 'GROW TOGETHER',
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="mq">
      <div className="mq-inner">
        {doubled.map((item, i) => (
          <div key={i} className="mq-item">
            {item}<span className="mq-sym">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
