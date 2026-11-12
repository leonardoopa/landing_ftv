import { useLanding } from "./controllers/useLanding";
import Benefits from "./views/Benefits";
import Faq from "./views/Faq";
import Footer from "./views/Footer";
import Fundamentals from "./views/Fundamentals";
import Header from "./views/Header";
import Hero from "./views/Hero";
import HowItWorks from "./views/HowItWorks";
import Lessons from "./views/Lessons";
import Pains from "./views/Pains";
import Plans from "./views/Plans";
import ScrollProgress from "./views/ScrollProgress";
import Teacher from "./views/Teacher";

export default function App() {
  const { data, error } = useLanding();

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
        <Pains />
        <Fundamentals items={fundamentals} />
        <Lessons />
        <Teacher site={site} />
        <Benefits benefits={benefits} />
        <HowItWorks />
        <Plans plans={plans} />
        <Faq faqs={faqs} />
      </main>
      <Footer site={site} plan={featured} />
    </>
  );
}
