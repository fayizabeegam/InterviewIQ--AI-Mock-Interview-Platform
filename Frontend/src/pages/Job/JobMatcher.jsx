import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Clipboard,
  FileText,
  Sparkles,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";

import {
  getResumes,
  getResumeDetail,
} from "../../services/resumeService";

import { analyzeJobMatchWithAI } from "../../services/ai/jobMatchAnalyzer";


const JobMatcher = () => {
  const navigate = useNavigate();

  // -----------------------------------------
  // State
  // -----------------------------------------

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [error, setError] = useState("");


  // -----------------------------------------
  // Load Resumes
  // -----------------------------------------

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("access_token");

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

          if (resumeList.length > 0) {
            setSelectedResumeId(
              String(resumeList[0].id)
            );
          }
        }

      } catch (error) {
        console.error(
          "Resume loading error:",
          error
        );

        setError(
          "Unable to load your resumes."
        );

      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);


  // -----------------------------------------
  // Analysis Animation
  // -----------------------------------------

  useEffect(() => {
    if (!analyzing) {
      setAnalysisStep(0);
      return;
    }

    const interval = setInterval(() => {
      setAnalysisStep((previousStep) =>
        previousStep < 4
          ? previousStep + 1
          : previousStep
      );
    }, 1200);

    return () => clearInterval(interval);

  }, [analyzing]);


  // -----------------------------------------
  // Paste Job Description
  // -----------------------------------------

  const handlePaste = async () => {
    try {
      const text =
        await navigator.clipboard.readText();

      setJobDescription(text);
      setError("");

    } catch (error) {
      console.error(
        "Unable to read clipboard:",
        error
      );

      setError(
        "Unable to paste automatically. Please paste the job description manually."
      );
    }
  };


  // -----------------------------------------
  // Analyze Resume
  // -----------------------------------------

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError(
        "Please enter a job description."
      );
      return;
    }

    if (!selectedResumeId) {
      setError(
        "Please select a resume."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisStep(0);
      setError("");

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "Authentication required."
        );
      }


      // Get full resume
      const response = await getResumeDetail(
        selectedResumeId,
        token
      );

      const resume =
        response.data?.data ??
        response.data;


      if (!resume?.parsed_text?.trim()) {
        throw new Error(
          "Resume text is not available."
        );
      }


      // AI Job Match
      const result =
        await analyzeJobMatchWithAI(
          resume.parsed_text,
          jobDescription
        );


      // Result Page
      navigate(
        "/job-matcher/result",
        {
          state: {
            matchResult: result,
            resumeTitle: resume.title,
            resumeId: resume.id,
            jobDescription,
          },
        }
      );

    } catch (error) {
      console.error(
        "Job match error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Unable to analyze resume."
      );

      setAnalyzing(false);
    }
  };


  // -----------------------------------------
  // Analysis Screen
  // -----------------------------------------

  if (analyzing) {
    const steps = [
      "Reading your resume",
      "Analyzing job requirements",
      "Matching skills and experience",
      "Finding missing skills",
      "Calculating your match score",
    ];

    return (
      <UserLayout>

        <div className="flex min-h-[80vh] items-center justify-center overflow-hidden">

          <div className="relative flex h-[320px] w-full max-w-2xl flex-col items-center justify-center px-6">


            {/* AI Icon */}

            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">

              <Sparkles className="h-6 w-6 animate-pulse text-indigo-600" />

            </div>


            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              AI Resume Analysis
            </p>


            {/* Moving Analysis Text */}

            <div className="relative h-24 w-full overflow-hidden">

              {steps.map((step, index) => {
                const difference =
                  index - analysisStep;

                return (
                  <div
                    key={step}
                    className={`
                      absolute left-0
                      flex w-full
                      items-center
                      justify-center
                      transition-all
                      duration-700
                      ease-out
                      ${
                        difference === 0
                          ? "translate-y-8 opacity-100"
                          : difference < 0
                          ? "-translate-y-10 opacity-0"
                          : "translate-y-20 opacity-0"
                      }
                    `}
                  >

                    <div className="flex items-center gap-3">

                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />

                      <span className="text-xl font-medium text-slate-800 md:text-2xl">

                        {step}

                        <span className="animate-pulse text-indigo-500">
                          ...
                        </span>

                      </span>

                    </div>

                  </div>
                );
              })}

            </div>


            {/* Progress */}

            <div className="mt-3 h-1 w-56 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-700"
                style={{
                  width: `${
                    ((analysisStep + 1) /
                      steps.length) *
                    100
                  }%`,
                }}
              />

            </div>


            <p className="mt-5 text-xs text-slate-400">
              This usually takes a few seconds
            </p>

          </div>

        </div>

      </UserLayout>
    );
  }


  // -----------------------------------------
  // Job Matcher Page
  // -----------------------------------------

  return (
    <UserLayout>

      <Container>

        <div className="py-8">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


            {/* Top Gradient */}

            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />


            <div className="p-6 md:p-8">


              {/* =================================
                  Header
              ================================= */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-200">

                    <BriefcaseBusiness className="h-5 w-5 text-white" />

                  </div>


                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                        Job Matcher
                      </h2>


                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        AI Powered
                      </span>

                    </div>


                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">

                      Paste a job description and compare it with your
                      resume to discover your match score, missing skills,
                      strengths, and improvement opportunities.

                    </p>

                  </div>

                </div>


                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">

                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />

                  Smart Matching

                </div>

              </div>


              <div className="my-7 h-px bg-slate-100" />


              {/* =================================
                  Resume Loading
              ================================= */}

              {loading ? (

                <div className="flex min-h-[260px] items-center justify-center">

                  <div className="flex items-center gap-3 text-sm text-slate-500">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                    Loading your resumes...

                  </div>

                </div>

              ) : (

                <div className="space-y-6">


                  {/* Error */}

                  {error && (

                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

                      {error}

                    </div>

                  )}


                  {/* =================================
                      Job Description
                  ================================= */}

                  <div>

                    <div className="mb-2.5 flex items-center justify-between">

                      <label className="text-sm font-semibold text-slate-700">
                        Job Description
                      </label>


                      <button
                        type="button"
                        onClick={handlePaste}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >

                        <Clipboard className="h-3.5 w-3.5" />

                        Paste

                      </button>

                    </div>


                    <textarea
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(
                          e.target.value
                        );

                        if (error) {
                          setError("");
                        }
                      }}
                      rows={10}
                      placeholder="Paste the complete job description here..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />


                    <div className="mt-1.5 flex items-center justify-between">

                      <p className="text-xs text-slate-400">
                        Paste the complete job posting for better match results.
                      </p>


                      <span className="text-xs text-slate-400">
                        {jobDescription.length} characters
                      </span>

                    </div>

                  </div>


                  {/* =================================
                      Resume Selection
                  ================================= */}

                  <div>

                    <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                      Select Resume
                    </label>


                    {resumes.length === 0 ? (

                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">

                        <FileText className="mx-auto h-7 w-7 text-slate-400" />


                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No resumes available
                        </p>


                        <p className="mt-1 text-xs text-slate-500">

                          Upload and analyze a resume first before
                          checking a job match.

                        </p>

                      </div>

                    ) : (

                      <div className="relative">

                        <FileText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />


                        <select
                          value={selectedResumeId}
                          onChange={(e) => {
                            setSelectedResumeId(
                              e.target.value
                            );

                            if (error) {
                              setError("");
                            }
                          }}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                          {resumes.map((resume) => (

                            <option
                              key={resume.id}
                              value={resume.id}
                            >
                              {resume.title ||
                                "Untitled Resume"}
                            </option>

                          ))}

                        </select>

                      </div>

                    )}

                  </div>


                  {/* =================================
                      Analyze Button
                  ================================= */}

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={
                      !jobDescription.trim() ||
                      !selectedResumeId ||
                      resumes.length === 0
                    }
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      px-6
                      py-3.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition-all
                      duration-200
                      hover:from-blue-700
                      hover:to-indigo-700
                      hover:shadow-md
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-100
                    "
                  >

                    <Sparkles className="h-4 w-4 shrink-0" />

                    <span className="whitespace-nowrap">
                      Check Resume Match
                    </span>

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </Container>

    </UserLayout>
  );
};


export default JobMatcher;