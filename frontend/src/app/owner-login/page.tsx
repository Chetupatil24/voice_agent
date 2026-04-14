"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/v1/auth/owner/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid credentials."); return; }
      localStorage.setItem("owner_token", data.access_token);
      router.push("/admin");
    } catch { setError("Connection failed. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background:"#050810" }}>
      <div className="orb" style={{ width:"550px", height:"550px", background:"radial-gradient(circle,rgba(255,206,166,0.1),transparent 70%)", right:"-200px", top:"-200px", position:"absolute", animation:"orb-float 9s ease-in-out infinite" }} />
      <div className="orb" style={{ width:"450px", height:"450px", background:"radial-gradient(circle,rgba(199,191,255,0.1),transparent 70%)", left:"-150px", bottom:"-150px", position:"absolute", animation:"orb-float 13s ease-in-out infinite reverse" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:"linear-gradient(135deg,#c7bfff,#a89aff)" }}>
            <span className="material-symbols-outlined text-3xl" style={{ color:"#1a0a5c", fontVariationSettings:"'FILL' 1" }}>admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-headline font-black text-on-surface">Owner Portal</h1>
          <p className="text-on-surface-variant mt-1">Restricted access — authorized personnel only</p>
        </div>

        <div className="rounded-3xl p-8 space-y-5" style={{ background:"rgba(18,21,31,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(199,191,255,0.12)" }}>
          <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold" style={{ background:"rgba(255,206,166,0.07)", border:"1px solid rgba(255,206,166,0.15)", color:"#ffcea6" }}>
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings:"'FILL' 1" }}>lock</span>
            Secure admin access — activity is logged
          </div>

          {error && <div className="rounded-xl p-3 text-sm font-bold" style={{ background:"rgba(255,180,171,0.1)", border:"1px solid rgba(255,180,171,0.2)", color:"#ffb4ab" }}>{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Owner Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="owner@charliesai.com" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-transform hover:scale-[1.02]" style={{ background:"linear-gradient(135deg,#c7bfff,#a89aff)", color:"#1a0a5c" }}>
              {loading ? "Authenticating…" : "Access Admin Dashboard"}
            </button>
          </form>
          <p className="text-center text-xs text-on-surface-variant opacity-40">Not an owner? <Link href="/login" style={{ color:"#46f1c5" }}>Go to tenant login →</Link></p>
        </div>
      </div>
    </div>
  );
}
