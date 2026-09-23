import { Hero } from "@/components/home/hero";
import { UaslHomeCards } from "@/components/home/uasl-home-cards";
import { UaslAboutSection } from "@/components/home/uasl-about-section";

export default function Home() {
  return (
    <>
      <Hero />
      <UaslHomeCards />
      <UaslAboutSection />
    </>
  );
}
