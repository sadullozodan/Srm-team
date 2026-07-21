// ponytail: the one check — the maths behind the dashboard charts. Pure, no
// network: the API layer is covered by the login screen actually working.
//   npm run check
import assert from "node:assert/strict";
import type { DashboardStatsDto, GroupDto, LeadDto, PaymentDto } from "./api/types.ts";
import {
  collectionRate,
  enrollSeries,
  incomeDelta,
  leadsSeries,
  monthIndex,
} from "./series.ts";

// registerMonth is free text, so every shape it might arrive in must land.
assert.equal(monthIndex("2024-06-01"), 5, "iso date");
assert.equal(monthIndex("2024-06-30T22:00:00Z"), 5, "iso date-time, no timezone shift");
assert.equal(monthIndex("June"), 5, "month name");
assert.equal(monthIndex("jun"), 5, "short month, lower case");
assert.equal(monthIndex("nonsense"), null, "unreadable");
assert.equal(monthIndex(null), null, "missing");

const leads = [
  { registerMonth: "June" },
  { registerMonth: "2024-06-20" },
  { registerMonth: "???" },
] as LeadDto[];
assert.equal(leadsSeries(leads)[5].value, 2, "two readable leads in June");
assert.equal(leadsSeries(leads).length, 12, "always a full year");

const groups = [{ startDate: "2024-03-01", enrolledCount: 12 }] as GroupDto[];
assert.equal(enrollSeries(groups)[2].value, 12, "group enrolment lands in March");

const august = new Date(2024, 7, 15);
const payments = [
  { paid: 100, date: "2024-07-05" },
  { paid: 50, date: "2024-08-05" },
] as PaymentDto[];
assert.equal(incomeDelta(payments, august), -50, "half of last month");
assert.equal(incomeDelta([payments[1]], august), null, "no baseline, no percentage");

const stats = { incomeThisMonth: 12580, totalDebt: 1398 } as DashboardStatsDto;
assert.equal(collectionRate(stats), 90, "income against income + debt");

console.log("ok — dashboard series maths");
