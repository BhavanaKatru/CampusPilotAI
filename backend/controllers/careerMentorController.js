const Groq = require("groq-sdk");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing in backend/.env");
  }

  return new Groq({
    apiKey,
  });
};

const generateCareerPlan = async (req, res) => {
  try {
    const {
      fullName,
      branch,
      year,
      cgpa,
      skills,
      interests,
      dreamCompany,
      careerGoal,
      completedSkills,
      requiredSkills,
    } = req.body;

    if (!careerGoal) {
      return res.status(400).json({
        success: false,
        message: "Career goal is required",
      });
    }

    const groq = getGroqClient();

    const prompt = `
You are an AI career mentor for a college student.

Student details:
Name: ${fullName || "Not provided"}
Branch: ${branch || "Not provided"}
Year: ${year || "Not provided"}
CGPA: ${cgpa || "Not provided"}
Current skills: ${skills || "Not provided"}
Interests: ${interests || "Not provided"}
Dream company: ${dreamCompany || "Not provided"}
Career goal: ${careerGoal}
Completed tracked skills: ${
      Array.isArray(completedSkills) && completedSkills.length
        ? completedSkills.join(", ")
        : "None"
    }
Required skills: ${
      Array.isArray(requiredSkills) && requiredSkills.length
        ? requiredSkills.join(", ")
        : "Not provided"
    }

Create a personalized career plan.

Return only valid JSON in this exact format:

{
  "summary": "Short personalized career summary",
  "skillGaps": ["Missing skill 1", "Missing skill 2"],
  "nextSteps": ["Next step 1", "Next step 2", "Next step 3"],
  "projects": ["Project 1", "Project 2"],
  "certifications": ["Certification 1", "Certification 2"],
  "internshipRoles": ["Role 1", "Role 2"],
  "weeklyPlan": [
    {
      "week": "Week 1",
      "focus": "Main learning focus"
    },
    {
      "week": "Week 2",
      "focus": "Main learning focus"
    }
  ],
  "resumeTips": ["Resume tip 1", "Resume tip 2"]
}

Do not include markdown, backticks, or extra explanation.
`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional career mentor. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "Groq returned an empty response",
      });
    }

    let careerPlan;

    try {
      careerPlan = JSON.parse(content);
    } catch (error) {
      console.error("Career plan JSON parse error:", error);
      console.error("Groq response:", content);

      return res.status(500).json({
        success: false,
        message: "AI response could not be processed",
      });
    }

    return res.status(200).json({
      success: true,
      careerPlan,
    });
  } catch (error) {
    console.error("Career mentor error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to generate career plan",
    });
  }
};

module.exports = {
  generateCareerPlan,
};