"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, saveToken } from "@/lib/auth";
import s from "@/styles/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(searchParams.get("verified") === "1" ? "E-mail byl ověřen. Nyní se můžete přihlásit." : "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    api.users.me(token).then(() => router.replace("/dashboard")).catch(() => null);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { access_token } = await api.auth.login(email, password);
      saveToken(access_token);
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Přihlášení se nezdařilo");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!email) {
      setError("Nejprve zadejte e-mail, na který chcete poslat ověřovací zprávu.");
      return;
    }
    setError("");
    setMessage("");
    setResending(true);
    try {
      const res = await api.auth.resendVerification(email);
      setMessage(res.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Odeslání se nezdařilo");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className={s.wrapper}>
      <nav className={s.nav}>
        <Link href="/" className={s.logo}>Manu<span>Flow</span></Link>
        <Link href="/" className={s.backLink}>← Zpět</Link>
      </nav>
      <div className={s.body}>
        <div className={s.card}>
          <h1 className={s.heading}>Přihlásit se</h1>
          <p className={s.sub}>Zadejte přihlašovací údaje pro vstup do systému</p>
          {message && <div className={s.success}>{message}</div>}
          {error && <div className={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Email</label>
              <input className={s.input} type="email" placeholder="vas@email.cz" value={email} onChange={(e)=>setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Heslo</label>
              <input className={s.input} type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <button className={s.submit} type="submit" disabled={loading}>{loading ? "Přihlašování…" : "Přihlásit se"}</button>
          </form>
          <button className={s.secondary} type="button" onClick={handleResendVerification} disabled={resending}>{resending ? "Odesílání…" : "Poslat ověřovací e-mail znovu"}</button>
          <p className={s.footer}>Nemáte účet? <Link href="/register">Registrovat se</Link></p>
        </div>
      </div>
    </div>
  );
}
