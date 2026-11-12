import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import LeadForm from "./LeadForm";
import Reveal from "./Reveal";
import Letters from "./Letters";

// Fechamento: dúvidas + contato lado a lado (uma seção só).
export default function Faq({ faqs }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="duvidas" className="section closing">
      <Reveal className="closing__faq">
        <p className="eyebrow">Dúvidas</p>
        <h2 className="section-title"><Letters inView text="Rápido e claro." /></h2>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <div key={f.id} className={`faq__item ${open === i ? "is-open" : ""}`}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.question}<Icon name="plus" size={20} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="faq__a">
                    <p>{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.1}><LeadForm /></Reveal>
    </section>
  );
}
