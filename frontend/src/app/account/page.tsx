"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function AccountPage() {
  const [tab, setTab] = useState<"profile"|"password"|"danger">("profile");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function save() { setSaved(true); setTimeout(()=>setSaved(false),2500); }

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Account" />
        <main className="pt-16 p-6 space-y-6 max-w-2xl">
          <div>
            <h1 className="text-2xl font-headline font-black text-on-surface">Account Settings</h1>
            <p className="text-on-surface-variant text-sm mt-0.5">Manage your business profile and security.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>
            {(["profile","password","danger"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} className="px-5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all" style={tab===t ? { background:t==="danger"?"rgba(255,180,171,0.12)":"rgba(70,241,197,0.12)", color:t==="danger"?"#ffb4ab":"#46f1c5" } : { color:"rgba(186,202,194,0.5)" }}>
                {t==="danger"?"Danger Zone":t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {/* Profile */}
          {tab==="profile" && (
            <div className="rounded-2xl p-6 space-y-5" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-headline font-black text-2xl text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>C</div>
                <div>
                  <p className="font-bold text-on-surface text-lg">Charlie's Clinic</p>
                  <p className="text-xs text-on-surface-variant">Growth Plan · Active since Jan 2025</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Business Name",   value:"Charlie's Clinic",  type:"text" },
                  { label:"Industry",        value:"Healthcare",         type:"text" },
                  { label:"Business Phone",  value:"+91 98765 43210",   type:"tel"  },
                  { label:"Email Address",   value:"charlie@clinic.in", type:"email"},
                  { label:"City",            value:"Bengaluru",          type:"text" },
                  { label:"GST Number",      value:"29AABCC1234A1Z5",   type:"text" },
                ].map(f=>(
                  <div key={f.label}>
                    <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">{f.label}</label>
                    <input type={f.type} defaultValue={f.value} className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none transition-all" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={save} className="px-6 py-2.5 rounded-xl font-bold text-sm text-on-primary transition-transform hover:scale-105" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
                  {saved?"✓ Saved!":"Save Profile"}
                </button>
                {saved && <p className="text-xs text-on-surface-variant">Profile updated.</p>}
              </div>
            </div>
          )}

          {/* Password */}
          {tab==="password" && (
            <div className="rounded-2xl p-6 space-y-5" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="font-headline font-bold text-on-surface text-lg">Change Password</h3>
              {[
                { label:"Current Password",  placeholder:"••••••••••" },
                { label:"New Password",      placeholder:"At least 8 characters" },
                { label:"Confirm Password",  placeholder:"Repeat new password" },
              ].map(f=>(
                <div key={f.label}>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5">{f.label}</label>
                  <input type="password" placeholder={f.placeholder} className="w-full rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }} />
                </div>
              ))}
              <div className="p-3 rounded-xl text-xs text-on-surface-variant" style={{ background:"rgba(199,191,255,0.05)", border:"1px solid rgba(199,191,255,0.1)" }}>
                <p className="font-bold text-[#c7bfff] mb-1">Password requirements</p>
                <ul className="space-y-0.5 list-none">
                  {["At least 8 characters","Contains a number or symbol","Mixed upper and lower case"].map(r=><li key={r}>✓ {r}</li>)}
                </ul>
              </div>
              <button onClick={save} className="px-6 py-2.5 rounded-xl font-bold text-sm text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>{saved?"✓ Updated!":"Update Password"}</button>
            </div>
          )}

          {/* Danger zone */}
          {tab==="danger" && (
            <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,180,171,0.15)" }}>
              <h3 className="font-headline font-bold text-lg" style={{ color:"#ffb4ab" }}>Danger Zone</h3>
              <p className="text-sm text-on-surface-variant">The following actions are irreversible. Please proceed with caution.</p>
              <div className="rounded-xl p-4 flex items-center justify-between" style={{ background:"rgba(255,180,171,0.05)", border:"1px solid rgba(255,180,171,0.1)" }}>
                <div>
                  <p className="font-bold text-on-surface">Delete Account</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Permanently remove all data, calls, and appointments.</p>
                </div>
                <button onClick={()=>setConfirmDelete(true)} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background:"rgba(255,180,171,0.1)", color:"#ffb4ab", border:"1px solid rgba(255,180,171,0.2)" }}>Delete Account</button>
              </div>
              <div className="rounded-xl p-4 flex items-center justify-between" style={{ background:"rgba(255,180,171,0.05)", border:"1px solid rgba(255,180,171,0.1)" }}>
                <div>
                  <p className="font-bold text-on-surface">Cancel Subscription</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Your agent will stop taking calls at end of billing period.</p>
                </div>
                <button className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background:"rgba(255,180,171,0.1)", color:"#ffb4ab", border:"1px solid rgba(255,180,171,0.2)" }}>Cancel Plan</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }} onClick={()=>setConfirmDelete(false)}>
          <div className="w-96 rounded-3xl p-8 space-y-4" style={{ background:"#12151f", border:"1px solid rgba(255,180,171,0.3)" }} onClick={e=>e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto" style={{ background:"rgba(255,180,171,0.1)" }}>
              <span className="material-symbols-outlined text-2xl" style={{ color:"#ffb4ab", fontVariationSettings:"'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-center font-headline font-bold text-on-surface text-xl">Delete Account?</h3>
            <p className="text-center text-sm text-on-surface-variant">This will permanently delete all your data including call history, appointments, and knowledge base. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-on-surface" style={{ background:"rgba(255,255,255,0.06)" }}>Cancel</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{ background:"rgba(255,180,171,0.15)", color:"#ffb4ab" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
