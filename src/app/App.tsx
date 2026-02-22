import React from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ArchitectureSection } from "./components/ArchitectureSection";
import { PolicySection } from "./components/PolicySection";
import { LiveDemo } from "./components/LiveDemo";
import { UseCasesSection } from "./components/UseCasesSection";
import { TrustSection } from "./components/TrustSection";
import { CTABand } from "./components/CTABand";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div
      style={{
        background: "#0F1114",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#FFFFFF",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <ArchitectureSection />
        <PolicySection />
        <LiveDemo />
        <UseCasesSection />
        <TrustSection />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}