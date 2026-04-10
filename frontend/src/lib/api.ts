import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("tenant_id");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  return data as { access_token: string; token_type: string };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(tenantId: string, days = 30) {
  const { data } = await api.get(`/api/v1/dashboard/stats`, {
    params: { tenant_id: tenantId, days },
  });
  return data;
}

// ─── Calls ────────────────────────────────────────────────────────────────────

export async function getCalls(
  tenantId: string,
  params?: { skip?: number; limit?: number; status?: string }
) {
  const { data } = await api.get(`/api/v1/conversations/${tenantId}`, { params });
  return data;
}

export async function getTranscript(tenantId: string, conversationId: string) {
  const { data } = await api.get(
    `/api/v1/conversations/${tenantId}/${conversationId}`
  );
  return data;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export interface AppointmentCreate {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  title: string;
  notes?: string;
  scheduled_at: string; // ISO datetime
  duration_minutes?: number;
  call_id?: string;
}

export interface AppointmentUpdate {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  title?: string;
  notes?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  status?: string;
}

export async function getAppointments(
  tenantId: string,
  params?: {
    skip?: number;
    limit?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
  }
) {
  const { data } = await api.get(`/api/v1/appointments/${tenantId}`, { params });
  return data;
}

export async function createAppointment(
  tenantId: string,
  payload: AppointmentCreate
) {
  const { data } = await api.post(`/api/v1/appointments/${tenantId}`, payload);
  return data;
}

export async function updateAppointment(
  tenantId: string,
  apptId: string,
  payload: AppointmentUpdate
) {
  const { data } = await api.patch(
    `/api/v1/appointments/${tenantId}/${apptId}`,
    payload
  );
  return data;
}

export async function cancelAppointment(tenantId: string, apptId: string) {
  await api.delete(`/api/v1/appointments/${tenantId}/${apptId}`);
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function uploadDocument(tenantId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post(`/api/v1/documents/${tenantId}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getDocuments(tenantId: string) {
  const { data } = await api.get(`/api/v1/documents/${tenantId}`);
  return data;
}
