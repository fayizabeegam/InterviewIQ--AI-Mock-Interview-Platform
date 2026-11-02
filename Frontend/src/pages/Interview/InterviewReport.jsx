import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Lightbulb,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  Target,
  Trophy,
  TriangleAlert,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";


const InterviewReport = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { config, answers, interviewId  } = location.state || {};

  const [openQuestion, setOpenQuestion] = useState(null);

  const role = config?.role || "Python Developer";


  // =====================================================
  // score
  // =====================================================

  const evaluatedAnswers = Object.values(answers || {}).filter(
  (item) => item?.evaluation
  );

  const overallScore =
    evaluatedAnswers.length > 0
      ? Math.round(
          evaluatedAnswers.reduce(
            (total, item) => total + Number(item.evaluation.score || 0),
            0
          ) / evaluatedAnswers.length
        )
      : 0;

  
  const getAverageMetric = (field) => {
    if (evaluatedAnswers.length === 0) return 0;

    const total = evaluatedAnswers.reduce(
      (sum, item) =>
        sum + Number(item.evaluation[field] || 0),
      0
    );

    return Math.round(total / evaluatedAnswers.length);
  };

  const technicalScore = getAverageMetric("technical_accuracy");
  const communicationScore = getAverageMetric("communication");
  const relevanceScore = getAverageMetric("relevance");
  const completenessScore = getAverageMetric("completeness");


  const report = {

    overallScore,

    summary:
      evaluatedAnswers.length === 0
      ? "No evaluation data is available for this interview yet."
      : overallScore >= 80
        ? "Excellent performance! You demonstrated strong knowledge and effective communication."
        : overallScore >= 60
          ? "Good effort! Review the feedback below to identify areas for improvement."
          : "Keep practising! Review the feedback below and strengthen your understanding of the key concepts.",

    metrics: [
      
      {
        label: "Technical Knowledge",
        score: technicalScore,
        icon: CalendarDays,
        iconClass: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Communication",
        score: communicationScore,
        icon: MessageCircle,
        iconClass: "bg-blue-50 text-blue-600",
      },
      {
        label: "Problem Solving",
        score: completenessScore,
        icon: BrainCircuit,
        iconClass: "bg-violet-50 text-violet-600",
      },
      {
        label: "Relevance",
        score: relevanceScore,
        icon: Target,
        iconClass: "bg-amber-50 text-amber-600",
      },

    ],

    strengths: [
      ...new Set(
        evaluatedAnswers.flatMap((item) =>
          item.evaluation.strengths || []
        )
      ),
    ],

    improvements: [
      ...new Set(
        evaluatedAnswers.flatMap((item) =>
          item.evaluation.improvements || []
        )
      ),
    ],

    
    questions: Object.entries(answers || {})
      .filter(([, item]) => item?.evaluation)
      .map(([number, item]) => ({
        number: Number(number),
        question:
          config?.questions?.[Number(number) - 1]?.question ||
          `Question ${number}`,
        score: Math.round(
          Number(item.evaluation.score || 0) / 10
        ),
        feedback:
          item.evaluation.feedback ||
          "No specific feedback was provided for this answer.",
      })),

      };


  // =====================================================
  // QUESTION SCORE STYLE
  // =====================================================

  const getQuestionScoreStyle = (score) => {

    if (score >= 8) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (score >= 7) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-rose-100 text-rose-600";

  };



  return (
    <UserLayout>

      <Container>

        <div className="py-7">


          {/* =====================================================
              REPORT HEADER
          ===================================================== */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">


            {/* Title */}

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-amber-50
                "
              >

                <Trophy
                  size={25}
                  className="text-amber-500"
                />

              </div>


              <div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Interview Report
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Here's your detailed performance analysis and feedback.
                </p>

              </div>

            </div>


            {/* Header Buttons */}

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => navigate("/ai-interview")}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-slate-600
                  shadow-sm
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                "
              >

                <RefreshCcw size={14} />

                Retake Interview

              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/roadmap", {
                    state: { interviewId },
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Generate Roadmap
              </button>


              

            </div>

          </div>



          {/* =====================================================
              TOP REPORT AREA
          ===================================================== */}

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">


            {/* =====================================================
                OVERALL SCORE
            ===================================================== */}

            <div
              className="
                flex
                min-h-[190px]
                items-center
                gap-7
                rounded-[20px]
                border
                border-slate-200
                bg-white
                px-7
                py-6
                shadow-sm
              "
            >

              <ScoreCircle
                score={report.overallScore}
              />


              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Overall Score
                </h2>

                <p className="mt-2 max-w-[250px] text-xs leading-5 text-slate-500">
                  {report.summary}
                </p>

              </div>

            </div>



            {/* =====================================================
                PERFORMANCE METRICS
            ===================================================== */}

            <div
              className="
                grid
                grid-cols-2
                overflow-hidden
                rounded-[20px]
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >

              {report.metrics.map((metric, index) => {

                const Icon = metric.icon;

                return (

                  <div
                    key={metric.label}
                    className={`
                      flex
                      min-h-[94px]
                      items-center
                      gap-3
                      px-5
                      py-4

                      ${
                        index === 0 || index === 2
                          ? "border-r border-slate-100"
                          : ""
                      }

                      ${
                        index < 2
                          ? "border-b border-slate-100"
                          : ""
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${metric.iconClass}
                      `}
                    >

                      <Icon size={19} />

                    </div>


                    <div>

                      <p className="text-base font-bold text-slate-900">
                        {metric.score}%
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        {metric.label}
                      </p>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>



          {/* =====================================================
              BOTTOM REPORT AREA
          ===================================================== */}

          <div className="mt-4 grid items-start gap-4 lg:grid-cols-[0.9fr_1.1fr]">


            {/* =====================================================
                LEFT COLUMN
            ===================================================== */}

            <div className="space-y-4">


              {/* Strengths */}

              <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">

                    <Sparkles
                      size={17}
                      className="text-emerald-600"
                    />

                  </div>

                  <h2 className="text-sm font-bold text-slate-900">
                    Strengths
                  </h2>

                </div>


                <div className="mt-4 space-y-2.5">

                  {report.strengths.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2.5"
                    >

                      <Check
                        size={14}
                        strokeWidth={3}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />

                      <p className="text-xs leading-5 text-slate-600">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              </div>



              {/* Areas For Improvement */}

              <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50">

                    <TriangleAlert
                      size={17}
                      className="text-rose-500"
                    />

                  </div>


                  <h2 className="text-sm font-bold text-slate-900">
                    Areas for Improvement
                  </h2>

                </div>


                <div className="mt-4 space-y-2.5">

                  {report.improvements.map((item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2.5"
                    >

                      <ArrowLeft
                        size={14}
                        strokeWidth={3}
                        className="mt-0.5 shrink-0 rotate-180 text-rose-500"
                      />

                      <p className="text-xs leading-5 text-slate-600">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>



            {/* =====================================================
                QUESTION BY QUESTION
            ===================================================== */}

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">


              {/* Header */}

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">

                  <Lightbulb
                    size={17}
                    className="text-blue-600"
                  />

                </div>


                <h2 className="text-sm font-bold text-slate-900">
                  Question by Question Feedback
                </h2>

              </div>



              {/* Questions */}

              <div className="mt-4 divide-y divide-slate-100">

                {report.questions.map((item) => {

                  const isOpen =
                    openQuestion === item.number;


                  return (

                    <div key={item.number}>


                      {/* Question Row */}

                      <button
                        type="button"
                        onClick={() =>
                          setOpenQuestion(
                            isOpen
                              ? null
                              : item.number
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          py-3
                          text-left
                        "
                      >


                        {/* Number */}

                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-[11px]
                            font-bold
                            text-slate-600
                          "
                        >

                          {item.number}

                        </span>



                        {/* Question */}

                        <span
                          className="
                            min-w-0
                            flex-1
                            truncate
                            text-xs
                            font-medium
                            text-slate-700
                          "
                        >

                          {item.question}

                        </span>



                        {/* Score */}

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            ${getQuestionScoreStyle(item.score)}
                          `}
                        >

                          {item.score}/10

                        </span>



                        {/* Arrow */}

                        {isOpen ? (

                          <ChevronUp
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                        ) : (

                          <ChevronDown
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                        )}

                      </button>



                      {/* Expanded Feedback */}

                      {isOpen && (

                        <div className="pb-4 pl-10 pr-3">

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                              rounded-xl
                              bg-blue-50/60
                              px-3
                              py-3
                            "
                          >

                            <BrainCircuit
                              size={15}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />


                            <div>

                              <p className="text-[11px] font-semibold text-blue-700">
                                AI Feedback
                              </p>

                              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                {item.feedback}
                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>

            </div>

          </div>



          {/* =====================================================
              ROLE INFO
          ===================================================== */}

          <div className="mt-5 text-center">

            <p className="text-xs text-slate-400">
              Interview for{" "}

              <span className="font-semibold text-slate-500">
                {role}
              </span>
            </p>

          </div>

        </div>

      </Container>
      


    </UserLayout>
  );

};


// =====================================================
// SCORE CIRCLE
// =====================================================

const ScoreCircle = ({ score }) => {

  const radius = 47;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (score / 100) * circumference;


  return (

    <div className="relative h-[125px] w-[125px] shrink-0">

      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
      >

        {/* Background */}

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#edf2f7"
          strokeWidth="10"
        />


        {/* Score */}

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#reportScoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />


        <defs>

          <linearGradient
            id="reportScoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >

            <stop
              offset="0%"
              stopColor="#2563eb"
            />

            <stop
              offset="55%"
              stopColor="#06b6d4"
            />

            <stop
              offset="100%"
              stopColor="#10b981"
            />

          </linearGradient>

        </defs>

      </svg>


      {/* Score Number */}

      <div className="absolute inset-0 flex items-center justify-center">

        <span className="text-[27px] font-bold text-slate-900">
          {score}%
        </span>

      </div>

    </div>

  );

};


export default InterviewReport;