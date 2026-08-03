import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

function StudyPlanner() {
  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    dailyHours: "",
    topics: "",
  });

  const [plan, setPlan] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleGeneratePlan = (event) => {
    event.preventDefault();

    const topicList = formData.topics
      .split(/[\n,;]+/)
      .map((topic) => topic.trim())
      .filter(Boolean);

    if (topicList.length === 0) {
      alert("Please enter at least one topic.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedExamDate = new Date(formData.examDate);
    selectedExamDate.setHours(0, 0, 0, 0);

    const differenceInTime =
      selectedExamDate.getTime() - today.getTime();

    const daysUntilExam = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExam < 0) {
      alert("Please select a future exam date.");
      return;
    }

    const totalDays = Math.max(
      topicList.length,
      daysUntilExam + 1
    );

    const generatedPlan = [];

    for (
      let dayIndex = 0;
      dayIndex < totalDays;
      dayIndex += 1
    ) {
      const topicIndex = dayIndex % topicList.length;
      const topic = topicList[topicIndex];

      let task = `Study ${topic}, prepare short notes and solve practice questions.`;

      if (dayIndex >= topicList.length) {
        task = `Revise ${topic}, review weak concepts and solve additional questions.`;
      }

      if (dayIndex === totalDays - 1) {
        task =
          "Complete final revision of all topics and attempt one mock test.";
      }

      generatedPlan.push({
        day: `Day ${dayIndex + 1}`,
        topic:
          dayIndex === totalDays - 1 &&
          totalDays > topicList.length
            ? "Final Revision"
            : topic,
        hours: formData.dailyHours || "2",
        task,
      });
    }

    setPlan(generatedPlan);

    const totalPlannedHours = generatedPlan.reduce(
      (total, item) =>
        total + Number(item.hours || 0),
      0
    );

    localStorage.setItem(
      "campusPilotStudyHours",
      totalPlannedHours.toString()
    );

    const currentDay = new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

    const savedWeeklyProgress =
      JSON.parse(
        localStorage.getItem(
          "campusPilotWeeklyProgress"
        )
      ) || [
        { day: "Mon", hours: 0 },
        { day: "Tue", hours: 0 },
        { day: "Wed", hours: 0 },
        { day: "Thu", hours: 0 },
        { day: "Fri", hours: 0 },
        { day: "Sat", hours: 0 },
        { day: "Sun", hours: 0 },
      ];

    const updatedWeeklyProgress =
      savedWeeklyProgress.map((item) =>
        item.day === currentDay
          ? {
              ...item,
              hours: Number(formData.dailyHours),
            }
          : item
      );

    localStorage.setItem(
      "campusPilotWeeklyProgress",
      JSON.stringify(updatedWeeklyProgress)
    );

    const existingActivities =
      JSON.parse(
        localStorage.getItem(
          "campusPilotRecentActivities"
        )
      ) || [];

    const newActivity = {
      id: Date.now(),
      title: "Study Plan Generated",
      description: `${formData.subject} study plan created for ${totalPlannedHours} hours.`,
      time: new Date().toLocaleString(),
    };

    const updatedActivities = [
      newActivity,
      ...existingActivities,
    ].slice(0, 6);

    localStorage.setItem(
      "campusPilotRecentActivities",
      JSON.stringify(updatedActivities)
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 text-slate-900 transition-colors duration-300 dark:bg-none dark:bg-slate-950 dark:text-white sm:p-8">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <CalendarDays size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
                  AI Study Planner
                </h1>

                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Create a personalized daily study
                  schedule.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_1.2fr]">
            <form
              onSubmit={handleGeneratePlan}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Enter Study Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your exam details and syllabus
                topics.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Example: DBMS"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Exam Date
                  </label>

                  <input
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Daily Free Hours
                  </label>

                  <input
                    type="number"
                    name="dailyHours"
                    value={formData.dailyHours}
                    onChange={handleChange}
                    placeholder="Example: 3"
                    min="1"
                    max="12"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Topics
                  </label>

                  <textarea
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder="Normalization, SQL Joins, Transactions, Indexing"
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]"
                >
                  <Sparkles size={18} />
                  Generate Study Plan
                </button>
              </div>
            </form>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Your Study Schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {formData.subject || "Subject"}{" "}
                    preparation plan
                  </p>
                </div>

                <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Clock3 size={22} />
                </div>
              </div>

              {plan.length === 0 ? (
                <div className="mt-6 flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-500">
                  Enter your details and generate a
                  study plan.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {plan.map((item) => (
                    <article
                      key={item.day}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-500/30 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-lg bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                          {item.day}
                        </span>

                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {item.hours} hours
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                        {item.topic}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.task}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudyPlanner;