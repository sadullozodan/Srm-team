"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import "./error.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="err-shell err-shell--visible">
      <div className="err-left">
        <div className="err-topbar">
          <div className="err-logo">
            <svg className="err-logo-icon" viewBox="0 0 34 34" fill="none">
              <rect x="1" y="1" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2" />
              <path d="M10 12h14M10 17h10M10 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="err-logo-text">OMUZ</span>
          </div>
        </div>

        <div className="err-form-wrap">
          <div className="err-form">
            <div className="err-icon">!</div>
            <h1 className="err-title">{t("Something went wrong")}</h1>
            <p className="err-desc">
              {t("An unexpected error occurred. Please try again or contact support.")}
            </p>

            <div className="err-actions">
              <button onClick={reset} className="err-btn err-btn-primary">
                {t("Try again")}
              </button>
              <Link href="/" className="err-btn err-btn-ghost">
                {t("Back to home")}
              </Link>
            </div>

            {error.digest && (
              <p className="err-digest">{t("Error ID: {digest}").replace("{digest}", error.digest)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}