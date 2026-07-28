import { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Target,
  Building2,
  Save,
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
    const savedProfile = localStorage.getItem("campusPilotProfile");

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

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Student Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Update your academic and career details.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <User className="h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <Mail className="h-5 w-5 text-slate-500" />

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Branch
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <GraduationCap className="h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="Example: CSE"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Year
              </label>

              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                CGPA
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <BookOpen className="h-5 w-5 text-slate-500" />

                <input
                  type="number"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  placeholder="Example: 8.5"
                  min="0"
                  max="10"
                  step="0.01"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Dream Company
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <Building2 className="h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  name="dreamCompany"
                  value={profile.dreamCompany}
                  onChange={handleChange}
                  placeholder="Example: Microsoft"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Skills
              </label>

              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="Example: HTML, CSS, JavaScript, React"
                rows="4"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Interests
              </label>

              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4">
                <Target className="mt-3 h-5 w-5 text-slate-500" />

                <textarea
                  name="interests"
                  value={profile.interests}
                  onChange={handleChange}
                  placeholder="Example: AI, web development, cloud computing"
                  rows="4"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />

              {isSaving ? "Saving..." : "Save Profile"}
            </button>

            {message && (
              <p className="text-sm text-emerald-400">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}