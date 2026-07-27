"use client";

import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="nf-shell nf-shell--visible">
      <div className="nf-left">
        <div className="nf-topbar">
          <div className="nf-logo">
            <svg className="nf-logo-icon" viewBox="0 0 34 34" fill="none">
              <rect x="1" y="1" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="2" />
              <path d="M10 12h14M10 17h10M10 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="nf-logo-text">OMUZ</span>
          </div>
        </div>

        <div className="nf-form-wrap">
          <div className="nf-form">
            <div className="nf-code">404</div>
            <h1 className="nf-title">Page not found</h1>
            <p className="nf-desc">
              The page you are looking for does not exist or has been moved.
            </p>

            <div className="nf-actions">
              <Link href="/" className="nf-btn nf-btn-primary">
                Back to home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="nf-btn nf-btn-ghost"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="nf-right">
        <div className="nf-right-bg">
          <div className="nf-blob nf-blob--1" />
          <div className="nf-blob nf-blob--2" />
        </div>
        <div className="nf-orb nf-orb--1" />
        <div className="nf-orb nf-orb--2" />
        <div className="nf-orb nf-orb--3" />

        <div className="nf-right-content">
          <div className="nf-brand">
            <svg className="nf-brand-logo" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="2" y="2" width="44" height="44" rx="12" stroke="#837bff" strokeWidth="3" />
              <path d="M14 18h20M14 24h16M14 30h18" stroke="#837bff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="nf-brand-name">OMUZ</span>
          </div>
          <p className="nf-welcome-text">Something&apos;s off — let&apos;s get you back on track.</p>
        </div>
      </div>
    </div>
  );
}