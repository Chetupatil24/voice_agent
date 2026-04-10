type EventHandler = (data: unknown) => void;

const WS_URL = (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000").replace(
  /^http/,
  "ws"
);

export class DashboardSocket {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, EventHandler[]>();
  private reconnectDelay = 2000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closed = false;

  constructor(private tenantId: string) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
    this.ws = new WebSocket(
      `${WS_URL}/api/v1/dashboard/live/${this.tenantId}?token=${token}`
    );

    this.ws.onopen = () => {
      this.reconnectDelay = 2000;
      this.emit("connect", null);
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        this.emit(msg.event ?? "message", msg);
      } catch {
        // non-JSON frame — ignore
      }
    };

    this.ws.onerror = () => this.emit("error", null);

    this.ws.onclose = () => {
      this.emit("disconnect", null);
      if (!this.closed) {
        this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay);
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
      }
    };
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    const list = this.handlers.get(event) ?? [];
    this.handlers.set(event, list.filter((h) => h !== handler));
  }

  send(data: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  private emit(event: string, data: unknown) {
    (this.handlers.get(event) ?? []).forEach((h) => h(data));
  }
}
