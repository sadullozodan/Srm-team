// Typed API surface, one object per backend controller. Every list controller
// follows the same REST shape, so `crud()` builds the five standard operations
// and only the bespoke endpoints (auth, dashboard) are written by hand.

import { apiFetch, toQuery } from "./client";
import type {
  AbsenteeDto,
  AdvanceDto,
  AuthResponse,
  BranchDto,
  BudgetDto,
  CourseDto,
  DebtorDto,
  ExpenseDto,
  LeftCoursesPointDto,
  MentorLevelDto,
  NotificationDto,
  PositionWriteDto,
  SalaryDto,
  EnrollmentDto,
  CourseWriteDto,
  DailyAttendanceDto,
  DashboardStatsDto,
  EmployeeDto,
  EmployeeWriteDto,
  ForgotPasswordRequest,
  ResetPasswordByCodeRequest,
  GraduateDto,
  LeadDto,
  PaymentDto,
  GroupDto,
  GroupWriteDto,
  ListParams,
  PositionDto,
  LoginRequest,
  RegisterRequest,
  PagedResult,
  StudentDto,
  StudentWriteDto,
  UserProfileDto,
  AddLessonRequest,
  AttendanceRecordDto,
  CreateWeekRequest,
  JournalLessonDto,
  JournalWeekDto,
  SetAttendanceRequest,
  SetWeekResultRequest,
  WeekResultDto,
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

// Accounting. Every one of these is a plain paged list controller, so the
// pages under /accounting differ only in their columns. (`paymentsApi` is
// declared with the dashboard resources below — the income card reads it too.)
export const advancesApi = crud<AdvanceDto, unknown>("Advances");
export const budgetsApi = crud<BudgetDto, unknown>("Budgets");
export const debtorsApi = crud<DebtorDto, unknown>("Debtors");
export const expensesApi = crud<ExpenseDto, unknown>("Expenses");
export const salariesApi = crud<SalaryDto, unknown>("Salaries");

export const mentorLevelsApi = crud<MentorLevelDto, unknown>("MentorLevels");

// Read-only from the dashboard's point of view.
export const leadsApi = crud<LeadDto, unknown>("Leads");
export const paymentsApi = crud<PaymentDto, unknown>("Payments");
export const graduatesApi = crud<GraduateDto, unknown>("Graduates");

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
