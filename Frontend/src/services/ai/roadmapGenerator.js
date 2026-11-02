
import { puter } from "@heyputer/puter.js";

puter.quiet = true;

const ROADMAP_SYSTEM_PROMPT = `
You are an expert technical interview preparation coach.

Generate a personalized 30-day learning roadmap for a software developer.

Return ONLY valid JSON with this structure:
{
  "targetRole": "Python Developer",
  "summary": "Short personalized roadmap summary",
  "focusAreas": ["Area 1", "Area 2", "Area 3", "Area 4"],
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "description": "Week objective",
      "days": [
        {
          "day": 1,
          "title": "Daily goal title",
          "description": "What the learner should do",
          "resource": "Resource name",
          "url": "https://valid-resource-url"
        }
      ]
    }
  ]
}

Requirements:
- Generate exactly 4 weeks covering days 1 through 30.
- Weeks 1, 2, and 3 contain 7 days each.
- Week 4 contains 9 days.
- Include exactly one learning goal per day.
- Use the target role, resume skills, missing skills, and interview feedback.
- Include relevant learning resources with HTTPS URLs.
- Make goals practical and achievable in about one hour per day.
- Do not invent the user's skills or experience.
- Return JSON only, without Markdown fences.
`;

function extractResponseText(response) {
  if (typeof response === "string") {
    return response;
  }

  const content =
    response?.message?.content ??
    response?.text ??
    response?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) =>
        typeof item === "string" ? item : item?.text ?? ""
      )
      .join("");
  }

  return "";
}

function parseRoadmapResponse(content) {
  // Remove Markdown code fences if the AI includes them.
  const cleaned = content
    .replace(/```(?:json)?/gi, "")
    .trim();

  // Extract the outermost JSON object.
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    console.error("Puter response:", content);
    throw new Error(
      "Puter did not return JSON. Please try generating again."
    );
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (error) {
    console.error("Failed to parse Puter response:", content);

    throw new Error(
      "Puter returned invalid JSON. Please try again."
    );
  }
}

function validateRoadmap(roadmap) {
  if (!Array.isArray(roadmap.weeks) || roadmap.weeks.length !== 4) {
    throw new Error("The roadmap must contain exactly 4 weeks.");
  }

  const expectedDaysPerWeek = [7, 7, 7, 9];
  let expectedDay = 1;

  for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
    const week = roadmap.weeks[weekIndex];

    if (
      !Array.isArray(week.days) ||
      week.days.length !== expectedDaysPerWeek[weekIndex]
    ) {
      throw new Error(
        `Week ${weekIndex + 1} has an incorrect number of daily goals.`
      );
    }

    if (!week.title || !week.description) {
      throw new Error(
        `Week ${weekIndex + 1} is missing its title or description.`
      );
    }

    for (const day of week.days) {
      if (
        day.day !== expectedDay ||
        !day.title ||
        !day.description ||
        !day.resource ||
        typeof day.url !== "string" ||
        !/^https:\/\/\S+$/i.test(day.url)
      ) {
        throw new Error(
          `Day ${expectedDay} is incomplete or has an invalid resource URL.`
        );
      }

      expectedDay++;
    }
  }

  if (expectedDay !== 31) {
    throw new Error("The roadmap must contain exactly 30 daily goals.");
  }
}

export async function generateLearningRoadmap({
  targetRole = "Python Developer",
  resumeSkills = [],
  missingSkills = [],
  interviewFeedback = "",
} = {}) {
  const prompt = `
Create a personalized 30-day roadmap using the following information.

Target role: ${targetRole}

Resume skills:
${resumeSkills.length ? resumeSkills.join(", ") : "Not provided"}

Skills to improve:
${missingSkills.length ? missingSkills.join(", ") : "Not provided"}

Interview feedback:
${interviewFeedback || "Not provided"}

Return exactly 30 daily goals in the required JSON format.
Return JSON only.
`;

  let response;

  try {
    response = await puter.ai.chat([
      {
        role: "system",
        content: ROADMAP_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ]);
  } catch (error) {
    console.error("Puter AI request failed:", error);

    throw new Error(
      "Could not connect to Puter AI. Please check your connection and try again."
    );
  }

  const content = extractResponseText(response);

  if (!content.trim()) {
    console.error("Unexpected Puter response:", response);

    throw new Error(
      "Puter returned an empty response. Please try again."
    );
  }

  const roadmap = parseRoadmapResponse(content);

  validateRoadmap(roadmap);

  return {
    ...roadmap,
    targetRole,
    focusAreas: Array.isArray(roadmap.focusAreas)
      ? roadmap.focusAreas
      : [],
  };
}
