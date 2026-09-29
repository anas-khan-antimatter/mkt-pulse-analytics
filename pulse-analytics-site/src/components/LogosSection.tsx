"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "Vercel", gradient: "from-zinc-300 to-zinc-500" },
  { name: "Linear", gradient: "from-blue-400 to-indigo-500" },
  { name: "Raycast", gradient: "from-red-400 to-orange-500" },
  { name: "Notion", gradient: "from-zinc-200 to-zinc-400" },
  { name: "Figma", gradient: "from-green-400 to-emerald-500" },
  { name: "Supabase", gradient: "from-amber-400 to-yellow-500" },
  { name: "Stripe", gradient: "from-indigo-400 to-violet-500" },
  { name: "Loom", gradient: "from-blue-400 to-cyan-500" },
  { name: "Vercel", gradient: "from-zinc-300 to-zinc-500" },
  { name: "Linear", gradient: "from-blue-400 to-indigo-500" },
  { name: "Raycast", gradient: "from-red-400 to-orange-500" },
  { name: "Notion", gradient: "from-zinc-200 to-zinc-400" },
  { name: "Figma", gradient: "from-green-400 to-emerald-500" },
  { name: "Supabase", gradient: "from-amber-400 to-yellow-500" },
  { name: "Stripe", gradient: "from-indigo-400 to-violet-500" },
  { name: "Loom", gradient: "from-blue-400 to-cyan-500" },
];

export default function LogosSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            Trusted by leading B2B revenue teams
          </p>
        </motion.div>
      </div>

      {/* Scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {companies.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-14 px-8 rounded-2xl glass border-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                {/* Logo icon placeholder */}
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${company.gradient} opacity-80`}
                />
                <span className="text-sm font-semibold text-muted-foreground tracking-tight">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          and hundreds more across B2B SaaS, Fintech, and Professional Services
        </p>
      </div>
    </section>
  );
}