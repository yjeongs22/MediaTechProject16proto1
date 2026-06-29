import React from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  CalendarDays,
  BookOpen,
  Search,
  ShoppingCart,
  Bell,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, href: "/", label: "홈" },
  { icon: CalendarDays, href: "/results", label: "내 시간표" },
  { icon: BookOpen, href: "/request", label: "강의목록" },
  { icon: Search, href: "/request", label: "과목검색" },
  { icon: ShoppingCart, href: "/request", label: "위시과목" },
  { icon: Bell, href: "/", label: "알림" },
];

export function Sidebar() {
  const [location] = useLocation();

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  return (
    <div className="fixed top-0 left-0 h-full w-[60px] bg-white border-r border-border flex flex-col items-center py-4 z-50">
      <div className="flex flex-col gap-5 w-full items-center mt-4">
        {NAV_ITEMS.map(({ icon: Icon, href, label }) => (
          <Link key={label} href={href}>
            <div
              title={label}
              data-testid={`nav-${label}`}
              className={`p-3 rounded-full cursor-pointer transition-colors ${
                isActive(href)
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-muted-foreground hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-auto mb-4">
        <Link href="/">
          <div
            title="설정"
            data-testid="nav-settings"
            className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
          >
            <Settings className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
