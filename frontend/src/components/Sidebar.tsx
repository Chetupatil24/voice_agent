"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/calls", icon: "call", label: "Calls" },
  { href: "/transcripts", icon: "description", label: "Transcripts" },
  { href: "/appointments", icon: "event", label: "Appointments" },
  { href: "/knowledge", icon: "database", label: "Knowledge Base" },
  { href: "/settings", icon: "record_voice_over", label: "Voice Agents" },
  { href: "/billing", icon: "payments", label: "Billing" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("tenant_id");
    router.replace("/login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#10131c] flex flex-col py-8 border-r border-[#31353e]/15 z-40">
      {/* Logo */}
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">VaaniAI</h1>
        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold mt-1">AI Voice Intelligence</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all duration-200 font-medium text-sm",
                active
                  ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border-r-2 border-primary"
                  : "text-[#bacac2] hover:bg-[#1c2028] hover:text-white"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="text-[11px] uppercase tracking-widest font-bold">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-6 space-y-4">
        <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-3 px-4 rounded-xl text-[11px] uppercase tracking-widest transition-transform active:scale-95">
          New Campaign
        </button>
        <div className="pt-4 border-t border-[#3b4a44]/30">
          <a href="#" className="text-[#bacac2] flex items-center gap-3 py-2 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="text-[11px] uppercase tracking-widest font-bold">Support</span>
          </a>
          <button
            onClick={logout}
            className="text-[#bacac2] flex items-center gap-3 py-2 hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-[11px] uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
