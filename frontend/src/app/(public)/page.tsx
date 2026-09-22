import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ProgramsSection } from "@/components/home/programs-section";
import { WhyItMatters } from "@/components/home/why-it-matters";
import { HowItWorks } from "@/components/home/how-it-works";
import { NoticesSection } from "@/components/home/notices-section";
import { LeadershipSection } from "@/components/home/leadership-section";
import { VerificationSection } from "@/components/home/verification-section";
import { TransparencySection } from "@/components/home/transparency-section";
import { TrainingSection } from "@/components/home/training-section";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProgramsSection />
      <WhyItMatters />
      <HowItWorks />
      <NoticesSection />
      <LeadershipSection />
      <VerificationSection />
      <TransparencySection />
      <TrainingSection />
      <FinalCta />
    </>
  );
}
