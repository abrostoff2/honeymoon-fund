import PasswordGate from "@/components/PasswordGate";
import Hero from "@/components/Hero";
import FundCard from "@/components/FundCard";
import Footer from "@/components/Footer";
import SiteSettingsProvider from "@/components/SiteSettingsProvider";

export default function Home() {
  return (
    <PasswordGate>
      <SiteSettingsProvider>
        <main className="min-h-screen">
          <Hero />
          <FundCard />
          <Footer />
        </main>
      </SiteSettingsProvider>
    </PasswordGate>
  );
}
