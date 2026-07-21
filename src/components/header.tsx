"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, ChevronDown, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { FlagUK } from "./icons";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGS = ["EN", "RU", "UZ"] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background px-4 md:px-6">
      <SidebarTrigger className="text-primary" />

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="h-11 rounded-full bg-card pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <LangMenu />

        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="text-primary" />
        </Button>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 hidden h-6! sm:block" />

        <AccountMenu />
      </div>
    </header>
  );
}

function AccountMenu() {
  const { user, logout } = useAuth();
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
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-primary"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}

function LangMenu() {
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-10 gap-2 bg-card font-semibold" />
        }
      >
        <FlagUK />
        {lang}
        <ChevronDown className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {LANGS.map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLang(l)}>
            <FlagUK />
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
