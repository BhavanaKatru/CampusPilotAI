import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function AttendancePredictor() {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [requiredAttendance, setRequiredAttendance] = useState("75");
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const total = Number(totalClasses);
    const attended = Number(attendedClasses);
    const required = Number(requiredAttendance);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(attended) ||
      !Number.isFinite(required) ||
      total <= 0 ||
      attended < 0 ||
      attended > total ||
      required <= 0 ||
      required >= 100
    ) {
      return null;
    }

    const currentPercentage = (attended / total) * 100;
    const targetDecimal = required / 100;

    let classesToAttend = 0;
    let classesCanMiss = 0;

    if (currentPercentage < required) {
      classesToAttend = Math.ceil(
        (targetDecimal * total - attended) /
          (1 - targetDecimal)
      );
    } else {
      classesCanMiss = Math.floor(
        attended / targetDecimal - total
      );
    }

    let status = "Critical";
    let message =
      "Your attendance is below the required percentage.";

    if (currentPercentage >= 90) {
      status = "Excellent";
      message = "Your attendance is excellent. Keep it up.";
    } else if (currentPercentage >= required + 5) {
      status = "Safe";
      message =
        "Your attendance is safely above the required percentage.";
    } else if (currentPercentage >= required) {
      status = "Warning";
      message =
        "Your attendance meets the requirement, but the margin is low.";
    }

    return {
      currentPercentage,
      classesToAttend,
      classesCanMiss: Math.max(0, classesCanMiss),
      status,
      message,
      required,
    };
  }, [totalClasses, attendedClasses, requiredAttendance]);

  const handleCalculate = (event) => {
    event.preventDefault();
    setError("");
    setShowResult(false);

    const total = Number(totalClasses);
    const attended = Number(attendedClasses);
    const required = Number(requiredAttendance);

    if (!totalClasses || !attendedClasses || !requiredAttendance) {
      setError("Please fill in all the fields.");
      return;
    }

    if (!Number.isInteger(total) || total <= 0) {
      setError(
        "Total classes must be a positive whole number."
      );
      return;
    }

    if (!Number.isInteger(attended) || attended < 0) {
      setError(
        "Attended classes must be a valid whole number."
      );
      return;
    }

    if (attended > total) {
      setError(
        "Attended classes cannot be greater than total classes."
      );
      return;
    }

    if (required <= 0 || required >= 100) {
      setError(
        "Required attendance must be between 1 and 99."
      );
      return;
    }

    setShowResult(true);
  };

  const handleReset = () => {
    setTotalClasses("");
    setAttendedClasses("");
    setRequiredAttendance("75");
    setShowResult(false);
    setError("");
  };

  const getStatusClass = (status) => {
    if (status === "Excellent") return "status excellent";
    if (status === "Safe") return "status safe";
    if (status === "Warning") return "status warning";
    return "status critical";
  };

  return (
    <DashboardLayout>
      <div className="attendance-page">
        <div className="page-heading">
          <div>
            <p className="small-heading">ACADEMIC TRACKER</p>
            <h1>Attendance Predictor</h1>
            <p className="page-description">
              Calculate your attendance and find out how many
              classes you must attend or can safely miss.
            </p>
          </div>

          <div className="heading-icon">%</div>
        </div>

        <div className="attendance-grid">
          <form
            className="calculator-card"
            onSubmit={handleCalculate}
          >
            <div className="card-heading">
              <div>
                <h2>Enter Attendance Details</h2>
                <p>Use your current class records.</p>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="totalClasses">
                Total Classes Conducted
              </label>

              <input
                id="totalClasses"
                type="number"
                min="1"
                placeholder="Example: 120"
                value={totalClasses}
                onChange={(event) => {
                  setTotalClasses(event.target.value);
                  setShowResult(false);
                  setError("");
                }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="attendedClasses">
                Classes Attended
              </label>

              <input
                id="attendedClasses"
                type="number"
                min="0"
                placeholder="Example: 90"
                value={attendedClasses}
                onChange={(event) => {
                  setAttendedClasses(event.target.value);
                  setShowResult(false);
                  setError("");
                }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="requiredAttendance">
                Required Attendance Percentage
              </label>

              <div className="percentage-input">
                <input
                  id="requiredAttendance"
                  type="number"
                  min="1"
                  max="99"
                  value={requiredAttendance}
                  onChange={(event) => {
                    setRequiredAttendance(event.target.value);
                    setShowResult(false);
                    setError("");
                  }}
                />
                <span>%</span>
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="button-row">
              <button className="calculate-button" type="submit">
                Calculate Attendance
              </button>

              <button
                className="reset-button"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="result-card">
            {!showResult || !result ? (
              <div className="empty-result">
                <div className="empty-circle">%</div>
                <h2>Your result will appear here</h2>
                <p>
                  Enter your attendance information and click
                  Calculate Attendance.
                </p>
              </div>
            ) : (
              <div className="result-content">
                <div className="result-top">
                  <div>
                    <p>Current Attendance</p>
                    <h2>
                      {result.currentPercentage.toFixed(2)}%
                    </h2>
                  </div>

                  <span
                    className={getStatusClass(result.status)}
                  >
                    {result.status}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-value"
                    style={{
                      width: `${Math.min(
                        result.currentPercentage,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="percentage-row">
                  <span>0%</span>
                  <span>
                    Required: {result.required.toFixed(0)}%
                  </span>
                  <span>100%</span>
                </div>

                <div className="result-message">
                  <h3>{result.message}</h3>

                  {result.currentPercentage <
                  result.required ? (
                    <p>
                      Attend the next{" "}
                      <strong>
                        {result.classesToAttend} classes
                      </strong>{" "}
                      continuously to reach at least{" "}
                      {result.required.toFixed(0)}%.
                    </p>
                  ) : (
                    <p>
                      You can miss up to{" "}
                      <strong>
                        {result.classesCanMiss} classes
                      </strong>{" "}
                      and still maintain at least{" "}
                      {result.required.toFixed(0)}%.
                    </p>
                  )}
                </div>

                <div className="stats-grid">
                  <div className="stat-box">
                    <span>Total Classes</span>
                    <strong>{totalClasses}</strong>
                  </div>

                  <div className="stat-box">
                    <span>Classes Attended</span>
                    <strong>{attendedClasses}</strong>
                  </div>

                  <div className="stat-box">
                    <span>Classes Missed</span>
                    <strong>
                      {Number(totalClasses) -
                        Number(attendedClasses)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .attendance-page {
          padding: 30px;
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(99, 102, 241, 0.12),
              transparent 35%
            ),
            #f7f8fc;
          font-family: Inter, Arial, sans-serif;
          color: #172033;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .small-heading {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.8px;
          color: #6366f1;
        }

        .page-heading h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
        }

        .page-description {
          max-width: 650px;
          margin: 10px 0 0;
          color: #667085;
          line-height: 1.6;
        }

        .heading-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 27px;
          font-weight: 800;
          box-shadow: 0 15px 32px rgba(99, 102, 241, 0.25);
        }

        .attendance-grid {
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 24px;
        }

        .calculator-card,
        .result-card {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e8eaf2;
          border-radius: 24px;
          box-shadow: 0 18px 45px rgba(37, 44, 97, 0.08);
        }

        .calculator-card {
          padding: 28px;
        }

        .card-heading {
          margin-bottom: 24px;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 21px;
        }

        .card-heading p {
          margin: 7px 0 0;
          color: #7a8192;
          font-size: 14px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 9px;
          color: #353b4b;
          font-size: 14px;
          font-weight: 700;
        }

        .input-group input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 15px;
          border: 1px solid #dfe3ec;
          border-radius: 13px;
          outline: none;
          background: #fafbfe;
          color: #172033;
          font-size: 15px;
          transition: 0.2s ease;
        }

        .input-group input:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .percentage-input {
          position: relative;
        }

        .percentage-input input {
          padding-right: 48px;
        }

        .percentage-input span {
          position: absolute;
          top: 50%;
          right: 17px;
          transform: translateY(-50%);
          color: #6366f1;
          font-weight: 800;
        }

        .error-box {
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 12px;
          background: #fff1f2;
          color: #b42318;
          font-size: 14px;
        }

        .button-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-top: 8px;
        }

        .calculate-button,
        .reset-button {
          border: 0;
          border-radius: 13px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .calculate-button {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          box-shadow: 0 10px 22px rgba(99, 102, 241, 0.22);
        }

        .calculate-button:hover {
          transform: translateY(-1px);
        }

        .reset-button {
          background: #eef0f5;
          color: #4b5565;
        }

        .result-card {
          min-height: 530px;
          padding: 30px;
          display: flex;
        }

        .empty-result {
          margin: auto;
          max-width: 350px;
          text-align: center;
        }

        .empty-circle {
          width: 90px;
          height: 90px;
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #eef2ff;
          color: #6366f1;
          font-size: 32px;
          font-weight: 800;
        }

        .empty-result h2 {
          margin: 0 0 10px;
          font-size: 21px;
        }

        .empty-result p {
          margin: 0;
          color: #7a8192;
          line-height: 1.6;
        }

        .result-content {
          width: 100%;
        }

        .result-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .result-top p {
          margin: 0 0 7px;
          color: #7a8192;
          font-size: 14px;
          font-weight: 600;
        }

        .result-top h2 {
          margin: 0;
          font-size: 42px;
          color: #172033;
        }

        .status {
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
        }

        .status.excellent {
          background: #dcfce7;
          color: #15803d;
        }

        .status.safe {
          background: #e0f2fe;
          color: #0369a1;
        }

        .status.warning {
          background: #fef3c7;
          color: #b45309;
        }

        .status.critical {
          background: #fee2e2;
          color: #b91c1c;
        }

        .progress-track {
          height: 12px;
          margin-top: 25px;
          overflow: hidden;
          border-radius: 999px;
          background: #eceef4;
        }

        .progress-value {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.7s ease;
        }

        .percentage-row {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: #8a90a0;
          font-size: 12px;
        }

        .result-message {
          margin-top: 30px;
          padding: 22px;
          border: 1px solid #e5e7f0;
          border-radius: 18px;
          background: #f8f9fd;
        }

        .result-message h3 {
          margin: 0 0 10px;
          font-size: 17px;
        }

        .result-message p {
          margin: 0;
          color: #596174;
          line-height: 1.7;
        }

        .result-message strong {
          color: #5b21b6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .stat-box {
          padding: 17px;
          border: 1px solid #e7e9f1;
          border-radius: 16px;
          background: white;
        }

        .stat-box span {
          display: block;
          margin-bottom: 9px;
          color: #7b8293;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-box strong {
          font-size: 22px;
          color: #20283b;
        }

        @media (max-width: 900px) {
          .attendance-grid {
            grid-template-columns: 1fr;
          }

          .result-card {
            min-height: 450px;
          }
        }

        @media (max-width: 600px) {
          .attendance-page {
            padding: 18px;
          }

          .page-heading h1 {
            font-size: 26px;
          }

          .heading-icon {
            display: none;
          }

          .calculator-card,
          .result-card {
            padding: 20px;
            border-radius: 19px;
          }

          .button-row {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .result-top h2 {
            font-size: 34px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}

export default AttendancePredictor;