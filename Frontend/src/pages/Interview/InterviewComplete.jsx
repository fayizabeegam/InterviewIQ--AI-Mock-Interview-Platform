import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

import {
  BrainCircuit,
  Check,
  FileSearch,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";
import {completeInterview} from "../../services/interviewService"

const InterviewComplete = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { config, answers, interviewId  } = location.state || {};

  const [analyzing, setAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(1);

  const [completionLoading, setCompletionLoading] = useState(true);
  const [completionError, setCompletionError] = useState("");


  // =====================================================
  // ANALYSIS STEPS
  // =====================================================

  const analysisSteps = [
    {
      icon: MessageSquareText,
      title: "Reviewing your answers",
      description:
        "Analyzing the quality and structure of your responses.",
    },
    {
      icon: BrainCircuit,
      title: "Evaluating interview performance",
      description:
        "Checking technical knowledge, clarity, and relevance.",
    },
    {
      icon: FileSearch,
      title: "Preparing detailed feedback",
      description:
        "Identifying strengths and areas for improvement.",
    },
    {
      icon: Sparkles,
      title: "Generating your interview report",
      description:
        "Creating personalized recommendations for you.",
    },
  ];


  // =====================================================
  // ANALYSIS ANIMATION
  // =====================================================

  useEffect(() => {

    if (!analyzing) {
      return;
    }


    const interval = setInterval(() => {

      setAnalysisStep((previousStep) => {

        if (previousStep < 4) {
          return previousStep + 1;
        }

        return previousStep;

      });

    }, 1200);


    return () => clearInterval(interval);

  }, [analyzing]);


  // =====================================================
  // FINISH ANALYSIS
  // =====================================================

  useEffect(() => {

    if (analysisStep !== 4 || !analyzing) {
      return;
    }


    /*
      Give the fourth animation enough time
      to move upward and disappear.
    */

    const timer = setTimeout(() => {

      setAnalyzing(false);

    }, 1200);


    return () => clearTimeout(timer);

  }, [analysisStep, analyzing]);


  // =====================================================
  // FIREWORKS
  // =====================================================

  useEffect(() => {

    if (analyzing) {
      return;
    }


    // LEFT BURST

    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 35,
      origin: {
        x: 0.15,
        y: 0.35,
      },
    });


    // RIGHT BURST

    confetti({
      particleCount: 70,
      spread: 70,
      startVelocity: 35,
      origin: {
        x: 0.85,
        y: 0.35,
      },
    });


    // CENTER BURST

    const centerTimer = setTimeout(() => {

      confetti({
        particleCount: 100,
        spread: 100,
        startVelocity: 40,
        origin: {
          x: 0.5,
          y: 0.3,
        },
      });

    }, 250);


    // SMALL FINAL BURST

    const finalTimer = setTimeout(() => {

      confetti({
        particleCount: 50,
        spread: 120,
        startVelocity: 30,
        origin: {
          x: 0.5,
          y: 0.35,
        },
      });

    }, 600);


    return () => {

      clearTimeout(centerTimer);
      clearTimeout(finalTimer);

    };

  }, [analyzing]);


  // =====================================================
  // VIEW REPORT
  // =====================================================

  const handleViewReport = () => {

    navigate("/ai-interview/report", {
      state: {
        config,
        answers,
        interviewId
      },
    });

  };


  // ====================================================
  //  Complete interview
  // ====================================================

  useEffect(() => {
    const markInterviewComplete = async () => {
      if (!interviewId) {
        setCompletionError("Interview ID is missing.");
        setCompletionLoading(false);
        return;
      }

      try {
        await completeInterview(interviewId);
        setCompletionLoading(false);
      } catch (error) {
        console.error(
          "Interview completion error:",
          error.response?.data || error
        );

        setCompletionError(
          error.response?.data?.detail ||
          "Unable to complete the interview. Please try again."
        );

        setCompletionLoading(false);
      }
    };

    markInterviewComplete();
  }, [interviewId]);


  if (completionLoading) {
    return (
      <UserLayout>
        <Container>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm font-medium text-slate-600">
              Saving your interview completion...
            </p>
          </div>
        </Container>
      </UserLayout>
    );
  }

  if (completionError) {
    return (
      <UserLayout>
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <p className="text-red-600">{completionError}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        </Container>
      </UserLayout>
    );
  }

  return (

    <UserLayout>

      <Container>

        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-10">

          <div className="w-full max-w-3xl">


            {/* =====================================================
                ANALYZING
            ===================================================== */}

            {analyzing && (

              <div className="flex flex-col items-center text-center">


                {/* =====================================================
                    AI ICON
                ===================================================== */}

                <div className="relative flex h-24 w-24 items-center justify-center">


                  {/* Outer glow */}

                  <div className="absolute inset-0 rounded-full bg-blue-100/70" />


                  {/* Pulse */}

                  <div className="absolute inset-2 animate-ping rounded-full bg-blue-200/40" />


                  {/* Inner glow */}

                  <div className="absolute inset-3 animate-pulse rounded-full bg-gradient-to-br from-blue-100 to-violet-100" />


                  {/* Icon */}

                  <div
                    className="
                      relative
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-blue-600
                      to-violet-600
                      shadow-lg
                      shadow-blue-200
                    "
                  >

                    <BrainCircuit
                      size={27}
                      className="text-white"
                    />

                  </div>

                </div>



                {/* =====================================================
                    TITLE
                ===================================================== */}

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">

                  Analyzing Your Interview

                </h2>


                <p className="mt-2 text-sm text-slate-500">

                  Please wait while AI prepares your personalized feedback.

                </p>



                {/* =====================================================
                    MOVING ANALYSIS MESSAGE
                ===================================================== */}

                <div
                  className="
                    relative
                    mt-10
                    h-[130px]
                    w-full
                    max-w-xl
                    overflow-hidden
                  "
                >

                  {analysisSteps.map((item, index) => {

                    const Icon = item.icon;

                    const stepNumber = index + 1;


                    if (analysisStep !== stepNumber) {
                      return null;
                    }


                    return (

                      <div
                        key={`${analysisStep}-${item.title}`}
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          flex
                          animate-analysis-up
                          items-center
                          justify-center
                          gap-3
                        "
                      >


                        {/* Step Icon */}

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-blue-600
                          "
                        >

                          <Icon
                            size={19}
                            className="animate-pulse"
                          />

                        </div>



                        {/* Step Text */}

                        <div className="text-left">

                          <p className="text-sm font-semibold text-slate-700">

                            {item.title}

                          </p>


                          <p className="mt-1 text-xs text-slate-400">

                            {item.description}

                          </p>

                        </div>



                        {/* Loading Dots */}

                        <div className="ml-2 flex shrink-0 gap-1">

                          <span
                            className="
                              h-1.5
                              w-1.5
                              animate-bounce
                              rounded-full
                              bg-blue-500
                              [animation-delay:-0.3s]
                            "
                          />

                          <span
                            className="
                              h-1.5
                              w-1.5
                              animate-bounce
                              rounded-full
                              bg-blue-500
                              [animation-delay:-0.15s]
                            "
                          />

                          <span
                            className="
                              h-1.5
                              w-1.5
                              animate-bounce
                              rounded-full
                              bg-blue-500
                            "
                          />

                        </div>

                      </div>

                    );

                  })}

                </div>



                {/* =====================================================
                    BOTTOM TEXT
                ===================================================== */}

                <p className="mt-2 text-xs text-slate-400">

                  Please don't close this page while your interview is being analyzed.

                </p>

              </div>

            )}



            {/* =====================================================
                COMPLETED
            ===================================================== */}

            {!analyzing && (

              <div className="animate-completion-in">


                {/* =====================================================
                    COMPLETION HEADER
                ===================================================== */}

                

                <div className="relative px-6 pb-4 pt-4 text-center">

                {/* =====================================================
                    DECORATIVE CONFETTI
                ===================================================== */}

                <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[150px] max-w-3xl">

                    <span className="absolute left-[5%] top-10 h-2 w-2 rounded-full bg-pink-500" />

                    <span className="absolute left-[12%] top-3 h-2 w-2 rounded-full bg-blue-400" />

                    <span className="absolute left-[20%] top-[70px] h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="absolute left-[28%] top-5 h-2 w-2 rounded-full bg-amber-400" />

                    <span className="absolute left-[35%] top-[78px] h-1.5 w-1.5 rounded-full bg-violet-400" />

                    <span className="absolute left-[43%] top-1 h-2 w-2 rounded-full bg-cyan-400" />


                    <span className="absolute right-[5%] top-12 h-2 w-2 rounded-full bg-pink-500" />

                    <span className="absolute right-[12%] top-5 h-2 w-2 rounded-full bg-cyan-400" />

                    <span className="absolute right-[20%] top-[70px] h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="absolute right-[28%] top-3 h-2 w-2 rounded-full bg-blue-400" />

                    <span className="absolute right-[36%] top-[75px] h-1.5 w-1.5 rounded-full bg-amber-400" />

                    <span className="absolute right-[43%] top-3 h-2 w-2 rounded-full bg-violet-400" />

                </div>


                {/* =====================================================
                    SUCCESS TICK
                ===================================================== */}

                <div className="relative z-10 mx-auto flex h-[86px] w-[86px] items-center justify-center">

                    {/* Glow */}

                    <div className="absolute inset-2 rounded-full bg-cyan-300/30 blur-xl" />


                    {/* Purple decoration */}

                    <div className="absolute left-0 top-2 h-8 w-8 rounded-full bg-violet-500/80" />


                    {/* Green decoration */}

                    <div className="absolute bottom-2 right-0 h-6 w-6 rounded-full bg-emerald-400/80" />


                    {/* Small blue circle */}

                    <div className="absolute right-2 top-0 h-3 w-3 rounded-full bg-blue-400" />


                    {/* Main circle */}

                    <div
                    className="
                        relative
                        flex
                        h-[66px]
                        w-[66px]
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-violet-500
                        via-blue-500
                        to-cyan-400
                        shadow-xl
                        shadow-blue-200/70
                    "
                    >

                    <Check
                        size={34}
                        strokeWidth={3}
                        className="text-white"
                    />

                    </div>

                </div>


                {/* =====================================================
                    TEXT
                ===================================================== */}

                <h2 className="relative z-10 mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">

                    Interview Completed!

                </h2>


                <p className="relative z-10 mt-2 text-sm text-slate-500">

                    Great job! You have successfully completed the interview.

                </p>

                </div>



                {/* =====================================================
                    REPORT READY
                ===================================================== */}

                <div className="mx-auto mt-6 max-w-xl">


                  <div
                    className="
                      rounded-2xl
                      border
                      border-emerald-100
                      bg-emerald-50/70
                      px-5
                      py-4
                      text-center
                    "
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Sparkles
                        size={17}
                        className="text-emerald-600"
                      />


                      <p className="text-sm font-semibold text-emerald-700">

                        Your interview report is ready!

                      </p>

                    </div>


                    <p
                      className="
                        mt-1.5
                        text-xs
                        leading-5
                        text-emerald-600/80
                      "
                    >

                      View your score, strengths, weaknesses and personalized recommendations.

                    </p>

                  </div>



                  {/* =====================================================
                      VIEW REPORT
                  ===================================================== */}

                  <button
                    type="button"
                    onClick={handleViewReport}
                    className="
                      mt-5
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
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-lg
                    "
                  >

                    View Interview Report

                    <span className="text-lg leading-none">
                      →
                    </span>

                  </button>

                </div>


                <p className="mt-5 text-center text-xs text-slate-400">

                  Your personalized interview feedback is ready to review.

                </p>

              </div>

            )}

          </div>

        </div>

      </Container>

    </UserLayout>

  );

};


export default InterviewComplete;