import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsCards } from "@/components/home/StatsCards";
import { TimetableCard } from "@/components/home/TimetableCard";
import { AIPromoCard } from "@/components/home/AIPromoCard";
import { LiveStatusCard } from "@/components/home/LiveStatusCard";
import { NoticesCard } from "@/components/home/NoticesCard";
import { FeatureIcons } from "@/components/home/FeatureIcons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F2F8] p-6 md:p-8 lg:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* Top Section: Hero + Floating Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left: Hero Typography */}
          <div className="lg:col-span-5 h-full">
            <HeroSection />
          </div>
          
          {/* Right: Floating Cards */}
          <div className="lg:col-span-7 relative w-full pt-4">
            {/* Desktop Layout - absolute positioning overlapping */}
            <div className="hidden lg:block relative h-[420px] w-full">
              {/* Center Main Timetable */}
              <div className="absolute top-10 left-[10%] w-[55%] z-20">
                <TimetableCard />
              </div>
              
              {/* Top Right AI Card */}
              <div className="absolute top-0 right-0 w-[38%] z-30">
                <div className="transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <StatsCards />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout - regular grid */}
            <div className="lg:hidden flex flex-col gap-6 w-full max-w-[600px] mx-auto">
              <div className="w-full">
                <TimetableCard />
              </div>
              <div className="w-full">
                <StatsCards />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: AI Promo + Status + Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-7">
            <AIPromoCard />
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <LiveStatusCard />
            <NoticesCard />
          </div>
        </div>

        {/* Bottom Section: Feature Icons */}
        <FeatureIcons />
        
      </div>
    </div>
  );
}
