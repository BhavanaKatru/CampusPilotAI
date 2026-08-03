const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned ${response.status}, but response was not valid JSON.`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

export async function generateQuiz(
  subject,
  topic,
  difficulty,
  questionCount = 5
) {
  const response = await fetch(`${API_URL}/api/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      topic,
      difficulty,
      numberOfQuestions: questionCount,
    }),
  });

  const data = await handleResponse(response);

  if (!Array.isArray(data.questions)) {
    throw new Error("AI returned an invalid quiz format.");
  }

  return data.questions;
}
export async function askAI(message) {
  const response = await fetch(
    `${API_URL}/api/chatbot/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            sender: "user",
            text: message,
          },
        ],
      }),
    }
  );

  const data = await handleResponse(response);

  if (!data.reply) {
    throw new Error("AI returned an empty answer.");
  }

  return data.reply;
}

export async function analyzePDF(file) {
  if (!file) {
    throw new Error("Please select a PDF file.");
  }

  const formData = new FormData();
  formData.append("pdf", file);

  const response = await fetch(
    `${API_URL}/api/pdf-analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await handleResponse(response);

  if (!data.analysis) {
    throw new Error(
      "AI returned an invalid PDF analysis."
    );
  }

  return data;
}