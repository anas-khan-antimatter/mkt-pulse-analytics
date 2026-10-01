"use client";

import { motion } from "framer-motion";
import { Atom, X, Globe, Mail, Heart, BarChart3, Grid3x3, Monitor, Variable } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/demo" },
    { label: "Canvas Dashboard", href: "/canvas" },
    { label: "Integrations", href: "/integrations" },
    { label: "API Playground", href: "/test" },
  ],
  Resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#" },
    { label: "AI Insights", href: "/insights" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socialLinks = [
  { icon: Atom, href: "#", label: "GitHub" },
  { icon: X, href: "#", label: "X" },
  { icon: Globe, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <a href="#" className="flex items-center gap-2.5 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-8 4 4 4-6" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Pulse<span className="gradient-text">Analytics</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Revenue intelligence platform that transforms raw pipeline data into
              predictive forecasts and actionable insights for B2B revenue teams.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Icon size={15} className="text-muted-foreground" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <h4 className="text-sm font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Pulse Analytics, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400" /> for revenue ops teams
          </p>
        </div>
      </div>
    </footer>
  );
}