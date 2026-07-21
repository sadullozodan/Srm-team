// ponytail: the one check. The maths runs offline; the network part proves the
// cached login and the auth interceptor still reach the live API.
//   npm run check:api
import assert from "node:assert/strict";
import {
  api,
  getStats,
  type DashboardStats,
  type Group,
  type Lead,
  type Payment,
} from "./api.ts";
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
] as Lead[];
assert.equal(leadsSeries(leads)[5].value, 2, "two readable leads in June");
assert.equal(leadsSeries(leads).length, 12, "always a full year");

const groups = [{ startDate: "2024-03-01", enrolledCount: 12 }] as Group[];
assert.equal(enrollSeries(groups)[2].value, 12, "group enrolment lands in March");

const august = new Date(2024, 7, 15);
const payments = [
  { paid: 100, date: "2024-07-05" },
  { paid: 50, date: "2024-08-05" },
] as Payment[];
assert.equal(incomeDelta(payments, august), -50, "half of last month");
assert.equal(incomeDelta([payments[1]], august), null, "no baseline, no percentage");

const stats = { incomeThisMonth: 12580, totalDebt: 1398 } as DashboardStats;
assert.equal(collectionRate(stats), 90, "income against income + debt");

console.log("ok — series maths");

// Live API from here down.
const live = await getStats();
assert.equal(typeof live.studentsCount, "number", "stats did not come back");
assert.ok(live.attendance, "attendance missing from stats");

// A second call must reuse the cached token instead of logging in again.
let logins = 0;

api.interceptors.request.use((config) => {
  if (config.url?.includes("Auth/login")) logins++;
  return config;
});

await getStats();
assert.equal(logins, 0, "logged in twice — the token cache is broken");

console.log("ok — auth interceptor works, students:", live.studentsCount);
