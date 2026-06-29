import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  getRequestById,
  getCurrentRequestId,
  type PlanpickRequest,
  type PlanData,
} from "@/lib/storage";
import { getCourses, type Course } from "@/lib/courses";
import { X, BookOpen } from "lucide-react";

const DAYS = ["월", "화", "수", "목", "금"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function timeToRow(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - 9) + m / 60;
}

function TimetableGrid({ courseIds, courses }: { courseIds: string[]; courses: Course[] }) {
  const [selected, setSelected] = useState<Course | null>(null);
  const scheduled = courses.filter((c) => courseIds.includes(c.id));

  return (
    <div className="relative">
      <div className="overflow-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="min-w-[500px]">
          <div className="flex border-b border-slate-100 bg-slate-50">
            <div className="w-12 flex-shrink-0" />
            {DAYS.map((d) => (
              <div key={d} className="flex-1 text-center text-xs font-bold text-slate-500 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="flex relative" style={{ height: `${HOURS.length * 44}px` }}>
            <div className="w-12 flex-shrink-0 flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="flex-none text-[10px] text-slate-400 pl-1 pt-1" style={{ height: "44px" }}>
                  {h}:00
                </div>
              ))}
            </div>
            <div className="flex-1 relative">
              {HOURS.map((_, i) => (
                <div key={i} className="absolute w-full border-b border-slate-50" style={{ top: `${i * 44}px` }} />
              ))}
              {DAYS.map((day, di) => (
                <div
                  key={day}
                  className="absolute top-0 bottom-0 border-r border-slate-50"
                  style={{ left: `${(di / 5) * 100}%`, width: `${100 / 5}%` }}
                />
              ))}
              {scheduled.map((c) => {
                const di = DAYS.indexOf(c.day);
                if (di < 0) return null;
                const top = timeToRow(c.start) * 44;
                const height = (timeToRow(c.end) - timeToRow(c.start)) * 44 - 2;
                return (
                  <button
                    key={c.id}
                    data-testid={`course-block-${c.id}`}
                    onClick={() => setSelected(c)}
                    className="absolute rounded-lg text-white text-[10px] font-bold px-1.5 py-1 text-left overflow-hidden hover:opacity-90 transition-opacity cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white/50"
                    style={{
                      left: `calc(${(di / 5) * 100}% + 2px)`,
                      width: `calc(${100 / 5}% - 4px)`,
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: c.color,
                    }}
                  >
                    <div className="truncate">{c.name}</div>
                    <div className="opacity-80 text-[9px]">{c.start}~{c.end}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2"
                  style={{ backgroundColor: selected.color + "20", color: selected.color }}
                >
                  {selected.type}
                </span>
                <h3 className="text-lg font-black text-slate-900">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "강의코드", value: selected.courseCode },
                { label: "강의실", value: selected.room },
                { label: "시간", value: `${selected.day} ${selected.start}~${selected.end}` },
                { label: "학점", value: `${selected.credit}학점` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-semibold mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-slate-800">{value || "-"}</p>
                </div>
              ))}
            </div>
            {selected.review && (
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-400 mb-1">강의평</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.review}</p>
              </div>
            )}
            {selected.syllabus && (
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">강의계획서</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.syllabus}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PlanTab({
  plan,
  courses,
  label,
}: {
  plan: PlanData;
  courses: Course[];
  label: string;
}) {
  const scheduled = courses.filter((c) => plan.courseIds.includes(c.id));
  const totalCredits = scheduled.reduce((s, c) => s + c.credit, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        {scheduled.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: c.color }}
          >
            <BookOpen className="w-3 h-3" />
            {c.name} ({c.credit}학점)
          </div>
        ))}
        <div className="ml-auto text-sm font-bold text-indigo-600">총 {totalCredits}학점</div>
      </div>

      <TimetableGrid courseIds={plan.courseIds} courses={courses} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-green-600 mb-2">✓ 장점</p>
          <p className="text-sm text-slate-700 leading-relaxed">{plan.pros || "관리자가 아직 입력하지 않았습니다."}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-600 mb-2">⚠ 주의할 점</p>
          <p className="text-sm text-slate-700 leading-relaxed">{plan.cons || "관리자가 아직 입력하지 않았습니다."}</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const [, setLocation] = useLocation();
  const [request, setRequest] = useState<PlanpickRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plan1" | "plan2" | "plan3" | "planB">("plan1");
  const courses = getCourses();

  useEffect(() => {
    async function load() {
      const id = getCurrentRequestId();
      if (!id) { setLoading(false); return; }
      const req = await getRequestById(id);
      setRequest(req);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const TABS = [
    { key: "plan1" as const, label: "1안 졸업 안정형" },
    { key: "plan2" as const, label: "2안 생활 균형형" },
    { key: "plan3" as const, label: "3안 학점 방어형" },
    { key: "planB" as const, label: "Plan B" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F8] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-1" style={{ fontFamily: "PlanPickPretendard, 'Noto Sans KR', sans-serif" }}>
            추천 결과
          </h1>
          {request?.student && (
            <p className="text-slate-500 text-sm">
              {request.student.school} · {request.student.major} · {request.student.grade}
            </p>
          )}
        </div>

        {!request || request.status !== "complete" ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              {!request ? "아직 결과가 없습니다" : "아직 분석 중입니다"}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {!request
                ? "추천 요청을 먼저 보내주세요."
                : "추천 결과를 준비하고 있습니다. 잠시 후 다시 확인해주세요."}
            </p>
            <button
              onClick={() => setLocation(request ? "/request/waiting" : "/request")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
              data-testid="btn-go-request"
            >
              {request ? "대기 화면으로" : "추천 요청하기"}
            </button>
          </div>
        ) : (
          <>
            {request.result?.priorities && request.result.priorities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 mr-2">반영된 키워드</span>
                {request.result.priorities.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                    {p}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex border-b border-slate-100">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    data-testid={`tab-${tab.key}`}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                      activeTab === tab.key
                        ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "planB" ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <p className="text-xs font-bold text-indigo-500 mb-3">Plan B 추천</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {request.result?.planB || "관리자가 아직 입력하지 않았습니다."}
                    </p>
                  </div>
                ) : request.result?.[activeTab] ? (
                  <PlanTab
                    plan={request.result[activeTab]}
                    courses={courses}
                    label={TABS.find((t) => t.key === activeTab)?.label ?? ""}
                  />
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">결과가 없습니다.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
