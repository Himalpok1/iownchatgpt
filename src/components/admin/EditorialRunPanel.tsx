"use client";

import { useState } from "react";

const slots = ["morning", "midday", "evening"] as const;

export function EditorialRunPanel() {
  const [slot, setSlot] = useState<(typeof slots)[number]>("morning");
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRun() {
    setIsRunning(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/editorial/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }),
      });

      const result = (await response.json()) as {
        article?: { slug: string; title: string };
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "The newsroom run failed.");
      }

      setMessage(`Published: ${result.article?.title ?? "Roundup generated"}`);
    } catch (runError) {
      setError(
        runError instanceof Error ? runError.message : "The newsroom run failed."
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="surface-panel p-6">
      <p className="home-section__eyebrow !mb-2">Manual control</p>
      <h3 className="text-white text-[1.1rem] font-[var(--font-weight-semibold)] mb-4">
        Trigger a newsroom run
      </h3>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">
            Slot
          </label>
          <select
            className="form-input"
            value={slot}
            onChange={(event) => setSlot(event.target.value as (typeof slots)[number])}
          >
            {slots.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-gradient" onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Running..." : "Generate now"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-300 mt-4">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300 mt-4">{message}</p> : null}
    </div>
  );
}
