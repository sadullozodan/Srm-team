import type { SVGProps } from "react";

// Filled OMUZ icon set — matches the Figma (bold, solid icons, not outlines).
// Negative space uses var(--sidebar) so cutouts read correctly in both themes.

type P = SVGProps<SVGSVGElement>;

const base = (p: P): P => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...p,
});

export type IconName =
  | "home"
  | "students"
  | "groups"
  | "employees"
  | "progressbook"
  | "timetable"
  | "courses"
  | "administration"
  | "accounting"
  | "branches"
  | "jobs"
  | "sms";

function Home(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Students(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="8.5" cy="8" r="3" fill="currentColor" />
      <circle cx="17" cy="9" r="2.4" fill="currentColor" opacity=".75" />
      <path
        d="M2.5 19c.4-3.2 2.9-5 6-5s5.6 1.8 6 5a1 1 0 0 1-1 1.2H3.5A1 1 0 0 1 2.5 19Z"
        fill="currentColor"
      />
      <path
        d="M16.5 14c2.6.1 4.6 1.7 5 4.3a.9.9 0 0 1-.9 1.1h-3.4c.1-1.9-.3-3.7-1.3-5.2l.6-.2Z"
        fill="currentColor"
        opacity=".75"
      />
    </svg>
  );
}

function Groups(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor" />
    </svg>
  );
}

function Employees(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="3.2" fill="currentColor" />
      <path
        d="M3 19.5c.5-3.4 3-5.3 6-5.3s5.5 1.9 6 5.3a1 1 0 0 1-1 1.2H4a1 1 0 0 1-1-1.2Z"
        fill="currentColor"
      />
      <circle cx="17.5" cy="7" r="2.2" fill="currentColor" opacity=".7" />
      <path
        d="M17 12c2.3.1 4 1.5 4.5 3.8a.9.9 0 0 1-.9 1.1h-2.8c0-1.7-.5-3.3-1.5-4.7l.7-.2Z"
        fill="currentColor"
        opacity=".7"
      />
    </svg>
  );
}

function Progressbook(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" fill="currentColor" />
      <circle cx="12" cy="9" r="2.2" fill="var(--sidebar)" />
      <path
        d="M8 15.5c.6-1.8 2.1-2.8 4-2.8s3.4 1 4 2.8a.7.7 0 0 1-.7.9H8.7a.7.7 0 0 1-.7-.9Z"
        fill="var(--sidebar)"
      />
    </svg>
  );
}

function Timetable(p: P) {
  return (
    <svg {...base(p)}>
      <rect
        x="3.2"
        y="4.5"
        width="17.6"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path d="M3.2 9h17.6" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M8 3v3M16 3v3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="8" cy="13" r="1.4" fill="currentColor" />
      <circle cx="12" cy="13" r="1.4" fill="currentColor" />
      <circle cx="16" cy="13" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Courses(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 2.5 8 12 13l9.5-5L12 3Z" fill="currentColor" />
      <path
        d="m5 11 7 3.7L19 11"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        opacity=".55"
      />
      <path
        d="m5 15 7 3.7L19 15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        opacity=".85"
      />
    </svg>
  );
}

function Administration(p: P) {
  return (
    <svg {...base(p)}>
      <path
        d="M12 2.5 4.5 5.5v5.2c0 4.6 3 8.4 7.5 10 4.5-1.6 7.5-5.4 7.5-10V5.5L12 2.5Z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.2" fill="var(--sidebar)" />
      <path
        d="M8.4 16c.5-1.7 1.9-2.6 3.6-2.6s3.1.9 3.6 2.6a.7.7 0 0 1-.7.9H9.1a.7.7 0 0 1-.7-.9Z"
        fill="var(--sidebar)"
      />
    </svg>
  );
}

function Accounting(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 3 7.5h18L12 3Z" fill="currentColor" />
      <path
        d="M5 9v7M9.3 9v7M14.7 9v7M19 9v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3.5 19.5h17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Branches(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" />
      <g fill="var(--sidebar)">
        <rect x="7" y="6" width="2.4" height="2.4" rx=".5" />
        <rect x="11" y="6" width="2.4" height="2.4" rx=".5" />
        <rect x="15" y="6" width="2.4" height="2.4" rx=".5" />
        <rect x="7" y="10" width="2.4" height="2.4" rx=".5" />
        <rect x="11" y="10" width="2.4" height="2.4" rx=".5" />
        <rect x="15" y="10" width="2.4" height="2.4" rx=".5" />
        <rect x="10" y="14.5" width="4" height="6.5" rx=".5" />
      </g>
    </svg>
  );
}

function Jobs(p: P) {
  return (
    <svg {...base(p)}>
      <rect
        x="3.2"
        y="4.5"
        width="17.6"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path d="M3.2 9h17.6" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M8 3v3M16 3v3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14.5" r="3.6" fill="currentColor" />
      <path
        d="M12 13v1.6l1.1.9"
        stroke="var(--sidebar)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sms(p: P) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="currentColor" />
      <path
        d="m5 8 7 5 7-5"
        stroke="var(--sidebar)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const REGISTRY: Record<IconName, (p: P) => React.ReactElement> = {
  home: Home,
  students: Students,
  groups: Groups,
  employees: Employees,
  progressbook: Progressbook,
  timetable: Timetable,
  courses: Courses,
  administration: Administration,
  accounting: Accounting,
  branches: Branches,
  jobs: Jobs,
  sms: Sms,
};

export function NavIcon({ name, ...p }: { name: IconName } & P) {
  const Cmp = REGISTRY[name];
  return <Cmp {...p} />;
}

// Real Union Jack — a flag image, not a generic icon.
export function FlagUK(p: P) {
  return (
    <svg
      width={22}
      height={16}
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <clipPath id="uk-r">
        <rect width="60" height="40" rx="4" />
      </clipPath>
      <g clipPath="url(#uk-r)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 60 40M60 0 0 40" stroke="#fff" strokeWidth="8" />
        <path
          d="M0 0 60 40M60 0 0 40"
          stroke="#C8102E"
          strokeWidth="4"
          clipPath="url(#uk-r)"
        />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

// OMUZ logo mark — rounded roof/house with antenna dot.
export function LogoMark(p: P) {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        d="M16 3.5 27 12v14.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12L16 3.5Z"
        fill="currentColor"
        opacity=".12"
      />
      <path
        d="m4.5 13 11.5-9 11.5 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="19" r="6.5" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M16 6.5v3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
