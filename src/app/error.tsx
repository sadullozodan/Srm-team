"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./error.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
            <h1 className="err-title">Something went wrong</h1>
            <p className="err-desc">
              An unexpected error occurred. Please try again or contact support.
            </p>

            <div className="err-actions">
              <button onClick={reset} className="err-btn err-btn-primary">
                Try again
              </button>
              <Link href="/" className="err-btn err-btn-ghost">
                Back to home
              </Link>
            </div>

            {error.digest && (
              <p className="err-digest">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </div>

      <div className="err-right">
        <div className="err-right-bg">
          <div className="err-blob err-blob--1" />
          <div className="err-blob err-blob--2" />
        </div>
        <div className="err-orb err-orb--1" />
        <div className="err-orb err-orb--2" />
        <div className="err-orb err-orb--3" />

        <div className="err-right-content">
          <div className="err-brand">
            <svg className="err-brand-logo" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="2" y="2" width="44" height="44" rx="12" stroke="#837bff" strokeWidth="3" />
              <path d="M14 18h20M14 24h16M14 30h18" stroke="#837bff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="err-brand-name">OMUZ</span>
          </div>
          <p className="err-welcome-text">Don&apos;t worry — these things happen. We&apos;re on it.</p>
        </div>
      </div>
    </div>
  );
}