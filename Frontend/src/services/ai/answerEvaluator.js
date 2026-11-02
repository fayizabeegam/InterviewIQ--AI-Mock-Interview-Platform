import { puter } from "@heyputer/puter.js";

export const evaluateInterviewAnswer = async ({
  question,
  answer,
  interviewType = "technical",
  experienceLevel = "junior",
  difficulty = "MEDIUM",
}) => {
  if (!question?.trim()) {
    throw new Error("The interview question is missing.");
  }

  if (!answer?.trim()) {
    throw new Error("Please provide an answer to evaluate.");
  }

  const prompt = `
You are an expert AI interviewer conducting a realistic interview.

INTERVIEW TYPE:
${interviewType}

CANDIDATE EXPERIENCE LEVEL:
${experienceLevel}

EXPECTED DIFFICULTY:
${difficulty}

INTERVIEW QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

EVALUATION RULES:

1. Evaluate the answer according to the question, interview type,
   experience level, and expected difficulty.
2. Fresher: assess fundamental understanding, basic concepts,
   and relevant academic or personal projects.
3. Junior: assess practical knowledge, basic implementation,
   debugging, and project experience.
4. Mid Level: assess independent problem-solving, implementation
   decisions, debugging, and optimization.
5. Senior: assess architecture, scalability, trade-offs,
   complex problem-solving, and technical decision-making.
6. Do not expect senior-level knowledge from a fresher or junior.
7. Do not reward irrelevant content.
8. Evaluate technical correctness where applicable.
9. Evaluate clarity, communication, relevance, and completeness.
10. All five scores must be integers between 0 and 100.
11. Keep feedback concise, specific, and constructive.

INTERVIEWER RESPONSE RULES:

12. interviewer_response is spoken aloud immediately after the answer.
13. Respond to something the candidate actually said.
14. Acknowledge a relevant point without repeating the entire answer.
15. Do not simply copy or paraphrase the candidate's full answer.
16. Do not provide the expected answer or reveal the ideal solution.
17. Do not reveal scores or detailed evaluation feedback.
18. Use one or two short, natural sentences.
19. Be encouraging but honest. Do not praise every answer automatically.
20. Avoid repeating generic phrases such as "Thank you for your answer"
    after every response.
21. If the answer is incomplete, acknowledge what the candidate covered
    without revealing the missing information.
22. Do not include a question in interviewer_response.
23. Do not use question marks in interviewer_response.
24. Put any follow-up question ONLY in follow_up_question.

FOLLOW-UP RULES:

25. Decide whether a follow-up would help explore the candidate's answer.
26. If needed, generate exactly ONE relevant follow-up question.
27. Base it on the original question and the candidate's actual answer.
28. Match the selected experience level and difficulty.
29. Do not provide the answer within the follow-up question.
30. If no follow-up is needed, set needs_follow_up to false and
    follow_up_question to an empty string.
31. Identify 1–3 genuine strengths demonstrated by the candidate.
32. Identify 1–3 specific, actionable improvements based on the answer.
33. Base both lists on the candidate's actual answer, not generic advice.
34. If the answer is empty or invalid, do not invent strengths.

Return ONLY valid JSON using exactly this structure:

{
  "score": 0,
  "relevance": 0,
  "technical_accuracy": 0,
  "communication": 0,
  "completeness": 0,
  "needs_follow_up": false,
  "interviewer_response": "A brief, natural acknowledgement based on the candidate's actual answer.",
  "feedback": "Concise and specific feedback.",
  "strengths": [
    "A specific strength demonstrated in the answer"
  ],
  "improvements": [
    "A specific area to improve based on the answer"
  ],
  "follow_up_question": ""
}

Return integer scores from 0 to 100.
Return a boolean for needs_follow_up.
Return at most one follow-up question.
Do not include Markdown or text outside the JSON.
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
    console.error("PUTER ANSWER EVALUATION ERROR:", error);
    throw new Error(
      error?.message ||
        "Could not evaluate your answer using Puter. Please try again."
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

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid answer evaluation response from AI.");
  }

  const scoreFields = [
    "score",
    "relevance",
    "technical_accuracy",
    "communication",
    "completeness",
  ];

  for (const field of scoreFields) {
    const score = data[field];

    if (
      typeof score !== "number" ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 100
    ) {
      throw new Error(`Invalid evaluation score: ${field}.`);
    }
  }

  if (
    typeof data.needs_follow_up !== "boolean" ||
    typeof data.interviewer_response !== "string" ||
    typeof data.feedback !== "string" ||
    typeof data.follow_up_question !== "string" ||
    !Array.isArray(data.strengths) ||
    !Array.isArray(data.improvements) ||
    !data.strengths.every((item) => typeof item === "string") ||
    !data.improvements.every((item) => typeof item === "string")
  ) {
    throw new Error("Invalid answer evaluation response from AI.");
  }

  data.interviewer_response = data.interviewer_response.trim();
  data.feedback = data.feedback.trim();
  data.follow_up_question = data.follow_up_question.trim();

  data.strengths = data.strengths
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  data.improvements = data.improvements
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!data.needs_follow_up || !data.follow_up_question) {
    data.needs_follow_up = false;
    data.follow_up_question = "";
  }

  return data;
};
