"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

const metrics = [
  { label:"Total Tenants",     value:"1,284", change:"+8.2%",  trend:"up", icon:"groups",       color:"#46f1c5", bg:"rgba(70,241,197,0.1)"   },
  { label:"Active Agents",     value:"8,421", change:"+12.1%", trend:"up", icon:"smart_toy",    color:"#c7bfff", bg:"rgba(199,191,255,0.1)"  },
  { label:"Monthly MRR",       value:"₹18.2L",change:"+5.4%",  trend:"up", icon:"payments",     color:"#ffcea6", bg:"rgba(255,206,166,0.1)"  },
  { label:"Avg Call Duration", value:"4:12",  change:"+0.3%",  trend:"up", icon:"timer",        color:"#46f1c5", bg:"rgba(70,241,197,0.1)"   },
  { label:"Conversion Rate",   value:"14.8%", change:"+1.2%",  trend:"up", icon:"trending_up",  color:"#c7bfff", bg:"rgba(199,191,255,0.1)"  },
  { label:"Daily Tokens",      value:"4.2M",  change:"+18.5%", trend:"up", icon:"token",        color:"#ffcea6", bg:"rgba(255,206,166,0.1)"  },
];

const mrrData = [
  { month:"Aug", mrr:1220000 }, { month:"Sep", mrr:1380000 },
  { month:"Oct", mrr:1510000 }, { month:"Nov", mrr:1620000 },
  { month:"Dec", mrr:1740000 }, { month:"Jan", mrr:1820000 },
];

const callData = [
  { day:"Mon", calls:1240 }, { day:"Tue", calls:1580 }, { day:"Wed", calls:1320 },
  { day:"Thu", calls:1890 }, { day:"Fri", calls:2100 }, { day:"Sat", calls:980 }, { day:"Sun", calls:640 },
];

const sysHealth = [
  { label:"API Gateway",     val:"42ms",  pct:20,    status:"Operational",  color:"#46f1c5" },
  { label:"STT Engine",      val:"99.8%", pct:99.8,  status:"Operational",  color:"#46f1c5" },
  { label:"PostgreSQL DB",   val:"12ms",  pct:10,    status:"Operational",  color:"#46f1c5" },
  { label:"Infrastructure",  val:"64%",   pct:64,    status:"Normal Load",  color:"#ffcea6" },
  { label:"Redis Cache",     val:"0.8ms", pct:5,     status:"Operational",  color:"#46f1c5" },
];

const tenants = [
  { id:"t1", name:"QuickKart India",     plan:"Enterprise", utilization:92, status:"Healthy",  renewal:"Mar 2025", calls:4820, mrr:"₹2.4L",  industry:"ecommerce",   phone:"+91 98765 43210" },
  { id:"t2", name:"Vaani Dental Clinic", plan:"Growth",     utilization:78, status:"Healthy",  renewal:"Feb 2025", calls:1240, mrr:"₹14,999", industry:"healthcare",  phone:"+91 87654 32109" },
  { id:"t3", name:"TechServe Solutions", plan:"Growth",     utilization:45, status:"Healthy",  renewal:"Apr 2025", calls:890,  mrr:"₹14,999", industry:"technology",  phone:"+91 76543 21098" },
  { id:"t4", name:"Patil Motors",        plan:"Starter",    utilization:98, status:"At Risk",  renewal:"Feb 2025", calls:320,  mrr:"₹4,999",  industry:"automotive",  phone:"+91 65432 10987" },
  { id:"t5", name:"BrightEdu Academy",   plan:"Enterprise", utilization:67, status:"Healthy",  renewal:"Jun 2025", calls:2100, mrr:"₹2.4L",   industry:"education",   phone:"+91 54321 09876" },
  { id:"t6", name:"StarHub Retail",      plan:"Growth",     utilization:81, status:"Healthy",  renewal:"May 2025", calls:1540, mrr:"₹14,999", industry:"retail",      phone:"+91 43210 98765" },
];

const planColors: Record<string,{ background:string; color:string }> = {
  Enterprise: { background:"rgba(255,206,166,0.12)", color:"#ffcea6" },
  Growth:     { background:"rgba(199,191,255,0.12)", color:"#c7bfff" },
  Starter:    { background:"rgba(70,241,197,0.12)",  color:"#46f1c5" },
};

const recentActivity = [
  { icon:"person_add",  text:"New tenant: MediCare Plus joined on Starter plan", time:"2 min ago",   color:"#46f1c5" },
  { icon:"warning",     text:"Patil Motors exceeded 98% of minute quota",         time:"14 min ago",  color:"#ffcea6" },
  { icon:"payments",    text:"QuickKart India renewed Enterprise: ₹2.4L",         time:"1 hr ago",    color:"#c7bfff" },
  { icon:"call",        text:"System handled 1,200 concurrent calls (new peak)",  time:"3 hr ago",    color:"#46f1c5" },
  { icon:"upgrade",     text:"Vaani Dental upgraded: Starter → Growth plan",      time:"Yesterday",   color:"#c7bfff" },
];

type Tenant = typeof tenants[number];

export default function AdminPage() {
  const [tab, setTab] = useState<"overview"|"tenants"|"analytics"|"system">("overview");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [search, setSearch] = useState("");

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.plan.toLowerCase().includes(search.toLowerCase()) ||
    t.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background:"#0a0d14" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
        style={{ background:"rgba(10,13,20,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", boxShadow:"0 4px 15px rgba(70,241,197,0.3)" }}>
              <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>mic</span>
            </div>
            <span className="text-lg font-black font-headline" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VaaniAI</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest" style={{ background:"rgba(255,180,171,0.1)", color:"#ffb4ab", border:"1px solid rgba(255,180,171,0.2)" }}>
            Owner Portal
          </span>
        </div>

        {/* Tab nav */}
        <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background:"rgba(255,255,255,0.04)" }}>
          {(["overview","tenants","analytics","system"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all capitalize"
              style={tab===t ? { background:"rgba(70,241,197,0.12)", color:"#46f1c5" } : { color:"rgba(186,202,194,0.6)" }}>
              {t}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary transition-all"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ background:"linear-gradient(135deg,#ffb4ab,#ffcea6)", color:"#4c2700" }}>A</div>
            <span className="text-xs font-bold text-on-surface">Admin</span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ── Overview Tab ── */}
        {tab === "overview" && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {metrics.map(card => (
                <div key={card.label} className="rounded-2xl p-5 card-lift transition-all"
                  style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background:card.bg }}>
                    <span className="material-symbols-outlined text-xl" style={{ color:card.color, fontVariationSettings:"'FILL' 1" }}>{card.icon}</span>
                  </div>
                  <p className="text-2xl font-headline font-black text-on-surface">{card.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5 leading-tight">{card.label}</p>
                  <p className="text-[10px] font-bold mt-1.5 flex items-center gap-1" style={{ color:"#46f1c5" }}>
                    <span className="material-symbols-outlined text-sm">trending_up</span>{card.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MRR */}
              <div className="lg:col-span-2 rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-headline font-bold text-on-surface">MRR Growth</h2>
                    <p className="text-3xl font-headline font-black text-on-surface mt-1">
                      ₹18.2L <span className="text-sm font-normal" style={{ color:"#46f1c5" }}>+5.4%</span>
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mrrData}>
                    <defs>
                      <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#46f1c5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#46f1c5" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill:"#bacac2", fontSize:10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill:"#bacac2", fontSize:9 }} tickLine={false} axisLine={false} width={52} tickFormatter={v=>`₹${(v/100000).toFixed(1)}L`} />
                    <Tooltip contentStyle={{ background:"#1c2028", border:"1px solid rgba(59,74,68,0.3)", borderRadius:12, fontSize:12, color:"#e0e2ee" }}
                      formatter={v=>[`₹${(Number(v)/100000).toFixed(2)}L`, "MRR"]} />
                    <Area type="monotone" dataKey="mrr" stroke="#46f1c5" strokeWidth={2} fill="url(#mrrGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* System Health */}
              <div className="rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-headline font-bold text-on-surface">System Health</h2>
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color:"#46f1c5" }}>
                    <span className="status-dot-live" />All Systems Go
                  </div>
                </div>
                <div className="space-y-4">
                  {sysHealth.map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-bold text-on-surface">{s.label}</span>
                          <span className="text-[9px] text-on-surface-variant ml-2 uppercase tracking-widest">{s.status}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color:s.color }}>{s.val}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width:`${s.pct}%`, background:`linear-gradient(90deg,${s.color},${s.color}99)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface mb-5">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl transition-all"
                    style={{ background:"rgba(255,255,255,0.02)" }}>
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background:`${a.color}15` }}>
                      <span className="material-symbols-outlined text-sm" style={{ color:a.color, fontVariationSettings:"'FILL' 1" }}>{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface">{a.text}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tenants Tab ── */}
        {tab === "tenants" && (
          <div className="flex gap-6">
            {/* Table */}
            <div className={`flex-1 min-w-0 rounded-2xl overflow-hidden ${selectedTenant ? "hidden xl:block" : ""}`}
              style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-3">
                  <h2 className="font-headline font-bold text-on-surface">Portfolio Management</h2>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(70,241,197,0.1)", color:"#46f1c5" }}>
                    {filteredTenants.length} tenants
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tenants..." className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none w-40" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-on-primary"
                    style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
                    <span className="material-symbols-outlined text-lg">add</span>Add Tenant
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      {["Business","Plan","Utilization","Status","MRR","Renewal",""].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTenants.map(t => (
                      <tr key={t.id} className="trow transition-colors cursor-pointer group"
                        style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                        onClick={() => setSelectedTenant(t)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                              style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.2),rgba(199,191,255,0.2))", color:"#e0e2ee" }}>
                              {t.name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-on-surface">{t.name}</span>
                              <p className="text-[10px] text-on-surface-variant capitalize">{t.industry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full" style={planColors[t.plan]}>{t.plan}</span>
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                              <div className="h-full rounded-full" style={{ width:`${t.utilization}%`, background: t.utilization>90 ? "linear-gradient(90deg,#ffb4ab,#ff5252)" : "linear-gradient(90deg,#46f1c5,#00d4aa)" }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: t.utilization>90 ? "#ffb4ab" : "#e0e2ee" }}>{t.utilization}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: t.status==="Healthy" ? "#46f1c5" : "#ffb4ab" }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: t.status==="Healthy" ? "#46f1c5" : "#ffb4ab", boxShadow: t.status!=="Healthy" ? "0 0 8px rgba(255,180,171,0.6)" : undefined }} />
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-on-surface">{t.mrr}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{t.renewal}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                              <span className="material-symbols-outlined text-lg">open_in_new</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tenant detail panel */}
            {selectedTenant && (
              <div className="w-80 flex-shrink-0 rounded-2xl p-6 space-y-5" style={{ background:"rgba(24,28,36,0.9)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-on-surface">Tenant Details</h3>
                  <button onClick={()=>setSelectedTenant(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl"
                    style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.25),rgba(199,191,255,0.25))", color:"#e0e2ee" }}>
                    {selectedTenant.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{selectedTenant.name}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize" style={planColors[selectedTenant.plan]}>{selectedTenant.plan}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label:"Industry",    val: selectedTenant.industry   },
                    { label:"Phone",       val: selectedTenant.phone      },
                    { label:"MRR",         val: selectedTenant.mrr        },
                    { label:"Renewal",     val: selectedTenant.renewal    },
                    { label:"Total Calls", val: selectedTenant.calls.toLocaleString("en-IN") },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{row.label}</span>
                      <span className="text-sm font-bold text-on-surface capitalize">{row.val}</span>
                    </div>
                  ))}
                </div>
                {/* Utilization bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Usage</span>
                    <span className="text-xs font-bold" style={{ color: selectedTenant.utilization>90 ? "#ffb4ab" : "#46f1c5" }}>{selectedTenant.utilization}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width:`${selectedTenant.utilization}%`,
                      background: selectedTenant.utilization>90 ? "linear-gradient(90deg,#ffb4ab,#ff5252)" : "linear-gradient(90deg,#46f1c5,#00d4aa)" }} />
                  </div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: selectedTenant.status==="Healthy" ? "rgba(70,241,197,0.06)" : "rgba(255,180,171,0.06)", border:`1px solid ${selectedTenant.status==="Healthy" ? "rgba(70,241,197,0.15)" : "rgba(255,180,171,0.15)"}` }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: selectedTenant.status==="Healthy" ? "#46f1c5" : "#ffb4ab" }} />
                  <span className="text-sm font-bold" style={{ color: selectedTenant.status==="Healthy" ? "#46f1c5" : "#ffb4ab" }}>{selectedTenant.status}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-bold text-on-primary transition-all hover:opacity-90"
                    style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>View Portal</button>
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-bold text-on-surface transition-all"
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>Send Alert</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {tab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface mb-5">Weekly Call Volume</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={callData}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill:"#bacac2", fontSize:10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill:"#bacac2", fontSize:9 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ background:"#1c2028", border:"1px solid rgba(59,74,68,0.3)", borderRadius:12, fontSize:12, color:"#e0e2ee" }} />
                  <Bar dataKey="calls" fill="#46f1c5" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface mb-5">Plan Distribution</h2>
              <div className="space-y-4">
                {[
                  { plan:"Enterprise", count:2,  pct:33, color:"#ffcea6" },
                  { plan:"Growth",     count:3,  pct:50, color:"#c7bfff" },
                  { plan:"Starter",    count:1,  pct:17, color:"#46f1c5" },
                ].map(p => (
                  <div key={p.plan}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold text-on-surface">{p.plan}</span>
                      <span className="text-sm font-bold" style={{ color:p.color }}>{p.count} tenants ({p.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width:`${p.pct}%`, background:p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── System Tab ── */}
        {tab === "system" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline font-bold text-on-surface">System Health</h2>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color:"#46f1c5" }}>
                  <span className="status-dot-live" />All Operational
                </div>
              </div>
              <div className="space-y-5">
                {sysHealth.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1.5">
                      <div>
                        <span className="text-sm font-bold text-on-surface">{s.label}</span>
                        <span className="text-[9px] text-on-surface-variant ml-2 uppercase tracking-widest">{s.status}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color:s.color }}>{s.val}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width:`${s.pct}%`, background:`linear-gradient(90deg,${s.color},${s.color}99)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface mb-1">API Usage</h2>
              {[
                { api:"Sarvam STT",   used:"2.1M tokens", budget:"5M",   pct:42, color:"#46f1c5" },
                { api:"Anthropic LLM",used:"890K tokens", budget:"2M",   pct:44, color:"#c7bfff" },
                { api:"Deepgram",     used:"340 hrs",     budget:"500h", pct:68, color:"#ffcea6" },
              ].map(r => (
                <div key={r.api}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-bold text-on-surface">{r.api}</span>
                    <span className="text-xs text-on-surface-variant">{r.used} of {r.budget}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width:`${r.pct}%`, background:`linear-gradient(90deg,${r.color},${r.color}99)` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
