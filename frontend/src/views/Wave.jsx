// Onda de areia na divisa entre faixa escura e faixa clara. `bottom` inverte para a borda de baixo.
export default function Wave({ bottom = false }) {
  return (
    <svg className={`wave ${bottom ? "wave--bottom" : ""}`} viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="wave__drift">
        <path d="M0 24C120 4 240 4 360 24S600 44 720 24 960 4 1080 24s240 20 360 0 240-20 360 0 240 20 360 0V48H0Z" />
      </g>
    </svg>
  );
}
