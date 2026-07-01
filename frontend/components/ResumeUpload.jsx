"use client";

import { useState, useRef, useCallback } from "react";
import { matchResume } from "../lib/api";

/**
 * ResumeUpload — a premium drag-and-drop / click-to-upload component for PDF resumes.
 *
 * States:
 *   1. EMPTY      — shows the dropzone with upload prompt
 *   2. SELECTED   — file preview card with options (analyse / change / remove)
 *   3. LOADING    — animated analysis progress view
 *
 * Props:
 *   onResults(results) — callback invoked with the backend response once
 *                         the resume has been analysed.
 *   onError(message)   — callback invoked when something goes wrong.
 */
export default function ResumeUpload({ onResults, onError }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  // Format file size to human readable
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function handleFile(selectedFile) {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported. Please upload a valid resume.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 10 MB.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleChange(e) {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }

  function handleRemove() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleChangeFile() {
    inputRef.current?.click();
  }

  const handleAnalyse = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress steps while waiting for the API
    const progressSteps = [12, 28, 45, 62, 78, 88];
    let step = 0;
    const interval = setInterval(() => {
      if (step < progressSteps.length) {
        setProgress(progressSteps[step]);
        step++;
      }
    }, 600);

    try {
      const data = await matchResume(file);
      clearInterval(interval);
      setProgress(100);
      // Brief pause at 100% so user sees completion
      await new Promise((r) => setTimeout(r, 400));
      onResults(data);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      const msg =
        "Something went wrong while analysing your resume. Please try again.";
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  }, [file, onResults, onError]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        id="file-input"
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      {/* ─── STATE: NO FILE SELECTED ─── */}
      {!file && !loading && (
        <div
          id="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`group relative flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
            isDragging
              ? "border-indigo-400 bg-indigo-500/10 scale-[1.02] shadow-2xl shadow-indigo-500/10"
              : "border-zinc-600 bg-zinc-800/50 hover:border-indigo-400/60 hover:bg-zinc-800/80"
          }`}
        >
          {/* Background glow on drag */}
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
          )}

          {/* Upload icon */}
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
              isDragging
                ? "bg-indigo-500/20 scale-110"
                : "bg-zinc-700/50 group-hover:bg-indigo-500/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-10 w-10 transition-all duration-300 ${
                isDragging
                  ? "text-indigo-300 -translate-y-1"
                  : "text-indigo-400 group-hover:-translate-y-0.5"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0L8 8m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
              />
            </svg>
          </div>

          <p className="text-lg font-semibold text-zinc-200">
            {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
          </p>
          <p className="mt-1.5 text-sm text-zinc-400">
            or{" "}
            <span className="font-medium text-indigo-400 underline decoration-indigo-400/30 underline-offset-2">
              click to browse
            </span>
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-zinc-700/60 px-3 py-1 text-xs text-zinc-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF only
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-zinc-700/60 px-3 py-1 text-xs text-zinc-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Max 10 MB
            </span>
          </div>
        </div>
      )}

      {/* ─── STATE: FILE SELECTED ─── */}
      {file && !loading && (
        <div className="w-full max-w-2xl animate-fadeIn">
          {/* File preview card */}
          <div className="rounded-2xl border border-zinc-700/60 bg-zinc-800/70 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-5">
              {/* PDF icon */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-1 ring-red-500/20">
                <svg className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-zinc-100">
                  {file.name}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    {formatSize(file.size)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-zinc-600" />
                  <span>PDF Document</span>
                </div>

                {/* Ready badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to analyse
                </div>
              </div>

              {/* Remove button */}
              <button
                id="remove-file-button"
                onClick={handleRemove}
                title="Remove file"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-zinc-700/50" />

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                id="analyse-button"
                onClick={handleAnalyse}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-purple-400 hover:shadow-indigo-400/30 hover:scale-[1.03] active:scale-[0.97]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analyse Resume
              </button>

              <button
                id="change-file-button"
                onClick={handleChangeFile}
                className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Change File
              </button>
            </div>
          </div>

          {/* Tip */}
          <p className="mt-4 text-center text-xs text-zinc-500">
            💡 Tip: Make sure your resume includes relevant skills and keywords for best results
          </p>
        </div>
      )}

      {/* ─── STATE: LOADING / ANALYSING ─── */}
      {loading && (
        <div id="loading-view" className="w-full max-w-2xl animate-fadeIn">
          <div className="rounded-2xl border border-indigo-500/20 bg-zinc-800/70 p-8 backdrop-blur-sm">
            {/* File being analysed */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/20">
                <svg className="h-6 w-6 text-indigo-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Analysing {file?.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Extracting skills and matching against job listings…
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Progress</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Analysis steps */}
            <div className="mt-6 space-y-3">
              {[
                { label: "Extracting text from PDF", threshold: 10 },
                { label: "Identifying skills & keywords", threshold: 30 },
                { label: "Computing semantic similarity", threshold: 55 },
                { label: "Ranking job matches", threshold: 75 },
                { label: "Preparing results", threshold: 90 },
              ].map((step, i) => {
                const done = progress >= step.threshold + 10;
                const active =
                  progress >= step.threshold && progress < step.threshold + 10;
                return (
                  <div key={i} className="flex items-center gap-3">
                    {done ? (
                      <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : active ? (
                      <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-zinc-600" />
                    )}
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        done
                          ? "text-zinc-300"
                          : active
                          ? "text-indigo-300 font-medium"
                          : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          id="upload-error"
          className="flex w-full max-w-2xl items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3.5 animate-fadeIn"
        >
          <svg className="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
