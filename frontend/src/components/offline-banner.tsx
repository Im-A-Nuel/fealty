"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-16 z-[55] flex items-center justify-center gap-2 border-b border-gold/30 bg-gold/10 px-4 py-2 text-center text-sm text-goldbright backdrop-blur-sm"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      No connection. Registration and verification fall back to local demo mode.
    </div>
  );
}