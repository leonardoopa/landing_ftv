import { useLanding } from "./controllers/useLanding";
import Benefits from "./views/Benefits";
import Faq from "./views/Faq";
import Footer from "./views/Footer";
import Header from "./views/Header";
import Hero from "./views/Hero";
import LeadForm from "./views/LeadForm";
import Lessons from "./views/Lessons";
import Marquee from "./views/Marquee";
import Method from "./views/Method";
import Plans from "./views/Plans";
import ScrollProgress from "./views/ScrollProgress";
import Testimonials from "./views/Testimonials";

export default function App() {
  const { data, error } = useLanding();

  if (error) return <div className="splash">Não foi possível carregar a página. Atualize em instantes.</div>;
  if (!data) return <div className="splash"><span className="loader" /></div>;

  const { site, steps, benefits, plans, testimonials, faqs } = data;
  return (
    <>
      <ScrollProgress />
      <Header site={site} />
      <main>
        <Hero site={site} />
        <Marquee words={site.marquee} />
        <Method steps={steps} />
        <Lessons site={site} />
        <Benefits benefits={benefits} />
        <Plans plans={plans} />
        <Testimonials items={testimonials} />
        <LeadForm />
        <Faq faqs={faqs} />
      </main>
      <Footer site={site} />
    </>
  );
}
