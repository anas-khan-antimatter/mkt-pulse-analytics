"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  GitBranch,
  Bell,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    id: "pipeline",
    icon: BarChart3,
    label: "Pipeline Analytics",
    title: "Real-time pipeline visibility across every deal",
    description:
      "See your entire pipeline in one unified view. Filter by stage, owner, region, or deal size. Track conversion rates and identify bottlenecks before they impact revenue.",
    metrics: [
      { label: "Deal stages tracked", value: "Unlimited" },
      { label: "Avg. data refresh", value: "< 30s" },
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "forecast",
    icon: TrendingUp,
    label: "AI Forecasting",
    title: "Predict revenue outcomes with ML accuracy",
    description:
      "Our proprietary models analyze historical patterns, deal velocity, and market signals to deliver 94%+ accurate forecasts. Slice by team, product line, or region.",
    metrics: [
      { label: "Forecast accuracy", value: "94%" },
      { label: "Prediction horizon", value: "12 months" },
    ],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "workflows",
    icon: GitBranch,
    label: "Smart Workflows",
    title: "Automate revenue ops without code",
    description:
      "Build custom workflows that trigger actions based on deal stage changes, risk scores, or forecast updates. Connect with Slack, Salesforce, HubSpot, and more.",
    metrics: [
      { label: "Integrations", value: "25+" },
      { label: "Workflow triggers", value: "50+" },
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "alerts",
    icon: Bell,
    label: "Deal Alerts",
    title: "Real-time notifications for revenue-impacting events",
    description:
      "Get instant alerts when deals stall, risk scores change, or forecasts deviate. Configure custom thresholds so your team acts on what matters most.",
    metrics: [
      { label: "Alert types", value: "15+" },
      { label: "Avg. response time", value: "< 5s" },
    ],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "reports",
    icon: Zap,
    label: "Custom Reports",
    title: "Drag-and-drop report builder for revenue teams",
    description:
      "Create executive-ready reports in minutes. Combine pipeline data, forecasts, and team performance into stunning visualizations. Export or schedule automated delivery.",
    metrics: [
      { label: "Report templates", value: "40+" },
      { label: "Export formats", value: "8" },
    ],
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "collab",
    icon: Users,
    label: "Team Collaboration",
    title: "Align your revenue org around shared data",
    description:
      "Shared dashboards, comment threads on deals, and role-based access ensure everyone — from SDRs to CROs — operates from the same source of truth.",
    metrics: [
      { label: "Team size supported", value: "Any" },
      { label: "Permission tiers", value: "5" },
    ],
    gradient: "from-indigo-500 to-blue-500",
  },
];

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section
      id="features"
      className="section-padding relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything your revenue ops team needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From pipeline analytics to AI-powered forecasting — Pulse gives you
            the full toolkit to drive predictable revenue growth.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature) => {
            const isActive = activeFeature.id === feature.id;
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {feature.label}
              </button>
            );
          })}
        </div>

        {/* Feature content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="glass-card p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Text */}
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${activeFeature.gradient} text-white mb-6`}
                >
                  <activeFeature.icon size={14} />
                  {activeFeature.label}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {activeFeature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {activeFeature.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {activeFeature.metrics.map((metric) => (
                    <div key={metric.label} className="glass rounded-xl p-4">
                      <div className="text-lg font-bold gradient-text">
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#demo"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See it in action <ChevronRight size={16} />
                </a>
              </div>

              {/* Right: Preview card */}
              <div className="relative">
                <div
                  className={`aspect-video rounded-2xl bg-gradient-to-br ${activeFeature.gradient} opacity-10`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <activeFeature.icon
                      size={64}
                      className="text-primary/40 mx-auto mb-4"
                    />
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${activeFeature.gradient} text-white text-sm font-medium shadow-lg`}
                    >
                      <activeFeature.icon size={16} />
                      {activeFeature.label}
                    </div>
                  </div>
                </div>

                {/* Decorative */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/10 blur-xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-violet-500/10 blur-xl"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}