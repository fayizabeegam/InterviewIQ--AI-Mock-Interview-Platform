
import { puter } from "@heyputer/puter.js";

export const generateInterviewQuestions = async ({
  resumeText = "",
  interviewType = "technical",
  experienceLevel = "junior",
  difficulty = "MEDIUM",
  totalQuestions = 5,
  jobDescription = "",
}) => {
  const cleanResume = resumeText.trim();
  const cleanJobDescription = jobDescription.trim();

  if (!cleanResume) {
    throw new Error(
      "Please upload a resume with readable text before generating questions."
    );
  }

  const prompt = `
You are an experienced technical interviewer conducting a realistic job interview.

Generate exactly ${totalQuestions} interview questions based on the candidate's resume.

CANDIDATE RESUME:
${cleanResume}

JOB DESCRIPTION:
${cleanJobDescription || "No job description provided."}

INTERVIEW TYPE: ${interviewType}
CANDIDATE EXPERIENCE LEVEL: ${experienceLevel}
QUESTION DIFFICULTY: ${difficulty}
NUMBER OF QUESTIONS: ${totalQuestions}

EXPERIENCE-BASED QUESTION RULES:

- Fresher: Focus on fundamentals, basic concepts, academic knowledge,
  and projects. Do not expect extensive professional experience.
- Junior: Focus on practical implementation, basic debugging,
  and technologies used in the candidate's projects.
- Mid Level: Focus on problem-solving, implementation decisions,
  debugging, optimization, and independent ownership of tasks.
- Senior: Focus on architecture, scalability, trade-offs,
  complex problem-solving, and technical leadership.

Adjust every question to the selected experience level.
Use the candidate's resume as the primary source for skills,
projects, and work experience.
Do not invent experience or responsibilities.

IMPORTANT INSTRUCTIONS:

1. Read the resume carefully before creating questions.
2. Make questions specific to the candidate's actual experience,
   projects, technical skills, responsibilities, and achievements.
3. Ask about technologies and skills explicitly mentioned in the resume.
4. Include questions about implementation, problem-solving,
   technical decisions, and challenges.
5. If projects are mentioned, ask about the candidate's actual role,
   implementation, architecture, challenges, or results.
6. For Python or Django interviews, ask relevant questions about Python,
   Django, Django REST Framework, APIs, databases, authentication,
   testing, or backend development when appropriate to the resume.
7. Do not invent projects, job titles, achievements, or experience.
8. Avoid generic and repetitive questions.
9. Match the requested interview type, experience level, and difficulty.
10. Use clear, natural language.
11. Each question must ask one main thing at a time.
12. Do not include hints, scores, or feedback.
13. Include a concise expected_answer with key points a good candidate
    should cover.
14. Return exactly ${totalQuestions} questions.
15. Return valid JSON only, without Markdown or code fences.

OUTPUT FORMAT:
{
  "questions": [
    {
      "question": "A question specifically related to the candidate's resume",
      "question_type": "TECHNICAL",
      "difficulty": "${difficulty}",
      "expected_answer": "Key points a good candidate should cover"
    }
  ]
}

Before returning, verify the question count, relevance, uniqueness,
and JSON validity.
`;

  let content;

  try {
    const response = await puter.ai.chat(prompt);

    content =
      typeof response === "string"
        ? response
        : response?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty response.");
    }
  } catch (error) {
    console.error("PUTER QUESTION GENERATION ERROR:", error);
    throw new Error(
      error?.message ||
        "Could not generate interview questions using Puter. Please try again."
    );
  }

  const cleanedContent = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let data;

  try {
    data = JSON.parse(cleanedContent);
  } catch {
    throw new Error("The AI returned invalid JSON. Please try again.");
  }

  const questions = data.questions;
  const requestedCount = Number(totalQuestions);

  if (!Array.isArray(questions)) {
    throw new Error("The AI returned an invalid question format.");
  }

  if (questions.length < requestedCount) {
    throw new Error(
      `Expected ${requestedCount} questions, but received ${questions.length}. Please try again.`
    );
  }

  const limitedQuestions = questions.slice(0, requestedCount);

  const validQuestions = limitedQuestions.every(
    (item) =>
      item &&
      typeof item.question === "string" &&
      item.question.trim().length > 0
  );

  if (!validQuestions) {
    throw new Error("Some generated questions are empty or invalid.");
  }

  return limitedQuestions.map((item) => ({
    ...item,
    question: item.question.trim(),
    question_type:
      typeof item.question_type === "string" &&
      item.question_type.trim()
        ? item.question_type
        : interviewType.toUpperCase() === "HR"
          ? "HR"
          : interviewType.toUpperCase() === "BEHAVIORAL"
            ? "BEHAVIORAL"
            : "TECHNICAL",
    expected_answer:
      typeof item.expected_answer === "string"
        ? item.expected_answer.trim()
        : "",
    topic:
      typeof item.topic === "string" && item.topic.trim()
        ? item.topic.trim()
        : "General",
    difficulty:
      typeof item.difficulty === "string"
        ? item.difficulty
        : difficulty,
  }));
};
