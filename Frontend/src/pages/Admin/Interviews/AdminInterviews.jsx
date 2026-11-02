
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Users,
  Video,
  AlertCircle,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getAdminInterviews } from "../../../services/adminService";

function StatCard({ title, value, icon: Icon, color }) {
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
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={24} />
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

function formatStatus(value) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusStyle(value) {
  const status = (value || "").toLowerCase();

  if (["completed", "complete"].includes(status)) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (["in_progress", "started", "ongoing"].includes(status)) {
    return "bg-blue-100 text-blue-700";
  }

  if (["cancelled", "canceled", "failed"].includes(status)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

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
          "Unable to load interviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  const interviewTypes = useMemo(
    () => [
      ...new Set(
        interviews
          .map((interview) => interview.interview_type)
          .filter(Boolean)
      ),
    ],
    [interviews]
  );

  const stats = useMemo(() => {
    const completed = interviews.filter((interview) =>
      ["completed", "complete"].includes(
        (interview.status || "").toLowerCase()
      )
    ).length;

    const inProgress = interviews.filter((interview) =>
      ["in_progress", "started", "ongoing"].includes(
        (interview.status || "").toLowerCase()
      )
    ).length;

    return {
      total: interviews.length,
      completed,
      inProgress,
      other: interviews.length - completed - inProgress,
    };
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return interviews.filter((interview) => {
      const matchesSearch = [
        interview.user_name,
        interview.user_email,
        interview.interview_type,
        interview.difficulty,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (interview.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "All" ||
        interview.interview_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [interviews, search, statusFilter, typeFilter]);

  const statusOptions = useMemo(
    () => [
      ...new Set(
        interviews.map((interview) => interview.status).filter(Boolean)
      ),
    ],
    [interviews]
  );

  return (
    <AdminDashboardLayout
      activePage="Interviews"
      search={search}
      setSearch={setSearch}
      adminName="Admin"
    >
      <main className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 xl:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Interview Management
            </h2>
            <p className="mt-2 text-slate-500">
              Monitor interview sessions, candidates, and completion status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInterviews}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto font-semibold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Interviews"
            value={stats.total}
            icon={Video}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Activity}
            color="purple"
          />
          <StatCard
            title="Other Statuses"
            value={stats.other}
            icon={Clock}
            color="orange"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Interview Sessions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredInterviews.length} of {interviews.length} interviews
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search candidate or type..."
                  aria-label="Search interviews"
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter interviews by status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="All">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                aria-label="Filter interviews by type"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="All">All types</option>
                {interviewTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatStatus(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw
                size={24}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />
              Loading interviews...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-slate-500">
              Interview data could not be loaded.
              <button
                type="button"
                onClick={loadInterviews}
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="p-12 text-center">
              <Video size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">
                No interviews found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="px-5 py-4 font-semibold">Candidate</th>
                    <th className="px-5 py-4 font-semibold">Interview Type</th>
                    <th className="px-5 py-4 font-semibold">Difficulty</th>
                    <th className="px-5 py-4 font-semibold">Questions</th>
                    <th className="px-5 py-4 font-semibold">Created Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInterviews.map((interview) => (
                    <tr
                      key={interview.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {(interview.user_name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {interview.user_name || "Unknown User"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {interview.user_email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatStatus(interview.interview_type)}
                      </td>

                      <td className="px-5 py-4">
                        {interview.difficulty ? (
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                            {formatStatus(interview.difficulty)}
                          </span>
                        ) : (
                          "—"
                        )}
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                            interview.status
                          )}`}
                        >
                          {formatStatus(interview.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            Interview records are read-only on this page.
          </div>
        </section>
      </main>
    </AdminDashboardLayout>
  );
}
