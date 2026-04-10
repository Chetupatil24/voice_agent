"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-on-surface font-sans overflow-hidden">
        {/* TopNav */}
        <nav className="fixed top-0 w-full z-50 bg-[#10131c]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] font-headline tracking-tight">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
              VaaniAI
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Dashboard</Link>
              <Link href="/calls" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Calls</Link>
              <Link href="/settings" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Main Canvas */}
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(70,241,197,0.15) 0%, rgba(16,19,28,0) 70%)"
              }}
            />
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full blur-[1px] opacity-40" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-secondary rounded-full blur-[2px] opacity-20" />
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary-container rounded-full blur-[1px] opacity-30" />
            <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full blur-[1px] opacity-50" />
            {/* Animated Waveform */}
            <div className="absolute bottom-0 left-0 w-full h-64 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 1440 200" preserveAspectRatio="none">
                <path
                  d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 L1440,100"
                  fill="none" stroke="#46f1c5" strokeWidth="2"
                  strokeDasharray="1000" strokeDashoffset="1000"
                  style={{ animation: "dash 5s linear infinite" }}
                />
                <path
                  d="M0,120 C300,180 500,20 700,120 C900,180 1100,20 1440,120"
                  fill="none" stroke="#c7bfff" strokeWidth="1"
                  strokeDasharray="1000" strokeDashoffset="1000"
                  style={{ animation: "dash 5s linear infinite", animationDelay: "-2s" }}
                />
              </svg>
            </div>
          </div>

          <style>{`
            @keyframes dash { to { stroke-dashoffset: 0; } }
          `}</style>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            {/* 404 Hero */}
            <div className="mb-8 relative inline-block">
              <h1
                className="font-headline font-bold leading-none tracking-tighter text-transparent bg-clip-text opacity-80"
                style={{
                  fontSize: "clamp(8rem,18vw,18rem)",
                  background: "linear-gradient(to bottom, #46f1c5, rgba(70,241,197,0.4), transparent)",
                  WebkitBackgroundClip: "text",
                }}
              >
                404
              </h1>
              {/* Glitch overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <span
                  className="font-headline font-bold leading-none tracking-tighter text-secondary blur-sm translate-x-2 select-none"
                  style={{ fontSize: "clamp(8rem,18vw,18rem)" }}
                >
                  404
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4327c4]/20 border border-secondary/15">
                <span className="material-symbols-outlined text-secondary text-sm">satellite_alt</span>
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">Signal Interrupted</span>
              </div>
              <h2 className="font-headline text-3xl md:text-5xl font-semibold text-on-surface">
                The page you&apos;re looking for has drifted off the radar.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                It seems our intelligence probe has encountered a void. Let&apos;s get you back to the center of command.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_40px_rgba(70,241,197,0.3)] active:scale-95"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                Return to Dashboard
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 border border-outline-variant/30 hover:border-primary/40 text-on-surface px-8 py-4 rounded-xl font-semibold bg-surface-container-low/50 backdrop-blur-sm transition-all hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-primary">contact_support</span>
                Contact Support
              </Link>
            </div>

            {/* Status Footer */}
            <div className="mt-16 pt-8 border-t border-outline-variant/10 max-w-xs mx-auto">
              <div className="flex items-center justify-center gap-4 text-on-surface-variant/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-sans uppercase tracking-tighter">Core Active</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant" />
                <span className="text-xs font-sans uppercase tracking-tighter">Lat: 0.0004</span>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden flex justify-around items-center px-4 py-3 bg-[#10131c]/90 backdrop-blur-md rounded-t-2xl border-t border-on-surface-variant/10">
          <Link href="/dashboard" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
            <span className="material-symbols-outlined">grid_view</span>
            <span>Home</span>
          </Link>
          <Link href="/calls" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
            <span className="material-symbols-outlined">call</span>
            <span>Calls</span>
          </Link>
          <Link href="/help" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
            <span className="material-symbols-outlined">help</span>
            <span>Help</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
            <span className="material-symbols-outlined">menu</span>
            <span>Menu</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
