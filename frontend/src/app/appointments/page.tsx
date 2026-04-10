"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sidebar } from "@/components/Sidebar";
import { getAppointments, createAppointment, updateAppointment, cancelAppointment, type AppointmentCreate } from "@/lib/api";
import { getTenantId, formatDateTime, cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-secondary/10 text-secondary",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-error/10 text-error",
  completed: "bg-surface-container-high text-on-surface-variant",
  no_show: "bg-tertiary/10 text-tertiary",
  rescheduled: "bg-tertiary/10 text-tertiary",
};

const schema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(6),
  customer_email: z.string().email().optional().or(z.literal("")),
  title: z.string().min(2),
  notes: z.string().optional(),
  scheduled_at: z.string().min(1, "Required"),
  duration_minutes: z.coerce.number().int().min(5).default(30),
});

type FormData = z.infer<typeof schema>;

const mockItems = [
  { id: 1, customer_name: "Ravi Kumar", customer_phone: "+91 98765 43210", title: "Dental Checkup", scheduled_at: new Date(Date.now() + 86400000).toISOString(), duration_minutes: 30, status: "confirmed", agent: "Priya AI" },
  { id: 2, customer_name: "Priya Sharma", customer_phone: "+91 87654 32109", title: "Follow-up Consultation", scheduled_at: new Date(Date.now() + 172800000).toISOString(), duration_minutes: 20, status: "scheduled", agent: "Priya AI" },
  { id: 3, customer_name: "Amit Singh", customer_phone: "+91 76543 21098", title: "Root Canal", scheduled_at: new Date(Date.now() + 259200000).toISOString(), duration_minutes: 60, status: "confirmed", agent: "Priya AI" },
  { id: 4, customer_name: "Neha Gupta", customer_phone: "+91 65432 10987", title: "Cleaning", scheduled_at: new Date(Date.now() - 86400000).toISOString(), duration_minutes: 30, status: "cancelled", agent: "Priya AI" },
  { id: 5, customer_name: "Vikram Patel", customer_phone: "+91 54321 09876", title: "Teeth Whitening", scheduled_at: new Date(Date.now() - 172800000).toISOString(), duration_minutes: 45, status: "completed", agent: "Priya AI" },
];

export default function AppointmentsPage() {
  const tenantId = getTenantId();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showProTip, setShowProTip] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", tenantId],
    queryFn: () => getAppointments(tenantId, { limit: 50 }),
    enabled: !!tenantId,
  });

  const items: Record<string, unknown>[] = data?.items ?? [];
  const displayItems = items.length > 0 ? items : mockItems;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const createMut = useMutation({
    mutationFn: (d: AppointmentCreate) => createAppointment(tenantId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments", tenantId] }); setOpen(false); reset(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<FormData> }) => updateAppointment(tenantId, id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments", tenantId] }); setEditing(null); reset(); },
  });

  const cancelMut = useMutation({
    mutationFn: (id: string) => cancelAppointment(tenantId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments", tenantId] }),
  });

  const onSubmit = async (d: FormData) => {
    if (editing) {
      await updateMut.mutateAsync({ id: String(editing.id), d });
    } else {
      await createMut.mutateAsync({ ...d, customer_email: d.customer_email || undefined, notes: d.notes || undefined });
    }
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    reset({
      customer_name: String(item.customer_name ?? ""),
      customer_phone: String(item.customer_phone ?? ""),
      customer_email: String(item.customer_email ?? ""),
      title: String(item.title ?? ""),
      notes: String(item.notes ?? ""),
      scheduled_at: item.scheduled_at ? String(item.scheduled_at).slice(0, 16) : "",
      duration_minutes: Number(item.duration_minutes ?? 30),
    });
    setOpen(true);
  };

  const filtered = displayItems.filter(item => {
    const matchStatus = statusFilter === "all" || String(item.status) === statusFilter;
    const matchSearch = !search || String(item.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) || String(item.customer_phone ?? "").includes(search);
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Booked", value: data?.total ?? 1284, icon: "calendar_month", color: "text-primary", bg: "bg-primary/10" },
    { label: "Confirmed", value: displayItems.filter(i => String(i.status) === "confirmed").length || 856, icon: "check_circle", color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Pending", value: displayItems.filter(i => String(i.status) === "scheduled").length || 312, icon: "schedule", color: "text-tertiary", bg: "bg-tertiary/10" },
    { label: "Cancelled", value: displayItems.filter(i => String(i.status) === "cancelled").length || 116, icon: "cancel", color: "text-error", bg: "bg-error/10" },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Appointments Manager</h1>
            <p className="text-xs text-on-surface-variant">{data?.total ?? displayItems.length} total appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary">Live Sync Active</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/20 text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-lg">sync</span>
              Sync Calendar
            </button>
            <button onClick={() => { setEditing(null); reset(); setOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
              New Appointment
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Stats bento */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5 hover:bg-surface-container transition-all">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <span className={`material-symbols-outlined text-xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <p className={`text-3xl font-headline font-bold text-on-surface`}>{s.value.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient..."
                  className="pl-10 pr-4 py-2 text-sm rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary w-48" />
              </div>
              <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <button className="p-1.5 rounded-lg bg-surface text-on-surface">
                  <span className="material-symbols-outlined text-lg">view_list</span>
                </button>
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface transition-all">
                  <span className="material-symbols-outlined text-lg">calendar_view_month</span>
                </button>
              </div>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
              {["all", "confirmed", "scheduled", "cancelled", "completed"].map(s => (
                <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Customer</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Schedule</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">AI Agent</th>
                    <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <td key={j} className="px-6 py-4"><div className="h-4 bg-surface-container-high animate-pulse rounded" /></td>
                          ))}
                        </tr>
                      ))
                    : filtered.map((item, idx) => (
                        <tr key={String(item.id ?? idx)} className="hover:bg-surface-container/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary text-sm font-bold flex-shrink-0">
                                {String(item.customer_name ?? "?")[0]}
                              </div>
                              <div>
                                <p className="font-bold text-on-surface">{String(item.customer_name ?? "—")}</p>
                                <p className="text-xs text-on-surface-variant">{String(item.customer_phone ?? "")}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-on-surface font-bold text-sm">{String(item.title ?? "—")}</p>
                            <p className="text-xs text-on-surface-variant">
                              {item.scheduled_at ? formatDateTime(String(item.scheduled_at)) : "—"}
                              {item.duration_minutes ? ` · ${item.duration_minutes}m` : ""}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-on-surface-variant">{String((item as Record<string, unknown>).agent ?? "Priya AI")}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", STATUS_COLORS[String(item.status)] ?? "bg-surface-container text-on-surface-variant")}>
                              {String(item.status ?? "—").charAt(0).toUpperCase() + String(item.status ?? "").slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button onClick={() => cancelMut.mutate(String(item.id))} disabled={item.status === "cancelled"}
                                className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error disabled:opacity-30 transition-all">
                                <span className="material-symbols-outlined text-lg">cancel</span>
                              </button>
                              <a href={`/transcripts?call=${item.id}`} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-secondary transition-all">
                                <span className="material-symbols-outlined text-lg">transcribe</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-surface-container rounded-2xl border border-outline-variant/20 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-headline font-bold text-on-surface">{editing ? "Edit Appointment" : "Book Appointment"}</h2>
              <button onClick={() => { setOpen(false); setEditing(null); }} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5 block">Customer Name *</label>
                  <input {...register("customer_name")} className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  {errors.customer_name && <p className="text-xs text-error mt-1">{errors.customer_name.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5 block">Phone *</label>
                  <input {...register("customer_phone")} className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  {errors.customer_phone && <p className="text-xs text-error mt-1">{errors.customer_phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5 block">Title / Purpose *</label>
                <input {...register("title")} placeholder="e.g. Dental Checkup" className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5 block">Date & Time *</label>
                  <input {...register("scheduled_at")} type="datetime-local" className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                  {errors.scheduled_at && <p className="text-xs text-error mt-1">{errors.scheduled_at.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1.5 block">Duration (min)</label>
                  <input {...register("duration_minutes")} type="number" min={5} className="w-full px-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              {(createMut.isError || updateMut.isError) && (
                <p className="text-sm text-error">Something went wrong. Please try again.</p>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setOpen(false); setEditing(null); }}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-all text-sm font-bold">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold hover:opacity-90 disabled:opacity-60 transition-all text-sm">
                  {isSubmitting ? "Saving..." : editing ? "Update" : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pro Tip */}
      {showProTip && (
        <div className="fixed bottom-6 right-6 max-w-xs bg-surface-container-high rounded-2xl p-4 border border-outline-variant/20 shadow-2xl z-40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <div>
                <p className="font-bold text-on-surface text-sm">Pro Tip</p>
                <p className="text-xs text-on-surface-variant mt-1">Connect Google Calendar to auto-sync appointments in real-time.</p>
              </div>
            </div>
            <button onClick={() => setShowProTip(false)} className="text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
