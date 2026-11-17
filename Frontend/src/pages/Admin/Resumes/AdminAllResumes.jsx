
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Search,
  FileText,
  Check,
  Clock,
  AlertTriangle,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  CalendarDays,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import {
  getAdminResumeStats,
  getAdminResumes,
  deleteAdminResume,
  downloadAdminResume,
} from "../../../services/adminService";

// ---------------------------------------------
// HELPERS
// ---------------------------------------------

const mapResumeData = (items = []) =>
  items.map((resume) => {
    const candidateName =
      resume.user?.name ||
      resume.user?.email ||
      "Unknown Candidate";

    return {
      ...resume,
      name: candidateName,
      email: resume.user?.email || "",
      file: resume.file_name || resume.title || "Resume.pdf",
      score:
        resume.upload_status === "COMPLETED" &&
        resume.ats_score !== null &&
        resume.ats_score !== undefined
          ? Number(resume.ats_score)
          : null,
      status: resume.upload_status,
      date: resume.created_at
        ? new Date(resume.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
      avatar: candidateName.charAt(0).toUpperCase(),
      avatarColor: "bg-blue-100 text-blue-700",
    };
  });

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ---------------------------------------------
// SMALL COMPONENTS
// ---------------------------------------------

const StatCard = ({ title, value, subtitle, icon: Icon, theme }) => {
  const themes = {
    purple: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${themes[theme]}`}
        >
          <Icon size={29} strokeWidth={2.3} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-950">
            {value}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    COMPLETED: {
      label: "Completed",
      icon: Check,
      style: "bg-emerald-100 text-emerald-700",
    },
    PROCESSING: {
      label: "Processing",
      icon: Clock,
      style: "bg-orange-100 text-orange-700",
    },
    FAILED: {
      label: "Failed",
      icon: AlertTriangle,
      style: "bg-red-100 text-red-600",
    },
    PENDING: {
      label: "Pending",
      icon: Clock,
      style: "bg-blue-100 text-blue-700",
    },
  };

  const item = config[status] || config.PENDING;
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${item.style}`}
    >
      <Icon size={14} />
      {item.label}
    </span>
  );
};

const ScoreBadge = ({ score }) => {
  if (score === null || score === undefined) {
    return <span className="text-gray-500">—</span>;
  }

  return (
    <span
      className={`inline-flex min-w-[68px] justify-center rounded-full px-3 py-1.5 text-sm font-bold ${
        score >= 80
          ? "bg-emerald-100 text-emerald-700"
          : score >= 60
          ? "bg-blue-100 text-blue-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {score}%
    </span>
  );
};

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------

export default function AdminAllResumes() {
  const navigate = useNavigate();

  // -------------------------------------------
  // STATES
  // -------------------------------------------

  const [resumes, setResumes] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [scoreFilter, setScoreFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Increment this to reload the list after deletion
  const [refreshKey, setRefreshKey] = useState(0);

  // -------------------------------------------
  // FETCH STATISTICS
  // -------------------------------------------

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminResumeStats();

        // Backend response: { success: true, data: {...} }
        const data = response.data?.data;

        if (!data) {
          throw new Error("Invalid statistics response.");
        }

        setStats({
          total: data.total_resumes ?? 0,
          completed: data.completed ?? 0,
          processing: data.processing ?? 0,
          failed: data.failed ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch resume statistics:", err);
      }
    };

    fetchStats();
  }, [refreshKey]);

  // -------------------------------------------
  // FETCH RESUMES
  // -------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          search: search.trim(),

          // Backend accepts an empty status, not ALL
          status: statusFilter === "ALL" ? "" : statusFilter,

          score: scoreFilter,
          page,
          page_size: pageSize,
        };

        // Latest uploads = last 7 days
        // Older uploads = before the last 7 days
        if (dateFilter !== "ALL") {
          const today = new Date();
          const cutoff = new Date();

          cutoff.setDate(today.getDate() - 7);

          if (dateFilter === "LATEST") {
            params.date_from = formatDateForApi(cutoff);
            params.date_to = formatDateForApi(today);
          }

          if (dateFilter === "OLDER") {
            params.date_to = formatDateForApi(cutoff);
          }
        }

        const response = await getAdminResumes(params);

        if (!isMounted) return;

        // Backend response:
        // { success, count, total_pages, current_page, data }
        setResumes(mapResumeData(response.data || []));

        setTotalCount(response.count || 0);
        setTotalPages(response.total_pages || 1);

        setSelectedIds([]);
      } catch (err) {
        if (!isMounted) return;

        console.error("Failed to fetch resumes:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load resumes. Please try again."
        );

        setResumes([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResumes();

    return () => {
      isMounted = false;
    };
  }, [
    search,
    statusFilter,
    scoreFilter,
    dateFilter,
    page,
    pageSize,
    refreshKey,
  ]);

  // -------------------------------------------
  // PAGINATION AND SELECTION
  // -------------------------------------------

  const currentPage = page;
  const paginatedResumes = resumes;

  const visibleIds = paginatedResumes.map((resume) => resume.id);

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds.includes(id));

  const goToPage = (nextPage) =>
    setPage(
      Math.min(totalPages, Math.max(1, nextPage))
    );

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds((current) =>
        [...new Set([...current, ...visibleIds])]
      );
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  // -------------------------------------------
  // DELETE ONE RESUME
  // -------------------------------------------

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this resume?")
    ) {
      return;
    }

    try {
      await deleteAdminResume(id);

      setSelectedIds((current) =>
        current.filter((item) => item !== id)
      );

      setMessage("Resume deleted successfully.");
      setError("");

      // Move back if the current page becomes empty
      if (resumes.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (err) {
      console.error("Resume deletion failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete resume."
      );
    }
  };

  // -------------------------------------------
  // BULK DELETE
  // -------------------------------------------

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (
      !window.confirm(
        `Delete ${selectedIds.length} selected resumes?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) => deleteAdminResume(id))
      );

      const deletedCount = selectedIds.length;

      setSelectedIds([]);
      setMessage("Selected resumes deleted successfully.");
      setError("");

      if (resumes.length <= deletedCount && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (err) {
      console.error("Bulk deletion failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete selected resumes."
      );

      // Refresh because some individual deletions may have succeeded
      setRefreshKey((current) => current + 1);
    }
  };

  // -------------------------------------------
  // DOWNLOAD RESUME
  // -------------------------------------------

  const handleDownload = async (resume) => {
    try {
      const response = await downloadAdminResume(resume.id);

      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = resume.file || "Resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Resume download failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to download resume."
      );
    }
  };

  // -------------------------------------------
  // RESET FILTERS
  // -------------------------------------------

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setScoreFilter("ALL");
    setDateFilter("ALL");
    setSelectedIds([]);
    setPage(1);
    setMessage("");
    setError("");
  };

  // -------------------------------------------
  // RENDER
  // -------------------------------------------

  return (
    <AdminDashboardLayout activePage="Resumes">
      <div className="min-h-screen space-y-5 bg-[#F4F6FC] p-5 md:p-7">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Home size={16} />
          <ChevronRight size={14} />
          <span>Resumes</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">
            All Resumes
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div></div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className="flex h-[46px] items-center gap-2 rounded-xl border border-blue-500 bg-white px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={20} />
              Delete Selected
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Resumes"
            value={stats.total}
            subtitle="Total uploaded resumes"
            icon={FileText}
            theme="purple"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Successfully processed"
            icon={Check}
            theme="green"
          />

          <StatCard
            title="Processing"
            value={stats.processing}
            subtitle="Currently processing"
            icon={Clock}
            theme="orange"
          />

          <StatCard
            title="Failed"
            value={stats.failed}
            subtitle="Processing failed"
            icon={AlertTriangle}
            theme="red"
          />
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">

            {/* Search */}
            <div className="relative lg:col-span-4">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by candidate, email or resume title..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-800 outline-none focus:border-blue-500"
              >
                <option value="ALL">Status: All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* ATS Score */}
            <div className="lg:col-span-2">
              <select
                value={scoreFilter}
                onChange={(e) => {
                  setScoreFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-800 outline-none focus:border-blue-500"
              >
                <option value="ALL">ATS Score: All Scores</option>
                <option value="HIGH">High (80–100)</option>
                <option value="MEDIUM">Medium (60–79)</option>
                <option value="LOW">Low (Below 60)</option>
              </select>
            </div>

            {/* Upload Date */}
            <div className="relative lg:col-span-3">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
              />

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-gray-800 outline-none focus:border-blue-500"
              >
                <option value="ALL">Upload Date</option>
                <option value="LATEST">Latest uploads (7 days)</option>
                <option value="OLDER">Older uploads</option>
              </select>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 px-2 text-sm font-semibold text-blue-700 hover:text-blue-900 lg:col-span-1"
            >
              <RefreshCw size={18} />
              Reset
            </button>
          </div>
        </div>

        {/* Resume Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Selection Count */}
          <div className="px-5 py-3 text-sm font-medium text-gray-700">
            {selectedIds.length} selected
          </div>

          <div className="overflow-x-auto px-4">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="bg-[#F1F3F8] text-sm font-semibold text-gray-800">
                  <th className="w-12 rounded-l-lg px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer rounded accent-blue-600"
                    />
                  </th>

                  <th className="px-3 py-3">Candidate</th>
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

                {/* Loading */}
                {loading && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Loading resumes...
                    </td>
                  </tr>
                )}

                {/* Error */}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-red-600"
                    >
                      Unable to display resumes.
                    </td>
                  </tr>
                )}

                {/* Resume Rows */}
                {!loading &&
                  !error &&
                  paginatedResumes.map((resume) => (
                    <tr
                      key={resume.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(resume.id)}
                          onChange={() => toggleSelect(resume.id)}
                          className="h-4 w-4 cursor-pointer rounded accent-blue-600"
                        />
                      </td>

                      {/* Candidate */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${resume.avatarColor}`}
                          >
                            {resume.avatar}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {resume.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-600">
                              {resume.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Resume File */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="rounded-lg bg-red-50 p-2 text-red-600">
                            <FileText size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {resume.file}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              PDF Document
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ATS Score */}
                      <td className="px-3 py-3 text-center">
                        <ScoreBadge score={resume.score} />
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        <StatusBadge status={resume.status} />
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-800">
                          <CalendarDays
                            size={16}
                            className="text-gray-700"
                          />
                          {resume.date}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-4">

                          {/* View */}
                          <button
                            type="button"
                            title="View resume"
                            onClick={() =>
                              navigate(`/admin/resumes/${resume.id}`)
                            }
                            className="text-gray-800 transition hover:text-blue-700"
                          >
                            <Eye size={19} />
                          </button>

                          {/* Download */}
                          <button
                            type="button"
                            title="Download resume"
                            onClick={() => handleDownload(resume)}
                            className="text-gray-800 transition hover:text-blue-600"
                          >
                            <Download size={19} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete resume"
                            onClick={() => handleDelete(resume.id)}
                            className="text-gray-800 transition hover:text-red-600"
                          >
                            <Trash2 size={19} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Empty State */}
                {!loading &&
                  !error &&
                  paginatedResumes.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-5 py-16 text-center">
                        <FileText
                          size={35}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                          No resumes found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-3">

            <p className="text-sm text-gray-800">
              Showing{" "}
              {totalCount === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              –
              {Math.min(currentPage * pageSize, totalCount)}
              {" "}of {totalCount} resumes
            </p>

            <div className="flex items-center gap-2">

              {/* Previous */}
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, index) => index + 1
              ).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => goToPage(number)}
                  disabled={loading}
                  className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${
                    currentPage === number
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}

              {/* Last Page */}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-gray-600">...</span>

                  <button
                    type="button"
                    onClick={() => goToPage(totalPages)}
                    disabled={loading}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${
                      currentPage === totalPages
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next */}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon size={20} />
              </button>

            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
            <p className="text-xs text-gray-500">
              Resume management actions are restricted to authorized administrators.
            </p>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
