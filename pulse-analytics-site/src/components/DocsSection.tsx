"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  Play,
  Search,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const docsCards = [
  {
    icon: Play,
    label: "Quickstart Guide",
    description: "Get up and running with Pulse Analytics in under 10 minutes.",
    gradient: "from-blue-500 to-cyan-500",
    time: "5 min read",
  },
  {
    icon: Code,
    label: "API Reference",
    description: "Full API docs for ingesting events, querying data, and configuring alerts.",
    gradient: "from-violet-500 to-purple-500",
    time: "15 min read",
  },
  {
    icon: Search,
    label: "Pipeline Analytics",
    description: "Track deal stages, conversion rates, and pipeline health metrics.",
    gradient: "from-emerald-500 to-teal-500",
    time: "10 min read",
  },
  {
    icon: FileText,
    label: "Custom Reports",
    description: "Build, schedule, and export executive-ready revenue reports.",
    gradient: "from-rose-500 to-pink-500",
    time: "8 min read",
  },
];

export default function DocsSection() {
  return (
    <section id="docs" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <BookOpen size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">Documentation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Build with confidence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive docs, API references, and integration guides to help your
            team get the most out of Pulse Analytics.
          </p>
        </motion.div>

        {/* Docs cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-12">
          {docsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.label}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group glass glass-card-hover rounded-2xl p-6 flex flex-col"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} opacity-20 flex items-center justify-center mb-4 group-hover:opacity-30 transition-opacity`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {card.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {card.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">
                    {card.time}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 glass glass-card-hover rounded-full px-6 py-3 text-sm font-medium"
          >
            Browse full documentation
            <ChevronRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}