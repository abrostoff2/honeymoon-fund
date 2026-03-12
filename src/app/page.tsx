import PasswordGate from "@/components/PasswordGate";
import Hero from "@/components/Hero";
import FundCard from "@/components/FundCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <PasswordGate>
      <main className="min-h-screen">
        <Hero />
        <FundCard />
        <Footer />
      </main>
    </PasswordGate>
  );
}
