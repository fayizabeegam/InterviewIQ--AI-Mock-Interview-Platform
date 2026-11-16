
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  CalendarDays,
  FileText,
  Check,
  Clock,
  AlertTriangle,
  BrainCircuit,
  Eye,
  Download,
  Trash2,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import {
  getAdminResumeStats,
  getAdminResumes,
  deleteAdminResume,
  downloadAdminResume,
} from "../../../services/adminService";

const statusStyles = {
  COMPLETED: "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-orange-100 text-orange-700",
  FAILED: "bg-red-100 text-red-600",
  PENDING: "bg-blue-100 text-blue-700",
};

const statusLabels = {
  COMPLETED: "Completed",
  PROCESSING: "Processing",
  FAILED: "Failed",
  PENDING: "Pending",
};

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ title, value, icon: Icon, iconStyle, description }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}
        >
          <Icon size={27} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-950">
            {value ?? 0}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const Icon =
    status === "COMPLETED"
      ? Check
      : status === "PROCESSING"
      ? Clock
      : AlertTriangle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] || statusStyles.PENDING
      }`}
    >
      <Icon size={14} />
      {statusLabels[status] || status}
    </span>
  );
}

function ScoreDistribution({ distribution = {} }) {
  const excellent = Number(distribution.excellent || 0);
  const good = Number(distribution.good || 0);
  const needsImprovement = Number(distribution.needs_improvement || 0);

  const total = excellent + good + needsImprovement;

  const excellentPercent = total ? (excellent / total) * 100 : 0;
  const goodPercent = total ? (good / total) * 100 : 0;
  const improvementPercent = total ? (needsImprovement / total) * 100 : 0;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
      <div
        className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(
            #10B981 0% ${excellentPercent}%,
            #2563EB ${excellentPercent}% ${excellentPercent + goodPercent}%,
            #F59E0B ${excellentPercent + goodPercent}% 100%
          )`,
        }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-500">Resumes</span>
        </div>
      </div>

      <div className="min-w-[180px] flex-1 space-y-4">
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
            <span>Excellent (80–100)</span>
          </div>
          <span className="font-medium">{excellent}</span>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-blue-600" />
            <span>Good (60–79)</span>
          </div>
          <span className="font-medium">{good}</span>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-orange-500" />
            <span>Needs Improvement (&lt;60)</span>
          </div>
          <span className="font-medium">{needsImprovement}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminResumeOverview() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, resumesResponse] = await Promise.all([
        getAdminResumeStats(),
        getAdminResumes({ page: 1, page_size: 5 }),
      ]);

      if (statsResponse?.success) {
        setStats(statsResponse.data);
      } else {
        throw new Error("Unable to load resume statistics.");
      }

      if (resumesResponse?.success) {
        setResumes(resumesResponse.data || []);
      } else {
        throw new Error("Unable to load recent resumes.");
      }
    } catch (err) {
      console.error("Resume dashboard error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to load resume dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${resume.file_name || "this resume"}?`
    );

    if (!confirmed) return;

    try {
      setActionId(resume.id);

      await deleteAdminResume(resume.id);

      await loadDashboard();

      window.alert("Resume deleted successfully.");
    } catch (err) {
      console.error("Resume delete error:", err);
      window.alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to delete resume."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDownload = async (resume) => {
    try {
      setActionId(resume.id);

      const response = await downloadAdminResume(resume.id);

      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = resume.file_name || "resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Resume download error:", err);
      window.alert(
        err.response?.data?.message ||
          "Unable to download resume."
      );
    } finally {
      setActionId(null);
    }
  };

  const statCards = [
    {
      title: "Total Resumes",
      value: stats?.total_resumes,
      icon: FileText,
      iconStyle: "bg-blue-100 text-blue-700",
      description: "Total uploaded resumes",
    },
    {
      title: "Completed",
      value: stats?.completed,
      icon: Check,
      iconStyle: "bg-emerald-100 text-emerald-600",
      description: "Successfully processed",
    },
    {
      title: "Processing",
      value: stats?.processing,
      icon: Clock,
      iconStyle: "bg-orange-100 text-orange-600",
      description: "Currently in progress",
    },
    {
      title: "Failed",
      value: stats?.failed,
      icon: AlertTriangle,
      iconStyle: "bg-red-100 text-red-600",
      description: "Processing failed",
    },
    {
      title: "Pending",
      value: stats?.pending,
      icon: Clock,
      iconStyle: "bg-slate-100 text-slate-600",
      description: "Waiting for processing",
    },
  ];

  return (
    <AdminDashboardLayout activePage="Resumes">
      <div className="min-h-screen space-y-5 bg-[#F4F6FC] p-5 md:p-7">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Home size={15} />
          <ChevronRight size={14} />
          <span>Resumes</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">Overview</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div></div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadDashboard}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((item) => (
            <StatCard key={item.title} item={item} {...item} />
          ))}
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Average ATS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Average ATS Score
              </h2>

              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <BrainCircuit size={27} />
              </div>
            </div>

            <h3 className="mt-4 text-4xl font-bold text-gray-950">
              {Number(stats?.average_ats_score || 0).toFixed(1)}%
            </h3>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(Number(stats?.average_ats_score || 0), 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-5 text-sm text-gray-600">
              Average score across completed resume analyses.
            </p>
          </div>

          {/* ATS Distribution */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-4">
            <h2 className="text-lg font-bold text-gray-900">
              ATS Score Distribution
            </h2>

            <ScoreDistribution
              distribution={stats?.score_distribution || {}}
            />
          </div>

          {/* Upload Trend - API not available */}
          <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Resume Upload Trend
              </h2>
              <CalendarDays size={24} className="text-blue-600" />
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">
                Monthly trend data is not available yet.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                A monthly upload statistics API is required to display this
                chart using live data.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Resume Uploads
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Latest five uploaded resumes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/resumes/all")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View All Resumes
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="overflow-x-auto px-5">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="bg-[#F1F3F8] text-sm font-semibold text-gray-700">
                  <th className="rounded-l-lg px-3 py-3">Candidate</th>
                  <th className="px-3 py-3">Resume File</th>
                  <th className="px-3 py-3 text-center">ATS Score</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Uploaded On</th>
                  <th className="rounded-r-lg px-3 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      Loading recent resumes...
                    </td>
                  </tr>
                ) : resumes.length > 0 ? (
                  resumes.map((resume) => {
                    const candidateName =
                      resume.user?.name ||
                      `${resume.user?.first_name || ""} ${
                        resume.user?.last_name || ""
                      }`.trim() ||
                      resume.user?.email ||
                      "Unknown Candidate";

                    const initial = candidateName.charAt(0).toUpperCase();

                    const score =
                      resume.upload_status === "COMPLETED"
                        ? resume.ats_score
                        : null;

                    return (
                      <tr
                        key={resume.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                              {initial}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {candidateName}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {resume.user?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-red-50 p-2 text-red-600">
                              <FileText size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {resume.file_name || resume.title || "Resume"}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3 text-center">
                          {score !== null ? (
                            <span
                              className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                                Number(score) >= 80
                                  ? "bg-emerald-100 text-emerald-700"
                                  : Number(score) >= 60
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {Number(score).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>

                        <td className="px-3 py-3">
                          <StatusBadge status={resume.upload_status} />
                        </td>

                        <td className="px-3 py-3">
                          <span className="whitespace-nowrap text-sm text-gray-700">
                            {formatDate(resume.created_at)}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              type="button"
                              title="View resume"
                              onClick={() =>
                                navigate(`/admin/resumes/${resume.id}`)
                              }
                              className="text-gray-700 transition hover:text-blue-700"
                            >
                              <Eye size={19} />
                            </button>

                            <button
                              type="button"
                              title="Download resume"
                              disabled={actionId === resume.id}
                              onClick={() => handleDownload(resume)}
                              className="text-gray-700 transition hover:text-blue-600 disabled:opacity-40"
                            >
                              <Download size={19} />
                            </button>

                            <button
                              type="button"
                              title="Delete resume"
                              disabled={actionId === resume.id}
                              onClick={() => handleDelete(resume)}
                              className="text-gray-700 transition hover:text-red-600 disabled:opacity-40"
                            >
                              <Trash2 size={19} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      No resume uploads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-2 border-t border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing {resumes.length} recent resume uploads.
            </p>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
