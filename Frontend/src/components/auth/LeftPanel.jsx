import { FaRobot } from "react-icons/fa";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function LeftPanel({ variant }) {
  const navigate = useNavigate();
  const isRegister = variant === "register";

  return (
    <aside className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 p-8 text-white lg:p-10 xl:p-12">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[130px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />


      {/* =====================================================
          LOGO
      ===================================================== */}
      <div className="relative z-10 flex items-center justify-between">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >
          <div className="relative">

            <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-30 blur-lg" />

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <FaRobot className="text-xl text-white" />
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="text-[18px] font-bold tracking-tight text-white">
              InterviewIQ
            </span>

            <span className="rounded-md border border-blue-400/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">
              AI
            </span>

          </div>
        </button>


        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Home
        </button>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative z-10 my-auto py-12">

        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">

          <Sparkles
            size={12}
            className="text-blue-400"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {isRegister
              ? "Start your interview journey"
              : "Your AI interview coach"}
          </span>

        </div>


        <h1 className="mt-6 max-w-lg text-4xl font-bold leading-[1.1] tracking-[-0.03em] xl:text-[46px]">

          {isRegister ? (
            <>
              <span className="text-white">Build confidence before</span>
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                the real interview.
              </span>
            </>
          ) : (
            <>
              <span className="text-white">Practice smarter.</span>
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Interview better.
              </span>
            </>
          )}

        </h1>


        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
          {isRegister
            ? "Create your account and start practicing realistic interviews with personalized AI feedback."
            : "Practice role-specific interviews, understand your performance, and improve with every session."}
        </p>


        {/* =====================================================
            PRODUCT PREVIEW
        ===================================================== */}
        <div className="relative mt-10 max-w-[540px]">

          <div className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.045] p-2 backdrop-blur-xl">

            <div className="rounded-[20px] bg-[#111c30] p-5">

              {/* Top */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                      <FaRobot size={17} />
                    </div>

                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111c30] bg-green-400" />

                  </div>

                  <div>
                    <p className="text-xs font-semibold">
                      AI Mock Interview
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      Python Developer
                    </p>
                  </div>

                </div>


                <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold text-green-400">
                  LIVE
                </span>

              </div>


              {/* Question */}
              <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">

                <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wide text-blue-400">
                  <Sparkles size={11} />
                  AI Interviewer
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-300">
                  “How would you design and secure a REST API using
                  Django REST Framework?”
                </p>

              </div>


              {/* Wave */}
              <div className="mt-4 rounded-xl bg-blue-500/[0.07] p-4">

                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-medium text-slate-400">
                    Your answer
                  </span>

                  <span className="flex items-center gap-1.5 text-[9px] text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Listening
                  </span>

                </div>


                <div className="mt-4 flex h-9 items-center justify-center gap-1">

                  {[
                    10, 18, 27, 15, 32, 22, 35,
                    18, 28, 14, 31, 20, 26, 12,
                  ].map((height, index) => (
                    <span
                      key={index}
                      style={{ height }}
                      className="w-[3px] rounded-full bg-blue-400"
                    />
                  ))}

                </div>

              </div>

            </div>

          </div>


          {/* Floating score */}
          <div className="absolute -bottom-5 -right-4 hidden rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl xl:block">

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                <TrendingUp size={14} />
              </div>

              <div>
                <p className="text-[8px] text-slate-500">
                  Performance
                </p>

                <p className="text-xs font-bold text-white">
                  8.6 / 10
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            BENEFITS
        ===================================================== */}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">

          <AuthBenefit
            icon={<MessageSquare size={12} />}
            text="AI feedback"
          />

          <AuthBenefit
            icon={<BarChart3 size={12} />}
            text="Progress tracking"
          />

          <AuthBenefit
            icon={<CheckCircle2 size={12} />}
            text="Role-specific practice"
          />

        </div>

      </div>


      {/* Bottom */}
      <p className="relative z-10 text-[10px] text-slate-600">
        AI-powered interview preparation platform
      </p>

    </aside>
  );
}


function AuthBenefit({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">

      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.05] text-blue-400">
        {icon}
      </div>

      {text}

    </div>
  );
}

export default LeftPanel;