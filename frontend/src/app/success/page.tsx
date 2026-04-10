"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const agentName = params.get("agent") ?? "Priya";
  const model = params.get("model") ?? "V4-Pro";

  return (
    <main className="lg:ml-64 min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Kinetic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #46f1c5 1px, transparent 1px), radial-gradient(circle, #c7bfff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
            opacity: 0.1,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full" />
        {/* Confetti */}
        <div className="absolute top-20 left-[10%] w-2 h-8 bg-primary/20 rotate-45 rounded-full" />
        <div className="absolute top-40 right-[15%] w-2 h-8 bg-secondary/20 -rotate-12 rounded-full" />
        <div className="absolute bottom-20 left-[20%] w-6 h-2 bg-primary/20 rotate-12 rounded-full" />
        <div className="absolute top-[60%] right-[10%] w-8 h-2 bg-secondary/20 rotate-45 rounded-full" />
      </div>

      <style>{`
        .pulse-ring-1 { animation: pulse-scale 3s cubic-bezier(0.4,0,0.6,1) infinite; }
        .pulse-ring-2 { animation: pulse-scale 3s cubic-bezier(0.4,0,0.6,1) infinite 0.5s; }
        .pulse-ring-3 { animation: pulse-scale 3s cubic-bezier(0.4,0,0.6,1) infinite 1s; }
        @keyframes pulse-scale {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* Success Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-12 flex flex-col items-center">
        {/* Pulse Rings + Checkmark */}
        <div className="relative mb-12 w-32 h-32">
          <div className="absolute inset-0 pulse-ring-1 rounded-full border border-secondary/30" />
          <div className="absolute inset-0 pulse-ring-2 rounded-full border border-secondary/15" />
          <div className="absolute inset-0 pulse-ring-3 rounded-full border border-secondary/5" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_50px_rgba(70,241,197,0.3)]">
            <span
              className="material-symbols-outlined text-on-primary"
              style={{ fontSize: "3.5rem", fontVariationSettings: "'wght' 600" }}
            >
              check
            </span>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center mb-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">
            Configuration Saved Successfully!
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
            Your new AI parameters have been synchronized across all enterprise endpoints.
          </p>
        </div>

        {/* Summary Card */}
        <div className="w-full bg-surface-container-low p-1 rounded-2xl mb-12 shadow-2xl">
          <div className="bg-surface-container rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-primary uppercase tracking-widest text-[10px] font-bold mb-1 block">Live Status</span>
              <h3 className="font-headline text-xl font-bold text-on-surface">Agent {agentName} is now active</h3>
              <p className="text-sm text-on-surface-variant mt-1">Configured for Customer Success (Tier 1)</p>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <div className="px-3 py-1 bg-[#4327c4]/20 rounded-full">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Model: {model}</span>
              </div>
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Latency: 42ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Go to Dashboard</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <button
            onClick={() => router.push("/calls")}
            className="px-8 py-4 bg-surface-container-high text-on-surface font-semibold rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">monitoring</span>
            <span>View Recent Activity</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Sidebar (reuse client sidebar pattern) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/15 hidden lg:flex flex-col z-40">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <h1 className="font-headline text-primary font-bold text-lg leading-none">VaaniAI</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1 font-bold">Enterprise Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { icon: "home", label: "Home", href: "/dashboard" },
            { icon: "settings_voice", label: "Voice Lab", href: "/settings" },
            { icon: "history", label: "History", href: "/calls" },
            { icon: "payments", label: "Billing", href: "/billing" },
          ].map(({ icon, label, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest hover:text-white transition-all rounded-lg"
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/10 space-y-1">
          <a href="/help" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">description</span>
            <span className="text-xs">Documentation</span>
          </a>
          <button className="w-full mt-4 py-2 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-all border border-primary/10">
            Upgrade Plan
          </button>
        </div>
      </aside>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><span className="text-on-surface-variant">Loading…</span></div>}>
        <SuccessContent />
      </Suspense>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-[#10131c]/90 backdrop-blur-md flex justify-around items-center px-4 py-3 border-t border-on-surface-variant/10">
        <a href="/dashboard" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
          <span className="material-symbols-outlined">grid_view</span>
          <span>Home</span>
        </a>
        <a href="/calls" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
          <span className="material-symbols-outlined">pulse_alert</span>
          <span>Activity</span>
        </a>
        <a href="/settings" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
          <span className="material-symbols-outlined">assignment</span>
          <span>Tasks</span>
        </a>
        <a href="#" className="flex flex-col items-center text-on-surface-variant text-[10px] uppercase tracking-widest gap-1">
          <span className="material-symbols-outlined">menu</span>
          <span>Menu</span>
        </a>
      </nav>
    </div>
  );
}
