"use client";
import { motion } from "framer-motion";

export default function SplitText({ text }: { text: string }) {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
  };
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <motion.span variants={container} initial="hidden" animate="visible" aria-label={text} role="heading">
      {letters.map((char, i) => (
        <motion.span key={i} variants={child} className="inline-block">
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
