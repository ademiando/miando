"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  { title: "Project One", desc: "Cinematic landing with 3D transitions.", img: "/images/projects/placeholder1.svg" },
  { title: "Project Two", desc: "Design system & micro-interactions.", img: "/images/projects/placeholder2.svg" },
  { title: "Project Three", desc: "Realtime 3D visualization.", img: "/images/projects/placeholder3.svg" },
];

export default function Work() {
  return (
    <div className="min-h-[100svh] px-6 md:px-10 py-20">
      <motion.h2 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="text-4xl md:text-5xl font-bold mb-10">Selected Work</motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {projects.map((p, i) => (
          <motion.article key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
            <div className="relative aspect-[16/10]">
              <Image src={p.img} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-zinc-400 mt-2">{p.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
