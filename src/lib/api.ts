import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL });

// ponytail: no login screen yet — the shared account in .env.local is the only
// credential. Swap getToken() for real session storage when login exists.
let pendingLogin: Promise<string> | null = null;

async function login() {
  const { data } = await axios.post(`${baseURL}/api/Auth/login`, {
    userName: process.env.NEXT_PUBLIC_API_USER,
    password: process.env.NEXT_PUBLIC_API_PASSWORD,
  });

  return data.accessToken as string;
}

/** Logs in once. Requests fired in parallel all await the same promise. */
async function getToken() {
  if (!pendingLogin) pendingLogin = login();

  try {
    return await pendingLogin;
  } catch (error) {
    pendingLogin = null; // failed login must not be cached
    throw error;
  }
}

// Every request carries the token.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 means the token expired: log in again and replay the request once.
api.interceptors.response.use(undefined, async (error) => {
  type Request = InternalAxiosRequestConfig & { retried?: boolean };
  const request = error.config as Request | undefined;
  const tokenExpired = error.response?.status === 401;

  // A 401 from the login call itself means the credentials are wrong. Retrying
  // that would loop forever, so let it fail.
  const isLogin = request?.url?.includes("/api/Auth/login") ?? false;

  if (!tokenExpired || !request || request.retried || isLogin) throw error;

  request.retried = true;
  pendingLogin = null;

  return api.request(request);
});

export type GroupCard = {
  id: string;
  name: string | null;
  absent: number;
  late: number;
  income: number;
};

export type DashboardStats = {
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
  attendance: { present: number; absent: number; late: number };
  groups: GroupCard[] | null;
};

export type Graduate = {
  id: string;
  studentName: string | null;
  groupName: string | null;
  age: number;
  dateOfIssue: string;
  workPlace: string | null;
};

export type Lead = {
  id: string;
  fullName: string | null;
  registerMonth: string | null;
};

export type Student = {
  id: string;
  fullName: string | null;
  phoneNumber: string | null;
  groups: string[] | null;
};

export type Payment = {
  id: string;
  paid: number;
  date: string;
};

export type Group = {
  id: string;
  startDate: string;
  enrolledCount: number;
};

export async function getStats() {
  const { data } = await api.get<DashboardStats>("/api/Dashboard/stats");
  return data;
}

/** Every list endpoint returns the same paged envelope. */
async function getList<T>(url: string, pageSize: number) {
  const { data } = await api.get<{ items: T[] | null }>(url, {
    params: { PageSize: pageSize },
  });

  return data.items ?? [];
}

export const getGraduates = () => getList<Graduate>("/api/Graduates", 5);
export const getStudents = () => getList<Student>("/api/Students", 6);
export const getLeads = () => getList<Lead>("/api/Leads", 500);
export const getPayments = () => getList<Payment>("/api/Payments", 500);
export const getGroups = () => getList<Group>("/api/Groups", 200);
