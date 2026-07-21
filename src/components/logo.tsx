import React, { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="160"
      height="48"
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-auto text-indigo-600 dark:text-indigo-400"
      {...props}
    >
      <g fill="currentColor">
        {/* Letter 'o' with Graduation Cap */}
        <path d="M18 1.5L31 8L18 14.5L5 8L18 1.5Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 13C10.82 13 5 18.82 5 26C5 33.18 10.82 39 18 39C25.18 39 31 33.18 31 26C31 18.82 25.18 13 18 13ZM18 20.5C14.96 20.5 12.5 22.96 12.5 26C12.5 29.04 14.96 31.5 18 31.5C21.04 31.5 23.5 29.04 23.5 26C23.5 22.96 21.04 20.5 18 20.5Z"
        />

        {/* Letter 'm' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37 14.5H43V17.2C44.8 15.1 47.4 14 50.5 14C54.2 14 56.8 15.6 58.2 18.4C60.2 15.5 63.2 14 67 14C72.8 14 75 17.5 75 23.5V38.5H69V24.5C69 20.8 67.8 19.2 65 19.2C62 19.2 60.5 21.2 60.5 25.2V38.5H54.5V24.5C54.5 20.8 53.3 19.2 50.5 19.2C47.5 19.2 46 21.2 46 25.2V38.5H40V14.5H37Z"
        />

        {/* Letter 'u' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M81 14.5H87V27C87 30.5 88.5 32.8 91.5 32.8C94.5 32.8 96 30.5 96 27V14.5H102V38.5H96.5V35C94.8 37.5 92.2 39 88.5 39C83.5 39 81 35.2 81 28.5V14.5Z"
        />

        {/* Letter 'z' */}
        <path d="M108 14.5H131V20L117 33H131V38.5H108V33L122 20H108V14.5Z" />
      </g>
    </svg>
  );
}
