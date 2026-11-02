
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Power,
  Mail,
  CalendarDays,
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

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

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.is_active).length,
      inactive: users.filter((user) => !user.is_active).length,
      verified: users.filter((user) => user.is_email_verified).length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = `${user.name || ""} ${user.email || ""}`
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && user.is_active) ||
        (statusFilter === "Inactive" && !user.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

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
    <AdminDashboardLayout
      activePage="Users"
      search={search}
      setSearch={setSearch}
      adminName="Admin"
    >
      <main className="mx-auto max-w-[1800px] space-y-6 p-4 sm:p-6 xl:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              User Management
            </h2>
            <p className="mt-2 text-slate-500">
              Manage registered users and their account access.
            </p>
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

        {notice && (
          <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
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

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
          <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
          <StatCard title="Active Users" value={stats.active} icon={UserCheck} color="green" />
          <StatCard title="Inactive Users" value={stats.inactive} icon={UserX} color="orange" />
          <StatCard title="Verified Emails" value={stats.verified} icon={ShieldCheck} color="purple" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or email..."
                  aria-label="Search users"
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter users by status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-blue-600" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-700">No users found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Joined Date</th>
                    <th className="px-5 py-4 font-semibold">Email Verification</th>
                    <th className="px-5 py-4 font-semibold">Account Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
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

                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {user.date_joined
                            ? new Date(user.date_joined).toLocaleDateString("en-IN")
                            : "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_email_verified
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {user.is_email_verified
                            ? <CheckCircle2 size={13} />
                            : <AlertCircle size={13} />}
                          {user.is_email_verified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={updatingId === user.id}
                          onClick={() => setConfirmUser(user)}
                          className={`inline-flex min-w-[125px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            Account actions are restricted to authorized administrators.
          </div>
        </section>

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
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                confirmUser.is_active
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}>
                <Power size={23} />
              </div>

              <h3 id="confirm-status-title" className="mt-4 text-xl font-bold text-slate-900">
                {confirmUser.is_active ? "Deactivate user?" : "Activate user?"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to {confirmUser.is_active ? "deactivate" : "activate"}{" "}
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
