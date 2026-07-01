"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

/**
 * SkillRadarChart — Recharts radar chart comparing resume vs job skill coverage.
 *
 * Two overlapping polygons:
 *   - Resume coverage (indigo)
 *   - Job requirements (purple)
 *
 * Props:
 *   data — array of { category, resume, job, resumeCount, jobCount }
 */

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-lg border border-zinc-700/60 bg-zinc-800/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold text-zinc-200 mb-1">
        {data.category}
      </p>
      <div className="space-y-0.5">
        <p className="text-xs text-indigo-400">
          Resume: {data.resumeCount}/{data.jobCount} skills ({data.resume}%)
        </p>
        <p className="text-xs text-purple-400">
          Required: {data.jobCount} skills
        </p>
      </div>
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
        <span className="text-xs font-medium text-zinc-400">Your Resume</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
        <span className="text-xs font-medium text-zinc-400">Job Requires</span>
      </div>
    </div>
  );
}

export default function SkillRadarChart({ data }) {
  if (!data || data.length === 0) return null;

  // Filter out categories where the job has 0 skills
  const chartData = data.filter((d) => d.jobCount > 0);

  if (chartData.length < 3) {
    // Need at least 3 axes for a meaningful radar chart
    return null;
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid
            stroke="rgb(63 63 70 / 0.6)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fill: "#a1a1aa",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          {/* Job requirements (background shape) */}
          <Radar
            name="Job Requires"
            dataKey="job"
            stroke="#a855f7"
            strokeWidth={2}
            fill="rgba(168, 85, 247, 0.15)"
            fillOpacity={1}
            dot={false}
          />

          {/* Resume coverage (foreground shape) */}
          <Radar
            name="Your Resume"
            dataKey="resume"
            stroke="#818cf8"
            strokeWidth={2}
            fill="rgba(99, 102, 241, 0.25)"
            fillOpacity={1}
            dot={{
              r: 3,
              fill: "#818cf8",
              stroke: "#312e81",
              strokeWidth: 1,
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
