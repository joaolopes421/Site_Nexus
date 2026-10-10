import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ContactSection } from '../sections/ContactSection'
import { DifferentialsSection } from '../sections/DifferentialsSection'
import { HeroSection } from '../sections/HeroSection'
import { PillarsSection } from '../sections/PillarsSection'
import { ServicesSection } from '../sections/ServicesSection'

export function HomePage() {
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
        <PillarsSection />
        <ServicesSection />
        <DifferentialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
