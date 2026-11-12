// Faixa em loop com os fundamentos (fica no topo do hero).
export default function Ticker({ words }) {
  if (!words?.length) return null;
  const row = [...words, ...words];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((k) => (
          <div className="ticker__row" key={k}>
            {row.map((w, i) => <span key={i}>{w}<i>✦</i></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
