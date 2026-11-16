
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Home,
  Code2,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Power,
  Mail,
  CalendarDays,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../../../services/adminService";

function StatCard({ title, value, icon: Icon, color }) {
  const styles = {
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
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Account status confirmation
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();
      setUsers(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.is_active).length,
      inactive: users.filter((user) => !user.is_active).length,
      verified: users.filter((user) => user.is_email_verified).length,
    }),
    [users]
  );

  // Advanced search and filtering
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = [
        user.name,
        user.first_name,
        user.last_name,
        user.email,
        user.username,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && user.is_active) ||
        (statusFilter === "Inactive" && !user.is_active);

      const matchesVerification =
        verificationFilter === "All" ||
        (verificationFilter === "Verified" && user.is_email_verified) ||
        (verificationFilter === "Pending" && !user.is_email_verified);

      const joinedDate = user.date_joined
        ? new Date(user.date_joined)
        : null;

      const matchesDateFrom =
        !dateFrom ||
        (joinedDate &&
          !Number.isNaN(joinedDate.getTime()) &&
          joinedDate >= new Date(`${dateFrom}T00:00:00`));

      const matchesDateTo =
        !dateTo ||
        (joinedDate &&
          !Number.isNaN(joinedDate.getTime()) &&
          joinedDate <= new Date(`${dateTo}T23:59:59.999`));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [
    users,
    search,
    statusFilter,
    verificationFilter,
    dateFrom,
    dateTo,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Keep current page valid when filtering or changing page size
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, verificationFilter, dateFrom, dateTo, pageSize]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setVerificationFilter("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Activate / Deactivate user
  const handleStatusChange = async () => {
    if (!confirmUser) return;

    const user = confirmUser;
    const nextStatus = !user.is_active;

    try {
      setUpdatingId(user.id);
      setNotice("");
      setError("");

      await updateAdminUserStatus(user.id, nextStatus);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? { ...item, is_active: nextStatus }
            : item
        )
      );

      setNotice(
        `${user.name || user.email} has been ${
          nextStatus ? "activated" : "deactivated"
        }.`
      );

      setConfirmUser(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to update user status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminDashboardLayout activePage="Users" search={search} setSearch={setSearch} adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 xl:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Home size={16} /><span>/</span><span>User</span><span>/</span>
          <span className="font-bold text-slate-950">User Management</span>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div>
            
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {notice && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={19} />
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              className="ml-auto font-semibold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
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

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
          <StatCard title="Active Users" value={stats.active} icon={UserCheck} color="green" />
          <StatCard title="Inactive Users" value={stats.inactive} icon={UserX} color="orange" />
          <StatCard title="Verified Emails" value={stats.verified} icon={ShieldCheck} color="purple" />
        </section>

        {/* Registered Users */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          {/* Search and Filter Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or username..."
                  aria-label="Search users"
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>

              {/* Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                aria-expanded={showFilters}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold ${
                  showFilters
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>

              {/* Reset */}
              <button
                type="button"
                onClick={resetFilters}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </div>

          {/* Advanced Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 xl:grid-cols-4">

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Account Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Email Verification
                </label>
                <select
                  value={verificationFilter}
                  onChange={(event) => setVerificationFilter(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="All">All verification statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Registered From
                </label>
                <input
                  type="date"
                  max={dateTo || undefined}
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Registered To
                </label>
                <input
                  type="date"
                  min={dateFrom || undefined}
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw
                size={24}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">No users found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (

            /* Users Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Username</th>
                    <th className="px-5 py-4 font-semibold">Joined Date</th>
                    <th className="px-5 py-4 font-semibold">Email Verification</th>
                    <th className="px-5 py-4 font-semibold">Account Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {(user.name || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Mail size={13} />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {user.username || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {user.date_joined
                            ? new Date(user.date_joined).toLocaleDateString("en-IN")
                            : "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            user.is_email_verified
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {user.is_email_verified ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <AlertCircle size={13} />
                          )}
                          {user.is_email_verified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            user.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* View Profile */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/users/${user.id}`)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {/* Activate / Deactivate */}
                          <button
                            type="button"
                            disabled={updatingId === user.id}
                            onClick={() => setConfirmUser(user)}
                            className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.is_active
                                ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {updatingId === user.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Power size={14} />
                            )}
                            {user.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>Rows per page</span>

                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <span>
                  Showing {((currentPage - 1) * pageSize) + 1}–
                  {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
                  {filteredUsers.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="px-2 text-sm font-semibold text-slate-700">
                  {currentPage} / {Math.max(totalPages, 1)}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            Account actions are restricted to authorized administrators.
          </div>
        </section>

        {/* Activate / Deactivate Confirmation Modal */}
        {confirmUser && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !updatingId) {
                setConfirmUser(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-status-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  confirmUser.is_active
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Power size={23} />
              </div>

              <h3
                id="confirm-status-title"
                className="mt-4 text-xl font-bold text-slate-900"
              >
                {confirmUser.is_active ? "Deactivate user?" : "Activate user?"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to{" "}
                {confirmUser.is_active ? "deactivate" : "activate"}{" "}
                <strong>{confirmUser.name || confirmUser.email}</strong>?

                {confirmUser.is_active
                  ? " This may prevent the user from accessing the platform."
                  : " This will restore the user's account access."}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={updatingId !== null}
                  onClick={() => setConfirmUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={updatingId !== null}
                  onClick={handleStatusChange}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${
                    confirmUser.is_active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {updatingId !== null && (
                    <RefreshCw size={15} className="animate-spin" />
                  )}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminDashboardLayout>
  );
}
