"use client";
import { useState, useEffect } from "react";

export function TopNav({ breadcrumb }: { breadcrumb?: string }) {
  const [bizName, setBizName] = useState("My Business");
  useEffect(() => {
    const n = localStorage.getItem("business_name");
    if (n) setBizName(n);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 z-30 flex justify-between items-center px-6 py-3.5"
      style={{ background:"rgba(16,19,28,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-3">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-sm">
            <a href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-medium">Dashboard</a>
            <span className="material-symbols-outlined text-sm text-on-surface-variant/40">chevron_right</span>
            <span className="text-on-surface font-bold">{breadcrumb}</span>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Live badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"rgba(70,241,197,0.06)", border:"1px solid rgba(70,241,197,0.15)" }}>
          <span className="status-dot-live" />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color:"#46f1c5" }}>Agent Active</span>
        </div>

        {/* Notif */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
          style={{ border:"1px solid rgba(255,255,255,0.06)" }}>
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" style={{ boxShadow:"0 0 6px rgba(255,180,171,0.6)" }} />
        </button>

        {/* Divider */}
        <div className="w-px h-6" style={{ background:"rgba(255,255,255,0.08)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl cursor-pointer hover:bg-surface-container transition-all">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-on-primary"
            style={{ background:"linear-gradient(135deg,#46f1c5,#c7bfff)" }}>
            {bizName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-on-surface hidden md:block max-w-[120px] truncate">{bizName}</span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
        </div>
      </div>
    </header>
  );
}
