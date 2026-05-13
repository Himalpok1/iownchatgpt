"use client";

import { useMemo, useState } from "react";
import type { EditorialSettingsRecord } from "@/lib/editorial/settings";

type Props = {
  settings: EditorialSettingsRecord;
};

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

export function EditorialSettingsForm({ settings }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [automationEnabled, setAutomationEnabled] = useState(
    settings.automationEnabled
  );
  const [trackedTopics, setTrackedTopics] = useState(settings.trackedTopics.join(", "));
  const [maxSourcesPerRun, setMaxSourcesPerRun] = useState(
    String(settings.maxSourcesPerRun)
  );
  const [model, setModel] = useState(settings.model);
  const [times, setTimes] = useState(
    settings.scheduleSlots.reduce<Record<string, string>>((acc, slot) => {
      acc[slot.slot] = `${padTime(slot.hour)}:${padTime(slot.minute)}`;
      return acc;
    }, {})
  );

  const scheduleSlots = useMemo(
    () =>
      ["morning", "midday", "evening"].map((slot) => {
        const [hour = "0", minute = "0"] = (times[slot] ?? "00:00").split(":");
        return {
          slot,
          hour: Number(hour),
          minute: Number(minute),
        };
      }),
    [times]
  );

  async function handleSave() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/editorial/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationEnabled,
          trackedTopics: trackedTopics
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          scheduleSlots,
          maxSourcesPerRun: Number(maxSourcesPerRun),
          model,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Could not save newsroom settings.");
      }

      setMessage("Newsroom settings updated.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save newsroom settings."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="surface-panel p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="home-section__eyebrow !mb-2">Automation</p>
          <h3 className="text-white text-[1.1rem] font-[var(--font-weight-semibold)]">
            Newsroom settings
          </h3>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--color-gray-200)]">
          <input
            type="checkbox"
            checked={automationEnabled}
            onChange={(event) => setAutomationEnabled(event.target.checked)}
          />
          Automation enabled
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">
            Tracked topics
          </label>
          <input
            className="form-input"
            value={trackedTopics}
            onChange={(event) => setTrackedTopics(event.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">
            Model
          </label>
          <input
            className="form-input"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">
            Max sources per run
          </label>
          <input
            type="number"
            min={4}
            max={12}
            className="form-input"
            value={maxSourcesPerRun}
            onChange={(event) => setMaxSourcesPerRun(event.target.value)}
          />
        </div>
        {["morning", "midday", "evening"].map((slot) => (
          <div key={slot}>
            <label className="block text-sm text-[var(--color-gray-300)] mb-2 capitalize">
              {slot} slot time
            </label>
            <input
              type="time"
              className="form-input"
              value={times[slot] ?? "08:00"}
              onChange={(event) =>
                setTimes((current) => ({ ...current, [slot]: event.target.value }))
              }
            />
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-300 mt-4">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300 mt-4">{message}</p> : null}

      <div className="mt-5">
        <button className="btn-gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save newsroom settings"}
        </button>
      </div>
    </div>
  );
}
