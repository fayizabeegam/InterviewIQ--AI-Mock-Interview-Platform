
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Video,
  Home,
  FileText,
  MessageSquare,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Headphones,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getAdminInterviewDetail } from "../../../services/adminService";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "questions", label: "Questions & Answers", icon: MessageSquare },
  { id: "evaluation", label: "AI Evaluation", icon: BarChart3 },
  { id: "report", label: "Final Report", icon: FileText },
];

function formatLabel(value) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function statusStyle(status) {
  const styles = {
    COMPLETED: "bg-emerald-100 text-emerald-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
}

function DetailCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  );
}

function ScoreCard({ label, value, maxValue = 100 }) {
  const numericValue = Number(value ?? 0);
  const percentage =
    maxValue > 0
      ? Math.min((numericValue / maxValue) * 100, 100)
      : 0;

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value ?? "—"}/{maxValue}
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminInterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminInterviewDetail(id);
      setInterview(response.data.data);
    } catch (err) {
      console.error("Interview detail error:", err);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to load interview details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterview();
  }, [id]);

  if (loading) {
    return (
      <AdminDashboardLayout activePage="Interviews" adminName="Admin">
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
          <RefreshCw className="animate-spin text-blue-600" />
          Loading interview details...
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !interview) {
    return (
      <AdminDashboardLayout activePage="Interviews" adminName="Admin">
        <main className="p-6">
          <button
            onClick={() => navigate("/admin/interviews")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Interviews
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <AlertCircle className="mb-2" />
            {error || "Interview not found."}
            <button
              onClick={loadInterview}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </main>
      </AdminDashboardLayout>
    );
  }

  const candidate = interview.candidate || {};
  const questions = interview.questions || [];
  const report = interview.report;

  const answers = questions.filter(
    (question) =>
        question.answer &&
        (
        question.answer.answer_text?.trim() ||
        question.answer.audio_file
        )
    );

  const evaluatedAnswers = questions.filter(
    (question) => question.answer?.ai_score !== undefined &&
      question.answer?.ai_score !== null
  );

  return (
    <AdminDashboardLayout activePage="Interviews" adminName="Admin">
      <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 xl:p-7">

        {/* Header */}

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Home size={16} /><span>/</span><span>
            <button onClick={() => navigate("/admin/interviews")} className="hover:text-blue-600">
            Interviews
          </button></span><span>/</span>
          <span className="font-bold text-slate-950">Interview Details</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyle(interview.status)}`}
          >
            {formatLabel(interview.status)}
          </span>
        </div>

        {/* Candidate summary */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
              {(candidate.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                {candidate.name || "Unknown Candidate"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {candidate.email || "No email available"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Interview ID</p>
              <p className="mt-1 max-w-[220px] truncate text-xs font-semibold text-slate-700">
                {interview.id}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DetailCard title="Interview Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Interview Type"
                  value={formatLabel(interview.interview_type)}
                />
                <InfoItem
                  label="Difficulty"
                  value={formatLabel(interview.difficulty)}
                />
                <InfoItem
                  label="Total Questions"
                  value={interview.total_questions}
                />
                <InfoItem
                  label="Duration"
                  value={`${interview.duration_minutes} minutes`}
                />
                <InfoItem
                  label="Status"
                  value={formatLabel(interview.status)}
                />
                <InfoItem
                  label="Questions Available"
                  value={questions.length}
                />
              </div>
            </DetailCard>

            <DetailCard title="Candidate Information">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem label="Full Name" value={candidate.name} />
                <InfoItem label="Email" value={candidate.email} />
                <InfoItem label="Candidate ID" value={candidate.id} />
              </div>
            </DetailCard>

            <DetailCard title="Interview Timeline">
              <div className="space-y-5">
                <InfoItem
                  label="Created At"
                  value={formatDate(interview.created_at)}
                />
                <InfoItem
                  label="Started At"
                  value={formatDate(interview.started_at)}
                />
                <InfoItem
                  label="Completed At"
                  value={formatDate(interview.completed_at)}
                />
              </div>
            </DetailCard>

            <DetailCard title="Related Information">
              <div className="space-y-5">
                <InfoItem
                  label="Resume ID"
                  value={interview.resume_id}
                />
                <InfoItem
                  label="Job ID"
                  value={interview.job_id || "No job linked"}
                />
              </div>
            </DetailCard>
          </div>
        )}

        {/* Questions and Answers */}
        {activeTab === "questions" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ScoreCard label="Total Questions" value={questions.length} maxValue={questions.length} />
              <ScoreCard label="Answers Submitted" value={answers.length} maxValue={questions.length} />
              <ScoreCard label="Not Answered" value={questions.length - answers.length}  maxValue={questions.length} />
            </div>

            {questions.length === 0 ? (
              <DetailCard title="Questions">
                <p className="text-sm text-slate-500">
                  No questions have been generated for this interview.
                </p>
              </DetailCard>
            ) : (
              questions.map((question) => (
                <DetailCard
                  key={question.id}
                  title={`Question ${question.question_order}`}
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {formatLabel(question.question_type)}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                      {formatLabel(question.difficulty)}
                    </span>
                  </div>

                  <p className="font-semibold leading-7 text-slate-900">
                    {question.question}
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Expected Answer
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {question.expected_answer || "Not available"}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Candidate Answer
                    </p>

                    {question.answer ? (
                      <div className="space-y-3">
                        <p className="whitespace-pre-wrap rounded-xl border border-slate-100 p-4 text-sm leading-6 text-slate-700">
                          {question.answer.answer_text || "No text answer"}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span>
                            Duration: {question.answer.answer_duration ?? 0} seconds
                          </span>
                          <span>
                            AI Score: {question.answer.ai_score ?? "Not evaluated"}
                          </span>
                        </div>

                        {question.answer.audio_file && (
                          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                            <Headphones size={18} className="text-blue-600" />
                            <audio
                              controls
                              src={question.answer.audio_file}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                        Candidate has not submitted an answer yet.
                      </p>
                    )}
                  </div>
                </DetailCard>
              ))
            )}
          </div>
        )}

        {/* AI Evaluation */}
        {activeTab === "evaluation" && (
          <div className="space-y-5">
            {!answers.length ? (
              <DetailCard title="AI Evaluation">
                <p className="text-sm text-slate-500">
                  AI evaluation will be available after the candidate submits answers.
                </p>
              </DetailCard>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {evaluatedAnswers.map((question) => (
                    <ScoreCard
                      key={question.id}
                      label={`Question ${question.question_order} Score`}
                      value={question.answer.ai_score}
                    />
                  ))}
                </div>

                {answers.map((question) => (
                  <DetailCard
                    key={question.id}
                    title={`Question ${question.question_order} Feedback`}
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-emerald-700">
                          Strengths
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {question.answer.strengths || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-red-700">
                          Weaknesses
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {question.answer.weaknesses || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-blue-700">
                          AI Feedback
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {question.answer.feedback || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-violet-700">
                          Improvement Suggestions
                        </p>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {question.answer.improvement_suggestions || "Not available"}
                        </p>
                      </div>
                    </div>
                  </DetailCard>
                ))}
              </>
            )}
          </div>
        )}

        {/* Final Report */}
        {activeTab === "report" && (
          report ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ScoreCard label="Overall Score" value={report.overall_score} />
                <ScoreCard label="Technical Score" value={report.technical_score} />
                <ScoreCard label="Communication" value={report.communication_score} />
                <ScoreCard label="Confidence" value={report.confidence_score} />
              </div>

              <DetailCard title="Final Result">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600" size={24} />
                  <div>
                    <p className="font-bold text-slate-900">
                      {formatLabel(report.result)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Generated: {formatDate(report.generated_at)}
                    </p>
                  </div>
                </div>
              </DetailCard>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DetailCard title="Strengths">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {report.strengths || "Not available"}
                  </p>
                </DetailCard>

                <DetailCard title="Weaknesses">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {report.weaknesses || "Not available"}
                  </p>
                </DetailCard>
              </div>

              <DetailCard title="Recommendations">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {report.recommendations || "Not available"}
                </p>
              </DetailCard>
            </div>
          ) : (
            <DetailCard title="Final Report">
              <div className="py-8 text-center">
                <FileText size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-700">
                  Report not generated yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  The final AI report will appear here after the interview is completed and evaluated.
                </p>
              </div>
            </DetailCard>
          )
        )}
      </main>
    </AdminDashboardLayout>
  );
}
