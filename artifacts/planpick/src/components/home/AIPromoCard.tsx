import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import robotImg from "@assets/로봇_1782723959280.png";
import { useLocation } from "wouter";

export function AIPromoCard() {
  const [, setLocation] = useLocation();
  return (
    <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative">
      <CardContent className="p-6 md:p-8 flex items-center justify-between h-full relative z-10 pt-[50px] pb-[50px]">
        <div className="max-w-[70%]">
          <h3 className="text-2xl font-bold mb-2">플랜픽 AI 시간표</h3>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            학교·학과·학년만 입력하면 AI가 최적의 시간표를 추천합니다.
          </p>
          <button onClick={() => setLocation("/request")} className="bg-white/20 hover:bg-white/30 transition-colors border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center" data-testid="btn-ai-start">
            시작하기 <ArrowRight className="ml-1.5 w-4 h-4" />
          </button>
        </div>
        
        <div className="relative flex-shrink-0">
          <img src={robotImg} alt="AI 로봇" className="w-32 h-32 object-contain drop-shadow-xl ml-[20px] mr-[20px] pl-[0px] pr-[0px] mt-[2px] mb-[2px]" />
          <div className="absolute top-0 -left-6 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-2xl rounded-br-sm shadow-sm animate-bounce">
            ...
          </div>
        </div>
      </CardContent>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
    </Card>
  );
}
