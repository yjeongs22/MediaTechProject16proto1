import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  getRequestById,
  getCurrentRequestId,
  type PlanpickRequest,
  type PlanData,
} from "@/lib/storage";
import { getCourses, type Course } from "@/lib/courses";
import { X, BookOpen, Star, ChevronRight, Download, RotateCcw, Calendar } from "lucide-react";
import robotImg from "@assets/로봇_1782723959280.png";

const DAYS = ["월", "화", "수", "목", "금"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function timeToRow(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - 9) + m / 60;
}

function CircularProgress({ value }: { value: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const stroke = circ - (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E8EAFF" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="#6366f1" strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black text-indigo-600">{value}%</span>
        <span className="text-[10px] text-slate-400 font-medium mt-0.5">추천 적합도</span>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function TimetableGrid({ courseIds, courses }: { courseIds: string[]; courses: Course[] }) {
  const [selected, setSelected] = useState<Course | null>(null);
  const scheduled = courses.filter((c) => courseIds.includes(c.id));

  return (
    <div className="relative">
      <div className="overflow-auto rounded-xl border border-slate-100 bg-white">
        <div className="min-w-[360px]">
          <div className="flex border-b border-slate-100 bg-slate-50">
            <div className="w-10 flex-shrink-0" />
            {DAYS.map((d) => (
              <div key={d} className="flex-1 text-center text-xs font-bold text-slate-400 py-1.5">{d}</div>
            ))}
          </div>
          <div className="flex relative" style={{ height: `${HOURS.length * 38}px` }}>
            <div className="w-10 flex-shrink-0 flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="flex-none text-[9px] text-slate-300 pl-1 pt-1" style={{ height: "38px" }}>
                  {h}:00
                </div>
              ))}
            </div>
            <div className="flex-1 relative">
              {HOURS.map((_, i) => (
                <div key={i} className="absolute w-full border-b border-slate-50" style={{ top: `${i * 38}px` }} />
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
                const top = timeToRow(c.start) * 38;
                const height = (timeToRow(c.end) - timeToRow(c.start)) * 38 - 2;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="absolute rounded-lg text-white text-[9px] font-bold px-1 py-1 text-left overflow-hidden hover:opacity-90 transition-opacity border-0 outline-none"
                    style={{
                      left: `calc(${(di / 5) * 100}% + 2px)`,
                      width: `calc(${100 / 5}% - 4px)`,
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: c.color,
                    }}
                  >
                    <div className="truncate leading-tight">{c.name}</div>
                    <div className="opacity-75 text-[8px]">{c.start}</div>
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
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2" style={{ backgroundColor: selected.color + "20", color: selected.color }}>
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
          </div>
        </div>
      )}
    </div>
  );
}

const PLAN_TABS = [
  { key: "plan1" as const, label: "졸업 안정형" },
  { key: "plan2" as const, label: "생활 균형형" },
  { key: "plan3" as const, label: "학점 방어형" },
  { key: "planB" as const, label: "Plan B" },
];

const AI_REASONS = [
  "졸업요건을 가장 많이 충족합니다.",
  "강의를 최대한 확보하였습니다.",
  "이동시간이 적어 효율적입니다.",
  "선호 교수님과 시간이 반영되었습니다.",
  "당신의 선호도와 졸업요건을 종합한 최적의 시간표입니다.",
];

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

  const isReady = request && (request.status === "complete" || request.status === "완료");
  const activePlan = isReady && activeTab !== "planB" ? request?.result?.[activeTab] : null;
  const scheduledCourses = activePlan ? courses.filter((c) => activePlan.courseIds.includes(c.id)) : [];
  const totalCredits = scheduledCourses.reduce((s, c) => s + c.credit, 0);
  const courseTypes = new Set(scheduledCourses.map((c) => c.type)).size;
  const priorities = request?.result?.priorities ?? [];

  return (
    <div className="min-h-screen bg-[#F0F2F8] p-6 md:p-8">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-2 flex items-center gap-1"
            >
              ← 대시보드
            </button>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "PlanPickPretendard, 'Noto Sans KR', sans-serif" }}>
              추천 결과
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">AI가 당신의 졸업요건과 선호도를 분석하여 추천한 결과 입니다.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 서비스시간
            </button>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              수강신청
            </button>
          </div>
        </div>

        {!isReady ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              {!request ? "아직 결과가 없습니다" : "아직 분석 중입니다"}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {!request ? "추천 요청을 먼저 보내주세요." : "추천 결과를 준비하고 있습니다. 잠시 후 다시 확인해주세요."}
            </p>
            <button
              onClick={() => setLocation(request ? "/request/waiting" : "/request")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              {request ? "대기 화면으로" : "추천 요청하기"}
            </button>
          </div>
        ) : (
          <>
            {/* Summary + Keywords row */}
            <div className="flex gap-5">
              {/* AI 분석 요약 */}
              <div className="flex-1 bg-white rounded-2xl shadow-sm p-5 flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-base">🤖</div>
                    <span className="text-sm font-bold text-slate-700">AI 분석 요약</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "추천 과목", value: `${scheduledCourses.length}개`, icon: "📚" },
                      { label: "총 학점", value: `${totalCredits}학점`, icon: "🎯" },
                      { label: "과목 종류", value: `${courseTypes}개`, icon: "📊" },
                      { label: "Plan B 포함", value: request.result?.planB ? "포함" : "미포함", icon: "🔄" },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="text-xl mb-1">{icon}</div>
                        <div className="text-xs text-slate-400 font-medium mb-0.5">{label}</div>
                        <div className="text-sm font-black text-slate-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <CircularProgress value={95} />
              </div>

              {/* 반영된 키워드 */}
              {priorities.length > 0 && (
                <div className="w-64 bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-xs font-bold text-slate-400 mb-3">반영된 키워드</p>
                  <div className="flex flex-wrap gap-1.5">
                    {priorities.map((p, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold border border-indigo-100">
                        #{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Plan Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100">
                {PLAN_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3 text-sm font-bold transition-all ${
                      activeTab === tab.key
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === "planB" ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <p className="text-xs font-bold text-indigo-500 mb-3">Plan B 추천</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {request.result?.planB || "관리자가 아직 입력하지 않았습니다."}
                    </p>
                  </div>
                ) : activePlan ? (
                  <div className="flex gap-5">
                    {/* Left: Pros + Timetable */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                      {activePlan.pros && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-base">👍</span>
                            <span className="text-sm font-bold text-slate-700">장점</span>
                          </div>
                          <ul className="space-y-1">
                            {activePlan.pros.split(/[,\n·•]/).filter(Boolean).map((item, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
                                <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                                {item.trim()}
                              </li>
                            ))}
                          </ul>
                          {activePlan.cons && (
                            <>
                              <div className="flex items-center gap-1.5 mb-2 mt-4">
                                <span className="text-base">⚠️</span>
                                <span className="text-sm font-bold text-slate-700">주의사항</span>
                              </div>
                              <ul className="space-y-1">
                                {activePlan.cons.split(/[,\n·•]/).filter(Boolean).map((item, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
                                    <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                                    {item.trim()}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2">추천 시간표</p>
                        <TimetableGrid courseIds={activePlan.courseIds} courses={courses} />
                      </div>
                    </div>

                    {/* Right: Course List + AI Reason */}
                    <div className="w-72 flex-shrink-0 flex flex-col gap-4">
                      {/* 추천 과목 목록 */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-slate-700">추천 과목 목록</p>
                          <button className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 transition-colors">
                            전체보기 <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          {scheduledCourses.slice(0, 5).map((c) => (
                            <div key={c.id} className="flex items-start gap-2 pb-2.5 border-b border-slate-50 last:border-0 last:pb-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="text-sm font-bold text-slate-800 truncate">{c.name}</span>
                                  <span
                                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: c.color + "18", color: c.color }}
                                  >
                                    {c.type}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-1">
                                  {c.day} │ {c.room} │ {c.credit}학점
                                </p>
                                <StarRating rating={4} />
                              </div>
                              <button className="flex-shrink-0 text-[10px] font-semibold text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                                강의정보
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI 추천 이유 */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white text-[10px]">i</span>
                          </div>
                          <p className="text-sm font-bold text-indigo-700">AI 추천 이유</p>
                          <button className="ml-auto text-indigo-400 hover:text-indigo-600">
                            <span className="text-xs">···</span>
                          </button>
                        </div>
                        <ul className="space-y-1.5 relative z-10">
                          {AI_REASONS.map((reason, i) => (
                            <li key={i} className="text-xs text-indigo-800 flex items-start gap-1.5">
                              <span className="text-indigo-500 mt-0.5 flex-shrink-0">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                        <img
                          src={robotImg}
                          alt="AI 로봇"
                          className="absolute -bottom-3 -right-3 w-20 h-20 object-contain opacity-40"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-8">결과가 없습니다.</p>
                )}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setLocation("/request")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" /> 다시 추천받기
              </button>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> PDF 저장
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md">
                  <BookOpen className="w-4 h-4" /> 시간표 적용하기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
