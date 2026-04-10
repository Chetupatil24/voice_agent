"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sidebar } from "@/components/Sidebar";
import { getCalls } from "@/lib/api";
import { getTenantId, formatDateTime, formatDuration, cn } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "completed", "missed", "in_progress"];

const mockVolume = [
  { time: "09", calls: 42 }, { time: "10", calls: 78 }, { time: "11", calls: 95 },
  { time: "12", calls: 120 }, { time: "13", calls: 88 }, { time: "14", calls: 134 },
  { time: "15", calls: 112 }, { time: "16", calls: 145 }, { time: "17", calls: 98 },
  { time: "18", calls: 62 }, { time: "19", calls: 45 }, { time: "20", calls: 28 },
];

const mockLive = [
  { id: 4920, phone: "#4920", intent: "Book Appointment", duration: "2:14" },
  { id: 4921, phone: "#4921", intent: "Product Inquiry", duration: "1:42" },
  { id: 4922, phone: "#4922", intent: "Support Request", duration: "3:08" },
  { id: 4923, phone: "#4923", intent: "Pricing Query", duration: "0:55" },
];

export default function CallsPage() {
  const tenantId = getTenantId();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["calls", tenantId, status, page],
    queryFn: () => getCalls(tenantId, { skip: page * limit, limit, status: status === "all" ? undefined : status }),
    enabled: !!tenantId,
  });

  const calls: Record<string, unknown>[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const filtered = search ? calls.filter(c => String(c.caller_phone ?? "").toLowerCase().includes(search.toLowerCase())) : calls;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Calls & Monitoring</h1>
            <p className="text-xs text-on-surface-variant">{total || "2,842"} total calls this period</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search caller..."
                className="pl-10 pr-4 py-2 text-sm rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary w-48" />
            </div>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}
              className="px-4 py-2 text-sm rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}</option>)}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              Deploy AI
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Calls</p>
              <p className="text-3xl font-headline font-bold text-on-surface mt-1">{total || "2,842"}</p>
              <p className="text-xs text-primary mt-2">+14.2% from last week</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Avg Sentiment</p>
              <p className="text-3xl font-headline font-bold text-on-surface mt-1">88%</p>
              <p className="text-xs text-green-400 mt-2">Positive trend</p>
            </div>
          </div>

          {/* Volume chart */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-on-surface">Call Volume Trend</h2>
              <span className="text-xs text-on-surface-variant">Today, hourly</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockVolume} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke="rgba(186,202,194,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "#bacac2", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}:00`} />
                <YAxis tick={{ fill: "#bacac2", fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ background: "#1c2028", border: "1px solid rgba(59,74,68,0.3)", borderRadius: 12, fontSize: 12, color: "#e0e2ee" }} cursor={{ fill: "rgba(70,241,197,0.05)" }} />
                <Bar dataKey="calls" fill="#46f1c5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Live Now */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-headline font-bold text-on-surface">Live Now</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary">{mockLive.length} ACTIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {mockLive.map(call => (
                <div key={call.id} className="bg-surface-container-low rounded-2xl p-4 border border-primary/10 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    </div>
                    <span className="text-xs font-bold text-primary">● {call.duration}</span>
                  </div>
                  <p className="font-bold text-on-surface text-sm">Customer {call.phone}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{call.intent}</p>
                  <button className="w-full mt-3 py-2 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
                    Listen Live
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Call History */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <h2 className="font-headline font-bold text-on-surface">Call History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Time / Customer</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Duration</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Intent</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sentiment</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-6 py-4"><div className="h-4 bg-surface-container-high animate-pulse rounded" /></td>
                          ))}
                        </tr>
                      ))
                    : filtered.length > 0
                    ? filtered.map(call => (
                        <tr key={String(call.id)} className="hover:bg-surface-container/40 transition-colors group cursor-pointer" onClick={() => window.location.href = `/transcripts?call=${call.id}`}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-on-surface font-mono text-sm">{String(call.caller_phone ?? "Unknown")}</p>
                            <p className="text-xs text-on-surface-variant">{call.created_at ? formatDateTime(String(call.created_at)) : "—"}</p>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant font-mono text-sm">
                            {call.duration_seconds ? formatDuration(Number(call.duration_seconds)) : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                              {String(call.detected_intent ?? "General Inquiry")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn("flex items-center gap-1.5 text-xs font-bold",
                              String(call.status) === "completed" ? "text-primary" :
                              String(call.status) === "missed" ? "text-error" : "text-tertiary"
                            )}>
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {String(call.status) === "completed" ? "check_circle" : String(call.status) === "missed" ? "cancel" : "radio_button_checked"}
                              </span>
                              {String(call.status ?? "—").charAt(0).toUpperCase() + String(call.status ?? "").slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {call.sentiment_score != null ? (
                              <span className="material-symbols-outlined text-xl" style={{
                                color: Number(call.sentiment_score) > 0.2 ? "#46f1c5" : Number(call.sentiment_score) < -0.2 ? "#ffb4ab" : "#bacac2",
                                fontVariationSettings: `'FILL' 1`
                              }}>
                                {Number(call.sentiment_score) > 0.2 ? "sentiment_very_satisfied" : Number(call.sentiment_score) < -0.2 ? "sentiment_dissatisfied" : "sentiment_neutral"}
                              </span>
                            ) : <span className="text-on-surface-variant/30">—</span>}
                          </td>
                          <td className="px-6 py-4">
                            <button className="px-3 py-1.5 rounded-lg border border-outline-variant/20 text-xs text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100">
                              View Transcript
                            </button>
                          </td>
                        </tr>
                      ))
                    : (
                        // Mock rows when no real data
                        [
                          { phone: "+91 98765 43210", time: "2:14 PM", duration: "4m 12s", intent: "Book Appointment", status: "completed", sentiment: 0.8 },
                          { phone: "+91 87654 32109", time: "1:58 PM", duration: "2m 44s", intent: "Pricing Query", status: "completed", sentiment: 0.4 },
                          { phone: "+91 76543 21098", time: "1:32 PM", duration: "0m 22s", intent: "Support Request", status: "missed", sentiment: -0.3 },
                          { phone: "+91 65432 10987", time: "12:45 PM", duration: "6m 01s", intent: "Product Inquiry", status: "completed", sentiment: 0.6 },
                        ].map((c, i) => (
                          <tr key={i} className="hover:bg-surface-container/40 transition-colors group cursor-pointer">
                            <td className="px-6 py-4">
                              <p className="font-bold text-on-surface font-mono text-sm">{c.phone}</p>
                              <p className="text-xs text-on-surface-variant">{c.time}</p>
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant font-mono text-sm">{c.duration}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">{c.intent}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn("flex items-center gap-1.5 text-xs font-bold", c.status === "completed" ? "text-primary" : "text-error")}>
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{c.status === "completed" ? "check_circle" : "cancel"}</span>
                                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="material-symbols-outlined text-xl" style={{ color: c.sentiment > 0.3 ? "#46f1c5" : c.sentiment < 0 ? "#ffb4ab" : "#bacac2", fontVariationSettings: "'FILL' 1" }}>
                                {c.sentiment > 0.3 ? "sentiment_very_satisfied" : c.sentiment < 0 ? "sentiment_dissatisfied" : "sentiment_neutral"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="px-3 py-1.5 rounded-lg border border-outline-variant/20 text-xs text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100">
                                View Transcript
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant/10 text-xs text-on-surface-variant">
              <span>Showing {page * limit + 1}–{Math.min(page * limit + limit, total || 20)} of {total || 20}</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-all text-xs font-bold">
                  Prev
                </button>
                <button disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/20 text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-all text-xs font-bold">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_call</span>
      </button>
    </div>
  );
}
