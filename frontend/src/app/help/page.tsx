"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const FAQ_CATEGORIES = [
  {
    id: "general",
    icon: "info",
    iconColor: "text-secondary",
    iconBg: "bg-[#4327c4]/20",
    title: "General",
    description: "Basic questions about VaaniAI capabilities, security standards, and getting started.",
    items: [
      "What is VaaniAI?",
      "API Rate Limits",
      "Data Privacy Policy",
    ],
  },
  {
    id: "integration",
    icon: "integration_instructions",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Integration",
    description: "Technical guides for SDKs, Webhooks, and connecting your existing tech stack.",
    items: [
      "Node.js SDK Setup",
      "Webhook Authentication",
      "Python Wrapper Docs",
    ],
  },
  {
    id: "billing",
    icon: "payments",
    iconColor: "text-tertiary",
    iconBg: "bg-[#ffa858]/20",
    title: "Billing",
    description: "Manage subscriptions, invoices, payment methods, and usage-based credits.",
    items: [
      "Invoicing Cycles",
      "Updating Payment Methods",
      "Tier Transitions",
    ],
  },
];

const TICKETS = [
  {
    id: "#VA-9902",
    icon: "code",
    iconColor: "text-secondary",
    iconBg: "bg-[#4327c4]/30",
    title: "Webhook signature mismatch on v2.4",
    updated: "2h ago",
    status: "IN PROGRESS",
    statusClass: "bg-[#4327c4] text-on-secondary-container",
  },
  {
    id: "#VA-8756",
    icon: "account_balance_wallet",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Subscription renewal confirmation",
    updated: "Yesterday",
    status: "Resolved",
    statusClass: "bg-primary/20 text-primary",
  },
  {
    id: "#VA-8744",
    icon: "key",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary/10",
    title: "Enterprise API Key rotation failed",
    updated: "3 days ago",
    status: "Resolved",
    statusClass: "bg-primary/20 text-primary",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="ml-64 pt-0 px-6 pb-12 min-h-screen w-full">
        {/* Hero Search */}
        <header className="max-w-4xl mx-auto text-center mb-16 pt-12">
          <h1 className="text-5xl md:text-6xl font-bold font-headline text-on-surface mb-6 tracking-tight">
            How can we <span className="text-primary italic">help you</span> today?
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10">
            Search our comprehensive documentation or browse through frequently asked questions to find quick resolutions.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-primary">search</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-2xl py-5 pl-12 pr-16 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all shadow-2xl placeholder:text-outline"
              placeholder="Search documentation, tutorials, or error codes..."
              type="text"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pr-2">
              <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold text-on-surface-variant bg-surface-container-highest rounded border border-outline-variant">⌘K</kbd>
            </div>
          </div>
        </header>

        {/* FAQ Categories Grid */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAQ_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="group bg-surface-container-low p-8 rounded-3xl border border-transparent hover:border-primary/20 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.iconBg} flex items-center justify-center mb-6`}>
                  <span
                    className={`material-symbols-outlined ${cat.iconColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <h3 className="text-xl font-headline font-semibold text-on-surface mb-3">{cat.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{cat.description}</p>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-primary text-xs hover:underline flex items-center gap-2">
                        {item}
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Bento: Tickets + Contact CTA */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Ticket History */}
          <div className="lg:col-span-8 bg-surface-container rounded-3xl p-1 overflow-hidden">
            <div className="bg-surface-container-low rounded-[1.4rem] p-8 h-full">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Ticket History</h2>
                  <p className="text-on-surface-variant text-sm">Monitor and track your recent support requests</p>
                </div>
                <button className="text-sm text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-all">View All</button>
              </div>
              <div className="space-y-4">
                {TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${ticket.iconBg} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined ${ticket.iconColor} text-lg`}>{ticket.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-on-surface font-semibold text-sm group-hover:text-primary transition-colors">{ticket.title}</h4>
                        <p className="text-[11px] text-on-surface-variant mt-1">Ticket ID: {ticket.id} · Updated {ticket.updated}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <span className={`${ticket.statusClass} px-3 py-1 rounded-full text-[10px] font-bold tracking-wider`}>{ticket.status}</span>
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div
            className="lg:col-span-4 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
            style={{ background: "linear-gradient(to bottom right, #4327c4, #10131c)" }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            <div className="z-10">
              <h3 className="text-3xl font-headline font-bold text-white mb-4">Still need assistance?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Our expert support engineers are available 24/7 to help you troubleshoot complex integration issues.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">chat_bubble</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    Live Chat: <span className="text-primary font-bold">Online</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">alternate_email</span>
                  </div>
                  <span className="text-white text-sm font-medium">support@vaani.ai</span>
                </div>
              </div>
            </div>
            <button className="z-10 w-full bg-white text-[#4327c4] font-bold py-4 px-6 rounded-2xl hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3">
              Contact Support
              <span className="material-symbols-outlined">headset_mic</span>
            </button>
          </div>
        </section>

        {/* Featured Documentation */}
        <section className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-headline font-bold text-on-surface mb-8 px-4 border-l-4 border-primary">Recommended for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                tag: "Tutorial",
                tagClass: "bg-primary/20 text-primary",
                title: "Mastering Multi-Lingual Voice Bots",
                body: "Learn how to deploy agents that fluently switch between Hindi, Kannada, and English in real-time.",
                gradient: "from-primary/30",
              },
              {
                tag: "Best Practice",
                tagClass: "bg-secondary/20 text-secondary",
                title: "Optimizing Voice Latency",
                body: "Strategies to reduce API response times from 400ms down to sub-50ms for natural conversations.",
                gradient: "from-secondary/30",
              },
            ].map((article) => (
              <div key={article.title} className="relative group cursor-pointer overflow-hidden rounded-3xl bg-surface-container-high min-h-[220px] hover:-translate-y-1 transition-transform">
                <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} to-transparent opacity-30`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className={`${article.tagClass} text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 w-fit mb-3 rounded-full`}>
                    {article.tag}
                  </span>
                  <h3 className="text-2xl font-headline font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-on-surface-variant text-sm">{article.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="hidden" />
    </div>
  );
}
