"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  tenant_id: z.string().uuid("Invalid tenant ID"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await login(data.email, data.password);
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("tenant_id", data.tenant_id);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-surface-container-lowest p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-60" />
        <div className="absolute inset-0 grid-overlay" />
        {/* Logo */}
        <div className="relative z-10">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">VaaniAI</span>
        </div>
        {/* Center */}
        <div className="relative z-10">
          <h2 className="text-4xl font-headline font-bold text-on-surface leading-tight mb-4">AI receptionist that speaks India&apos;s languages.</h2>
          <p className="text-on-surface-variant leading-relaxed">Handle every call, in every language, 24/7.</p>
          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-surface-container/80 backdrop-blur rounded-2xl p-4 border border-outline-variant/10">
              <p className="text-3xl font-headline font-bold text-primary">10L+</p>
              <p className="text-xs text-on-surface-variant mt-1">Calls Analyzed</p>
            </div>
            <div className="bg-surface-container/80 backdrop-blur rounded-2xl p-4 border border-outline-variant/10">
              <p className="text-3xl font-headline font-bold text-secondary">9+</p>
              <p className="text-xs text-on-surface-variant mt-1">Regional Languages</p>
            </div>
          </div>
        </div>
        {/* Bottom trust badge */}
        <div className="relative z-10">
          <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">Trusted by Fortune 500 India</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Welcome back</h1>
            <p className="text-on-surface-variant">Sign in to your VaaniAI dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder=" "
                className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
              <label htmlFor="email" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Work Email</label>
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register("password")}
                type={showPw ? "text" : "password"}
                id="password"
                placeholder=" "
                className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition pr-12"
              />
              <label htmlFor="password" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all">Password</label>
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-lg">{showPw ? "visibility_off" : "visibility"}</span>
              </button>
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register("tenant_id")}
                type="text"
                id="tenant_id"
                placeholder=" "
                className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface placeholder-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition font-mono text-sm"
              />
              <label htmlFor="tenant_id" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-on-surface-variant transition-all font-sans">Tenant ID</label>
              {errors.tenant_id && <p className="mt-1 text-xs text-error">{errors.tenant_id.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant bg-surface-container accent-primary" />
                <span className="text-sm text-on-surface-variant">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            {error && (
              <div className="rounded-xl bg-error-container/20 border border-error/30 px-4 py-3 text-sm text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-outline-variant/20" />
              <span className="text-xs text-on-surface-variant">OR</span>
              <div className="flex-1 h-px bg-outline-variant/20" />
            </div>

            <button type="button" className="w-full py-3 border border-outline-variant/30 rounded-xl text-on-surface font-semibold flex items-center justify-center gap-3 hover:bg-surface-container transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            New to VaaniAI?{" "}
            <a href="/register" className="text-primary font-semibold hover:underline">Create an account</a>
          </p>
          <p className="text-center text-xs text-on-surface-variant/50 mt-3">
            Platform Owner?{" "}
            <a href="/owner-login" className="text-primary hover:underline">Sign in here</a>
          </p>
        </div>

        {/* Language pill */}
        <div className="absolute bottom-6 flex gap-1 p-1 bg-surface-container rounded-full border border-outline-variant/20">
          {["ENGLISH","हिंदी","ಕನ್ನಡ"].map((l,i)=>(
            <button key={l} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${i===0?"bg-primary text-on-primary":"text-on-surface-variant hover:text-on-surface"}`}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
