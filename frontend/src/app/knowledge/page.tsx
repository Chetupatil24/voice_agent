"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const docs = [
  { id:"d1", name:"Service Menu.pdf",        type:"PDF",  size:"124 KB", date:"Jul 15, 2025", status:"Trained" },
  { id:"d2", name:"Pricing Guide 2025.docx", type:"DOCX", size:"58 KB",  date:"Jul 10, 2025", status:"Trained" },
  { id:"d3", name:"FAQ - Common Queries.txt",type:"TXT",  size:"12 KB",  date:"Jul 8, 2025",  status:"Trained" },
  { id:"d4", name:"Holiday Schedule.pdf",    type:"PDF",  size:"31 KB",  date:"Jul 1, 2025",  status:"Trained" },
  { id:"d5", name:"New Services Q3.docx",    type:"DOCX", size:"44 KB",  date:"Jul 22, 2025", status:"Processing" },
];

const faqs = [
  { q:"What are your working hours?",          a:"We are open Monday–Saturday, 9 AM to 8 PM." },
  { q:"Do you accept walk-ins?",               a:"Yes, walk-ins are welcome based on availability." },
  { q:"How do I cancel my appointment?",       a:"Call us or ask the AI assistant to cancel your booking." },
  { q:"Do you accept insurance?",              a:"We accept most major health insurance plans. Please confirm when booking." },
];

export default function KnowledgePage() {
  const [dragging, setDragging] = useState(false);
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [faqList, setFaqList] = useState(faqs);

  function addFaq() {
    if(!faqQ.trim() || !faqA.trim()) return;
    setFaqList(prev=>[...prev,{q:faqQ,a:faqA}]);
    setFaqQ(""); setFaqA("");
  }

  const typeColor: Record<string,string> = { PDF:"#ffb4ab", DOCX:"#c7bfff", TXT:"#46f1c5" };

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Knowledge Base" />
        <main className="pt-16 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-headline font-black text-on-surface">Knowledge Base</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">Teach your AI agent about your business.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background:"rgba(70,241,197,0.1)", color:"#46f1c5" }}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>neurology</span>
              AI Trained on 5 docs + {faqList.length} FAQs
            </div>
          </div>

          {/* Upload zone */}
          <div className="rounded-2xl p-8 text-center cursor-pointer transition-all"
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false)}}
            style={{ background:dragging?"rgba(70,241,197,0.06)":"rgba(24,28,36,0.8)", border:`2px dashed ${dragging?"#46f1c5":"rgba(255,255,255,0.08)"}`, transition:"all 0.2s" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:"rgba(70,241,197,0.1)" }}>
              <span className="material-symbols-outlined text-3xl" style={{ color:"#46f1c5", fontVariationSettings:"'FILL' 1" }}>cloud_upload</span>
            </div>
            <p className="font-headline font-bold text-on-surface">Drop files here or <span style={{ color:"#46f1c5" }}>browse</span></p>
            <p className="text-xs text-on-surface-variant mt-1">PDF, DOCX, TXT · Max 10 MB per file</p>
          </div>

          {/* Documents */}
          <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="px-6 py-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="font-headline font-bold text-on-surface">Uploaded Documents</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  {["File","Type","Size","Added","Status",""].map(h=><th key={h+Math.random()} className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {docs.map(d=>(
                  <tr key={d.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base" style={{ color:typeColor[d.type]||"#c7bfff", fontVariationSettings:"'FILL' 1" }}>description</span>
                        <span className="font-bold text-on-surface">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5"><span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background:`${typeColor[d.type]||"#c7bfff"}15`, color:typeColor[d.type]||"#c7bfff" }}>{d.type}</span></td>
                    <td className="px-6 py-3.5 text-on-surface-variant text-xs">{d.size}</td>
                    <td className="px-6 py-3.5 text-on-surface-variant text-xs">{d.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.status==="Trained"?"text-[#46f1c5]":"text-[#ffcea6]"}`} style={{ background:d.status==="Trained"?"rgba(70,241,197,0.1)":"rgba(255,206,166,0.1)" }}>
                        {d.status==="Processing" && "⏳ "}{d.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5"><button className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-base">delete_outline</span></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ editor */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-headline font-bold text-on-surface text-lg">FAQ Builder</h3>
            <div className="grid grid-cols-2 gap-3">
              <input value={faqQ} onChange={e=>setFaqQ(e.target.value)} placeholder="Question…" className="rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
              <input value={faqA} onChange={e=>setFaqA(e.target.value)} placeholder="Answer…" className="rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <button onClick={addFaq} className="px-5 py-2 rounded-xl text-sm font-bold text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>+ Add FAQ</button>
            <div className="space-y-2 mt-2">
              {faqList.map((f,i)=>(
                <div key={i} className="rounded-xl p-4 flex gap-4" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">Q: {f.q}</p>
                    <p className="text-sm text-on-surface-variant mt-0.5">A: {f.a}</p>
                  </div>
                  <button onClick={()=>setFaqList(prev=>prev.filter((_,j)=>j!==i))} className="text-on-surface-variant hover:text-error transition-colors flex-shrink-0"><span className="material-symbols-outlined text-sm">close</span></button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
