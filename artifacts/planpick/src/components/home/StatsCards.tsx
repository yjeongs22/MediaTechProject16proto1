import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, GraduationCap } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* AI 추천 시간표 */}
      <Card className="bg-indigo-950 text-white border-0 shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <CardContent className="p-5 relative z-10 flex flex-col h-full justify-between">
          <div className="text-indigo-200 text-sm font-medium mb-2">AI 추천 시간표</div>
          <div>
            <div className="text-4xl font-bold tracking-tight">95<span className="text-2xl">%</span></div>
            <div className="text-indigo-300 text-xs mt-1">희귀도</div>
          </div>
          <div className="mt-4 h-8 w-full flex items-end gap-1">
            {[40, 60, 45, 80, 50, 70, 95].map((height, i) => (
              <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 졸업 요건 현황 */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="p-5 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="text-slate-500 text-sm font-medium">졸업 요건 현황</div>
          </div>
          <div className="flex items-center justify-center my-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600"
                  strokeWidth="4"
                  strokeDasharray="78, 100"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-indigo-700">78%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div className="text-slate-500 text-xs">이수 완료</div>
            <button className="text-xs text-indigo-600 font-medium hover:underline flex items-center" data-testid="btn-reqs-detail">
              상세보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 신청 가능 학점 */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <div className="text-slate-500 text-sm font-medium mb-3">신청 가능 학점</div>
          <div className="text-3xl font-bold text-slate-800">18 <span className="text-lg font-medium text-slate-600">학점</span></div>
          <div className="text-slate-400 text-xs mt-1">최대 18학점</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* 신청 과목 */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-indigo-50/50">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="text-indigo-600 text-xs font-medium mb-1">신청 과목</div>
            <div className="text-2xl font-bold text-slate-800">5 <span className="text-sm font-medium text-slate-600">과목</span></div>
            <div className="text-slate-500 text-xs mt-0.5">15 학점</div>
          </CardContent>
        </Card>

        {/* 장바구니 */}
        <Card className="border border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="p-4 flex flex-col justify-center h-full relative">
            <div className="absolute top-3 right-3 text-slate-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-slate-500 text-xs font-medium mb-1">장바구니</div>
            <div className="text-2xl font-bold text-slate-800">2 <span className="text-sm font-medium text-slate-600">과목</span></div>
            <div className="text-slate-500 text-xs mt-0.5">6 학점</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
