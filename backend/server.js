require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const assignmentRoutes = require("./routes/assignmentRoutes");
const careerMentorRoutes = require("./routes/careerMentorRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (request, file, callback) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return callback(
        new Error("Only PDF files are allowed.")
      );
    }

    callback(null, true);
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://campus-pilot-ai-kappa.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use("/api/assignments", assignmentRoutes);
app.use("/api/career-mentor", careerMentorRoutes);
app.use("/api/chatbot", chatbotRoutes);
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.includes("YOUR_NEW")) {
    throw new Error(
      "GROQ_API_KEY is missing in backend/.env"
    );
  }

  return new Groq({
    apiKey,
  });
}

function getModelName() {
  const model = process.env.GROQ_MODEL;

  if (!model) {
    throw new Error(
      "GROQ_MODEL is missing in backend/.env"
    );
  }

  return model;
}

function extractJsonArray(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI returned an empty response.");
  }

  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```javascript/gi, "")
    .replace(/```/g, "")
    .trim();

  const startIndex = cleanedText.indexOf("[");
  const endIndex = cleanedText.lastIndexOf("]");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "AI response did not contain valid quiz JSON."
    );
  }

  const jsonText = cleanedText.slice(
    startIndex,
    endIndex + 1
  );

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error(
      "AI returned invalid JSON. Generate again."
    );
  }
}
function extractJsonObject(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI returned an empty response.");
  }

  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```javascript/gi, "")
    .replace(/```/g, "")
    .trim();

  const startIndex = cleanedText.indexOf("{");
  const endIndex = cleanedText.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "AI response did not contain valid analysis JSON."
    );
  }

  const jsonText = cleanedText.slice(
    startIndex,
    endIndex + 1
  );

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error(
      "AI returned invalid analysis JSON. Try again."
    );
  }
}

function validateQuestions(questions, requiredCount) {
  if (!Array.isArray(questions)) {
    throw new Error("Quiz response is not an array.");
  }

  const validQuestions = questions
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const question =
        typeof item.question === "string"
          ? item.question.trim()
          : "";

      const options = Array.isArray(item.options)
        ? item.options
            .filter(
              (option) => typeof option === "string"
            )
            .map((option) => option.trim())
            .filter(Boolean)
        : [];

      const answer =
        typeof item.answer === "string"
          ? item.answer.trim()
          : "";

      const explanation =
        typeof item.explanation === "string"
          ? item.explanation.trim()
          : "";

      if (
        !question ||
        options.length !== 4 ||
        !answer
      ) {
        return null;
      }

      const correctOption = options.find(
        (option) =>
          option.toLowerCase() ===
          answer.toLowerCase()
      );

      if (!correctOption) {
        return null;
      }

      return {
        id: index + 1,
        question,
        options,
        answer: correctOption,
        explanation:
          explanation ||
          "This option is correct.",
      };
    })
    .filter(Boolean);

  if (validQuestions.length < requiredCount) {
    throw new Error(
      `AI returned only ${validQuestions.length} valid questions. Generate again.`
    );
  }

  return validQuestions.slice(0, requiredCount);
}

app.get("/", (request, response) => {
  response.json({
    success: true,
    message: "CampusPilot AI backend is running.",
  });
});

app.get("/api/health", (request, response) => {
  response.json({
    success: true,
    status: "healthy",
    aiProvider: "Groq",
    groqConfigured: Boolean(
      process.env.GROQ_API_KEY &&
        process.env.GROQ_MODEL
    ),
  });
});

app.post("/api/quiz", async (request, response) => {
  try {
    const {
      topic,
      difficulty = "Easy",
      numberOfQuestions = 5,
    } = request.body;

    const cleanTopic =
      typeof topic === "string"
        ? topic.trim()
        : "";

    if (!cleanTopic) {
      return response.status(400).json({
        success: false,
        message: "Please enter a quiz topic.",
      });
    }

    const allowedDifficulties = [
      "Easy",
      "Medium",
      "Hard",
    ];

    const selectedDifficulty =
      allowedDifficulties.includes(difficulty)
        ? difficulty
        : "Easy";

    const parsedCount = Number(numberOfQuestions);

    const safeQuestionCount = Math.min(
      Math.max(
        Number.isInteger(parsedCount)
          ? parsedCount
          : 5,
        3
      ),
      15
    );

    const groq = getGroqClient();
    const model = getModelName();
    const generationCount = safeQuestionCount + 2;
    const completion =
      await groq.chat.completions.create({
        model,
      temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are the quiz generation engine for CampusPilot AI. Return only valid JSON without markdown.",
          },
          {
            role: "user",
            content: `
Generate exactly ${generationCount} unique multiple-choice questions.
Topic: ${cleanTopic}
Difficulty: ${selectedDifficulty}

Rules:
1. Every question must match the topic.
2. Generate fresh questions.
3. Do not repeat questions.
4. Every question must have exactly four options.
5. Only one option must be correct.
6. The answer must exactly match one option.
7. Include a simple explanation.
8. Match the requested difficulty.
9. Return only a valid JSON array.
10. Do not include markdown or extra text.

Format:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Exact correct option text",
    "explanation": "Simple explanation"
  }
]
`,
          },
        ],
      });

    const generatedText =
      completion.choices?.[0]?.message?.content;

    const parsedQuestions =
      extractJsonArray(generatedText);

    const questions = validateQuestions(
      parsedQuestions,
      safeQuestionCount
    );

    return response.status(200).json({
      success: true,
      source: "groq",
      topic: cleanTopic,
      difficulty: selectedDifficulty,
      questions,
    });
  } catch (error) {
    console.error(
      "Quiz generation error:",
      error
    );

    return response.status(500).json({
      success: false,
      message:
        error.message ||
        "AI could not generate the quiz.",
    });
  }
});
app.post("/api/assignment-plan", async (request, response) => {
  try {
    const { title, subject, dueDate, priority } = request.body;

    const cleanTitle =
      typeof title === "string" ? title.trim() : "";

    const cleanSubject =
      typeof subject === "string" ? subject.trim() : "";

    if (!cleanTitle || !cleanSubject || !dueDate) {
      return response.status(400).json({
        success: false,
        message:
          "Title, subject and due date are required.",
      });
    }

    const groq = getGroqClient();
    const model = getModelName();

    const completion =
      await groq.chat.completions.create({
        model,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are an academic planning assistant. Return only valid JSON without markdown.",
          },
          {
            role: "user",
            content: `
Create a simple milestone plan for this assignment.

Assignment title: ${cleanTitle}
Subject: ${cleanSubject}
Due date: ${dueDate}
Priority: ${priority || "Medium"}

Return only valid JSON in this exact format:

{
  "overview": "Short plan summary",
  "milestones": [
    {
      "day": "Day 1",
      "task": "Specific task to complete"
    }
  ]
}

Rules:
1. Generate 4 to 7 milestones.
2. Keep every task simple and practical.
3. Arrange tasks in the correct order.
4. Include final review and submission.
5. Do not include markdown.
`,
          },
        ],
      });

    const generatedText =
      completion.choices?.[0]?.message?.content;

    const plan = extractJsonObject(generatedText);

    if (
      !plan.overview ||
      !Array.isArray(plan.milestones) ||
      plan.milestones.length === 0
    ) {
      throw new Error(
        "AI returned an incomplete assignment plan."
      );
    }

    return response.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(
      "Assignment plan generation error:",
      error
    );

    return response.status(500).json({
      success: false,
      message:
        error.message ||
        "AI could not generate assignment plan.",
    });
  }
});

app.post("/api/chat", async (request, response) => {
  try {
    const message =
      typeof request.body.message === "string"
        ? request.body.message.trim()
        : "";

    if (!message) {
      return response.status(400).json({
        success: false,
        message: "Please enter your doubt.",
      });
    }

    const groq = getGroqClient();
    const model = getModelName();
   

    const completion =
      await groq.chat.completions.create({
        model,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "You are CampusPilot AI, an academic assistant for college students. Explain using simple language.",
          },
          {
            role: "user",
            content: `
Answer this student doubt using:

1. Simple explanation
2. One clear example
3. One practice question

Student doubt:
${message}
`,
          },
        ],
      });

    const reply =
      completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    return response.status(200).json({
      success: true,
      source: "groq",
      reply,
    });
  } catch (error) {
    console.error(
      "Chat generation error:",
      error
    );

    return response.status(500).json({
      success: false,
      message:
        error.message ||
        "AI could not answer the doubt.",
    });
  }
});
app.post(
  "/api/pdf-analyze",
  upload.single("pdf"),
  async (request, response) => {
    try {
      if (!request.file) {
        return response.status(400).json({
          success: false,
          message: "Please upload a PDF file.",
        });
      }

      const parsedPdf = await pdfParse(
        request.file.buffer
      );

      const extractedText =
        typeof parsedPdf.text === "string"
          ? parsedPdf.text.trim()
          : "";

      if (!extractedText) {
        return response.status(400).json({
          success: false,
          message:
            "No readable text was found in this PDF. Scanned image PDFs are not supported yet.",
        });
      }

      const maximumCharacters = 18000;

      const limitedText = extractedText.slice(
        0,
        maximumCharacters
      );

      const wasTruncated =
        extractedText.length > maximumCharacters;

      const groq = getGroqClient();
      const model = getModelName();

      const completion =
        await groq.chat.completions.create({
          model,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You are the Smart PDF Analyzer for CampusPilot AI. Analyze academic content accurately and return only valid JSON without markdown.",
            },
            {
              role: "user",
              content: `
Analyze the following academic PDF text.

Return only one valid JSON object using exactly this structure:

{
  "title": "Suitable title for the document",
  "summary": "Clear detailed summary in simple language",
  "importantTopics": [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ],
  "expectedQuestions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ],
  "flashcards": [
    {
      "question": "Flashcard question",
      "answer": "Flashcard answer"
    }
  ]
}

Rules:

1. Summary must explain the main content clearly.
2. Include 5 to 10 important topics.
3. Include 5 to 10 likely exam questions.
4. Include 5 to 10 useful flashcards.
5. Use only information found in the PDF.
6. Do not invent unrelated information.
7. Do not include markdown.
8. Return only valid JSON.

PDF text:

${limitedText}
`,
            },
          ],
        });

      const generatedText =
        completion.choices?.[0]?.message?.content;
        console.log(generatedText);

      const analysis =
        extractJsonObject(generatedText);

      const title =
        typeof analysis.title === "string"
          ? analysis.title.trim()
          : request.file.originalname;

      const summary =
        typeof analysis.summary === "string"
          ? analysis.summary.trim()
          : "";

      const importantTopics = Array.isArray(
        analysis.importantTopics
      )
        ? analysis.importantTopics
            .filter(
              (topic) => typeof topic === "string"
            )
            .map((topic) => topic.trim())
            .filter(Boolean)
        : [];

      const expectedQuestions = Array.isArray(
        analysis.expectedQuestions
      )
        ? analysis.expectedQuestions
            .filter(
              (question) =>
                typeof question === "string"
            )
            .map((question) => question.trim())
            .filter(Boolean)
        : [];

      const flashcards = Array.isArray(
        analysis.flashcards
      )
        ? analysis.flashcards
            .map((card) => {
              const question =
                typeof card?.question === "string"
                  ? card.question.trim()
                  : "";

              const answer =
                typeof card?.answer === "string"
                  ? card.answer.trim()
                  : "";

              if (!question || !answer) {
                return null;
              }

              return {
                question,
                answer,
              };
            })
            .filter(Boolean)
        : [];

      if (
        !summary ||
        importantTopics.length === 0 ||
        expectedQuestions.length === 0 ||
        flashcards.length === 0
      ) {
        throw new Error(
          "AI returned incomplete PDF analysis. Try again."
        );
      }

      return response.status(200).json({
        success: true,
        source: "groq",
        fileName: request.file.originalname,
        fileSize: request.file.size,
        pages: parsedPdf.numpages || null,
        wasTruncated,
        analysis: {
          title,
          summary,
          importantTopics,
          expectedQuestions,
          flashcards,
        },
      });
    } catch (error) {
      console.error(
        "PDF analysis error:",
        error
      );

      return response.status(500).json({
        success: false,
        message:
          error.message ||
          "AI could not analyze the PDF.",
      });
    }
  }
);
app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(400).json({
        success: false,
        message:
          "PDF size must be less than 10 MB.",
      });
    }

    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return response.status(400).json({
      success: false,
      message:
        error.message || "File upload failed.",
    });
  }

  next();
});

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.listen(PORT, () => {
  console.log(
    `CampusPilot AI backend running at http://localhost:${PORT}`
  );
});