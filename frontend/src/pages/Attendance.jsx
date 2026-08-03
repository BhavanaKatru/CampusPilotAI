 import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Edit3,
  Plus,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

const STORAGE_KEY = "campuspilot_attendance_subjects";
const TODAY_KEY = "campuspilot_attendance_today";

const emptyForm = {
  subject: "",
  totalClasses: "",
  attendedClasses: "",
  targetPercentage: "75",
};

function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem(STORAGE_KEY);

      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
    } catch (error) {
      console.error("Failed to load attendance data:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const calculatePercentage = (attended, total) => {
    const attendedNumber = Number(attended);
    const totalNumber = Number(total);

    if (!totalNumber || totalNumber <= 0) {
      return 0;
    }

    return Number(((attendedNumber / totalNumber) * 100).toFixed(2));
  };

  const calculateAttendanceAdvice = (
    attendedClasses,
    totalClasses,
    targetPercentage
  ) => {
    const attended = Number(attendedClasses);
    const total = Number(totalClasses);
    const target = Number(targetPercentage);

    if (!total || total <= 0 || target <= 0 || target > 100) {
      return {
        type: "invalid",
        value: 0,
        text: "Enter valid attendance details.",
      };
    }

    const currentPercentage = calculatePercentage(attended, total);

    if (currentPercentage < target) {
      const requiredClasses = Math.ceil(
        (target * total - 100 * attended) / (100 - target)
      );

      return {
        type: "attend",
        value: Math.max(requiredClasses, 0),
        text: `Attend the next ${Math.max(
          requiredClasses,
          0
        )} classes continuously to reach ${target}%.`,
      };
    }

    const missableClasses = Math.floor(
      (100 * attended - target * total) / target
    );

    return {
      type: "miss",
      value: Math.max(missableClasses, 0),
      text: `You can safely miss ${Math.max(
        missableClasses,
        0
      )} classes and still maintain ${target}%.`,
    };
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setMessage("");
  };

  const validateForm = () => {
    const total = Number(form.totalClasses);
    const attended = Number(form.attendedClasses);
    const target = Number(form.targetPercentage);

    if (!form.subject.trim()) {
      setMessage("Please enter the subject name.");
      return false;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setMessage("Total classes must be greater than 0.");
      return false;
    }

    if (!Number.isFinite(attended) || attended < 0) {
      setMessage("Attended classes cannot be negative.");
      return false;
    }

    if (attended > total) {
      setMessage("Attended classes cannot be greater than total classes.");
      return false;
    }

    if (!Number.isFinite(target) || target <= 0 || target > 100) {
      setMessage("Target percentage must be between 1 and 100.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const subjectData = {
      id: editingId || Date.now().toString(),
      subject: form.subject.trim(),
      totalClasses: Number(form.totalClasses),
      attendedClasses: Number(form.attendedClasses),
      targetPercentage: Number(form.targetPercentage),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setSubjects((previousSubjects) =>
        previousSubjects.map((subject) =>
          subject.id === editingId ? subjectData : subject
        )
      );

      setMessage("Attendance record updated successfully.");
    } else {
      setSubjects((previousSubjects) => [
        subjectData,
        ...previousSubjects,
      ]);

      setMessage("Attendance record added successfully.");
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);

    setForm({
      subject: subject.subject,
      totalClasses: String(subject.totalClasses),
      attendedClasses: String(subject.attendedClasses),
      targetPercentage: String(subject.targetPercentage),
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (subjectId) => {
    const shouldDelete = window.confirm(
      "Do you want to delete this attendance record?"
    );

    if (!shouldDelete) {
      return;
    }

    setSubjects((previousSubjects) =>
      previousSubjects.filter((subject) => subject.id !== subjectId)
    );

    if (editingId === subjectId) {
      setEditingId(null);
      setForm(emptyForm);
    }

    setMessage("Attendance record deleted.");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

const markPresent = (subjectId) => {
  const today = new Date().toISOString().split("T")[0];

  const attendanceToday = JSON.parse(
    localStorage.getItem(TODAY_KEY) || "{}"
  );

  if (attendanceToday[`${subjectId}-${today}`]) {
    alert("Attendance for this subject has already been marked today.");
    return;
  }

  attendanceToday[`${subjectId}-${today}`] = "Present";
  localStorage.setItem(
    TODAY_KEY,
    JSON.stringify(attendanceToday)
  );

  setSubjects((previousSubjects) =>
    previousSubjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            attendedClasses: subject.attendedClasses + 1,
            updatedAt: new Date().toISOString(),
          }
        : subject
    )
  );
};

const markAbsent = (subjectId) => {
  const today = new Date().toISOString().split("T")[0];

  const attendanceToday = JSON.parse(
    localStorage.getItem(TODAY_KEY) || "{}"
  );

  if (attendanceToday[`${subjectId}-${today}`]) {
    alert("Attendance for this subject has already been marked today.");
    return;
  }

  attendanceToday[`${subjectId}-${today}`] = "Absent";
  localStorage.setItem(
    TODAY_KEY,
    JSON.stringify(attendanceToday)
  );

  setSubjects((previousSubjects) =>
    previousSubjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            totalClasses: subject.totalClasses + 1,
            updatedAt: new Date().toISOString(),
          }
        : subject
    )
  );
};

  const overallStats = useMemo(() => {
    const totalClasses = subjects.reduce(
      (total, subject) => total + Number(subject.totalClasses),
      0
    );

    const attendedClasses = subjects.reduce(
      (total, subject) => total + Number(subject.attendedClasses),
      0
    );

    const percentage = calculatePercentage(
      attendedClasses,
      totalClasses
    );

    const safeSubjects = subjects.filter((subject) => {
      const percentageValue = calculatePercentage(
        subject.attendedClasses,
        subject.totalClasses
      );

      return percentageValue >= subject.targetPercentage;
    }).length;

    const riskSubjects = subjects.length - safeSubjects;

    return {
      totalClasses,
      attendedClasses,
      percentage,
      safeSubjects,
      riskSubjects,
    };
  }, [subjects]);

  const currentFormPercentage = calculatePercentage(
    form.attendedClasses,
    form.totalClasses
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-none dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-xl transition-colors dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/40 dark:shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
                <CalendarCheck size={15} />
                Academic Tracker
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Attendance Manager
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                Track subject-wise attendance, calculate your current
                percentage, and check how many classes you must attend or can
                safely miss.
              </p>
            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
              {overallStats.percentage}%
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Subjects"
            value={subjects.length}
            icon={<BookOpen size={20} />}
          />

          <StatCard
            label="Total Classes"
            value={overallStats.totalClasses}
            icon={<CalendarCheck size={20} />}
          />

          <StatCard
            label="Attended"
            value={overallStats.attendedClasses}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            label="Safe Subjects"
            value={overallStats.safeSubjects}
            icon={<TrendingUp size={20} />}
          />

          <StatCard
            label="At Risk"
            value={overallStats.riskSubjects}
            icon={<TrendingDown size={20} />}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80 dark:shadow-xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId
                    ? "Update Attendance"
                    : "Add Attendance Record"}
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Enter your subject attendance details.
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                {editingId ? <Edit3 size={22} /> : <Plus size={22} />}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Subject Name
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder="Example: DBMS"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="totalClasses"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Total Classes Conducted
                </label>

                <input
                  id="totalClasses"
                  name="totalClasses"
                  type="number"
                  min="1"
                  value={form.totalClasses}
                  onChange={handleInputChange}
                  placeholder="Example: 120"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="attendedClasses"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Classes Attended
                </label>

                <input
                  id="attendedClasses"
                  name="attendedClasses"
                  type="number"
                  min="0"
                  value={form.attendedClasses}
                  onChange={handleInputChange}
                  placeholder="Example: 90"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label
                  htmlFor="targetPercentage"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Target Attendance Percentage
                </label>

                <div className="relative">
                  <input
                    id="targetPercentage"
                    name="targetPercentage"
                    type="number"
                    min="1"
                    max="100"
                    value={form.targetPercentage}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition hover:border-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:border-white/20 dark:focus:border-cyan-400"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-cyan-700 dark:text-cyan-300">
                    %
                  </span>
                </div>
              </div>

              {form.totalClasses && form.attendedClasses !== "" && (
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Current attendance
                  </p>

                  <p className="mt-1 text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                    {currentFormPercentage}%
                  </p>
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  {editingId ? (
                    <>
                      <Save size={18} />
                      Update Record
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Record
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-slate-900/80 dark:shadow-xl sm:p-6">
            <div>
              <h2 className="text-xl font-semibold">
                Subject Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Mark each new class as present or absent.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {subjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center dark:border-white/10 dark:bg-slate-950/40">
                  <BookOpen
                    size={38}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-300">
                    No attendance records yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-500">
                    Add your first subject using the form.
                  </p>
                </div>
              ) : (
                subjects.map((subject) => {
                  const percentage = calculatePercentage(
                    subject.attendedClasses,
                    subject.totalClasses
                  );

                  const advice = calculateAttendanceAdvice(
                    subject.attendedClasses,
                    subject.totalClasses,
                    subject.targetPercentage
                  );

                  const isSafe =
                    percentage >= subject.targetPercentage;

                  return (
                    <article
                      key={subject.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-slate-950/60 dark:hover:bg-slate-950"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {subject.subject}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                isSafe
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                              }`}
                            >
                              {isSafe ? "Safe" : "At Risk"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Target: {subject.targetPercentage}%
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(subject)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            title="Edit attendance"
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(subject.id)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                            title="Delete attendance"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <MiniStat
                          label="Total"
                          value={subject.totalClasses}
                        />

                        <MiniStat
                          label="Attended"
                          value={subject.attendedClasses}
                        />

                        <MiniStat
                          label="Percentage"
                          value={`${percentage}%`}
                        />
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>Attendance progress</span>
                          <span>{percentage}%</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isSafe
                                ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                                : "bg-gradient-to-r from-red-500 to-orange-400"
                            }`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className={`mt-5 rounded-2xl border p-4 ${
                          advice.type === "attend"
                            ? "border-orange-500/20 bg-orange-500/10"
                            : "border-emerald-500/20 bg-emerald-500/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {advice.type === "attend" ? (
                            <TrendingUp
                              size={20}
                              className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-300"
                            />
                          ) : (
                            <TrendingDown
                              size={20}
                              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300"
                            />
                          )}

                          <div>
                            <p className="font-semibold">
                              {advice.type === "attend"
                                ? `${advice.value} classes required`
                                : `${advice.value} classes can be missed`}
                            </p>

                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                              {advice.text}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => markPresent(subject.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
                        >
                          <CheckCircle2 size={18} />
                          Mark Present
                        </button>

                        <button
                          type="button"
                          onClick={() => markAbsent(subject.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
                        >
                          <X size={18} />
                          Mark Absent
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>

        <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900">
      <p className="text-xs text-slate-600 dark:text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-200">{value}</p>
    </div>
  );
}

export default Attendance;