import { useState } from "react";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
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

  const differenceInTime = selectedExamDate.getTime() - today.getTime();

  const daysUntilExam = Math.ceil(
    differenceInTime / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExam < 0) {
    alert("Please select a future exam date.");
    return;
  }

  // Minimum one day for every topic
  const totalDays = Math.max(
    topicList.length,
    daysUntilExam + 1
  );

  const generatedPlan = [];

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
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
        dayIndex === totalDays - 1 && totalDays > topicList.length
          ? "Final Revision"
          : topic,
      hours: formData.dailyHours || "2",
      task,
    });
  }

setPlan(generatedPlan);

const totalPlannedHours = generatedPlan.reduce(
  (total, item) => total + Number(item.hours || 0),
  0
);

localStorage.setItem(
  "campusPilotStudyHours",
  totalPlannedHours.toString()
);
const currentDay = new Date().toLocaleDateString("en-US", {
  weekday: "short",
});

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

const updatedWeeklyProgress = savedWeeklyProgress.map((item) =>
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
    localStorage.getItem("campusPilotRecentActivities")
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
      <div className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <CalendarDays size={26} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI Study Planner
            </h1>

            <p className="mt-1 text-slate-400">
              Create a personalized daily study schedule.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={handleGeneratePlan}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold">
              Enter Study Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Example: DBMS"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Exam Date
                </label>

                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
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
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Topics
                </label>

                <textarea
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  placeholder="Normalization, SQL Joins, Transactions, Indexing"
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold"
              >
                <Sparkles size={18} />
                Generate Study Plan
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Your Study Schedule
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formData.subject || "Subject"} preparation plan
                </p>
              </div>

              <Clock3 className="text-cyan-400" />
            </div>

            {plan.length === 0 ? (
              <div className="flex min-h-80 items-center justify-center text-center text-slate-500">
                Enter your details and generate a plan.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {plan.map((item) => (
                  <div
                    key={item.day}
                    className="rounded-xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-cyan-500/10 px-3 py-1 text-sm text-cyan-400">
                        {item.day}
                      </span>

                      <span className="text-sm text-slate-400">
                        {item.hours} hours
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      {item.topic}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.task}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudyPlanner;