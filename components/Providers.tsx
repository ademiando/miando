"use client";
import type { ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => { (lenis as any)?.destroy?.(); };
  }, []);
  return <>{children}</>;
}
