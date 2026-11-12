export default function Marquee({ words }) {
  if (!words?.length) return null;
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div className="marquee__row" key={k}>
            {row.map((w, i) => <span key={i}>{w}<i>●</i></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
