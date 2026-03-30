"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
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
      .then(() => setAllowed(true))
      .catch(() => {
        removeToken();
        router.replace("/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return <div className={styles.main}>Načítání…</div>;
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
