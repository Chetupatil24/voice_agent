"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-on-surface font-sans overflow-x-hidden">
        {/* TopNav */}
        <nav className="fixed top-0 w-full z-50 bg-[#10131c]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold font-headline tracking-tight bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
              VaaniAI
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm">Dashboard</Link>
              <Link href="/calls" className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm">Calls</Link>
              <Link href="/settings" className="text-on-surface-variant hover:text-primary transition-colors font-headline text-sm">Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold px-5 py-2 rounded-xl text-sm active:scale-95 transition-transform"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Error Canvas */}
        <main className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
          {/* Ambient background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-error/5 rounded-full blur-[120px] pointer-events-none" />

          <style>{`
            .glitch-text {
              text-shadow: 2px 0 #93000a, -2px 0 #46f1c5;
            }
          `}</style>

          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Illustration */}
            <div className="flex flex-col items-center md:items-end justify-center order-2 md:order-1">
              <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
                {/* Broken Waveform SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full opacity-40" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#ffb4ab", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#93000a", stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M50,200 L120,200 L140,120 L160,280 L180,200 L250,200" fill="none" stroke="url(#errorGrad)" strokeWidth="4" />
                    <path className="opacity-30" d="M260,180 L280,220 L300,160 L320,240 L350,200" fill="none" stroke="#46f1c5" strokeWidth="2" />
                    <circle cx="250" cy="200" r="4" fill="#ffb4ab" />
                    <line x1="240" y1="190" x2="260" y2="210" stroke="#93000a" strokeWidth="2" />
                    <line x1="260" y1="190" x2="240" y2="210" stroke="#93000a" strokeWidth="2" />
                  </svg>
                </div>
                {/* 500 Number */}
                <div className="relative">
                  <h1 className="font-headline font-bold leading-none tracking-tighter glitch-text"
                    style={{ fontSize: "clamp(6rem,16vw,12rem)", color: "#ffdad6" }}>
                    500
                  </h1>
                  <div className="absolute -inset-4 border border-error/20 rounded-2xl blur-sm pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col text-center md:text-left order-1 md:order-2">
              <div className="mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container/30 text-error text-xs font-bold tracking-widest uppercase">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                  System Anomaly Detected
                </span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6 text-on-surface leading-tight">
                Our AI is having <br />
                <span className="text-error">a moment.</span>
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 max-w-md">
                We&apos;re on it. The neural engine encountered an unexpected fracture in the data stream. Your progress is safe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => reset()}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-[0_12px_24px_-8px_rgba(70,241,197,0.3)]"
                >
                  Try Refreshing
                </button>
                <Link
                  href="/help"
                  className="px-8 py-4 bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold rounded-xl border border-outline-variant/15 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">analytics</span>
                  System Status
                </Link>
              </div>

              {/* Error trace */}
              <div className="mt-12 pt-8 border-t border-outline-variant/10">
                <div className="flex items-center justify-between text-on-surface-variant/60">
                  <span className="text-xs font-sans uppercase tracking-widest">
                    Error: {error?.digest ?? "VAI-992-005X"}
                  </span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Status Ticker */}
        <footer className="fixed bottom-0 w-full px-6 py-4 flex items-center justify-between border-t border-outline-variant/5 bg-surface/50 backdrop-blur-sm z-40">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_8px_#ffb4ab]" />
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-on-surface-variant">Core Engine Offline</span>
          </div>
          <div className="hidden md:flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-sans text-on-surface-variant/50 uppercase">Latency</span>
              <span className="text-[10px] font-headline text-error">-- ms</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-sans text-on-surface-variant/50 uppercase">Uptime</span>
              <span className="text-[10px] font-headline text-primary">99.92%</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
