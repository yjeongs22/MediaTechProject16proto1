import React from "react";
import { Link } from "wouter";
import { Bell, ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNav() {
  return (
    <div className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center">
        <Link href="/">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" data-testid="logo">
            PlanPick
          </span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="/">
          <span className="text-sm font-medium text-foreground border-b-2 border-indigo-600 pb-1 cursor-pointer" data-testid="link-dashboard">
            대시보드
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-register">
            수강신청
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-timetable">
            시간표
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-reqs">
            졸업요건
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-ai">
            상담AI
          </span>
        </Link>
        <Link href="/">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-mypage">
            마이페이지
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:bg-slate-100 rounded-full transition-colors relative" data-testid="btn-notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors" data-testid="btn-profile">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-indigo-100 text-indigo-700">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
