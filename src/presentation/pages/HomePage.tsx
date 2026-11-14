import { lazy, memo } from 'react'
import { DeferredSection } from '../components/DeferredSection'
import { Navbar } from '../components/Navbar'
import { HeroSection } from '../sections/HeroSection'

const PillarsSection = lazy(() => import('../sections/PillarsSection').then((module) => ({ default: module.PillarsSection })))
const ServicesSection = lazy(() => import('../sections/ServicesSection').then((module) => ({ default: module.ServicesSection })))
const CtaSection = lazy(() => import('../sections/CtaSection').then((module) => ({ default: module.CtaSection })))
const DifferentialsSection = lazy(() => import('../sections/DifferentialsSection').then((module) => ({ default: module.DifferentialsSection })))
const ContactSection = lazy(() => import('../sections/ContactSection').then((module) => ({ default: module.ContactSection })))
const Footer = lazy(() => import('../components/Footer').then((module) => ({ default: module.Footer })))

export const HomePage = memo(function HomePage() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-xl focus:bg-nexus-cyan focus:px-4 focus:py-2 focus:font-medium focus:text-slate-950"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <HeroSection />
        <DeferredSection id="pilares" estimatedHeight={980}>
          <PillarsSection />
        </DeferredSection>
        <DeferredSection id="servicos" estimatedHeight={1080}>
          <ServicesSection />
        </DeferredSection>
        <DeferredSection id="comecar" estimatedHeight={520}>
          <CtaSection />
        </DeferredSection>
        <DeferredSection id="diferenciais" estimatedHeight={1000}>
          <DifferentialsSection />
        </DeferredSection>
        <DeferredSection id="contato" estimatedHeight={1100}>
          <ContactSection />
        </DeferredSection>
      </main>
      <DeferredSection id="rodape" estimatedHeight={460}>
        <Footer />
      </DeferredSection>
    </>
  )
})
