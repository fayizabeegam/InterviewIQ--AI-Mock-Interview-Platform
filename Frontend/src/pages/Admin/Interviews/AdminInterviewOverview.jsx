
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  RefreshCw,
  Video,
  Users,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getAdminInterviews } from "../../../services/adminService";

function StatCard({ title, value, icon: Icon, color, description }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function formatLabel(value) {
  if (!value) return "Unknown";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusColor(status) {
  const value = (status || "").toLowerCase();

  if (["completed", "complete"].includes(value)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["in_progress", "started", "ongoing"].includes(value)) {
    return "bg-blue-100 text-blue-700";
  }

  if (["cancelled", "canceled", "failed"].includes(value)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <Video size={30} className="mx-auto mb-3 text-slate-300" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function AdminInterviewOverview() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminInterviews();
      setInterviews(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load interview overview."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  const stats = useMemo(() => {
    const completed = interviews.filter((item) =>
      ["completed", "complete"].includes(
        (item.status || "").toLowerCase()
      )
    ).length;

    const inProgress = interviews.filter((item) =>
      ["in_progress", "started", "ongoing"].includes(
        (item.status || "").toLowerCase()
      )
    ).length;

    const pending = interviews.filter((item) =>
      ["pending"].includes((item.status || "").toLowerCase())
    ).length;

    return {
      total: interviews.length,
      completed,
      inProgress,
      pending,
      other: interviews.length - completed - inProgress - pending,
    };
  }, [interviews]);

  const completionRate = useMemo(() => {
    if (!stats.total) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      const count = interviews.filter((item) => {
        if (!item.created_at) return false;

        const created = new Date(item.created_at);

        return (
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        );
      }).length;

      return {
        label: date.toLocaleDateString("en-IN", { month: "short" }),
        count,
      };
    });
  }, [interviews]);

  const maxMonthlyCount = Math.max(
    ...monthlyTrend.map((item) => item.count),
    1
  );

  const interviewTypes = useMemo(() => {
    const counts = {};

    interviews.forEach((item) => {
      const type = item.interview_type || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [interviews]);

  const recentInterviews = useMemo(() => {
    return [...interviews]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      )
      .slice(0, 5);
  }, [interviews]);

  const maxTypeCount = Math.max(
    ...interviewTypes.map((item) => item.count),
    1
  );

  return (
    <AdminDashboardLayout activePage="Interviews" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 xl:p-7">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Home size={16} /><span>/</span><span>
            <button onClick={() => navigate("/admin/interviews")} className="hover:text-blue-600">
            Interviews
          </button></span><span>/</span>
          <span className="font-bold text-slate-950">Interview Overview</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadInterviews}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />
            <span>{error}</span>
            <button
              onClick={loadInterviews}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Interviews"
            value={loading ? "—" : stats.total}
            icon={Video}
            color="blue"
            description="All available interview sessions"
          />

          <StatCard
            title="Completed"
            value={loading ? "—" : stats.completed}
            icon={CheckCircle2}
            color="green"
            description="Successfully completed sessions"
          />

          <StatCard
            title="In Progress"
            value={loading ? "—" : stats.inProgress}
            icon={Activity}
            color="purple"
            description="Currently ongoing sessions"
          />

          <StatCard
            title="Pending"
            value={loading ? "—" : stats.pending}
            icon={Clock}
            color="orange"
            description="Sessions awaiting completion"
          />
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-500 shadow-sm">
            <RefreshCw
              size={25}
              className="mx-auto mb-3 animate-spin text-blue-600"
            />
            Loading interview analytics...
          </div>
        ) : (
          <>
            {/* Analytics */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

              {/* Monthly Trend */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Interview Activity
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Interview sessions created over the last 6 months
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <TrendingUp size={21} />
                  </div>
                </div>

                {interviews.length === 0 ? (
                  <EmptyState message="No interview activity available yet." />
                ) : (
                  <div className="flex h-52 items-end justify-around gap-3 border-b border-slate-100 px-2">
                    {monthlyTrend.map((item) => (
                      <div
                        key={item.label}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-xs font-semibold text-slate-600">
                          {item.count}
                        </span>

                        <div
                          className="w-full max-w-14 rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                          style={{
                            height: `${Math.max(
                              (item.count / maxMonthlyCount) * 135,
                              item.count > 0 ? 8 : 0
                            )}px`,
                          }}
                        />

                        <span className="pb-2 text-xs text-slate-500">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completion Summary */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Completion Summary
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Overall interview completion
                    </p>
                  </div>

                  <CheckCircle2 size={22} className="text-emerald-600" />
                </div>

                <div className="flex flex-col items-center py-5">
                  <div
                    className="flex h-36 w-36 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#2563eb ${completionRate}%, #e2e8f0 0)`,
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-3xl font-bold text-slate-900">
                        {completionRate}%
                      </span>
                      <span className="text-xs text-slate-500">
                        Completed
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    {stats.completed} of {stats.total} interviews completed
                  </p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Completed
                    </span>
                    <span className="font-semibold text-slate-800">
                      {stats.completed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      In Progress
                    </span>
                    <span className="font-semibold text-slate-800">
                      {stats.inProgress}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                      Pending
                    </span>
                    <span className="font-semibold text-slate-800">
                      {stats.pending}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Interview Types */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <BarChart3 size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Interview Types
                    </h2>
                    <p className="text-xs text-slate-500">
                      Sessions by interview category
                    </p>
                  </div>
                </div>

                {interviewTypes.length === 0 ? (
                  <EmptyState message="No interview types available." />
                ) : (
                  <div className="space-y-5">
                    {interviewTypes.map((item) => (
                      <div key={item.type}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {formatLabel(item.type)}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${(item.count / maxTypeCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Statuses */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Interview Status Overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Distribution of all available interview statuses
                    </p>
                  </div>
                  <Users size={22} className="text-slate-400" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Completed",
                      count: stats.completed,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "In Progress",
                      count: stats.inProgress,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Pending",
                      count: stats.pending,
                      color: "bg-orange-400",
                    },
                    {
                      label: "Other",
                      count: stats.other,
                      color: "bg-slate-400",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-3 w-3 rounded-full ${item.color}`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    Interview records
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    {stats.total} interview records are available in the
                    current API response.
                  </p>
                </div>
              </div>
            </section>

            {/* Recent Interviews */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Recent Interviews
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest 5 interview sessions
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/interviews")}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>

              {recentInterviews.length === 0 ? (
                <EmptyState message="No interviews found." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500">
                        <th className="px-5 py-4 font-semibold">Candidate</th>
                        <th className="px-5 py-4 font-semibold">
                          Interview Type
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Difficulty
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Questions
                        </th>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentInterviews.map((interview) => (
                        <tr
                          key={interview.id}
                          className="border-t border-slate-100 hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">
                              {interview.user_name || "Unknown User"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {interview.user_email || "No email"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {formatLabel(interview.interview_type)}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatLabel(interview.difficulty)}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {interview.total_questions ?? "—"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                            <span className="flex items-center gap-2">
                              <CalendarDays size={15} />
                              {formatDate(interview.created_at)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                interview.status
                              )}`}
                            >
                              {formatLabel(interview.status)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/interviews/${interview.id}`
                                )
                              }
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </AdminDashboardLayout>
  );
}
