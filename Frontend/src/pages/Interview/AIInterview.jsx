import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  FileText,
  MessageSquareText,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";

import robotImage from "../../assets/images/robot.png";
import { getResumes, getResumeDetail } from "../../services/resumeService";
import {
  createInterview,
  startInterview,
  saveInterviewQuestions,
} from "../../services/interviewService";
import { generateInterviewQuestions } from "../../services/ai/questionGenerator";


const AIInterview = () => {

  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [experienceLevel, setExperienceLevel] = useState("junior");
  const [resumes, setResumes] = useState([]);
  const [resume, setResume] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    const loadResumes = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Authentication required.");
          return;
        }

        const response = await getResumes(token);

        const resumeList =
          response.data?.data ??
          response.data?.results ??
          response.data;

        if (Array.isArray(resumeList)) {
          setResumes(resumeList);
        }
      } catch (error) {
        console.error("Resume loading error:", error);
        setError("Unable to load your resumes.");
      }
    };

    loadResumes();
  }, []);

  // =====================================================
  // START INTERVIEW
  // =====================================================

  const handleStartInterview = async () => {
    if (!role.trim()) {
      setError("Please enter your target role.");
      return;
    }

    if (!resume) {
      setError("Please select a resume.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      // Get full resume
      const resumeResponse = await getResumeDetail(
        resume,
        token
      );

      const selectedResume =
        resumeResponse.data?.data ??
        resumeResponse.data;

      if (!selectedResume?.parsed_text?.trim()) {
        throw new Error(
          "Resume text is not available."
        );
      }

      // Create interview
      const interviewResponse = await createInterview(
        {
          resume: resume,
          job: null,
          interview_type: interviewType.toUpperCase(),
          difficulty:
            experienceLevel === "fresher"
              ? "EASY"
              : experienceLevel === "senior"
                ? "HARD"
                : "MEDIUM",
          total_questions: questionCount,
          duration_minutes: 30,
        },
        token
      );

      const interview =
        interviewResponse.data?.data ??
        interviewResponse.data;

      // Start interview
      await startInterview(
        interview.id,
        token
      );

      // Generate AI questions
      const questions =
        await generateInterviewQuestions({
          resumeText: selectedResume.parsed_text,
          interviewType:interviewType.toUpperCase(),
          experienceLevel: experienceLevel,
          difficulty:
            experienceLevel === "fresher"
              ? "EASY"
              : experienceLevel === "senior"
                ? "HARD"
                : experienceLevel === "mid"
                  ? "MEDIUM-HARD"
                  : "MEDIUM",
          totalQuestions: questionCount,
        });

      // Save questions
      await saveInterviewQuestions(
        interview.id,
        questions,
        token
      );

      // Go to interview room
      navigate(
        "/ai-interview/session",
        {
          state: {
            interviewId: interview.id,
          },
        }
      );

    } catch (error) {
      console.error(
        "Start interview error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Unable to start interview."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <UserLayout>

      <Container>

        <div className="py-8">

          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">


            {/* =====================================================
                LEFT SIDE
            ===================================================== */}

            <div>


              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600">

                <Sparkles size={14} />

                AI Interview

              </div>


              {/* Heading */}

              <h1 className="mt-5 max-w-lg text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">

                Practice Interviews

                <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  with AI
                </span>

              </h1>


              {/* Description */}

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">

                Get realistic, AI-powered interview practice with
                personalized questions, instant feedback, and detailed
                performance analysis.

              </p>


              {/* =====================================================
                  ROBOT IMAGE
              ===================================================== */}

              <div className="relative mt-7 flex min-h-[285px] items-end justify-center overflow-hidden rounded-[28px] ">


                {/* Decorative background */}


                {/* Floating Message */}

                <div className="absolute left-7 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-lg backdrop-blur-sm">

                  <MessageSquareText
                    size={22}
                    className="text-blue-600"
                  />

                </div>


                {/* Small sparkle */}

                <div className="absolute right-16 top-10 z-10 text-xl text-amber-400">
                  ✦
                </div>


                {/* Floating Stats */}

                <div className="absolute bottom-10 right-7 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-lg backdrop-blur-sm">

                  <TrendingUp
                    size={22}
                    className="text-violet-600"
                  />

                </div>


                {/* Robot */}

                <img
                  src={robotImage}
                  alt="AI Interview Assistant"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />

              </div>


              {/* =====================================================
                  BENEFITS
              ===================================================== */}

              <div className="mt-5 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">


                <div className="mb-5 flex items-center gap-2">

                  <Sparkles
                    size={18}
                    className="text-blue-600"
                  />

                  <h2 className="text-base font-semibold text-slate-900">
                    Why Practice with AI?
                  </h2>

                </div>


                <div className="space-y-4">

                  <Benefit
                    icon={MessageSquareText}
                    title="Realistic Interview Experience"
                    description="Practice with role-specific, AI-generated questions."
                    iconClass="bg-blue-50 text-blue-600"
                  />

                  <Benefit
                    icon={TrendingUp}
                    title="Instant Feedback"
                    description="Get detailed analysis on your answers."
                    iconClass="bg-violet-50 text-violet-600"
                  />

                  <Benefit
                    icon={Target}
                    title="Improve Your Skills"
                    description="Identify strengths and areas for improvement."
                    iconClass="bg-emerald-50 text-emerald-600"
                  />

                </div>

              </div>

            </div>



            {/* =====================================================
                INTERVIEW SETUP
            ===================================================== */}

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

              <div className="p-6 sm:p-8">


                {/* Header */}

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">

                    <MessageSquareText
                      size={25}
                      className="text-blue-600"
                    />

                  </div>


                  <div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      Set Up Your AI Interview
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      Customize your interview experience based on your goals.
                    </p>

                  </div>

                </div>


                <div className="my-7 h-px bg-slate-100" />


                {/* =====================================================
                    TARGET ROLE
                ===================================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Target Role
                  </label>


                  <div className="relative">

                    <BriefcaseBusiness
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Example: Python Developer"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />

                  </div>

                </div>



                {/* =====================================================
                    INTERVIEW TYPE
                ===================================================== */}

                <div className="mt-6">

                  <label className="mb-3 block text-sm font-semibold text-slate-800">
                    Interview Type
                  </label>


                  <div className="grid gap-3 sm:grid-cols-3">

                    <OptionButton
                      active={interviewType === "technical"}
                      onClick={() => setInterviewType("technical")}
                      icon={Code2}
                      label="Technical"
                    />

                    <OptionButton
                      active={interviewType === "hr"}
                      onClick={() => setInterviewType("hr")}
                      icon={Users}
                      label="HR"
                    />

                    <OptionButton
                      active={interviewType === "behavioral"}
                      onClick={() => setInterviewType("behavioral")}
                      icon={FileText}
                      label="Behavioral"
                    />

                  </div>

                </div>



                {/* =====================================================
                    EXPERIENCE LEVEL
                ===================================================== */}

                <div className="mt-6">

                  <label className="mb-3 block text-sm font-semibold text-slate-800">
                    Experience Level
                  </label>


                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    {[
                      ["fresher", "Fresher"],
                      ["junior", "Junior"],
                      ["mid", "Mid Level"],
                      ["senior", "Senior"],
                    ].map(([value, label]) => (

                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setExperienceLevel(value)
                        }
                        className={`
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-sm
                          font-medium
                          transition-all
                          ${
                            experienceLevel === value
                              ? "border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                          }
                        `}
                      >
                        {label}
                      </button>

                    ))}

                  </div>

                </div>



                {/* =====================================================
                    RESUME
                ===================================================== */}

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Select Resume
                  </label>


                  <div className="relative">

                    <FileText
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    />

                    <select
                      value={resume}
                      onChange={(e) =>
                        setResume(e.target.value)
                      }
                      className="
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3.5
                        pl-11
                        pr-12
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    >
                      <option value="">Select a resume</option>
                      {resumes.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.title}
                        </option>
                      ))}

                    </select>


                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>

                </div>



                {/* =====================================================
                    QUESTION COUNT
                ===================================================== */}

                <div className="mt-6">

                  <label className="mb-3 block text-sm font-semibold text-slate-800">
                    Number of Questions
                  </label>


                  <div className="grid grid-cols-4 gap-3">

                    {[5, 10, 15, 20].map((number) => (

                      <button
                        key={number}
                        type="button"
                        onClick={() =>
                          setQuestionCount(number)
                        }
                        className={`
                          rounded-xl
                          border
                          px-3
                          py-3
                          text-sm
                          font-semibold
                          transition-all
                          ${
                            questionCount === number
                              ? "border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                          }
                        `}
                      >
                        {number}
                      </button>

                    ))}

                  </div>

                </div>



                {/* =====================================================
                    START BUTTON
                ===================================================== */}
                {error && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={!role.trim() || !resume || loading}
                  className="
                    mt-8
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-violet-600
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                    shadow-blue-200
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-lg
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  <Play
                    size={17}
                    fill="currentColor"
                  />

                  {loading ? "Preparing Interview..." : "Start AI Interview"}

                  {!loading && (
                    <span className="ml-1">
                      →
                    </span>
                  )}

                </button>


                <p className="mt-3 text-center text-xs text-slate-400">
                  You can stop the interview anytime.
                </p>

              </div>

            </div>

          </div>

        </div>

      </Container>

    </UserLayout>
  );
};



/* =====================================================
   OPTION BUTTON
===================================================== */

const OptionButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        px-4
        py-3.5
        text-sm
        font-medium
        transition-all
        ${
          active
            ? "border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
        }
      `}
    >

      <Icon size={17} />

      {label}

    </button>
  );
};



/* =====================================================
   BENEFIT
===================================================== */

const Benefit = ({
  icon: Icon,
  title,
  description,
  iconClass,
}) => {

  return (
    <div className="flex items-start gap-3">

      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClass}
        `}
      >

        <Icon size={17} />

      </div>


      <div>

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
};


export default AIInterview;