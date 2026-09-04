import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Survives from "@/components/survives";
import Stack from "@/components/stack";
import Cta from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Survives />
      <Stack />
      <Cta />
      <Footer />
    </main>
  );
}