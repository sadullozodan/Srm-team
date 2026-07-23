// Turns the flat Payments and Expenses lists into the shapes the accounting
// overview draws: KPI totals, the monthly income/expense series, the
// paid/not-paid donut, and the per-group payment breakdown. All of it is
// derived client-side from the real `/api/Payments` and `/api/Expenses` rows.

import type { ExpenseDto, PaymentDto } from "@/lib/api/types";
import { MONTHS } from "@/lib/series";

/** A payment counts as settled once as much has been paid as was billed. */
export function isPaid(payment: PaymentDto) {
  return payment.amount > 0 && payment.paid >= payment.amount;
}

export interface PaymentTotals {
  amount: number;
  paid: number;
  notPaid: number;
}

export function paymentTotals(payments: PaymentDto[]): PaymentTotals {
  let amount = 0;
  let paid = 0;
  for (const payment of payments) {
    amount += payment.amount;
    paid += payment.paid;
  }
  return { amount, paid, notPaid: Math.max(0, amount - paid) };
}

export function expenseTotal(expenses: ExpenseDto[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export interface IncomeExpensePoint {
  month: string;
  income: number;
  expense: number;
}

/** Money collected vs money spent, month by month, within one calendar year. */
export function incomeExpenseSeries(
  payments: PaymentDto[],
  expenses: ExpenseDto[],
  year: number,
): IncomeExpensePoint[] {
  const income = new Array(12).fill(0);
  const expense = new Array(12).fill(0);

  for (const payment of payments) {
    const date = new Date(payment.date);
    if (!isNaN(date.getTime()) && date.getFullYear() === year) {
      income[date.getMonth()] += payment.paid;
    }
  }
  for (const item of expenses) {
    const date = new Date(item.date);
    if (!isNaN(date.getTime()) && date.getFullYear() === year) {
      expense[date.getMonth()] += item.amount;
    }
  }

  return MONTHS.map((month, index) => ({
    month,
    income: income[index],
    expense: expense[index],
  }));
}

/** Every year that has a payment or an expense, most recent first. */
export function activeYears(payments: PaymentDto[], expenses: ExpenseDto[]): number[] {
  const years = new Set<number>();
  const collect = (iso: string) => {
    const date = new Date(iso);
    if (!isNaN(date.getTime())) years.add(date.getFullYear());
  };
  payments.forEach((payment) => collect(payment.date));
  expenses.forEach((expense) => collect(expense.date));
  if (years.size === 0) years.add(new Date().getFullYear());
  return [...years].sort((a, b) => b - a);
}

export interface DonutSummary {
  paidCount: number;
  notPaidCount: number;
  paidAmount: number;
  notPaidAmount: number;
  total: number;
}

/** Split the invoices into settled and outstanding, by count and by money. */
export function donutSummary(payments: PaymentDto[]): DonutSummary {
  let paidCount = 0;
  let notPaidCount = 0;
  let paidAmount = 0;
  let notPaidAmount = 0;

  for (const payment of payments) {
    if (isPaid(payment)) {
      paidCount++;
      paidAmount += payment.paid;
    } else {
      notPaidCount++;
      notPaidAmount += Math.max(0, payment.amount - payment.paid);
    }
  }

  return {
    paidCount,
    notPaidCount,
    paidAmount,
    notPaidAmount,
    total: payments.length,
  };
}

export interface GroupStudentRow {
  id: string;
  name: string;
  paid: number;
  owed: number;
  paidInFull: boolean;
}

export interface GroupBreakdown {
  group: string;
  students: number;
  notPaid: number;
  total: number;
  notPaidTotal: number;
  rows: GroupStudentRow[];
}

/** One accordion row per group, with its students nested inside. */
export function groupBreakdown(payments: PaymentDto[]): GroupBreakdown[] {
  const byGroup = new Map<string, GroupBreakdown>();

  for (const payment of payments) {
    const group = payment.groupName ?? "No group";
    let entry = byGroup.get(group);
    if (!entry) {
      entry = { group, students: 0, notPaid: 0, total: 0, notPaidTotal: 0, rows: [] };
      byGroup.set(group, entry);
    }

    const paidInFull = isPaid(payment);
    const owed = Math.max(0, payment.amount - payment.paid);

    entry.students++;
    entry.total += payment.amount;
    if (!paidInFull) {
      entry.notPaid++;
      entry.notPaidTotal += owed;
    }
    entry.rows.push({
      id: payment.id,
      name: payment.studentName ?? "—",
      paid: payment.paid,
      owed,
      paidInFull,
    });
  }

  return [...byGroup.values()].sort((a, b) => b.total - a.total);
}
