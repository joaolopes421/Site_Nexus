import { lazy, memo } from 'react'
import { Footer } from '../components/Footer'
import { DeferredSection } from '../components/DeferredSection'
import { Navbar } from '../components/Navbar'
import { HeroSection } from '../sections/HeroSection'

const PillarsSection = lazy(() => import('../sections/PillarsSection').then((module) => ({ default: module.PillarsSection })))
const ServicesSection = lazy(() => import('../sections/ServicesSection').then((module) => ({ default: module.ServicesSection })))
const DifferentialsSection = lazy(() => import('../sections/DifferentialsSection').then((module) => ({ default: module.DifferentialsSection })))
const ContactSection = lazy(() => import('../sections/ContactSection').then((module) => ({ default: module.ContactSection })))

export const HomePage = memo(function HomePage() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-nexus-cyan focus:px-4 focus:py-2 focus:text-nexus-bg"
      >
        Saltar para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <HeroSection />
        <DeferredSection id="pilares" estimatedHeight={780}>
          <PillarsSection />
        </DeferredSection>
        <DeferredSection id="servicos" estimatedHeight={1120}>
          <ServicesSection />
        </DeferredSection>
        <DeferredSection id="diferenciais" estimatedHeight={1100}>
          <DifferentialsSection />
        </DeferredSection>
        <DeferredSection id="contacto" estimatedHeight={980}>
          <ContactSection />
        </DeferredSection>
      </main>
      <Footer />
    </>
  )
})
