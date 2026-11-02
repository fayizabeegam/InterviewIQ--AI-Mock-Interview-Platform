import { puter } from "@heyputer/puter.js";


export const analyzeJobMatchWithAI = async (
  resumeText,
  jobDescription
) => {
  if (!resumeText?.trim()) {
    throw new Error("Resume text is required.");
  }

  if (!jobDescription?.trim()) {
    throw new Error("Job description is required.");
  }

  const prompt = `
You are an AI resume-to-job matching assistant.

Compare the candidate's resume with the provided job description.

Return ONLY valid JSON using exactly this structure:

{
  "overall_score": 0,
  "ats_score": 0,
  "matched_skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

SCORING:

overall_score:
- Integer between 0 and 100.
- Measure how well the candidate matches this specific job.
- Consider skills, experience, projects, education, and responsibilities.

ats_score:
- Integer between 0 and 100.
- Measure resume alignment with the job's important skills, keywords, technologies, and requirements.

matched_skills:
- Skills or technologies required by the job that are clearly supported by the resume.

missing_skills:
- Important job requirements or skills that are not clearly supported by the resume.

strengths:
- Specific candidate strengths relevant to this job.

weaknesses:
- Relevant gaps or weaker areas compared with the job requirements.

recommendations:
- Practical resume improvements for this specific job.

IMPORTANT RULES:

- Use only information supported by the resume and job description.
- Never invent candidate skills or experience.
- Do not assume missing information.
- Do not treat a skill as matched unless the resume supports it.
- Avoid duplicate items.
- Keep list items concise.
- Return numbers for overall_score and ats_score.
- Return arrays for all other fields.
- Return JSON only.
- Do not return markdown.
- Do not use code blocks.


RESUME:

${resumeText}


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

  if (
    typeof result.overall_score !== "number" ||
    typeof result.ats_score !== "number"
  ) {
    throw new Error("AI returned invalid match scores.");
  }

  const requiredArrays = [
    "matched_skills",
    "missing_skills",
    "strengths",
    "weaknesses",
    "recommendations",
  ];

  for (const field of requiredArrays) {
    if (!Array.isArray(result[field])) {
      throw new Error(
        `AI returned invalid ${field}.`
      );
    }
  }

  result.overall_score = Math.max(
    0,
    Math.min(100, Math.round(result.overall_score))
  );

  result.ats_score = Math.max(
    0,
    Math.min(100, Math.round(result.ats_score))
  );

  return result;
};