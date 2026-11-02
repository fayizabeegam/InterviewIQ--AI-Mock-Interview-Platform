import json
from faster_whisper import WhisperModel

whisper_model = None


def get_whisper_model():
    global whisper_model

    if whisper_model is None:
        whisper_model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    return whisper_model

def transcribe_audio(audio_file):
    model = get_whisper_model()
    segments, info = model.transcribe(
        audio_file,
        beam_size=5
    )

    transcript = []

    for segment in segments:
        transcript.append(segment.text.strip())

    return " ".join(transcript).strip()


def build_question_prompt(
    resume_text,
    interview_type,
    difficulty,
    total_questions,
    job_description=None,
):
    prompt = f"""
You are an expert technical interviewer.

Generate {total_questions} interview questions based on the candidate's resume.

Interview Type:
{interview_type}

Difficulty:
{difficulty}

Candidate Resume:
{resume_text}
"""

    if job_description:
        prompt += f"""

Job Description:
{job_description}

Make the questions relevant to the job description as well.
"""

    prompt += """

Return ONLY valid JSON.

Use this exact structure:

{
    "questions": [
        {
            "question": "Question text",
            "question_type": "TECHNICAL",
            "difficulty": "MEDIUM",
            "expected_answer": "What a good candidate should cover"
        }
    ]
}

Rules:
- Do not include markdown.
- Do not include explanations outside JSON.
- Generate exactly the requested number of questions.
- Keep questions relevant to the candidate's resume.
- Do not repeat questions.
"""

    return prompt


def parse_generated_questions(response_text):
    try:
        data = json.loads(response_text)

        if not isinstance(data, dict):
            return []

        questions = data.get("questions", [])

        if not isinstance(questions, list):
            return []

        return questions

    except json.JSONDecodeError:
        return []


