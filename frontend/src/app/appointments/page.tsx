"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const statusStyle: Record<string,{bg:string;color:string}> = {
  Confirmed: { bg:"rgba(70,241,197,0.1)",  color:"#46f1c5" },
  Pending:   { bg:"rgba(255,206,166,0.1)", color:"#ffcea6" },
  Cancelled: { bg:"rgba(255,180,171,0.1)", color:"#ffb4ab" },
};

const appts = [
  { id:"a1", name:"Ramesh Kumar",  time:"10:00 AM", date:"Today",      service:"Consultation",      status:"Confirmed", phone:"+91 98765 43210", note:"First-time patient" },
  { id:"a2", name:"Priya Nair",    time:"11:30 AM", date:"Today",      service:"Annual Check-up",   status:"Confirmed", phone:"+91 76543 21098", note:"Preferred morning slot" },
  { id:"a3", name:"Anjali Desai",  time:"02:00 PM", date:"Today",      service:"Follow-up",         status:"Pending",   phone:"+91 54321 09876", note:"Review test results" },
  { id:"a4", name:"Vikram Singh",  time:"09:00 AM", date:"Tomorrow",   service:"Consultation",      status:"Confirmed", phone:"+91 65432 10987", note:"Insurance pre-auth needed" },
  { id:"a5", name:"Meera Iyer",    time:"01:00 PM", date:"Tomorrow",   service:"Dental Cleaning",   status:"Confirmed", phone:"+91 32109 87654", note:"" },
  { id:"a6", name:"Suresh Patil",  time:"03:30 PM", date:"Tomorrow",   service:"X-Ray",             status:"Pending",   phone:"+91 43210 98765", note:"Bring prior images" },
  { id:"a7", name:"Kavya Reddy",   time:"10:30 AM", date:"Thu, Jul 24",service:"Consultation",      status:"Confirmed", phone:"+91 91234 56780", note:"New patient registration" },
  { id:"a8", name:"Arjun Menon",   time:"04:00 PM", date:"Thu, Jul 24",service:"surgery follow-up", status:"Cancelled", phone:"+91 80123 45679", note:"Patient requested cancellation" },
];

export default function AppointmentsPage() {
  const [selected, setSelected] = useState<typeof appts[0] | null>(null);
  const days = ["Today","Tomorrow","Thu, Jul 24"];
  const count = (d:string) => appts.filter(a=>a.date===d).length;

  return (
    <div className="flex min-h-screen" style={{ background:"#0a0d14" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav breadcrumb="Appointments" />
        <main className="pt-16 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-headline font-black text-on-surface">Appointments</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">AI-booked and manually scheduled appointments.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-on-primary transition-transform hover:scale-105" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings:"'FILL' 1" }}>add</span>
              New Appointment
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:"Total This Week", value:"52",  icon:"calendar_month", color:"#c7bfff" },
              { label:"Today",           value:"3",   icon:"today",          color:"#46f1c5" },
              { label:"Pending",         value:"6",   icon:"pending",        color:"#ffcea6" },
              { label:"Cancellation %",  value:"4.2%",icon:"cancel",         color:"#ffb4ab" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"rgba(24,28,36,0.8)", border:"1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${s.color}18` }}>
                  <span className="material-symbols-outlined text-xl" style={{ color:s.color, fontVariationSettings:"'FILL' 1" }}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-xl font-headline font-black text-on-surface">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Day columns */}
            <div className="flex-1 space-y-6">
              {days.map(day => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-headline font-black text-on-surface">{day}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:"rgba(70,241,197,0.1)", color:"#46f1c5" }}>{count(day)} appts</span>
                  </div>
                  <div className="space-y-2">
                    {appts.filter(a=>a.date===day).map(a => (
                      <div key={a.id} className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01]" style={{ background:"rgba(24,28,36,0.8)", border:`1px solid ${selected?.id===a.id?"rgba(70,241,197,0.2)":"rgba(255,255,255,0.05)"}` }} onClick={()=>setSelected(selected?.id===a.id?null:a)}>
                        <div className="text-right flex-shrink-0 w-16">
                          <p className="font-bold text-sm font-mono" style={{ color:"#46f1c5" }}>{a.time}</p>
                        </div>
                        <div className="w-px h-10 flex-shrink-0" style={{ background:"rgba(255,255,255,0.08)" }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-on-surface">{a.name}</p>
                          <p className="text-xs text-on-surface-variant">{a.service}</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={statusStyle[a.status]}>{a.status}</span>
                        {a.note && <span className="material-symbols-outlined text-sm text-on-surface-variant flex-shrink-0" title={a.note}>note</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-72 flex-shrink-0 rounded-2xl p-5 space-y-4 h-fit sticky top-24" style={{ background:"rgba(24,28,36,0.9)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-on-surface">Appointment</h3>
                  <button onClick={()=>setSelected(null)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-lg">{selected.name}</p>
                  <p className="text-xs text-on-surface-variant font-mono">{selected.phone}</p>
                </div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={statusStyle[selected.status]}>{selected.status}</span>
                <div className="space-y-2">
                  {[["Date", selected.date],["Time", selected.time],["Service", selected.service]].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-1.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{k}</span>
                      <span className="text-sm font-bold text-on-surface">{v}</span>
                    </div>
                  ))}
                </div>
                {selected.note && <div className="p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)" }}>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Note</p>
                  <p className="text-sm text-on-surface">{selected.note}</p>
                </div>}
                <div className="flex flex-col gap-2">
                  <button className="py-2 rounded-xl text-sm font-bold text-on-primary" style={{ background:"linear-gradient(135deg,#46f1c5,#00d4aa)" }}>Edit Appointment</button>
                  <button className="py-2 rounded-xl text-sm font-bold" style={{ color:"#ffb4ab", background:"rgba(255,180,171,0.08)", border:"1px solid rgba(255,180,171,0.15)" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
