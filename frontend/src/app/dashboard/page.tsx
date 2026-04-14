"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const callVolumeData = [
  { time:"8am",calls:12 }, { time:"9am",calls:45 }, { time:"10am",calls:78 },
  { time:"11am",calls:92 }, { time:"12pm",calls:65 }, { time:"1pm",calls:55 },
  { time:"2pm",calls:88 }, { time:"3pm",calls:110 }, { time:"4pm",calls:95 },
  { time:"5pm",calls:72 }, { time:"6pm",calls:38 }, { time:"7pm",calls:20 },
];

const weekData = [
  { day:"Mon",calls:240 }, { day:"Tue",calls:312 }, { day:"Wed",calls:198 },
  { day:"Thu",calls:356 }, { day:"Fri",calls:420 }, { day:"Sat",calls:185 }, { day:"Sun",calls:98 },
];

const recentCalls = [
  { name:"Ramesh Kumar",    num:"+91 98765 43210", dur:"3:42", status:"Booked",   time:"2 min ago",   lang:"Hindi"   },
  { name:"Unknown Caller",  num:"+91 87654 32109", dur:"1:12", status:"Answered", time:"8 min ago",   lang:"Kannada" },
  { name:"Priya Nair",      num:"+91 76543 21098", dur:"5:18", status:"Booked",   time:"15 min ago",  lang:"English" },
  { name:"Vikram Singh",    num:"+91 65432 10987", dur:"2:05", status:"Missed",   time:"22 min ago",  lang:"Hindi"   },
  { name:"Anjali Desai",    num:"+91 54321 09876", dur:"4:33", status:"Booked",   time:"41 min ago",  lang:"English" },
];

const statusStyle: Record<string,{bg:string;color:string}> = {
  Booked:   { bg:"rgba(70,241,197,0.1)",   color:"#46f1c5" },
  Answered: { bg:"rgba(199,191,255,0.1)",  color:"#c7bfff" },
  Missed:   { bg:"rgba(255,180,171,0.1)",  color:"#ffb4ab" },
};

const langColors: Record<string,string> = {
  Hindi:"#c7bfff", Kannada:"#ffcea6", English:"#46f1c5",
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [bizName, setBizName] = useState("Your Business");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    const n = localStorage.getItem("business_name");
    if (n) setBizName(n);
  }, []);

  const statCards = [
    { label:"Calls Today",       value:"247",  change:"+12%",  icon:"call",              color:"#46f1c5", bg:"rgba(70,241,197,0.1)"   },
    { label:"Appointments",      value:"34",   change:"+8%",   icon:"event_available",   color:"#c7bfff", bg:"rgba(199,191,255,0.1)"  },
    { label:"Missed Calls",      value:"3",    change:"-25%",  icon:"call_missed",       color:"#ffb4ab", bg:"rgba(255,180,171,0.1)"  },
    { label:"Avg Duration",      value:"3:48", change:"+0:22", icon:"timer",             color:"#ffcea6", bg:"rgba(255,206,166,0.1)"  },
    { label:"Minutes Used",      value:"318",  change:"64%",   icon:"hourglass_bottom",  color:"#46f1c5", bg:"rgba(70,241,197,0.1)"   },
    { label:"Conversion Rate",   value:"82%",  change:"+4%",   icon:"trending_up",       color:"#c7bfff", bg:"rgba(199,191,255,0.1)"  },
  ];

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Dashboard" />
        <main className="pt-16 p-6 space-y-6">

          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-headline font-black text-on-surface">{greeting} 👋</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">Here's what's happening at <span className="text-primary font-bold">{bizName}</span> today.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background:"rgba(70,241,197,0.06)", border:"1px solid rgba(70,241,197,0.15)" }}>
              <span className="status-dot-live" />
              <span className="text-sm font-bold" style={{ color:"#46f1c5" }}>AI Agent Live</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map(card => (
              <div key={card.label} className="rounded-2xl p-5 card-lift" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background:card.bg }}>
                  <span className="material-symbols-outlined text-xl" style={{ color:card.color, fontVariationSettings:"'FILL' 1" }}>{card.icon}</span>
                </div>
                <p className="text-2xl font-headline font-black text-on-surface">{card.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5 leading-tight">{card.label}</p>
                <p className="text-[10px] font-bold mt-1" style={{ color: card.change.startsWith("-") && card.label!=="Missed Calls" ? "#ffb4ab" : "#46f1c5" }}>{card.change}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live call volume */}
            <div className="lg:col-span-2 rounded-2xl p-6" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-headline font-bold text-on-surface">Calls Today</h2>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Hourly call volume</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color:"#46f1c5" }}>
                  <span className="status-dot-live" />Live
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={callVolumeData}>
                  <defs>
                    <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#46f1c5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#46f1c5" stopOpacity={0}  />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" tick={{ fill:"#bacac2", fontSize:10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill:"#bacac2", fontSize:9 }} tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={{ background:"#1c2028", border:"1px solid rgba(59,74,68,0.3)", borderRadius:12, fontSize:12, color:"#e0e2ee" }} />
                  <Area type="monotone" dataKey="calls" stroke="#46f1c5" strokeWidth={2} fill="url(#callGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick stats */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface">Language Breakdown</h2>
              {[
                { lang:"Hindi",   pct:48, calls:119, color:"#c7bfff" },
                { lang:"English", pct:35, calls:87,  color:"#46f1c5" },
                { lang:"Kannada", pct:17, calls:41,  color:"#ffcea6" },
              ].map(l => (
                <div key={l.lang}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-bold text-on-surface">{l.lang}</span>
                    <span className="text-xs text-on-surface-variant">{l.calls} calls</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width:`${l.pct}%`, background:l.color }} />
                  </div>
                  <p className="text-right text-[10px] mt-0.5 font-bold" style={{ color:l.color }}>{l.pct}%</p>
                </div>
              ))}

              {/* Sentiment */}
              <div className="pt-3" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Caller Sentiment</h3>
                <div className="flex gap-2">
                  {[{ e:"😊", label:"Positive", pct:"73%", color:"#46f1c5" }, { e:"😐", label:"Neutral", pct:"21%", color:"#ffcea6" }, { e:"😠", label:"Negative", pct:"6%", color:"#ffb4ab" }].map(s => (
                    <div key={s.label} className="flex-1 text-center p-2 rounded-xl" style={{ background:"rgba(255,255,255,0.03)" }}>
                      <div className="text-lg mb-0.5">{s.e}</div>
                      <p className="text-xs font-black" style={{ color:s.color }}>{s.pct}</p>
                      <p className="text-[9px] text-on-surface-variant">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent calls */}
          <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="font-headline font-bold text-on-surface">Recent Calls</h2>
              <a href="/calls" className="text-xs font-bold hover:text-on-surface transition-colors" style={{ color:"#46f1c5" }}>View all →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    {["Caller","Number","Duration","Status","Language","Time"].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((c, i) => (
                    <tr key={i} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-on-primary"
                            style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.3),rgba(199,191,255,0.3))" }}>
                            {c.name[0]}
                          </div>
                          <span className="font-bold text-on-surface">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-on-surface-variant font-mono text-xs">{c.num}</td>
                      <td className="px-6 py-3.5 font-bold text-on-surface">{c.dur}</td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle[c.status]}>{c.status}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:`${langColors[c.lang]}15`, color:langColors[c.lang] }}>{c.lang}</span>
                      </td>
                      <td className="px-6 py-3.5 text-on-surface-variant text-xs">{c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
