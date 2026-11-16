
import { useMemo, useState } from "react";
import {
  Home,
  Code2,
  Upload,
  CheckCircle2,
  CircleX,
  Users,
  CalendarDays,
  Download,
  TrendingUp,
  Target,
  AlertTriangle,
  BarChart3,
  ChevronDown,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

// Sample report data — replace with API data when the reports endpoint is ready.
const reportData = {
  totalQuestions: 120,
  totalSubmissions: 1842,
  accepted: 1276,
  rejected: 566,
  uniqueUsers: 438,

  submissionTrend: [
    { label: "Oct 5", value: 25 },
    { label: "Oct 8", value: 38 },
    { label: "Oct 11", value: 35 },
    { label: "Oct 14", value: 52 },
    { label: "Oct 17", value: 70 },
    { label: "Oct 20", value: 65 },
    { label: "Oct 23", value: 95 },
    { label: "Oct 26", value: 82 },
    { label: "Oct 29", value: 67 },
    { label: "Nov 1", value: 90 },
    { label: "Nov 3", value: 112 },
    { label: "Nov 3", value: 90 },
  ],

  difficulty: [
    { label: "Easy", count: 52, color: "#22c55e" },
    { label: "Medium", count: 40, color: "#facc15" },
    { label: "Hard", count: 28, color: "#ff5b65" },
  ],

  mostAttempted: [
    { title: "Two Sum", attempts: 318, success: "78.3%" },
    { title: "Reverse a String", attempts: 276, success: "71.0%" },
    { title: "Valid Palindrome", attempts: 241, success: "65.6%" },
    { title: "Merge Intervals", attempts: 205, success: "62.4%" },
    { title: "Two Sum II", attempts: 198, success: "59.1%" },
  ],

  lowestSuccess: [
    { title: "Trapping Rain Water", attempts: 142, success: "28.2%" },
    { title: "Largest Rectangle in Histogram", attempts: 137, success: "32.1%" },
    { title: "Word Ladder", attempts: 118, success: "34.7%" },
    { title: "Median of Two Sorted Arrays", attempts: 110, success: "36.4%" },
    { title: "N-Queens", attempts: 96, success: "37.5%" },
  ],

  languages: [
    { name: "Python", percentage: 52.6, color: "bg-blue-600", icon: "🐍" },
    { name: "Java", percentage: 18.9, color: "bg-purple-500", icon: "☕" },
    { name: "JavaScript", percentage: 15.4, color: "bg-yellow-400", icon: "JS" },
    { name: "C++", percentage: 7.8, color: "bg-sky-400", icon: "C++" },
    { name: "Others", percentage: 5.3, color: "bg-slate-400", icon: "•••" },
  ],

  performance: [
    { label: "Top Performers", value: "42", note: "(≥ 80% success)", icon: "trophy" },
    { label: "Active Users", value: "438", note: "(≥ 1 submission)", icon: "users" },
    { label: "Avg. Success Rate", value: "69.3%", note: "", icon: "code" },
    { label: "Avg. Execution Time", value: "124 ms", note: "", icon: "clock" },
  ],

  outcomes: [
    { label: "Oct 5", accepted: 18, rejected: 12 },
    { label: "Oct 8", accepted: 28, rejected: 18 },
    { label: "Oct 11", accepted: 30, rejected: 19 },
    { label: "Oct 14", accepted: 43, rejected: 19 },
    { label: "Oct 17", accepted: 50, rejected: 27 },
    { label: "Oct 20", accepted: 48, rejected: 28 },
    { label: "Oct 23", accepted: 58, rejected: 31 },
    { label: "Oct 26", accepted: 53, rejected: 30 },
    { label: "Oct 29", accepted: 44, rejected: 31 },
    { label: "Oct 31", accepted: 65, rejected: 35 },
    { label: "Nov 1", accepted: 80, rejected: 34 },
    { label: "Nov 3", accepted: 60, rejected: 30 },
  ],
};

function StatCard({ title, value, note, icon: Icon, color }) {
  const styles = {
    blue: "border-blue-100 bg-gradient-to-r from-blue-50 to-white text-blue-600",
    green: "border-emerald-100 bg-gradient-to-r from-emerald-50 to-white text-emerald-600",
    red: "border-rose-100 bg-gradient-to-r from-rose-50 to-white text-rose-600",
    purple: "border-violet-100 bg-gradient-to-r from-violet-50 to-white text-violet-600",
  };

  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 ${styles[color]}`}>
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/80">
        <Icon size={32} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-slate-950">
            {value}
          </span>
          {note && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
              {note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-xl border border-blue-100 bg-white p-3 shadow-sm ${className}`}>
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-slate-950">
        {Icon && <Icon size={22} className="shrink-0 text-blue-600" />}
        {title}
      </h2>
      {children}
    </section>
  );
}

function DoughnutChart({ data, total, centerLabel }) {
  let current = 0;

  const gradient = data
    .map((item) => {
      const start = current;
      current += (item.count / total) * 100;
      return `${item.color} ${start}% ${current}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 py-1">
      <div
        className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-xl font-extrabold text-slate-950">{total.toLocaleString()}</p>
            <p className="text-xs font-medium text-slate-700">{centerLabel}</p>
          </div>
        </div>
      </div>

      <div className="min-w-[145px] space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2 font-semibold text-slate-800">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="whitespace-nowrap font-semibold text-slate-700">
              {item.count} ({((item.count / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmissionsTrendChart({ data }) {
  const max = 125;
  const width = 520;
  const height = 175;
  const left = 36;
  const right = 8;
  const top = 12;
  const bottom = 30;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const points = data.map((item, index) => ({
    x: left + (index / (data.length - 1)) * chartWidth,
    y: top + chartHeight - (item.value / max) * chartHeight,
    ...item,
  }));

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${top + chartHeight} ${line} ${left + chartWidth},${top + chartHeight}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Submissions trend chart">
        <defs>
          <linearGradient id="submissionArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100, 125].map((value) => {
          const y = top + chartHeight - (value / max) * chartHeight;
          return (
            <g key={value}>
              <line x1={left} y1={y} x2={width - right} y2={y} stroke="#dbe4f0" strokeWidth="1" />
              <text x="3" y={y + 4} fontSize="11" fill="#334155">{value}</text>
            </g>
          );
        })}

        <polygon points={area} fill="url(#submissionArea)" />
        <polyline points={line} fill="none" stroke="#155eef" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="white" stroke="#155eef" strokeWidth="2.5" />
            <text
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="9"
              fill="#334155"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function OutcomeChart({ data }) {
  const max = 125;

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-green-500" /> Accepted
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-400" /> Rejected
        </span>
      </div>

      <div className="flex h-36 items-end justify-between gap-1 border-b border-slate-200 px-1">
        {data.map((item, index) => (
          <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
            <div className="flex w-full max-w-6 flex-col justify-end">
              <div
                className="rounded-t-sm bg-red-400"
                style={{ height: `${(item.rejected / max) * 115}px` }}
              />
              <div
                className="bg-green-500"
                style={{ height: `${(item.accepted / max) * 115}px` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between gap-1">
        {data.map((item, index) => (
          <span key={index} className="flex-1 text-center text-[9px] text-slate-600">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DataTable({ rows, type }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-xs">
        <thead>
          <tr className="bg-[#edf1fc] text-slate-900">
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Question</th>
            <th className="px-3 py-2 text-right">Attempts</th>
            <th className="px-3 py-2 text-right">Success Rate</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.title} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2 font-semibold">{index + 1}</td>
              <td className="px-3 py-2 font-semibold text-slate-900">{row.title}</td>
              <td className="px-3 py-2 text-right">{row.attempts}</td>
              <td className="px-3 py-2 text-right">
                <span
                  className={`rounded-full px-2 py-1 font-bold ${
                    type === "low"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {row.success}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerformanceIcon({ type }) {
  if (type === "trophy") return <Target size={27} />;
  if (type === "users") return <Users size={27} />;
  if (type === "clock") return <BarChart3 size={27} />;
  return <Code2 size={27} />;
}

export default function AdminCodingReports() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const stats = useMemo(() => {
    const acceptedPercentage = (
      (reportData.accepted / reportData.totalSubmissions) * 100
    ).toFixed(1);

    const rejectedPercentage = (
      (reportData.rejected / reportData.totalSubmissions) * 100
    ).toFixed(1);

    return [
      {
        title: "Total Questions",
        value: reportData.totalQuestions.toLocaleString(),
        note: "↑ +12%",
        icon: Code2,
        color: "blue",
      },
      {
        title: "Total Submissions",
        value: reportData.totalSubmissions.toLocaleString(),
        note: "↑ +18%",
        icon: Upload,
        color: "green",
      },
      {
        title: "Accepted",
        value: reportData.accepted.toLocaleString(),
        note: `${acceptedPercentage}%`,
        icon: CheckCircle2,
        color: "blue",
      },
      {
        title: "Rejected",
        value: reportData.rejected.toLocaleString(),
        note: `${rejectedPercentage}%`,
        icon: CircleX,
        color: "red",
      },
      {
        title: "Unique Users",
        value: reportData.uniqueUsers.toLocaleString(),
        note: "",
        icon: Users,
        color: "purple",
      },
    ];
  }, []);

  const exportReport = () => {
    const rows = [
      ["Coding Practice Report"],
      ["Date Range", dateRange],
      [],
      ["Metric", "Value"],
      ["Total Questions", reportData.totalQuestions],
      ["Total Submissions", reportData.totalSubmissions],
      ["Accepted", reportData.accepted],
      ["Rejected", reportData.rejected],
      ["Unique Users", reportData.uniqueUsers],
      [],
      ["Most Attempted Questions"],
      ["Question", "Attempts", "Success Rate"],
      ...reportData.mostAttempted.map((item) => [
        item.title,
        item.attempts,
        item.success,
      ]),
      [],
      ["Lowest Success Rate Questions"],
      ["Question", "Attempts", "Success Rate"],
      ...reportData.lowestSuccess.map((item) => [
        item.title,
        item.attempts,
        item.success,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "coding-practice-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminDashboardLayout activePage="Coding Practice" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-3 p-3 sm:p-5 xl:p-6">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Home size={17} />
          <span>/</span>
          <span>Coding Practice</span>
          <span>/</span>
          <span className="font-bold text-slate-950">Reports</span>
        </div>

        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"></div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold">
              <CalendarDays size={19} className="text-slate-700" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="max-w-[130px] bg-transparent outline-none"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
              <ChevronDown size={15} />
            </label>

            <button
              onClick={exportReport}
              className="flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
            >
              <Download size={19} />
              Export Report
            </button>
          </div>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* Main charts */}
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_1fr_1fr]">
          <Panel title="Submissions Trend" icon={TrendingUp}>
            <SubmissionsTrendChart data={reportData.submissionTrend} />
          </Panel>

          <Panel title="Questions by Difficulty" icon={Target}>
            <DoughnutChart
              data={reportData.difficulty}
              total={reportData.totalQuestions}
              centerLabel="Questions"
            />
          </Panel>

          <Panel title="Submissions by Status" icon={CheckCircle2}>
            <DoughnutChart
              data={[
                {
                  label: "Accepted",
                  count: reportData.accepted,
                  color: "#22c55e",
                },
                {
                  label: "Rejected",
                  count: reportData.rejected,
                  color: "#ff5b65",
                },
              ]}
              total={reportData.totalSubmissions}
              centerLabel="Submissions"
            />
          </Panel>
        </section>

        {/* Question analytics and language usage */}
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1.1fr_1.1fr_1.1fr]">
          <Panel title="Most Attempted Questions" icon={Target}>
            <DataTable rows={reportData.mostAttempted} type="high" />
          </Panel>

          <Panel title="Lowest Success Rate Questions" icon={AlertTriangle}>
            <DataTable rows={reportData.lowestSuccess} type="low" />
          </Panel>

          <Panel title="Programming Languages Usage" icon={Code2}>
            <div className="space-y-4 pt-1">
              {reportData.languages.map((language) => (
                <div key={language.name} className="flex items-center gap-3">
                  <span className="grid w-7 shrink-0 place-items-center text-sm font-bold">
                    {language.icon}
                  </span>

                  <span className="w-[68px] shrink-0 text-xs font-semibold text-slate-800">
                    {language.name}
                  </span>

                  <div className="h-3 flex-1 overflow-hidden rounded bg-slate-200">
                    <div
                      className={`h-full rounded ${language.color}`}
                      style={{ width: `${language.percentage}%` }}
                    />
                  </div>

                  <span className="w-12 shrink-0 text-right text-xs font-semibold text-slate-800">
                    {language.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* User performance and outcomes */}
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.05fr]">
          <Panel title="User Performance Overview" icon={Users}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {reportData.performance.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-4 text-center"
                >
                  <div className="mb-2 text-blue-600">
                    <PerformanceIcon type={item.icon} />
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-950">
                    {item.value}
                  </p>

                  {item.note && (
                    <p className="mt-1 text-[10px] text-slate-600">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Submission Outcomes" icon={BarChart3}>
            <OutcomeChart data={reportData.outcomes} />
          </Panel>
        </section>

        <footer className="py-3 text-center text-xs text-slate-400">
          © 2026 InterviewIQ AI · Coding Practice Reports
        </footer>
      </main>
    </AdminDashboardLayout>
  );
}
