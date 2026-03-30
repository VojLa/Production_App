"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import styles from "./Sidebar.module.css";

const NAV = [
  { label: "Dashboard", href: "/dashboard",      icon: "📊", section: "Hlavní" },
  { label: "Výroba",    href: "/dashboard/vyroba", icon: "🏭" },
  { label: "Sklad",     href: "/dashboard/sklad",  icon: "📦" },
  { label: "Firmy",     href: "/dashboard/firmy",  icon: "🤝", section: "Obchod" },
  { label: "Doklady",   href: "/dashboard/doklady", icon: "📄" },
  { label: "Profil",    href: "/profile",           icon: "👤", section: "Systém" },
  { label: "Nastavení", href: "/dashboard/nastaveni", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push("/");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>ManuFlow</div>

      {NAV.map((item) => (
        <div key={item.href}>
          {item.section && (
            <p className={styles.section}>{item.section}</p>
          )}
          <Link
            href={item.href}
            className={`${styles.item} ${pathname === item.href ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        </div>
      ))}

      <div className={styles.spacer} />
      <button className={styles.logout} onClick={handleLogout}>
        Odhlásit se
      </button>
    </aside>
  );
}
