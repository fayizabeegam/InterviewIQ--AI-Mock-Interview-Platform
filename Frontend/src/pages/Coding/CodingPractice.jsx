
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";
import {
  Code2,
  Search,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  Trophy,
  Sparkles,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  LoaderCircle,
  CircleAlert,
} from "lucide-react";

import UserLayout from "../../components/layout/UserLayout";
import { fetchCodingQuestions } from "../../services/codingService";
import { fetchCodingQuestionDetail } from "../../services/codingService";

const difficultyStyles = {
  EASY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  HARD: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

const topicStyles = [
  "border-blue-500/30 bg-blue-500/10 text-blue-400",
  "border-violet-500/30 bg-violet-500/10 text-violet-400",
  "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
];

const CodingPractice = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCodingQuestions();
        const questions = Array.isArray(data)
          ? data
          : data.results || [];

        if (!cancelled) setProblems(questions);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "Unable to load coding challenges."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProblems();

    return () => {
      cancelled = true;
    };
  }, []);

  const topics = useMemo(
    () => [
      ...new Set(
        problems
          .map((problem) => problem.skill_name || problem.skill?.name)
          .filter(Boolean)
      ),
    ].sort(),
    [problems]
  );

  const filteredProblems = useMemo(() => {
    const result = problems.filter((problem) => {
      const title = (problem.title || "").toLowerCase();
      const skill = (
        problem.skill_name ||
        problem.skill?.name ||
        "General"
      ).toLowerCase();
      const statement = (
        problem.problem_statement || ""
      ).toLowerCase();

      const matchesSearch =
        title.includes(search.toLowerCase()) ||
        skill.includes(search.toLowerCase()) ||
        statement.includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty?.toUpperCase() === difficulty;

      const matchesTopic =
        topic === "All" ||
        (problem.skill_name || problem.skill?.name || "") === topic;

      return matchesSearch && matchesDifficulty && matchesTopic;
    });

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "difficulty") {
      const rank = { EASY: 1, MEDIUM: 2, HARD: 3 };
      result.sort(
        (a, b) =>
          (rank[a.difficulty?.toUpperCase()] || 4) -
          (rank[b.difficulty?.toUpperCase()] || 4)
      );
    }

    return result;
  }, [problems, search, difficulty, topic, sortBy]);

  const easyCount = problems.filter(
    (p) => p.difficulty?.toUpperCase() === "EASY"
  ).length;

  const mediumCount = problems.filter(
    (p) => p.difficulty?.toUpperCase() === "MEDIUM"
  ).length;

  const hardCount = problems.filter(
    (p) => p.difficulty?.toUpperCase() === "HARD"
  ).length;

  const stats = [
    {
      label: "Total Problems",
      count: problems.length,
      description: "Challenges available",
      icon: Sparkles,
      color: "text-emerald-400",
      iconBg: "border-emerald-500/30 bg-emerald-500/10",
    },
    {
      label: "Easy",
      count: easyCount,
      description: "Build your basics",
      icon: Code2,
      color: "text-teal-300",
      iconBg: "border-emerald-500/30 bg-emerald-500/10",
    },
    {
      label: "Medium",
      count: mediumCount,
      description: "Strengthen your skills",
      icon: ChartNoAxesCombined,
      color: "text-amber-400",
      iconBg: "border-amber-500/30 bg-amber-500/10",
    },
    {
      label: "Hard",
      count: hardCount,
      description: "Challenge yourself",
      icon: Trophy,
      color: "text-rose-400",
      iconBg: "border-rose-500/30 bg-rose-500/10",
    },
  ];

  const handleSolve = (problem) => {
    navigate(`/coding-practice/${problem.id}`);
    console.log("Selected coding question:", problem.id);
  };

  return (
    <UserLayout backgroundClass="bg-[#06101f]">
      <div className="min-h-screen bg-[#06101f] text-slate-100">
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
          {/* Hero */}
          <section className="relative mb-8 overflow-hidden rounded-3xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_35%,rgba(37,99,235,0.17),transparent_40%)]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="py-2">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-sky-400">
                  <Code2 size={19} />
                  InterviewIQ Practice Arena
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight !text-white sm:text-5xl lg:text-[54px]">
                  Coding{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    Practice
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Solve real-world coding problems, improve your
                  problem-solving skills, and get ready for technical
                  interviews.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <Feature
                    icon={Code2}
                    title="Curated Problems"
                    subtitle="Topic-wise challenges"
                    color="blue"
                  />
                  <Feature
                    icon={ChartNoAxesColumnIncreasing}
                    title="Multiple Difficulties"
                    subtitle="Easy, Medium, Hard"
                    color="cyan"
                  />
                  <Feature
                    icon={ChartNoAxesCombined}
                    title="Track Progress"
                    subtitle="Monitor your growth"
                    color="purple"
                  />
                  <Feature
                    icon={Trophy}
                    title="Interview Ready"
                    subtitle="Prepare with confidence"
                    color="amber"
                  />
                </div>
              </div>

              {/* Decorative coding illustration */}
              <div className="relative hidden h-64 items-center justify-center lg:flex">
                <div className="absolute h-56 w-56 rounded-full border border-blue-500/20 bg-blue-500/5 shadow-[0_0_80px_rgba(37,99,235,0.12)]" />
                <div className="absolute h-44 w-44 rounded-full border border-indigo-400/30" />

                <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-blue-400/40 bg-gradient-to-br from-blue-500/25 to-indigo-600/20 shadow-2xl shadow-blue-950">
                  <Code2 size={76} strokeWidth={1.4} className="text-sky-300" />
                  <span className="absolute -right-4 top-2 rounded-xl border border-blue-400/30 bg-[#101c32] px-3 py-2 text-xs font-semibold text-sky-300">
                    Practice
                  </span>
                  <span className="absolute -bottom-3 -left-7 rounded-xl border border-indigo-400/30 bg-[#101c32] px-3 py-2 text-xs font-semibold text-indigo-300">
                    {"{ }"} Solve
                  </span>
                </div>

                <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_18px_#3b82f6]" />
                <div className="absolute bottom-7 left-9 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_18px_#818cf8]" />
                <div className="absolute right-12 bottom-3 h-1.5 w-1.5 rounded-full bg-sky-400" />
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#101d31] to-[#0b1728] p-5 transition hover:border-blue-500/30"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${item.iconBg}`}
                  >
                    <Icon size={25} className={item.color} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className={`mt-1 text-3xl font-bold ${item.color}`}>
                      {item.count}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Search and filters */}
          <section className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_165px_185px_155px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search problems, topics or keywords..."
                className="w-full rounded-xl border border-slate-700 bg-[#0c192b] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            <FilterSelect
              value={topic}
              onChange={setTopic}
              icon={ChevronDown}
            >
              <option value="All">All Topics</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={difficulty}
              onChange={setDifficulty}
              icon={ChevronDown}
            >
              <option value="All">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </FilterSelect>

            <FilterSelect
              value={sortBy}
              onChange={setSortBy}
              icon={SlidersHorizontal}
            >
              <option value="default">Sort by</option>
              <option value="title">Problem name</option>
              <option value="difficulty">Difficulty</option>
            </FilterSelect>
          </section>

          {/* Challenges table */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1728]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Coding Challenges
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Find your next challenge and strengthen your skills.
                </p>
              </div>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300">
                {filteredProblems.length} problems
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#101d31] text-xs text-slate-400">
                  <tr>
                    <th className="w-14 px-5 py-4 font-medium">#</th>
                    <th className="px-5 py-4 font-medium">Problem</th>
                    <th className="px-5 py-4 font-medium">Topic</th>
                    <th className="px-5 py-4 font-medium">Difficulty</th>
                    <th className="px-5 py-4 font-medium">Language</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/90">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <LoaderCircle className="mx-auto mb-3 animate-spin text-blue-400" size={25} />
                        <p className="text-sm text-slate-400">
                          Loading coding challenges...
                        </p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <CircleAlert className="mx-auto mb-3 text-rose-400" size={25} />
                        <p className="text-sm text-rose-300">{error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                          Try again
                        </button>
                      </td>
                    </tr>
                  ) : filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <Code2 className="mx-auto mb-3 text-slate-500" size={28} />
                        <p className="font-medium text-slate-300">
                          No coding challenges found
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Try changing your search or filters, or add questions in Django Admin.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => {
                      const level = problem.difficulty?.toUpperCase() || "EASY";
                      const skill =
                        problem.skill_name ||
                        problem.skill?.name ||
                        "General";

                      return (
                        <tr
                          key={problem.id}
                          className="transition hover:bg-blue-500/[0.04]"
                        >
                          <td className="px-5 py-4 text-sm text-slate-400">
                            {index + 1}
                          </td>

                          <td className="max-w-[400px] px-5 py-3">
                            <p className="font-semibold text-slate-100">
                              {problem.title}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                              {problem.problem_statement || "Open this challenge to view its description."}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs ${topicStyles[index % topicStyles.length]}`}
                            >
                              {skill}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${difficultyStyles[level] || difficultyStyles.EASY}`}
                            >
                              {level.charAt(0) + level.slice(1).toLowerCase()}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-300">
                            {problem.programming_language || "PYTHON"}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleSolve(problem)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                            >
                              Solve
                              <ArrowRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-5 text-center text-xs text-slate-600">
            Practice consistently. Improve your problem-solving skills one challenge at a time.
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

function Feature({ icon: Icon, title, subtitle, color }) {
  const colors = {
    blue: "border-blue-500/25 bg-blue-500/10 text-blue-400",
    cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-400",
    purple: "border-violet-500/25 bg-violet-500/10 text-violet-400",
    amber: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${colors[color]}`}
      >
        <Icon size={23} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, icon: Icon, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-700 bg-[#0c192b] py-3.5 pl-4 pr-10 text-sm text-slate-200 outline-none transition hover:border-slate-600 focus:border-blue-500"
      >
        {children}
      </select>
      <Icon
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

export default CodingPractice;
