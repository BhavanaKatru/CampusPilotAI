import { useState, useEffect, useMemo } from "react";
import {
  User,
  Target,
  Briefcase,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  Laptop,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const STORAGE_KEY = "campuspilot-career-mentor";

const careerOptions = [
  "Software Engineer",
  "Full Stack Developer",
  "AI / ML Engineer",
  "Data Scientist",
  "Cyber Security Engineer",
  "Cloud Engineer",
  "UI / UX Designer",
  "DevOps Engineer",
];
const learningResourcesData = {

  "Software Engineer":[
    {
      title:"freeCodeCamp Web Development",
      url:"https://www.youtube.com/@freecodecamp"
    },
    {
      title:"Roadmap.sh",
      url:"https://roadmap.sh/full-stack"
    },
    {
      title:"LeetCode",
      url:"https://leetcode.com/problemset/"
    },
    {
      title:"GeeksforGeeks",
      url:"https://www.geeksforgeeks.org/"
    },
  ],

  "Full Stack Developer":[
    {
      title:"React Course",
      url:"https://react.dev/learn"
    },
    {
      title:"Node.js Docs",
      url:"https://nodejs.org/docs/latest/api/"
    },
    {
      title:"MongoDB Learn",
      url:"https://learn.mongodb.com/"
    },
    {
      title:"Full Stack Roadmap",
      url:"https://roadmap.sh/full-stack"
    },
  ],

  "AI / ML Engineer":[
    {
      title:"Python for Everybody",
      url:"https://www.py4e.com/"
    },
    {
      title:"Machine Learning Specialization",
      url:"https://www.coursera.org/specializations/machine-learning-introduction"
    },
    {
      title:"TensorFlow",
      url:"https://www.tensorflow.org/learn"
    },
    {
      title:"DeepLearning.AI",
      url:"https://www.deeplearning.ai/"
    },
  ],

  "Data Scientist":[
    {
      title:"Pandas",
      url:"https://pandas.pydata.org/docs/"
    },
    {
      title:"NumPy",
      url:"https://numpy.org/learn/"
    },
    {
      title:"Kaggle Learn",
      url:"https://www.kaggle.com/learn"
    },
    {
      title:"Power BI",
      url:"https://learn.microsoft.com/power-bi/"
    },
  ],

  "Cyber Security Engineer":[
    {
      title:"TryHackMe",
      url:"https://tryhackme.com/"
    },
    {
      title:"Hack The Box",
      url:"https://www.hackthebox.com/"
    },
    {
      title:"OWASP",
      url:"https://owasp.org/"
    },
    {
      title:"Kali Linux",
      url:"https://www.kali.org/docs/"
    },
  ],

  "Cloud Engineer":[
    {
      title:"AWS Skill Builder",
      url:"https://skillbuilder.aws/"
    },
    {
      title:"Azure Learn",
      url:"https://learn.microsoft.com/training/azure/"
    },
    {
      title:"Docker Docs",
      url:"https://docs.docker.com/"
    },
    {
      title:"Kubernetes Docs",
      url:"https://kubernetes.io/docs/home/"
    },
  ],

  "UI / UX Designer":[
    {
      title:"Figma Learn",
      url:"https://help.figma.com/"
    },
    {
      title:"Google UX",
      url:"https://grow.google/certificates/ux-design/"
    },
    {
      title:"Dribbble",
      url:"https://dribbble.com/"
    },
    {
      title:"Behance",
      url:"https://www.behance.net/"
    },
  ],

  "DevOps Engineer":[
    {
      title:"Docker",
      url:"https://docs.docker.com/"
    },
    {
      title:"Jenkins",
      url:"https://www.jenkins.io/doc/"
    },
    {
      title:"GitHub Actions",
      url:"https://docs.github.com/actions"
    },
    {
      title:"Kubernetes",
      url:"https://kubernetes.io/docs/home/"
    },
  ]

};


const roadmapData = {
  "Software Engineer": {
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "SQL",
      "Git",
    ],
    certifications: [
      "Meta Front-End",
      "AWS Cloud Practitioner",
      "MongoDB Associate",
    ],
    projects: [
      "Portfolio Website",
      "CampusPilot AI",
      "Task Manager",
      "Chat Application",
    ],
  },
  "Full Stack Developer": {
  technologies: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Git",
    "REST APIs",
  ],
  certifications: [
    "Meta Full Stack",
    "MongoDB Associate",
    "AWS Cloud Practitioner",
  ],
  projects: [
    "E-Commerce Website",
    "Food Delivery App",
    "Hospital Management",
    "Social Media App",
  ],
},
"AI / ML Engineer": {
  technologies: [
    "Python",
    "NumPy",
    "Pandas",
    "Matplotlib",
    "Scikit-Learn",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
  ],
  certifications: [
    "IBM AI",
    "Google ML",
    "DeepLearning.AI",
  ],
  projects: [
    "Face Recognition",
    "Chatbot",
    "Spam Detection",
    "Recommendation System",
  ],
},
"Data Scientist": {
  technologies: [
    "Python",
    "SQL",
    "Power BI",
    "Tableau",
    "Pandas",
    "Machine Learning",
  ],
  certifications: [
    "Google Data Analytics",
    "IBM Data Science",
  ],
  projects: [
    "Sales Dashboard",
    "Customer Analysis",
    "Stock Prediction",
    "Movie Recommendation",
  ],
},
"Cyber Security Engineer": {
  technologies: [
    "Linux",
    "Networking",
    "Kali Linux",
    "Python",
    "Wireshark",
    "Burp Suite",
  ],
  certifications: [
    "CEH",
    "CompTIA Security+",
  ],
  projects: [
    "Password Strength Checker",
    "Network Scanner",
    "Malware Detector",
  ],
},
"Cloud Engineer": {
  technologies: [
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Linux",
  ],
  certifications: [
    "AWS Solutions Architect",
    "Azure Fundamentals",
  ],
  projects: [
    "Cloud Deployment",
    "CI/CD Pipeline",
    "Dockerized App",
  ],
},
"UI / UX Designer": {
  technologies: [
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
  ],
  certifications: [
    "Google UX Design",
  ],
  projects: [
    "Mobile App Design",
    "Portfolio Design",
    "Dashboard UI",
  ],
},
"DevOps Engineer": {
  technologies: [
    "Docker",
    "Kubernetes",
    "Linux",
    "Jenkins",
    "GitHub Actions",
  ],
  certifications: [
    "Docker Associate",
    "AWS DevOps Engineer",
  ],
  projects: [
    "CI/CD Pipeline",
    "Monitoring Dashboard",
    "Container Deployment",
  ],
},
};
const aiRecommendations = {
  "Software Engineer": [
    "Master Data Structures & Algorithms.",
    "Build 3 full-stack projects.",
    "Practice 150+ LeetCode problems.",
    "Learn System Design basics.",
  ],

  "Full Stack Developer": [
    "Build responsive React applications.",
    "Learn Express.js and MongoDB.",
    "Deploy projects on Vercel or Render.",
    "Create a professional portfolio.",
  ],

  "AI / ML Engineer": [
    "Strengthen Python fundamentals.",
    "Learn TensorFlow or PyTorch.",
    "Build an AI chatbot project.",
    "Complete IBM AI Certification.",
  ],

  "Data Scientist": [
    "Master SQL and Python.",
    "Practice data visualization.",
    "Build predictive analytics projects.",
    "Learn Power BI dashboards.",
  ],

  "Cyber Security Engineer": [
    "Practice networking fundamentals.",
    "Use TryHackMe regularly.",
    "Learn Linux deeply.",
    "Build security analysis projects.",
  ],

  "Cloud Engineer": [
    "Learn AWS core services.",
    "Practice Docker & Kubernetes.",
    "Deploy cloud applications.",
    "Complete AWS certification.",
  ],

  "UI / UX Designer": [
    "Create Figma case studies.",
    "Build a portfolio.",
    "Practice user research.",
    "Learn accessibility guidelines.",
  ],

  "DevOps Engineer": [
    "Master Docker.",
    "Learn Kubernetes.",
    "Practice CI/CD pipelines.",
    "Deploy apps using GitHub Actions.",
  ],
};
const skillChecklistData = {
  "Software Engineer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Git",
  ],

  "Full Stack Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "REST API",
    "Git",
  ],

  "AI / ML Engineer": [
    "Python",
    "NumPy",
    "Pandas",
    "Scikit-Learn",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
  ],

  "Data Scientist": [
    "Python",
    "SQL",
    "Pandas",
    "Power BI",
    "Tableau",
    "Machine Learning",
  ],

  "Cyber Security Engineer": [
    "Linux",
    "Networking",
    "Kali Linux",
    "Wireshark",
    "Burp Suite",
    "Python",
  ],

  "Cloud Engineer": [
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Linux",
  ],

  "UI / UX Designer": [
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Wireframing",
    "Prototyping",
  ],

  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "Linux",
    "Jenkins",
    "GitHub Actions",
  ],
};
const defaultProfile = {
  fullName: "",
  branch: "",
  year: "",
  cgpa: "",
  interests: "",
  skills: "",
  dreamCompany: "",
  careerGoal: "Software Engineer",
};

export default function CareerMentor() {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(defaultProfile);

  const [completedSkills, setCompletedSkills] = useState([]);

  const [weeklyGoals, setWeeklyGoals] = useState([]);

  const [internshipStatus, setInternshipStatus] =
    useState("Not Applied");

  const [achievement, setAchievement] = useState({
    projects: 0,
    certificates: 0,
    hackathons: 0,
    github: "",
    linkedin: "",
  });
  const [careerPlan, setCareerPlan] = useState(null);
const [isGenerating, setIsGenerating] = useState(false);
const [careerPlanError, setCareerPlanError] = useState("");

useEffect(() => {
  const savedCareerProfile = localStorage.getItem(STORAGE_KEY);
  const savedStudentProfile = localStorage.getItem("campusPilotProfile");

  if (savedCareerProfile) {
    setProfile(JSON.parse(savedCareerProfile));
  } else if (savedStudentProfile) {
    const student = JSON.parse(savedStudentProfile);

    setProfile((prev) => ({
      ...prev,
      fullName: student.fullName || "",
      branch: student.branch || "",
      year: student.year || "",
      cgpa: student.cgpa || "",
      skills: student.skills || "",
      interests: student.interests || "",
      dreamCompany: student.dreamCompany || "",
      email: student.email || "",
    }));
  }
}, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profile,
        completedSkills,
        weeklyGoals,
        internshipStatus,
        achievement,
      })
    );
  }, [
    profile,
    completedSkills,
    weeklyGoals,
    internshipStatus,
    achievement,
  ]);

const currentSkills =
  skillChecklistData[profile.careerGoal] || [];

const progress = useMemo(() => {
  if (currentSkills.length === 0) return 0;

  return Math.round(
    (completedSkills.length / currentSkills.length) * 100
  );
}, [completedSkills, currentSkills]);
  const roadmap =
  
    roadmapData[profile.careerGoal];
    const recommendations =
  aiRecommendations[profile.careerGoal] || [];
  const placementReadiness = useMemo(() => {
  const completedRelevantSkills = currentSkills.filter((skill) =>
    completedSkills.includes(skill)
  ).length;

  const skillScore =
    currentSkills.length > 0
      ? (completedRelevantSkills / currentSkills.length) * 70
      : 0;

  const profileFields = [
    profile.fullName,
    profile.branch,
    profile.year,
    profile.cgpa,
    profile.skills,
    profile.interests,
    profile.dreamCompany,
  ];

  const completedProfileFields = profileFields.filter(
    (field) => String(field || "").trim() !== ""
  ).length;

  const profileScore =
    (completedProfileFields / profileFields.length) * 30;

  return Math.min(100, Math.round(skillScore + profileScore));
}, [currentSkills, completedSkills, profile]);
const readinessMessage =
  placementReadiness >= 80
    ? "Excellent! You are close to placement readiness."
    : placementReadiness >= 60
    ? "Good progress. Complete the remaining skills and projects."
    : placementReadiness >= 40
    ? "You are improving. Focus on core skills and certifications."
    : "Complete your profile and start learning the recommended skills.";

  const toggleSkill = (skill) => {
    setCompletedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };
  const generateAICareerPlan = async () => {
  try {
    setIsGenerating(true);
    setCareerPlanError("");

    const response = await fetch(
     `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/career-mentor/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          completedSkills,
          requiredSkills: currentSkills,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to generate career plan"
      );
    }

    setCareerPlan(data.careerPlan);
  } catch (error) {
    setCareerPlanError(error.message);
  } finally {
    setIsGenerating(false);
  }
};

  const updateProfile = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAchievement = (e) => {
    const { name, value } = e.target;

    setAchievement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleWeeklyGoal = (id) => {
    setWeeklyGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: !goal.completed,
            }
          : goal
      )
    );
  };

  return (
  
  <div
  className={`min-h-screen transition-colors duration-300 ${
    isDark
      ? "bg-slate-950 text-white"
      : "bg-slate-100 text-slate-900"
  }`}
>
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8">
      <h1
  className={`text-4xl font-bold ${
    isDark ? "text-cyan-400" : "text-cyan-600"
  }`}
>
          Career Mentor
        </h1>

       <p
  className={`mt-2 ${
    isDark ? "text-slate-400" : "text-slate-600"
  }`}
>
          Build your career with AI guidance.
        </p>
      </div>

     <div
  className={`rounded-3xl border p-6 transition-all duration-300 ${
    isDark
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white shadow-sm"
  }`}
>
       <h2
  className={`mb-6 flex items-center gap-2 text-2xl font-bold ${
    isDark ? "text-white" : "text-slate-900"
  }`}
> <User className="text-cyan-400" />
          Student Profile
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className= {`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={updateProfile}
              placeholder="Enter your full name"
           className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`}     />
          </div>

          <div>
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Branch
            </label>

            <input
              type="text"
              name="branch"
              value={profile.branch}
              onChange={updateProfile}
              placeholder="CSE / IT / ECE"
            className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`}   />
          </div>

          <div>
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Current Year
            </label>

            <input
              type="text"
              name="year"
              value={profile.year}
              onChange={updateProfile}
              placeholder="1st Year"
             className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`}     />
          </div>

          <div>
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              CGPA
            </label>

            <input
              type="text"
              name="cgpa"
              value={profile.cgpa}
              onChange={updateProfile}
              placeholder="8.5"
             className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`}   />
          </div>

          <div>
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={updateProfile}
              placeholder="React, Python..."
             className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`}  />
          </div>

          <div>
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Interests
            </label>

            <input
              type="text"
              name="interests"
              value={profile.interests}
              onChange={updateProfile}
              placeholder="AI, Web Development"
             className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`} />
          </div>

          <div className="md:col-span-2">
            <label className={`mb-2 block text-sm ${
  isDark ? "text-slate-400" : "text-slate-600"
}`}>
              Dream Company
            </label>

            <input
              type="text"
              name="dreamCompany"
              value={profile.dreamCompany}
              onChange={updateProfile}
              placeholder="Google, Microsoft..."
             className={`w-full rounded-xl border p-3 outline-none transition ${
  isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white"
}`} />
          </div>

        </div>

      </div>

    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
      <Target className="text-cyan-400" />
     <p className="text-sm text-slate-600 dark:text-slate-400">
Career Goal
</p>

<p className="mt-2 text-lg font-semibold text-white break-words">
{profile.careerGoal}
</p>
    </h2>

    <label className="mb-2 block text-sm text-slate-400">
      Select your target role
    </label>

    <select
      name="careerGoal"
      value={profile.careerGoal}
      onChange={updateProfile}
     className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-lg text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/10">
      {careerOptions.map((career) => (
  <option
    key={career}
    value={career}
    className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
  >
    {career}
  </option>
))}
    </select>

    <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-500/20 dark:bg-cyan-500/10">
     <p className="text-sm text-slate-600 dark:text-slate-400">
        Selected Career
      </p>

      <h3 className="mt-1 text-xl font-semibold text-cyan-700 dark:text-cyan-300">
        {profile.careerGoal}
      </h3>
    </div>
  </div>

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
      <Sparkles className="text-yellow-400" />
      AI Career Roadmap
    </h2>

    <div>
      <h3 className="mb-3 font-semibold text-cyan-300">
        Required Technologies
      </h3>

      <div className="flex flex-wrap gap-2">
        {roadmap?.technologies?.map((tech) => (
          <span
            key={tech}
           className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"  >
            {tech}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <h3 className="mb-3 font-semibold text-yellow-300">
        Recommended Certifications
      </h3>

      <div className="space-y-2">
        {roadmap?.certifications?.map((certificate) => (
          <div
            key={certificate}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {certificate}
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <h3 className="mb-3 font-semibold text-green-300">
        Project Ideas
      </h3>

      <div className="space-y-2">
        {roadmap?.projects?.map((project) => (
          <div
            key={project}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {project}
          </div>
        ))}
      </div>
    </div>
  </div>
<div className="col-span-full mt-8 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
        <BookOpen className="text-cyan-500 dark:text-cyan-400" />
        Learning Resources
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Recommended platforms for learning and skill improvement.
      </p>
    </div>

    <span className="inline-flex w-fit items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
      {learningResourcesData[profile.careerGoal]?.length || 0} Resources
    </span>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {(learningResourcesData[profile.careerGoal] || []).map(
      (resource) => (
        <a
          key={resource.title}
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600 transition group-hover:scale-105 dark:bg-cyan-500/10 dark:text-cyan-400">
              <Laptop size={22} />
            </div>

            <ExternalLink
              size={18}
              className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-300"
            />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
            {resource.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Open learning platform
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-300">
            Open Resource
            <ExternalLink size={15} />
          </div>
        </a>
      )
    )}

</div>
  </div>

 <div className="col-span-full mt-8 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Skill Progress Tracker
      </h2>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Track skills required for {profile.careerGoal}
      </p>
    </div>

    <div className="w-fit rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
      {progress}%
    </div>
  </div>

  <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
    <div
      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>

  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {currentSkills.map((skill) => {
      const isCompleted = completedSkills.includes(skill);

      return (
        <button
          key={skill}
          type="button"
          onClick={() => toggleSkill(skill)}
          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
            isCompleted
              ? "border-emerald-300 bg-emerald-50 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10"
              : "border-slate-200 bg-slate-50 hover:border-violet-400 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-500/50 dark:hover:bg-slate-900"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          )}

          <span
            className={
              isCompleted
                ? "font-medium text-emerald-700 dark:text-emerald-300"
                : "font-medium text-slate-700 dark:text-slate-200"
            }
          >
            {skill}
          </span>
        </button>
      );
    })}
  </div>
</div>
<div className="col-span-full mt-8 w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <TrendingUp className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Placement Readiness
        </h2>
      </div>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
        {readinessMessage}
      </p>
    </div>

    <div className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-violet-200 bg-violet-50 shadow-sm dark:border-violet-500/30 dark:bg-slate-950 sm:h-28 sm:w-28 lg:mx-0">
      <div className="text-center">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {placementReadiness}%
        </p>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Ready
        </p>
      </div>
    </div>
  </div>

  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
    <div
      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
      style={{ width: `${placementReadiness}%` }}
    />
  </div>

  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <div className="min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Career Goal
      </p>

      <p className="mt-2 break-words font-medium text-slate-900 dark:text-white">
        {profile.careerGoal}
      </p>
    </div>

    <div className="min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Skills Completed
      </p>

      <p className="mt-2 font-medium text-slate-900 dark:text-white">
        {
          currentSkills.filter((skill) =>
            completedSkills.includes(skill)
          ).length
        }
        /{currentSkills.length}
      </p>
    </div>

    <div className="min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Dream Company
      </p>

      <p className="mt-2 break-words font-medium text-slate-900 dark:text-white">
        {profile.dreamCompany || "Not added"}
      </p>
    </div>
  </div>
</div>
 <div className="col-span-full mt-8 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
        <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        AI Recommendations
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Personalized guidance for your selected career path.
      </p>
    </div>

    <span className="w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
      {recommendations.length} Suggestions
    </span>
  </div>

  <div className="mt-5 grid gap-3 md:grid-cols-2">
    {recommendations.map((item) => (
      <div
        key={item}
        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-violet-500/40 dark:hover:bg-slate-900"
      >
        <div className="mt-0.5 rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <Sparkles className="h-4 w-4" />
        </div>

        <p className="leading-6">{item}</p>
      </div>
    ))}
  </div>

  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
    <button
      type="button"
      onClick={generateAICareerPlan}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Sparkles className="h-5 w-5" />

      {isGenerating
        ? "Generating Career Plan..."
        : "Generate AI Career Plan"}
    </button>

    {isGenerating && (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Creating a personalized roadmap based on your profile.
      </p>
    )}
  </div>

  {careerPlanError && (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      {careerPlanError}
    </div>
  )}
</div>
 {careerPlan && (
  <div className="col-span-full mt-8 w-full space-y-6">
    <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm dark:border-violet-500/30 dark:bg-violet-500/10">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Personalized Career Summary
      </h3>

      <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
        {careerPlan.summary}
      </p>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Skill Gaps
        </h3>

        <div className="mt-4 space-y-3">
          {(careerPlan.skillGaps || []).map((skill) => (
            <div
              key={skill}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Circle className="mt-1 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Next Steps
        </h3>

        <div className="mt-4 space-y-3">
          {(careerPlan.nextSteps || []).map((step) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Recommended Projects
        </h3>

        <div className="mt-4 space-y-3">
          {(careerPlan.projects || []).map((project) => (
            <div
              key={project}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Laptop className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>{project}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Certifications
        </h3>

        <div className="mt-4 space-y-3">
          {(careerPlan.certifications || []).map((certificate) => (
            <div
              key={certificate}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Award className="mt-1 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span>{certificate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Internship Roles
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">
        {(careerPlan.internshipRoles || []).map((role) => (
          <span
            key={role}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {role}
          </span>
        ))}
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Weekly Career Plan
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(careerPlan.weeklyPlan || []).map((week) => (
          <div
            key={`${week.week}-${week.focus}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="font-medium text-violet-700 dark:text-violet-400">
              {week.week}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {week.focus}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Resume Improvement Tips
      </h3>

      <div className="mt-4 space-y-3">
        {(careerPlan.resumeTips || []).map((tip) => (
          <div
            key={tip}
            className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <FileText className="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

 

  </div>
</div>


  );
}