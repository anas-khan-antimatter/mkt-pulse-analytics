"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Get started with core revenue analytics at no cost.",
    cta: "Start Free",
    featured: false,
    features: [
      { included: true, text: "Up to 5 users" },
      { included: true, text: "Pipeline analytics dashboard" },
      { included: true, text: "Basic forecasting (7-day outlook)" },
      { included: true, text: "2 integrations" },
      { included: true, text: "Email support" },
      { included: false, text: "AI deal scoring" },
      { included: false, text: "Custom reports" },
      { included: false, text: "API access" },
      { included: false, text: "SSO / SAML" },
      { included: false, text: "Dedicated success manager" },
    ],
  },
  {
    name: "Growth",
    price: { monthly: 99, annual: 79 },
    description: "Advanced analytics and forecasting for growing teams.",
    cta: "Start Free Trial",
    featured: true,
    features: [
      { included: true, text: "Up to 25 users" },
      { included: true, text: "Everything in Starter" },
      { included: true, text: "AI-powered forecasting (12 months)" },
      { included: true, text: "15 integrations" },
      { included: true, text: "Priority chat & email support" },
      { included: true, text: "AI deal scoring & risk alerts" },
      { included: true, text: "Custom report builder" },
      { included: true, text: "REST API access" },
      { included: false, text: "SSO / SAML" },
      { included: false, text: "Dedicated success manager" },
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: 299, annual: 249 },
    description: "Full platform power with enterprise controls and support.",
    cta: "Contact Sales",
    featured: false,
    features: [
      { included: true, text: "Unlimited users" },
      { included: true, text: "Everything in Growth" },
      { included: true, text: "Custom ML model training" },
      { included: true, text: "All integrations + custom connectors" },
      { included: true, text: "24/7 dedicated support" },
      { included: true, text: "Advanced AI deal scoring & insights" },
      { included: true, text: "Custom reports + scheduled exports" },
      { included: true, text: "Full API + webhooks" },
      { included: true, text: "SSO / SAML / SCIM" },
      { included: true, text: "Dedicated success manager" },
    ],
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pricing designed for every stage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start with free core analytics. Scale with AI-powered forecasting
            and enterprise controls as your revenue team grows.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-full px-3 py-1.5">
            <span
              className={`text-sm transition-colors ${
                !annual ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                annual ? "bg-primary" : "bg-muted"
              }`}
              aria-label="Toggle billing period"
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: annual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm transition-colors ${
                annual ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Annual{" "}
              <span className="text-green-400 font-medium text-xs">
                (Save 20%)
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.featured
                  ? "glass-card border-primary/30 shadow-primary/10 shadow-2xl scale-105 md:scale-110"
                  : "glass glass-card-hover"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">
                    {tier.price[annual ? "annual" : "monthly"] === 0
                      ? "$0"
                      : `$${tier.price[annual ? "annual" : "monthly"]}`}
                  </span>
                  {tier.price[annual ? "annual" : "monthly"] > 0 && (
                    <span className="text-muted-foreground text-sm">
                      /user/mo
                    </span>
                  )}
                </div>
                {tier.price[annual ? "annual" : "monthly"] > 0 && annual && (
                  <div className="text-xs text-muted-foreground">
                    Billed annually (${tier.price.annual * 12 * 5} for 5 users)
                  </div>
                )}
              </div>

              <a
                href="#demo"
                className={`flex items-center justify-center gap-2 h-11 rounded-full text-sm font-semibold transition-all mb-8 ${
                  tier.featured
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
                    : "glass hover:bg-white/10 text-foreground"
                }`}
              >
                {tier.cta}
                <ArrowRight size={16} />
              </a>

              <ul className="space-y-3">
                {tier.features.map((feat) => (
                  <li key={feat.text} className="flex items-start gap-2.5">
                    {feat.included ? (
                      <Check
                        size={16}
                        className="text-green-400 shrink-0 mt-0.5"
                      />
                    ) : (
                      <X
                        size={16}
                        className="text-muted-foreground/40 shrink-0 mt-0.5"
                      />
                    )}
                    <span
                      className={`text-sm ${
                        feat.included ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}