"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  ExternalLink,
  Plug,
  Zap,
  Shield,
  Layers,
  Database,
  Mail,
  Calendar,
  MessageCircle,
  CreditCard,
  BarChart3,
  Globe,
  Lock,
  Cloud,
  Smartphone,
} from "lucide-react";

// ── Integration data ─────────────────────────────────────────────────

interface Integration {
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  popular: boolean;
  connected?: boolean;
}

const allIntegrations: Integration[] = [
  {
    name: "Salesforce",
    description: "Sync pipeline, deals, and account data",
    category: "CRM",
    icon: Cloud,
    color: "from-blue-500 to-indigo-600",
    popular: true,
    connected: true,
  },
  {
    name: "HubSpot",
    description: "Import contacts, deals, and revenue data",
    category: "CRM",
    icon: Globe,
    color: "from-orange-400 to-red-500",
    popular: true,
    connected: true,
  },
  {
    name: "Stripe",
    description: "Real-time billing and subscription data",
    category: "Payments",
    icon: CreditCard,
    color: "from-indigo-500 to-violet-600",
    popular: true,
    connected: true,
  },
  {
    name: "Slack",
    description: "Alerts and deal notifications",
    category: "Communication",
    icon: MessageCircle,
    color: "from-emerald-400 to-green-500",
    popular: true,
    connected: true,
  },
  {
    name: "Notion",
    description: "Sync docs, meeting notes, and wikis",
    category: "Productivity",
    icon: Layers,
    color: "from-zinc-300 to-zinc-500",
    popular: false,
  },
  {
    name: "Google Sheets",
    description: "Import/export data with live sync",
    category: "Productivity",
    icon: Database,
    color: "from-green-400 to-emerald-500",
    popular: true,
    connected: true,
  },
  {
    name: "Gmail",
    description: "Track email engagement for deals",
    category: "Communication",
    icon: Mail,
    color: "from-blue-400 to-cyan-500",
    popular: false,
  },
  {
    name: "Google Calendar",
    description: "Auto-log meetings and events",
    category: "Productivity",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    name: "Sentry",
    description: "Monitor platform errors and uptime",
    category: "Engineering",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    popular: false,
  },
  {
    name: "DataDog",
    description: "Infrastructure and APM monitoring",
    category: "Engineering",
    icon: BarChart3,
    color: "from-purple-400 to-indigo-500",
    popular: false,
  },
  {
    name: "PostgreSQL",
    description: "Direct warehouse queries and syncs",
    category: "Data",
    icon: Database,
    color: "from-blue-600 to-indigo-700",
    popular: false,
    connected: true,
  },
  {
    name: "Snowflake",
    description: "Cloud data warehouse integration",
    category: "Data",
    icon: Cloud,
    color: "from-blue-400 to-cyan-500",
    popular: false,
  },
  {
    name: "Zapier",
    description: "5,000+ app connections via Zapier",
    category: "Automation",
    icon: Zap,
    color: "from-orange-400 to-amber-500",
    popular: true,
  },
  {
    name: "Clari",
    description: "Forecast data import and alignment",
    category: "Forecasting",
    icon: BarChart3,
    color: "from-indigo-400 to-purple-500",
    popular: false,
  },
  {
    name: "Gong",
    description: "Import call recordings and transcripts",
    category: "Communication",
    icon: MessageCircle,
    color: "from-green-500 to-teal-500",
    popular: false,
  },
  {
    name: "Zoom",
    description: "Auto-join meetings and log activity",
    category: "Communication",
    icon: Smartphone,
    color: "from-blue-500 to-indigo-500",
    popular: false,
  },
  {
    name: "Mixpanel",
    description: "Product analytics event integration",
    category: "Analytics",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    popular: false,
  },
  {
    name: "Amplitude",
    description: "User behavior and funnel data",
    category: "Analytics",
    icon: Activity,
    color: "from-blue-400 to-indigo-500",
    popular: false,
  },
];

const categories = ["All", "CRM", "Data", "Communication", "Productivity", "Payments", "Engineering", "Analytics", "Automation", "Forecasting"];

// ── Page component ───────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showConnected, setShowConnected] = useState(false);

  const filtered = useMemo(() => {
    let list = allIntegrations;
    if (activeCategory !== "All") {
      list = list.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (showConnected) {
      list = list.filter((i) => i.connected);
    }
    return list;
  }, [activeCategory, search, showConnected]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Plug size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              Ecosystem
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Connect your revenue stack
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pulse Analytics integrates with the tools you already use. Sync CRM,
            billing, communication, and data warehouse platforms in minutes.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Connected toggle */}
            <button
              onClick={() => setShowConnected(!showConnected)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                showConnected
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle size={12} />
              Connected
            </button>

            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search integrations..."
                className="w-full sm:w-52 h-9 pl-9 pr-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-20"
              >
                <Plug size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  No integrations match your filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                    setShowConnected(false);
                  }}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              filtered.map((integration, i) => {
                const Icon = integration.icon;
                return (
                  <motion.div
                    key={integration.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={`group glass glass-card-hover rounded-2xl p-5 relative ${
                      integration.connected
                        ? "ring-1 ring-green-500/20"
                        : ""
                    }`}
                  >
                    {integration.popular && !integration.connected && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-medium text-primary">
                        Popular
                      </div>
                    )}
                    {integration.connected && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[9px] font-medium text-green-400 flex items-center gap-1">
                        <CheckCircle size={8} />
                        Connected
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${integration.color} opacity-80 flex items-center justify-center shrink-0`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">
                          {integration.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                          {integration.category}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {integration.description}
                    </p>
                    <button
                      className={`w-full h-8 rounded-xl text-xs font-medium transition-all ${
                        integration.connected
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "glass-primary hover:bg-primary/15"
                      }`}
                    >
                      {integration.connected ? "Active · Manage" : "Connect"}
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Webhook Simulator ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-primary" />
              <h3 className="text-base font-semibold">Webhook Test Simulator</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Send a sample webhook event to <code className="text-primary/80">/api/webhooks/test</code> and inspect the response.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <select
                id="webhook-event-select"
                className="h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 text-xs text-foreground flex-1"
              >
                <option value="deal.won">deal.won</option>
                <option value="deal.lost">deal.lost</option>
                <option value="pipeline.stage_changed">pipeline.stage_changed</option>
                <option value="forecast.updated">forecast.updated</option>
                <option value="integration.connected" selected>integration.connected</option>
              </select>
              <button
                id="webhook-send-btn"
                onClick={async () => {
                  const select = document.getElementById("webhook-event-select") as HTMLSelectElement;
                  const log = document.getElementById("webhook-log");
                  const btn = document.getElementById("webhook-send-btn") as HTMLButtonElement;
                  if (!select || !log) return;
                  btn.disabled = true;
                  btn.innerHTML = '<span class="animate-spin">⏳</span> Sending...';
                  try {
                    const res = await fetch("/api/webhooks/test", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        event: select.value,
                        timestamp: new Date().toISOString(),
                        payload: {
                          dealId: `deal_${Math.random().toString(36).slice(2, 8)}`,
                          amount: Math.round(5000 + Math.random() * 95000),
                          pipeline: "Enterprise Q3",
                          stage: "Negotiation",
                          rep: "alice@example.com",
                        },
                      }),
                    });
                    const data = await res.json();
                    log.textContent = JSON.stringify(data, null, 2);
                  } catch {
                    log.textContent = JSON.stringify({ error: "Network error — is the API running?" }, null, 2);
                  } finally {
                    btn.disabled = false;
                    btn.innerHTML = "Send Event";
                  }
                }}
                className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
              >
                Send Event
              </button>
            </div>
            <pre
              id="webhook-log"
              className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] text-cyan-400 font-mono leading-relaxed overflow-x-auto"
            >
{`Click "Send Event" to post a sample webhook.\nThe response will appear here.`}</pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Activity({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}