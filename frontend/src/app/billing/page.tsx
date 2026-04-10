"use client";

import { Sidebar } from "@/components/Sidebar";

const invoices = [
  { id: "INV-2024-009", date: "Jan 1, 2024", amount: "₹12,999", status: "Paid" },
  { id: "INV-2024-008", date: "Dec 1, 2023", amount: "₹12,999", status: "Paid" },
  { id: "INV-2024-007", date: "Nov 1, 2023", amount: "₹12,999", status: "Paid" },
];

const planFeatures: Record<string, { starter: string; growth: string; enterprise: string }> = {
  "Monthly Voice Calls": { starter: "500", growth: "2,000", enterprise: "Unlimited" },
  "Concurrent Calls": { starter: "1", growth: "5", enterprise: "Custom" },
  "Multi-lingual Support": { starter: "EN only", growth: "EN + HI + KN", enterprise: "All 10+" },
  "Voice Cloning": { starter: "✗", growth: "✗", enterprise: "✓" },
  "CRM Integration": { starter: "✗", growth: "✓", enterprise: "✓" },
  "Dedicated Support": { starter: "Email", growth: "Priority", enterprise: "Dedicated CSM" },
};

export default function BillingPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Billing & Subscriptions</h1>
            <p className="text-xs text-on-surface-variant">Manage your plan and payment history</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="lg:col-span-2 bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
              <div className="bg-gradient-to-br from-secondary/20 to-primary/5 p-6 border-b border-outline-variant/10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary uppercase tracking-widest">Current Plan</span>
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-on-surface">Growth Plan</h2>
                    <p className="text-on-surface-variant mt-1">Billed monthly · Renews Feb 1, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-headline font-bold text-on-surface">₹12,999</p>
                    <p className="text-on-surface-variant text-sm">/month</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-on-surface">Current period usage</h3>
                  <span className="text-xs text-on-surface-variant">Resets Feb 1, 2024</span>
                </div>
                <div className="space-y-5">
                  {[
                    { label: "Voice Calls", used: 1247, total: 2000, pct: 62, unit: "", color: "bg-secondary" },
                    { label: "STT Credits", used: 84.2, total: 100, pct: 84, unit: " hrs", color: "bg-tertiary" },
                    { label: "API Requests", used: 42.8, total: 100, pct: 43, unit: "k", color: "bg-primary" },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-on-surface">{r.label}</span>
                        <span className="text-sm text-on-surface-variant">{r.used}{r.unit} / {r.total}{r.unit}</span>
                      </div>
                      <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-on-surface-variant">{r.pct}% used</span>
                        <span className="text-[10px] text-on-surface-variant">{100 - r.pct}% remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-3 bg-gradient-to-br from-secondary to-secondary/80 text-on-secondary font-bold rounded-xl hover:opacity-90 transition-all">
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="space-y-4">
              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Next Invoice</p>
                <p className="text-2xl font-headline font-bold text-on-surface">₹12,999</p>
                <p className="text-xs text-on-surface-variant mt-1">Due Feb 1, 2024</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Payment Method</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gradient-to-r from-[#1a1f71] to-[#00b4d8] rounded flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">VISA</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">•••• 4242</p>
                    <p className="text-xs text-on-surface-variant">Expires 12/26</p>
                  </div>
                </div>
                <button className="mt-3 text-xs text-primary font-bold hover:underline">Update card</button>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Member Since</p>
                <p className="text-xl font-headline font-bold text-on-surface">Apr 2023</p>
                <p className="text-xs text-on-surface-variant mt-1">9 months active</p>
              </div>
            </div>
          </div>

          {/* Compare Plans */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <h2 className="font-headline font-bold text-on-surface">Compare Plans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold w-1/4">Feature</th>
                    <th className="text-center px-6 py-4">
                      <div>
                        <p className="font-headline font-bold text-on-surface">Starter</p>
                        <p className="text-on-surface-variant text-xs">₹2,499/mo</p>
                      </div>
                    </th>
                    <th className="text-center px-6 py-4 bg-secondary/5">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-secondary mb-1 uppercase tracking-widest">Current</span>
                        <p className="font-headline font-bold text-on-surface">Growth</p>
                        <p className="text-on-surface-variant text-xs">₹12,999/mo</p>
                      </div>
                    </th>
                    <th className="text-center px-6 py-4">
                      <div>
                        <p className="font-headline font-bold text-on-surface">Enterprise</p>
                        <p className="text-on-surface-variant text-xs">Custom</p>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {Object.entries(planFeatures).map(([feature, vals]) => (
                    <tr key={feature} className="hover:bg-surface-container/20 transition-all">
                      <td className="px-6 py-3.5 text-on-surface-variant font-bold text-xs">{feature}</td>
                      <td className="px-6 py-3.5 text-center text-sm text-on-surface-variant">{vals.starter}</td>
                      <td className="px-6 py-3.5 text-center bg-secondary/5">
                        <span className="font-bold text-on-surface">{vals.growth}</span>
                      </td>
                      <td className="px-6 py-3.5 text-center text-sm text-on-surface-variant">{vals.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-outline-variant/10">
                    <td className="px-6 py-4" />
                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 border border-outline-variant/20 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-all">
                        Downgrade
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center bg-secondary/5">
                      <span className="px-4 py-2 text-xs font-bold text-secondary">Current Plan</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-xs font-bold hover:opacity-90 transition-all">
                        Contact Sales
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <h2 className="font-headline font-bold text-on-surface">Payment History</h2>
            </div>
            <div className="divide-y divide-outline-variant/5">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-container/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{inv.id}</p>
                      <p className="text-xs text-on-surface-variant">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-on-surface">{inv.amount}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">Paid</span>
                    <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
