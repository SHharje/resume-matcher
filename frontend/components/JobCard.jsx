import SkillRadarChart from "./SkillRadarChart";

/**
 * JobCard — displays a single job match result as a card.
 *
 * Props:
 *   job           — { title, match_percentage, matching_skills, missing_skills, radar_data }
 *   highlighted   — (optional) if true, renders a larger "Best Match" variant.
 */
export default function JobCard({ job, highlighted = false }) {
  const pct = Math.round(job.match_percentage);

  // Colour coding for the match percentage
  let pctColor = "text-red-400";
  let pctBg = "bg-red-400/10";
  let ringColor = "ring-red-400/30";
  if (pct >= 70) {
    pctColor = "text-emerald-400";
    pctBg = "bg-emerald-400/10";
    ringColor = "ring-emerald-400/30";
  } else if (pct >= 40) {
    pctColor = "text-amber-400";
    pctBg = "bg-amber-400/10";
    ringColor = "ring-amber-400/30";
  }

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        highlighted
          ? "border-indigo-500/40 bg-zinc-800/80 p-6 shadow-lg shadow-indigo-500/10"
          : "border-zinc-700/60 bg-zinc-800/50 p-5 hover:border-zinc-600"
      }`}
    >
      {/* Best Match label */}
      {highlighted && (
        <span className="absolute -top-3 left-5 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-500/30">
          Best Match
        </span>
      )}

      {/* Header row: title + percentage */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className={`font-semibold text-zinc-100 ${
            highlighted ? "text-xl" : "text-lg"
          }`}
        >
          {job.title}
        </h3>
        <span
          className={`flex-shrink-0 rounded-xl px-3 py-1 text-2xl font-bold ring-1 ${pctColor} ${pctBg} ${ringColor}`}
        >
          {pct}%
        </span>
      </div>

      {/* Skill Radar Chart */}
      {job.radar_data && (
        <div className="mt-5 rounded-xl border border-zinc-700/40 bg-zinc-900/40 p-3">
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Skill Coverage
          </p>
          <SkillRadarChart data={job.radar_data} />
        </div>
      )}

      {/* Skills sections */}
      <div className="mt-5 space-y-4">
        {/* Matching Skills */}
        {job.matching_skills?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Matching Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {job.matching_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {job.missing_skills?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {job.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400 ring-1 ring-red-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
