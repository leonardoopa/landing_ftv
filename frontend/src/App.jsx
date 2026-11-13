import { useAnchorScroll } from "./controllers/useAnchorScroll";
import { useLanding } from "./controllers/useLanding";
import { DESK, useMediaQuery } from "./controllers/useMediaQuery";
import Benefits from "./views/Benefits";
import Faq from "./views/Faq";
import Footer from "./views/Footer";
import Fundamentals from "./views/Fundamentals";
import Header from "./views/Header";
import Hero from "./views/Hero";
import HowItWorks from "./views/HowItWorks";
import Lessons from "./views/Lessons";
import LessonsStory from "./views/LessonsStory";
import Plans from "./views/Plans";
import PlansStory from "./views/PlansStory";
import ScrollProgress from "./views/ScrollProgress";
import Teacher from "./views/Teacher";
import TeacherStory from "./views/TeacherStory";

export default function App() {
  const { data, error } = useLanding();
  // desktop: histórias presas ao scroll; celular/tablet ou "reduzir movimento": seções empilhadas
  const desk = useMediaQuery(DESK);
  useAnchorScroll();

  if (error) return <div className="splash">Não foi possível carregar a página. Atualize em instantes.</div>;
  if (!data) return <div className="splash"><span className="loader" /></div>;

  const { site, steps, fundamentals, benefits, plans, faqs } = data;
  const featured = plans.find((p) => p.highlight) || plans[0];

  return (
    <>
      <ScrollProgress />
      <Header site={site} />
      <main>
        <Hero site={site} steps={steps} />
        <Fundamentals items={fundamentals} />
        <div className="theme-sand">{desk ? <LessonsStory /> : <Lessons />}</div>
        {desk ? <TeacherStory site={site} /> : <Teacher site={site} />}
        <div className="theme-sand">
          <Benefits benefits={benefits} />
          <HowItWorks />
        </div>
        {desk ? <PlansStory plans={plans} /> : <Plans plans={plans} />}
        <div className="theme-sand"><Faq faqs={faqs} /></div>
      </main>
      <Footer site={site} plan={featured} />
    </>
  );
}
