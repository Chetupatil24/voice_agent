"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard",    icon: "dashboard",          label: "Dashboard"     },
  { href: "/calls",        icon: "call",               label: "Calls"         },
  { href: "/transcripts",  icon: "description",        label: "Transcripts"   },
  { href: "/appointments", icon: "event",              label: "Appointments"  },
  { href: "/knowledge",    icon: "database",           label: "Knowledge"     },
  { href: "/settings",     icon: "record_voice_over",  label: "Voice Agents"  },
  { href: "/billing",      icon: "payments",           label: "Billing"       },
  { href: "/account",      icon: "manage_accounts",    label: "Account"       },
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
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-6 z-40 sidebar-bg">
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 4px 15px rgba(70,241,197,0.3)" }}>
            <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>mic</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-primary font-headline tracking-tight leading-none">VaaniAI</h1>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-bold">AI Voice Platform</p>
          </div>
        </div>
      </div>

      {/* Live stats pill */}
      <div className="mx-5 mb-6 px-3 py-2 rounded-xl flex items-center gap-2.5" style={{ background:"rgba(70,241,197,0.06)", border:"1px solid rgba(70,241,197,0.12)" }}>
        <span className="status-dot-live flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary truncate">Agent Active</p>
          <p className="text-[9px] text-on-surface-variant truncate">3 calls in queue</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
        {nav.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group",
                active
                  ? "nav-active"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <span
                className={cn("material-symbols-outlined text-xl transition-all", active ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface")}
                style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {icon}
              </span>
              <span className="text-[11px] uppercase tracking-widest font-bold truncate">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* New Campaign CTA */}
      <div className="px-5 mt-4 mb-4">
        <button className="w-full py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-widest text-on-primary hover:opacity-90 active:scale-95 transition-all"
          style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 4px 15px rgba(70,241,197,0.25)" }}>
          + New Campaign
        </button>
      </div>

      {/* Bottom */}
      <div className="px-5 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <a href="/help" className="flex items-center gap-3 py-2 rounded-xl px-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all">
          <span className="material-symbols-outlined text-xl">help_outline</span>
          <span className="text-[11px] uppercase tracking-widest font-bold">Support</span>
        </a>
        <button onClick={logout} className="w-full flex items-center gap-3 py-2 rounded-xl px-3 text-on-surface-variant hover:bg-error/10 hover:text-error transition-all">
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-[11px] uppercase tracking-widest font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
