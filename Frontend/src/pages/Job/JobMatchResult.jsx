import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Target,
  Star,
  Lightbulb,
  Sparkles,
  FileText,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";


const JobMatchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // -----------------------------------------
  // Passed Data
  // -----------------------------------------

  const matchResult =
    location.state?.matchResult;

  const resumeTitle =
    location.state?.resumeTitle;


  // -----------------------------------------
  // No Result
  // -----------------------------------------

  if (!matchResult) {
    return (
      <UserLayout>

        <Container>

          <div className="flex min-h-[70vh] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                <FileText className="h-6 w-6 text-slate-400" />

              </div>


              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No Match Analysis Found
              </h2>


              <p className="mt-2 text-sm text-slate-500">
                Analyze your resume against a job description first.
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/job-matcher")
                }
                className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Go to Job Matcher
              </button>

            </div>

          </div>

        </Container>

      </UserLayout>
    );
  }


  // -----------------------------------------
  // Result Values
  // -----------------------------------------

  const overallScore =
    Number(matchResult.overall_score) || 0;

  const atsScore =
    Number(matchResult.ats_score) || 0;

  const matchedSkills =
    matchResult.matched_skills || [];

  const missingSkills =
    matchResult.missing_skills || [];

  const strengths =
    matchResult.strengths || [];

  const weaknesses =
    matchResult.weaknesses || [];

  const recommendations =
    matchResult.recommendations || [];


  // -----------------------------------------
  // Main Result Page
  // -----------------------------------------

  return (
    <UserLayout>

      <Container>

        <div className="py-8">


          {/* =================================
              Back
          ================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/job-matcher")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Job Matcher

          </button>


          {/* =================================
              Main Report Card
          ================================= */}

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

                    <FileText className="h-5 w-5 text-white" />

                  </div>


                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                        Resume Match Report
                      </h2>


                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        AI Analysis
                      </span>

                    </div>


                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">

                      Review how your resume aligns with the job
                      requirements, skills, experience, and important
                      keywords.

                    </p>

                  </div>

                </div>


                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">

                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />

                  Match Insights

                </div>

              </div>


              <div className="my-7 h-px bg-slate-100" />


              {/* =================================
                  Resume Name
              ================================= */}

              {resumeTitle && (

                <div className="mb-6">

                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">

                    <FileText className="h-3.5 w-3.5 text-blue-600" />

                    {resumeTitle}

                  </span>

                </div>

              )}


              {/* =================================
                  Score + Summary
              ================================= */}

              <div className="grid gap-5 lg:grid-cols-[320px_1fr]">


                {/* Overall Score */}

                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div
                    className="relative flex h-52 w-52 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(
                        #4f46e5 ${overallScore * 3.6}deg,
                        #e2e8f0 0deg
                      )`,
                    }}
                  >

                    <div className="absolute h-[168px] w-[168px] rounded-full bg-white" />


                    <div className="relative z-10 text-center">

                      <p className="text-4xl font-bold text-slate-900">
                        {overallScore}%
                      </p>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Overall Match
                      </p>

                    </div>

                  </div>

                </div>


                {/* Match Summary */}

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60 p-6 shadow-sm md:p-8">


                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                      <Target className="h-5 w-5" />

                    </div>


                    <div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        Resume Match Analysis
                      </h3>


                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">

                        Your resume has been compared with the skills,
                        experience, technologies, and requirements
                        mentioned in the job description.

                      </p>

                    </div>

                  </div>


                  {/* Summary Stats */}

                  <div className="mt-7 grid gap-4 sm:grid-cols-3">


                    {/* Matching Skills */}

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                          <CheckCircle2 className="h-5 w-5" />

                        </div>


                        <div>

                          <p className="text-2xl font-bold text-slate-900">
                            {matchedSkills.length}
                          </p>

                          <p className="text-xs text-slate-500">
                            Matching Skills
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Missing Skills */}

                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

                          <AlertTriangle className="h-5 w-5" />

                        </div>


                        <div>

                          <p className="text-2xl font-bold text-slate-900">
                            {missingSkills.length}
                          </p>

                          <p className="text-xs text-slate-500">
                            Missing Skills
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ATS Match */}

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                          <Target className="h-5 w-5" />

                        </div>


                        <div>

                          <p className="text-2xl font-bold text-indigo-600">
                            {atsScore}%
                          </p>

                          <p className="text-xs text-slate-500">
                            ATS Match
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* Keyword Alignment */}

                  <div className="mt-6 rounded-xl border border-slate-200/70 bg-white/70 p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Job Keyword Alignment
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Alignment with important job keywords and requirements.
                        </p>

                      </div>


                      <span className="shrink-0 text-sm font-bold text-indigo-600">
                        {atsScore}%
                      </span>

                    </div>


                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              atsScore
                            )
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================
                  Skills
              ================================= */}

              <div className="mt-5 grid gap-5 lg:grid-cols-2">


                {/* Matching Skills */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">

                      <CheckCircle2 className="h-5 w-5" />

                    </div>


                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Matching Skills
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {matchedSkills.length} skills aligned with this role
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    {matchedSkills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>


                {/* Missing Skills */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

                      <AlertTriangle className="h-5 w-5" />

                    </div>


                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Missing Skills
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Important skills to strengthen
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    {missingSkills.map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

              </div>


              {/* =================================
                  Strengths + Improvements
              ================================= */}

              <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">


                {/* Strengths */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                      <Star className="h-5 w-5" />

                    </div>


                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Key Strengths
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Strong areas relevant to this position
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 space-y-3">

                    {strengths.map(
                      (strength, index) => (

                        <div
                          key={`${strength}-${index}`}
                          className="flex gap-3 rounded-xl bg-indigo-50/60 p-4"
                        >

                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                            ✓
                          </div>


                          <p className="text-sm leading-6 text-slate-700">
                            {strength}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* Improvements */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                      <Lightbulb className="h-5 w-5" />

                    </div>


                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Areas for Improvement
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Gaps to address for this specific role
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 space-y-3">

                    {weaknesses.map(
                      (weakness, index) => (

                        <div
                          key={`${weakness}-${index}`}
                          className="flex gap-3 rounded-xl bg-amber-50/70 p-4"
                        >

                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">
                            !
                          </div>


                          <p className="text-sm leading-6 text-slate-700">
                            {weakness}
                          </p>

                        </div>

                      )
                    )}


                    {/* Missing skills in improvements */}

                    {missingSkills.map(
                      (skill, index) => (

                        <div
                          key={`missing-${skill}-${index}`}
                          className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4"
                        >

                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />


                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              Strengthen {skill}
                            </p>


                            <p className="mt-1 text-xs leading-5 text-slate-500">

                              This requirement was identified in the
                              job description but was not clearly
                              supported by your resume.

                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>


              {/* =================================
                  Recommendations
              ================================= */}

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                    <Sparkles className="h-5 w-5" />

                  </div>


                  <div>

                    <h3 className="text-sm font-semibold text-slate-900">
                      Recommendations
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Practical ways to improve your resume for this job
                    </p>

                  </div>

                </div>


                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (

                      <div
                        key={`${recommendation}-${index}`}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-5"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                          {index + 1}
                        </div>


                        <p className="mt-4 text-sm leading-6 text-slate-700">
                          {recommendation}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* =================================
                  Bottom Action
              ================================= */}

              <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white md:flex-row">

                <div>

                  <h3 className="text-sm font-semibold">
                    Ready to improve your match?
                  </h3>

                  <p className="mt-1 text-sm text-blue-100">
                    Update your resume and run another job analysis.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/job-matcher")
                  }
                  className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 md:w-auto"
                >
                  Analyze Another Job
                </button>

              </div>


            </div>

          </div>

        </div>

      </Container>

    </UserLayout>
  );
};


export default JobMatchResult;