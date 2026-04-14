"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ business_name:"", industry:"", phone:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof typeof form, val: string) { setForm(prev=>({...prev,[key]:val})); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ business_name:form.business_name, industry:form.industry, phone:form.phone, email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Registration failed."); return; }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("business_name", data.business_name || "");
      router.push("/dashboard");
    } catch { setError("Connection failed."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background:"#050810" }}>
      <div className="orb" style={{ width:"600px", height:"600px", background:"radial-gradient(circle,rgba(199,191,255,0.1),transparent 70%)", right:"-200px", top:"-200px", position:"absolute", animation:"orb-float 10s ease-in-out infinite" }} />
      <div className="orb" style={{ width:"400px", height:"400px", background:"radial-gradient(circle,rgba(70,241,197,0.1),transparent 70%)", left:"-100px", bottom:"-100px", position:"absolute", animation:"orb-float 8s ease-in-out infinite reverse" }} />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
            <span className="material-symbols-outlined text-3xl" style={{ color:"#00382b", fontVariationSettings:"'FILL' 1" }}>mic</span>
          </div>
          <h1 className="text-3xl font-headline font-black text-on-surface">Set up your agent</h1>
          <p className="text-on-surface-variant mt-1">Get your AI voice agent live in minutes</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1,2].map(s=>(
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{ background:step>=s?"linear-gradient(135deg,#46f1c5,#00d4aa)":step===s?"rgba(70,241,197,0.2)":"rgba(255,255,255,0.06)", color:step>=s?"#00382b":"#46f1c5" }}>{s}</div>
              {s<2 && <div className="w-8 h-px" style={{ background:step>1?"#46f1c5":"rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 space-y-5" style={{ background:"rgba(18,21,31,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.07)" }}>
          {error && <div className="rounded-xl p-3 text-sm font-bold" style={{ background:"rgba(255,180,171,0.1)", border:"1px solid rgba(255,180,171,0.2)", color:"#ffb4ab" }}>{error}</div>}

          {step===1 && (
            <div className="space-y-4">
              <h2 className="font-headline font-bold text-on-surface">Business Info</h2>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Business Name</label>
                <input value={form.business_name} onChange={e=>update("business_name",e.target.value)} placeholder="Charlie's Clinic" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Industry</label>
                <select value={form.industry} onChange={e=>update("industry",e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(18,21,31,0.95)", border:"1px solid rgba(255,255,255,0.09)" }}>
                  <option value="">Select industry</option>
                  {["Healthcare","Restaurant","Salon","Legal","Real Estate","Education","Retail","Other"].map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Business Phone</label>
                <input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
              </div>
              <button onClick={()=>{ if(!form.business_name||!form.industry||!form.phone){ setError("Please fill all fields."); return; } setError(""); setStep(2); }} className="w-full py-3 rounded-xl font-bold text-sm text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
                Next →
              </button>
            </div>
          )}

          {step===2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-headline font-bold text-on-surface">Account Details</h2>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required placeholder="you@business.com" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e=>update("password",e.target.value)} required placeholder="At least 8 characters" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e=>update("confirm",e.target.value)} required placeholder="Repeat password" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(1)} className="flex-1 py-3 rounded-xl font-bold text-sm text-on-surface-variant" style={{ background:"rgba(255,255,255,0.06)" }}>← Back</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-sm text-on-primary disabled:opacity-60" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>{loading?"Creating…":"Create Account"}</button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-on-surface-variant">Already have an account?{" "}<Link href="/login" className="font-bold" style={{ color:"#46f1c5" }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
