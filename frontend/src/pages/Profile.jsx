import { useEffect, useState } from "react";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Mail,
  Save,
  Target,
  User,
} from "lucide-react";

const initialProfile = {
  fullName: "",
  email: "",
  branch: "",
  year: "",
  cgpa: "",
  skills: "",
  interests: "",
  dreamCompany: "",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(
      "campusPilotProfile"
    );

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Profile load error:", error);
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");

    localStorage.setItem(
      "campusPilotProfile",
      JSON.stringify(profile)
    );

    setTimeout(() => {
      setIsSaving(false);
      setMessage("Profile saved successfully.");
    }, 500);
  };

  const fieldWrapperClass =
    "flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 transition-all duration-300 hover:border-slate-400 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:focus-within:border-violet-500 dark:focus-within:bg-slate-900";

  const inputClass =
    "w-full bg-transparent py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-violet-50 px-4 py-8 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <User size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Student Profile
              </h1>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Update your academic and career details.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Full Name
              </label>

              <div className={fieldWrapperClass}>
                <User className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email
              </label>

              <div className={fieldWrapperClass}>
                <Mail className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Branch
              </label>

              <div className={fieldWrapperClass}>
                <GraduationCap className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="Example: CSE"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Year
              </label>

              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-300 hover:border-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600 dark:focus:border-violet-500 dark:focus:bg-slate-900"
              >
                <option value="">Select year</option>
                <option value="1st Year">
                  1st Year
                </option>
                <option value="2nd Year">
                  2nd Year
                </option>
                <option value="3rd Year">
                  3rd Year
                </option>
                <option value="4th Year">
                  4th Year
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                CGPA
              </label>

              <div className={fieldWrapperClass}>
                <BookOpen className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <input
                  type="number"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  placeholder="Example: 8.5"
                  min="0"
                  max="10"
                  step="0.01"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Dream Company
              </label>

              <div className={fieldWrapperClass}>
                <Building2 className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <input
                  type="text"
                  name="dreamCompany"
                  value={profile.dreamCompany}
                  onChange={handleChange}
                  placeholder="Example: Microsoft"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Skills
              </label>

              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Example: HTML, CSS, JavaScript, React"
                rows="4"
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:hover:border-slate-600 dark:focus:border-violet-500 dark:focus:bg-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Interests
              </label>

              <div className="flex items-start gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 transition-all duration-300 hover:border-slate-400 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:focus-within:border-violet-500 dark:focus-within:bg-slate-900">
                <Target className="mt-3 h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />

                <textarea
                  name="interests"
                  value={profile.interests}
                  onChange={handleChange}
                  placeholder="Example: AI, web development, cloud computing"
                  rows="4"
                  className="w-full resize-y bg-transparent py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              <Save className="h-5 w-5" />

              {isSaving
                ? "Saving..."
                : "Save Profile"}
            </button>

            {message && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}