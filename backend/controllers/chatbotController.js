const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const NON_ACADEMIC_REPLY =
  "This question is not related to studies. Please ask an academic or learning-related question.";

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages are required.",
      });
    }

    const formattedMessages = messages
      .filter(
        (item) =>
          typeof item?.text === "string" &&
          item.text.trim()
      )
      .map((item) => ({
        role:
          item.sender === "user"
            ? "user"
            : "assistant",
        content: item.text.trim(),
      }));

    if (formattedMessages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid question.",
      });
    }

    const latestUserMessage = [...formattedMessages]
      .reverse()
      .find((item) => item.role === "user");

    if (!latestUserMessage) {
      return res.status(400).json({
        success: false,
        message: "Please enter your academic question.",
      });
    }
const question = latestUserMessage.content.toLowerCase();

const blockedKeywords = [
  "biryani",
  "recipe",
  "cook",
  "cooking",
  "food",
  "movie",
  "movies",
  "song",
  "songs",
  "music",
  "cricket",
  "ipl",
  "football",
  "travel",
  "trip",
  "hotel",
  "shopping",
  "amazon",
  "flipkart",
  "relationship",
  "girlfriend",
  "boyfriend",
  "love",
  "joke",
  "funny",
  "instagram",
  "whatsapp"
];

const isBlocked = blockedKeywords.some((word) =>
  question.includes(word)
);

if (isBlocked) {
  return res.status(200).json({
    success: true,
    reply:
      "This question is not related to studies. Please ask an academic or learning-related question.",
  });
}
    /*
      First Groq call:
      Check whether the latest question is academic.
    */
    const classification =
      await groq.chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 20,
        messages: [
          {
            role: "system",
            content: `
You are a strict academic-question classifier.

Classify the user's latest message as ACADEMIC or NON_ACADEMIC.

ACADEMIC includes:
- All school, college and university subjects
- All B.Tech branches and engineering subjects
- Programming, coding and software development
- C, C++, Java, Python, JavaScript, React, Node.js, Express.js and other technologies
- DBMS, OS, Computer Networks, OOP, DSA, AI, ML, Cloud Computing and Cyber Security
- Mathematics, Physics, Chemistry, English, Statistics and Probability
- Aptitude and logical reasoning
- Assignments, academic projects and lab programs
- Exams, viva, interviews, placements and certifications
- Study planning, academic career guidance and research

NON_ACADEMIC includes:
- Cooking and recipes
- Movies, songs and entertainment
- Shopping
- Travel planning
- Relationships and gossip
- Sports discussions
- General lifestyle questions unrelated to learning

Return only one word:
ACADEMIC
or
NON_ACADEMIC
`,
          },
          {
            role: "user",
            content: latestUserMessage.content,
          },
        ],
      });

    const classificationResult =
      classification.choices?.[0]?.message?.content
        ?.trim()
        .toUpperCase();

    if (classificationResult !== "ACADEMIC") {
      return res.status(200).json({
        success: true,
        isAcademic: false,
        reply: NON_ACADEMIC_REPLY,
      });
    }

    /*
      Second Groq call:
      Answer the academic question.
    */
    const completion =
      await groq.chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 1200,
        messages: [
        {
  role: "system",
  content: `
You are CampusPilot AI, an academic assistant for students.

IMPORTANT RULES:

You must answer ONLY questions related to education and learning.

Allowed:
- School subjects
- College subjects
- All B.Tech subjects
- Programming
- Coding
- Mathematics
- Physics
- Chemistry
- English
- Aptitude
- Reasoning
- Statistics
- Projects
- Assignments
- Viva
- Placements
- Career guidance
- Study planning
- Certifications

If the user's question is NOT related to education,
DO NOT answer it.

Instead reply EXACTLY:

"This question is not related to studies. Please ask an academic or learning-related question."

Never ignore these instructions.
`,
},
          ...formattedMessages,
        ],
      });

    const reply =
      completion.choices?.[0]?.message?.content?.trim();
      const lowerReply = reply.toLowerCase();

if (
  lowerReply.includes("biryani") ||
  lowerReply.includes("ingredients") ||
  lowerReply.includes("recipe") ||
  lowerReply.includes("cooking") ||
  lowerReply.includes("movie") ||
  lowerReply.includes("song") ||
  lowerReply.includes("travel") ||
  lowerReply.includes("shopping")
) {
  return res.status(200).json({
    success: true,
    reply:
      "This question is not related to studies. Please ask an academic or learning-related question.",
  });
}

    if (!reply) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    return res.status(200).json({
      success: true,
      isAcademic: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI response.",
    });
  }
};

module.exports = {
  chatWithAI,
};