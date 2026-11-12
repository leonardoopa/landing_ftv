import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crown } from "./Header";
import Icon from "./Icons";
import Reveal from "./Reveal";

export default function Teacher({ site, benefits }) {
  const ref = useRef(null);
  const [photoOk, setPhotoOk] = useState(Boolean(site.teacher_photo_url));
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="professor" className="section teacher" ref={ref}>
      <Reveal className="teacher__photo">
        <div className="teacher__frame">
          {photoOk
            ? <motion.img src={site.teacher_photo_url} alt={site.teacher_name} style={{ y: photoY, scale: 1.42, transformOrigin: "56% 62%" }} onError={() => setPhotoOk(false)} />
            : <div className="teacher__blank"><Crown size={64} /></div>}
        </div>
        <span className="teacher__tag"><Crown size={16} />{site.brand}</span>
      </Reveal>

      <div className="teacher__copy">
        <Reveal>
          <p className="eyebrow">Quem ensina</p>
          <h2 className="section-title">{site.teacher_name}</h2>
          {site.teacher_role && <p className="teacher__role">{site.teacher_role}</p>}
          <p className="section-lead">{site.teacher_bio}</p>
        </Reveal>
        <ul className="perks">
          {benefits.map((b, i) => (
            <Reveal as="li" key={b.id} delay={i * 0.06}>
              <span className="perks__icon"><Icon name={b.icon} size={22} /></span>
              <div><strong>{b.title}</strong><p>{b.description}</p></div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
