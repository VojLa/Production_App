"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import styles from "./page.module.css";

type User = { id: number; email: string; full_name: string | null };

const KPI = [
  { label: "Aktivní zakázky",     value: "24",    delta: "+3 dnes",       up: true  },
  { label: "Sklad – položky",     value: "1 842", delta: "−12 výdejů",    up: false },
  { label: "Nevyřízené nabídky",  value: "7",     delta: "+2 nové",       up: true  },
  { label: "Faktury k uhrazení",  value: "3",     delta: "po splatnosti: 1", up: false },
];

const ACTIVITY = [
  { color: "green", text: "Zakázka ZAK-2024-089 dokončena",          time: "10:24" },
  { color: "amber", text: "Nabídka NAB-047 odeslána zákazníkovi",    time: "09:15" },
  { color: "red",   text: "Sklad: min. stav – ocel 3mm",             time: "08:50" },
  { color: "green", text: "Faktura FAK-891 uhrazena",                 time: "08:32" },
];

const QUICK = [
  { icon: "➕", label: "Nová zakázka"    },
  { icon: "📋", label: "Nová nabídka"   },
  { icon: "📦", label: "Příjem zboží"   },
  { icon: "🧾", label: "Vystavit fakturu" },
  { icon: "🏭", label: "Výrobní plán"   },
  { icon: "🤝", label: "Nová firma"     },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.users.me(token).then(setUser).catch(() => null);
    }
  }, []);

  const firstName = user?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "uživateli";

  return (
    <div>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Dashboard</span>
        <div className={styles.topbarUser}>
          <span>{user?.full_name ?? user?.email ?? ""}</span>
          <div className={styles.avatar}>
            {(user?.full_name ?? user?.email ?? "?")
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.greeting}>
          <h2 className={styles.greetingTitle}>Dobrý den, {firstName} 👋</h2>
          <p className={styles.greetingSub}>Přehled systému za dnešní den</p>
        </div>

        <div className={styles.kpiGrid}>
          {KPI.map((k) => (
            <div key={k.label} className={styles.kpiCard}>
              <p className={styles.kpiLabel}>{k.label}</p>
              <p className={styles.kpiValue}>{k.value}</p>
              <p className={`${styles.kpiDelta} ${k.up ? styles.up : styles.down}`}>
                {k.delta}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.row}>
          <div className={styles.panel}>
            <p className={styles.panelTitle}>Poslední aktivita</p>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.actItem}>
                <span className={`${styles.actDot} ${styles[a.color]}`} />
                <span className={styles.actText}>{a.text}</span>
                <span className={styles.actTime}>{a.time}</span>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <p className={styles.panelTitle}>Rychlý přístup</p>
            <div className={styles.quickGrid}>
              {QUICK.map((q) => (
                <button key={q.label} className={styles.quickBtn}>
                  <span className={styles.quickIcon}>{q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
