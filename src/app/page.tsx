import { redirect } from "next/navigation";

// "/" is not a page of its own — every page lives in its own folder, so the
// root just sends you to the dashboard.
export default function RootPage() {
  redirect("/dashboard");
}
