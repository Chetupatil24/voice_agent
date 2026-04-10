"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { getCalls, getTranscript } from "@/lib/api";
import { getTenantId, formatDateTime, formatDuration, cn } from "@/lib/utils";

type Turn = { role: string; content: string; timestamp?: string };
type ConversationDetail = {
  id: string;
  caller_phone: string;
  status: string;
  created_at: string;
  duration_seconds?: number;
  transcript?: Turn[];
  sentiment_score?: number;
  language?: string;
  detected_intent?: string;
};

const mockTranscript: Turn[] = [
  { role: "assistant", content: "Hello! Thank you for calling Vaani Dental Clinic. This is Priya, your AI assistant. How can I help you today?", timestamp: "0:00" },
  { role: "user", content: "Hi, I need to book an appointment for a root canal procedure.", timestamp: "0:04" },
  { role: "assistant", content: "Of course! I can help you schedule that. Could I have your name and preferred date for the appointment?", timestamp: "0:09" },
  { role: "user", content: "My name is Ravi Kumar. I would like Tuesday or Wednesday afternoon if possible.", timestamp: "0:16" },
  { role: "assistant", content: "Perfect, Ravi! I have availability on Wednesday, January 15th at 3:00 PM and 4:30 PM. Which would you prefer?", timestamp: "0:24" },
  { role: "user", content: "3 PM works great for me.", timestamp: "0:31" },
  { role: "assistant", content: "Excellent! I've booked you for Wednesday, January 15th at 3:00 PM with Dr. Suresh. You'll receive a confirmation SMS shortly. Is there anything else I can help you with?", timestamp: "0:35" },
];

export default function TranscriptsPage() {
  const tenantId = getTenantId();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(32);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callId = params.get("call");
    if (callId) setSelectedId(callId);
  }, []);

  const { data, isLoading: loadingList } = useQuery({
    queryKey: ["calls-transcripts", tenantId],
    queryFn: () => getCalls(tenantId, { limit: 100 }),
    enabled: !!tenantId,
  });

  const { data: detail, isLoading: loadingDetail } = useQuery<ConversationDetail>({
    queryKey: ["transcript-detail", tenantId, selectedId],
    queryFn: () => getTranscript(tenantId, selectedId!),
    enabled: !!selectedId && !!tenantId,
  });

  const calls: ConversationDetail[] = data?.items ?? [];
  const filtered = calls.filter(c =>
    !search || c.caller_phone.toLowerCase().includes(search.toLowerCase()) || c.status?.toLowerCase().includes(search.toLowerCase())
  );

  const activeDetail = detail ?? (selectedId === "demo" ? {
    id: "demo", caller_phone: "+91 98765 43210", status: "completed",
    created_at: new Date().toISOString(), duration_seconds: 252,
    transcript: mockTranscript, sentiment_score: 0.82,
    language: "English", detected_intent: "Appointment Booking",
  } as ConversationDetail : null);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 z-10">
          <div>
            <h1 className="text-xl font-headline font-bold text-on-surface">Transcript Viewer</h1>
            <p className="text-xs text-on-surface-variant">Call recordings & AI insights</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/20 text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-lg">download</span> Export
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar list */}
          <div className="w-72 flex-shrink-0 border-r border-outline-variant/10 flex flex-col bg-surface-container-lowest">
            <div className="p-3 border-b border-outline-variant/10">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calls..."
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Demo item */}
              <button onClick={() => setSelectedId("demo")}
                className={cn("w-full text-left px-4 py-3 border-b border-outline-variant/5 hover:bg-surface-container/50 transition-all flex items-center gap-3",
                  selectedId === "demo" && "bg-primary/5 border-r-2 border-primary")}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">+91 98765 43210</p>
                  <p className="text-xs text-on-surface-variant">Today, 2:30 PM</p>
                </div>
                <span className="text-[10px] text-primary font-bold">Demo</span>
              </button>
              {loadingList
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 border-b border-outline-variant/5 animate-pulse">
                      <div className="h-4 bg-surface-container rounded mb-2 w-32" />
                      <div className="h-3 bg-surface-container rounded w-20" />
                    </div>
                  ))
                : filtered.map(call => (
                    <button key={call.id} onClick={() => setSelectedId(call.id)}
                      className={cn("w-full text-left px-4 py-3 border-b border-outline-variant/5 hover:bg-surface-container/50 transition-all flex items-center gap-3",
                        selectedId === call.id && "bg-primary/5 border-r-2 border-primary")}>
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        call.status === "completed" ? "bg-primary/10" : "bg-error/10")}>
                        <span className={cn("material-symbols-outlined text-lg", call.status === "completed" ? "text-primary" : "text-error")} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {call.status === "completed" ? "call_received" : "call_missed"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{call.caller_phone}</p>
                        <p className="text-xs text-on-surface-variant">{formatDateTime(call.created_at)}</p>
                      </div>
                    </button>
                  ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!selectedId ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">transcribe</span>
                <p className="text-on-surface-variant">Select a call to view its transcript</p>
              </div>
            ) : loadingDetail ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Trans header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-outline-variant/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-headline font-bold text-on-surface">{activeDetail?.caller_phone}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {activeDetail?.duration_seconds && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant border border-outline-variant/10">
                            <span className="material-symbols-outlined text-sm">timer</span>
                            {formatDuration(activeDetail.duration_seconds)}
                          </span>
                        )}
                        {activeDetail?.created_at && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant border border-outline-variant/10">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {formatDateTime(activeDetail.created_at)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Resolved
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-lg">share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Insight cards */}
                <div className="flex-shrink-0 px-6 py-4 grid grid-cols-2 gap-4">
                  {/* AI Summary */}
                  <div className="col-span-1 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl p-4 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-3 right-3 opacity-10">
                      <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">AI Summary</p>
                    <p className="text-sm text-on-surface font-bold mb-1">{activeDetail?.detected_intent ?? "Appointment Booking"}</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Customer successfully booked a dental appointment. Sentiment score: {activeDetail?.sentiment_score ? `${Math.round(activeDetail.sentiment_score * 100)}%` : "82%"} positive.
                    </p>
                  </div>
                  {/* Status checklist */}
                  <div className="col-span-1 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/5">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Call Outcomes</p>
                    <div className="space-y-2">
                      {[
                        { label: "Appointment Confirmed", done: true },
                        { label: "SMS Confirmation Sent", done: true },
                        { label: "Billing Generated", done: false },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className={cn("material-symbols-outlined text-lg", item.done ? "text-primary" : "text-on-surface-variant/30")} style={{ fontVariationSettings: `'FILL' ${item.done ? 1 : 0}` }}>
                            {item.done ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span className={cn("text-xs", item.done ? "text-on-surface font-bold" : "text-on-surface-variant/50")}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conversation */}
                <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
                  {(activeDetail?.transcript ?? mockTranscript).map((turn, i) => (
                    <div key={i} className={cn("flex gap-3", turn.role !== "assistant" && "flex-row-reverse")}>
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                        turn.role === "assistant" ? "bg-primary/10" : "bg-surface-container-high")}>
                        <span className={cn("material-symbols-outlined text-lg", turn.role === "assistant" ? "text-primary" : "text-on-surface-variant")} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {turn.role === "assistant" ? "robot_2" : "person"}
                        </span>
                      </div>
                      <div className={cn("max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        turn.role === "assistant" ? "bg-primary/10 text-on-surface rounded-tl-sm" : "bg-surface-container text-on-surface rounded-tr-sm")}>
                        {turn.content}
                        {turn.timestamp && <p className="text-[10px] text-on-surface-variant/50 mt-1.5">{turn.timestamp}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audio player footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-outline-variant/10 bg-surface-container-lowest">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
                        <span className="material-symbols-outlined text-lg">replay_10</span>
                      </button>
                      <button onClick={() => setIsPlaying(p => !p)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-on-primary hover:opacity-90 transition-all">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isPlaying ? "pause" : "play_arrow"}</span>
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
                        <span className="material-symbols-outlined text-lg">forward_10</span>
                      </button>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant font-mono w-10 text-right">1:42</span>
                      <div className="flex-1 h-1.5 bg-surface-container-high rounded-full relative cursor-pointer" onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                      }}>
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                        <div className="w-3 h-3 rounded-full bg-primary absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md" style={{ left: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-on-surface-variant font-mono w-10">
                        {activeDetail?.duration_seconds ? formatDuration(activeDetail.duration_seconds) : "4:12"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg text-on-surface-variant">volume_up</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
