"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const Nav = (href: string, label: string) => (
    <Link href={href} className={`px-3 py-2 rounded-xl hover:bg-white/10 ${pathname===href?'text-accent':'text-white'}`}>{label}</Link>
  );
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">ADEMIANDO</Link>
        <nav className="flex items-center gap-2">
          {Nav('/work','Work')}
          {Nav('/about','About')}
          {Nav('/contact','Contact')}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
