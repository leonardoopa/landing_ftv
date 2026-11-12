import Icon from "./Icons";

export default function Footer({ site }) {
  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">{site.brand}</div>
      <div className="footer__row">
        <p>© {new Date().getFullYear()} {site.brand}. Todos os direitos reservados.</p>
        <p>
          {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
        </p>
      </div>
      <a className="whats" href={site.cta_url} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
        <Icon name="whatsapp" size={28} />
      </a>
    </footer>
  );
}
