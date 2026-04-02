import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Builder } from "@/components/Builder";
import { Docs } from "@/components/Docs";
import { Comparison } from "@/components/Comparison";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Builder />
      <Docs />
      <Comparison />
      <Footer />
    </main>
  );
}
