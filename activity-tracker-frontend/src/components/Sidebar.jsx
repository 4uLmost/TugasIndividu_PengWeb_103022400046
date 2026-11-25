import React from "react";

export default function Sidebar({ activeNav = "dashboard", onNavChange }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="2" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "starred",
      label: "Catatan Berbintang",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      id: "categories",
      label: "Kategori",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-full lg:w-20 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex lg:flex-col items-center justify-between lg:justify-start gap-6 p-4 lg:py-6 shrink-0">
      <div className="w-10 h-10 rounded-full bg-[#7059A6] shadow-sm flex items-center justify-center shrink-0"></div>

      <nav className="flex lg:flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() => onNavChange && onNavChange(item.id)}
              className={`p-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
