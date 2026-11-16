import { useEffect ,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Home, FileCode2, CirclePlus, Upload, FlaskConical,
  ChartNoAxesColumn, CalendarDays, ChevronDown, Search, Trophy,
  Clock3, Users, CheckCircle2, XCircle, TrendingUp
} from "lucide-react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { getCodingQuestionStats } from "../../../services/adminService";

// Static preview values. Connect these cards and charts to your API later.
const difficulty = [
  { name: "Easy", count: 52, percent: "43.3%", color: "#22c55e" },
  { name: "Medium", count: 40, percent: "33.3%", color: "#fbbf24" },
  { name: "Hard", count: 28, percent: "23.4%", color: "#fb6471" },
];

const mostAttempted = [
  { title: "Two Sum", attempts: 324 },
  { title: "Reverse a String", attempts: 268 },
  { title: "Valid Palindrome", attempts: 261 },
  { title: "Merge Intervals", attempts: 198 },
  { title: "Two Sum II", attempts: 187 },
];

const recentSubmissions = [
  { name: "John Doe", initial: "J", question: "Two Sum", status: "Accepted", time: "2 min ago", color: "bg-fuchsia-500" },
  { name: "Sarah Smith", initial: "S", question: "Valid Palindrome", status: "Rejected", time: "5 min ago", color: "bg-violet-500" },
  { name: "Mark Wilson", initial: "M", question: "Reverse a String", status: "Accepted", time: "8 min ago", color: "bg-purple-700" },
  { name: "Alice Brown", initial: "A", question: "Merge Intervals", status: "Accepted", time: "12 min ago", color: "bg-indigo-500" },
  { name: "Rahul Menon", initial: "R", question: "Two Sum II", status: "Rejected", time: "18 min ago", color: "bg-orange-500" },
];

const trend = [62, 82, 108, 101, 135, 116, 124, 110, 140, 153, 138, 172, 202, 176, 166, 188];
const trendLabels = ["Oct 28", "Oct 30", "Nov 1", "Nov 3", "Nov 5", "Nov 7", "Nov 9", "Nov 11", "Nov 13", "Nov 15", "Nov 17", "Nov 19", "Nov 21", "Nov 23", "Nov 25"];

function StatCard({ title, value, icon: Icon, tone, growth, subtitle }) {
  const tones = {
    blue: "border-blue-100 bg-gradient-to-br from-blue-50 to-white text-blue-600",
    green: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white text-emerald-600",
    yellow: "border-amber-100 bg-gradient-to-br from-amber-50 to-white text-amber-600",
    red: "border-rose-100 bg-gradient-to-br from-rose-50 to-white text-rose-600",
    purple: "border-violet-100 bg-gradient-to-br from-violet-50 to-white text-violet-600",
  };
  return (
    <div className={`flex min-h-[86px] items-center gap-4 rounded-2xl border p-3.5 shadow-sm ${tones[tone]}`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-current/10"><Icon size={29} /></div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="text-[27px] font-extrabold leading-none text-slate-950">{value}</p>
          {growth && <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">↑ {growth}</span>}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-[17px] font-extrabold text-slate-900"><Icon size={21} className="text-blue-600" />{title}</h3>
      {children}
    </section>
  );
}

function TrendChart() {
  const points = trend.map((value, i) => {
    const x = 38 + (i * 640) / (trend.length - 1);
    const y = 158 - (value / 250) * 135;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className="h-[190px] w-full">
      <svg viewBox="0 0 710 190" className="h-full w-full" role="img" aria-label="Submissions trend chart">
        <defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity=".28" /><stop offset="100%" stopColor="#2563eb" stopOpacity=".02" /></linearGradient></defs>
        {[0, 50, 100, 150, 200, 250].map((n) => {
          const y = 158 - (n / 250) * 135;
          return <g key={n}><line x1="38" x2="680" y1={y} y2={y} stroke="#dbe4f2" /><text x="27" y={y + 4} textAnchor="end" fontSize="12" fill="#334155">{n}</text></g>;
        })}
        <polygon points={`38,158 ${points} 678,158`} fill="url(#trendFill)" />
        <polyline points={points} fill="none" stroke="#1457f5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {trend.map((value, i) => {
          const x = 38 + (i * 640) / (trend.length - 1);
          const y = 158 - (value / 250) * 135;
          return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#1457f5" strokeWidth="2.5" />;
        })}
        {trendLabels.map((label, i) => {
          const x = 38 + (i * 640) / (trendLabels.length - 1);
          return <text key={label} x={x} y="181" textAnchor="middle" fontSize="10" fill="#334155">{label}</text>;
        })}
      </svg>
    </div>
  );
}

function DifficultyDonut({ stats }) {
  const total = Number(stats.total_questions) || 0;
  const easy = Number(stats.easy_questions) || 0;
  const medium = Number(stats.medium_questions) || 0;
  const hard = Number(stats.hard_questions) || 0;

  const easyPercent = total ? (easy / total) * 100 : 0;
  const mediumPercent = total ? (medium / total) * 100 : 0;
  const hardPercent = total ? (hard / total) * 100 : 0;

  const difficulty = [
    {
      name: "Easy",
      count: easy,
      percent: easyPercent.toFixed(1),
      color: "#22c55e",
    },
    {
      name: "Medium",
      count: medium,
      percent: mediumPercent.toFixed(1),
      color: "#fbbf24",
    },
    {
      name: "Hard",
      count: hard,
      percent: hardPercent.toFixed(1),
      color: "#fb6471",
    },
  ];

  const easyEnd = easyPercent;
  const mediumEnd = easyPercent + mediumPercent;

  return (
    <div className="flex min-h-[190px] flex-wrap items-center justify-center gap-5">
      <div
        className="relative flex h-40 w-40 items-center justify-center rounded-full"
        style={{
          background: total
            ? `conic-gradient(
                #22c55e 0% ${easyEnd}%,
                #fbbf24 ${easyEnd}% ${mediumEnd}%,
                #fb6471 ${mediumEnd}% 100%
              )`
            : "#e5e7eb",
        }}
      >
        <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-extrabold text-slate-950">
            {total}
          </span>
          <span className="text-xs text-slate-600">Questions</span>
        </div>
      </div>

      <div className="space-y-3">
        {difficulty.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: item.color }}
            />
            <b className="text-slate-800">{item.name}</b>
            <span className="text-slate-600">
              {item.count} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status === "Accepted" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>{status}</span>;
}

export default function AdminCodingOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_questions: 0,
    easy_questions: 0,
    medium_questions: 0,
    hard_questions: 0,
  });

  const [period, setPeriod] = useState("Last 30 Days");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredQuestions = useMemo(() => mostAttempted.filter((q) => q.title.toLowerCase().includes(search.toLowerCase())), [search]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response  = await getCodingQuestionStats();
        setStats(response.data || response);
      } catch (error) {
        console.error("Failed to load coding question statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    ["Overview", Home, "/admin/coding/overview"],
    ["All Questions", FileCode2, "/admin/coding/all-questions"],
    ["Add Question", CirclePlus, "/admin/coding/add-question"],
    ["Bulk Upload", Upload, "/admin/coding/bulk-upload"],
    ["Submissions", Code2, "/admin/coding/submissions"],
    ["Reports", ChartNoAxesColumn, "/admin/coding/reports"],
  ];

  return (
    <AdminDashboardLayout activePage="Coding Practice" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-4 p-4 sm:p-6 xl:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Home size={17} /><span>/</span><span>Coding Practice</span><span>/</span><b className="text-slate-900">Overview</b></div>
          <div className="relative">
            <button type="button" onClick={() => setPeriodOpen((v) => !v)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"><CalendarDays size={17} />{period}<ChevronDown size={16} /></button>
            {periodOpen && <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border bg-white shadow-lg">{["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"].map((v) => <button type="button" key={v} onClick={() => { setPeriod(v); setPeriodOpen(false); }} className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 ${period === v ? "font-bold text-blue-700" : "text-slate-700"}`}>{v}</button>)}</div>}
          </div>
        </div>

        <div className="flex items-center gap-4"></div>

        {/* Page navigation while the shared admin sidebar is being updated */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
          {navItems.map(([label, Icon, path]) => <button type="button" key={label} onClick={() => navigate(path)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${label === "Overview" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}><Icon size={16} />{label}</button>)}
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Questions" value={stats.total_questions} icon={Code2} tone="blue" growth="12%" />
          <StatCard title="Easy" value={stats.easy_questions} icon={Code2} tone="green" growth="8%" />
          <StatCard title="Medium" value={stats.medium_questions} icon={ChartNoAxesColumn} tone="yellow" growth="15%" />
          <StatCard title="Hard" value={stats.hard_questions} icon={Trophy} tone="red" growth="4%" />
          <StatCard title="Total Submissions" value="1,842" icon={FileCode2} tone="blue" growth="18%" />
          <StatCard title="Accepted" value="1,276" icon={CheckCircle2} tone="green" subtitle="69.3%" />
          <StatCard title="Rejected" value="566" icon={XCircle} tone="red" subtitle="30.7%" />
          <StatCard title="Active Users" value="438" icon={Users} tone="purple" growth="9%" />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
          <Panel title="Submissions Trend" icon={TrendingUp}><TrendChart /></Panel>
          <Panel title="Questions by Difficulty" icon={ChartNoAxesColumn}>
            <DifficultyDonut stats={stats} />
          </Panel>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.2fr]">
          <Panel title="Most Attempted Questions" icon={Trophy}>
            <div className="relative mb-3"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[330px] text-sm"><thead><tr className="bg-slate-100 text-left text-xs text-slate-700"><th className="rounded-l-lg px-3 py-2">#</th><th className="px-3 py-2">Question</th><th className="rounded-r-lg px-3 py-2 text-right">Attempts</th></tr></thead><tbody>{filteredQuestions.map((q, i) => <tr key={q.title} className="border-b border-slate-100 last:border-0"><td className="px-3 py-2.5"><span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">{i + 1}</span></td><td className="px-3 py-2.5 font-semibold text-slate-900">{q.title}</td><td className="px-3 py-2.5 text-right text-slate-600">{q.attempts} attempts</td></tr>)}{filteredQuestions.length === 0 && <tr><td colSpan="3" className="px-3 py-6 text-center text-slate-500">No matching questions.</td></tr>}</tbody></table></div>
          </Panel>
          <Panel title="Recent Submissions" icon={Clock3}>
            <div className="overflow-x-auto"><table className="w-full min-w-[470px] text-sm"><thead><tr className="bg-slate-100 text-left text-xs text-slate-700"><th className="rounded-l-lg px-3 py-2">#</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Question</th><th className="px-3 py-2">Status</th><th className="rounded-r-lg px-3 py-2 text-right">Submitted At</th></tr></thead><tbody>{recentSubmissions.map((s, i) => <tr key={`${s.name}-${s.time}`} className="border-b border-slate-100 last:border-0"><td className="px-3 py-2.5 text-slate-500">{i + 1}</td><td className="px-3 py-2.5"><div className="flex items-center gap-2 whitespace-nowrap"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${s.color}`}>{s.initial}</span><span className="font-semibold text-slate-800">{s.name}</span></div></td><td className="px-3 py-2.5 font-medium text-slate-800">{s.question}</td><td className="px-3 py-2.5"><StatusPill status={s.status} /></td><td className="whitespace-nowrap px-3 py-2.5 text-right text-slate-500">{s.time}</td></tr>)}</tbody></table></div>
          </Panel>
        </section>
      </main>
    </AdminDashboardLayout>
  );
}
