"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { LANGS } from "@/lib/langs";
import { useLang } from "@/lib/i18n";
import { NotificationPanel } from "@/components/notifications";
import { GlobalSearch } from "@/components/global-search";
import { TokenBadge } from "@/components/token-badge";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background px-4 md:px-6">
      <SidebarTrigger className="text-primary" />

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* Lang + notifications live in the bottom tab bar on mobile. */}
        <div className="hidden items-center gap-1 md:flex md:gap-2">
          <TokenBadge />
          <LangMenu />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Notifications"
                />
              }
            >
              <Bell className="text-primary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-95 overflow-hidden p-0">
              <NotificationPanel />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 hidden h-6! sm:block" />

        <AccountMenu />
      </div>
    </header>
  );
}

function AccountMenu() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const initials = (user?.fullName ?? user?.userName ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button aria-label="Account" className="rounded-full" />}
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-primary">
            {initials || <User className="size-5" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium">
            {user?.fullName ?? user?.userName ?? "Account"}
          </p>
          {user?.roles && user.roles.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {user.roles.join(", ")}
            </p>
          )}
        </div>
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User className="size-4" />
          {t("Profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="size-4" />
          {t("Sign out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  function toggle() {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const applyTheme = () => {
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.body.animate !== "function") {
      applyTheme();
      return;
    }

    // Browser-agnostic circular reveal (no View Transitions dependency):
    // cover the screen with the OLD background, switch the theme underneath,
    // then shrink the cover to a point at the centre — the new theme is
    // revealed through a circle growing outward from the middle.
    const oldBg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    applyTheme();

    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:${oldBg};`;
    document.body.appendChild(overlay);

    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const anim = overlay.animate(
      { clipPath: [`circle(${r}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`] },
      { duration: 600, easing: "ease-in-out" },
    );
    anim.finished.then(
      () => overlay.remove(),
      () => overlay.remove(),
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-primary"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}

export function LangMenu() {
  const { lang, setLang } = useLang();
  const current = LANGS.find((l) => l.code === lang)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-10 gap-2 bg-card font-semibold" />
        }
      >
        <current.Flag />
        {lang}
        <ChevronDown className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGS.map(({ code, label, Flag }) => (
          <DropdownMenuItem key={code} onClick={() => setLang(code)}>
            <Flag />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
