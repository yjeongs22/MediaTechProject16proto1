import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { setData, setCurrentRequestId, type StudentInfo } from "@/lib/storage";
import { ArrowRight, GraduationCap, Upload, X, ImagePlus } from "lucide-react";

export default function RequestPage() {
  const [, setLocation] = useLocation();
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [targetCredit, setTargetCredit] = useState(18);
  const [overToggle, setOverToggle] = useState(false);
  const [overCredit, setOverCredit] = useState(22);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timetableImage, setTimetableImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setTimetableImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!school.trim()) e.school = "학교를 입력해주세요";
    if (!major.trim()) e.major = "학과를 입력해주세요";
    if (!grade) e.grade = "학년을 선택해주세요";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const student: StudentInfo = {
      school,
      major,
      studentNumber,
      grade,
      targetCredit: overToggle ? overCredit : targetCredit,
    };
    setData("planpickStudent", student);
    const requestId = String(Date.now());
    setCurrentRequestId(requestId);
    setLocation("/request/needs");
  }

  return (
    <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Step 1 of 2</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "PlanPickPretendard, 'Noto Sans KR', sans-serif" }}>
            기본 정보 입력
          </h1>
          <p className="text-slate-500 mt-1">AI 시간표 추천을 위한 기본 정보를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">학교</label>
              <input
                data-testid="input-school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="예: OO대학교"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.school ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"}`}
              />
              {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">학과</label>
              <input
                data-testid="input-major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="예: 컴퓨터공학과"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.major ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"}`}
              />
              {errors.major && <p className="text-red-500 text-xs mt-1">{errors.major}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">학번</label>
              <input
                data-testid="input-student-number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="예: 2025"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">학년</label>
              <select
                data-testid="select-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.grade ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"}`}
              >
                <option value="">학년 선택</option>
                <option value="1학년">1학년</option>
                <option value="2학년">2학년</option>
                <option value="3학년">3학년</option>
                <option value="4학년">4학년</option>
              </select>
              {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">이번 학기 목표 학점</label>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-indigo-600">{overToggle ? `${overCredit}학점` : `${targetCredit}학점`}</span>
                <span className="text-sm text-slate-400">1 ~ 21학점</span>
              </div>
              <input
                data-testid="range-credit"
                type="range"
                min={1}
                max={21}
                value={targetCredit}
                disabled={overToggle}
                onChange={(e) => setTargetCredit(Number(e.target.value))}
                className="w-full accent-indigo-600 disabled:opacity-40"
              />
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  data-testid="toggle-over-credit"
                  type="checkbox"
                  checked={overToggle}
                  onChange={(e) => setOverToggle(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm text-slate-600">22학점 이상</span>
              </label>
              {overToggle && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    data-testid="input-over-credit"
                    type="number"
                    min={22}
                    max={40}
                    value={overCredit}
                    onChange={(e) => setOverCredit(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-lg border border-indigo-300 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="text-sm text-slate-600">학점</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              현재 수강 중인 시간표 이미지 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">이미 듣고 있는 수업 시간표를 업로드하면 AI가 해당 시간을 제외하고 추천해드려요.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
            />
            {timetableImage ? (
              <div className="relative rounded-xl overflow-hidden border border-indigo-200 bg-slate-50">
                <img src={timetableImage} alt="업로드된 시간표" className="w-full max-h-56 object-contain" />
                <button
                  type="button"
                  onClick={() => { setTimetableImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✓ 이미지 업로드 완료
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-3">
                  <ImagePlus className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">이미지를 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-slate-400">PNG, JPG, JPEG 지원</p>
              </div>
            )}
          </div>

          <button
            data-testid="btn-next-step"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-md mt-2"
          >
            다음 단계 <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={() => setLocation("/")}
          className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          data-testid="btn-back-home"
        >
          ← 홈으로
        </button>
      </div>
    </div>
  );
}
