import { AccountingPanel } from "@/components/accounting/accounting-panel";

// The accounting overview is the mrtazo dashboard panel, now wired to the real
// backend: KPI totals, the income/expense chart, the paid/not-paid donut and
// the per-group breakdown are all derived from /api/Payments and /api/Expenses.
export default function AccountingPage() {
  return <AccountingPanel />;
}
