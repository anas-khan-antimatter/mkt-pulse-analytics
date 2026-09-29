"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export default function DemoSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  return (
    <section id="demo" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              See Pulse in action
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Fill in your details and we&apos;ll set up a personalized demo tailored
              to your revenue team&apos;s needs. No sales pitch — just a live walkthrough
              of what Pulse can do for you.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">30-minute live demo</div>
                  <div className="text-xs text-muted-foreground">
                    Tailored to your stack and use case
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Q&A with our team</div>
                  <div className="text-xs text-muted-foreground">
                    Get answers from revenue ops experts
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">No commitment required</div>
                  <div className="text-xs text-muted-foreground">
                    Free trial credits included with every demo
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thanks, {formData.name.split(" ")[0]}!</h3>
                <p className="text-muted-foreground mb-6">
                  We&apos;ll reach out to{" "}
                  <span className="text-primary font-medium">{formData.email}</span> within
                  24 hours to schedule your personalized demo.
                </p>
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Expect a reply soon
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card p-8 md:p-10 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-muted-foreground mb-1.5"
                    >
                      Full name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-muted-foreground mb-1.5"
                    >
                      Work email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm text-muted-foreground mb-1.5"
                    >
                      Company *
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="teamSize"
                      className="block text-sm text-muted-foreground mb-1.5"
                    >
                      Team size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all appearance-none"
                    >
                      <option value="" className="bg-background">
                        Select size
                      </option>
                      <option value="1-5" className="bg-background">
                        1–5
                      </option>
                      <option value="6-20" className="bg-background">
                        6–20
                      </option>
                      <option value="21-50" className="bg-background">
                        21–50
                      </option>
                      <option value="51-200" className="bg-background">
                        51–200
                      </option>
                      <option value="200+" className="bg-background">
                        200+
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-muted-foreground mb-1.5"
                  >
                    Anything you&apos;d like us to focus on?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="E.g., we're particularly interested in forecasting and Salesforce integration..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Request my demo
                  <Send size={16} />
                </button>

                <p className="text-xs text-center text-muted-foreground/60">
                  No spam. Your data is handled per our{" "}
                  <a href="#" className="underline hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}