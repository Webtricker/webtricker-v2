"use client";

import { useTheme } from "@/provider/ThemeProvider";

export default function DemoThemeToggler() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="rounded-full ms-2 active:outline-0 outline-0 focus:outline-0">
      <button
        title="Theme Toggler"
        onClick={() => toggleTheme()}
        className="pl-2 w-14 h-auto mt-2 active:outline-0 outline-0 focus:outline-0"
      >
        {theme === "dark" ? (
          <>
            <svg
              fill="#ffffff"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <title>ionicons-v5-k</title>
                <path d="M368,112H144C64.6,112,0,176.6,0,256S64.6,400,144,400H368c79.4,0,144-64.6,144-144S447.4,112,368,112Zm0,256A112,112,0,1,1,480,256,112.12,112.12,0,0,1,368,368Z"></path>
              </g>
            </svg>
          </>
        ) : (
          <>
            <svg
              fill="#000000"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="m0 11.617c0-3.763 3.05-6.814 6.813-6.817h10.371c3.765 0 6.817 3.052 6.817 6.817s-3.052 6.817-6.817 6.817h-10.366c-3.763 0-6.814-3.05-6.817-6.813zm6.817 4.543c2.507-.002 4.539-2.035 4.539-4.542 0-2.509-2.034-4.542-4.542-4.542s-4.542 2.034-4.542 4.542c0 1.254.508 2.389 1.329 3.21.822.823 1.958 1.332 3.214 1.332h.003z"></path>
              </g>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
