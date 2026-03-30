const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json", ...options?.headers }, ...options });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Chyba serveru" }));
    throw new Error(error.detail ?? "Neznámá chyba");
  }
  return res.json();
}
export const api = {
  auth: {
    login: (email: string, password: string) => request<{ access_token: string }>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string, full_name?: string) => request<{ message: string }>("/api/v1/auth/register", { method: "POST", body: JSON.stringify({ email, password, full_name }) }),
    verifyEmail: (token: string) => request<{ message: string }>(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`),
    resendVerification: (email: string) => request<{ message: string }>("/api/v1/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
  },
  users: {
    me: (token: string) => request<{id:number;email:string;full_name:string|null;is_active:boolean;is_email_verified:boolean;email_verified_at:string|null;created_at:string;}>("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } }),
  },
};
