import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";

// shadcn Sidebar shell: provider manages collapse state (persisted via cookie),
// SidebarInset holds the sticky header + page content.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 px-4 py-5 pb-24 md:px-6 md:py-7 md:pb-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </SidebarInset>
      <MobileNav />
    </SidebarProvider>
  );
}
