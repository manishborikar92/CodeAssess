import HomeFeatureSection from "@/components/home/HomeFeatureSection";
import HomeFlowSection from "@/components/home/HomeFlowSection";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeroSection from "@/components/home/HomeHeroSection";
import HomeModeSection from "@/components/home/HomeModeSection";
import HomeNavigation from "@/components/home/HomeNavigation";
import { getExamConfig, getPracticeConfig } from "@/lib/api";

export default async function Home() {
  const [practiceConfig, examConfig] = await Promise.all([
    getPracticeConfig(),
    getExamConfig(),
  ]);

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-primary">
      <HomeNavigation />
      <HomeHeroSection examConfig={examConfig} practiceConfig={practiceConfig} />
      <HomeModeSection />
      <HomeFeatureSection />
      <HomeFlowSection />
      <HomeFooter />
    </div>
  );
}
