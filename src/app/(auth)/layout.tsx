import Image from "next/image";
import { CalendarCheck, Coins, Wallet } from "lucide-react";
import { Logo } from "@/components/icons";
import { LangMenu, ThemeToggle } from "@/components/header";

// Split auth shell: form column on the left, product visual on the right.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh grid-cols-1 overflow-hidden bg-background lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)]">
      <div className="flex min-h-dvh flex-col px-5 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between gap-4">
          <Logo priority />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LangMenu />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-[27.5rem] duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
            {children}
          </div>
        </div>
      </div>

      <BrandPanel />
    </div>
  );
}

const FEATURES = [
  { icon: CalendarCheck, label: "Attendance", text: "Daily marks stay visible" },
  { icon: Wallet, label: "Payments", text: "Cashflow is easy to read" },
  { icon: Coins, label: "Tokens", text: "Rewards stay connected" },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden rounded-[1.35rem] bg-auth-panel text-auth-panel-foreground lg:m-4 lg:ml-0 lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(88%_68%_at_17%_7%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_62%),linear-gradient(150deg,rgba(255,255,255,0.24),transparent_45%)] dark:bg-[radial-gradient(88%_68%_at_17%_7%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_62%),linear-gradient(150deg,rgba(255,255,255,0.07),transparent_45%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
        aria-hidden
      />

      <div className="relative flex h-full min-h-dvh flex-col px-10 pt-12 xl:px-14">
        <div className="max-w-xl delay-100 duration-700 animate-in fade-in slide-in-from-left-6 fill-mode-both motion-reduce:animate-none">
          <h2 className="max-w-lg text-4xl leading-[1.04] font-black tracking-[-0.035em] text-auth-panel-foreground xl:text-5xl">
            Run lessons, payments and staff from one calm desk.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-auth-panel-foreground/76">
            OMUZ keeps the school day readable: groups, attendance, money and rewards stay in sync without extra spreadsheets.
          </p>

          <ul className="mt-8 grid grid-cols-3 gap-3">
            {FEATURES.map(({ icon: Icon, label, text }) => (
              <li
                key={label}
                className="rounded-2xl border border-auth-panel-foreground/10 bg-white/16 p-4 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.22)] backdrop-blur dark:bg-white/[0.055]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-auth-panel-foreground/10 text-auth-panel-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="mt-4 block text-sm font-bold">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-auth-panel-foreground/68">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative -mx-8 mt-auto min-h-[350px] flex-1 xl:-mx-12">
          <div className="absolute right-8 bottom-0 left-8 h-[68%] rounded-t-[2rem] bg-white/24 blur-3xl dark:bg-primary/10" />
          <Image
            src="/auth/hero.png"
            alt="Graduation cap and progress chart illustration"
            width={780}
            height={572}
            priority
            className="absolute inset-x-0 bottom-0 mx-auto max-h-full w-[min(94%,860px)] object-contain object-bottom drop-shadow-[0_34px_70px_rgb(18_24_38_/_0.24)]"
          />
        </div>
      </div>
    </aside>
  );
}
