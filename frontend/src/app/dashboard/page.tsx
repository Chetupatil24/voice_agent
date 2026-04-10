"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { getDashboardStats } from "@/lib/api";
import { DashboardSocket } from "@/lib/websocket";
import { getTenantId, formatDuration } from "@/lib/utils";

const mockTrend = [
  { day: "Mon", inbound: 180, outbound: 60 },
  { day: "Tue", inbound: 220, outbound: 80 },
  { day: "Wed", inbound: 195, outbound: 70 },
  { day: "Thu", inbound: 210, outbound: 90 },
  { day: "Fri", inbound: 240, outbound: 85 },
  { day: "Sat", inbound: 160, outbound: 50 },
  { day: "Sun", inbound: 190, outbound: 62 },
];

const mockFeed = [
  { id: 1, status: "ongoing", phone: "+91 98765 43210", label: "Appointment", time: "2m ago", color: "text-primary" },
  { id: 2, status: "completed", phone: "+91 99887 76655", label: "Resolved", time: "5m ago", color: "text-secondary" },
  { id: 3, status: "ongoing", phone: "+91 87654 32109", label: "Appointment", time: "8m ago", color: "text-primary" },
  { id: 4, status: "missed", phone: "+91 76543 21098", label: "Missed", time: "12m ago", color: "text-error" },
];

export default function DashboardPage() {
  const tenantId = getTenantId();
  const [liveEvent, setLiveEvent] = useState<string | null>(null);

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-stats", tenantId],
    queryFn: () => getDashboardStats(tenantId, 30),
    enabled: !!tenantId,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!tenantId) return;
    const socket = new DashboardSocket(tenantId);
    socket.connect();
    socket.on("call_completed", (d) => {
      setLiveEvent(`New call ended — sentiment: ${(d as { sentiment?: string })?.sentiment ?? "–"}`);
      refetch();
    });
    socket.on("appointment_created", (d) => {
      setLiveEvent(`New appointment booked: ${(d as { customer_name?: string })?.customer_name ?? ""}`);
      refetch();
    });
    return () => socket.disconnect();
  }, [tenantId, refetch]);

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Session expired.</p>
          <a href="/login" className="text-primary font-bold hover:underline">Sign in</a>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Calls Today", value: stats?.calls?.total ?? 1284, sub: "+12% from yesterday", pct: 64, icon: "call", color: "text-primary", bar: "bg-primary" },
    { label: "Resolved", value: stats?.calls?.total ? stats.calls.total - (stats.calls.missed ?? 0) : 892, sub: "70% resolution rate", pct: 70, icon: "check_circle", color: "text-secondary", bar: "bg-secondary" },
    { label: "Appointments", value: stats?.appointments?.total ?? 142, sub: `${stats?.appointments?.upcoming ?? 18} upcoming`, pct: 42, icon: "calendar_month", color: "text-tertiary", bar: "bg-tertiary" },
    { label: "Avg Duration", value: formatDuration(stats?.calls?.avg_duration_secs ?? 252), sub: "4m 12s per call", pct: 55, icon: "timer", color: "text-primary", bar: "bg-primary" },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Dashboard</h1>
            <p className="text-xs text-on-surface-variant">Calls Intelligence Overview</p>
          </div>
          <div className="flex items-center gap-3">
            {liveEvent && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-bold mr-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {liveEvent}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-on-surface-variant">Agent Active</span>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-on-primary text-sm">A</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stat cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statCards.map(card => (
                <div key={card.label} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5 hover:bg-surface-container transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{card.label}</p>
                      <p className="text-3xl font-headline font-bold text-on-surface mt-1">{card.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center ${card.color}`}>
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${card.bar} rounded-full`} style={{ width: `${card.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-2">{card.sub}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left+Center */}
            <div className="lg:col-span-2 space-y-6">
              {/* Call Volume Trends */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-headline font-bold text-on-surface">Call Volume Trends</h2>
                    <p className="text-xs text-on-surface-variant">Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-primary inline-block" />Inbound</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-secondary/60 inline-block" />Outbound</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={(stats?.daily_trend as typeof mockTrend) ?? mockTrend} barCategoryGap="30%">
                    <CartesianGrid vertical={false} stroke="rgba(186,202,194,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: "#bacac2", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#bacac2", fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                    <Tooltip contentStyle={{ background: "#1c2028", border: "1px solid rgba(59,74,68,0.3)", borderRadius: 12, fontSize: 12, color: "#e0e2ee" }} />
                    <Bar dataKey="inbound" fill="#46f1c5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outbound" fill="rgba(199,191,255,0.4)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Real-time Calls Feed */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline font-bold text-on-surface">Real-time Calls Feed</h2>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-primary">LIVE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {mockFeed.map(call => (
                    <div key={call.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container group transition-all cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center ${call.color}`}>
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {call.status === "missed" ? "call_missed" : call.status === "ongoing" ? "call" : "call_received"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-on-surface truncate">{call.phone}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${call.status === "ongoing" ? "bg-primary/10 text-primary" : call.status === "missed" ? "bg-error/10 text-error" : "bg-secondary/10 text-secondary"}`}>{call.label}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{call.time}</p>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-6">
              {/* AI Agent Widget */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-on-surface">Priya AI</h3>
                      <p className="text-xs text-primary font-bold">Active</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center pulse-ring">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 h-8 mb-4">
                    {[3, 5, 8, 4, 6, 3, 7, 5].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/40 rounded-full animate-bounce" style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-on-surface-variant">Lang</p>
                      <p className="text-sm font-bold text-on-surface">EN / HI</p>
                    </div>
                    <div className="w-px bg-outline-variant/20" />
                    <div className="flex-1 text-center">
                      <p className="text-xs text-on-surface-variant">Model</p>
                      <p className="text-sm font-bold text-on-surface">Sarvam</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 rounded-xl border border-error/30 text-error text-sm font-bold hover:bg-error/10 transition-all">
                    Emergency Stop
                  </button>
                </div>
              </div>

              {/* Workspace Health */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
                <h3 className="font-bold text-on-surface mb-4">Workspace Health</h3>
                <div className="space-y-4">
                  {[
                    { label: "API Latency", val: "124ms", pct: 24, color: "bg-primary" },
                    { label: "Server Load", val: "42%", pct: 42, color: "bg-secondary" },
                    { label: "STT Clarity", val: "98.2%", pct: 98, color: "bg-green-400" },
                  ].map(h => (
                    <div key={h.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-on-surface-variant">{h.label}</span>
                        <span className="text-xs font-bold text-on-surface">{h.val}</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${h.color} rounded-full`} style={{ width: `${h.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
                <h3 className="font-bold text-on-surface mb-4">Upcoming</h3>
                <div className="space-y-3">
                  {[
                    { name: "Ravi Kumar", time: "2:30 PM", type: "Consultation" },
                    { name: "Priya Sharma", time: "4:00 PM", type: "Follow-up" },
                    { name: "Amit Singh", time: "5:15 PM", type: "New Patient" },
                  ].map(a => (
                    <div key={a.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0">
                        {a.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{a.name}</p>
                        <p className="text-xs text-on-surface-variant">{a.type}</p>
                      </div>
                      <span className="text-xs font-bold text-primary">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

