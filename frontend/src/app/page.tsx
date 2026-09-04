import Hero from "@/components/hero";
import Features from "@/components/features";
import Survives from "@/components/survives";
import Stack from "@/components/stack";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Survives />
      <Stack />
      <Cta />
    </main>
  );
}