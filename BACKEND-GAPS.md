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

Shaping lives in `src/lib/series.ts` and is covered by `npm run check:api`.

## Missing

### 1. Today's absent students, and why

The table under the Present/Absent/Late pills lists real students from
`GET /api/Students`, but it cannot filter them to *today's absentees* and the
Reason column is always empty — nothing returns a student and an absence reason
together, and `GET /api/Journal/lessons/{lessonId}/attendance` needs a lesson id
the dashboard has not got.

```
GET /api/Dashboard/absentees?date=2024-08-28
→ [{ studentId, studentName, groupId, groupName, phones: string[], reason }]
```

### 2. Left courses per month

Powers the bar chart. `EnrollmentStatus.Left` exists but there is no
enrollments list endpoint, and nothing records *when* a status changed.

```
GET /api/Dashboard/left-courses?year=2024
→ [{ month: 1..12, left, returned }]
```

### 3. Notifications

The bell panel and the mobile Notification tab are display-only.

```
GET /api/Notifications
→ [{ id, from, text, sentAt, read }]
```

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
  and the month/year steppers are local state and filter nothing.
