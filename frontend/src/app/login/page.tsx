"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid credentials."); return; }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("business_name", data.business_name || "");
      router.push("/dashboard");
    } catch {
      setError("Connection failed. Try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background:"#050810" }}>
      {/* Orbs */}
      <div className="orb" style={{ width:"500px", height:"500px", background:"radial-gradient(circle,rgba(70,241,197,0.12),transparent 70%)", left:"-150px", top:"-150px", position:"absolute", animation:"orb-float 8s ease-in-out infinite" }} />
      <div className="orb" style={{ width:"400px", height:"400px", background:"radial-gradient(circle,rgba(199,191,255,0.1),transparent 70%)", right:"-100px", bottom:"-100px", position:"absolute", animation:"orb-float 11s ease-in-out infinite reverse" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
            <span className="material-symbols-outlined text-3xl" style={{ color:"#00382b", fontVariationSettings:"'FILL' 1" }}>mic</span>
          </div>
          <h1 className="text-3xl font-headline font-black text-on-surface">Welcome back</h1>
          <p className="text-on-surface-variant mt-1">Sign in to manage your AI voice agent</p>
        </div>

        <div className="rounded-3xl p-8 space-y-5" style={{ background:"rgba(18,21,31,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.07)" }}>
          {error && (
            <div className="rounded-xl p-3 text-sm font-bold" style={{ background:"rgba(255,180,171,0.1)", border:"1px solid rgba(255,180,171,0.2)", color:"#ffb4ab" }}>{error}</div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@business.com" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)" }} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-on-primary transition-transform hover:scale-[1.02] disabled:opacity-60" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold transition-colors hover:opacity-80" style={{ color:"#46f1c5" }}>Create one</Link>
          </p>
        </div>
        <p className="text-center text-xs text-on-surface-variant mt-4 opacity-50">Owner? <Link href="/owner-login" style={{ color:"#c7bfff" }}>Admin login →</Link></p>
      </div>
    </div>
  );
}
