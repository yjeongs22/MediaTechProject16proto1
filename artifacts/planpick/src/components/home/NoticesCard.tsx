import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function NoticesCard() {
  const notices = [
    "2024-2학기 수강신청 안내",
    "교양 과목 변경 사항 안내",
    "시스템 점검 안내 (5/25)",
    "2024학년도 하계 계절학기 모집"
  ];

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-800">공지사항</h3>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1" data-testid="link-notices-more">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <ul className="flex-1 flex flex-col gap-3">
          {notices.map((notice, i) => (
            <li key={i} className="flex items-center gap-2 group cursor-pointer">
              <span className="w-1 h-1 rounded-full bg-indigo-300"></span>
              <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors truncate">
                {notice}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
