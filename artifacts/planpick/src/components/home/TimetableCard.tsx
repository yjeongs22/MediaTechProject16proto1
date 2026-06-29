import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function TimetableCard() {
  const days = ["월", "화", "수", "목", "금"];
  const times = ["09", "10", "11", "12", "13", "14", "15", "16", "17"];

  // Mock class data
  const classes = [
    { day: 0, start: 1, duration: 2, color: "bg-indigo-100 border-indigo-200" },
    { day: 0, start: 4, duration: 1.5, color: "bg-purple-100 border-purple-200" },
    { day: 1, start: 0, duration: 1.5, color: "bg-blue-100 border-blue-200" },
    { day: 1, start: 3, duration: 2, color: "bg-pink-100 border-pink-200" },
    { day: 2, start: 1, duration: 2, color: "bg-indigo-100 border-indigo-200" },
    { day: 3, start: 0, duration: 1.5, color: "bg-blue-100 border-blue-200" },
    { day: 3, start: 5, duration: 2, color: "bg-fuchsia-100 border-fuchsia-200" },
    { day: 4, start: 2, duration: 3, color: "bg-violet-100 border-violet-200" },
  ];

  return (
    <Card className="border-0 shadow-lg rounded-2xl h-[380px] overflow-hidden bg-white">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        <div className="flex border-b border-slate-100 px-2 py-3 bg-slate-50/50">
          <div className="w-10"></div>
          {days.map((day, i) => (
            <div key={i} className="flex-1 text-center text-xs font-medium text-slate-500">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex-1 flex overflow-hidden relative pb-4">
          {/* Time Labels */}
          <div className="w-10 flex flex-col border-r border-slate-50">
            {times.map((time, i) => (
              <div key={i} className="flex-1 flex items-start justify-center pt-2 text-[10px] text-slate-400">
                {time}
              </div>
            ))}
          </div>

          {/* Grid Lines & Classes container */}
          <div className="flex-1 relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col">
              {times.map((_, i) => (
                <div key={i} className="flex-1 border-b border-slate-50"></div>
              ))}
            </div>

            {/* Vertical Grid Lines */}
            <div className="absolute inset-0 flex">
              {days.map((_, i) => (
                <div key={i} className="flex-1 border-r border-slate-50"></div>
              ))}
            </div>

            {/* Class Blocks */}
            <div className="absolute inset-0 pt-0 px-0">
              {classes.map((cls, i) => (
                <div
                  key={i}
                  className={`absolute rounded border ${cls.color} opacity-80 shadow-sm`}
                  style={{
                    left: `${(cls.day / 5) * 100}%`,
                    width: `${100 / 5}%`,
                    top: `${(cls.start / times.length) * 100}%`,
                    height: `${(cls.duration / times.length) * 100}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
