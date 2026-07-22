"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Globe, Loader2 } from "lucide-react";
import { LogoMark } from "@/components/icons";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Already signed in? Skip the form.
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ userName, password });
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Номер телефон ё пароли нодуруст.");
      } else {
        setError(err instanceof Error ? err.message : "Хатогӣ рух дод.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`login-shell ${mounted ? "login-shell--visible" : ""}`}>
      {/* ── Left: form ──────────────────────────────────────────────── */}
      <div className="login-left">
        {/* Top bar */}
        <header className="login-topbar">
          <div className="login-logo">
            <LogoMark className="login-logo-icon" />
            <span className="login-logo-text">OMUZ</span>
          </div>

          <button type="button" className="login-lang-btn" aria-label="Change language">
            <Globe className="login-lang-icon" />
            <span>RUS</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* Form card */}
        <div className="login-form-wrap">
          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <h1 className="login-title">Войти</h1>

            {/* Phone */}
            <div className="login-field">
              <label htmlFor="userName" className="login-label">
                Телефон
              </label>
              <div className="login-input-wrap">
                <input
                  id="userName"
                  type="text"
                  className="login-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder="+992  900 01 02 03"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Пароль
              </label>
              <div className="login-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="login-eye-btn"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="login-error">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={submitting}
            >
              {submitting && <Loader2 className="login-spinner" size={18} />}
              Войти
            </button>
          </form>

          <p className="login-signup-link">
            Нет аккаунта?{" "}
            <Link href="/register">Создать аккаунт</Link>
          </p>
        </div>
      </div>

      {/* ── Right: branding ─────────────────────────────────────────── */}
      <div className="login-right">
        <div className="login-right-content">
          <h2 className="login-welcome-title">
            Добро пожаловать в
          </h2>
          <div className="login-brand">
            <LogoMark width={52} height={52} className="login-brand-logo" />
            <span className="login-brand-name">OMUZ</span>
          </div>

          {/* Decorative illustration */}
          <div className="login-illustration">
            {/* Graduation cap */}
            <div className="login-illus-cap">
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                <path d="M40 8L8 24l32 16 32-16L40 8Z" fill="#1e2040" stroke="#2a2d5a" strokeWidth="1.5" />
                <path d="M40 8L8 24l32 16 32-16L40 8Z" fill="url(#cap-grad)" />
                <rect x="38" y="24" width="4" height="22" rx="1" fill="#3b3e6b" />
                <circle cx="40" cy="48" r="4" fill="#f59e0b" />
                <path d="M36 48c0 4 8 8 8 8s8-4 8-8" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
                <defs>
                  <linearGradient id="cap-grad" x1="8" y1="8" x2="72" y2="40">
                    <stop stopColor="#2a2d5a" />
                    <stop offset="1" stopColor="#1a1c3d" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Main circle with percentage */}
            <div className="login-illus-circle">
              <svg viewBox="0 0 120 120" className="login-illus-ring">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2040" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="327"
                  strokeDashoffset="300"
                  className="login-ring-progress"
                />
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="120" y2="120">
                    <stop stopColor="#ff6b35" />
                    <stop offset="0.5" stopColor="#4f46e5" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="login-illus-percent">8%</span>
            </div>

            {/* Floating orbs */}
            <div className="login-orb login-orb--1" />
            <div className="login-orb login-orb--2" />
            <div className="login-orb login-orb--3" />
          </div>
        </div>

        {/* Background gradient blobs */}
        <div className="login-right-bg">
          <div className="login-blob login-blob--1" />
          <div className="login-blob login-blob--2" />
        </div>
      </div>
    </div>
  );
}
