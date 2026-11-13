import { useRef, useState } from "react";
import { countTo, useScrollStory } from "../controllers/useScrollStory";
import { TEACHER_STATS } from "../models/teacherStats";
import { Crown } from "./Header";
import Icon from "./Icons";

const fmt = (s) => (v) => `${s.prefix || ""}${Math.round(v)}${s.suffix || ""}`;

// História presa: a foto fica, o nome gigante corre atrás, os números entram em camadas e contam.
export default function TeacherStory({ site }) {
  const ref = useRef(null);
  const [photoOk, setPhotoOk] = useState(Boolean(site.teacher_photo_url));

  useScrollStory(ref, ({ tl, q, gsap }) => {
    tl.fromTo(q(".tstory__big"), { xPercent: 8 }, { xPercent: -42, duration: 1 }, 0);
    tl.fromTo(q(".tstory__photo"), { scale: 0.82, rotate: -4, yPercent: 8 }, { scale: 1, rotate: 0, yPercent: 0, duration: 0.3, ease: "power2.out" }, 0);
    gsap.set(q(".tstory__photo img"), { scale: 1.42, transformOrigin: "56% 62%" }); // recorte da foto
    tl.fromTo(q(".tstory__photo img"), { yPercent: -5 }, { yPercent: 5, duration: 1 }, 0);

    q(".tstory__line").forEach((line, i) => {
      tl.fromTo(line, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.08 + i * 0.09);
    });

    const from = [{ x: -120, y: 40 }, { x: 140, y: -20 }, { x: -100, y: 80 }];
    q(".tstat").forEach((chip, i) => {
      const at = 0.34 + i * 0.16;
      tl.fromTo(chip, { autoAlpha: 0, scale: 0.6, ...from[i % from.length] },
        { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.14, ease: "back.out(1.6)" }, at);
      countTo(tl, chip.querySelector("strong"), TEACHER_STATS[i].value, fmt(TEACHER_STATS[i]), at, 0.2);
      tl.to(chip, { yPercent: -30 - i * 25, duration: 1 - at }, at); // camadas em velocidades diferentes
    });
  }, [photoOk]);

  return (
    <section id="professor" className="tstory" ref={ref} data-anchor="0.9" style={{ height: "260vh" }}>
      <div className="tstory__stage">
        <div className="tstory__big" aria-hidden="true">{site.brand} · {site.brand}</div>
        <div className="tstory__inner">
          <div className="tstory__media">
            <div className="tstory__photo teacher__frame">
              {photoOk
                ? <img src={site.teacher_photo_url} alt={site.teacher_name} onError={() => setPhotoOk(false)} />
                : <div className="teacher__blank"><Crown size={64} /></div>}
            </div>
            {TEACHER_STATS.map((s) => (
              <div className="tstat" key={s.label}><strong>{fmt(s)(s.value)}</strong><span>{s.label}</span></div>
            ))}
          </div>

          <div className="tstory__copy">
            <p className="eyebrow tstory__line">Quem ensina</p>
            <h2 className="section-title tstory__line">{site.teacher_name}</h2>
            {site.teacher_role && <p className="teacher__role tstory__line">{site.teacher_role}</p>}
            <p className="section-lead tstory__line">{site.teacher_bio}</p>
            <div className="teacher__cta tstory__line">
              <a className="btn" href="#planos">{site.cta_label} <Icon name="arrow" size={20} /></a>
              <a className="btn btn--ghost" href="#aulas">Ver aulas</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
