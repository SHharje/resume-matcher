"use client";

import { useState, useEffect } from "react";

/**
 * ResumeScoreCard — displays an animated resume quality assessment.
 *
 * Shows a large circular gauge with the total score + grade,
 * four animated category bars, and a button to proceed to job matches.
 *
 * Props:
 *   scoreCard     — the score_card object from the backend
 *   onViewMatches — callback to transition to the job-matches view
 */

const CATEGORIES = [
  { key: "skills_depth", label: "Skills Depth", icon: "🛠️" },
  { key: "experience_keywords", label: "Experience Keywords", icon: "💼" },
  { key: "education_keywords", label: "Education Keywords", icon: "🎓" },
  { key: "resume_completeness", label: "Resume Completeness", icon: "📋" },
];

function getBarColor(score) {
  if (score >= 8) return { bg: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/20" };
  if (score >= 5) return { bg: "bg-amber-500", text: "text-amber-400", glow: "shadow-amber-500/20" };
  return { bg: "bg-red-500", text: "text-red-400", glow: "shadow-red-500/20" };
}

function getGradeColor(grade) {
  if (grade.startsWith("A")) return "text-emerald-400";
  if (grade.startsWith("B")) return "text-indigo-400";
  if (grade.startsWith("C")) return "text-amber-400";
  return "text-red-400";
}

function getGaugeColor(total) {
  if (total >= 75) return { stroke: "#34d399", glow: "0 0 20px rgba(52,211,153,0.3)" };
  if (total >= 50) return { stroke: "#818cf8", glow: "0 0 20px rgba(129,140,248,0.3)" };
  if (total >= 30) return { stroke: "#fbbf24", glow: "0 0 20px rgba(251,191,36,0.3)" };
  return { stroke: "#f87171", glow: "0 0 20px rgba(248,113,113,0.3)" };
}

export default function ResumeScoreCard({ scoreCard, onViewMatches }) {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const [gaugeAnimated, setGaugeAnimated] = useState(false);

  // Animate the total score count-up
  useEffect(() => {
    const target = scoreCard.total_score;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setAnimatedTotal(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    // Trigger gauge animation after a brief delay
    setTimeout(() => setGaugeAnimated(true), 100);
    // Trigger bar animations after gauge starts
    setTimeout(() => setBarsVisible(true), 600);

    return () => clearInterval(timer);
  }, [scoreCard.total_score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = scoreCard.total_score / 100;
  const gaugeOffset = circumference * (1 - progress);
  const gaugeColor = getGaugeColor(scoreCard.total_score);

  return (
    <div className="w-full max-w-2xl animate-fadeIn">
      <div className="rounded-2xl border border-zinc-700/60 bg-zinc-800/70 p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-zinc-100">Resume Score Card</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Here&apos;s how your resume measures up
          </p>
        </div>

        {/* Circular gauge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="transform -rotate-90"
            >
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgb(63 63 70 / 0.5)"
                strokeWidth="12"
              />
              {/* Animated progress ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={gaugeColor.stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={gaugeAnimated ? gaugeOffset : circumference}
                style={{
                  transition: "stroke-dashoffset 1.5s ease-out",
                  filter: `drop-shadow(${gaugeColor.glow})`,
                }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-zinc-100 tabular-nums">
                {animatedTotal}
              </span>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                out of {scoreCard.max_score}
              </span>
              <span
                className={`mt-1 text-2xl font-black ${getGradeColor(scoreCard.grade)}`}
              >
                {scoreCard.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Category bars */}
        <div className="space-y-5">
          {CATEGORIES.map((cat, index) => {
            const data = scoreCard[cat.key];
            if (!data) return null;
            const colors = getBarColor(data.score);
            const widthPct = (data.score / data.max) * 100;

            return (
              <div
                key={cat.key}
                className="transition-all duration-500"
                style={{
                  opacity: barsVisible ? 1 : 0,
                  transform: barsVisible
                    ? "translateY(0)"
                    : "translateY(12px)",
                  transitionDelay: `${index * 120}ms`,
                }}
              >
                {/* Label row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-sm font-semibold text-zinc-200">
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {data.details}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${colors.text}`}
                    >
                      {data.score}/{data.max}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-700/50">
                  <div
                    className={`h-full rounded-full ${colors.bg} shadow-md ${colors.glow}`}
                    style={{
                      width: barsVisible ? `${widthPct}%` : "0%",
                      transition: `width 0.8s ease-out ${index * 120 + 200}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-7 border-t border-zinc-700/50" />

        {/* CTA button */}
        <div className="flex justify-center">
          <button
            id="view-matches-button"
            onClick={onViewMatches}
            className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-purple-400 hover:shadow-indigo-400/30 hover:scale-[1.03] active:scale-[0.97]"
          >
            View Job Matches
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
