import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  Check,
  Lock,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Volume2,
} from "lucide-react";

const defaultSettings = {
 
  answerStyle: "Simple",
  difficulty: "Medium",
  notifications: true,
  assignmentReminders: true,
  examReminders: true,
  soundEffects: true,
  voiceOutput: true,
  saveChatHistory: true,
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("campusPilotSettings");

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Unable to load settings:", error);
      }
    }
  }, []);

  const handleChange = (name, value) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "campusPilotSettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "campusPilotSettings",
      JSON.stringify(defaultSettings)
    );

    setSaved(false);
  };

  const ToggleSwitch = ({ enabled, onChange }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <SettingsIcon size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your AI, notification, voice and privacy preferences.
              </p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            <Check size={18} />
            Settings saved successfully.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* AI Preferences */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Bot size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  AI Preferences
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Customize how CampusPilot AI responds.
                </p>
              </div>
            </div>

            <div className="space-y-5">
       

              <div>
                <label
                  htmlFor="answerStyle"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Answer Style
                </label>

                <select
                  id="answerStyle"
                  value={settings.answerStyle}
                  onChange={(event) =>
                    handleChange("answerStyle", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Simple">Simple Explanation</option>
                  <option value="Detailed">Detailed Explanation</option>
                  <option value="Concise">Concise Answer</option>
                  <option value="Exam">Exam Preparation Style</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Default Difficulty
                </label>

                <select
                  id="difficulty"
                  value={settings.difficulty}
                  onChange={(event) =>
                    handleChange("difficulty", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Control reminders and alerts.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <SettingToggle
                title="Enable Notifications"
                description="Receive application notifications."
                enabled={settings.notifications}
                onChange={(value) =>
                  handleChange("notifications", value)
                }
                ToggleSwitch={ToggleSwitch}
              />

              <SettingToggle
                title="Assignment Reminders"
                description="Receive reminders before assignment deadlines."
                enabled={settings.assignmentReminders}
                onChange={(value) =>
                  handleChange("assignmentReminders", value)
                }
                ToggleSwitch={ToggleSwitch}
              />

              <SettingToggle
                title="Exam Reminders"
                description="Receive alerts for upcoming exams."
                enabled={settings.examReminders}
                onChange={(value) =>
                  handleChange("examReminders", value)
                }
                ToggleSwitch={ToggleSwitch}
              />
            </div>
          </section>

          {/* Voice and Sound */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Volume2 size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Voice and Sound
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage AI voice and sound preferences.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <SettingToggle
                title="AI Voice Output"
                description="Allow the chatbot to read responses aloud."
                enabled={settings.voiceOutput}
                onChange={(value) =>
                  handleChange("voiceOutput", value)
                }
                ToggleSwitch={ToggleSwitch}
              />

              <SettingToggle
                title="Sound Effects"
                description="Enable interface and notification sounds."
                enabled={settings.soundEffects}
                onChange={(value) =>
                  handleChange("soundEffects", value)
                }
                ToggleSwitch={ToggleSwitch}
              />
            </div>
          </section>

          {/* Privacy */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Shield size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Privacy
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage chat history and data preferences.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              <SettingToggle
                title="Save Chat History"
                description="Store chatbot conversations on this device."
                enabled={settings.saveChatHistory}
                onChange={(value) =>
                  handleChange("saveChatHistory", value)
                }
                ToggleSwitch={ToggleSwitch}
              />

              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Password and account protection settings.
                  </p>
                </div>

                <Lock
                  size={20}
                  className="text-slate-400"
                />
              </div>
            </div>
          </section>
        </div>

        {/* About */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                About CampusPilot AI
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                AI-powered academic companion for students.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Version 1.0.0
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                CampusPilot AI
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Save size={17} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({
  title,
  description,
  enabled,
  onChange,
  ToggleSwitch,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
  );
};

export default Settings;