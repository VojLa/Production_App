"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import s from "@/styles/auth.module.css";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    async function run() {
      if (!token) { setError('Chybí ověřovací token.'); setLoading(false); return; }
      try { const res = await api.auth.verifyEmail(token); setMessage(res.message); setTimeout(()=>router.replace('/login?verified=1'), 1800); }
      catch (err: unknown) { setError(err instanceof Error ? err.message : 'Ověření e-mailu selhalo.'); }
      finally { setLoading(false); }
    }
    run();
  }, [router, token]);
  return (<div className={s.wrapper}><nav className={s.nav}><Link href="/" className={s.logo}>Manu<span>Flow</span></Link></nav><div className={s.body}><div className={s.card}><h1 className={s.heading}>Ověření e-mailu</h1>{loading && <p className={s.sub}>Probíhá kontrola ověřovacího odkazu…</p>}{!loading && message && <div className={s.success}>{message}</div>}{!loading && error && <div className={s.error}>{error}</div>}<p className={s.footer}><Link href="/login">Přejít na přihlášení</Link></p></div></div></div>);
}
