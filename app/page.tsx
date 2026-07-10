"use client"

import { HeroSection } from "@/components/hero-section"
import { TrendingSection } from "@/components/trending-section"
import { FeaturedCreatorsSection } from "@/components/featured-creators-section"
import { StatsSection } from "@/components/stats-section"
import { EnterpriseSection } from "@/components/enterprise-section"
import { AIAssistant } from "@/components/ai-assistant"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <TrendingSection />
        <FeaturedCreatorsSection />
        <StatsSection />
        <EnterpriseSection />
      </main>
      <AIAssistant />
    </div>
  )
}
