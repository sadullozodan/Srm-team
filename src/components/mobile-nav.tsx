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
  "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium";

// Bottom tab bar, mobile only. The OMUZ tab drives the existing sidebar,
// which already renders as a Sheet under md.
export function MobileNav() {
  const { openMobile, setOpenMobile } = useSidebar();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  // ponytail: local until i18n exists — header's own picker is hidden on mobile.
  const [lang, setLang] = useState<LangCode>("EN");

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        <button
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Menu"
          className={`${tabCls} ${openMobile ? "text-primary" : "text-muted-foreground"}`}
        >
          <LogoMark className="size-6" />
          Omuz
        </button>

        <button
          onClick={() => setLangOpen(true)}
          className={`${tabCls} ${langOpen ? "text-primary" : "text-muted-foreground"}`}
        >
          <Globe className="size-6" />
          Lang
        </button>

        <button
          onClick={() => setNotifOpen(true)}
          className={`${tabCls} ${notifOpen ? "text-primary" : "text-muted-foreground"}`}
        >
          <Bell className="size-6" />
          Notification
        </button>

        {/* ponytail: profile panel not wired yet */}
        <button className={`${tabCls} text-muted-foreground`}>
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
