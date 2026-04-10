"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

const mockDocs = [
  { id: 1, name: "Business_FAQs.pdf", type: "PDF", date: "Jan 10, 2024", status: "Indexed", confidence: 98 },
  { id: 2, name: "Pricing_2024.csv", type: "CSV", date: "Jan 8, 2024", status: "Indexed", confidence: 95 },
  { id: 3, name: "Services_Guide.docx", type: "DOCX", date: "Jan 5, 2024", status: "Processing", confidence: 0 },
  { id: 4, name: "Holiday_Hours.txt", type: "TXT", date: "Dec 28, 2023", status: "Indexed", confidence: 99 },
];

const mockQA = [
  { q: "What are your opening hours?", a: "We are open Monday to Saturday, 9 AM to 6 PM. Emergency services available 24/7.", tags: ["hours", "operations"] },
  { q: "How do I reschedule an appointment?", a: "You can reschedule up to 2 hours before your appointment via WhatsApp or by calling us.", tags: ["appointments", "policy"] },
];

export default function KnowledgePage() {
  const [dragging, setDragging] = useState(false);
  const [expandedQA, setExpandedQA] = useState<number | null>(0);
  const [showAddQA, setShowAddQA] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Knowledge Base</h1>
            <p className="text-xs text-on-surface-variant">Manage documents, FAQs, and training data</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total Assets</p>
                <p className="text-base font-headline font-bold text-on-surface">128</p>
              </div>
              <div className="w-px h-8 bg-outline-variant/20 mx-2" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Global Health</p>
                <p className="text-base font-headline font-bold text-primary">98.4%</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Upload zone + Neural Alignment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload zone */}
            <div className="lg:col-span-2">
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:border-primary/50 hover:bg-primary/2"}`}
              >
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
                <h3 className="font-headline font-bold text-on-surface mb-1">Drop files here to train your AI</h3>
                <p className="text-sm text-on-surface-variant mb-6">PDFs, CSVs, DOCX, TXT files supported</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                    Browse Files
                  </button>
                  <button className="px-5 py-2.5 border border-outline-variant/30 rounded-xl text-on-surface text-sm font-bold hover:bg-surface-container transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">link</span>
                    Import from URL
                  </button>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  {["PDF", "CSV", "XLSX", "TXT", "DOCX"].map(t => (
                    <span key={t} className="text-[10px] font-bold px-2 py-1 rounded bg-surface-container text-on-surface-variant">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Neural Alignment card */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  <h3 className="font-bold text-on-surface">Neural Alignment</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-on-surface-variant">Context Window</span>
                      <span className="text-xs font-bold text-on-surface">72%</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full" style={{ width: "72%" }} />
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">128k tokens utilized</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-on-surface-variant">Indexing Accuracy</span>
                      <span className="text-xs font-bold text-primary">99.2%</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "99.2%" }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/10">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Last Training</p>
                    <p className="text-sm font-bold text-on-surface">2 hours ago</p>
                    <p className="text-xs text-on-surface-variant">Auto-sync enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents table */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h2 className="font-headline font-bold text-on-surface">Source Documents</h2>
              <span className="text-xs text-on-surface-variant">{mockDocs.length} documents</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Name</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Type</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Added</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Confidence</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {mockDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-surface-container/40 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                        <span className="font-bold text-on-surface">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-surface-container text-on-surface-variant">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{doc.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${doc.status === "Indexed" ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"}`}>
                        {doc.status === "Processing" ? (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                            {doc.status}
                          </span>
                        ) : doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.confidence > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${doc.confidence}%` }} />
                          </div>
                          <span className="text-xs font-bold text-primary">{doc.confidence}%</span>
                        </div>
                      ) : <span className="text-xs text-on-surface-variant/30">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Q&A Pairs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-on-surface">Manual Q&A Pairs</h2>
              <button onClick={() => setShowAddQA(p => !p)} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Pair
              </button>
            </div>

            {showAddQA && (
              <div className="mb-4 bg-surface-container-low rounded-2xl p-5 border border-primary/20">
                <div className="space-y-3">
                  <input placeholder="Question..." className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  <textarea placeholder="Answer..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">Save Pair</button>
                    <button onClick={() => setShowAddQA(false)} className="px-4 py-2 border border-outline-variant/20 rounded-xl text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-all">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {mockQA.map((pair, i) => (
                <div key={i} className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
                  <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-container/40 transition-all" onClick={() => setExpandedQA(expandedQA === i ? null : i)}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                      <span className="font-bold text-on-surface text-sm text-left">{pair.q}</span>
                    </div>
                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedQA === i ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  {expandedQA === i && (
                    <div className="px-5 pb-4 border-t border-outline-variant/10">
                      <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">{pair.a}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pair.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h3 className="font-bold text-on-surface mb-4">Content Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: "FAQs & General", pct: 42, color: "bg-primary" },
                  { label: "Pricing & Plans", pct: 28, color: "bg-secondary" },
                  { label: "Operations & Hours", pct: 18, color: "bg-tertiary" },
                  { label: "Policies", pct: 12, color: "bg-error" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-on-surface-variant">{item.label}</span>
                      <span className="text-xs font-bold text-on-surface">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
              <h3 className="font-bold text-on-surface mb-4">Top Searched Missing Context</h3>
              <div className="space-y-2">
                {[
                  "Do you offer EMI payments?",
                  "What insurances do you accept?",
                  "Can I have a home visit?",
                  "Weekend appointment availability?",
                ].map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-all">
                    <span className="text-sm text-on-surface-variant">{q}</span>
                    <button className="text-xs text-primary font-bold hover:underline">Add</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>
    </div>
  );
}
