import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

export function LiveStatusCard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">실시간 수강신청 현황</h3>
          </div>
          <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center transition-colors" data-testid="link-status-more">
            더보기 <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 flex-1 flex flex-col items-center justify-center border border-slate-100">
          <div className="text-slate-500 text-sm font-medium mb-3">신청 시작까지</div>
          <div className="flex items-center gap-2 text-3xl font-bold text-slate-800 tabular-nums tracking-tight">
            <div className="flex flex-col items-center">
              <span>{formatNumber(timeLeft.hours)}</span>
              <span className="text-[10px] text-slate-400 font-normal mt-1">시간</span>
            </div>
            <span className="text-slate-300 pb-4">:</span>
            <div className="flex flex-col items-center">
              <span>{formatNumber(timeLeft.minutes)}</span>
              <span className="text-[10px] text-slate-400 font-normal mt-1">분</span>
            </div>
            <span className="text-slate-300 pb-4">:</span>
            <div className="flex flex-col items-center text-indigo-600">
              <span>{formatNumber(timeLeft.seconds)}</span>
              <span className="text-[10px] text-slate-400 font-normal mt-1">초</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
