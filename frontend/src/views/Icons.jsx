const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const paths = {
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 3v6l5 3-2 6M12 9l-5 3 2 6M3.5 10l3.5 2M20.5 10 17 12" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  stairs: <path d="M3 20h5v-5h5v-5h5V5h3" />,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5.5" /></>,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  check: <path d="m5 12 5 5 9-10" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  whatsapp: <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4.1A8 8 0 1 1 20 12Zm-9.5-3.5c-.2 0-.5.1-.6.4-.3.7-.4 1.7.7 3.1 1.1 1.5 2.4 2.4 3.9 2.7.7.1 1.3-.4 1.5-.9l-1.3-.7-.5.5c-.9-.3-1.7-1.1-2.1-2l.5-.5-.5-1.4c-.1-.2-.4-.2-.6-.2Z" />,
};

export default function Icon({ name, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...P}>
      {paths[name] || paths.ball}
    </svg>
  );
}
