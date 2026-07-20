import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";

// shadcn Sidebar shell: provider manages collapse state (persisted via cookie),
// SidebarInset holds the sticky header + page content.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
