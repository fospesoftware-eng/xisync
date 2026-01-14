import { useEffect, useState } from 'react';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import {
  HeroSection,
  StatsSection,
  ExploreSection,
  ModulesSection,
  ChannelsSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from '../../components/marketing/HomeSections';
import { getPageContent, CMSSection } from '../../lib/cms-service';

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: CMSSection }>> = {
  hero: HeroSection,
  stats: StatsSection,
  navigation: ExploreSection,
  modules: ModulesSection,
  messaging: ChannelsSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  cta: CTASection,
};

export function HomePageDynamic() {
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      const { sections: pageSections } = await getPageContent('home');
      setSections(pageSections);
      setLoading(false);
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {sections.map((section) => {
              const Component = SECTION_COMPONENTS[section.section_type];
              if (!Component) return null;
              return <Component key={section.id} section={section} />;
            })}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
