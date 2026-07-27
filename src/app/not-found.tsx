"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import "./not-found.css";

export default function NotFound() {
  const t = useT();
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
            <h1 className="nf-title">{t("Page not found")}</h1>
            <p className="nf-desc">
              {t("The page you are looking for does not exist or has been moved.")}
            </p>

            <div className="nf-actions">
              <Link href="/" className="nf-btn nf-btn-primary">
                {t("Back to home")}
              </Link>
              <button
                onClick={() => window.history.back()}
                className="nf-btn nf-btn-ghost"
              >
                {t("Go back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}