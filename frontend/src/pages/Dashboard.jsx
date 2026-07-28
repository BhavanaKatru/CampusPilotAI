import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CalendarClock,
  ChevronRight,
  LogOut,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import FeatureCard from "../components/FeatureCard";
import ProgressChart from "../components/ProgressChart";
import StatCard from "../components/StatCard";

import {
  recentActivities,
  statistics,
 
  upcomingTasks,
} from "../data/dashboardData";

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
  studyHours: 0,
  completedTasks: 0,
  quizAverage: 0,
  streak: 0,
});
const [dashboardUpcomingTasks, setDashboardUpcomingTasks] = useState([]);
const [dashboardRecentActivities, setDashboardRecentActivities] =
  useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([
  { day: "Mon", hours: 0 },
  { day: "Tue", hours: 0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
]);
useEffect(() => {
  const loadDashboardStats = async () => {
    try {
      const savedStudyHours = Number(
  localStorage.getItem("campusPilotStudyHours")
) || 0;
const savedQuizAverage = Number(
  localStorage.getItem("campusPilotQuizAverage")
) || 0;
      // Assignments
      const assignmentRes = await fetch(
       `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/assignments`
      );
      const assignments = await assignmentRes.json();

      const completedTasks = assignments.filter(
        (a) => a.status === "Completed"
      ).length;
      const upcoming = assignments
  .filter((assignment) => assignment.status !== "Completed")
  .slice(0, 5);

setDashboardUpcomingTasks(upcoming);
const activities =
  JSON.parse(
    localStorage.getItem("campusPilotRecentActivities")
  ) || [];

setDashboardRecentActivities(activities);
const savedWeeklyProgress =
  JSON.parse(
    localStorage.getItem("campusPilotWeeklyProgress")
  ) || [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ];

setWeeklyProgress(savedWeeklyProgress);
      const today = new Date().toDateString();

const lastVisit = localStorage.getItem("campusPilotLastVisit");
let currentStreak =
  Number(localStorage.getItem("campusPilotStreak")) || 0;

if (!lastVisit) {
  currentStreak = 1;
} else {
  const lastVisitDate = new Date(lastVisit);
  const todayDate = new Date(today);

  const differenceInDays = Math.floor(
    (todayDate - lastVisitDate) / (1000 * 60 * 60 * 24)
  );

  if (differenceInDays === 1) {
    currentStreak += 1;
  } else if (differenceInDays > 1) {
    currentStreak = 1;
  }
}

localStorage.setItem("campusPilotLastVisit", today);
localStorage.setItem("campusPilotStreak", String(currentStreak));

setDashboardStats((prev) => ({
  ...prev,
  studyHours: savedStudyHours,
  completedTasks,
  quizAverage: savedQuizAverage,
  streak: currentStreak,
}));
    } catch (err) {
      console.log(err);
    }
  };

  loadDashboardStats();
}, []);
  const [showNotifications, setShowNotifications] = useState(false);

  const userName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Student";

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    }

    if (currentHour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const motivationalQuotes = [
    "Small progress every day creates big results.",
    "Consistency is more important than perfection.",
    "Focus on completing one important task at a time.",
    "Every study session moves you closer to your goal.",
    "Start where you are and improve one step at a time.",
  ];

  const dailyQuote =
    motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const features = [
    {
      title: "AI Study Planner",
      description:
        "Create a personalized daily study plan based on your exams, syllabus and free time.",
      icon: "📅",
      path: "/study-planner",
    },
    {
      title: "Smart PDF Analyzer",
      description:
        "Upload notes or PDFs and generate summaries, flashcards and important questions.",
      icon: "📄",
      path: "/pdf-analyzer",
    },
    {
      title: "AI Doubt Solver",
      description:
        "Ask academic questions and receive simple explanations with examples.",
      icon: "🤖",
      path: "/doubt-solver",
    },
    {
      title: "AI Quiz Generator",
      description:
        "Generate topic-based quizzes and receive instant scores and feedback.",
      icon: "🧠",
      path: "/quiz-generator",
    },
    {
      title: "Assignment Assistant",
      description:
        "Manage deadlines, divide assignments into milestones and track completion.",
      icon: "📝",
      path: "/assignments",
    },
    {
      title: "Attendance Predictor",
      description:
        "Calculate your current attendance and know how many classes you must attend or can safely miss.",
      icon: "📊",
      path: "/attendance-predictor",
    },
    {
      title: "AI Career Mentor",
      description:
        "Get personalized skills, certifications, internships and placement roadmaps.",
      icon: "💼",
      path: "/career-mentor",
    },
    {
      title: "Progress Analytics",
      description:
        "Track study hours, quiz scores, completed tasks and academic streaks.",
      icon: "📈",
      path: "/progress",
    },
  ];

  const filteredFeatures = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return features;
    }

    return features.filter((feature) => {
      return (
        feature.title.toLowerCase().includes(normalizedSearch) ||
        feature.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);
  const dynamicStatistics = [
  {
    title: "Study Hours",
    value: `${dashboardStats.studyHours} hrs`,
    change: "Updated automatically",
    icon: "Clock",
  },
  {
    title: "Tasks Completed",
    value: dashboardStats.completedTasks,
    change: "Live from Assignments",
    icon: "CheckCircle",
  },
  {
    title: "Quiz Average",
    value: `${dashboardStats.quizAverage}%`,
    change: "Updated automatically",
    icon: "Brain",
  },
  {
    title: "Current Streak",
    value: `${dashboardStats.streak} days`,
    change: "Updated automatically",
    icon: "Flame",
  },
];
const totalWeeklyHours = weeklyProgress.reduce(
  (total, item) => total + Number(item.hours || 0),
  0
);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 p-5 text-white sm:p-7 lg:p-8">
        <header className="relative flex flex-col gap-5 border-b border-white/10 pb-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-cyan-400">
              <Sparkles size={16} />
              {getGreeting()}
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Hello, {userName}
            </h1>

            <p className="mt-2 text-slate-400">
              {formattedDate}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Track your progress and continue your learning journey.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search academic tools..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-cyan-500 md:w-64"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowNotifications((previousValue) => !previousValue)
                }
                className="relative rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell size={20} />

                {dashboardUpcomingTasks.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {upcomingTasks.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-14 z-40 w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Notifications
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {dashboardUpcomingTasks.length > 0? (
                      upcomingTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="rounded-xl border border-white/10 bg-slate-950/70 p-3"
                        >
                          <p className="text-sm font-medium">
                            {task.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {task.subject} • {task.date}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No new notifications.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-purple-500/20 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
              <Sparkles size={23} />
            </div>

            <div>
              <p className="text-sm font-medium text-cyan-400">
                Daily Motivation
              </p>

              <h2 className="mt-2 text-lg font-semibold sm:text-xl">
                “{dailyQuote}”
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                CampusPilot AI is ready to help with your academic tasks.
              </p>
            </div>
          </div>
        </section>

    <section className="mt-7 grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
  {dynamicStatistics.map((stat) => (
    <StatCard key={stat.title} {...stat} />
  ))}
</section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Weekly Study Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Study hours completed during this week
                </p>
              </div>

              <span className="w-fit rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-400">
           {totalWeeklyHours} hours
              </span>
            </div>

          <ProgressChart data={weeklyProgress} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Upcoming Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Important academic deadlines
                </p>
              </div>

              <CalendarClock className="text-cyan-400" />
            </div>

            <div className="mt-6 space-y-4">
              {dashboardUpcomingTasks.length > 0? (
               dashboardUpcomingTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => navigate("/assignments")}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-cyan-500/30 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {task.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                         {task.subject || "General"}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-slate-600"
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                      {task.dueDate}
                      </span>

                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                        {task.status}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No upcoming tasks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-2xl font-semibold">
              AI Academic Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Everything you need to manage your academics.
            </p>
          </div>

          {filteredFeatures.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredFeatures.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
              <Search
                size={34}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 font-semibold">
                No tool found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try searching with another keyword.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">
            Recent Activity
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {dashboardRecentActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-cyan-500/20"
              >
                <h3 className="font-medium">
                  {activity.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {activity.description}
                </p>

                <p className="mt-4 text-xs text-slate-600">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;