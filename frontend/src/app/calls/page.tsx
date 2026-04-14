"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const statusStyle: Record<string,{bg:string;color:string}> = {
  Booked:   { bg:"rgba(70,241,197,0.1)",  color:"#46f1c5" },
  Answered: { bg:"rgba(199,191,255,0.1)", color:"#c7bfff" },
  Missed:   { bg:"rgba(255,180,171,0.1)", color:"#ffb4ab" },
  Voicemail:{ bg:"rgba(255,206,166,0.1)", color:"#ffcea6" },
};

const calls = [
  { id:"c1", name:"Ramesh Kumar",    num:"+91 98765 43210", dur:"3:42", status:"Booked",    time:"2 min ago",   lang:"Hindi",   summary:"Booked appointment for Tuesday 3pm" },
  { id:"c2", name:"Unknown",         num:"+91 87654 32109", dur:"1:12", status:"Answered",  time:"8 min ago",   lang:"Kannada", summary:"Query about pricing — no booking" },
  { id:"c3", name:"Priya Nair",      num:"+91 76543 21098", dur:"5:18", status:"Booked",    time:"15 min ago",  lang:"English", summary:"New patient consultation booked" },
  { id:"c4", name:"Vikram Singh",    num:"+91 65432 10987", dur:"0:00", status:"Missed",    time:"22 min ago",  lang:"Hindi",   summary:"Call not answered" },
  { id:"c5", name:"Anjali Desai",    num:"+91 54321 09876", dur:"4:33", status:"Booked",    time:"41 min ago",  lang:"English", summary:"Follow-up appointment for Friday" },
  { id:"c6", name:"Suresh Patil",    num:"+91 43210 98765", dur:"2:11", status:"Voicemail", time:"1 hr ago",    lang:"Hindi",   summary:"Left voicemail requesting callback" },
  { id:"c7", name:"Meera Iyer",      num:"+91 32109 87654", dur:"6:02", status:"Booked",    time:"1.5 hr ago",  lang:"Kannada", summary:"Annual check-up scheduled for next week" },
  { id:"c8", name:"Arun Sharma",     num:"+91 21098 76543", dur:"1:55", status:"Answered",  time:"2 hr ago",    lang:"English", summary:"Asked about availability — no booking" },
];

export default function CallsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<typeof calls[0] | null>(null);
  const filters = ["All","Booked","Answered","Missed","Voicemail"];

  const filtered = filter === "All" ? calls : calls.filter(c => c.status === filter);

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Calls" />
        <main className="pt-16 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-headline font-black text-on-surface">Call Logs</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">All inbound calls handled by your AI agent.</p>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={filter===f ? { background:"rgba(70,241,197,0.12)", color:"#46f1c5" } : { color:"rgba(186,202,194,0.6)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"Total Today", value:"247", icon:"call",         color:"#46f1c5" },
              { label:"Booked",      value:"94",  icon:"event_available", color:"#c7bfff"  },
              { label:"Missed",      value:"3",   icon:"call_missed",  color:"#ffb4ab" },
              { label:"Avg Duration",value:"3:48",icon:"timer",        color:"#ffcea6" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${s.color}18` }}>
                  <span className="material-symbols-outlined text-xl" style={{ color:s.color, fontVariationSettings:"'FILL' 1" }}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-xl font-headline font-black text-on-surface">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Call table */}
            <div className="flex-1 rounded-2xl overflow-hidden" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    {["Caller","Number","Duration","Status","Language","Time"].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="trow cursor-pointer transition-colors" style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                      onClick={() => setSelected(selected?.id===c.id ? null : c)}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.25),rgba(199,191,255,0.25))", color:"#e0e2ee" }}>{c.name[0]}</div>
                          <span className="font-bold text-on-surface">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-on-surface-variant font-mono text-xs">{c.num}</td>
                      <td className="px-6 py-3.5 font-bold text-on-surface">{c.dur}</td>
                      <td className="px-6 py-3.5"><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle[c.status]}>{c.status}</span></td>
                      <td className="px-6 py-3.5"><span className="text-xs font-bold text-on-surface-variant">{c.lang}</span></td>
                      <td className="px-6 py-3.5 text-on-surface-variant text-xs">{c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-72 flex-shrink-0 rounded-2xl p-5 space-y-4" style={{ background:"rgba(24,28,36,0.9)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-on-surface">Call Detail</h3>
                  <button onClick={()=>setSelected(null)} className="text-on-surface-variant hover:text-on-surface transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg" style={{ background:"linear-gradient(135deg,rgba(70,241,197,0.25),rgba(199,191,255,0.25))" }}>{selected.name[0]}</div>
                  <div>
                    <p className="font-bold text-on-surface">{selected.name}</p>
                    <p className="text-xs text-on-surface-variant font-mono">{selected.num}</p>
                  </div>
                </div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={statusStyle[selected.status]}>{selected.status}</span>
                <div className="space-y-2">
                  {[["Duration", selected.dur], ["Language", selected.lang], ["Time", selected.time]].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-1.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{k}</span>
                      <span className="text-sm font-bold text-on-surface">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)" }}>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">AI Summary</p>
                  <p className="text-sm text-on-surface">{selected.summary}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`/transcripts`} className="flex-1 py-2 rounded-xl text-xs font-bold text-center text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>View Transcript</a>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-on-surface" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>Callback</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
