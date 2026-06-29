import React from "react";
import { Bot, GraduationCap, BellRing, RefreshCcw, Star } from "lucide-react";

export function FeatureIcons() {
  const features = [
    {
      icon: <Bot className="w-6 h-6 text-indigo-600" />,
      title: "AI 시간표 추천",
      desc: "개인 맞춤 최적 시간표"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      title: "졸업 요건 관리",
      desc: "실시간 이수 현황 확인"
    },
    {
      icon: <BellRing className="w-6 h-6 text-blue-500" />,
      title: "수강신청 지원",
      desc: "대기순번 & 알림 서비스"
    },
    {
      icon: <RefreshCcw className="w-6 h-6 text-emerald-500" />,
      title: "대체 플랜 제안",
      desc: "신청 실패 시 대안 제시"
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      title: "강의 평가 분석",
      desc: "후기 기반 강의 추천"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 w-full py-8 mt-4 border-t border-slate-200/60">
      {features.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group cursor-pointer" data-testid={`feature-icon-${i}`}>
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative">
            <div className="absolute inset-0 bg-slate-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">{item.icon}</div>
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
          <p className="text-xs text-slate-500">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
