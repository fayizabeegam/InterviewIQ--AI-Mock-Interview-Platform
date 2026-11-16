import React, { useMemo, useState } from "react";
import {
  Home,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  CircleCheck,
  CircleX,
  Users,
  Search,
  RotateCcw,
  Eye,
  Layers,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

// Demo data for UI development.
// Connect this to your submissions API when the backend endpoint is ready.
const initialSubmissions = [
  {
    id: 1,
    user: "John Doe",
    initial: "J",
    color: "bg-fuchsia-500",
    question: "Two Sum",
    language: "Python",
    result: "Accepted",
    passed: "4 / 4",
    time: "86 ms",
    memory: "14.2 MB",
    submitted: "Nov 3, 2026 5:32 PM",
    code: `def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
    tests: [
      {
        name: "Test case 1",
        input: "[2, 7, 11, 15], target = 9",
        expected: "[0, 1]",
        actual: "[0, 1]",
        status: "Passed",
      },
      {
        name: "Test case 2",
        input: "[3, 2, 4], target = 6",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
      },
    ],
    feedback:
      "Good use of a hash map. The solution achieves O(n) time complexity and handles the expected cases.",
  },
  {
    id: 2,
    user: "Sarah Smith",
    initial: "S",
    color: "bg-pink-500",
    question: "Reverse a String",
    language: "Python",
    result: "Rejected",
    passed: "1 / 3",
    time: "120 ms",
    memory: "18.6 MB",
    submitted: "Nov 3, 2026 5:28 PM",
    code: `def reverse_string(text):
    result = ""
    for char in text:
        result = char + result
    return result`,
    tests: [
      {
        name: "Test case 1",
        input: '"hello"',
        expected: '"olleh"',
        actual: '"olleh"',
        status: "Passed",
      },
      {
        name: "Test case 2",
        input: '"InterviewIQ"',
        expected: '"QIw..."',
        actual: '"QIw..."',
        status: "Passed",
      },
      {
        name: "Test case 3",
        input: '""',
        expected: '""',
        actual: "None",
        status: "Failed",
      },
    ],
    feedback:
      "The approach is correct for non-empty strings. Check the empty-string case and ensure the function always returns a string.",
  },
  {
    id: 3,
    user: "Mark Wilson",
    initial: "M",
    color: "bg-purple-500",
    question: "Valid Palindrome",
    language: "Java",
    result: "Accepted",
    passed: "5 / 5",
    time: "92 ms",
    memory: "16.1 MB",
    submitted: "Nov 3, 2026 5:20 PM",
    code: `class Solution {
    public boolean isPalindrome(String s) {
        String clean = s.replaceAll("[^A-Za-z0-9]", "").toLowerCase();
        return clean.equals(new StringBuilder(clean).reverse().toString());
    }
}`,
    tests: [
      {
        name: "Test case 1",
        input: '"A man, a plan, a canal: Panama"',
        expected: "true",
        actual: "true",
        status: "Passed",
      },
    ],
    feedback:
      "Correct solution. Consider a two-pointer approach to avoid creating additional strings and reduce memory usage.",
  },
  {
    id: 4,
    user: "Alice Brown",
    initial: "A",
    color: "bg-indigo-500",
    question: "Merge Intervals",
    language: "JavaScript",
    result: "Accepted",
    passed: "6 / 6",
    time: "135 ms",
    memory: "22.4 MB",
    submitted: "Nov 3, 2026 5:10 PM",
    code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [];

  for (const interval of intervals) {
    const last = result[result.length - 1];

    if (!last || interval[0] > last[1]) {
      result.push(interval);
    } else {
      last[1] = Math.max(last[1], interval[1]);
    }
  }

  return result;
}`,
    tests: [
      {
        name: "Test case 1",
        input: "[[1,3],[2,6],[8,10]]",
        expected: "[[1,6],[8,10]]",
        actual: "[[1,6],[8,10]]",
        status: "Passed",
      },
    ],
    feedback:
      "Efficient sorting and merging strategy. All test cases passed.",
  },
  {
    id: 5,
    user: "Rahul Menon",
    initial: "R",
    color: "bg-rose-500",
    question: "Two Sum II",
    language: "Python",
    result: "Rejected",
    passed: "2 / 4",
    time: "208 ms",
    memory: "19.8 MB",
    submitted: "Nov 3, 2026 4:58 PM",
    code: `def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        total = numbers[left] + numbers[right]

        if total == target:
            return [left + 1, right + 1]

        if total < target:
            left += 1
        else:
            right -= 1

    return []`,
    tests: [
      {
        name: "Test case 1",
        input: "[2, 7, 11, 15], target = 9",
        expected: "[1, 2]",
        actual: "[1, 2]",
        status: "Passed",
      },
      {
        name: "Test case 2",
        input: "[2, 3, 4], target = 6",
        expected: "[1, 3]",
        actual: "[1, 3]",
        status: "Failed",
      },
    ],
    feedback:
      "Review the one-based index requirement and verify boundary conditions for the two-pointer approach.",
  },
];

const tabs = ["Submitted Code", "Test Case Results", "AI Feedback"];

function StatCard({ icon: Icon, title, value, note, tone }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50/80 text-blue-700",
    green: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    red: "border-rose-200 bg-rose-50/80 text-rose-600",
    purple: "border-violet-200 bg-violet-50/80 text-violet-700",
  };

  return (
    <div
      className={`flex min-w-0 items-center gap-4 rounded-xl border px-4 py-3 ${tones[tone]}`}
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white/70">
        <Icon size={34} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </span>

          {note && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
              {note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_12px_minmax(0,1fr)] items-center gap-2">
      <dt>{label}</dt>
      <span>:</span>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}

export default function AdminCodingSubmissions() {
  const [submissions] = useState(initialSubmissions);
  const [selectedId, setSelectedId] = useState(1);

  const [search, setSearch] = useState("");
  const [questionFilter, setQuestionFilter] = useState("All Questions");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [languageFilter, setLanguageFilter] = useState("All Languages");

  const [activeTab, setActiveTab] = useState("Submitted Code");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return submissions.filter((submission) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        `${submission.user} ${submission.question} ${submission.id}`
          .toLowerCase()
          .includes(query);

      const matchesQuestion =
        questionFilter === "All Questions" ||
        submission.question === questionFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        submission.result === statusFilter;

      const matchesLanguage =
        languageFilter === "All Languages" ||
        submission.language === languageFilter;

      return (
        matchesSearch &&
        matchesQuestion &&
        matchesStatus &&
        matchesLanguage
      );
    });
  }, [submissions, search, questionFilter, statusFilter, languageFilter]);

  const selected =
    filtered.find((submission) => submission.id === selectedId) ||
    filtered[0] ||
    null;

  const accepted = submissions.filter(
    (submission) => submission.result === "Accepted"
  ).length;

  const rejected = submissions.length - accepted;

  const uniqueUsers = new Set(
    submissions.map((submission) => submission.user)
  ).size;

  const resetFilters = () => {
    setSearch("");
    setQuestionFilter("All Questions");
    setStatusFilter("All Status");
    setLanguageFilter("All Languages");
  };

  const selectSubmission = (submission) => {
    setSelectedId(submission.id);
    setActiveTab("Submitted Code");
  };

  const copyCode = async () => {
    if (!selected) return;

    try {
      await navigator.clipboard.writeText(selected.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AdminDashboardLayout activePage="Coding Practice" adminName="Admin">
      <main className="mx-auto max-w-[1800px] space-y-4 p-4 sm:p-5 xl:p-6">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <Home size={18} />
          <span>/</span>
          <span>Coding Practice</span>
          <span>/</span>
          <span className="font-bold text-slate-950">Submissions</span>
        </div>

        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4"></div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold">
            <CalendarDays size={19} />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>All Time</option>
            </select>

            <ChevronDown size={16} />
          </label>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Code2}
            title="Total Submissions"
            value="1,842"
            note="↑ +18%"
            tone="blue"
          />

          <StatCard
            icon={CircleCheck}
            title="Accepted"
            value="1,276"
            note="69.3%"
            tone="green"
          />

          <StatCard
            icon={CircleX}
            title="Rejected"
            value="566"
            note="30.7%"
            tone="red"
          />

          <StatCard
            icon={Users}
            title="Unique Users"
            value="438"
            tone="purple"
          />
        </section>

        {/* Search and filters */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1.6fr)_minmax(170px,.8fr)_minmax(170px,.8fr)_minmax(170px,.8fr)_116px]">

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5">
            <Search size={21} className="shrink-0 text-slate-700" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder="Search by user, question or submission ID..."
            />
          </div>

          <select
            value={questionFilter}
            onChange={(e) => setQuestionFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
          >
            <option>All Questions</option>
            {[...new Set(submissions.map((s) => s.question))].map((question) => (
              <option key={question}>{question}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
          >
            <option>All Status</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
          >
            <option>All Languages</option>
            {[...new Set(submissions.map((s) => s.language))].map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </section>

        {/* Submissions table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <thead className="bg-[#edf1fc] text-slate-950">
                <tr>
                  {[
                    "#",
                    "User",
                    "Question",
                    "Language",
                    "Result",
                    "Test Cases",
                    "Time",
                    "Memory",
                    "Submitted At",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 font-bold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((submission, index) => (
                  <tr
                    key={submission.id}
                    onClick={() => selectSubmission(submission)}
                    className={`cursor-pointer border-t border-slate-200 hover:bg-blue-50/60 ${
                      selected?.id === submission.id
                        ? "bg-blue-50/40"
                        : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold">{index + 1}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white ${submission.color}`}
                        >
                          {submission.initial}
                        </span>

                        {submission.user}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-bold">
                      {submission.question}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-md bg-amber-100 text-xs font-black text-amber-700">
                        {submission.language === "Python"
                          ? "Py"
                          : submission.language === "Java"
                            ? "♨"
                            : "JS"}
                      </span>

                      {submission.language}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          submission.result === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {submission.result}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          submission.result === "Accepted"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {submission.passed}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {submission.time}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {submission.memory}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      {submission.submitted}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        aria-label="View submission"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSubmission(submission);
                        }}
                        className="grid h-8 w-11 place-items-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No submissions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <span className="text-sm">
              Showing {filtered.length ? 1 : 0}–{filtered.length} of 1,842
              submissions
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="grid h-9 w-10 place-items-center rounded-lg border border-slate-200 text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>

              <button className="h-9 w-10 rounded-lg bg-blue-600 font-bold text-white">
                1
              </button>

              {[2, 3, 4, 5].map((number) => (
                <button
                  key={number}
                  className="h-9 w-10 rounded-lg border border-slate-300 bg-white"
                >
                  {number}
                </button>
              ))}

              <span className="px-1">...</span>

              <button className="h-9 rounded-lg border border-slate-300 px-3">
                369
              </button>

              <button className="grid h-9 w-10 place-items-center rounded-lg border border-slate-300">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Submission details and tabs */}
        {selected && (
          <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">

            {/* Submission details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600">
                  <Code2 size={25} />
                </div>

                <h2 className="text-xl font-extrabold">
                  Submission Details
                </h2>
              </div>

              <dl className="space-y-2.5 px-2 text-sm">
                <Detail label="User" value={selected.user} />

                <Detail label="Question" value={selected.question} />

                <Detail label="Language" value={selected.language} />

                <Detail
                  label="Status"
                  value={
                    <span
                      className={`rounded-full px-3 py-1 font-bold ${
                        selected.result === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selected.result}
                    </span>
                  }
                />

                <Detail
                  label="Test Cases"
                  value={
                    <span
                      className={`font-bold ${
                        selected.result === "Accepted"
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {selected.passed}
                    </span>
                  }
                />

                <Detail label="Execution Time" value={selected.time} />

                <Detail label="Memory Used" value={selected.memory} />

                <Detail label="Submitted At" value={selected.submitted} />
              </dl>
            </div>

            {/* Code, test results and AI feedback */}
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

              {/* Tabs */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-t-lg px-3 py-3 text-sm font-bold ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {index === 0 ? (
                      <Code2 size={19} />
                    ) : index === 1 ? (
                      <Layers size={19} />
                    ) : (
                      <Sparkles size={19} />
                    )}

                    {tab}
                  </button>
                ))}
              </div>

              {/* Submitted code */}
              {activeTab === "Submitted Code" && (
                <div className="relative mt-3 overflow-hidden rounded-xl bg-[#171d2b] p-5 text-sm text-slate-100">
                  <button
                    onClick={copyCode}
                    className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-600"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? "Copied" : "Copy"}
                  </button>

                  <pre className="overflow-x-auto pr-20 font-mono leading-6">
                    <code>
                      {selected.code.split("\n").map((line, index) => (
                        <div key={index} className="flex">
                          <span className="mr-7 inline-block w-5 shrink-0 select-none text-right text-slate-500">
                            {index + 1}
                          </span>

                          <span className="whitespace-pre">{line || " "}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              )}

              {/* Test case results */}
              {activeTab === "Test Case Results" && (
                <div className="mt-3 space-y-3">
                  {selected.tests.map((test, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-bold">{test.name}</h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            test.status === "Passed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm md:grid-cols-3">
                        <div>
                          <p className="mb-1 text-xs font-semibold text-slate-500">
                            Input
                          </p>
                          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2">
                            {test.input}
                          </pre>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold text-slate-500">
                            Expected Output
                          </p>
                          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2">
                            {test.expected}
                          </pre>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold text-slate-500">
                            Actual Output
                          </p>
                          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2">
                            {test.actual}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI feedback */}
              {activeTab === "AI Feedback" && (
                <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50/70 p-5">
                  <div className="mb-3 flex items-center gap-2 font-bold text-violet-800">
                    <Sparkles size={20} />
                    AI Code Review
                  </div>

                  <p className="text-sm leading-7 text-slate-800">
                    {selected.feedback}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </AdminDashboardLayout>
  );
}