"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const plans = [
  { name:"Starter",    price:"₹999",  calls:"500",  features:["500 AI calls/mo","Hindi + English","Basic analytics","Email support"],  color:"#c7bfff", popular:false },
  { name:"Growth",     price:"₹2,499",calls:"2,000",features:["2,000 AI calls/mo","3 languages","Advanced analytics","24/7 support","WhatsApp alerts"], color:"#46f1c5", popular:true  },
  { name:"Enterprise", price:"Custom",calls:"Unlimited",features:["Unlimited AI calls","All languages","Custom integrations","Dedicated manager","SLA guarantee"], color:"#ffcea6", popular:false },
];

const invoices = [
  { id:"INV-0032", date:"Jul 1, 2025", amount:"₹2,499", status:"Paid"    },
  { id:"INV-0031", date:"Jun 1, 2025", amount:"₹2,499", status:"Paid"    },
  { id:"INV-0030", date:"May 1, 2025", amount:"₹2,499", status:"Paid"    },
  { id:"INV-0029", date:"Apr 1, 2025", amount:"₹999",   status:"Paid"    },
  { id:"INV-0028", date:"Mar 1, 2025", amount:"₹999",   status:"Paid"    },
];

export default function BillingPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const used = 1423, quota = 2000;
  const pct = Math.round((used/quota)*100);

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Billing" />
        <main className="pt-16 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-headline font-black text-on-surface">Billing &amp; Plan</h1>
            <p className="text-on-surface-variant text-sm mt-0.5">Manage your subscription and usage.</p>
          </div>

          {/* Current plan + usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(70,241,197,0.2)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Current Plan</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-headline font-black" style={{ color:"#46f1c5" }}>Growth Plan</h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(70,241,197,0.1)", color:"#46f1c5" }}>Active</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-1">₹2,499 / month · Next billing Aug 1, 2025</p>
                </div>
                <button onClick={()=>setShowUpgrade(true)} className="px-4 py-2 rounded-xl text-sm font-bold transition-transform hover:scale-105 text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
                  Upgrade Plan
                </button>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant font-bold">AI Call Minutes Used</span>
                  <span className="font-bold" style={{ color:"#46f1c5" }}>{used.toLocaleString()} / {quota.toLocaleString()}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:`linear-gradient(90deg,#46f1c5,#00d4aa)` }} />
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{pct}% of monthly quota used · {quota-used} minutes remaining</p>
              </div>
            </div>

            <div className="rounded-2xl p-5 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Quick Info</p>
              {[
                { label:"Monthly Cost",    value:"₹2,499",    icon:"payments",     color:"#c7bfff" },
                { label:"Next Renewal",    value:"Aug 1, 2025",icon:"calendar_today",color:"#ffcea6" },
                { label:"Payment Method",  value:"•••• 4242", icon:"credit_card",  color:"#46f1c5" },
              ].map(i => (
                <div key={i.label} className="flex items-center gap-3 py-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span className="material-symbols-outlined text-base" style={{ color:i.color, fontVariationSettings:"'FILL' 1" }}>{i.icon}</span>
                  <div className="flex-1">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{i.label}</p>
                    <p className="text-sm font-bold text-on-surface">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice history */}
          <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="font-headline font-bold text-on-surface">Invoice History</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold" style={{ color:"#46f1c5" }}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>download</span>
                Download All
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  {["Invoice #","Date","Amount","Status","Action"].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-6 py-3.5 font-mono font-bold text-on-surface text-xs">{inv.id}</td>
                    <td className="px-6 py-3.5 text-on-surface-variant">{inv.date}</td>
                    <td className="px-6 py-3.5 font-bold text-on-surface">{inv.amount}</td>
                    <td className="px-6 py-3.5"><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:"rgba(70,241,197,0.1)", color:"#46f1c5" }}>{inv.status}</span></td>
                    <td className="px-6 py-3.5"><button className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">download</span>PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)" }} onClick={()=>setShowUpgrade(false)}>
          <div className="w-full max-w-3xl rounded-3xl p-8 space-y-6" style={{ background:"#12151f", border:"1px solid rgba(255,255,255,0.07)" }} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-black text-on-surface">Choose a Plan</h2>
              <button onClick={()=>setShowUpgrade(false)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {plans.map(p => (
                <div key={p.name} className="rounded-2xl p-5 space-y-4 cursor-pointer transition-transform hover:scale-[1.02]" style={{ background:`${p.color}08`, border:`1px solid ${p.popular?"rgba(70,241,197,0.35)":"rgba(255,255,255,0.06)"}`, position:"relative" }}>
                  {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-0.5 rounded-full text-on-primary" style={{ background:"linear-gradient(90deg,#46f1c5,#00d4aa)" }}>MOST POPULAR</span>}
                  <div>
                    <p className="font-headline font-bold text-on-surface">{p.name}</p>
                    <p className="text-2xl font-headline font-black mt-1" style={{ color:p.color }}>{p.price}<span className="text-sm font-normal text-on-surface-variant">/mo</span></p>
                    <p className="text-xs text-on-surface-variant">{p.calls} AI calls</p>
                  </div>
                  <ul className="space-y-1.5">
                    {p.features.map(f => <li key={f} className="flex items-center gap-2 text-xs text-on-surface"><span className="material-symbols-outlined text-sm" style={{ color:p.color, fontVariationSettings:"'FILL' 1" }}>check_circle</span>{f}</li>)}
                  </ul>
                  <button className="w-full py-2 rounded-xl text-sm font-bold text-on-primary" style={{ background:`linear-gradient(135deg,${p.color},${p.color}99)` }}>Select {p.name}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
