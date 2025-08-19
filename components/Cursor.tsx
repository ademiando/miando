"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    const raf = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed left-0 top-0 z-50 size-2 rounded-full bg-white pointer-events-none mix-blend-difference" />
      <div ref={ringRef} className="fixed left-0 top-0 z-50 size-8 rounded-full border border-white/70 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
    </>
  );
}
