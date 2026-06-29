import React from "react";
import { Link } from "wouter";
import { 
  Home, 
  CalendarDays, 
  BookOpen, 
  Search, 
  ShoppingCart, 
  Bell, 
  Settings 
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-full w-[60px] bg-white border-r border-border flex flex-col items-center py-4 z-50">
      <div className="flex flex-col gap-6 w-full items-center mt-4">
        <Link href="/">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full cursor-pointer hover:bg-indigo-200 transition-colors" data-testid="nav-home">
            <Home className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-calendar">
            <CalendarDays className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-courses">
            <BookOpen className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-search">
            <Search className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-cart">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </Link>
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-alerts">
            <Bell className="w-5 h-5" />
          </div>
        </Link>
      </div>
      <div className="mt-auto mb-4">
        <Link href="/">
          <div className="p-3 text-muted-foreground hover:bg-slate-100 rounded-full cursor-pointer transition-colors" data-testid="nav-settings">
            <Settings className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
