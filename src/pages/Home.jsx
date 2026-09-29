import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "../components/portfolio/HeroSection";
import TrustedBy from "../components/portfolio/TrustedBy";
import TrafficRouter from "../components/home/TrafficRouter";
import GrandmasterGate from "../components/home/GrandmasterGate";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <GrandmasterGate />
      <section id="hero" className="relative">
        <HeroSection
          onScrollToNext={() =>
            document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })
          }
        />
      </section>

      <TrafficRouter />

      <TrustedBy />

      {/* CTA Strip */}
      <section id="cta" className="py-16 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How Secure Is Your Organization?
          </h2>
          <p className="text-slate-300 mb-7 text-sm max-w-xl mx-auto">
            Take our free 5-minute security assessment to get an instant risk score and actionable
            recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
            >
              <Link to={createPageUrl("SecurityAssessment")} onClick={() => window.scrollTo(0, 0)}>
                <Target className="w-5 h-5 mr-2" />
                Free Security Assessment
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Link to={createPageUrl("Services")} onClick={() => window.scrollTo(0, 0)}>
                View Services <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}