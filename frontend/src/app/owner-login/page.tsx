"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/auth/owner/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("owner_access_token", token);
      router.push("/admin");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Invalid credentials. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">
            VaaniAI
          </span>
          <p className="text-on-surface-variant text-sm mt-2">Platform Owner Portal</p>
        </div>

        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-xl">
          <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Owner Sign In</h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Access the platform administration dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@example.com"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-on-surface-variant/50 mt-6">
          Tenant login?{" "}
          <a href="/login" className="text-primary hover:underline">
            Click here
          </a>
        </p>
      </div>
    </div>
  );
}
