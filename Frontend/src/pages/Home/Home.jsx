import { useNavigate } from "react-router-dom";
import {
  Bot,
  Code2,
  BarChart3,
  Map,
  FileText,
  Target,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Clock3,
  ChevronDown,
} from "lucide-react";
import { FaRobot } from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";


function Home() {
  const navigate = useNavigate();
  const testimonialCards = [
  {
    quote:
      "The AI feedback helped me identify weaknesses I didn't notice before. It made my interview preparation much more focused.",
    name: "Aisha",
    role: "Python Developer",
    initial: "A",
    score: "7.2 → 8.6",
    improvement: "+19%",
  },
  {
    quote:
      "The mock interviews felt surprisingly realistic. Practicing how I explain technical concepts improved my confidence.",
    name: "Rahul",
    role: "Backend Developer",
    initial: "R",
    score: "7.5 → 8.4",
    improvement: "+12%",
  },
  {
    quote:
      "Instead of randomly preparing questions, I could clearly see which skills needed more attention after every interview.",
    name: "Neha",
    role: "Full Stack Developer",
    initial: "N",
    score: "6.9 → 8.2",
    improvement: "+18%",
  },
  {
    quote:
      "The performance feedback showed me that my technical knowledge was good, but my answers needed better structure.",
    name: "Arjun",
    role: "Software Developer",
    initial: "A",
    score: "7.4 → 8.7",
    improvement: "+17%",
  },
  {
    quote:
      "Being able to practice whenever I wanted made interview preparation much easier and more consistent.",
    name: "Meera",
    role: "Frontend Developer",
    initial: "M",
    score: "7.1 → 8.5",
    improvement: "+20%",
  },
  ];
  

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <Navbar />

      {/* =====================================================
        HERO — AI INTERVIEW EXPERIENCE
      ===================================================== */}
      <section className="relative min-h-screen overflow-hidden bg-white pt-20">

        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(#2563eb 1px, transparent 1px),
              linear-gradient(90deg, #2563eb 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Background glows */}
        <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[130px]" />

        <div className="pointer-events-none absolute -right-32 top-20 h-[600px] w-[600px] rounded-full bg-indigo-200/40 blur-[140px]" />


        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">

          {/* =================================================
              LEFT
          ================================================= */}
          <div className="relative z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-700 backdrop-blur">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>

              AI-POWERED INTERVIEW PREPARATION

            </div>


            {/* Heading */}
            <h1 className="mt-7 max-w-2xl text-[48px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[72px]">

              Practice interviews.

              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Get smarter feedback.
              </span>

              <span className="block">
                Improve faster.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
              Your personal AI interview coach for realistic mock interviews,
              instant feedback, coding practice, and measurable progress.
            </p>


            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-blue-200"
              >
                Start Practicing Free

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>


              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Play size={11} fill="currentColor" />
                </div>

                See How It Works
              </button>

            </div>


            {/* Trust / benefits */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

              <HeroTrust text="Role-specific practice" />
              <HeroTrust text="Instant AI feedback" />
              <HeroTrust text="Track your progress" />

            </div>

          </div>


          {/* =================================================
              RIGHT — LIVE AI INTERVIEW
          ================================================= */}
          <div className="relative z-10 mx-auto w-full max-w-[680px]">

            {/* Decorative glow behind app */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/30 blur-[90px]" />


            {/* =================================================
                FLOATING SCORE
            ================================================= */}
            <div className="absolute -left-3 top-14 z-30 hidden rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl shadow-slate-200/60 backdrop-blur sm:block lg:-left-10">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <TrendingUp size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-medium text-slate-400">
                    Interview Score
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">

                    <p className="text-sm font-bold text-slate-900">
                      8.6/10
                    </p>

                    <span className="text-[10px] font-semibold text-green-600">
                      +18%
                    </span>

                  </div>
                </div>

              </div>

            </div>


            {/* =================================================
                MAIN APP WINDOW
            ================================================= */}
            <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-2.5 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.25)]">

              {/* App header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

                <div className="flex items-center gap-3">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
                  </div>

                  <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                    InterviewIQ / AI Interview
                  </span>

                </div>


                <div className="flex items-center gap-2 rounded-full bg-green-50 px-2.5 py-1">

                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  <span className="text-[9px] font-bold text-green-600">
                    LIVE
                  </span>

                </div>

              </div>


              {/* =================================================
                  INTERVIEW BODY
              ================================================= */}
              <div className="rounded-b-[24px] bg-slate-950 p-5 sm:p-7">

                {/* Interview heading */}
                <div className="flex items-start justify-between gap-5">

                  <div className="flex items-center gap-3">

                    <div className="relative">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <Bot size={20} />
                      </div>

                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />

                    </div>


                    <div>
                      <p className="text-sm font-bold text-white">
                        Python Developer
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Technical Mock Interview
                      </p>
                    </div>

                  </div>


                  <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-medium text-slate-400">
                    Question 4 / 10
                  </div>

                </div>


                {/* Progress */}
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">

                  <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />

                </div>


                {/* AI Question */}
                <div className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-blue-400"
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400">
                      AI Interviewer
                    </span>

                  </div>


                  <p className="mt-4 text-sm font-medium leading-7 text-slate-200 sm:text-[15px]">
                    “Can you explain how Django REST Framework handles
                    authentication and how you would secure an API?”
                  </p>

                </div>


                {/* User Answer */}
                <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/[0.07] p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300">
                        YOU
                      </div>

                      <span className="text-[10px] font-medium text-slate-400">
                        Your answer
                      </span>

                    </div>


                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-400">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                      Listening

                    </div>

                  </div>


                  {/* Waveform */}
                  <div className="mt-5 flex h-14 items-center justify-center gap-[5px]">

                    {[
                      12, 20, 32, 18, 40, 25, 46, 30,
                      20, 38, 48, 28, 42, 20, 32, 15,
                      25, 36, 22, 14,
                    ].map((height, index) => (

                      <span
                        key={index}
                        style={{
                          height: `${height}px`,
                        }}
                        className="w-[3px] rounded-full bg-gradient-to-t from-blue-600 to-blue-300"
                      />

                    ))}

                  </div>


                  <div className="mt-1 flex items-center justify-between text-[9px] text-slate-600">

                    <span>00:42</span>

                    <span>AI is listening...</span>

                  </div>

                </div>


                {/* =================================================
                    BOTTOM STATUS
                ================================================= */}
                <div className="mt-5 grid grid-cols-3 gap-2">

                  <HeroMetric
                    label="Clarity"
                    value="88%"
                  />

                  <HeroMetric
                    label="Technical"
                    value="84%"
                  />

                  <HeroMetric
                    label="Confidence"
                    value="91%"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                FLOATING AI FEEDBACK
            ================================================= */}
            <div className="absolute -bottom-7 right-0 z-30 hidden max-w-[235px] rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl shadow-slate-200/70 backdrop-blur sm:block lg:-right-7">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Sparkles size={16} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <p className="text-[10px] font-bold text-slate-800">
                      AI Insight
                    </p>

                    <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[8px] font-bold text-green-600">
                      GOOD
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Strong explanation. Add an example of JWT token refresh.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
        
      </section>


      {/* =====================================================
      COMPANY INTERVIEW PREPARATION
      ===================================================== */}
      <section className="relative overflow-hidden border-y border-slate-100 bg-slate-800 py-8">

        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-7 flex items-center justify-center gap-4 px-5">

            <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-slate-200 sm:block" />

            <p className="shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Prepare for interviews at leading tech companies
            </p>

            <div className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-slate-200 sm:block" />

          </div>


          {/* Moving Companies */}
          <div className="relative overflow-hidden">

            {/* Left Fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-28" />

            {/* Right Fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-28" />


            <div className="company-marquee flex w-max items-center">

              {/* First Set */}
              <CompanyLogo name="Google">
                <span className="font-semibold tracking-tight">
                  Google
                </span>
              </CompanyLogo>


              <CompanyLogo name="Microsoft">
                <span className="flex items-center gap-2">

                  <span className="grid grid-cols-2 gap-[2px]">
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                  </span>

                  <span className="font-semibold">
                    Microsoft
                  </span>

                </span>
              </CompanyLogo>


              <CompanyLogo name="Amazon">
                <span className="font-bold tracking-tight">
                  amazon
                </span>
              </CompanyLogo>


              <CompanyLogo name="Meta">
                <span className="flex items-center gap-2">
                  <span className="text-xl font-medium">∞</span>
                  <span className="font-semibold">Meta</span>
                </span>
              </CompanyLogo>


              <CompanyLogo name="Apple">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-xl"></span>
                  Apple
                </span>
              </CompanyLogo>


              <CompanyLogo name="Netflix">
                <span className="font-black tracking-[0.08em]">
                  NETFLIX
                </span>
              </CompanyLogo>


              <CompanyLogo name="Spotify">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">◉</span>
                  Spotify
                </span>
              </CompanyLogo>


              <CompanyLogo name="Airbnb">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">♧</span>
                  airbnb
                </span>
              </CompanyLogo>


              {/* Duplicate Set for infinite animation */}
              <CompanyLogo name="Google">
                <span className="font-semibold tracking-tight">
                  Google
                </span>
              </CompanyLogo>


              <CompanyLogo name="Microsoft">
                <span className="flex items-center gap-2">

                  <span className="grid grid-cols-2 gap-[2px]">
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                    <span className="h-[7px] w-[7px] bg-current" />
                  </span>

                  <span className="font-semibold">
                    Microsoft
                  </span>

                </span>
              </CompanyLogo>


              <CompanyLogo name="Amazon">
                <span className="font-bold tracking-tight">
                  amazon
                </span>
              </CompanyLogo>


              <CompanyLogo name="Meta">
                <span className="flex items-center gap-2">
                  <span className="text-xl">∞</span>
                  <span className="font-semibold">Meta</span>
                </span>
              </CompanyLogo>


              <CompanyLogo name="Apple">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-xl"></span>
                  Apple
                </span>
              </CompanyLogo>


              <CompanyLogo name="Netflix">
                <span className="font-black tracking-[0.08em]">
                  NETFLIX
                </span>
              </CompanyLogo>


              <CompanyLogo name="Spotify">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">◉</span>
                  Spotify
                </span>
              </CompanyLogo>


              <CompanyLogo name="Airbnb">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">♧</span>
                  airbnb
                </span>
              </CompanyLogo>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
        FEATURES — BENTO GRID
      ===================================================== */}
      <section
        id="features"
        className="relative scroll-mt-20 overflow-hidden bg-white px-5 py-28 sm:px-8 lg:px-10"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              POWERED BY AI
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[54px]">
              Everything you need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                master your interview.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Practice, analyze and improve with intelligent tools designed
              around your interview journey.
            </p>

          </div>


          {/* =====================================================
              BENTO GRID
          ===================================================== */}
          <div className="mt-16 grid gap-5 lg:grid-cols-12">

            {/* ================================================
                AI MOCK INTERVIEW — LARGE CARD
            ================================================= */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white lg:col-span-7 lg:row-span-2 sm:p-9">

              {/* Glow */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative z-10">

                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                    <Bot size={23} />
                  </div>

                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    AI Live
                  </span>

                </div>

                <div className="mt-10">

                  <p className="text-xs font-semibold tracking-[0.18em] text-blue-300">
                    AI MOCK INTERVIEW
                  </p>

                  <h3 className="mt-3 max-w-md text-3xl font-bold tracking-tight">
                    Practice interviews that feel real.
                  </h3>

                  <p className="mt-4 max-w-lg leading-7 text-slate-400">
                    Get role-specific questions and experience realistic
                    conversations with your personal AI interviewer.
                  </p>

                </div>


                {/* Fake live interview */}
                <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">

                  <div className="flex items-center gap-3">

                    <div className="relative">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
                        <Bot size={20} />
                      </div>

                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-green-400" />

                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        InterviewIQ AI
                      </p>

                      <p className="text-xs text-slate-400">
                        Technical Interview
                      </p>
                    </div>

                  </div>


                  <p className="mt-5 text-sm leading-6 text-slate-200">
                    “Can you explain a challenging project you've worked on
                    and how you approached solving the problem?”
                  </p>


                  {/* Voice waveform */}
                  <div className="mt-6 flex h-10 items-center justify-center gap-1">

                    {[12, 20, 30, 18, 34, 25, 40, 22, 32, 17, 28, 38, 20, 14].map(
                      (height, index) => (
                        <span
                          key={index}
                          style={{ height: `${height}px` }}
                          className="w-1 rounded-full bg-blue-400"
                        />
                      )
                    )}

                  </div>


                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                    Listening · 00:42
                  </div>

                </div>

              </div>

            </div>


            {/* ================================================
                AI FEEDBACK
            ================================================= */}
            <div className="group relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-7 lg:col-span-5">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <BarChart3 size={21} />
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                  +18%
                </span>

              </div>

              <h3 className="mt-7 text-xl font-bold text-slate-900">
                Instant AI Feedback
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Understand exactly where you're doing well and what needs improvement.
              </p>


              {/* Score */}
              <div className="mt-7 flex items-end justify-between">

                <div>
                  <p className="text-xs text-slate-400">
                    Interview Score
                  </p>

                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-4xl font-bold text-slate-900">
                      8.6
                    </span>

                    <span className="mb-1 text-sm text-slate-400">
                      /10
                    </span>
                  </div>
                </div>


                <div className="flex h-20 items-end gap-1.5">

                  {[30, 42, 36, 50, 58, 52, 70, 82].map(
                    (height, index) => (
                      <div
                        key={index}
                        style={{ height: `${height}%` }}
                        className="w-2 rounded-full bg-blue-500/70"
                      />
                    )
                  )}

                </div>

              </div>

            </div>


            {/* ================================================
                CODING ASSESSMENT
            ================================================= */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Code2 size={21} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Coding Assessments
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Solve real technical challenges and improve your problem-solving skills.
              </p>


              {/* Code preview */}
              <div className="mt-6 overflow-hidden rounded-xl bg-slate-950 p-4 font-mono text-[11px] leading-5">

                <p className="text-purple-400">
                  def <span className="text-blue-300">solve</span>(nums):
                </p>

                <p className="pl-4 text-slate-400">
                  result = []
                </p>

                <p className="pl-4 text-purple-400">
                  for <span className="text-slate-300">num</span>{" "}
                  <span className="text-purple-400">in</span>{" "}
                  <span className="text-slate-300">nums:</span>
                </p>

                <p className="pl-8 text-slate-300">
                  result.append(num * 2)
                </p>

                <p className="pl-4 text-purple-400">
                  return <span className="text-slate-300">result</span>
                </p>

              </div>

            </div>


            {/* ================================================
                LEARNING ROADMAP
            ================================================= */}
            <div className="group rounded-[28px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Map size={21} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Learning Roadmap
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Follow a personalized path based on your strengths and weaknesses.
              </p>


              <div className="mt-7 space-y-4">

                <RoadmapItem
                  title="Python Fundamentals"
                  progress="100%"
                  completed
                />

                <RoadmapItem
                  title="Django & APIs"
                  progress="78%"
                />

                <RoadmapItem
                  title="System Design"
                  progress="42%"
                />

              </div>

            </div>


            {/* ================================================
                PERFORMANCE ANALYTICS
            ================================================= */}
            <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-indigo-600 to-blue-600 p-7 text-white lg:col-span-8">

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <TrendingUp size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    Performance Analytics
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-blue-100">
                    See your progress over time and discover which skills
                    need more attention.
                  </p>

                </div>


                <div className="hidden text-right sm:block">
                  <p className="text-xs text-blue-200">
                    Overall progress
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    +24.8%
                  </p>
                </div>

              </div>


              {/* Graph */}
              <div className="mt-8 flex h-24 items-end gap-2">

                {[28, 38, 34, 48, 44, 57, 63, 59, 72, 78, 88, 96].map(
                  (height, index) => (
                    <div
                      key={index}
                      style={{ height: `${height}%` }}
                      className="flex-1 rounded-t-md bg-white/25 transition duration-300 hover:bg-white/50"
                    />
                  )
                )}

              </div>

            </div>


              {/* ================================================
              INTERVIEW HISTORY — FULL WIDTH
            ================================================= */}
          <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-12">

            {/* subtle background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative">

              {/* Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <FileText size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Interview History
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Revisit previous interviews, scores and AI feedback anytime.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="group/history flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  View All History

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/history:translate-x-1"
                  />
                </button>

              </div>


              {/* Horizontal interview cards */}
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <HistoryCard
                  date="Sep 02, 2026"
                  title="Python Developer"
                  score="8.6"
                  tags={["Technical", "Problem Solving"]}
                  feedback="Strong problem-solving approach. Improve explanation of edge cases."
                />

                <HistoryCard
                  date="Aug 28, 2026"
                  title="Backend Developer"
                  score="8.2"
                  tags={["Django", "REST API"]}
                  feedback="Good backend knowledge. Focus more on deployment concepts."
                />

                <HistoryCard
                  date="Aug 15, 2026"
                  title="Full Stack Developer"
                  score="7.8"
                  tags={["React", "System Design"]}
                  feedback="Strong frontend skills. Improve system design explanations."
                />

                <HistoryCard
                  date="Aug 10, 2026"
                  title="Data Structures"
                  score="8.0"
                  tags={["DSA", "Problem Solving"]}
                  feedback="Good coding approach. Continue improving time complexity."
                />

              </div>

            </div>
          </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS — INTERVIEW JOURNEY
      ===================================================== */}
      <section
        id="how-it-works"
        className="relative scroll-mt-20 overflow-hidden bg-slate-50/70 px-5 py-28 sm:px-8 lg:px-10"
      >
        {/* Background */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm">
              <Sparkles size={14} />
              HOW IT WORKS
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[54px]">
              From practice to progress
              <span className="block text-slate-400">
                in three simple steps.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Choose your interview, practice with AI, and turn every
              session into actionable improvement.
            </p>

          </div>


          {/* =====================================================
              JOURNEY
          ===================================================== */}
          <div className="relative mt-20">

            {/* Desktop connecting line */}
            <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent lg:block" />

            <div className="grid gap-6 lg:grid-cols-3">

              {/* =================================================
                  STEP 01
              ================================================= */}
              <div className="group relative">

                {/* Number */}
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-slate-50 bg-blue-600 text-lg font-bold text-white shadow-xl shadow-blue-200">
                  01
                </div>

                {/* Card */}
                <div className="mt-7 h-[430px] rounded-[28px] border border-slate-200 bg-white p-7 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-slate-200/70">

                  <p className="text-xs font-semibold tracking-[0.15em] text-blue-600">
                    PERSONALIZE
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    Choose your interview
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Select your target role and interview type so the
                    experience is tailored to your goals.
                  </p>


                  {/* Mini UI */}
                  <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <p className="text-[11px] font-medium text-slate-400">
                      Target role
                    </p>

                    <div className="mt-2 flex items-center justify-between rounded-xl border border-blue-100 bg-white px-4 py-3">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Code2 size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            Python Developer
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Technical Interview
                          </p>
                        </div>

                      </div>

                      <CheckCircle2
                        size={18}
                        className="text-blue-600"
                      />

                    </div>


                    <p className="mt-5 text-[11px] font-medium text-slate-400">
                      Difficulty
                    </p>

                    <div className="mt-2 grid grid-cols-3 gap-2">

                      <button className="rounded-lg border border-slate-200 bg-white py-2 text-[10px] font-medium text-slate-500">
                        Beginner
                      </button>

                      <button className="rounded-lg bg-blue-600 py-2 text-[10px] font-semibold text-white">
                        Intermediate
                      </button>

                      <button className="rounded-lg border border-slate-200 bg-white py-2 text-[10px] font-medium text-slate-500">
                        Advanced
                      </button>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  STEP 02
              ================================================= */}
              <div className="group relative">

                {/* Number */}
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-slate-50 bg-indigo-600 text-lg font-bold text-white shadow-xl shadow-indigo-200">
                  02
                </div>

                {/* Card */}
                <div className="mt-7 h-[430px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 p-7 text-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">

                  <p className="text-xs font-semibold tracking-[0.15em] text-blue-400">
                    PRACTICE
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Interview with AI
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Answer realistic questions in an interactive AI-powered
                    mock interview.
                  </p>


                  {/* Interview UI */}
                  <div className="relative mt-7 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />

                    <div className="relative">

                      <div className="flex items-center gap-3">

                        <div className="relative">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
                            <Bot size={18} />
                          </div>

                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-green-400" />

                        </div>

                        <div>
                          <p className="text-xs font-semibold">
                            InterviewIQ AI
                          </p>

                          <p className="text-[10px] text-green-400">
                            ● Live interview
                          </p>
                        </div>

                      </div>


                      <p className="mt-5 text-xs leading-6 text-slate-300">
                        “Tell me about a challenging project you worked on
                        and how you solved the problem.”
                      </p>


                      {/* Wave */}
                      <div className="mt-6 flex h-12 items-center justify-center gap-1">

                        {[12, 22, 34, 18, 28, 40, 25, 36, 20, 30, 16, 25].map(
                          (height, index) => (
                            <span
                              key={index}
                              style={{ height: `${height}px` }}
                              className="w-1 rounded-full bg-blue-400"
                            />
                          )
                        )}

                      </div>

                      <p className="mt-2 text-center text-[10px] text-slate-500">
                        Listening · 00:42
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  STEP 03
              ================================================= */}
              <div className="group relative">

                {/* Number */}
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-slate-50 bg-violet-600 text-lg font-bold text-white shadow-xl shadow-violet-200">
                  03
                </div>

                {/* Card */}
                <div className="mt-7 h-[430px] rounded-[28px] border border-slate-200 bg-white p-7 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-slate-200/70">

                  <p className="text-xs font-semibold tracking-[0.15em] text-violet-600">
                    IMPROVE
                  </p>

                  <h3 className="mt-3 text-2xl font-bold text-slate-900">
                    Turn feedback into progress
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Understand your performance and focus your next practice
                    session on the skills that matter most.
                  </p>


                  {/* Score UI */}
                  <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          Overall score
                        </p>

                        <div className="mt-1 flex items-end gap-1">

                          <span className="text-4xl font-bold text-slate-900">
                            8.6
                          </span>

                          <span className="mb-1 text-xs text-slate-400">
                            /10
                          </span>

                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                        <TrendingUp size={13} />
                        +18%
                      </div>

                    </div>


                    {/* Scores */}
                    <div className="mt-6 space-y-4">

                      <ProgressScore
                        label="Communication"
                        value={88}
                      />

                      <ProgressScore
                        label="Technical"
                        value={82}
                      />

                      <ProgressScore
                        label="Problem Solving"
                        value={91}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Bottom message */}
          <div className="mt-14 flex justify-center">

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="group flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-600"
            >
              Start your first interview

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
        TESTIMONIALS — MOVING CARDS
      ===================================================== */}
      <section
        id="testimonials"
        className="relative scroll-mt-20 overflow-hidden bg-white py-28"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-100/40 blur-[130px]" />

        <div className="relative">

          {/* Heading */}
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">

            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-600">
              <MessageSquare size={14} />
              TESTIMONIALS
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[54px]">
              Practice that builds
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                real confidence.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              See how consistent AI-powered practice helps candidates
              understand their strengths and improve their interview skills.
            </p>

          </div>


          {/* =====================================================
              MOVING TESTIMONIALS
          ===================================================== */}
          <div className="relative mt-16">

            {/* Left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />

            {/* Right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />


            {/* Slider */}
            <div className="testimonial-track flex w-max gap-5 px-5">

              {[...testimonialCards, ...testimonialCards].map(
                (testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    {...testimonial}
                  />
                )
              )}

            </div>

          </div>


          {/* Bottom trust */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 text-xs font-medium text-slate-400">

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={15}
                className="text-green-500"
              />
              Realistic practice
            </div>

            <div className="flex items-center gap-2">
              <Sparkles
                size={15}
                className="text-violet-500"
              />
              Personalized AI feedback
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp
                size={15}
                className="text-blue-500"
              />
              Track your improvement
            </div>

          </div>

        </div>
      </section>

      
      {/* =====================================================
      ABOUT — AI COACH SHOWCASE
      ===================================================== */}
      <section
        id="about"
        className="relative scroll-mt-20 overflow-hidden bg-slate-50/70 px-5 py-28 sm:px-8 lg:px-10"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-100/50 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}
          <div>

            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              ABOUT INTERVIEWIQ
            </span>

            <h2 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[54px]">

              More than a mock
              <span className="block">
                interview.
              </span>

              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your AI interview coach.
              </span>

            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
              InterviewIQ doesn't just ask questions. It analyzes how you
              answer, identifies areas for improvement, and helps you prepare
              more effectively for your next interview.
            </p>


            {/* Benefits */}
            <div className="mt-9 space-y-5">

              <AboutBenefit
                icon={<Bot size={18} />}
                title="Realistic AI conversations"
                description="Practice role-specific interviews in a natural, interactive environment."
              />

              <AboutBenefit
                icon={<Target size={18} />}
                title="Know exactly what to improve"
                description="Understand your technical knowledge, communication and problem-solving performance."
              />

              <AboutBenefit
                icon={<TrendingUp size={18} />}
                title="Improve with every session"
                description="Track your progress and focus future practice on the skills that need attention."
              />

            </div>


            {/* CTA */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              Start practicing with AI

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </div>


          {/* =================================================
              RIGHT — AI PERFORMANCE REPORT
          ================================================= */}
          <div className="relative">

            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/40 blur-[100px]" />


            {/* Floating improvement */}
            <div className="absolute -right-2 top-10 z-20 hidden rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:block lg:-right-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <p className="text-[10px] text-slate-400">
                    Improvement
                  </p>

                  <p className="text-sm font-bold text-green-600">
                    +18%
                  </p>
                </div>

              </div>

            </div>


            {/* Floating AI badge */}
            <div className="absolute -left-3 bottom-14 z-20 hidden rounded-2xl border border-white bg-white px-4 py-3 shadow-xl sm:block lg:-left-7">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Sparkles size={17} />
                </div>

                <div>
                  <p className="text-[10px] text-slate-400">
                    AI Analysis
                  </p>

                  <p className="text-xs font-bold text-slate-800">
                    Completed
                  </p>
                </div>

              </div>

            </div>


            {/* Main Report */}
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">

              {/* Top */}
              <div className="rounded-[25px] bg-slate-950 p-6 text-white sm:p-8">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Sparkles
                        size={13}
                        className="text-blue-400"
                      />

                      AI PERFORMANCE REPORT
                    </div>

                    <h3 className="mt-2 text-xl font-bold">
                      Python Developer Interview
                    </h3>

                  </div>

                  <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-slate-300 sm:block">
                    Completed
                  </div>

                </div>


                {/* Score */}
                <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-center">

                  {/* Circular Score */}
                  <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#3b82f6_0_86%,#1e293b_86%_100%)]">

                    <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-slate-950">

                      <span className="text-3xl font-bold">
                        8.6
                      </span>

                      <span className="text-[10px] text-slate-500">
                        OUT OF 10
                      </span>

                    </div>

                  </div>


                  <div className="flex-1">

                    <p className="text-sm font-semibold">
                      Great performance
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Your technical understanding is strong. Focus on
                      structuring your explanations more clearly.
                    </p>


                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-[10px] font-semibold text-green-400">

                      <TrendingUp size={12} />

                      18% better than previous interview

                    </div>

                  </div>

                </div>

              </div>


              {/* Skills */}
              <div className="p-5 sm:p-7">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Performance breakdown
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      AI analysis across key interview skills
                    </p>
                  </div>

                  <BarChart3
                    size={19}
                    className="text-blue-500"
                  />

                </div>


                <div className="mt-6 space-y-5">

                  <AboutPerformance
                    label="Communication"
                    value={88}
                    text="Excellent"
                  />

                  <AboutPerformance
                    label="Technical Knowledge"
                    value={84}
                    text="Strong"
                  />

                  <AboutPerformance
                    label="Problem Solving"
                    value={91}
                    text="Excellent"
                  />

                  <AboutPerformance
                    label="Answer Structure"
                    value={74}
                    text="Improve"
                  />

                </div>


                {/* AI Recommendation */}
                <div className="mt-7 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                      <Sparkles size={16} />
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <p className="text-xs font-bold text-slate-800">
                          AI Recommendation
                        </p>

                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-semibold text-violet-600">
                          PERSONALIZED
                        </span>

                      </div>

                      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                        Practice explaining technical decisions using the
                        Situation → Approach → Result structure.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
      



      {/* =====================================================
          FINAL CTA — DARK AI EXPERIENCE
      ===================================================== */}
      <section
        id="pricing"
        className="relative overflow-hidden bg-white px-5 py-28 sm:px-8 lg:px-10"
      >
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-slate-950">

          {/* =================================================
              BACKGROUND EFFECTS
          ================================================= */}

          {/* Blue glow */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[110px]" />

          {/* Violet glow */}
          <div className="pointer-events-none absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[120px]" />

          {/* Center glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />


          {/* Grid background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
              `,
              backgroundSize: "45px 45px",
            }}
          />


          {/* Top gradient line */}
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />


          {/* =================================================
              FLOATING DECORATIONS
          ================================================= */}

          {/* Left floating card */}
          <div className="absolute left-10 top-16 hidden rotate-[-7deg] rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl xl:block">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Bot size={19} />
              </div>

              <div>
                <p className="text-[10px] text-slate-500">
                  AI Interview
                </p>

                <p className="mt-0.5 text-xs font-semibold text-white">
                  Ready when you are
                </p>
              </div>

            </div>

          </div>


          {/* Right floating card */}
          <div className="absolute right-10 top-20 hidden rotate-[7deg] rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl xl:block">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <TrendingUp size={18} />
              </div>

              <div>
                <p className="text-[10px] text-slate-500">
                  Performance
                </p>

                <p className="mt-0.5 text-xs font-semibold text-green-400">
                  +18% improvement
                </p>
              </div>

            </div>

          </div>


          {/* =================================================
              MAIN CONTENT
          ================================================= */}
          <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 sm:py-28 lg:py-32">

            {/* AI Icon */}
            <div className="relative mx-auto mb-8 flex h-16 w-16 items-center justify-center">

              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-blue-500 opacity-30 blur-xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl">
                <FaRobot className="text-2xl" />
              </div>

            </div>


            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur">

              <Sparkles
                size={14}
                className="text-blue-400"
              />

              YOUR NEXT INTERVIEW STARTS HERE

            </div>


            {/* Heading */}
            <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[60px]">

              Don't just prepare for
              <span className="block">
                your next interview.
              </span>

              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Be ready for it.
              </span>

            </h2>


            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Practice realistic interviews, understand your weaknesses,
              and turn every session into measurable improvement with your
              personal AI interview coach.
            </p>


            {/* =================================================
                BUTTONS
            ================================================= */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

              {/* Primary */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-white/10 sm:w-auto"
              >
                Start Practicing Free

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>


              {/* Secondary */}
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Play size={16} />

                See How It Works
              </button>

            </div>


            {/* =================================================
                TRUST POINTS
            ================================================= */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-slate-500">

              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  size={13}
                  className="text-green-400"
                />
                Start for free
              </div>

              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  size={13}
                  className="text-green-400"
                />
                Practice anytime
              </div>

              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  size={13}
                  className="text-green-400"
                />
                AI-powered feedback
              </div>

            </div>


            {/* =================================================
                MINI INTERVIEW PREVIEW
            ================================================= */}
            <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Bot size={18} />
                    </div>

                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-green-400" />

                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      InterviewIQ AI
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Your personal interview coach
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-semibold text-green-400">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                  READY

                </div>

              </div>


              <div className="mt-4 border-t border-white/[0.06] pt-4">

                <p className="text-xs leading-6 text-slate-400">
                  “Hi! I'm ready to help you prepare. What role are
                  you interviewing for?”
                </p>

              </div>

            </div>

          </div>


          {/* Bottom decorative glow */}
          <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

    </div>
  );
}



/* =========================================================
   DASHBOARD STAT
========================================================= */

function HeroTrust({ text }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 size={12} />
      </div>

      {text}

    </div>
  );
}


function HeroMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-3">

      <p className="text-[9px] text-slate-500">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">

        <span className="text-xs font-bold text-white">
          {value}
        </span>

        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">

          <div
            style={{
              width: value,
            }}
            className="h-full rounded-full bg-blue-500"
          />

        </div>

      </div>

    </div>
  );
}


function CompanyLogo({ children, name }) {
  return (
    <div
      title={name}
      className="group flex min-w-[170px] items-center justify-center px-7"
    >
      <div className="text-[15px] text-slate-400 grayscale transition-all duration-300 group-hover:scale-105 group-hover:text-slate-800">
        {children}
      </div>
    </div>
  );
}


/* =========================================================
   SKILL
========================================================= */

function Skill({ label, value }) {
  return (
    <div className="flex min-w-[120px] justify-between gap-3">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-700">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

        {icon}

      </div>

      <h3 className="mt-6 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">

        Learn more
        <ArrowRight size={15} />

      </div>

    </div>
  );
}


/* =========================================================
   STEP CARD
========================================================= */

function StepCard({
  number,
  title,
  description,
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg shadow-blue-200">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   ABOUT STAT
========================================================= */

function AboutStat({
  value,
  label,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center">

      <p className="text-3xl font-bold text-blue-600">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}

function RoadmapItem({ title, progress, completed = false }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {completed && (
            <CheckCircle2
              size={14}
              className="text-green-500"
            />
          )}

          <span className="font-medium text-slate-600">
            {title}
          </span>
        </div>

        <span className="font-semibold text-slate-400">
          {progress}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          style={{ width: progress }}
          className={`h-full rounded-full ${
            completed ? "bg-green-500" : "bg-blue-600"
          }`}
        />
      </div>
    </div>
  );
}


function HistoryCard({
  date,
  title,
  score,
  tags,
  feedback,
}) {
  return (
    <div className="group/card flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40">

      {/* Date + Score */}
      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-medium text-slate-400">
            {date}
          </p>

          <h4 className="mt-2 font-bold text-slate-900">
            {title}
          </h4>

          <p className="mt-1 text-xs text-slate-400">
            Mock Interview
          </p>
        </div>

        {/* Score */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
            Number(score) >= 8
              ? "bg-green-50 text-green-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {score}
        </div>

      </div>


      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">

        {tags.map((tag, index) => (
          <span
            key={index}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              index % 2 === 0
                ? "bg-blue-50 text-blue-600"
                : "bg-violet-50 text-violet-600"
            }`}
          >
            {tag}
          </span>
        ))}

      </div>


      {/* AI Feedback */}
      <div className="mt-5 flex flex-1 gap-2.5">

        <MessageSquare
          size={15}
          className="mt-0.5 shrink-0 text-blue-500"
        />

        <p className="text-xs leading-5 text-slate-500">
          {feedback}
        </p>

      </div>


      {/* Bottom */}
      <div className="mt-5 border-t border-slate-100 pt-4">

        <button
          type="button"
          className="flex w-full items-center justify-between text-xs font-semibold text-blue-600"
        >
          View Details

          <ArrowRight
            size={15}
            className="transition-transform group-hover/card:translate-x-1"
          />
        </button>

      </div>

    </div>
  );
}

function ProgressScore({ label, value }) {
  return (
    <div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          {label}
        </span>

        <span className="text-[11px] font-bold text-slate-700">
          {value}%
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">

        <div
          style={{ width: `${value}%` }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />

      </div>

    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  initial,
  score,
  improvement,
}) {
  return (
    <article className="group flex w-[310px] shrink-0 flex-col rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 sm:w-[360px]">

      {/* Top */}
      <div className="flex items-center justify-between">

        {/* Stars */}
        <div className="flex gap-0.5 text-sm text-amber-400">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        {/* Quote icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <MessageSquare size={16} />
        </div>

      </div>


      {/* Quote */}
      <p className="mt-6 flex-1 text-[15px] leading-7 text-slate-600">
        “{quote}”
      </p>


      {/* Improvement */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Interview score
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {score}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
          <TrendingUp size={12} />
          {improvement}
        </div>

      </div>


      {/* User */}
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-100">
          {initial}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {name}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {role}
          </p>
        </div>

      </div>

    </article>
  );
}

function AboutBenefit({
  icon,
  title,
  description,
}) {
  return (
    <div className="group flex gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}


function AboutPerformance({
  label,
  value,
  text,
}) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs font-medium text-slate-600">
          {label}
        </span>

        <div className="flex items-center gap-3">

          <span className="hidden text-[10px] text-slate-400 sm:block">
            {text}
          </span>

          <span className="text-xs font-bold text-slate-800">
            {value}%
          </span>

        </div>

      </div>


      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          style={{ width: `${value}%` }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />

      </div>

    </div>
  );
}

export default Home;

