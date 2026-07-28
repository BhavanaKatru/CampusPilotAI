const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
      .filter((item) => item?.text?.trim())
      .map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: item.text.trim(),
      }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 1200,

      messages: [
        {
          role: "system",
          content: `
You are CampusPilot AI, an academic assistant for college students.

Your responsibilities:
- Explain academic concepts in simple language.
- Help with coding, DBMS, operating systems, computer networks and aptitude.
- Provide study plans and exam preparation guidance.
- Give career and placement guidance.
- Use clear headings and short paragraphs.
- Include examples when useful.
- Never invent facts when uncertain.
          `,
        },
        ...formattedMessages,
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I could not generate an answer.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response.",
    });
  }
};

module.exports = {
  chatWithAI,
};