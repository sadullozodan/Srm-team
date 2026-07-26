// Types generated from the Revenge CRM API swagger (v1).
// Only the slices we currently use are hand-picked; extend as new modules land.

// ---- Enums (string enums on the wire) ----
export type Gender = "Male" | "Female";
export type StudentStatus = "Inactive" | "Active" | "Finished";
export type GroupStatus = "New" | "Started" | "Finished" | "Cancelled";
export type ActivationStatus = "Inactive" | "Active";
export type JobStatus = "Open" | "Closed";
export type GraduateStatus =
  | "OpenToWork"
  | "Work"
  | "Freelancer"
  | "Entrepreneur"
  | "FurtherEducation";
export type LeadType = "Lead" | "Client";
export type LeadOccupation = "Pupil" | "Employee" | "Graduate" | "Student";
export type EnrollmentStatus = "Active" | "Left" | "Transferred" | "Graduated";
export type ContractStatus = "None" | "Active" | "Expiring" | "Finished";

export type RoleType =
  | "SuperAdmin"
  | "Admin"
  | "Manager"
  | "Accountant"
  | "Mentor"
  | "Developer"
  | "Student";

// ---- Generic paging ----
// Every list endpoint (`GET /api/<Resource>`) returns this envelope.
export interface PagedResult<T> {
  items: T[] | null;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Shared query string accepted by every list endpoint.
export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: number;
}

// ---- Auth ----
// Login is by phone: the backend's LoginRequest field is `phone`, the same
// bare-digit shape registration stored.
export interface LoginRequest {
  phone: string;
  password: string;
}

// Registration is by phone now — no username, no full name.
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  birthDate?: string | null;
  address?: string | null;
  parentPhone?: string | null;
}

export interface ForgotPasswordRequest {
  phone: string;
}

// The code arrives by SMS; it is not returned by forgot-password.
export interface ResetPasswordByCodeRequest {
  phone: string;
  code: string;
  newPassword: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileDto {
  id: string;
  userName: string | null;
  fullName: string | null;
  roles: string[] | null;
  studentId: string | null;
  employeeId: string | null;
}

export interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string;
  user: UserProfileDto;
}

// ---- Dashboard ----
export interface AttendanceSummaryDto {
  present: number;
  absent: number;
  late: number;
}

export interface GroupCardDto {
  id: string;
  name: string | null;
  absent: number;
  late: number;
  income: number;
}

export interface DashboardStatsDto {
  studentsCount: number;
  usersCount: number;
  employeesCount: number;
  groupsCount: number;
  leadsCount: number;
  graduatesCount: number;
  employedGraduatesCount: number;
  incomeThisMonth: number;
  debtorsCount: number;
  totalDebt: number;
  attendance: AttendanceSummaryDto;
  groups: GroupCardDto[] | null;
}

// ---- Students ----
export interface StudentPhoneDto {
  number: string | null;
  label: string | null;
}

export interface StudentDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  birthDate: string | null;
  gender: Gender;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  telegramUsername: string | null;
  description: string | null;
  photoUrl: string | null;
  status: StudentStatus;
  branchId: string | null;
  branchName: string | null;
  phones: StudentPhoneDto[] | null;
  groups: string[] | null;
}

export interface StudentWriteDto {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  gender: Gender;
  address?: string | null;
  email?: string | null;
  phoneNumber: string;
  telegramUsername?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  status: StudentStatus;
  branchId?: string | null;
  phones?: StudentPhoneDto[] | null;
}

// ---- Groups ----
export interface GroupDto {
  id: string;
  name: string | null;
  courseId: string;
  courseName: string | null;
  branchId: string | null;
  branchName: string | null;
  startDate: string;
  endDate: string;
  requiredStudents: number;
  enrolledCount: number;
  status: GroupStatus;
  days: string | null;
  startTime: string | null;
  endTime: string | null;
  room: string | null;
  mentors: string[] | null;
}

export interface GroupWriteDto {
  name: string;
  courseId: string;
  branchId?: string | null;
  startDate: string;
  endDate: string;
  requiredStudents: number;
  status: GroupStatus;
  days?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  room?: string | null;
  mentorIds?: string[] | null;
}

// ---- Employees ----
export interface EmployeeDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  birthDate: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  telegramUsername: string | null;
  description: string | null;
  photoUrl: string | null;
  experience: number;
  hourRate: number | null;
  status: ActivationStatus;
  branchId: string | null;
  branchName: string | null;
  positions: string[] | null;
}

export interface EmployeeWriteDto {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
  telegramUsername?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  experience: number;
  hourRate?: number | null;
  status: ActivationStatus;
  branchId?: string | null;
  positionIds?: string[] | null;
}

// ---- Enrollments (a student's membership in a group) ----
export interface EnrollmentDto {
  id: string;
  studentId: string;
  studentName: string | null;
  studentPhone: string | null;
  groupId: string;
  groupName: string | null;
  status: EnrollmentStatus;
  hasAccount: boolean;
  contract: ContractStatus;
  contractEndDate: string | null;
  leftReason: string | null;
}

// ---- Journal / Progressbook ----
export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface AttendanceRecordDto {
  id: string;
  studentId: string;
  studentName: string | null;
  status: AttendanceStatus;
  score: number;
  comment: string | null;
}

export interface JournalLessonDto {
  id: string;
  date: string;
  topic: string | null;
  attendances: AttendanceRecordDto[] | null;
}

export interface WeekResultDto {
  id: string;
  studentId: string;
  studentName: string | null;
  bonus: number;
  exam: number;
  sum: number;
}

export interface JournalWeekDto {
  id: string;
  groupId: string;
  weekNumber: number;
  title: string | null;
  lessons: JournalLessonDto[] | null;
  results: WeekResultDto[] | null;
}

export interface CreateWeekRequest {
  weekNumber: number;
  title: string;
}

export interface AddLessonRequest {
  date: string;
  topic: string;
}

export interface SetAttendanceRequest {
  studentId: string;
  status: AttendanceStatus;
  score: number;
  comment?: string | null;
}

export interface SetWeekResultRequest {
  studentId: string;
  bonus: number;
  exam: number;
  sum: number;
}

// ---- Positions (employee job titles) ----
export interface PositionDto {
  id: string;
  name: string | null;
  color: string | null;
}

export interface PositionWriteDto {
  name: string;
  color?: string | null;
}

// ---- Branches ----
export interface BranchDto {
  id: string;
  title: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  status: ActivationStatus;
}

export interface BranchWriteDto {
  title: string;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  status: ActivationStatus;
}

// ---- Courses ----
export interface CourseDto {
  id: string;
  title: string | null;
  fee: number;
  durationMonths: number;
  logoUrl: string | null;
  description: string | null;
  groupsCount: number;
}

export interface CourseWriteDto {
  title: string;
  fee: number;
  durationMonths: number;
  logoUrl?: string | null;
  description?: string | null;
}

// ---- Tokens / coins (role-based: students earn coins) ----
export interface TokenAccountDto {
  studentId: string;
  studentName: string | null;
  balance: number;
}

// ---- Errors ----
export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  // ASP.NET model validation: field name → messages.
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

// ---- Leads ----
export interface LeadDto {
  id: string;
  fullName: string | null;
  phone: string | null;
  courseId: string | null;
  courseName: string | null;
  lessonTime: string | null;
  utmSource: string | null;
  occupation: LeadOccupation;
  // Free text, not a date: "June", "2024-06", "jun" have all been seen.
  registerMonth: string | null;
  notes: string | null;
  type: LeadType;
}

export interface LeadWriteDto {
  fullName: string;
  phone: string;
  courseId?: string | null;
  lessonTime?: string | null;
  utmSource?: string | null;
  occupation: LeadOccupation;
  registerMonth?: string | null;
  notes?: string | null;
  type: LeadType;
}

// ---- Jobs ----
export interface JobDto {
  id: string;
  title: string | null;
  company: string | null;
  description: string | null;
  location: string | null;
  salary: number | null;
  graduateId: string | null;
  status: JobStatus;
}

export interface JobWriteDto {
  title: string;
  company?: string | null;
  description?: string | null;
  location?: string | null;
  salary?: number | null;
  graduateId?: string | null;
  status: JobStatus;
}

// ---- Timetable / Schedule ----
export type LessonType = "Lecture" | "Practice" | "Exam";
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface ScheduleEntryDto {
  id: string;
  groupId: string;
  groupName: string | null;
  mentorId: string;
  mentorName: string | null;
  title: string | null;
  type: LessonType;
  day: DayOfWeek;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  room: string | null;
  color: string | null;
}

export interface ScheduleEntryWriteDto {
  groupId: string;
  mentorId: string;
  title: string;
  type: LessonType;
  day: DayOfWeek;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  room?: string | null;
  color?: string | null;
}

// ---- SMS ----
export type SmsTargetType = "Group" | "Students" | "Mentors" | "Leads" | "Graduates";

export interface SmsMailingDto {
  id: string;
  title: string | null;
  body: string | null;
  targetType: SmsTargetType;
  sentAt: string;
  recipientCount: number;
  recipients: string[] | null;
}

export interface SendSmsRequest {
  title: string;
  body: string;
  targetType: SmsTargetType;
  recipientIds?: string[] | null;
}

export interface SmsTemplateDto {
  id: string;
  title: string | null;
  body: string | null;
}

export interface SmsTemplateWriteDto {
  title: string;
  body: string;
}

// ---- Administration ----
export interface UserDto {
  id: string;
  fullName: string | null;
  userName: string | null;
  type: string | null;
  roles: string[] | null;
  status: ActivationStatus;
}

export interface PermissionDto {
  id: string;
  name: string | null;
  group: string | null;
}

export interface PermissionWriteDto {
  name: string;
  group?: string | null;
}

export interface RoleDto {
  id: string;
  name: string | null;
  type: RoleType;
  description: string | null;
}

export interface RoleWriteDto {
  name: string;
  type: RoleType;
  description?: string | null;
}

// ---- Accounting ----
export type PaymentStatus = "NotPaid" | "Active" | "Prepayment" | "Paid";
export type DebtStatus = "InProgress" | "Paid";
export type ExpenseCategory = "Tax" | "OfficeExpenses" | "Marketing" | "Employees" | "Other";
export type AdvanceStatus = "Pending" | "Approved" | "Denied" | "Done";

export interface PaymentDto {
  id: string;
  studentId: string;
  studentName: string | null;
  groupId: string | null;
  groupName: string | null;
  branchId: string | null;
  branchName: string | null;
  amount: number;
  paid: number;
  discount: number;
  date: string;
  status: PaymentStatus;
}

export interface AdvanceDto {
  id: string;
  employeeId: string;
  employeeName: string | null;
  year: number;
  month: number;
  amount: number;
  description: string | null;
  status: AdvanceStatus;
}

export interface BudgetDto {
  id: string;
  categoryName: string | null;
  fromDate: string;
  toDate: string;
  amountAllocated: number;
  amountSpent: number;
  branchId: string | null;
  branchName: string | null;
  status: ActivationStatus;
}

export interface DebtorDto {
  id: string;
  studentId: string;
  fullName: string | null;
  fromDate: string;
  toDate: string;
  totalDebtAmount: number;
  paymentPerMonth: number;
  totalPaidAmount: number;
  notes: string | null;
  status: DebtStatus;
}

export interface ExpenseDto {
  id: string;
  parentId: string | null;
  category: ExpenseCategory;
  name: string | null;
  amount: number;
  recipient: string | null;
  branchId: string | null;
  branchName: string | null;
  date: string;
  status: ActivationStatus;
}

export interface SalaryDto {
  id: string;
  employeeId: string;
  employeeName: string | null;
  total: number;
  prepaid: number;
  remaining: number;
  paid: number;
  year: number;
  month: number;
  status: ActivationStatus;
}

// ---- Mentor levels ----
export type MentorLevelType =
  | "Intern"
  | "Junior1"
  | "Junior2"
  | "Junior3"
  | "Middle1"
  | "Middle2"
  | "Middle3"
  | "Senior1"
  | "Senior2"
  | "Senior3";

export interface MentorLevelDto {
  id: string;
  employeeId: string;
  employeeName: string | null;
  year: number;
  month: number;
  level: MentorLevelType;
  hourRate: number;
}

export interface PaymentWriteDto {
  studentId: string;
  groupId?: string | null;
  branchId?: string | null;
  amount: number;
  paid: number;
  discount: number;
  date: string;
  status: PaymentStatus;
}

export interface DebtorWriteDto {
  studentId?: string | null;
  fullName: string;
  fromDate: string;
  toDate: string;
  totalDebtAmount: number;
  paymentPerMonth: number;
  totalPaidAmount: number;
  notes?: string | null;
  status: DebtStatus;
}

export interface BudgetWriteDto {
  categoryName: string;
  fromDate: string;
  toDate: string;
  amountAllocated: number;
  amountSpent: number;
  branchId?: string | null;
  status: ActivationStatus;
}

export interface ExpenseWriteDto {
  category: ExpenseCategory;
  name: string;
  amount: number;
  recipient?: string | null;
  branchId?: string | null;
  date: string;
  status: ActivationStatus;
}

export interface SalaryWriteDto {
  employeeId: string;
  total: number;
  prepaid: number;
  remaining: number;
  paid: number;
  year: number;
  month: number;
  status: ActivationStatus;
}

export interface AdvanceWriteDto {
  employeeId: string;
  year: number;
  month: number;
  amount: number;
  description?: string | null;
  status: AdvanceStatus;
}

// ---- Graduates ----
export interface GraduateDto {
  id: string;
  studentId: string;
  studentName: string | null;
  groupId: string | null;
  groupName: string | null;
  age: number | null;
  dateOfIssue: string;
  workPlace: string | null;
  serialNumber: string | null;
  certificateIssued: boolean;
  status: GraduateStatus;
}

export interface GraduateWriteDto {
  studentId: string;
  groupId?: string | null;
  age?: number | null;
  dateOfIssue: string;
  workPlace?: string | null;
  serialNumber?: string | null;
  certificateIssued: boolean;
  status: GraduateStatus;
}

// ---- Dashboard charts ----
export interface DailyAttendanceDto {
  day: number;
  late: number;
  absent: number;
}

export interface LeftCoursesPointDto {
  month: number;
  left: number;
  returned: number;
}

// Who was away today, and why — the table under the Present/Absent/Late pills.
export interface AbsenteeDto {
  studentId: string;
  studentName: string | null;
  groupId: string | null;
  groupName: string | null;
  phones: string[] | null;
  reason: string | null;
}

// ---- Notifications ----
export interface NotificationDto {
  id: string;
  title: string | null;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

// ---- SMS recipient detail (from testchaos) ----
export interface SmsRecipientDto {
  name: string | null;
  phone: string | null;
  delivered: boolean;
}

// ---- Administration: role→permission assignment (from testchaos) ----
export interface RolePermissionsDto {
  roleId: string;
  permissionIds: string[];
}

// ---- Administration: Logs ----
export interface LogDto {
  id: string;
  action: string | null;
  actorName: string | null;
  entityType: string | null;
  description: string | null;
  success: boolean;
  createdAt: string;
}

export interface LogParams extends ListParams {
  from?: string;
  to?: string;
}

// ---- Timetable: alternate day naming (from testchaos) ----
export type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

// ---- Rewards (gamification, from testchaos) ----
export type RewardRedemptionStatus = "Pending" | "Fulfilled" | "Rejected" | "Cancelled";

export interface RewardDto {
  id: string;
  name: string | null;
  description: string | null;
  cost: number;
  imageUrl: string | null;
  stock: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface RewardRedemptionDto {
  id: string;
  studentId: string;
  studentName: string | null;
  rewardId: string;
  rewardName: string | null;
  cost: number;
  status: RewardRedemptionStatus;
  note: string | null;
  createdAt: string;
  processedAt: string | null;
}

// ---- Profile ----
export type Language = "Ru" | "En" | "Tj";
export type NotificationChannel = "Sms" | "Telegram";

export interface ProfileDto {
  id: string;
  userName: string | null;
  fullName: string | null;
  roles: string[] | null;
  studentId: string | null;
  employeeId: string | null;
  kind: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  preferredLanguage: Language;
  preferredChannel: NotificationChannel;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  preferredLanguage: Language;
  preferredChannel: NotificationChannel;
}

// ---- Global search ----
export interface SearchHit {
  id: string;
  title: string | null;
  subtitle: string | null;
}

export interface GlobalSearchResultDto {
  students: SearchHit[];
  groups: SearchHit[];
  employees: SearchHit[];
  leads: SearchHit[];
  courses: SearchHit[];
}

// ---- Overview aggregates (rich detail cards) ----
export interface OverviewAttendanceDto {
  present: number;
  absent: number;
  late: number;
  rate: number;
}

export interface TimelineItemDto {
  at: string;
  type: string;
  text: string;
}

export interface OverviewEnrollmentDto {
  groupId: string;
  groupName: string | null;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export interface OverviewPaymentDto {
  id: string;
  amount: number;
  paid: number;
  date: string;
  status: PaymentStatus;
}

export interface StudentOverviewDto {
  id: string;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  photoUrl: string | null;
  status: StudentStatus;
  branchName: string | null;
  tokenBalance: number;
  totalPaid: number;
  enrollments: OverviewEnrollmentDto[];
  payments: OverviewPaymentDto[];
  attendance: OverviewAttendanceDto;
  timeline: TimelineItemDto[];
}

export interface OverviewRosterItemDto {
  studentId: string;
  fullName: string | null;
  phoneNumber: string | null;
  status: EnrollmentStatus;
  hasAccount: boolean;
}

export interface GroupOverviewDto {
  id: string;
  name: string | null;
  courseTitle: string | null;
  branchName: string | null;
  status: GroupStatus;
  startDate: string;
  endDate: string;
  days: string | null;
  room: string | null;
  mentors: string[];
  studentsActive: number;
  studentsLeft: number;
  totalPaid: number;
  attendance: OverviewAttendanceDto;
  roster: OverviewRosterItemDto[];
}

// ---- Reports ----
export interface MonthlyIncomeDto {
  month: number;
  total: number;
}

export interface IncomeByCourseDto {
  courseId: string;
  courseTitle: string | null;
  total: number;
  payments: number;
}

export interface IncomeByBranchDto {
  branchId: string | null;
  branchName: string | null;
  total: number;
}
