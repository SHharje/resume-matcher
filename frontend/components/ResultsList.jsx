import JobCard from "./JobCard";

/**
 * ResultsList — organises and renders the array of match results.
 *
 * Props:
 *   results — array of { title, match_percentage, matching_skills, missing_skills }
 */
export default function ResultsList({ results }) {
  if (!results || results.length === 0) {
    return (
      <p className="text-center text-zinc-400">
        No matching jobs found. Try a different resume.
      </p>
    );
  }

  const [best, ...rest] = results;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      <h2 className="text-lg font-semibold text-zinc-200">
        🎯 Found{" "}
        <span className="text-indigo-400">{results.length}</span> matching{" "}
        {results.length === 1 ? "job" : "jobs"}
      </h2>

      {/* Best match — highlighted card */}
      <JobCard job={best} highlighted />

      {/* Remaining matches */}
      {rest.map((job, index) => (
        <JobCard key={index} job={job} />
      ))}
    </div>
  );
}
