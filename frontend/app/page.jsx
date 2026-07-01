"use client";

import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import ResumeScoreCard from "../components/ResumeScoreCard";
import ResultsList from "../components/ResultsList";

/**
 * Home — the main landing page.
 * Flow: Upload → Score Card → Job Matches
 */
export default function Home() {
  const [results, setResults] = useState(null);
  const [scoreCard, setScoreCard] = useState(null);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [error, setError] = useState(null);

  function handleResults(data) {
    // data comes from the API as { results: [...], score_card: {...} }
    setResults(data.results);
    setScoreCard(data.score_card);
    setShowScoreCard(true);
  }

  function handleViewMatches() {
    setShowScoreCard(false);
  }

  function handleReset() {
    setResults(null);
    setScoreCard(null);
    setShowScoreCard(false);
    setError(null);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Resume{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Matcher
          </span>
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Find jobs that match your skills
        </p>
      </div>

      {/* Error bar */}
      {error && (
        <div
          id="error-bar"
          className="mb-8 w-full max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-center text-sm font-medium text-red-400"
        >
          {error}
        </div>
      )}

      {/* Conditional view: Upload → Score Card → Results */}
      {results === null ? (
        <ResumeUpload onResults={handleResults} onError={setError} />
      ) : showScoreCard && scoreCard ? (
        <div className="flex w-full flex-col items-center gap-8">
          <ResumeScoreCard
            scoreCard={scoreCard}
            onViewMatches={handleViewMatches}
          />
          <button
            id="reset-from-scorecard-button"
            onClick={handleReset}
            className="rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700 hover:scale-105 active:scale-95"
          >
            ← Analyse Another Resume
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-8">
          {/* Back to score card link */}
          <button
            id="back-to-scorecard-button"
            onClick={() => setShowScoreCard(true)}
            className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Score Card
          </button>
          <ResultsList results={results} />
          <button
            id="reset-button"
            onClick={handleReset}
            className="rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700 hover:scale-105 active:scale-95"
          >
            ← Analyse Another Resume
          </button>
        </div>
      )}
    </main>
  );
}

