"use client";

export function TopNav({ breadcrumb }: { breadcrumb?: string }) {
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-[#10131c]/80 backdrop-blur-xl z-50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">
          VaaniAI
        </span>
        {breadcrumb && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Dashboard</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
            <span className="text-primary font-bold">{breadcrumb}</span>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-bold uppercase tracking-widest">Agent Active</span>
        </div>
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">
          <span className="material-symbols-outlined">language</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
      </div>
    </header>
  );
}
