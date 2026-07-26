"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAV, type NavItem } from "@/lib/nav";
import { useT } from "@/lib/i18n";
import { Logo, LogoMark, NavIcon } from "./icons";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

function isChildActive(item: NavItem, pathname: string) {
  return (item.children ?? []).some((c) => c.href === pathname);
}

// Taller rows + larger icons to match the Figma proportions.
const menuBtnCls = "h-10   gap-3 text-[15px] font-medium";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useT();

  // Groups open by default when they contain the active route.
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const item of NAV) {
      if (item.children && isChildActive(item, pathname)) init[item.label] = true;
    }
    return init;
  });

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center group-data-[collapsible=icon]:justify-center px-1 py-1 text-primary transition-all duration-200 hover:opacity-90"
        >
          {/* Full logo when sidebar is open, centered icon when collapsed */}
          <Logo className="h-8 w-auto group-data-[collapsible=icon]:hidden transition-opacity" />
          <LogoMark className="hidden h-8 w-8 shrink-0 group-data-[collapsible=icon]:block mx-auto transition-opacity" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAV.map((item) => {
                if (item.children) {
                  const childActive = isChildActive(item, pathname);
                  const isOpen = !!open[item.label];
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={childActive}
                        tooltip={item.label}
                        className={menuBtnCls}
                        onClick={() =>
                          setOpen((s) => ({ ...s, [item.label]: !s[item.label] }))
                        }
                      >
                        <NavIcon name={item.icon} className="size-5!" />
                        <span>{t(item.label)}</span>
                        <ChevronDown
                          className={`ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                      {isOpen && (
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                isActive={pathname === child.href}
                                render={<Link href={child.href} />}
                              >
                                {t(child.label)}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                const href = item.href!;
                const active = pathname === href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      className={menuBtnCls}
                      render={<Link href={href} />}
                    >
                      <NavIcon name={item.icon} className="size-5!" />
                      <span>{t(item.label)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
