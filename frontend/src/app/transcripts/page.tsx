"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const transcriptData = [
  {
    id:"t1", caller:"Ramesh Kumar", num:"+91 98765 43210", date:"Today 10:32 AM", dur:"3:42", lang:"Hindi", status:"Booked",
    messages:[
      { role:"agent",  text:"नमस्ते! मैं Charlie हूँ, आपका AI assistant। आज मैं आपकी किस तरह सहायता कर सकता हूँ?" },
      { role:"caller", text:"Hello, mujhe appointment book karni hai." },
      { role:"agent",  text:"Zaroor! Kya aap mujhe apna naam aur appointment ka din bata sakte hain?" },
      { role:"caller", text:"Ramesh Kumar. Tuesday ko 3 baje available hai?" },
      { role:"agent",  text:"Bilkul! Tuesday 3 PM perfect rahega. Confirmation WhatsApp pe bhej deta hoon." },
      { role:"caller", text:"Thank you!" },
    ]
  },
  {
    id:"t2", caller:"Priya Nair", num:"+91 76543 21098", date:"Today 9:15 AM", dur:"5:18", lang:"English", status:"Booked",
    messages:[
      { role:"agent",  text:"Hello! I'm Charlie. How can I assist you today?" },
      { role:"caller", text:"I'd like to schedule a check-up for next week." },
      { role:"agent",  text:"Sure! Which day works best for you?" },
      { role:"caller", text:"Monday or Wednesday morning, preferably." },
      { role:"agent",  text:"Monday at 10 AM is available. Shall I confirm that for you?" },
      { role:"caller", text:"Yes, please. That works great." },
      { role:"agent",  text:"Done! Appointment confirmed for Monday 10 AM. See you then!" },
    ]
  },
  {
    id:"t3", caller:"Unknown", num:"+91 87654 32109", date:"Yesterday 4:22 PM", dur:"1:12", lang:"Kannada", status:"Answered",
    messages:[
      { role:"agent",  text:"ನಮಸ್ಕಾರ! ನಾನು Charlie. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
      { role:"caller", text:"Pricing yenu anta?" },
      { role:"agent",  text:"Namma Growth plan ₹2499/month alli available ide. Appointment book maadabekanta?" },
      { role:"caller", text:"Illa, thanks." },
    ]
  },
];

export default function TranscriptsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(transcriptData[0]);

  const filtered = transcriptData.filter(t =>
    t.caller.toLowerCase().includes(search.toLowerCase()) ||
    t.num.includes(search)
  );

  const statusStyle: Record<string,{bg:string;color:string}> = {
    Booked:   { bg:"rgba(70,241,197,0.1)",  color:"#46f1c5" },
    Answered: { bg:"rgba(199,191,255,0.1)", color:"#c7bfff" },
    Missed:   { bg:"rgba(255,180,171,0.1)", color:"#ffb4ab" },
  };

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Transcripts" />
        <main className="pt-16 p-6 flex gap-6 h-[calc(100vh-64px)]">
          {/* List panel */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight:"calc(100vh - 112px)" }}>
            <div className="sticky top-0" style={{ background:"#0a0d14", paddingBottom:"8px" }}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search caller or number…" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-on-surface outline-none" style={{ background:"rgba(24,28,36,0.9)", border:"1px solid rgba(255,255,255,0.07)" }} />
              </div>
            </div>
            {filtered.map(t=>(
              <div key={t.id} className="rounded-2xl p-4 cursor-pointer transition-all space-y-2" style={{ background:selected.id===t.id?"rgba(70,241,197,0.07)":"rgba(24,28,36,0.8)", border:`1px solid ${selected.id===t.id?"rgba(70,241,197,0.25)":"rgba(255,255,255,0.05)"}` }} onClick={()=>setSelected(t)}>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-on-surface">{t.caller}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={statusStyle[t.status]}>{t.status}</span>
                </div>
                <p className="text-xs text-on-surface-variant font-mono">{t.num}</p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{t.date}</span>
                  <span>{t.dur} · {t.lang}</span>
                </div>
              </div>
            ))}
            {filtered.length===0 && <p className="text-center text-on-surface-variant text-sm py-8">No transcripts found.</p>}
          </div>

          {/* Transcript view */}
          <div className="flex-1 rounded-2xl flex flex-col overflow-hidden" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)", maxHeight:"calc(100vh - 112px)" }}>
            <div className="p-5 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <p className="font-headline font-bold text-on-surface">{selected.caller}</p>
                <p className="text-xs text-on-surface-variant">{selected.date} · {selected.dur} · {selected.lang}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors" style={{ background:"rgba(255,255,255,0.05)" }}>
                  <span className="material-symbols-outlined text-sm">content_copy</span>Copy
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
                  <span className="material-symbols-outlined text-sm">download</span>Export
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selected.messages.map((m,i)=>(
                <div key={i} className={`flex ${m.role==="caller"?"justify-end":""}`}>
                  <div className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm`} style={m.role==="agent" ? { background:"rgba(70,241,197,0.08)", border:"1px solid rgba(70,241,197,0.12)", color:"#e0e2ee" } : { background:"rgba(199,191,255,0.08)", border:"1px solid rgba(199,191,255,0.12)", color:"#e0e2ee" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color:m.role==="agent"?"#46f1c5":"#c7bfff" }}>{m.role==="agent"?"Charlie (AI)":"Caller"}</p>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
