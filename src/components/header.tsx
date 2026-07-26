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
    <header className="sticky top-0 z-30 flex h-17 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl md:px-6">
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
    // Element.animate is the reliable path here: animating a registered custom
    // property inside mask-image (the previous approach) does not repaint the
    // mask, so the circle never appeared. clip-path interpolates properly and
    // stays on the compositor.
    if (reduce || typeof document.body.animate !== "function") {
      applyTheme();
      return;
    }

    // Paint the wipe in the colour the page is ABOUT to become. Flip the theme
    // class, read the token, flip back — all in one frame, so nothing repaints
    // and the user sees no flash. Read --background rather than body's computed
    // backgroundColor: body paints its wash through the `background` shorthand,
    // which resets background-color to transparent.
    const wasDark = root.classList.contains("dark");
    root.classList.toggle("dark", next === "dark");
    const nextBg =
      getComputedStyle(root).getPropertyValue("--background").trim() || "#ffffff";
    root.classList.toggle("dark", wasDark);

    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const wipe = document.createElement("div");
    wipe.style.cssText =
      `position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:${nextBg};` +
      `clip-path:circle(0px at ${x}px ${y}px);`;
    document.body.appendChild(wipe);

    const remove = () => wipe.remove();
    // Safety net: never leave the overlay on screen if a promise never settles.
    const failsafe = window.setTimeout(remove, 1600);

    const grow = wipe.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      { duration: 420, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
    );

    grow.finished
      .then(() => {
        // Screen is fully covered — swap the theme behind the cover, then hand
        // the new page over with a short fade instead of a hard cut.
        applyTheme();
        return wipe.animate({ opacity: [1, 0] }, { duration: 180, easing: "ease-out", fill: "forwards" })
          .finished;
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(failsafe);
        remove();
      });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-card/70 text-primary shadow-[0_8px_22px_rgb(31_37_60_/_0.08)] ring-1 ring-border/70 hover:bg-primary hover:text-primary-foreground dark:shadow-[0_10px_28px_rgb(0_0_0_/_0.22)]"
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
