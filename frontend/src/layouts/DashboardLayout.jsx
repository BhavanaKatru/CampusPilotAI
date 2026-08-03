import { useState } from "react";
import { NavLink } from "react-router-dom";

import AIChatbot from "../components/AIChatbot";


import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

 const {
  theme,
  toggleTheme,
} = useTheme();

const isDark = theme === "dark";

  const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/10",
  },
  {
    name: "Study Planner",
    path: "/study-planner",
    icon: CalendarDays,
    color: "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/10",
  },
  {
    name: "PDF Analyzer",
    path: "/pdf-analyzer",
    icon: FileText,
    color: "text-rose-600 bg-rose-100 dark:text-rose-300 dark:bg-rose-500/10",
  },
  {
    name: "Doubt Solver",
    path: "/doubt-solver",
    icon: Bot,
    color: "text-cyan-600 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-500/10",
  },
  {
    name: "Quiz Generator",
    path: "/quiz-generator",
    icon: Brain,
    color: "text-violet-600 bg-violet-100 dark:text-violet-300 dark:bg-violet-500/10",
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: BookOpen,
    color: "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/10",
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: BarChart3,
    color: "text-teal-600 bg-teal-100 dark:text-teal-300 dark:bg-teal-500/10",
  },
  {
    name: "Attendance Predictor",
    path: "/attendance-predictor",
    icon: BarChart3,
    color: "text-sky-600 bg-sky-100 dark:text-sky-300 dark:bg-sky-500/10",
  },
  {
    name: "Career Mentor",
    path: "/career-mentor",
    icon: BriefcaseBusiness,
    color: "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-500/10",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
    color: "text-pink-600 bg-pink-100 dark:text-pink-300 dark:bg-pink-500/10",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    color: "text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700",
  },
];

  return (
   <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-cyan-500" />

          <span className="font-bold">
            CampusPilot AI
          </span>
        </div>

        <div className="flex items-center gap-2">
         <button
  type="button"
  onClick={toggleTheme}
  className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
  aria-label="Toggle theme"
>
  {isDark ? <Sun size={20} /> : <Moon size={20} />}
</button>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/95 ${
          collapsed ? "w-20" : "w-72"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 dark:border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-2 text-white">
              <GraduationCap size={24} />
            </div>

            {!collapsed && (
              <div className="whitespace-nowrap">
                <h1 className="font-bold">
                  CampusPilot AI
                </h1>

                <p className="text-xs text-slate-500">
                  Academic Ecosystem
                </p>
              </div>
            )}
          </div>

         <button
  type="button"
  onClick={() => setSidebarOpen(false)}
 className="group rounded-xl p-2 transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-red-500 hover:text-white hover:shadow-lg active:scale-95"
  aria-label="Close sidebar"
>
  <X
    size={20}
    className="transition-transform duration-300"
  />
</button>
        </div>

      <nav className="h-[calc(100vh-5rem)] space-y-2 overflow-y-auto p-4 pb-28">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
              
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`
               }
              >
<span
  className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
>
  <Icon size={19} />
</span>

                {!collapsed && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div
  className={`absolute bottom-4 left-0 right-0 px-4 ${
    collapsed ? "flex justify-center" : ""
  }`}
>
  <button
    type="button"
    onClick={toggleTheme}
    className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${
      collapsed ? "justify-center px-3" : "w-full"
    }`}
    aria-label="Toggle theme"
  >
    {isDark ? <Sun size={20} /> : <Moon size={20} />}

    {!collapsed && (
      <span>
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    )}
  </button>
</div>

     

        <button
          type="button"
          onClick={() =>
            setCollapsed((value) => !value)
          }
          className="absolute -right-4 bottom-24 hidden rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-xl dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </aside>

 <main
  className={`min-h-screen min-w-0 overflow-x-hidden pt-16 transition-all duration-300 lg:pt-0 ${
    collapsed ? "lg:ml-20" : "lg:ml-72"
  }`}
>
  <div className="w-full min-w-0">
    {children}
  </div>
</main>

      <AIChatbot />
    </div>
  );
}

export default DashboardLayout;