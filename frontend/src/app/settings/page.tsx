"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

function Toggle({ on, onChange }:{on:boolean;onChange:(v:boolean)=>void}) {
  return (
    <div className="relative w-12 h-6 rounded-full cursor-pointer transition-colors select-none" style={{ background:on?"rgba(70,241,197,0.3)":"rgba(255,255,255,0.08)", border:`1px solid ${on?"rgba(70,241,197,0.5)":"rgba(255,255,255,0.1)"}` }} onClick={()=>onChange(!on)}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left:on?"calc(100% - 1.375rem)":"0.125rem", background:on?"#46f1c5":"rgba(255,255,255,0.3)" }} />
    </div>
  );
}

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("Charlie");
  const [greeting, setGreeting] = useState("Hello! I'm Charlie, your AI assistant. How can I help you today?");
  const [lang, setLang] = useState("Hindi");
  const [saved, setSaved] = useState(false);
  const [features, setFeatures] = useState({ booking:true, whatsapp:true, sms:false, transcripts:true, sentiment:true, followup:false });

  function save() {
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
  }

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Settings" />
        <main className="pt-16 p-6 space-y-6 max-w-3xl">
          <div>
            <h1 className="text-2xl font-headline font-black text-on-surface">Agent Settings</h1>
            <p className="text-on-surface-variant text-sm mt-0.5">Configure how your AI voice agent behaves.</p>
          </div>

          {/* Agent identity */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-headline font-bold text-on-surface text-lg">Agent Identity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Agent Name</label>
                <input value={agentName} onChange={e=>setAgentName(e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none transition-all" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }} placeholder="Charlie" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Primary Language</label>
                <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none transition-all" style={{ background:"rgba(24,28,36,0.95)", border:"1px solid rgba(255,255,255,0.1)" }}>
                  {["Hindi","English","Kannada","Tamil","Telugu","Marathi"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Opening Greeting Message</label>
              <textarea value={greeting} onChange={e=>setGreeting(e.target.value)} rows={3} className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none resize-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }} />
              <p className="text-xs text-on-surface-variant mt-1">{greeting.length}/250 characters</p>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-headline font-bold text-on-surface text-lg">Feature Toggles</h3>
            {[
              { key:"booking",     label:"Appointment Booking",   desc:"Let AI book appointments from calls",           icon:"event_available" },
              { key:"whatsapp",    label:"WhatsApp Notifications", desc:"Send summary to caller after every call",      icon:"chat" },
              { key:"sms",         label:"SMS Alerts",             desc:"SMS when new booking is confirmed",            icon:"sms" },
              { key:"transcripts", label:"Call Transcripts",       desc:"Automatically create call transcripts",        icon:"subtitles" },
              { key:"sentiment",   label:"Sentiment Analysis",     desc:"Analyze caller mood during calls",             icon:"mood" },
              { key:"followup",    label:"Auto Follow-up",         desc:"Send follow-up message 24h after booking",     icon:"replay" },
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between py-3" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"rgba(70,241,197,0.08)" }}>
                    <span className="material-symbols-outlined text-base" style={{ color:"#46f1c5", fontVariationSettings:"'FILL' 1" }}>{f.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{f.label}</p>
                    <p className="text-xs text-on-surface-variant">{f.desc}</p>
                  </div>
                </div>
                <Toggle on={features[f.key as keyof typeof features]} onChange={v=>setFeatures(prev=>({...prev,[f.key]:v}))} />
              </div>
            ))}
          </div>

          {/* Voice & timing */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-headline font-bold text-on-surface text-lg">Voice &amp; Timing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Voice Tone</label>
                <select className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none" style={{ background:"rgba(24,28,36,0.95)", border:"1px solid rgba(255,255,255,0.1)" }}>
                  {["Friendly","Professional","Formal","Casual"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Speaking Speed</label>
                <select className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none" style={{ background:"rgba(24,28,36,0.95)", border:"1px solid rgba(255,255,255,0.1)" }}>
                  {["Slow","Normal","Fast"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Call Hours Start</label>
                <input type="time" defaultValue="09:00" className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", colorScheme:"dark" }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Call Hours End</label>
                <input type="time" defaultValue="21:00" className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", colorScheme:"dark" }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={save} className="px-6 py-2.5 rounded-xl font-bold text-sm text-on-primary transition-transform hover:scale-105" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
            {saved && <p className="text-xs text-on-surface-variant">Settings updated successfully.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
