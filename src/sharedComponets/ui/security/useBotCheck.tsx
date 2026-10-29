"use client";
import React, { useCallback, useEffect, useId, useState } from "react";

export type BotPayload = {
  captchaToken: string;
  captchaAnswer: string;
  website: string;
};

type Challenge = { question: string; token: string };

/**
 * Human check for public forms: a signed math question plus a hidden honeypot.
 * Spread `getPayload()` into the request body, drop `element` into the form,
 * and call `refresh()` after any failed submit (each challenge is single-use).
 */
export function useBotCheck({
  inputClassName,
  autoLoad = true,
}: { inputClassName?: string; autoLoad?: boolean } = {}) {
  const uid = useId();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  const refresh = useCallback(async () => {
    setAnswer("");
    setLoadFailed(false);
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error("captcha unavailable");
      setChallenge({ question: json.question, token: json.token });
    } catch {
      setChallenge(null);
      setLoadFailed(true);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) void refresh();
  }, [autoLoad, refresh]);

  const getPayload = (): BotPayload => ({
    captchaToken: challenge?.token ?? "",
    captchaAnswer: answer.trim(),
    website: honeypot,
  });

  const isAnswered = Boolean(challenge) && answer.trim() !== "";

  const element = (
    <div className="w-full">
      <label htmlFor={`${uid}-answer`} className="block">
        Security check:{" "}
        <strong>
          {challenge ? `What is ${challenge.question}?` : "loading…"}
        </strong>
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`${uid}-answer`}
          data-wt-hide-cursor
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          required
          aria-required="true"
          disabled={!challenge}
          value={answer}
          onChange={(e) => setAnswer(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="Your answer"
          className={
            inputClassName ??
            "cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-400"
          }
        />
        <button
          type="button"
          onClick={() => void refresh()}
          aria-label="Get a new security question"
          title="New question"
          className="mt-1.5 px-3 py-1.5 rounded-[4px] border border-slate-300 dark:border-slate-400"
        >
          ↻
        </button>
      </div>
      {loadFailed ? (
        <p className="mt-1 text-red-500">
          Could not load the security check. Please refresh and try again.
        </p>
      ) : null}
      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
    </div>
  );

  return { element, getPayload, refresh, isAnswered };
}
