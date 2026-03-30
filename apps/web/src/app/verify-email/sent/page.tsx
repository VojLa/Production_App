"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import s from "@/styles/auth.module.css";

export default function VerifyEmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? 'váš e-mail';
  return (<div className={s.wrapper}><nav className={s.nav}><Link href="/" className={s.logo}>Manu<span>Flow</span></Link></nav><div className={s.body}><div className={s.card}><h1 className={s.heading}>Potvrďte svůj e-mail</h1><p className={s.sub}>Na adresu <strong>{email}</strong> jsme poslali ověřovací odkaz. V lokálním vývoji ho najdete v Mailpit na portu 8025.</p><div className={s.infoBox}><p><strong>Mailpit:</strong> <a href="http://localhost:8025" target="_blank">http://localhost:8025</a></p></div><p className={s.footer}>Už máte účet? <Link href={`/login?email=${encodeURIComponent(email)}`}>Přejít na přihlášení</Link></p></div></div></div>);
}
