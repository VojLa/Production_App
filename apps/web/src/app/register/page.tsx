"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { removeToken } from "@/lib/auth";
import s from "@/styles/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    removeToken();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků");
      return;
    }
    setLoading(true);
    try {
      removeToken();
      await api.auth.register(email, password, fullName || undefined);
      router.replace(`/verify-email/sent?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registrace se nezdařila");
    } finally {
      setLoading(false);
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
          <h1 className={s.heading}>Registrace</h1>
          <p className={s.sub}>Vytvořte si účet a potvrďte e-mailovou adresu</p>
          {error && <div className={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Celé jméno</label>
              <input className={s.input} type="text" placeholder="Jan Novák" value={fullName} onChange={(e)=>setFullName(e.target.value)} autoComplete="name" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Email</label>
              <input className={s.input} type="email" placeholder="vas@email.cz" value={email} onChange={(e)=>setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Heslo</label>
              <input className={s.input} type="password" placeholder="min. 8 znaků" value={password} onChange={(e)=>setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <button className={s.submit} type="submit" disabled={loading}>{loading ? "Vytváření účtu…" : "Vytvořit účet"}</button>
          </form>
          <p className={s.footer}>Máte už účet? <Link href="/login">Přihlásit se</Link></p>
        </div>
      </div>
    </div>
  );
}
