import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <span className={styles.logo}>
          Manu<span>Flow</span>
        </span>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navGhost}>Přihlásit se</Link>
          <Link href="/register" className={styles.navPrimary}>Registrovat</Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.badge}>MVP · v0.1</div>
        <h1 className={styles.heading}>
          Výroba pod<br /><em>plnou kontrolou</em>
        </h1>
        <p className={styles.sub}>
          ManuFlow je ERP systém pro výrobní firmy. Zakázky, sklad,
          fakturace a kooperace – vše na jednom místě.
        </p>
        <div className={styles.actions}>
          <Link href="/register" className={styles.btnPrimary}>Začít zdarma</Link>
          <Link href="/login" className={styles.btnOutline}>Přihlásit se</Link>
        </div>
      </main>

      <section className={styles.modules}>
        {MODULES.map((m) => (
          <div key={m.title} className={styles.moduleCard}>
            <span className={styles.moduleIcon}>{m.icon}</span>
            <p className={styles.moduleTitle}>{m.title}</p>
            <p className={styles.moduleDesc}>{m.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const MODULES = [
  { icon: "📊", title: "Dashboard",  desc: "Přehled výkonu a aktivit" },
  { icon: "🏭", title: "Výroba",     desc: "Zakázky a výrobní plán" },
  { icon: "📦", title: "Sklad",      desc: "Zásoby a pohyby materiálu" },
  { icon: "🤝", title: "Firmy",      desc: "Zákazníci a dodavatelé" },
  { icon: "📄", title: "Doklady",    desc: "Faktury a nabídky" },
  { icon: "⚙️", title: "Nastavení", desc: "Konfigurace systému" },
];
