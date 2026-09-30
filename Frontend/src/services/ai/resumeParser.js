import { puter } from "@heyputer/puter.js";


const RESUME_SYSTEM_PROMPT = `
You are a resume information extraction system.

Extract structured information from the resume provided.

IMPORTANT RULES:

1. Do not invent information.
2. Only use information present in the resume.
3. Return ONLY valid JSON.
4. Do not include markdown.
5. Do not include explanations.

Return exactly this structure:

{
  "education": [
    {
      "institution": "",
      "degree": "",
      "field_of_study": "",
      "start_date": null,
      "end_date": null
    }
  ],

  "certifications": [
    {
      "name": "",
      "issuer": "",
      "start_date": null,
      "end_date": null
    }
  ],

  "languages": [
    {
      "name": "",
      "proficiency": ""
    }
  ],

  "experience": [
    {
      "company": "",
      "designation": "",
      "employment_type": "FULL_TIME",
      "location": "",
      "start_date": null,
      "end_date": null,
      "currently_working": false,
      "description": ""
    }
  ],

  "projects": [
    {
      "title": "",
      "description": "",
      "github_url": "",
      "live_url": "",
      "technologies": [],
      "start_date": null,
      "end_date": null
    }
  ],

  "skills": [
    {
      "name": "",
      "category": "OTHER"
    }
  ]
}


EDUCATION, CERTIFICATION AND LANGUAGE RULES:

EDUCATION:
Only include formal academic qualifications such as
degrees, diplomas, university or college education.

Do NOT include professional certifications,
training courses, or certificate programs in education.


CERTIFICATIONS:
Include certifications, professional training,
certificate courses, and certification programs.

For certifications:
"name" = certification or course name.
"issuer" = organization or institution that issued
or provided the certification.

Do NOT duplicate certifications inside education.


LANGUAGES:
Extract human/spoken languages from the resume's
Languages section.

Examples:
English: Read, Write, Speak
→
{
  "name": "English",
  "proficiency": "Read, Write, Speak"
}

Tamil: Speak
→
{
  "name": "Tamil",
  "proficiency": "Speak"
}

Do NOT add spoken languages to the skills array.
Do NOT invent proficiency information.

DATE RULES:

Use YYYY-MM-DD.

If only month and year exist:
March 2024 → 2024-03-01

If only year exists:
2024 → 2024-01-01

If unknown:
null

employment_type must be one of:

FULL_TIME
PART_TIME
INTERN
FREELANCE
CONTRACT

skill category must be one of:

TECHNICAL
TOOLS_TECHNOLOGIES
DOMAIN_KNOWLEDGE
MANAGEMENT
COMMUNICATION
LEADERSHIP
ANALYTICAL
CREATIVE
LANGUAGE
SOFT_SKILL
OTHER

Do not classify spoken languages such as English,
Malayalam or Tamil as programming skills.


SKILL CLASSIFICATION RULES:

IMPORTANT:
If the resume explicitly groups a skill under a heading or
category, preserve the meaning of that original grouping.

For example:

"Programming Languages & Backend Frameworks"
→ TECHNICAL

"Frontend Technologies"
→ TECHNICAL

"Database & API Tools"
→ TOOLS_TECHNOLOGIES

"AI & Data Processing"
→ TECHNICAL

"Cloud & Version Control"
→ TOOLS_TECHNOLOGIES

"Soft Skills"
→ SOFT_SKILL

"Languages"
→ LANGUAGE


TECHNICAL:
Programming languages, backend/frontend frameworks,
libraries, development technologies, AI/data-processing
technologies, and profession-specific technical skills.

Examples:
Python, JavaScript, SQL, Django,
Django REST Framework (DRF), React.js,
HTML5, CSS3, Bootstrap, Tailwind CSS,
OpenCV, PIL, YOLO.


TOOLS_TECHNOLOGIES:
Development tools, databases, infrastructure,
cloud services, API/testing tools, version-control tools,
and supporting platforms.

Examples:
MySQL, PostgreSQL, Redis, Git, GitHub,
Postman, AWS S3, AWS IAM, Jira.


DOMAIN_KNOWLEDGE:
Knowledge specific to a profession or industry.

Examples:
Taxation, auditing, recruitment, payroll,
compliance, healthcare procedures.


MANAGEMENT:
Planning, coordination, project management,
risk management, and resource management.


COMMUNICATION:
Presentation, stakeholder communication,
negotiation, interviewing, and written communication.


LEADERSHIP:
Team leadership, mentoring, delegation,
and decision-making.


ANALYTICAL:
Problem solving, critical thinking,
research, and analytical thinking.


CREATIVE:
Content creation, copywriting, design thinking,
visual design, and creative strategy.


LANGUAGE:
Human languages only.

Examples:
English, Malayalam, Hindi, Tamil.


SOFT_SKILL:
Interpersonal or behavioral skills.

Examples:
Adaptability, teamwork, communication,
time management, attention to detail.


OTHER:
Use only when none of the categories above fit.


Do not classify programming frameworks such as Django,
Django REST Framework, React.js, Bootstrap, or Tailwind CSS
as TOOLS_TECHNOLOGIES when they are presented as development
technologies in the resume.

Do not invent skills that are not present in the resume.
`;


export const parseResumeWithAI = async (resumeText) => {
  if (!resumeText?.trim()) {
    throw new Error("Resume text is required.");
  }

  console.log(
    "RESUME TEXT LENGTH:",
    resumeText.length
  );

  console.log("Calling Puter AI...");

  try {
    const response = await puter.ai.chat([
      {
        role: "system",
        content: RESUME_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: resumeText,
      },
    ]);

    console.log("Puter AI response received.");

    const content = response?.message?.content;

    console.log(
      "AI RAW CONTENT:",
      content
    );

    if (!content) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    const cleanedContent = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error(
        "JSON PARSE ERROR:",
        error
      );

      console.error(
        "INVALID AI CONTENT:",
        cleanedContent
      );

      throw new Error(
        "AI returned an invalid resume format."
      );
    }

  } catch (error) {
    console.error(
      "PUTER RESUME PARSER ERROR:",
      error
    );

    throw error;
  }
};