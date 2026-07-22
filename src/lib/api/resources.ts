// Typed API surface, one object per backend controller. Every list controller
// follows the same REST shape, so `crud()` builds the five standard operations
// and only the bespoke endpoints (auth, dashboard) are written by hand.

import { apiFetch, toQuery } from "./client";
import type {
  AuthResponse,
  BranchDto,
  BranchWriteDto,
  CourseDto,
  EnrollmentDto,
  CourseWriteDto,
  DashboardStatsDto,
  EmployeeDto,
  EmployeeWriteDto,
  GraduateDto,
  GraduateWriteDto,
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
  TokenAccountDto,
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
export const branchesApi = crud<BranchDto, BranchWriteDto>("Branches");
export const positionsApi = crud<PositionDto, unknown>("Positions");

// Read-only from the dashboard's point of view.
export const leadsApi = crud<LeadDto, unknown>("Leads");
export const paymentsApi = crud<PaymentDto, unknown>("Payments");
export const graduatesApi = crud<GraduateDto, GraduateWriteDto>("Graduates");

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
};

export const dashboardApi = {
  stats: () => apiFetch<DashboardStatsDto>("/api/Dashboard/stats"),
};

// Coins/tokens — a student's balance (role-based; only students have an account).
export const tokensApi = {
  me: () => apiFetch<TokenAccountDto>("/api/Tokens/me"),
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
  list: (resource: string, params?: ListParams) =>
    params ? ([resource, "list", params] as const) : ([resource, "list"] as const),
  detail: (resource: string, id: string) => [resource, "detail", id] as const,
};
