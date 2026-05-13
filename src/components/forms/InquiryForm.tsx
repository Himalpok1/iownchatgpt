"use client";

import { useState } from "react";

type InquiryType = "contact" | "game_request";

type InquiryFormProps = {
  type: InquiryType;
};

const formCopy: Record<
  InquiryType,
  {
    buttonLabel: string;
    successMessage: string;
    errorMessage: string;
  }
> = {
  contact: {
    buttonLabel: "Send Message",
    successMessage: "Thanks. Your message is in the inbox and we will follow up soon.",
    errorMessage: "We could not send your message just now.",
  },
  game_request: {
    buttonLabel: "Submit Request",
    successMessage: "Thanks. Your game idea has been added to the request queue.",
    errorMessage: "We could not save your request just now.",
  },
};

export function InquiryForm({ type }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const copy = formCopy[type];

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      type,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject:
        type === "contact" ? String(formData.get("subject") ?? "") : undefined,
      message:
        type === "contact"
          ? String(formData.get("message") ?? "")
          : String(formData.get("gameRequest") ?? ""),
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? copy.errorMessage);
      }

      setSuccess(copy.successMessage);
      const form = document.getElementById(`${type}-form`) as HTMLFormElement | null;
      form?.reset();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : copy.errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      id={`${type}-form`}
      action={handleSubmit}
      className="flex flex-col gap-[var(--space-12)]"
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="form-input"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="form-input"
        required
      />
      {type === "contact" ? (
        <>
          <input
            type="text"
            name="subject"
            placeholder="What is this about?"
            className="form-input"
            required
          />
          <textarea
            name="message"
            placeholder="Tell us more..."
            className="form-input min-h-[150px] resize-y"
            rows={6}
            required
          />
        </>
      ) : (
        <textarea
          name="gameRequest"
          placeholder="Describe the game you'd like to see (e.g., Snake Game, Tetris, Pong...)"
          className="form-input min-h-[100px] resize-y"
          rows={4}
          required
        />
      )}

      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-emerald-300" role="status">
          {success}
        </p>
      ) : null}

      <button type="submit" className="btn-gradient" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : copy.buttonLabel}
      </button>
    </form>
  );
}
