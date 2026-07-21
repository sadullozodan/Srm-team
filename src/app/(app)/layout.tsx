import { AppShell } from "@/components/app-shell";

// Every page in this group renders inside the OMUZ shell (sidebar, header,
// mobile tab bar). Routes outside the group — login, for example — will not.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
