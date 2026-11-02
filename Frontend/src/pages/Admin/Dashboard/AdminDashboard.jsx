import { useEffect, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, CalendarDays,
  ChartNoAxesColumn, Clock, Code2, FileText, ShieldCheck, Users, Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaHandPaper  } from "react-icons/fa";
import { getAdminDashboardStats,getAdminUsers } from "../../../services/adminService";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";



const activities = [
  { title: "New user registered", subtitle: "Akhila Raj joined the platform", time: "2 hours ago", icon: Users, color: "green" },
  { title: "Interview completed", subtitle: "Python Developer Interview", time: "4 hours ago", icon: FileText, color: "purple" },
  { title: "Coding test submitted", subtitle: "Data Structures Test", time: "6 hours ago", icon: Code2, color: "blue" },
  { title: "Resume uploaded", subtitle: "by Rahul K", time: "8 hours ago", icon: ArrowDownToLine, color: "orange" },
  { title: "User account verified", subtitle: "Sneha P", time: "10 hours ago", icon: ShieldCheck, color: "pink" },
];

function MiniChart({ color, path }) {
  const colors = {
    blue: "#2580ff",
    purple: "#a78bfa",
    green: "#34d399",
    orange: "#ffad4a",
  };

  const id = `gradient-${color}`;

  return (
    <svg viewBox="0 0 120 52" className="h-14 w-24 shrink-0" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[color]} stopOpacity=".32" />
          <stop offset="100%" stopColor={colors[color]} stopOpacity=".03" />
        </linearGradient>
      </defs>
      <path d={`${path} L120 52 L0 52 Z`} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={colors[color]} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GrowthChart() {
  const values = [60, 100, 122, 158, 190, 225];
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

  return (
    <div className="mt-6">
      <div className="relative h-44 pl-9 pr-1">
        {[0, 50, 100, 150, 200, 250].map((n) => (
          <div key={n} className="absolute left-0 right-0 flex items-center" style={{ bottom: `${(n / 250) * 100}%` }}>
            <span className="w-8 -translate-y-1/2 text-xs text-slate-500">{n}</span>
            <div className="flex-1 border-t border-slate-100" />
          </div>
        ))}

        <div className="absolute inset-0 ml-10 flex items-end justify-around">
          {values.map((value, i) => (
            <div key={months[i]} className="flex h-full w-9 flex-col justify-end">
              <div
                className="rounded-t-md bg-gradient-to-t from-blue-400 to-blue-500 shadow-sm"
                style={{ height: `${(value / 250) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ml-10 mt-2 flex justify-around">
        {months.map((month) => (
          <span key={month} className="text-xs text-slate-500">{month}</span>
        ))}
      </div>
    </div>
  );
}

function InterviewChart() {
  const segments = [
    { label: "Completed", percent: "45%", color: "#2677f9" },
    { label: "In Progress", percent: "25%", color: "#20c997" },
    { label: "Scheduled", percent: "20%", color: "#ffb43b" },
    { label: "Cancelled", percent: "10%", color: "#ff6269" },
  ];

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-5 xl:gap-4">
      <div
        className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
        style={{
          background:
            "conic-gradient(#2677f9 0% 45%, #20c997 45% 70%, #ffb43b 70% 90%, #ff6269 90% 100%)",
        }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-bold text-slate-900">320</span>
          <span className="text-sm text-slate-500">Total</span>
        </div>
      </div>

      <div className="min-w-32 flex-1 space-y-3">
        {segments.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
            <span className="flex-1 text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.percent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodingChart() {
  const bars = [
    { label: "Easy", value: 80, color: "bg-emerald-300" },
    { label: "Medium", value: 60, color: "bg-blue-300" },
    { label: "Hard", value: 30, color: "bg-violet-300" },
  ];

  return (
    <div className="mt-7">
      <div className="relative h-36 pl-8">
        {[0, 20, 40, 60, 80, 100].map((n) => (
          <div key={n} className="absolute left-0 right-0 flex items-center" style={{ bottom: `${n}%` }}>
            <span className="w-7 -translate-y-1/2 text-xs text-slate-500">{n}</span>
            <div className="flex-1 border-t border-slate-100" />
          </div>
        ))}

        <div className="absolute inset-0 ml-10 flex items-end justify-around">
          {bars.map((bar) => (
            <div key={bar.label} className={`w-9 rounded-t-md ${bar.color}`} style={{ height: `${bar.value}%` }} />
          ))}
        </div>
      </div>

      <div className="ml-10 mt-2 flex justify-around">
        {bars.map((bar) => (
          <span key={bar.label} className="text-xs text-slate-500">{bar.label}</span>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last 6 Months");
  const [search, setSearch] = useState("");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");

        const response = await getAdminUsers();

        if (isMounted) {
          setUsers(response.data.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setUsersError(
            error.response?.data?.detail ||
              error.response?.data?.message ||
              "Unable to load users."
          );
        }
      } finally {
        if (isMounted) {
          setUsersLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError("");

        const response = await getAdminDashboardStats();

        if (isMounted) {
          setDashboardStats(response.data.data);
        }
      } catch (error) {
        if (isMounted) {
          setStatsError(
            error.response?.data?.message ||
              "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: dashboardStats?.total_users ?? 0,
      growth: "+12%",
      icon: Users,
      color: "blue",
      path: "M0 48 C18 24 25 36 42 26 S68 39 87 15 S112 5 120 0",
    },
    {
      title: "Total Interviews",
      value: dashboardStats?.total_interviews ?? 0,
      growth: "+18%",
      icon: Video,
      color: "purple",
      path: "M0 48 C18 35 25 25 42 32 S67 8 85 20 S105 3 120 0",
    },
    {
      title: "Coding Tests",
      value: dashboardStats?.total_coding_questions ?? 0,
      growth: "+25%",
      icon: Code2,
      color: "green",
      path: "M0 48 C18 26 28 35 43 25 S65 40 83 15 S105 7 120 0",
    },
    {
      title: "Resumes Uploaded",
      value: dashboardStats?.total_resumes ?? 0,
      growth: "+20%",
      icon: FileText,
      color: "orange",
      path: "M0 48 C18 30 28 35 44 24 S66 36 83 14 S105 6 120 0",
    },
  ];

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  
  const adminName = currentUser.first_name || "Admin";

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.is_active ? "Active" : "Inactive"}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  return (
    <AdminDashboardLayout activePage="Dashboard" search={search} setSearch={setSearch} adminName={adminName}>
        <main className="mx-auto max-w-[1800px] p-4 sm:p-6 xl:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-bold tracking-tight sm:text-[34px]">
                Welcome back, {adminName}! <FaHandPaper  className="inline-block text-amber-500" />
              </h2>
              <p className="mt-1 text-base text-slate-500 sm:text-lg">
                Here's an overview of your InterviewIQ platform.
              </p>
              {statsLoading && (
                <p className="mt-2 text-sm text-blue-600">Loading dashboard statistics...</p>
              )}
              {statsError && (
                <p role="alert" className="mt-2 text-sm text-red-600">{statsError}</p>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white bg-white/90 px-4 py-3 shadow-sm">
              <CalendarDays size={23} className="text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Today</p>
                <p className="text-sm text-slate-500">Oct 27, 2026 (Mon)</p>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const styles = {
                blue: { card: "border-blue-100/60 from-blue-50/70 to-white", icon: "bg-blue-100 text-blue-600" },
                purple: { card: "border-purple-100/60 from-purple-50/70 to-white", icon: "bg-purple-100 text-purple-600" },
                green: { card: "border-emerald-100/60 from-emerald-50/70 to-white", icon: "bg-emerald-100 text-emerald-600" },
                orange: { card: "border-orange-100/60 from-orange-50/70 to-white", icon: "bg-orange-100 text-orange-500" },
              }[stat.color];

              return (
                <div
                  key={stat.title}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${styles.card} p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-[28px] font-bold leading-8 tracking-tight">{stat.value}</p>
                      <p className="mt-1 text-sm text-slate-600">{stat.title}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <ArrowUpRight size={17} className="text-emerald-500" strokeWidth={3} />
                    <span className="text-base font-bold text-emerald-600">{stat.growth}</span>
                  </div>
                  <p className="pl-1 text-xs text-slate-500">from last month</p>

                  <div className="absolute bottom-4 right-4 opacity-90">
                    <MiniChart color={stat.color} path={stat.path} />
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 font-bold">
                  <ChartNoAxesColumn size={21} className="text-blue-600" />
                  User Growth
                </h2>
                <div className="relative">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 pr-7 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <GrowthChart />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-3 font-bold">
                  <Activity size={21} className="text-blue-600" />
                  Interview Status
                </h2>
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none">
                  <option>This Month</option>
                  <option>This Week</option>
                  <option>This Year</option>
                </select>
              </div>
              <InterviewChart />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-bold">
                  <ChartNoAxesColumn size={21} className="text-blue-600" />
                  <span>Coding Test Results</span>
                </h2>
                <select className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600 outline-none">
                  <option>This Month</option>
                  <option>This Week</option>
                  <option>This Year</option>
                </select>
              </div>
              <CodingChart />
            </div>
          </section>

          <section className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-12">
            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 2xl:col-span-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 font-bold">
                  <Users size={21} className="text-blue-600" />
                  Recent Users
                </h2>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View All <ArrowRight size={17} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[570px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="rounded-l-lg px-3 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Email</th>
                      <th className="px-3 py-3 font-medium">Joined At</th>
                      <th className="rounded-r-lg px-3 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : usersError ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-red-600">
                          {usersError}
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.slice(0, 5).map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                        >
                          <td className="px-3 py-3 font-medium text-slate-800">
                            {user.name || "Unnamed User"}
                          </td>

                          <td className="px-3 py-3 text-slate-500">
                            {user.email}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                            {user.date_joined
                              ? new Date(user.date_joined).toLocaleDateString("en-IN")
                              : "—"}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                user.is_active
                                  ? "bg-emerald-100/80 text-emerald-700"
                                  : "bg-amber-100/80 text-amber-700"
                              }`}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                          No users match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 2xl:col-span-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 font-bold">
                  <Clock size={21} className="text-blue-600" />
                  Recent Activity
                </h2>
                <button
                  onClick={() => navigate("/admin/reports")}
                  className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View All <ArrowRight size={17} />
                </button>
              </div>

              <div>
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  const colorStyles = {
                    green: "bg-emerald-100 text-emerald-600",
                    purple: "bg-purple-100 text-purple-600",
                    blue: "bg-blue-100 text-blue-600",
                    orange: "bg-orange-100 text-orange-600",
                    pink: "bg-rose-100 text-rose-600",
                  };

                  return (
                    <div key={activity.title} className="flex items-center gap-3 border-b border-slate-50 py-2 last:border-0">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colorStyles[activity.color]}`}>
                        <Icon size={21} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{activity.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{activity.subtitle}</p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-slate-500">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <footer className="py-6 text-center text-xs text-slate-400">
            © 2026 InterviewIQ AI · Admin Panel
          </footer>
        </main>

    </AdminDashboardLayout>
  );
}

export default AdminDashboard;
