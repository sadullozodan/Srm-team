# Graph Report - .  (2026-07-27)

## Corpus Check
- 130 files · ~63,916 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 862 nodes · 2179 edges · 53 communities (43 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.54)
- Token cost: 8,000 input · 2,500 output

## Community Hubs (Navigation)
- Dashboard Widgets
- Auth Screens & App Shell
- Course/Employee Edit Forms
- Accounting List Pages
- API Response Types
- API Resource Clients
- Icon Library & Catch-all Route
- TS Config References
- Administration Pages
- Sidebar & Navigation
- Auth Brand Panel
- Progressbook / Journal
- shadcn Component Aliases
- View Toggles & Avatar UI
- React Dep & Chart Component
- Students List & Left Courses
- Student Detail Activity
- ESLint/Tailwind Devdeps
- Group Edit Form
- UI Dependency Set
- Course Detail Page
- Employees List Page
- Accounting Panel & Charts
- Global Search
- Logo Mark & Notifications
- Student Edit & Photo Upload
- Tokens & Grant Panel
- Employee Profile Page
- Courses List Page
- Groups List Page
- Package Metadata
- AGENTS.md Code-style Rules
- Clients/Leads Page
- Group Detail Page
- AGENTS.md Project Structure
- Timetable Page
- Resource Table Abstraction
- Employee Positions Page
- Permissions Page
- Accounting Overview
- Backend Gaps: Write Endpoints
- Backend Gaps: Dashboard Data
- Base UI React Dep
- clsx Dep
- ESLint Config File
- Next.js Config
- next-themes Dep
- Recharts Dep
- TanStack Query Dep
- PostCSS Config
- Backend Gaps: Enrollment DTO

## God Nodes (most connected - your core abstractions)
1. `cn()` - 127 edges
2. `PanelHeader()` - 32 edges
3. `queryKeys` - 31 edges
4. `Panel()` - 29 edges
5. `Pill()` - 22 edges
6. `Button()` - 19 edges
7. `SearchField()` - 18 edges
8. `money()` - 17 edges
9. `useDebouncedSearch()` - 17 edges
10. `Filters()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `create-next-app bootstrap` --conceptually_related_to--> `Project structure (folder-per-page routing)`  [AMBIGUOUS]
  README.md → AGENTS.md
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `CLAUDE.md @AGENTS.md include` --references--> `Project structure (folder-per-page routing)`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `src/lib/api.ts axios instance (auth token + 401 retry)` --shares_data_with--> `GET /api/Dashboard/stats`  [INFERRED]
  AGENTS.md → BACKEND-GAPS.md
- `ChartContainer()` --references--> `react`  [EXTRACTED]
  src/components/ui/chart.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard widget data flow: mock fallback, live API, shaping** — backend_gaps_md_mock_dashboard, backend_gaps_md_sample_dashboard, backend_gaps_md_dashboard_stats_endpoint, backend_gaps_md_series_ts [INFERRED 0.85]
- **Proposed DTO/field enhancements to improve dashboard accuracy** — backend_gaps_md_enrollment_dto_enrolledat, backend_gaps_md_lead_dto_registermonth, backend_gaps_md_dashboard_stats_dto_target, backend_gaps_md_date_filters_gap [EXTRACTED 0.90]

## Communities (53 total, 10 thin omitted)

### Community 0 - "Dashboard Widgets"
Cohesion: 0.06
Nodes (63): Attendance, AttendancePanel(), Pill(), today(), AttendanceCard(), LeadsCard(), LeftCoursesCard(), AttendanceChart() (+55 more)

### Community 1 - "Auth Screens & App Shell"
Cohesion: 0.06
Nodes (41): AppLayout(), AuthTabs(), TABS, SCREENS, Step, LoginPage(), FieldName, FIELDS (+33 more)

### Community 2 - "Course/Employee Edit Forms"
Cohesion: 0.07
Nodes (33): Action(), FormActions(), FormError(), LabeledField(), NumberField(), PanelHeader(), PrimaryAction(), SectionTitle() (+25 more)

### Community 3 - "Accounting List Pages"
Cohesion: 0.17
Nodes (30): AvansPage(), STATUSES, tone, BudgetPage(), STATUSES, DebtorsPage(), STATUSES, CATEGORY_LABELS (+22 more)

### Community 4 - "API Response Types"
Cohesion: 0.06
Nodes (34): AdvanceStatus, AttendanceSummaryDto, ChangePasswordRequest, CreateWeekRequest, DebtStatus, ExpenseCategory, ExpenseDto, GraduateStatus (+26 more)

### Community 5 - "API Resource Clients"
Cohesion: 0.06
Nodes (32): advancesApi, budgetsApi, debtorsApi, expensesApi, graduatesApi, graduatesFullApi, jobsApi, logsApi (+24 more)

### Community 6 - "Icon Library & Catch-all Route"
Cohesion: 0.10
Nodes (27): Page(), Accounting(), Administration(), base(), Branches(), Courses(), Employees(), FlagRU() (+19 more)

### Community 7 - "TS Config References"
Cohesion: 0.07
Nodes (29): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+21 more)

### Community 8 - "Administration Pages"
Cohesion: 0.16
Nodes (19): LogsPage(), RolesPage(), UsersPage(), BranchesPage(), STATUSES, JobsPage(), STATUSES, Pill() (+11 more)

### Community 9 - "Sidebar & Navigation"
Cohesion: 0.13
Nodes (25): AppSidebar(), isChildActive(), Header(), MobileNav(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps (+17 more)

### Community 10 - "Auth Brand Panel"
Cohesion: 0.10
Nodes (18): FEATURES, AccountMenu(), LangMenu(), ThemeToggle(), Logo(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+10 more)

### Community 11 - "Progressbook / Journal"
Cohesion: 0.09
Nodes (22): AttendanceCell(), fmtLessonDate(), lessonDateFmt, ResultCells(), STATUSES, statusStyle, Student, WeekBlock() (+14 more)

### Community 12 - "shadcn Component Aliases"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 13 - "View Toggles & Avatar UI"
Cohesion: 0.12
Nodes (21): ViewToggle(), ViewToggle(), TabButton(), ViewToggle(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+13 more)

### Community 14 - "React Dep & Chart Component"
Cohesion: 0.14
Nodes (17): react, react, ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent() (+9 more)

### Community 15 - "Students List & Left Courses"
Cohesion: 0.19
Nodes (12): LeftRow, fullName(), GridView(), ListView(), statusVariant, Select(), Table(), TableBody() (+4 more)

### Community 16 - "Student Detail Activity"
Cohesion: 0.14
Nodes (14): ActivitySection(), contractVariant, enrollmentVariant, formatDate(), formatEndDate(), fullName(), GroupsSection(), statusVariant (+6 more)

### Community 17 - "ESLint/Tailwind Devdeps"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 18 - "Group Edit Form"
Cohesion: 0.19
Nodes (13): FormState, GroupForm(), splitDays(), STATUSES, toApiTime(), toInputTime(), toState(), toWriteDto() (+5 more)

### Community 19 - "UI Dependency Set"
Cohesion: 0.13
Nodes (15): class-variance-authority, lucide-react, next, dependencies, class-variance-authority, lucide-react, next, react-dom (+7 more)

### Community 20 - "Course Detail Page"
Cohesion: 0.23
Nodes (11): CourseDetailPage(), money(), numberFmt, statusVariant, dateFmt, dateRange(), ProgressbookPage(), Badge() (+3 more)

### Community 21 - "Employees List Page"
Cohesion: 0.17
Nodes (10): fullName(), GridView(), ListView(), POSITION_TONES, positionsOf(), STATUSES, OutlineAction(), FormState (+2 more)

### Community 22 - "Accounting Panel & Charts"
Cohesion: 0.15
Nodes (10): CustomTooltipPayloadItem, CustomTooltipProps, IncomeExpenseChart(), IncomeExpenseChartProps, IncomeExpenseItem, MOCK_INCOME_EXPENSE_DATA, MOCK_PAYMENT_DATA, PaymentSegment (+2 more)

### Community 23 - "Global Search"
Cohesion: 0.17
Nodes (13): GlobalSearch(), Section, SECTIONS, searchApi, GlobalSearchResultDto, SearchHit, DICT, Entry (+5 more)

### Community 24 - "Logo Mark & Notifications"
Cohesion: 0.17
Nodes (10): LogoMark(), NotificationPanel(), timeAgo(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+2 more)

### Community 25 - "Student Edit & Photo Upload"
Cohesion: 0.20
Nodes (10): PhotoCard(), FormState, GENDERS, STATUSES, StudentForm(), toState(), studentsApi, Gender (+2 more)

### Community 26 - "Tokens & Grant Panel"
Cohesion: 0.20
Nodes (10): GrantPanel(), GRANTERS, GrantModal(), GrantTokensButton(), QUICK, useCanGrantTokens(), TokenBadge(), rewardsApi (+2 more)

### Community 27 - "Employee Profile Page"
Cohesion: 0.23
Nodes (7): EmployeeProfilePage(), formatDate(), fullName(), statusVariant, LIST_PARAMS, Skeleton(), employeesApi

### Community 28 - "Courses List Page"
Cohesion: 0.31
Nodes (7): CoursesPage(), money(), numberFmt, Button(), buttonVariants, Input(), coursesApi

### Community 29 - "Groups List Page"
Cohesion: 0.29
Nodes (9): dateFmt, dateRange(), duration(), GridView(), GroupsPage(), ListView(), STATUS_ORDER, statusVariant (+1 more)

### Community 30 - "Package Metadata"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, check, dev, lint, start (+1 more)

### Community 31 - "AGENTS.md Code-style Rules"
Cohesion: 0.22
Nodes (9): src/lib/api.ts axios instance (auth token + 401 retry), Code style rules, react-hook-form for every form, Missing GET /api/Dashboard/cashflow?year= endpoint, npm run check:api, Monthly income target on DashboardStatsDto (proposed), GET /api/Dashboard/stats, LeadDto.registerMonth (free-text date issue) (+1 more)

### Community 32 - "Clients/Leads Page"
Cohesion: 0.22
Nodes (6): tone, View, VIEWS, Tone, leadsApi, LeadType

### Community 33 - "Group Detail Page"
Cohesion: 0.25
Nodes (6): dateFmt, enrollmentVariant, fmtDate(), GroupDetailPage(), statusVariant, enrollmentsApi

### Community 34 - "AGENTS.md Project Structure"
Cohesion: 0.25
Nodes (8): src/lib/nav.ts sidebar navigation config, Page-specific components colocated with page.tsx, Project structure (folder-per-page routing), src/components/ shell and shared UI, CLAUDE.md @AGENTS.md include, create-next-app bootstrap, next/font with Geist font, Deploy on Vercel Platform

### Community 35 - "Timetable Page"
Cohesion: 0.29
Nodes (6): DAYS, hhmm(), LessonCard(), timetableApi, DayName, ScheduleEntryDto

### Community 36 - "Resource Table Abstraction"
Cohesion: 0.38
Nodes (7): ResourceTableProps, ListApi, CrudApi, PermissionParams, ListParams, LogParams, PagedResult

### Community 37 - "Employee Positions Page"
Cohesion: 0.29
Nodes (4): LIST_PARAMS, Field(), positionsApi, PositionDto

### Community 38 - "Permissions Page"
Cohesion: 0.33
Nodes (5): PermissionPage(), permissionsApi, rolesFullApi, PermissionDto, RoleDto

### Community 39 - "Accounting Overview"
Cohesion: 0.40
Nodes (3): AccountingPage(), SECTIONS, Panel()

### Community 40 - "Backend Gaps: Write Endpoints"
Cohesion: 0.67
Nodes (3): src/app/(app)/accounting/parts.tsx paged-list scaffold, No date-range filters on list endpoints, Accounting write endpoints unwired (UI-only gap)

## Ambiguous Edges - Review These
- `Project structure (folder-per-page routing)` → `create-next-app bootstrap`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Project structure (folder-per-page routing)` and `create-next-app bootstrap`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `View Toggles & Avatar UI` to `Dashboard Widgets`, `Auth Screens & App Shell`, `Course/Employee Edit Forms`, `Accounting List Pages`, `Icon Library & Catch-all Route`, `Administration Pages`, `Sidebar & Navigation`, `Auth Brand Panel`, `Progressbook / Journal`, `React Dep & Chart Component`, `Students List & Left Courses`, `Group Edit Form`, `Course Detail Page`, `Employees List Page`, `Global Search`, `Logo Mark & Notifications`, `Student Edit & Photo Upload`, `Tokens & Grant Panel`, `Employee Profile Page`, `Courses List Page`, `Groups List Page`, `Permissions Page`, `Accounting Overview`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Why does `react` connect `React Dep & Chart Component` to `Sidebar & Navigation`, `UI Dependency Set`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `dependencies` connect `UI Dependency Set` to `Base UI React Dep`, `clsx Dep`, `next-themes Dep`, `React Dep & Chart Component`, `Recharts Dep`, `TanStack Query Dep`, `Package Metadata`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Widgets` be split into smaller, more focused modules?**
  _Cohesion score 0.05759493670886076 - nodes in this community are weakly interconnected._
- **Should `Auth Screens & App Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.06493506493506493 - nodes in this community are weakly interconnected._