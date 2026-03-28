import FeatureSection from "@/components/home/FeatureSection";
import FlowSection from "@/components/home/FlowSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import ModeSection from "@/components/home/ModeSection";
import Navigation from "@/components/home/Navigation";
import { getExamConfig, getPracticeConfig } from "@/lib/api";

export default async function Home() {
  const [practiceConfig, examConfig] = await Promise.all([
    getPracticeConfig(),
    getExamConfig(),
  ]);

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary">
      <Navigation />
      <HeroSection examConfig={examConfig} practiceConfig={practiceConfig} />
      <ModeSection />
      <FeatureSection />
      <FlowSection />
      <Footer />
    </div>
  );
}
