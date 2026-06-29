import React, { useState } from "react";
import { useLocation } from "wouter";
import { getData, upsertRequest, getCurrentRequestId, type StudentInfo, type PlanpickRequest } from "@/lib/storage";
import robotImg from "@assets/로봇_1782723959280.png";
import { BotMessageSquare } from "lucide-react";

export default function NeedsPage() {
  const [, setLocation] = useLocation();
  const [needText, setNeedText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!needText.trim() || submitting) return;
    setSubmitting(true);

    const student = getData<StudentInfo>("planpickStudent");
    const requestId = getCurrentRequestId() ?? String(Date.now());

    const request: PlanpickRequest = {
      id: requestId,
      student: student ?? { school: "", major: "", studentNumber: "", grade: "", targetCredit: 18 },
      needText: needText.trim(),
      status: "pending",
      createdAt: Date.now(),
    };

    await upsertRequest(request);
    setLocation("/request/waiting");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #f3f1ff 0%, #ede9fe 40%, #e0e7ff 100%)" }}
    >
      <div className="p-6 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <BotMessageSquare className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-indigo-700 text-lg" style={{ fontFamily: "PlanPickAggro, 'Noto Sans KR', sans-serif" }}>
          플랜픽 AI
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-4xl relative">
          <div className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 w-4 h-4 rounded-full border-2 border-indigo-200 opacity-40" />
              <div className="absolute bottom-10 left-16 w-6 h-6 rounded-full border-2 border-purple-200 opacity-30" />
              <div className="absolute top-1/3 left-4 grid grid-cols-3 gap-1 opacity-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-indigo-300" />
                ))}
              </div>
              <div className="absolute bottom-8 right-48 grid grid-cols-3 gap-1 opacity-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-purple-300" />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex gap-10 items-start">
              <div className="flex-1">
                <h1
                  className="text-4xl font-black text-indigo-600 mb-3 leading-tight"
                  style={{ fontFamily: "PlanPickAggro, 'Noto Sans KR', sans-serif" }}
                >
                  원하는 시간표 조건
                </h1>
                <p className="text-slate-600 text-sm mb-1">원하는 조건을 문장으로 적어주세요.</p>
                <p className="text-slate-400 text-sm mb-6">예: 오전 수업은 피하고 싶고, 금요일 공강이면 좋겠어요.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">자유입력</label>
                    <div className="relative">
                      <textarea
                        data-testid="textarea-needs"
                        value={needText}
                        onChange={(e) => setNeedText(e.target.value.slice(0, 500))}
                        placeholder="예: 전공필수는 포함해주세요. 이동시간이 짧았으면 좋겠습니다."
                        rows={5}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-slate-400">{needText.length} / 500</span>
                    </div>
                  </div>

                  <button
                    data-testid="btn-submit-needs"
                    type="submit"
                    disabled={!needText.trim() || submitting}
                    className="w-fit bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-md"
                  >
                    {submitting ? "요청 중..." : "AI 시간표 생성"}
                  </button>
                </form>
              </div>

              <div className="relative flex-shrink-0 hidden md:flex flex-col items-end">
                <div className="absolute -top-2 -left-8 bg-white border border-slate-100 shadow-md text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-2xl rounded-br-sm animate-bounce z-10">
                  ...
                </div>
                <img src={robotImg} alt="플랜픽 AI 로봇" className="w-48 h-48 object-contain drop-shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={() => setLocation("/request")}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          data-testid="btn-back"
        >
          ← 이전
        </button>
      </div>
    </div>
  );
}
