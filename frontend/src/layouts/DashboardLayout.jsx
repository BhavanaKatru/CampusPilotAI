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

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

 

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Study Planner",
      path: "/study-planner",
      icon: CalendarDays,
    },
    {
      name: "PDF Analyzer",
      path: "/pdf-analyzer",
      icon: FileText,
    },
    {
      name: "Doubt Solver",
      path: "/doubt-solver",
      icon: Bot,
    },
    {
      name: "Quiz Generator",
      path: "/quiz-generator",
      icon: Brain,
    },
    {
      name: "Assignments",
      path: "/assignments",
      icon: BookOpen,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: BarChart3,
    },
    {
  name: "Attendance Predictor",
  path: "/attendance-predictor",
  icon: BarChart3,
},
    {
      name: "Career Mentor",
      path: "/career-mentor",
      icon: BriefcaseBusiness,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
{
  name: "Settings",
  path: "/settings",
  icon: Settings,
}
   
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
            className="rounded-lg p-2 text-slate-500 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
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
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={20} />

                {!collapsed && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

     

        <button
          type="button"
          onClick={() =>
            setCollapsed((value) => !value)
          }
          className="absolute -right-4 bottom-20 hidden rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-xl dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 lg:block"
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