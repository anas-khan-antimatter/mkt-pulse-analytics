"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, TrendingUp, Clock, RefreshCw } from "lucide-react";

// ── Parse query params into initial values ──────────────────────────
const DEFAULTS = {
  dealsPerMonth: 50,
  avgDealSize: 10000,
  currentWinRate: 25,
  improvedWinRate: 35,
  monthlyCost: 79,
  numUsers: 10,
};

function parseQueryParams(): Partial<typeof DEFAULTS> {
  const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const out: Record<string, number> = {};
  for (const key of Object.keys(DEFAULTS)) {
    const raw = sp.get(key);
    if (raw !== null) {
      const n = Number(raw);
      if (!Number.isNaN(n) && n >= 0) out[key] = n;
    }
  }
  return out as Partial<typeof DEFAULTS>;
}

export default function ROICalculatorSection() {
  const fromUrl = typeof window !== "undefined" ? parseQueryParams() : {};
  const [dealsPerMonth, _setDealsPerMonth] = useState(fromUrl.dealsPerMonth ?? DEFAULTS.dealsPerMonth);
  const [avgDealSize, _setAvgDealSize] = useState(fromUrl.avgDealSize ?? DEFAULTS.avgDealSize);
  const [currentWinRate, _setCurrentWinRate] = useState(fromUrl.currentWinRate ?? DEFAULTS.currentWinRate);
  const [improvedWinRate, _setImprovedWinRate] = useState(fromUrl.improvedWinRate ?? DEFAULTS.improvedWinRate);
  const [monthlyCost, _setMonthlyCost] = useState(fromUrl.monthlyCost ?? DEFAULTS.monthlyCost);
  const [numUsers, _setNumUsers] = useState(fromUrl.numUsers ?? DEFAULTS.numUsers);

  // ── Sync URL search params when any value changes ──────────────────
  const allValues = () => ({
    dealsPerMonth,
    avgDealSize,
    currentWinRate,
    improvedWinRate,
    monthlyCost,
    numUsers,
  });

  function updateUrl() {
    if (typeof window === "undefined") return;
    const vals = allValues();
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(vals)) {
      sp.set(k, String(v));
    }
    const newQs = sp.toString();
    if (window.location.search.slice(1) !== newQs) {
      window.history.replaceState(null, "", `?${newQs}`);
    }
  }

  // We need setters that also call updateUrl after state settles
  const setDealsPerMonth    = (v: number) => { _setDealsPerMonth(v);    setTimeout(updateUrl, 0); };
  const setAvgDealSize      = (v: number) => { _setAvgDealSize(v);      setTimeout(updateUrl, 0); };
  const setCurrentWinRate   = (v: number) => { _setCurrentWinRate(v);   setTimeout(updateUrl, 0); };
  const setImprovedWinRate  = (v: number) => { _setImprovedWinRate(v); setTimeout(updateUrl, 0); };
  const setMonthlyCost      = (v: number) => { _setMonthlyCost(v);      setTimeout(updateUrl, 0); };
  const setNumUsers         = (v: number) => { _setNumUsers(v);         setTimeout(updateUrl, 0); };

  // Calculations
  const currentDealsWon = Math.round(dealsPerMonth * (currentWinRate / 100));
  const improvedDealsWon = Math.round(dealsPerMonth * (improvedWinRate / 100));
  const additionalDeals = improvedDealsWon - currentDealsWon;
  const additionalRevenue = additionalDeals * avgDealSize;
  const annualRevenue = additionalRevenue * 12;
  const annualCost = monthlyCost * numUsers * 12;
  const netAnnualGain = annualRevenue - annualCost;
  const roiPercent = annualCost > 0 ? Math.round((netAnnualGain / annualCost) * 100) : 0;

  // Time savings (assume 2 hrs/deal saved on manual work)
  const hoursSavedPerMonth = additionalDeals * 2;
  const hoursSavedAnnual = hoursSavedPerMonth * 12;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />

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
            <Calculator size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">ROI Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Calculate your return on Pulse
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much additional revenue your team could generate with AI-powered
            pipeline analytics and forecasting.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 space-y-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RefreshCw size={18} className="text-primary" />
              Your Metrics
            </h3>

            <SliderInput
              label="Deals per month"
              value={dealsPerMonth}
              onChange={setDealsPerMonth}
              min={10}
              max={500}
              step={5}
              unit="deals"
            />

            <SliderInput
              label="Average deal size"
              value={avgDealSize}
              onChange={setAvgDealSize}
              min={1000}
              max={100000}
              step={500}
              prefix="$"
            />

            <SliderInput
              label="Current win rate"
              value={currentWinRate}
              onChange={setCurrentWinRate}
              min={5}
              max={60}
              step={1}
              unit="%"
            />

            <SliderInput
              label="Estimated win rate with Pulse"
              value={improvedWinRate}
              onChange={setImprovedWinRate}
              min={currentWinRate + 1}
              max={75}
              step={1}
              unit="%"
              hint="Teams typically see +5–20% improvement"
            />

            <div className="border-t border-white/[0.06] pt-6 space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Investment
              </h4>
              <SliderInput
                label="Monthly subscription (per user)"
                value={monthlyCost}
                onChange={setMonthlyCost}
                min={0}
                max={300}
                step={10}
                prefix="$"
              />
              <SliderInput
                label="Number of users"
                value={numUsers}
                onChange={setNumUsers}
                min={1}
                max={100}
                step={1}
              />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-8">
              <TrendingUp size={18} className="text-primary" />
              Your Projected ROI
            </h3>

            {/* Primary metric */}
            <div className="text-center mb-10">
              <div className="text-sm text-muted-foreground mb-1">
                Estimated annual net gain
              </div>
              <div className="text-5xl font-bold gradient-text">
                ${netAnnualGain.toLocaleString()}
              </div>
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full glass">
                <span className="text-green-400 font-semibold">
                  {roiPercent}% ROI
                </span>
              </div>
            </div>

            {/* Detail metrics */}
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                icon={DollarSign}
                label="Additional revenue / year"
                value={`$${annualRevenue.toLocaleString()}`}
                gradient="from-blue-500 to-cyan-500"
              />
              <ResultCard
                icon={TrendingUp}
                label="Additional deals / month"
                value={`+${additionalDeals}`}
                gradient="from-violet-500 to-purple-500"
              />
              <ResultCard
                icon={Clock}
                label="Hours saved / year"
                value={`${hoursSavedAnnual.toLocaleString()}h`}
                gradient="from-emerald-500 to-teal-500"
              />
              <ResultCard
                icon={Calculator}
                label="Annual investment"
                value={`$${annualCost.toLocaleString()}`}
                gradient="from-amber-500 to-orange-500"
              />
            </div>

            {/* Win rate comparison bar */}
            <div className="mt-8 glass rounded-xl p-5">
              <div className="text-xs text-muted-foreground mb-3">
                Win Rate Comparison
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Current: {currentWinRate}%</span>
                    <span className="text-muted-foreground">
                      {currentDealsWon} deals/mo
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-muted-foreground transition-all duration-500"
                      style={{ width: `${currentWinRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-primary font-medium">
                      With Pulse: {improvedWinRate}%
                    </span>
                    <span className="text-primary">
                      {improvedDealsWon} deals/mo
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${improvedWinRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  unit,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-muted-foreground">{label}</label>
        <div className="text-sm font-medium tabular-nums">
          {prefix}{value.toLocaleString()}{unit ? ` ${unit}` : ""}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-muted
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-primary/30
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-primary
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-0.5">
        <span>{prefix}{min.toLocaleString()}{unit ? unit : ""}</span>
        <span>{prefix}{max.toLocaleString()}{unit ? unit : ""}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground/70 mt-1">{hint}</p>}
    </div>
  );
}

function ResultCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} opacity-20 flex items-center justify-center mb-2`}
      >
        <Icon size={15} className="text-white" />
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}