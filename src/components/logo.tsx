import React, { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="160"
      height="48"
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-auto text-[#5842f4] dark:text-[#6366f1]"
      {...props}
    >
      {/* Top Mortarboard Cap (Dark Navy / Indigo) */}
      <path d="M18 1.5 L31 8 L18 14.5 L5 8 Z" fill="#1b1764" className="dark:fill-[#312e81]" />
      <path
        d="M9.5 11.5 C11.5 10 14.5 9.2 16 9.2 C17.5 9.2 20.5 10 22.5 11.5"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <g fill="currentColor">
        {/* Lowercase 'o' (Purple Ring) */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 13C11.37 13 6 18.37 6 25C6 31.63 11.37 37 18 37C24.63 37 30 31.63 30 25C30 18.37 24.63 13 18 13ZM18 19C14.69 19 12 21.69 12 25C12 28.31 14.69 31 18 31C21.31 31 24 28.31 24 25C24 21.69 21.31 19 18 19Z"
        />

        {/* Lowercase 'm' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M35 13.5H41.5V16.2C43.3 14.1 46 13 49.2 13C53.2 13 55.8 14.7 57.2 17.6C59.2 14.6 62.3 13 66.2 13C72.2 13 74.5 16.6 74.5 22.8V37H68V23.8C68 20.2 66.7 18.6 63.8 18.6C60.7 18.6 59.2 20.6 59.2 24.6V37H52.7V23.8C52.7 20.2 51.4 18.6 48.5 18.6C45.4 18.6 43.9 20.6 43.9 24.6V37H35V13.5Z"
        />

        {/* Lowercase 'u' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M80 13.5H86.5V26C86.5 29.6 88.1 31.8 91.2 31.8C94.3 31.8 95.9 29.6 95.9 26V13.5H102.4V37H96.3V33.6C94.6 36.1 91.9 37.5 88 37.5C82.8 37.5 80 33.6 80 26.8V13.5Z"
        />

        {/* Lowercase 'z' */}
        <path d="M108 13.5H131V19.2L116.8 31.3H131V37H108V31.3L122.2 19.2H108V13.5Z" />
      </g>
    </svg>
  );
}
