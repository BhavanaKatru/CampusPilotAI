import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import StudyPlanner from "../pages/StudyPlanner";
import QuizGenerator from "../pages/QuizGenerator";
import DoubtSolver from "../pages/DoubtSolver";
import PDFAnalyzer from "../pages/PDFAnalyzer";
import AttendancePredictor from "../pages/AttendancePredictor";
import AssignmentAssistant from "../pages/AssignmentAssistant";
import Attendance from "../pages/Attendance";
import CareerMentor from "../pages/CareerMentor";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-planner"
        element={
          <ProtectedRoute>
            <StudyPlanner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz-generator"
        element={
          <ProtectedRoute>
            <QuizGenerator />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doubt-solver"
        element={
          <ProtectedRoute>
            <DoubtSolver />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pdf-analyzer"
        element={
          <ProtectedRoute>
            <PDFAnalyzer />
          </ProtectedRoute>
        }
      />







      <Route
        path="/attendance-predictor"
        element={
          <ProtectedRoute>
            <AttendancePredictor />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
      <Route
  path="/assignments"
  element={
    <ProtectedRoute>
      <AssignmentAssistant />
    </ProtectedRoute>
  }
/>
<Route path="/attendance" element={<Attendance />} />
<Route path="/career-mentor" element={<CareerMentor />} />
<Route path="/profile" element={<Profile />} />
<Route path="/settings" element={<Settings />} />

    </Routes>
  );
}

export default AppRoutes;