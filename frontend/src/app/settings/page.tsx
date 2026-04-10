"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const voices = [
  { id: "female", label: "Female", icon: "person", desc: "Warm & Professional" },
  { id: "male", label: "Male", icon: "person", desc: "Clear & Confident" },
  { id: "neutral", label: "Neutral", icon: "person", desc: "Balanced & Calm" },
];

const personalities = [
  { id: "helpful", label: "Helpful Assistant", desc: "Warm, empathetic, and informative. Perfect for service businesses." },
  { id: "sales", label: "Direct Sales", desc: "Confident and results-oriented. Built for converting leads." },
  { id: "support", label: "Support Specialist", desc: "Patient and solution-focused. Ideal for issue resolution." },
];

const hours = [
  { day: "Monday – Friday", times: "9:00 AM – 7:00 PM", active: true },
  { day: "Saturday", times: "10:00 AM – 4:00 PM", active: true },
  { day: "Sunday", times: "Closed", active: false },
];

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("Priya");
  const [selectedLang, setSelectedLang] = useState("en-IN");
  const [selectedVoice, setSelectedVoice] = useState("female");
  const [selectedPersonality, setSelectedPersonality] = useState("helpful");
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Agent Settings</h1>
            <p className="text-xs text-on-surface-variant">Configure your AI voice agent</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all">
              Discard Changes
            </button>
            <button onClick={handleSave} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${saved ? "bg-primary/20 text-primary border border-primary/30" : "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:opacity-90"}`}>
              {saved ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check</span>
                  Saved!
                </span>
              ) : "Save Configuration"}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl space-y-6">
            {/* Agent Profile */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h2 className="font-headline font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
                Agent Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 block">Agent Name</label>
                  <input value={agentName} onChange={e => setAgentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 block">Primary Language</label>
                  <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                    <option value="te-IN">Telugu (తెలుగు)</option>
                    <option value="ta-IN">Tamil (தமிழ்)</option>
                    <option value="mr-IN">Marathi (मराठी)</option>
                  </select>
                </div>
              </div>

              {/* Voice Model */}
              <div className="mt-5">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3 block">Voice Model</label>
                <div className="grid grid-cols-3 gap-3">
                  {voices.map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)}
                      className={`flex flex-col items-center p-4 rounded-xl border transition-all ${selectedVoice === v.id ? "border-primary bg-primary/10" : "border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container"}`}>
                      <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${selectedVoice === v.id ? "bg-primary" : "bg-surface-container-high"}`}>
                        <span className={`material-symbols-outlined text-2xl ${selectedVoice === v.id ? "text-on-primary" : "text-on-surface-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                      </div>
                      <span className={`font-bold text-sm ${selectedVoice === v.id ? "text-primary" : "text-on-surface"}`}>{v.label}</span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5">{v.desc}</span>
                      {selectedVoice === v.id && (
                        <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">ACTIVE</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Integration */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h2 className="font-headline font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>integration_instructions</span>
                Phone Integration
              </h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">+91 80-4567-8901</p>
                    <p className="text-xs text-on-surface-variant">Exotel — Dedicated Number</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Active
                </span>
              </div>
            </div>

            {/* Personality */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h2 className="font-headline font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                Personality & Tone
              </h2>
              <div className="space-y-3">
                {personalities.map(p => (
                  <div key={p.id} onClick={() => setSelectedPersonality(p.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedPersonality === p.id ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/30"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPersonality === p.id ? "border-primary" : "border-outline-variant"}`}>
                        {selectedPersonality === p.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{p.label}</p>
                        <p className="text-xs text-on-surface-variant">{p.desc}</p>
                      </div>
                    </div>
                    {selectedPersonality === p.id && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">ACTIVE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h2 className="font-headline font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
                Knowledge Base
              </h2>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all mb-4 ${dragging ? "border-primary bg-primary/5" : "border-outline-variant/20"}`}
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">upload_file</span>
                <p className="text-sm text-on-surface-variant">Drop training files or <span className="text-primary font-bold cursor-pointer hover:underline">Browse</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Business_FAQs.pdf", "Pricing_2024.csv", "Services_Guide.docx"].map(f => (
                  <div key={f} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/10">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    <span className="text-xs font-bold text-on-surface">{f}</span>
                    <button className="text-on-surface-variant hover:text-error transition-colors ml-1">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  Operating Hours
                </h2>
                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit Schedule
                </button>
              </div>
              <div className="space-y-3">
                {hours.map(h => (
                  <div key={h.day} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                    <span className="font-bold text-on-surface text-sm">{h.day}</span>
                    <span className={`text-sm font-bold ${h.active ? "text-primary" : "text-on-surface-variant/50"}`}>{h.times}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB — Preview */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-2 z-40">
        <span className="px-3 py-1.5 bg-surface-container rounded-xl border border-outline-variant/20 text-xs font-bold text-on-surface-variant shadow-lg whitespace-nowrap">Preview Live Agent</span>
        <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all pulse-ring">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
        </button>
      </div>
    </div>
  );
}
