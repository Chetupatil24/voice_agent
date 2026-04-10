"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

const metricCards = [
  { label: "Total Clients", value: "1,284", change: "+8.2%", icon: "groups", color: "text-primary", bg: "bg-primary/10" },
  { label: "Active Agents", value: "8,421", change: "+12.1%", icon: "smart_toy", color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Current MRR", value: "$242k", change: "+5.4%", icon: "payments", color: "text-tertiary", bg: "bg-tertiary/10" },
  { label: "Avg Call Duration", value: "4:12", change: "+0.3%", icon: "timer", color: "text-primary", bg: "bg-primary/10" },
  { label: "Conversion Rate", value: "14.8%", change: "+1.2%", icon: "trending_up", color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Daily Tokens", value: "4.2M", change: "+18.5%", icon: "token", color: "text-tertiary", bg: "bg-tertiary/10" },
];

const mrrData = [
  { month: "Aug", mrr: 182000 },
  { month: "Sep", mrr: 195000 },
  { month: "Oct", mrr: 208000 },
  { month: "Nov", mrr: 218000 },
  { month: "Dec", mrr: 231000 },
  { month: "Jan", mrr: 242100 },
];

const clients = [
  { name: "QuickKart India", plan: "Enterprise", utilization: 92, status: "Healthy", renewal: "Mar 2024" },
  { name: "Vaani Dental Clinic", plan: "Growth", utilization: 78, status: "Healthy", renewal: "Feb 2024" },
  { name: "TechServe Solutions", plan: "Growth", utilization: 45, status: "Healthy", renewal: "Apr 2024" },
  { name: "Patil Motors", plan: "Starter", utilization: 98, status: "At Risk", renewal: "Feb 2024" },
  { name: "BrightEdu Academy", plan: "Enterprise", utilization: 67, status: "Healthy", renewal: "Jun 2024" },
];

const sysHealth = [
  { label: "API Gateway", val: "42ms", pct: 20, status: "Operational", color: "bg-primary" },
  { label: "STT Engine", val: "99.8%", pct: 99.8, status: "Operational", color: "bg-primary" },
  { label: "PostgreSQL DB", val: "12ms", pct: 10, status: "Operational", color: "bg-primary" },
  { label: "Infrastructure", val: "64%", pct: 64, status: "Normal Load", color: "bg-tertiary" },
];

export default function AdminPage() {
  const [mrrRange, setMrrRange] = useState("6M");

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">VaaniAI</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-error/10 text-error border border-error/20 uppercase tracking-widest">Owner Portal</span>
        </div>
        <nav className="flex items-center gap-6">
          {[{ icon: "dashboard", label: "Overview", active: true }, { icon: "groups", label: "Clients" }, { icon: "analytics", label: "Analytics" }, { icon: "settings", label: "System" }].map(n => (
            <button key={n.label} className={`flex items-center gap-1.5 text-sm font-bold py-1 border-b-2 transition-all ${n.active ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}>
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: n.active ? "'FILL' 1" : "'FILL' 0" }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">notifications</span>
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-error to-tertiary flex items-center justify-center font-bold text-white text-sm">A</div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricCards.map(card => (
            <div key={card.label} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5 hover:bg-surface-container transition-all">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined text-xl ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              </div>
              <p className="text-2xl font-headline font-bold text-on-surface">{card.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">{card.label}</p>
              <p className="text-[10px] text-primary mt-1 font-bold">{card.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MRR Chart */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline font-bold text-on-surface">MRR Growth</h2>
                <p className="text-3xl font-headline font-bold text-on-surface mt-1">$242,100 <span className="text-primary text-base font-normal">+5.4%</span></p>
              </div>
              <div className="flex gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/10">
                {["6M", "12M"].map(r => (
                  <button key={r} onClick={() => setMrrRange(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mrrRange === r ? "bg-surface text-on-surface" : "text-on-surface-variant hover:text-on-surface"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mrrData}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#46f1c5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#46f1c5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(186,202,194,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#bacac2", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#bacac2", fontSize: 9 }} tickLine={false} axisLine={false} width={48} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1c2028", border: "1px solid rgba(59,74,68,0.3)", borderRadius: 12, fontSize: 12, color: "#e0e2ee" }} formatter={v => [`$${Number(v).toLocaleString()}`, "MRR"]} />
                <Area type="monotone" dataKey="mrr" stroke="#46f1c5" strokeWidth={2} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* System Health */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline font-bold text-on-surface">System Health</h2>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                All Systems Go
              </div>
            </div>
            <div className="space-y-5">
              {sysHealth.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-bold text-on-surface">{s.label}</span>
                      <span className="text-[10px] text-on-surface-variant ml-2">{s.status}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{s.val}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Portfolio Table */}
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h2 className="font-headline font-bold text-on-surface">Portfolio Management</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Client
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Business Name</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Plan</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Utilization</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Renewal</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {clients.map(client => (
                  <tr key={client.name} className="hover:bg-surface-container/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-on-surface text-sm">
                          {client.name[0]}
                        </div>
                        <span className="font-bold text-on-surface">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        client.plan === "Enterprise" ? "bg-tertiary/10 text-tertiary" :
                        client.plan === "Growth" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                      }`}>{client.plan}</span>
                    </td>
                    <td className="px-6 py-4 min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${client.utilization > 90 ? "bg-error" : "bg-primary"}`} style={{ width: `${client.utilization}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${client.utilization > 90 ? "text-error" : "text-on-surface"}`}>{client.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${client.status === "Healthy" ? "text-primary" : "text-error"}`}>
                        <span className={`w-2 h-2 rounded-full ${client.status === "Healthy" ? "bg-primary" : "bg-error animate-pulse"}`} />
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-sm">{client.renewal}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-lg">open_in_new</span>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
