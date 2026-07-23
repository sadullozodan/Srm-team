import Image from "next/image";
import { CalendarCheck, Coins, Wallet } from "lucide-react";
import { Logo } from "@/components/icons";
import { LangMenu, ThemeToggle } from "@/components/header";

// Split auth shell: form column on the left, brand panel on the right. The
// panel drops below lg, so phones get the form full width.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-14">
        <div className="flex items-center justify-between gap-4">
          <Logo priority />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LangMenu />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-129 duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
            {children}
          </div>
        </div>
      </div>

      <BrandPanel />
    </div>
  );
}

const FEATURES = [
  { icon: CalendarCheck, text: "Students, groups and attendance in one place" },
  { icon: Wallet, text: "Payments and finance at a glance" },
  { icon: Coins, text: "Tokens and rewards that keep students going" },
];

// A small SVG noise, kept as a non-interactive overlay so it never repaints on
// scroll (there is no scroll here, but the habit is cheap).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden rounded-2xl bg-auth-panel lg:m-6 lg:ml-0 lg:block">
      {/* Brand wash in the app's own accent, not a generic gradient. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_58%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col justify-between px-14 pt-16 pb-0">
        <div className="delay-100 duration-700 animate-in fade-in slide-in-from-left-6 fill-mode-both motion-reduce:animate-none">
          <p className="text-xs font-bold tracking-[0.2em] text-auth-panel-foreground/60 uppercase">
            DreamTeam CRM
          </p>
          <h2 className="mt-4 max-w-md text-4xl leading-[1.1] font-black text-auth-panel-foreground">
            Run your school, not spreadsheets.
          </h2>
          <p className="mt-4 max-w-sm text-auth-panel-foreground/80">
            Everything your learning center needs, in one calm place.
          </p>

          <ul className="mt-9 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-auth-panel-foreground/90">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-auth-panel-foreground/10 text-auth-panel-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The Figma art runs the full width and lets the bottom crop it. */}
        <Image
          src="/auth/hero.png"
          alt=""
          width={780}
          height={572}
          priority
          className="mt-8 max-h-[46%] w-full object-contain object-bottom"
        />
      </div>
    </div>
  );
}
