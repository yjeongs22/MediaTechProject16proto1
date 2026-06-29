import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { getRequestById, getCurrentRequestId, type PlanpickRequest } from "@/lib/storage";
import { CheckCircle, Clock } from "lucide-react";

export default function WaitingPage() {
  const [, setLocation] = useLocation();
  const [request, setRequest] = useState<PlanpickRequest | null>(null);
  const [complete, setComplete] = useState(false);

  const poll = useCallback(async () => {
    const id = getCurrentRequestId();
    if (!id) return;
    const req = await getRequestById(id);
    if (!req) return;
    setRequest(req);
    if (req.status === "complete") {
      setComplete(true);
    }
  }, []);

  useEffect(() => {
    poll();
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [poll]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f3f1ff 0%, #ede9fe 40%, #e0e7ff 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center gap-6">
          {complete ? (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          ) : (
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
          )}

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${complete ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}
          >
            {complete ? "분석 완료" : "분석 대기중"}
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "PlanPickPretendard, 'Noto Sans KR', sans-serif" }}>
              {complete ? "추천 결과가 준비됐습니다!" : "요청이 접수되었습니다"}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {complete
                ? "AI 시간표 추천 결과를 확인해보세요."
                : "요청을 확인하는 중입니다.\n결과가 준비되면 이 화면이 자동으로 완료 상태로 바뀝니다."}
            </p>
          </div>

          {request && (
            <div className="w-full bg-slate-50 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">요청 정보</p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{request.student.school}</span> {request.student.major}{" "}
                {request.student.grade}
              </p>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{request.needText}</p>
            </div>
          )}

          {complete && (
            <button
              data-testid="btn-view-results"
              onClick={() => setLocation("/results")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
            >
              결과 확인하기 →
            </button>
          )}

          <button
            onClick={() => setLocation("/")}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            data-testid="btn-go-home"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
