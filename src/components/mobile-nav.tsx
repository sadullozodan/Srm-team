"use client";

import { useState } from "react";
import { Bell, Globe, User } from "lucide-react";
import { LogoMark } from "./icons";
import { LANGS, type LangCode } from "@/lib/langs";
import { NotificationPanel } from "@/components/notifications";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const tabCls =
  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors";

export function MobileNav() {
  const { openMobile, setOpenMobile } = useSidebar();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lang, setLang] = useState<LangCode>("EN");

  return (
    <>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-2xl border border-border/70 bg-card/92 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_44px_rgb(21_25_38_/_0.14)] backdrop-blur-xl md:hidden">
        <button
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Menu"
          className={`${tabCls} ${openMobile ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <LogoMark className="h-6" />
          Omuz
        </button>

        <button
          onClick={() => setLangOpen(true)}
          className={`${tabCls} ${langOpen ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Globe className="size-6" />
          Lang
        </button>

        <button
          onClick={() => setNotifOpen(true)}
          className={`${tabCls} ${notifOpen ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Bell className="size-6" />
          Alerts
        </button>

        <button className={`${tabCls} text-muted-foreground hover:text-foreground`}>
          <User className="size-6" />
          Profile
        </button>
      </nav>

      <Sheet open={langOpen} onOpenChange={setLangOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-24">
          <SheetHeader>
            <SheetTitle>Language</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            {LANGS.map(({ code, label, Flag }) => (
              <label
                key={code}
                className="flex items-center gap-3 border-b py-4 text-base last:border-b-0"
              >
                <Flag width={28} height={20} />
                <span className="flex-1">{label}</span>
                <input
                  type="radio"
                  name="lang"
                  className="size-5 accent-primary"
                  checked={lang === code}
                  onChange={() => {
                    setLang(code);
                    setLangOpen(false);
                  }}
                />
              </label>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 pb-24">
          <SheetTitle className="sr-only">Notification</SheetTitle>
          <NotificationPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}
