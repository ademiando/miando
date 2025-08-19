"use client";
import Globe from "@/components/Globe";
import SplitText from "@/components/SplitText";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <Globe />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      <section className="relative z-10 min-h-[100svh] flex items-center justify-center text-center px-6">
        <div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial="hidden" animate="visible"
          >
            <SplitText text="Ade Miando" />
          </motion.h1>
          <motion.p
            className="mt-6 text-xl md:text-2xl text-zinc-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Creative Developer — Interactive 3D & Motion on the Web.
          </motion.p>
          <motion.div
            className="mt-10 flex gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/work" className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90">View Work</Link>
            <Link href="/about" className="px-6 py-3 rounded-xl border border-white/60 hover:bg-white hover:text-black">About</Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
