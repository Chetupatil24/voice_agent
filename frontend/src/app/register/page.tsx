"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Account Details", "Business Info", "Agent Setup"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", password: "",
    businessName: "", phone: "", industry: "",
    agentName: "", language: "en-IN", personality: "helpful",
  });

  const updateForm = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const next = () => { if (step < 2) setStep(s => s + 1); };
  const back = () => { if (step > 0) setStep(s => s - 1); };

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left — testimonial */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-surface-container-lowest p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative z-10">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">VaaniAI</span>
        </div>
        <div className="relative z-10 space-y-6">
          {/* Feature cards */}
          <div className="space-y-4">
            {[
              { icon: "translate", title: "Multi-lingual Support", desc: "10+ Indian languages, zero code.", color: "text-primary" },
              { icon: "bolt", title: "Ultra Low Latency", desc: "<200ms response — sounds human.", color: "text-secondary" },
              { icon: "calendar_month", title: "Smart Scheduling", desc: "Auto-book appointments 24/7.", color: "text-tertiary" },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 p-4 bg-surface-container/70 backdrop-blur rounded-2xl border border-outline-variant/10">
                <span className={`material-symbols-outlined text-3xl ${f.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">{f.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Testimonial */}
          <div className="p-6 bg-surface-container/60 rounded-2xl border border-outline-variant/10">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_,i) => <span key={i} className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed italic mb-4">&quot;VaaniAI reduced our missed calls by 90%. Our receptionist now focuses on in-clinic work while the AI handles bookings perfectly.&quot;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-sm">RV</div>
              <div>
                <p className="font-bold text-on-surface text-sm">Rajesh Varma</p>
                <p className="text-xs text-on-surface-variant">CTO, QuickKart India</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Trusted by 2,000+ Indian Businesses</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-primary text-on-primary" : i === step ? "bg-primary text-on-primary ring-4 ring-primary/20" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block transition-colors ${i === step ? "text-primary" : "text-on-surface-variant"}`}>{s}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 ml-2 rounded transition-all ${i < step ? "bg-primary" : "bg-outline-variant/30"}`} />}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-headline font-bold text-on-surface">{steps[step]}</h1>
          </div>

          {/* Step 0: Account Details */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="relative">
                <input value={form.fullName} onChange={e => updateForm("fullName", e.target.value)} id="fullName" type="text" placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="fullName" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Full Name</label>
              </div>
              <div className="relative">
                <input value={form.email} onChange={e => updateForm("email", e.target.value)} id="regEmail" type="email" placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="regEmail" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Work Email</label>
              </div>
              <div className="relative">
                <input value={form.password} onChange={e => updateForm("password", e.target.value)} id="regPassword" type="password" placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="regPassword" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Password</label>
              </div>
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <input value={form.businessName} onChange={e => updateForm("businessName", e.target.value)} id="bizName" type="text" placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="bizName" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Business Name</label>
              </div>
              <div className="relative flex">
                <div className="flex items-center px-4 bg-surface-container rounded-l-xl border border-outline-variant/30 border-r-0">
                  <span className="text-sm font-bold text-on-surface-variant">+91</span>
                </div>
                <input value={form.phone} onChange={e => updateForm("phone", e.target.value)} id="phone" type="tel" placeholder=" "
                  className="peer flex-1 px-4 pt-6 pb-2 rounded-r-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="phone" className="absolute left-20 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">WhatsApp Number</label>
              </div>
              <select value={form.industry} onChange={e => updateForm("industry", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition">
                <option value="">Select Industry</option>
                <option>Healthcare / Clinics</option>
                <option>Retail / E-Commerce</option>
                <option>Real Estate</option>
                <option>Education</option>
                <option>Finance / BFSI</option>
                <option>Other</option>
              </select>
            </div>
          )}

          {/* Step 2: Agent Setup */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="relative">
                <input value={form.agentName} onChange={e => updateForm("agentName", e.target.value)} id="agentName" type="text" placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition" />
                <label htmlFor="agentName" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">AI Agent Name</label>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Primary Language</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{code:"en-IN",label:"English"},{code:"hi-IN",label:"हिंदी"},{code:"kn-IN",label:"ಕನ್ನಡ"}].map(l => (
                    <button key={l.code} onClick={() => updateForm("language", l.code)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${form.language === l.code ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/40"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Personality</p>
                <div className="space-y-3">
                  {[{val:"helpful",label:"Helpful Assistant",desc:"Warm, empathetic, and informative"},{val:"sales",label:"Direct Sales",desc:"Confident, results-oriented"},{val:"support",label:"Support Specialist",desc:"Patient and solution-focused"}].map(p => (
                    <div key={p.val} onClick={() => updateForm("personality", p.val)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.personality === p.val ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/30"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.personality === p.val ? "border-primary" : "border-outline-variant"}`}>
                        {form.personality === p.val && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">{p.label}</p>
                        <p className="text-xs text-on-surface-variant">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={back} className="px-6 py-3 border border-outline-variant/30 rounded-xl text-on-surface font-semibold hover:bg-surface-container transition-all">
                Back
              </button>
            )}
            {step < 2 ? (
              <button onClick={next} className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl hover:opacity-90 transition-all">
                Continue
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Setting up...
                  </span>
                ) : "Launch My Agent"}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
