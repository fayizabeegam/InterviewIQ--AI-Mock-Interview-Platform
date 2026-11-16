
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  UserRound,
  Mail,
  CalendarDays,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  BriefcaseBusiness,
  Video,
  Code2,
  Map,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getAdminUserDetail } from "../../../services/adminService";

const tabs = [
  { id: "all", label: "All Activity", icon: Activity },
  { id: "resumes", label: "Resume Analyzer", icon: FileText },
  { id: "jobs", label: "Job Matcher", icon: BriefcaseBusiness },
  { id: "interviews", label: "AI Interview", icon: Video },
  { id: "coding", label: "Coding Practice", icon: Code2 },
  { id: "roadmaps", label: "Roadmap", icon: Map },
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const formatStatus = (value) => {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) =>
    c.toUpperCase()
  );
};

function StatusBadge({ status }) {
  const value = (status || "").toUpperCase();

  let styles = "bg-slate-100 text-slate-600";

  if (["COMPLETED", "PASSED", "VERIFIED", "PASS"].includes(value)) {
    styles = "bg-emerald-100 text-emerald-700";
  } else if (["FAILED", "CANCELLED", "INACTIVE", "NEEDS_IMPROVEMENT"].includes(value)) {
    styles = "bg-red-100 text-red-700";
  } else if (["PENDING", "PROCESSING", "IN_PROGRESS", "RUNNING", "AVERAGE"].includes(value)) {
    styles = "bg-amber-100 text-amber-700";
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {formatStatus(status)}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    orange: "bg-orange-50 text-orange-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value ?? 0}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message = "No activity found." }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <Activity size={30} className="mx-auto mb-3 text-slate-300" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

function DataTable({ columns, rows, emptyMessage }) {
  if (!rows?.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            {columns.map((column) => (
              <th key={column.label} className="px-5 py-4 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} className="border-t border-slate-100 hover:bg-slate-50/60">
              {columns.map((column) => (
                <td key={column.label} className="px-5 py-4 text-slate-600">
                  {column.render
                    ? column.render(row)
                    : row[column.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUserDetail(id);
      setDetails(data);
    } catch (error) {
      console.error("Load user details error:", error);
      setError(
        error.response?.data?.message || "Unable to load user details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserDetails();
  }, [loadUserDetails]);

  if (loading) {
    return (
      <AdminDashboardLayout activePage="Users" adminName="Admin">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center text-slate-500">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-blue-600" />
            Loading user activity...
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error || !details) {
    return (
      <AdminDashboardLayout activePage="Users" adminName="Admin">
        <main className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="mr-2 inline" size={18} />
            {error || "User details not found."}
          </div>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            <ArrowLeft size={17} /> Back to Users
          </button>
        </main>
      </AdminDashboardLayout>
    );
  }

  const {
    user,
    resume_summary = {},
    resumes = [],
    job_match_summary = {},
    job_matches = [],
    interview_summary = {},
    interviews = [],
    coding_summary = {},
    coding_submissions = [],
    roadmap_summary = {},
    roadmaps = [],
    activity_timeline = [],
  } = details;

  const renderContent = () => {
    switch (activeTab) {
      case "resumes":
        return (
          <DataTable
            emptyMessage="No resumes uploaded by this user."
            rows={resumes}
            columns={[
              { label: "Resume", key: "title" },
              { label: "ATS Score", render: (r) => `${r.ats_score ?? 0}%` },
              { label: "Upload Status", render: (r) => <StatusBadge status={r.upload_status} /> },
              { label: "Uploaded At", render: (r) => formatDate(r.created_at) },
            ]}
          />
        );

      case "jobs":
        return (
          <DataTable
            emptyMessage="No job matches found."
            rows={job_matches}
            columns={[
              { label: "Job Title", key: "job_title" },
              { label: "Company", key: "company_name" },
              { label: "Match Score", render: (r) => `${r.overall_score ?? 0}%` },
              { label: "ATS Score", render: (r) => `${r.ats_score ?? 0}%` },
              { label: "Matched At", render: (r) => formatDate(r.analyzed_at) },
            ]}
          />
        );

      case "interviews":
        return (
          <DataTable
            emptyMessage="No interviews found."
            rows={interviews}
            columns={[
              { label: "Interview Type", key: "interview_type" },
              { label: "Difficulty", key: "difficulty" },
              { label: "Questions", key: "total_questions" },
              { label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              {
                label: "Overall Score",
                render: (r) => r.report ? `${r.report.overall_score}%` : "—",
              },
              { label: "Created At", render: (r) => formatDate(r.created_at) },
            ]}
          />
        );

      case "coding":
        return (
          <DataTable
            emptyMessage="No coding submissions found."
            rows={coding_submissions}
            columns={[
              { label: "Question", key: "question_title" },
              { label: "Difficulty", key: "difficulty" },
              { label: "Language", key: "programming_language" },
              { label: "Score", render: (r) => `${r.score ?? 0}%` },
              {
                label: "Test Cases",
                render: (r) => `${r.test_cases_passed}/${r.total_test_cases}`,
              },
              { label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { label: "Submitted At", render: (r) => formatDate(r.submitted_at) },
            ]}
          />
        );

      case "roadmaps":
        return (
          <DataTable
            emptyMessage="No learning roadmaps generated."
            rows={roadmaps}
            columns={[
              { label: "Roadmap", key: "title" },
              { label: "Target Role", key: "target_role" },
              { label: "Duration", key: "estimated_duration" },
              {
                label: "Tasks",
                render: (r) => `${r.completed_tasks}/${r.total_tasks} completed`,
              },
              { label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { label: "Created At", render: (r) => formatDate(r.created_at) },
            ]}
          />
        );

      default:
        return (
          <div className="space-y-4">
            {activity_timeline.length === 0 ? (
              <EmptyState message="This user has not performed any recorded activities yet." />
            ) : (
              activity_timeline.map((item, index) => {
                const Icon =
                  item.type === "RESUME" || item.type === "RESUME_ANALYSIS"
                    ? FileText
                    : item.type === "JOB_MATCH"
                    ? BriefcaseBusiness
                    : item.type === "INTERVIEW"
                    ? Video
                    : item.type === "CODING"
                    ? Code2
                    : Map;

                return (
                  <div key={`${item.type}-${item.id}-${index}`} className="flex gap-4 rounded-xl border border-slate-100 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={13} /> {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
    }
  };

  return (
    <AdminDashboardLayout activePage="Users" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 xl:p-7">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Home size={16} /><span>/</span><span>
            <button onClick={() => navigate("/admin/users")} className="hover:text-blue-600">
            Users
          </button></span><span>/</span>
          <span className="font-semibold text-slate-900">User Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadUserDetails}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>

        {/* User Profile */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold text-white">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                {user.name || "Unnamed User"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              <p className="mt-1 text-xs text-slate-400">
                Username: {user.username || "—"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={user.is_active ? "ACTIVE" : "INACTIVE"} />
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                user.is_email_verified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {user.is_email_verified ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
                {user.is_email_verified ? "Email Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Registration Date</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays size={16} className="text-blue-500" />
                {formatDate(user.date_joined)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Last Login</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock size={16} className="text-blue-500" />
                {formatDate(user.last_login)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Account Status</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck size={16} className="text-blue-500" />
                {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Verification</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail size={16} className="text-blue-500" />
                {user.is_email_verified ? "Verified" : "Pending"}
              </p>
            </div>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            <UserRound size={13} className="mr-1 inline" />
            Personal information is displayed in read-only mode.
          </p>
        </section>

        {/* Activity Summary */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Activity Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Resumes Uploaded" value={resume_summary.total_resumes} icon={FileText} color="blue" />
            <StatCard title="Job Matches" value={job_match_summary.total_matches} icon={BriefcaseBusiness} color="purple" />
            <StatCard title="Interviews" value={interview_summary.total} icon={Video} color="green" />
            <StatCard title="Coding Submissions" value={coding_summary.total_submissions} icon={Code2} color="orange" />
            <StatCard title="Learning Roadmaps" value={roadmap_summary.total} icon={Map} color="rose" />
          </div>
        </section>

        {/* Activity Tabs */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <h2 className="text-lg font-bold text-slate-900">User Activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse activity across all InterviewIQ features.
            </p>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      selected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {renderContent()}
          </div>
        </section>
      </main>
    </AdminDashboardLayout>
  );
}
