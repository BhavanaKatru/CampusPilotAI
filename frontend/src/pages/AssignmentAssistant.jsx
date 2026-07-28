 import { useEffect, useMemo, useState } from "react";
 import Calendar from "react-calendar";
import {
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"; 

import DashboardLayout from "../layouts/DashboardLayout";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${BASE_URL}/api/assignments`;
const initialForm = {
  title: "",
  subject: "",
  dueDate: "",
  priority: "Medium",
};

function AssignmentAssistant() {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [aiPlan, setAiPlan] = useState(null);
const [planLoading, setPlanLoading] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

const [statusFilter, setStatusFilter] = useState("All");

const [sortBy, setSortBy] = useState("Newest");
  const fetchAssignments = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch assignments");
      }

      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };
  const generateAssignmentPlan = async () => {
  if (
    !formData.title ||
    !formData.subject ||
    !formData.dueDate
  ) {
    setMessage(
      "First enter assignment title, subject and due date."
    );
    return;
  }

  setPlanLoading(true);
  setMessage("");
  setAiPlan(null);

  try {
    const response = await fetch(
      `${API_URL}/api/assignment-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate AI plan."
      );
    }

    setAiPlan(data.plan);
    setMessage("AI assignment plan generated.");
  } catch (error) {
    setMessage(error.message);
  } finally {
    setPlanLoading(false);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  ...formData,
  aiOverview: aiPlan?.overview || "",
  milestones: aiPlan?.milestones || [],
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Assignment operation failed");
      }

      setMessage(
        editingId
          ? "Assignment updated successfully"
          : "Assignment added successfully"
      );

      resetForm();
      await fetchAssignments();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment._id);

    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate?.slice(0, 10) || "",
      priority: assignment.priority || "Medium",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete assignment");
      }

      setMessage("Assignment deleted successfully");
      await fetchAssignments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleMilestone = async (
  assignmentId,
  milestoneId
) => {
  try {
    const response = await fetch(
     `${API_URL}/api/assignments/${assignmentId}/milestones/${milestoneId}/toggle`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update milestone.");
    }

    await fetchAssignments();
  } catch (error) {
    setMessage(error.message);
  }
};

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      await fetchAssignments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const isOverdue = (assignment) => {
    if (assignment.status === "Completed") {
      return false;
    }

    const dueDate = new Date(assignment.dueDate);
    const today = new Date();

    dueDate.setHours(23, 59, 59, 999);

    return dueDate < today;
  };

  const stats = useMemo(() => {
    const total = assignments.length;

    const completed = assignments.filter(
      (assignment) => assignment.status === "Completed"
    ).length;

    const overdue = assignments.filter(isOverdue).length;

    const pending = total - completed;

    return {
      total,
      pending,
      completed,
      overdue,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.subject
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesFilter = true;

      if (filter === "Pending") {
        matchesFilter =
          assignment.status === "Pending" &&
          !isOverdue(assignment);
      }

      if (filter === "Completed") {
        matchesFilter = assignment.status === "Completed";
      }

      if (filter === "Overdue") {
        matchesFilter = isOverdue(assignment);
      }

      return matchesSearch && matchesFilter;
    });
  }, [assignments, searchTerm, filter]);
  let sortedAssignments = [...filteredAssignments];

switch (sortBy) {
  case "Oldest":
    sortedAssignments.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    break;

  case "Due Date":
    sortedAssignments.sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
    break;

  case "Priority": {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    sortedAssignments.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
    break;
  }

  default:
    sortedAssignments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}
const assignmentsForSelectedDate = assignments.filter((assignment) => {
  const assignmentDate = new Date(assignment.dueDate);
  const selected = new Date(selectedDate);

  return (
    assignmentDate.getFullYear() === selected.getFullYear() &&
    assignmentDate.getMonth() === selected.getMonth() &&
    assignmentDate.getDate() === selected.getDate()
  );
});
const getDueLabel = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference =
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (difference < 0) return "Overdue";
  if (difference === 0) return "Due Today";
  if (difference === 1) return "Due Tomorrow";

  return null;
};
  const getStatusLabel = (assignment) => {
    if (assignment.status === "Completed") {
      return "Completed";
    }

    if (isOverdue(assignment)) {
      return "Overdue";
    }

    return "Pending";
  };

  const getStatusClasses = (assignment) => {
    const label = getStatusLabel(assignment);

    if (label === "Completed") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (label === "Overdue") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const getPriorityClasses = (priority) => {
    if (priority === "High") {
      return "bg-red-500/10 text-red-400";
    }

    if (priority === "Low") {
      return "bg-emerald-500/10 text-emerald-400";
    }

    return "bg-amber-500/10 text-amber-400";
  };
  const getDueDateStatus = (dueDate, status) => {
  if (status === "Completed") {
    return {
      label: "Completed",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const differenceInDays = Math.ceil(
    (due - today) / (1000 * 60 * 60 * 24)
  );

  if (differenceInDays < 0) {
    return {
      label: "Overdue",
      className:
        "border-red-500/30 bg-red-500/10 text-red-400",
    };
  }

  if (differenceInDays === 0) {
    return {
      label: "Due Today",
      className:
        "border-orange-500/30 bg-orange-500/10 text-orange-400",
    };
  }

  if (differenceInDays === 1) {
    return {
      label: "Due Tomorrow",
      className:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    };
  }

  if (differenceInDays <= 3) {
    return {
      label: `${differenceInDays} Days Left`,
      className:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    };
  }

  return {
    label: `${differenceInDays} Days Left`,
    className:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  };
};const totalAssignments = assignments.length;

const completedAssignments = assignments.filter(
  (assignment) => assignment.status === "Completed"
).length;

const pendingAssignments = assignments.filter(
  (assignment) => assignment.status !== "Completed"
).length;

const overdueAssignments = assignments.filter((assignment) => {
  if (assignment.status === "Completed") return false;

  const today = new Date();
  const due = new Date(assignment.dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today;
}).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 p-5 text-white sm:p-7 lg:p-8">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
              <ClipboardList size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Assignment Assistant
              </h1>
   

              <p className="mt-1 text-sm text-slate-400">
                Manage deadlines, priorities and assignment progress.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-2 text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm text-amber-300">Pending</p>
            <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm text-emerald-300">Completed</p>
            <p className="mt-2 text-3xl font-bold">
              {stats.completed}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-red-300">Overdue</p>
            <p className="mt-2 text-3xl font-bold">{stats.overdue}</p>
          </div>
        </section>
        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
    <h2 className="text-xl font-semibold">Assignment Calendar</h2>

    <p className="mt-1 text-sm text-slate-400">
      Select a date to view assignments due on that day.
    </p>

    <div className="mt-5 overflow-hidden rounded-xl bg-white p-3 text-slate-900">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />
    </div>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
    <h2 className="text-xl font-semibold">
      {selectedDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Assignments due on the selected date.
    </p>

    <div className="mt-5 space-y-3">
      {assignmentsForSelectedDate.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">
          No assignments due on this date.
        </div>
      ) : (
        assignmentsForSelectedDate.map((assignment) => (
          <div
            key={assignment._id}
            className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">
                  {assignment.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {assignment.subject}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                  assignment
                )}`}
              >
                {getStatusLabel(assignment)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Assignment" : "Add Assignment"}
              </h2>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                  <XCircle size={17} />
                  Cancel
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300">
                  Assignment Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Example: DBMS Record"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Example: DBMS"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button
  type="button"
  onClick={generateAssignmentPlan}
  disabled={planLoading}
  className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 font-semibold text-violet-300 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
>
  {planLoading
    ? "Generating AI Plan..."
    : "Generate AI Plan"}
</button>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Assignment"
                  : "Add Assignment"}
              </button>

              {message && (
                <p className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-300">
                  {message}
                </p>
              )}
              

{aiPlan && (
  <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
    <h3 className="font-semibold text-violet-300">
      AI Assignment Plan
    </h3>

    <p className="mt-2 text-sm text-slate-300">
      {aiPlan.overview}
    </p>

    <div className="mt-4 space-y-3">
      {aiPlan.milestones.map((milestone, index) => (
        <div
          key={`${milestone.day}-${index}`}
          className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
        >
          <p className="text-sm font-semibold text-cyan-400">
            {milestone.day}
          </p>

       <div className="mt-2 flex items-center justify-between gap-3">
  <p
    className={`text-sm ${
      milestone.completed
        ? "line-through text-slate-500"
        : "text-slate-300"
    }`}
  >
    {milestone.task}
  </p>

  <div className="rounded-lg bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
  Preview
</div>
</div>
        </div>
      ))}
    </div>
  </div>
)}

            </div>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Your Assignments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and update your academic tasks.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search assignments..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 lg:w-64"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Pending", "Completed", "Overdue"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      filter === item
                        ? "bg-cyan-500 text-slate-950"
                        : "border border-white/10 bg-slate-900/70 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
  <input
    type="text"
    placeholder="Search assignments..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
  >
    <option>All</option>
    <option>Pending</option>
    <option>Completed</option>
    <option>Overdue</option>
  </select>
  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
>
  <option>Newest</option>
  <option>Oldest</option>
  <option>Due Date</option>
  <option>Priority</option>
</select>
</div>

            <div className="mt-6 space-y-4">
              {filteredAssignments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
                  <ClipboardList
                    size={40}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-slate-400">
                    No assignments found.
                  </p>
                </div>
              ) : (
                sortedAssignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            assignment.status === "Completed"
                              ? "text-slate-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {assignment.title}
                          {getDueLabel(assignment.dueDate) && (
  <span
    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      getDueLabel(assignment.dueDate) === "Overdue"
        ? "bg-red-500/20 text-red-400"
        : getDueLabel(assignment.dueDate) === "Due Today"
        ? "bg-orange-500/20 text-orange-400"
        : "bg-yellow-500/20 text-yellow-300"
    }`}
  >
    {getDueLabel(assignment.dueDate)}
  </span>
)}
                        </h3>

            
                        <p className="mt-1 text-sm text-slate-400">
                          {assignment.subject}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${getPriorityClasses(
                            assignment.priority
                          )}`}
                        >
                          {assignment.priority} Priority
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                            assignment
                          )}`}
                        >
                          {getStatusLabel(assignment)}
                        </span>
                      </div>
                    </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
  <p className="text-sm text-slate-400">
    Due:{" "}
    {new Date(assignment.dueDate).toLocaleDateString()}
  </p>

  <span
    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
      getDueDateStatus(
        assignment.dueDate,
        assignment.status
      ).className
    }`}
  >
    {
      getDueDateStatus(
        assignment.dueDate,
        assignment.status
      ).label
    }
  </span>
</div>
                    {assignment.aiOverview && (
  <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
    <h4 className="font-semibold text-violet-300">
      AI Assignment Plan
    </h4>

    <p className="mt-2 text-sm text-slate-300">
      {assignment.aiOverview}
    </p>{Array.isArray(assignment.milestones) &&
  assignment.milestones.length > 0 && (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Milestone Progress
        </span>

        <span className="font-semibold text-cyan-400">
          {Math.round(
            (assignment.milestones.filter(
              (milestone) => milestone.completed
            ).length /
              assignment.milestones.length) *
              100
          )}
          %
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-300"
          style={{
            width: `${Math.round(
              (assignment.milestones.filter(
                (milestone) => milestone.completed
              ).length /
                assignment.milestones.length) *
                100
            )}%`,
          }}
        />
      </div>
    </div>
  )}

    {Array.isArray(assignment.milestones) &&
      assignment.milestones.length > 0 && (
        <div className="mt-4 space-y-2">
          {assignment.milestones.map(
            (milestone, index) => (
             <div
  key={milestone._id || `${assignment._id}-${index}`}
  className="rounded-lg border border-white/10 bg-slate-950/50 p-3"
>
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1">
      <p className="text-sm font-semibold text-cyan-400">
        {milestone.day}
      </p>

      <p
        className={`mt-1 text-sm ${
          milestone.completed
            ? "text-slate-500 line-through"
            : "text-slate-300"
        }`}
      >
        {milestone.task}
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        toggleMilestone(
          assignment._id,
          milestone._id
        )
      }
      className={`rounded-lg p-2 transition ${
        milestone.completed
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
      }`}
      title={
        milestone.completed
          ? "Mark milestone pending"
          : "Mark milestone complete"
      }
    >
      <CheckSquare size={18} />
    </button>
  </div>
</div>
            )
          )}
        </div>
      )}
  </div>
)}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(assignment._id)
                        }
                        className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/20"
                      >
                        <CheckCircle2 size={16} />

                        {assignment.status === "Completed"
                          ? "Mark Pending"
                          : "Mark Complete"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/20"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(assignment._id)
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AssignmentAssistant;