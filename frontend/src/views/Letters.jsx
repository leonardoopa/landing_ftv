import { motion } from "framer-motion";

const container = { hidden: {}, show: (delay) => ({ transition: { staggerChildren: 0.035, delayChildren: delay } }) };
const letter = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Texto que aparece letra por letra. `inView` dispara ao entrar na tela; senão, ao montar.
export default function Letters({ text = "", delay = 0, inView = false }) {
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-60px" } }
    : { animate: "show" };
  return (
    <motion.span className="letters" aria-label={text} variants={container} custom={delay} initial="hidden" {...trigger}>
      {text.split(" ").map((word, w) => (
        <span className="word" key={w} aria-hidden="true">
          {[...word].map((ch, c) => <motion.span key={c} variants={letter}>{ch}</motion.span>)}
        </span>
      ))}
    </motion.span>
  );
}
