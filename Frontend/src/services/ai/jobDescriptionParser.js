import { puter } from "@heyputer/puter.js";

export const parseJobDescriptionWithAI = async (jobDescription) => {
  if (!jobDescription?.trim()) {
    throw new Error("Job description is required.");
  }

  const prompt = `
You are an AI job description analyzer.

Analyze the following job description and return ONLY valid JSON.

Extract:

{
  "skills": [
    {
      "name": "Python",
      "priority": "REQUIRED"
    },
    {
      "name": "React",
      "priority": "PREFERRED"
    }
  ]
}

Rules:

- Extract only skills that are supported by the job description.
- Do not invent skills.
- Use REQUIRED when the job clearly requires the skill.
- Use PREFERRED when the skill is optional, preferred, desirable, or nice-to-have.
- Do not return duplicate skills.
- priority must be exactly "REQUIRED" or "PREFERRED".
- Return JSON only.
- Do not use markdown code blocks.

JOB DESCRIPTION:

${jobDescription}
`;

  const response = await puter.ai.chat(prompt);

  const content =
    typeof response === "string"
      ? response
      : response?.message?.content;

  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  const cleanedContent = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const result = JSON.parse(cleanedContent);

  if (!Array.isArray(result.skills)) {
    throw new Error(
      "AI response does not contain a valid skills list."
    );
  }

  return result;
};