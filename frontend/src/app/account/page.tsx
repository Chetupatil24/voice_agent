"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { getTenantId } from "@/lib/utils";

// ─── Mock / Fallback Data ─────────────────────────────────────────────────────
const MOCK_PROFILE = {
  full_name: "Arjun Deshmukh",
  email: "arjun.d@vaani.ai",
  bio: "Lead AI Engineer focusing on multi-lingual voice synthesis and low-latency transformer deployments.",
  plan: "Enterprise Pro",
  renewal: "Oct 24, 2026",
  api_usage: 82,
};

const MOCK_API_KEYS = [
  { label: "Production_Main", key: "vk_live_••••••••••••x8y2", permissions: "Full Access", created: "Aug 12, 2024", permClass: "bg-[#4327c4]/20 text-on-secondary-container" },
  { label: "Dev_Sandbox_Test", key: "vk_test_••••••••••••q3w9", permissions: "Read Only", created: "Sep 05, 2024", permClass: "bg-tertiary/10 text-tertiary" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notifications, setNotifications] = useState({
    email_critical: true,
    whatsapp_deploy: false,
    desktop_push: true,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="ml-64 pt-10 pb-12 px-6 md:px-12 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold font-headline text-on-surface tracking-tight mb-2">Account Settings</h1>
            <p className="text-on-surface-variant">Manage your professional profile, security protocols, and developer integrations.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Personal Info */}
            <section className="md:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="relative group flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      account_circle
                    </span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>

                {/* Fields */}
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80 px-1">Full Name</label>
                      <input
                        className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/40 transition-all"
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80 px-1">Email Address</label>
                      <input
                        className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/40 transition-all"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/80 px-1">Professional Bio</label>
                    <textarea
                      className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/40 transition-all resize-none"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className={cn(
                      "px-6 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95",
                      saved
                        ? "bg-primary/20 text-primary"
                        : "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_4px_20px_0_rgba(70,241,197,0.2)]"
                    )}
                  >
                    {saved ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Saved!
                      </span>
                    ) : "Save Changes"}
                  </button>
                </div>
              </div>
            </section>

            {/* Plan Summary */}
            <section className="md:col-span-4 bg-surface-container rounded-xl p-8 border border-outline-variant/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4 block">Current Plan</span>
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">{profile.plan}</h3>
                <p className="text-on-surface-variant text-sm mb-6">Renewal: {profile.renewal}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant">API Usage</span>
                    <span className="text-primary">{profile.api_usage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
                      style={{ width: `${profile.api_usage}%` }}
                    />
                  </div>
                </div>
              </div>
              <a
                href="/billing"
                className="mt-8 w-full py-3 bg-surface-container-highest hover:bg-surface-bright text-on-surface text-sm font-semibold rounded-lg transition-colors border border-outline-variant/10 text-center block"
              >
                Manage Billing
              </a>
            </section>

            {/* Security */}
            <section className="md:col-span-6 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary">security</span>
                <h2 className="text-xl font-headline font-semibold text-on-surface">Security Protocol</h2>
              </div>
              <div className="space-y-4">
                {/* 2FA */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">vibration</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Two-Factor Authentication</p>
                      <p className="text-xs text-on-surface-variant">Recommended for high-volume accounts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                {/* Change Password */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">key</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Change Password</p>
                      <p className="text-xs text-on-surface-variant">Last changed 42 days ago</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-primary hover:underline transition-all">Update</button>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="md:col-span-6 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-tertiary">notifications_active</span>
                <h2 className="text-xl font-headline font-semibold text-on-surface">Communication</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: "email_critical" as const, label: "Email notifications for critical alerts" },
                  { key: "whatsapp_deploy" as const, label: "WhatsApp updates for deployment status" },
                  { key: "desktop_push" as const, label: "Desktop push notifications" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between p-3 hover:bg-surface-container-lowest rounded-lg transition-colors cursor-pointer group">
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      className="rounded border-outline-variant/30 bg-surface-container text-primary focus:ring-primary/20"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* API Keys */}
            <section className="md:col-span-12 bg-surface-container rounded-2xl p-1 w-full border border-outline-variant/10">
              <div className="bg-surface-container-low rounded-[1.25rem] p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-xl font-headline font-semibold text-on-surface">Developer API Keys</h2>
                    <p className="text-sm text-on-surface-variant">Authentication tokens for VaaniAI Voice Synthesis Core</p>
                  </div>
                  <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_20px_0_rgba(70,241,197,0.2)] active:scale-95 transition-transform">
                    Create New Key
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-outline-variant/10">
                        {["Label", "API Key", "Permissions", "Created", ""].map((h) => (
                          <th key={h} className="pb-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {MOCK_API_KEYS.map((row) => (
                        <tr key={row.label} className="group">
                          <td className="py-4 text-sm font-semibold text-on-surface">{row.label}</td>
                          <td className="py-4">
                            <code className="bg-surface-container-lowest px-3 py-1.5 rounded text-xs text-primary font-mono select-all">{row.key}</code>
                          </td>
                          <td className="py-4">
                            <span className={`${row.permClass} text-[10px] px-2 py-1 rounded-md font-bold uppercase`}>{row.permissions}</span>
                          </td>
                          <td className="py-4 text-sm text-on-surface-variant">{row.created}</td>
                          <td className="py-4 text-right">
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1">delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-error/10">
            <div className="bg-error-container/5 rounded-xl p-6 border border-error/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-error font-headline font-bold text-lg">Terminate Account</h4>
                <p className="text-on-surface-variant text-sm">
                  Once you delete your account, there is no going back. All model weights and training data will be purged.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-2.5 bg-transparent border border-error/30 text-error hover:bg-error hover:text-on-error transition-all rounded-lg text-sm font-bold whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm">
            <div className="bg-surface-container-low border border-error/20 rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-error text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <h3 className="text-xl font-headline font-bold text-on-surface">Delete Account?</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-8">
                This action is permanent. All your data, voice agents, call recordings, and billing information will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-surface-container text-on-surface rounded-xl font-semibold hover:bg-surface-container-high transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-error text-on-error rounded-xl font-bold hover:opacity-90 transition-all active:scale-95">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile padding */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
