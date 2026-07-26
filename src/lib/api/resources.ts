// Typed API surface, one object per backend controller. Every list controller
// follows the same REST shape, so `crud()` builds the five standard operations
// and only the bespoke endpoints (auth, dashboard) are written by hand.

import { apiFetch, toQuery } from "./client";
import type {
  AbsenteeDto,
  AddLessonRequest,
  AdvanceDto,
  AdvanceWriteDto,
  AttendanceRecordDto,
  AuthResponse,
  BranchDto,
  BudgetDto,
  BudgetWriteDto,
  CourseDto,
  CourseWriteDto,
  CreateWeekRequest,
  DailyAttendanceDto,
  DashboardStatsDto,
  DebtorDto,
  DebtorWriteDto,
  EmployeeDto,
  EmployeeWriteDto,
  EnrollmentDto,
  ExpenseDto,
  ExpenseWriteDto,
  ForgotPasswordRequest,
  GraduateDto,
  GraduateWriteDto,
  GroupDto,
  GroupWriteDto,
  JobDto,
  JobWriteDto,
  JournalLessonDto,
  JournalWeekDto,
  LeadDto,
  LeadWriteDto,
  LeftCoursesPointDto,
  ListParams,
  LoginRequest,
  MentorLevelDto,
  NotificationDto,
  PagedResult,
  PaymentDto,
  PaymentWriteDto,
  PermissionDto,
  PermissionWriteDto,
  PositionDto,
  PositionWriteDto,
  RegisterRequest,
  ResetPasswordByCodeRequest,
  RoleDto,
  RoleWriteDto,
  SalaryDto,
  SalaryWriteDto,
  ScheduleEntryDto,
  ScheduleEntryWriteDto,
  SendSmsRequest,
  SetAttendanceRequest,
  SetWeekResultRequest,
  SmsMailingDto,
  SmsTemplateDto,
  SmsTemplateWriteDto,
  StudentDto,
  StudentWriteDto,
  TokenAccountDto,
  UserDto,
  UserProfileDto,
  WeekResultDto,
  RewardDto,
  LogDto,
  LogParams,
  RolePermissionsDto,
  GlobalSearchResultDto,
  ProfileDto,
  UpdateProfileRequest,
  MonthlyIncomeDto,
  IncomeByCourseDto,
  IncomeByBranchDto,
  StudentOverviewDto,
  GroupOverviewDto,
} from "./types";

export interface CrudApi<TDto, TWrite> {
  key: string;
  list: (params?: ListParams) => Promise<PagedResult<TDto>>;
  get: (id: string) => Promise<TDto>;
  create: (body: TWrite) => Promise<TDto>;
  update: (id: string, body: TWrite) => Promise<TDto>;
  remove: (id: string) => Promise<void>;
}

function crud<TDto, TWrite>(resource: string): CrudApi<TDto, TWrite> {
  const base = `/api/${resource}`;
  return {
    key: resource,
    list: (params = {}) =>
      apiFetch<PagedResult<TDto>>(
        `${base}${toQuery(params as Record<string, string | number | undefined | null>)}`
      ),
    get: (id) => apiFetch<TDto>(`${base}/${id}`),
    create: (body) => apiFetch<TDto>(base, { method: "POST", json: body }),
    update: (id, body) => apiFetch<TDto>(`${base}/${id}`, { method: "PUT", json: body }),
    remove: (id) => apiFetch<void>(`${base}/${id}`, { method: "DELETE" }),
  };
}

export const studentsApi = crud<StudentDto, StudentWriteDto>("Students");
export const groupsApi = crud<GroupDto, GroupWriteDto>("Groups");
export const employeesApi = crud<EmployeeDto, EmployeeWriteDto>("Employees");
export const coursesApi = crud<CourseDto, CourseWriteDto>("Courses");
export const branchesApi = crud<BranchDto, unknown>("Branches");
export const positionsApi = crud<PositionDto, PositionWriteDto>("Positions");
export const mentorLevelsApi = crud<MentorLevelDto, unknown>("MentorLevels");

// Accounting + module resources. Each is a plain paged list controller.
// (`paymentsApi` is read by the dashboard income card too.)
export const leadsApi = crud<LeadDto, LeadWriteDto>("Leads");
export const paymentsApi = crud<PaymentDto, PaymentWriteDto>("Payments");
export const debtorsApi = crud<DebtorDto, DebtorWriteDto>("Debtors");
export const budgetsApi = crud<BudgetDto, BudgetWriteDto>("Budgets");
export const expensesApi = crud<ExpenseDto, ExpenseWriteDto>("Expenses");
export const salariesApi = crud<SalaryDto, SalaryWriteDto>("Salaries");
export const advancesApi = crud<AdvanceDto, AdvanceWriteDto>("Advances");
export const graduatesApi = crud<GraduateDto, GraduateWriteDto>("Graduates");
export const jobsApi = crud<JobDto, JobWriteDto>("Jobs");
export const timetableApi = crud<ScheduleEntryDto, ScheduleEntryWriteDto>("Timetable");
export const permissionsApi = crud<PermissionDto, PermissionWriteDto>("Permissions");
export const rolesApi = crud<RoleDto, RoleWriteDto>("Roles");
export const smsTemplatesApi = crud<SmsTemplateDto, SmsTemplateWriteDto>("SmsTemplates");

// SMS mailings: send + read-only history.
export const smsApi = {
  history: (params: ListParams = {}) =>
    apiFetch<PagedResult<SmsMailingDto>>(`/api/SmsMailings/history${toQuery(params as Record<string, string | number | undefined | null>)}`),
  send: (body: SendSmsRequest) =>
    apiFetch<SmsMailingDto>("/api/SmsMailings/send", { method: "POST", json: body }),
};

// Users are managed (list/get/delete) with dedicated role/status/password actions.
export const usersApi = {
  list: (params: ListParams = {}) =>
    apiFetch<PagedResult<UserDto>>(`/api/Users${toQuery(params as Record<string, string | number | undefined | null>)}`),
  get: (id: string) => apiFetch<UserDto>(`/api/Users/${id}`),
  remove: (id: string) => apiFetch<void>(`/api/Users/${id}`, { method: "DELETE" }),
  setRoles: (id: string, roles: string[]) =>
    apiFetch<UserDto>(`/api/Users/${id}/roles`, { method: "PUT", json: { roles } }),
  setStatus: (id: string, status: string) =>
    apiFetch<UserDto>(`/api/Users/${id}/status`, { method: "PUT", json: { status } }),
  resetPassword: (id: string, newPassword: string) =>
    apiFetch<void>(`/api/Users/${id}/reset-password`, { method: "POST", json: { newPassword } }),
};

// Enrollments are addressed by student or group, not a flat list.
export const enrollmentsApi = {
  byStudent: (studentId: string) =>
    apiFetch<EnrollmentDto[]>(`/api/Enrollments/student/${studentId}`),
  byGroup: (groupId: string) =>
    apiFetch<EnrollmentDto[]>(`/api/Enrollments/group/${groupId}`),
};

export const authApi = {
  login: (body: LoginRequest) =>
    apiFetch<AuthResponse>("/api/Auth/login", { method: "POST", json: body }),
  register: (body: RegisterRequest) =>
    apiFetch<AuthResponse>("/api/Auth/register", { method: "POST", json: body }),
  me: () => apiFetch<UserProfileDto>("/api/Auth/me"),
  // Password recovery by SMS code: request one, then reset with it.
  forgotPassword: (body: ForgotPasswordRequest) =>
    apiFetch<void>("/api/Auth/forgot-password", { method: "POST", json: body }),
  resetPassword: (body: ResetPasswordByCodeRequest) =>
    apiFetch<void>("/api/Auth/reset-password", { method: "POST", json: body }),
};

export const dashboardApi = {
  stats: () => apiFetch<DashboardStatsDto>("/api/Dashboard/stats"),
  // month is 1-12, as the API counts them.
  attendance: (year: number, month: number) =>
    apiFetch<DailyAttendanceDto[]>(
      `/api/Dashboard/attendance${toQuery({ year, month })}`,
    ),
  // date is a plain yyyy-mm-dd day, not a timestamp.
  absentees: (date: string) =>
    apiFetch<AbsenteeDto[]>(`/api/Dashboard/absentees${toQuery({ date })}`),
  leftCourses: (year: number) =>
    apiFetch<LeftCoursesPointDto[]>(
      `/api/Dashboard/left-courses${toQuery({ year })}`,
    ),
};

export const notificationsApi = {
  list: (params: ListParams = {}) =>
    apiFetch<PagedResult<NotificationDto>>(
      `/api/Notifications${toQuery(params as Record<string, string | number | undefined | null>)}`,
    ),
  unreadCount: () => apiFetch<number>("/api/Notifications/unread-count"),
  markRead: (id: string) =>
    apiFetch<void>(`/api/Notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () =>
    apiFetch<void>("/api/Notifications/read-all", { method: "PUT" }),
};

// Journal is a nested tree (group → weeks → lessons → attendance) edited in place.
export const journalApi = {
  byGroup: (groupId: string) =>
    apiFetch<JournalWeekDto[]>(`/api/Journal/group/${groupId}`),
  addWeek: (groupId: string, body: CreateWeekRequest) =>
    apiFetch<JournalWeekDto>(`/api/Journal/group/${groupId}/weeks`, {
      method: "POST",
      json: body,
    }),
  addLesson: (weekId: string, body: AddLessonRequest) =>
    apiFetch<JournalLessonDto>(`/api/Journal/weeks/${weekId}/lessons`, {
      method: "POST",
      json: body,
    }),
  setAttendance: (lessonId: string, body: SetAttendanceRequest) =>
    apiFetch<AttendanceRecordDto>(`/api/Journal/lessons/${lessonId}/attendance`, {
      method: "PUT",
      json: body,
    }),
  setWeekResult: (weekId: string, body: SetWeekResultRequest) =>
    apiFetch<WeekResultDto>(`/api/Journal/weeks/${weekId}/results`, {
      method: "PUT",
      json: body,
    }),
  deleteWeek: (weekId: string) =>
    apiFetch<void>(`/api/Journal/weeks/${weekId}`, { method: "DELETE" }),
};

// ---- Level-up modules (testchaos) ----
export const graduatesFullApi = crud<GraduateDto, unknown>("Graduates");
export const rewardsApi = crud<RewardDto, unknown>("Rewards");

export const smsMailingsApi = {
  key: "SmsMailings",
  list: (params: ListParams = {}) =>
    apiFetch<PagedResult<SmsMailingDto>>(
      `/api/SmsMailings/history${toQuery(params as Record<string, string | number | undefined | null>)}`,
    ),
  send: (body: unknown) => apiFetch<SmsMailingDto>("/api/SmsMailings/send", { method: "POST", json: body }),
};

export const logsApi = {
  key: "Logs",
  list: (params: LogParams = {}) =>
    apiFetch<PagedResult<LogDto>>(
      `/api/Logs${toQuery(params as Record<string, string | number | undefined | null>)}`,
    ),
};

export const rolesFullApi = {
  ...crud<RoleDto, unknown>("Roles"),
  getPermissions: (id: string) => apiFetch<RolePermissionsDto>(`/api/Roles/${id}/permissions`),
  setPermissions: (id: string, permissionIds: string[]) =>
    apiFetch<RolePermissionsDto>(`/api/Roles/${id}/permissions`, {
      method: "PUT",
      json: { permissionIds },
    }),
};

export const searchApi = {
  search: (q: string) => apiFetch<GlobalSearchResultDto>(`/api/Search${toQuery({ q, limit: 5 })}`),
};

export const profileApi = {
  get: () => apiFetch<ProfileDto>("/api/Profile"),
  update: (body: UpdateProfileRequest) => apiFetch<ProfileDto>("/api/Profile", { method: "PUT", json: body }),
};

export const reportsApi = {
  incomeByMonth: (year?: number) =>
    apiFetch<MonthlyIncomeDto[]>(`/api/Reports/income-by-month${toQuery({ year })}`),
  incomeByCourse: () => apiFetch<IncomeByCourseDto[]>("/api/Reports/income-by-course"),
  incomeByBranch: () => apiFetch<IncomeByBranchDto[]>("/api/Reports/income-by-branch"),
  csvUrl: (name: "students" | "payments" | "leads") => `/api/Reports/${name}.csv`,
};

export const tokensApi = {
  me: () => apiFetch<TokenAccountDto>("/api/Tokens/me"),
  grant: (body: { studentId: string; amount: number; reason?: string }) =>
    apiFetch<TokenAccountDto>("/api/Tokens/grant", { method: "POST", json: body }),
  studentBalance: (studentId: string) => apiFetch<TokenAccountDto>(`/api/Tokens/students/${studentId}`),
};

export const overviewApi = {
  student: (id: string) => apiFetch<StudentOverviewDto>(`/api/students/${id}/overview`),
  group: (id: string) => apiFetch<GroupOverviewDto>(`/api/groups/${id}/overview`),
};

interface PermissionParams extends ListParams {
  group?: string;
}

// Query-key helpers keep useQuery/invalidation consistent across the app.
export const queryKeys = {
  me: ["me"] as const,
  dashboard: ["dashboard", "stats"] as const,
  dashboardAttendance: (year: number, month: number) =>
    ["dashboard", "attendance", year, month] as const,
  dashboardAbsentees: (date: string) => ["dashboard", "absentees", date] as const,
  dashboardLeftCourses: (year: number) =>
    ["dashboard", "left-courses", year] as const,
  notifications: ["notifications"] as const,
  list: (resource: string, params?: ListParams) =>
    params ? ([resource, "list", params] as const) : ([resource, "list"] as const),
  detail: (resource: string, id: string) => [resource, "detail", id] as const,
};
