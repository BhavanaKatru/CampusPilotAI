import { useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { analyzePDF } from "../services/aiService";

function PDFAnalyzer() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setAnalysis(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setError("Please select only a PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setError("PDF size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("First select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const result = await analyzePDF(file);

      setAnalysis(result.analysis || result);
    } catch (err) {
      console.error("PDF analysis error:", err);
      setError(err.message || "Unable to analyze the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const renderList = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p style={styles.emptyText}>No data available.</p>;
    }

    return (
      <ul style={styles.list}>
        {items.map((item, index) => (
          <li key={index} style={styles.listItem}>
            {typeof item === "string"
              ? item
              : item.question ||
                item.answer ||
                item.topic ||
                item.title ||
                JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderFlashcards = (flashcards) => {
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return <p style={styles.emptyText}>No flashcards generated.</p>;
    }

    return (
      <div style={styles.flashcardGrid}>
        {flashcards.map((card, index) => (
          <div key={index} style={styles.flashcard}>
            <p style={styles.flashcardLabel}>Question</p>

            <h3 style={styles.flashcardQuestion}>
              {typeof card === "string"
                ? card
                : card.question ||
                  card.front ||
                  card.term ||
                  `Flashcard ${index + 1}`}
            </h3>

            {typeof card === "object" && (
              <>
                <p style={styles.flashcardLabel}>Answer</p>

                <p style={styles.flashcardAnswer}>
                  {card.answer ||
                    card.back ||
                    card.definition ||
                    "No answer available."}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    if (typeof analysis === "string") {
      return (
        <section style={styles.resultCard}>
          <h2 style={styles.resultTitle}>AI Analysis</h2>
          <p style={styles.resultText}>{analysis}</p>
        </section>
      );
    }

    const summary =
      analysis.summary ||
      analysis.overview ||
      analysis.shortSummary ||
      analysis.documentSummary;

    const importantTopics =
      analysis.importantTopics ||
      analysis.important_topics ||
      analysis.keyTopics ||
      analysis.topics;

    const expectedQuestions =
      analysis.expectedQuestions ||
      analysis.expected_questions ||
      analysis.examQuestions ||
      analysis.questions;

    const flashcards =
      analysis.flashcards ||
      analysis.flashCards ||
      analysis.studyCards;

    return (
      <div style={styles.results}>
        <section style={styles.resultCard}>
          <div style={styles.cardHeading}>
            <span style={styles.cardIcon}>📝</span>
            <h2 style={styles.resultTitle}>Summary</h2>
          </div>

          <p style={styles.resultText}>
            {typeof summary === "string"
              ? summary
              : summary
                ? JSON.stringify(summary, null, 2)
                : "Summary was not generated."}
          </p>
        </section>

        <section style={styles.resultCard}>
          <div style={styles.cardHeading}>
            <span style={styles.cardIcon}>⭐</span>
            <h2 style={styles.resultTitle}>Important Topics</h2>
          </div>

          {renderList(importantTopics)}
        </section>

        <section style={styles.resultCard}>
          <div style={styles.cardHeading}>
            <span style={styles.cardIcon}>❓</span>
            <h2 style={styles.resultTitle}>
              Expected Exam Questions
            </h2>
          </div>

          {renderList(expectedQuestions)}
        </section>

        <section style={styles.resultCard}>
          <div style={styles.cardHeading}>
            <span style={styles.cardIcon}>🧠</span>
            <h2 style={styles.resultTitle}>Flashcards</h2>
          </div>

          {renderFlashcards(flashcards)}
        </section>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.badge}>AI POWERED</div>

          <h1 style={styles.title}>Smart PDF Analyzer</h1>

          <p style={styles.subtitle}>
            Upload your study material and generate a summary,
            important topics, expected exam questions and flashcards.
          </p>
        </div>

        <div style={styles.uploadCard}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={styles.uploadIcon}>📄</div>

          <h2 style={styles.uploadTitle}>
            Upload your study PDF
          </h2>

          <p style={styles.uploadText}>
            PDF files only · Maximum size 10 MB
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            style={{
              ...styles.chooseButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            Choose PDF
          </button>

          {file && (
            <div style={styles.selectedFile}>
              <div style={styles.fileDetails}>
                <span style={styles.fileIcon}>📘</span>

                <div>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                  setError("");

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={loading}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            style={{
              ...styles.analyzeButton,
              opacity: !file || loading ? 0.55 : 1,
              cursor: !file || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Analyzing PDF..." : "Analyze PDF"}
          </button>

          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>

              <div>
                <p style={styles.loadingTitle}>
                  AI is analyzing your PDF
                </p>

                <p style={styles.loadingText}>
                  This may take a few seconds.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {renderAnalysis()}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "42px 24px 70px",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 13px",
    borderRadius: "999px",
    background: "rgba(37, 99, 235, 0.14)",
    color: "#60a5fa",
    fontWeight: "700",
    fontSize: "12px",
    letterSpacing: "1px",
    marginBottom: "14px",
  },

  title: {
    margin: "0 0 12px",
    fontSize: "38px",
    lineHeight: "1.2",
    color: "inherit",
  },

  subtitle: {
    maxWidth: "720px",
    margin: "0 auto",
    fontSize: "17px",
    lineHeight: "1.7",
    opacity: "0.75",
  },

  uploadCard: {
    padding: "38px",
    borderRadius: "22px",
    background: "rgba(255, 255, 255, 0.96)",
    color: "#111827",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.16)",
    textAlign: "center",
  },

  uploadIcon: {
    width: "72px",
    height: "72px",
    margin: "0 auto 16px",
    borderRadius: "20px",
    display: "grid",
    placeItems: "center",
    fontSize: "34px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(99,102,241,0.18))",
  },

  uploadTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
  },

  uploadText: {
    margin: "0 0 24px",
    color: "#64748b",
  },

  chooseButton: {
    padding: "12px 24px",
    border: "1px solid #2563eb",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  selectedFile: {
    maxWidth: "650px",
    margin: "24px auto 0",
    padding: "14px 16px",
    borderRadius: "13px",
    background: "#f1f5f9",
    border: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    textAlign: "left",
  },

  fileDetails: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "0",
  },

  fileIcon: {
    fontSize: "28px",
  },

  fileName: {
    margin: "0 0 4px",
    fontWeight: "700",
    overflowWrap: "anywhere",
  },

  fileSize: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  removeButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    cursor: "pointer",
  },

  analyzeButton: {
    width: "100%",
    maxWidth: "650px",
    marginTop: "24px",
    padding: "15px 22px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    fontWeight: "800",
    fontSize: "16px",
    boxShadow: "0 10px 24px rgba(37, 99, 235, 0.25)",
  },

  loadingBox: {
    maxWidth: "650px",
    margin: "20px auto 0",
    padding: "15px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    textAlign: "left",
  },

  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #bfdbfe",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
  },

  loadingTitle: {
    margin: "0 0 3px",
    color: "#1d4ed8",
    fontWeight: "700",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  errorBox: {
    maxWidth: "650px",
    margin: "20px auto 0",
    padding: "14px",
    borderRadius: "11px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    textAlign: "left",
  },

  results: {
    marginTop: "30px",
    display: "grid",
    gap: "20px",
  },

  resultCard: {
    padding: "25px",
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.97)",
    color: "#111827",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
  },

  cardHeading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },

  cardIcon: {
    fontSize: "24px",
  },

  resultTitle: {
    margin: 0,
    fontSize: "22px",
  },

  resultText: {
    margin: 0,
    lineHeight: "1.8",
    color: "#334155",
    whiteSpace: "pre-wrap",
  },

  list: {
    margin: 0,
    paddingLeft: "23px",
  },

  listItem: {
    marginBottom: "11px",
    lineHeight: "1.7",
    color: "#334155",
  },

  emptyText: {
    color: "#64748b",
  },

  flashcardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
  },

  flashcard: {
    padding: "18px",
    borderRadius: "14px",
    background:
      "linear-gradient(145deg, #eff6ff, #eef2ff)",
    border: "1px solid #c7d2fe",
  },

  flashcardLabel: {
    margin: "0 0 6px",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  flashcardQuestion: {
    margin: "0 0 15px",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  flashcardAnswer: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.6",
  },
};

export default PDFAnalyzer;