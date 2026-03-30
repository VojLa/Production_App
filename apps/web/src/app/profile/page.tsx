"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import styles from "./page.module.css";

type User = {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
  is_email_verified?: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      setChecking(false);
      return;
    }

    api.users
      .me(token)
      .then(setUser)
      .catch(() => {
        removeToken();
        router.replace("/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return <div className={styles.loading}>Načítání…</div>;
  }

  if (!user) {
    return null;
  }

  const initials = (user.full_name ?? user.email ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const joined = new Date(user.created_at).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>Profil</span>
        </div>
        <div className={styles.content}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLg}>{initials}</div>
            <div>
              <p className={styles.name}>{user.full_name ?? "—"}</p>
              <p className={styles.email}>{user.email}</p>
              <p className={styles.meta}>Člen od {joined}</p>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID uživatele</span>
              <span className={styles.infoValue}>#{user.id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Celé jméno</span>
              <span className={styles.infoValue}>{user.full_name ?? "—"}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Stav e-mailu</span>
              <span className={styles.badge}>{user.is_email_verified ? "Ověřený" : "Neověřený"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
