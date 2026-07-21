# Dashboard — missing backend

Everything the swagger can answer is fetched live. What is left below has no
endpoint at all and renders from `src/lib/mock-dashboard.ts`; each mock export
carries a `ponytail:` comment pointing at the matching section here.

(`src/lib/sample-dashboard.ts` is different — those are stand-ins for endpoints
that *do* exist, shown only while the API login fails. Delete that file once
there are working credentials.)

## Backed by the API

| Widget | Source |
| --- | --- |
| Students / Users / Employees tiles | `GET /api/Dashboard/stats` |
| Groups card + rows | `stats.groupsCount`, `stats.groups[]` |
| Present / Absent / Late pills | `stats.attendance` |
| Income in this month | `stats.incomeThisMonth` |
| Income vs last month | `GET /api/Payments` — `paid` summed per month |
| Collected ring | `stats.incomeThisMonth / (incomeThisMonth + totalDebt)` |
| Leads chart | `GET /api/Leads` — bucketed by `registerMonth` |
| Enroll chart | `GET /api/Groups` — `enrolledCount` by group `startDate` month |
| Enroll table | `GET /api/Students` |
| Employed graduates | `stats.employedGraduatesCount`, `GET /api/Graduates` |
| Attendance chart | `GET /api/Dashboard/attendance?year=&month=` |
| Today's absentees table | `GET /api/Dashboard/absentees?date=` |
| Left courses chart | `GET /api/Dashboard/left-courses?year=` |
| Notification bell | `GET /api/Notifications`, `PUT .../read`, `.../read-all` |

Shaping lives in `src/lib/series.ts` and is covered by `npm run check:api`.

## Accounting and employees

Every one of these is the same paged list controller (`Page`, `PageSize`,
`Search`, `Status`), so the pages share one scaffold in
`src/app/(app)/accounting/parts.tsx`.

| Page | Source |
| --- | --- |
| `/accounting` | `GET /api/Dashboard/stats` for the three totals |
| `/accounting/accountant` | `GET /api/Payments` + `/api/Expenses` + `/api/Budgets`, totalled client-side |
| `/accounting/net` | `GET /api/Payments` + `/api/Expenses`, merged into one ledger |
| `/accounting/payments` | `GET /api/Payments` |
| `/accounting/debtors` | `GET /api/Debtors` |
| `/accounting/budget` | `GET /api/Budgets` |
| `/accounting/expenses` | `GET /api/Expenses` |
| `/accounting/salary` | `GET /api/Salaries` |
| `/accounting/avans` | `GET /api/Advances` |
| `/employees/mentor-levels` | `GET /api/MentorLevels` |
| `/employees/positions` | `GET/POST/PUT/DELETE /api/Positions` |

## Missing

### 1. Cashflow totals

`/accounting/net` and `/accounting/accountant` total money per month
themselves, because `GET /api/Payments` and `GET /api/Expenses` are flat paged
lists with no aggregate and no date filter. Both pages therefore pull one wide
page (500 rows) and bucket it in `cashflowSeries` / `ledgerEntries`.

That is correct only while a year fits in 500 rows. One endpoint would remove
the guess and the over-fetch:

```
GET /api/Dashboard/cashflow?year=2024
→ [{ month: 1..12, income, expense, net }]
```

### 2. Write endpoints for accounting

Every accounting list is read-only in the UI. The controllers do have
`POST`/`PUT`/`DELETE`, but the Figma's create and edit dialogs were mock-only,
so nothing is wired to them yet — this is UI work, not a backend gap.

## Would improve what already works

- **`EnrollmentDto.enrolledAt`** — the Enroll chart currently counts a group's
  `enrolledCount` in the month the group starts, because no enrolment carries a
  date. With `enrolledAt` (plus a `GET /api/Enrollments` list) it becomes a true
  per-student series.
- **`LeadDto.registerMonth` as a real date** — it is a free-text string today,
  so `monthIndex()` in `series.ts` has to guess at "June" / "2024-06" / "jun".
  Any lead whose month is unreadable is dropped from the chart.
- **A monthly income target on `DashboardStatsDto`** — the ring shows collection
  rate (income vs income + debt) because there is nothing to measure against.
- **Date filters** — no list endpoint accepts a date range, so the date picker
  and the accounting month steppers are local state and filter nothing. The
  dashboard's attendance and left-courses steppers are the exception: those two
  endpoints take a period.
