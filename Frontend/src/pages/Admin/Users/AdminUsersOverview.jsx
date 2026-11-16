
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  ArrowUpRight,
  CalendarDays,
  TrendingUp,
  Eye,
  Mail,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getAdminUsers } from "../../../services/adminService";

function StatCard({ title, value, icon: Icon, color, description }) {
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
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[color]}`}
        >
          <Icon size={25} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RegistrationTrend({ users }) {
  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleDateString("en-IN", { month: "short" }),
        value: 0,
      };
    });

    const monthMap = new Map(months.map((item) => [item.key, item]));

    users.forEach((user) => {
      if (!user.date_joined) return;

      const date = new Date(user.date_joined);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = monthMap.get(key);

      if (month) month.value += 1;
    });

    return months;
  }, [users]);

  const maxValue = Math.max(...monthlyData.map((item) => item.value), 1);

  const width = 600;
  const height = 210;
  const left = 38;
  const right = 580;
  const top = 15;
  const bottom = 170;

  const points = monthlyData.map((item, index) => ({
    x: left + (index * (right - left)) / (monthlyData.length - 1),
    y: bottom - (item.value / maxValue) * (bottom - top),
  }));

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">New registrations</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {monthlyData.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 p-3 text-blue-600">
          <TrendingUp size={22} />
        </span>
      </div>

      <div className="mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="img"
          aria-label="Monthly user registration trend for the last six months"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = bottom - fraction * (bottom - top);

            return (
              <line
                key={fraction}
                x1={left}
                x2={right}
                y1={y}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
            );
          })}

          <path d={areaPath} fill="#2563EB" opacity="0.10" />

          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={monthlyData[index].key}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              <text
                x={point.x}
                y={point.y - 12}
                fontSize="12"
                textAnchor="middle"
                fill="#334155"
                fontWeight="600"
              >
                {monthlyData[index].value}
              </text>
              <text
                x={point.x}
                y="198"
                fontSize="12"
                textAnchor="middle"
                fill="#64748B"
              >
                {monthlyData[index].month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function VerificationBar({ verified, pending, total }) {
  const verifiedPercent = total ? (verified / total) * 100 : 0;
  const pendingPercent = total ? (pending / total) * 100 : 0;

  return (
    <div className="mt-5">
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${verifiedPercent}%` }}
        />
        <div
          className="bg-orange-400 transition-all"
          style={{ width: `${pendingPercent}%` }}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Verified Emails
          </span>
          <span className="font-semibold text-slate-900">{verified}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-full bg-orange-400" />
            Pending Verification
          </span>
          <span className="font-semibold text-slate-900">{pending}</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminUserOverview() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();

      const userList = response?.data?.data;

      if (!Array.isArray(userList)) {
        throw new Error("Unexpected users API response.");
      }

      setUsers(userList);
    } catch (err) {
      console.error("User overview error:", err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Unable to load user overview."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.is_active).length;
    const inactive = total - active;
    const verified = users.filter(
      (user) => user.is_email_verified
    ).length;
    const pending = total - verified;

    return { total, active, inactive, verified, pending };
  }, [users]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        return (
          new Date(b.date_joined || 0).getTime() -
          new Date(a.date_joined || 0).getTime()
        );
      })
      .slice(0, 5);
  }, [users]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "blue",
      description: "All registered platform users",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: UserCheck,
      color: "green",
      description: "Accounts currently active",
    },
    {
      title: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      color: "orange",
      description: "Deactivated accounts",
    },
    {
      title: "Verified Emails",
      value: stats.verified,
      icon: ShieldCheck,
      color: "purple",
      description: "Users with verified email addresses",
    },
  ];

  return (
    <AdminDashboardLayout activePage="Users" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-6 bg-[#F4F6FC] p-4 sm:p-6 xl:p-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Home size={16} />
          <span>/</span>
          <span>Users</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Overview</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div></div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadUsers}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-500 shadow-sm">
            <RefreshCw
              size={26}
              className="mx-auto mb-3 animate-spin text-blue-600"
            />
            Loading user overview...
          </div>
        ) : (
          <>
            {/* Analytics */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      User Registration Trend
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Registrations over the last six calendar months
                    </p>
                  </div>
                  <CalendarDays size={23} className="text-blue-600" />
                </div>

                <RegistrationTrend users={users} />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Email Verification
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Verification status of registered users
                    </p>
                  </div>
                  <ShieldCheck size={24} className="text-blue-600" />
                </div>

                <VerificationBar
                  verified={stats.verified}
                  pending={stats.pending}
                  total={stats.total}
                />

                <div className="mt-6 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">
                    {stats.total
                      ? `${((stats.verified / stats.total) * 100).toFixed(1)}%`
                      : "0%"}{" "}
                    verified
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    Percentage of registered users with verified email.
                  </p>
                </div>
              </div>
            </section>

            {/* Account status */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <UserCheck size={23} />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Active Accounts
                    </h2>
                    <p className="text-sm text-slate-500">
                      Users who can access the platform
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {stats.active}
                </p>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${
                        stats.total
                          ? (stats.active / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-orange-50 p-3 text-orange-600">
                    <ShieldAlert size={23} />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Pending Verification
                    </h2>
                    <p className="text-sm text-slate-500">
                      Users who have not verified their email
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {stats.pending}
                </p>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-orange-400"
                    style={{
                      width: `${
                        stats.total
                          ? (stats.pending / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Recent Users */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recently Registered Users
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest five user registrations
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  View All Users
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="px-5 py-4 font-semibold">User</th>
                      <th className="px-5 py-4 font-semibold">Username</th>
                      <th className="px-5 py-4 font-semibold">
                        Registered Date
                      </th>
                      <th className="px-5 py-4 font-semibold">Verification</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentUsers.length ? (
                      recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                {(user.name || user.email || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {user.name || "Unnamed User"}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                  <Mail size={12} />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {user.username || "—"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                            {formatDate(user.date_joined)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                user.is_email_verified
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {user.is_email_verified
                                ? "Verified"
                                : "Pending"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge active={user.is_active} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/users/${user.id}`)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              <Eye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-5 py-12 text-center text-slate-500"
                        >
                          No registered users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
                Showing {recentUsers.length} of {stats.total} users.
              </div>
            </section>
          </>
        )}
      </main>
    </AdminDashboardLayout>
  );
}
