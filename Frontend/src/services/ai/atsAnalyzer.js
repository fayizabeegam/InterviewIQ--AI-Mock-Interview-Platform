import { puter } from "@heyputer/puter.js";

const ATS_SYSTEM_PROMPT = `
You are an ATS resume analysis system.

Analyze the resume as a general professional resume.

IMPORTANT:
This is a general ATS resume quality analysis.
Do NOT compare the resume against a specific job description.

Evaluate only the information actually present in the resume.
Do not invent qualifications, achievements, experience, or skills.

Return ONLY valid JSON.
Do not return markdown.
Do not include explanations outside the JSON.

Return exactly this structure:

{
  "ats_score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "section_scores": {
    "content": 0,
    "skills": 0,
    "experience": 0,
    "projects": 0,
    "education": 0,
    "readability": 0
  }
}

SCORING RULES:

All scores must be integers from 0 to 100.

content:
Evaluate clarity, relevance, specificity, action-oriented writing,
and evidence of achievements.

skills:
Evaluate whether skills are clearly presented, relevant,
organized, and supported by the resume content.

experience:
Evaluate clarity of roles, responsibilities, accomplishments,
career information, and use of measurable results.

projects:
Evaluate project clarity, contribution, technologies or methods,
and demonstrated outcomes.
If projects are not normally relevant to the profession,
do not heavily penalize their absence.

education:
Evaluate whether education information is clearly presented
and sufficiently complete.

readability:
Evaluate organization, clarity, consistency, conciseness,
and how easily the resume content can be understood.

ATS SCORE:

First independently score each section from 0 to 100.

Then calculate ats_score using this weighted formula:

content × 0.20
skills × 0.15
experience × 0.25
projects × 0.10
education × 0.10
readability × 0.20

ats_score =
(content * 0.20) +
(skills * 0.15) +
(experience * 0.25) +
(projects * 0.10) +
(education * 0.10) +
(readability * 0.20)

Round the final result to the nearest integer.

IMPORTANT:
The ats_score MUST be mathematically calculated from the
section_scores using the formula above.

Do not choose ats_score independently.

Evaluate every resume independently.
Do not default to common scores such as 70, 75, 78, 80, or 85.

Use the full 0–100 scoring range when justified by the resume.

Do not give a high score simply because a resume contains
many keywords or skills.

Do not penalize a resume merely because the profession is
non-technical.

strengths:
Return 3 to 5 specific strengths supported by the resume.

weaknesses:
Return 3 to 5 specific weaknesses or areas that could be improved.

suggestions:
Return 3 to 5 practical improvements based on the weaknesses.

Keep each strength, weakness, and suggestion concise.
`;

export const analyzeResumeATS = async (resumeText) => {
  if (!resumeText?.trim()) {
    throw new Error("Resume text is required.");
  }

  try {
    const response = await puter.ai.chat([
      {
        role: "system",
        content: ATS_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: resumeText,
      },
    ]);

    const content = response?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty ATS response.");
    }

    const cleanedContent = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const result = JSON.parse(cleanedContent);

      const scores = result.section_scores;

      if (!scores) {
        throw new Error(
          "AI response does not contain section scores."
        );
      }

      // Validate and normalize AI scores
      const normalizeScore = (value, sectionName) => {
        const score = Number(value);

        if (!Number.isFinite(score)) {
          throw new Error(
            `Invalid ATS score for ${sectionName}.`
          );
        }

        // Keep score within 0–100
        return Math.min(
          100,
          Math.max(0, Math.round(score))
        );
      };

      const normalizedScores = {
        content: normalizeScore(
          scores.content,
          "content"
        ),

        skills: normalizeScore(
          scores.skills,
          "skills"
        ),

        experience: normalizeScore(
          scores.experience,
          "experience"
        ),

        projects: normalizeScore(
          scores.projects,
          "projects"
        ),

        education: normalizeScore(
          scores.education,
          "education"
        ),

        readability: normalizeScore(
          scores.readability,
          "readability"
        ),
      };

      // Replace AI values with validated values
      result.section_scores = normalizedScores;

      // Calculate final ATS score
      const calculatedScore =
        (normalizedScores.content * 0.20) +
        (normalizedScores.skills * 0.15) +
        (normalizedScores.experience * 0.25) +
        (normalizedScores.projects * 0.10) +
        (normalizedScores.education * 0.10) +
        (normalizedScores.readability * 0.20);

      result.ats_score = Math.round(
        calculatedScore
      );

      console.log(
        "CALCULATED ATS SCORE:",
        result.ats_score
      );

      return result;
    } catch (error) {
      console.error("ATS JSON PARSE ERROR:", error);
      console.error("INVALID ATS CONTENT:", cleanedContent);

      throw new Error(
        "AI returned an invalid ATS analysis format."
      );
    }

  } catch (error) {
    console.error("PUTER ATS ANALYZER ERROR:", error);
    throw error;
  }
};