"use client";

import { useState } from "react";

type Props = {
  article: {
    id: number;
    title: string;
    summary: string;
    bodyHtml: string;
    heroImageUrl: string | null;
    status: string;
  };
};

export function EditorialArticleEditor({ article }: Props) {
  const [title, setTitle] = useState(article.title);
  const [summary, setSummary] = useState(article.summary);
  const [bodyHtml, setBodyHtml] = useState(article.bodyHtml);
  const [heroImageUrl, setHeroImageUrl] = useState(article.heroImageUrl ?? "");
  const [status, setStatus] = useState(article.status);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/editorial/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          bodyHtml,
          heroImageUrl,
          status,
          notes,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Could not save the article.");
      }

      setMessage("Article updated.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save the article."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="surface-panel p-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">Title</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">Summary</label>
          <textarea
            className="form-input min-h-[120px] resize-y"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">Hero image URL</label>
          <input
            className="form-input"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">Status</label>
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">
            Correction note
          </label>
          <input className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-300)] mb-2">Body HTML</label>
          <textarea
            className="form-input min-h-[420px] resize-y"
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-300 mt-4">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300 mt-4">{message}</p> : null}

      <div className="mt-5">
        <button className="btn-gradient" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save article changes"}
        </button>
      </div>
    </div>
  );
}
