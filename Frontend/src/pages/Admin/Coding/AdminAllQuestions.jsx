import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Code2, Plus, Upload, Search, RotateCcw, Layers,
  Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChartNoAxesColumnIncreasing,
  Trophy, X,
} from "lucide-react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import {
  getCodingQuestions,
  getCodingQuestionDetail,
  deleteCodingQuestion,
  getCodingQuestionStats,
} from "../../../services/adminService";


const inputStyle = "h-[46px] w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({ title, value, tone, icon: Icon }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50/70 text-blue-600",
    green: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    amber: "border-amber-100 bg-amber-50/70 text-amber-600",
    red: "border-rose-100 bg-rose-50/70 text-rose-600",
  };
  const iconTones = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-rose-100 text-rose-600",
  };
  return (
    <div className={`flex h-[88px] items-center gap-5 rounded-xl border px-4 ${tones[tone]}`}>
      <div className={`flex h-[58px] w-[62px] shrink-0 items-center justify-center rounded-xl ${iconTones[tone]}`}>
        <Icon size={34} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-0.5 text-[30px] font-extrabold leading-8 text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function DifficultyPill({ value }) {
  const styles = {
    Easy: "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex min-w-[68px] justify-center rounded-full px-3 py-1.5 text-sm font-bold ${styles[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}

function TopicPill({ value }) {
  const styles = {
    Arrays: "bg-blue-100 text-blue-800",
    Strings: "bg-violet-100 text-violet-800",
    Intervals: "bg-sky-100 text-sky-800",
    Stack: "bg-violet-100 text-violet-800",
    "Dynamic Programming": "bg-blue-100 text-blue-700",
  };
  return <span className={`inline-flex max-w-[125px] justify-center rounded-full px-3 py-1.5 text-center text-sm font-bold leading-4 ${styles[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}


export default function AdminAllQuestions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({
    total_questions: 0,
    easy_questions: 0,
    medium_questions: 0,
    hard_questions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const [viewQuestion, setViewQuestion] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 8;

  // Fetch all questions
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCodingQuestions();

      setQuestions(
        (response.data || []).map((item) => ({
          ...item,
          topic: item.skill_name || "Uncategorized",
          description: item.problem_statement || "",
          difficulty:  
          item.difficulty?.charAt(0).toUpperCase() +
          item.difficulty?.slice(1).toLowerCase(),

          language: item.programming_language,
          testCases: item.test_cases_count || 0,
          createdAt: item.created_at,
        }))
      );
    } catch (err) {
      console.error("Error fetching coding questions:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load coding questions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch question statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await getCodingQuestionStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching coding statistics:", err);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [fetchQuestions, fetchStats]);

  // Search and filters
  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesSearch =
        !query ||
        [
          question.title,
          question.description,
          question.topic,
        ].some((value) =>
          (value || "").toLowerCase().includes(query)
        );

      return (
        matchesSearch &&
        (!topic || question.topic === topic) &&
        (!difficulty || question.difficulty === difficulty) &&
        (!language || question.language === language)
      );
    });
  }, [questions, search, topic, difficulty, language]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / pageSize)
  );

  const visibleQuestions = filteredQuestions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const resetFilters = () => {
    setSearch("");
    setTopic("");
    setDifficulty("");
    setLanguage("");
    setPage(1);
    setSelected([]);
  };

  const toggleSelected = (id) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const toggleAll = () => {
    const ids = visibleQuestions.map((item) => item.id);

    const allSelected =
      ids.length > 0 &&
      ids.every((id) => selected.includes(id));

    setSelected((current) =>
      allSelected
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])]
    );
  };

  // Fetch full question details
  const handleViewQuestion = async (question) => {
    try {
      setDetailLoading(true);
      setViewQuestion({ ...question, test_cases: [] });

      const response = await getCodingQuestionDetail(
        question.id
      );

      setViewQuestion(response.data);
    } catch (err) {
      console.error("Error fetching question details:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load question details."
      );
      setViewQuestion(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Delete question from database
  const confirmDelete = async () => {
    if (!deleteQuestion) return;

    try {
      setDeleting(true);

      await deleteCodingQuestion(deleteQuestion.id);

      setQuestions((current) =>
        current.filter(
          (item) => item.id !== deleteQuestion.id
        )
      );

      setSelected((current) =>
        current.filter(
          (id) => id !== deleteQuestion.id
        )
      );

      setDeleteQuestion(null);

      // Refresh statistics after deletion
      await fetchStats();
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(
        err.response?.data?.message ||
        "Unable to delete coding question."
      );
    } finally {
      setDeleting(false);
    }
  };

  const goToPage = (nextPage) =>
    setPage(
      Math.min(totalPages, Math.max(1, nextPage))
    );

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <AdminDashboardLayout activePage="Coding Practice" adminName="Admin">
      <main className="mx-auto max-w-[1700px] space-y-4 p-4 sm:p-5 xl:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <Home size={16} /><span>/</span><span>Coding Practice</span><span>/</span>
          <span className="font-bold text-slate-950">All Questions</span>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4"></div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/admin/coding/bulk-upload")} className="flex h-[46px] items-center gap-2 rounded-xl border border-blue-500 bg-white px-5 text-sm font-bold text-blue-700 hover:bg-blue-50">
              <Upload size={20} /> Bulk Upload
            </button>
            <button type="button" onClick={() => navigate("/admin/coding/add-question")} className="flex h-[46px] items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
              <Plus size={21} /> Add Question
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Questions" value={stats.total_questions} tone="blue" icon={Code2} />
          <StatCard title="Easy" value={stats.easy_questions} tone="green"  icon={Code2} />
          <StatCard title="Medium" value={stats.medium_questions} tone="amber" icon={ChartNoAxesColumnIncreasing} />
          <StatCard title="Hard" value={stats.hard_questions} tone="red" icon={Trophy} />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(240px,1.7fr)_minmax(150px,.8fr)_minmax(160px,.8fr)_minmax(160px,.8fr)_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={21} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputStyle} pl-12`} placeholder="Search by title, keyword or problem..." />
          </div>
          <select value={topic} onChange={(e) => { setTopic(e.target.value); setPage(1); }} className={inputStyle}>
            <option value="">All Topics</option>
            {[...new Set(questions.map((item) => item.topic))]
              .sort()
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

          </select>
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className={inputStyle}>
            <option value="">All Difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); setPage(1); }} className={inputStyle}>
            <option value="">All Languages</option>
            {[...new Set(questions.map((item) => item.language))]
            .sort()
            .map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="button" onClick={resetFilters} className="flex h-[46px] items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-5 text-sm font-bold text-blue-700 hover:bg-blue-50">
            <RotateCcw size={19} /> Reset
          </button>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm">
            <span className="font-semibold text-blue-900">{selected.length} question(s) selected</span>
            <button type="button" onClick={() => setSelected([])} className="font-semibold text-blue-700 hover:underline">Clear selection</button>
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-sm">
              <thead className="bg-slate-100/90 text-slate-900">
                <tr className="h-[43px]">
                  <th className="w-14 px-4 text-left"><input type="checkbox" aria-label="Select all visible questions" checked={visibleQuestions.length > 0 && visibleQuestions.every((item) => selected.includes(item.id))} onChange={toggleAll} className="h-[18px] w-[18px] accent-blue-600" /></th>
                  <th className="w-12 px-2 text-left font-bold">#</th>
                  <th className="min-w-[300px] px-3 text-left font-bold">Title</th>
                  <th className="w-[130px] px-3 text-center font-bold">Topic</th>
                  <th className="w-[120px] px-3 text-center font-bold">Difficulty</th>
                  <th className="w-[120px] px-3 text-left font-bold">Language</th>
                  <th className="w-[120px] px-3 text-center font-bold">Test Cases</th>
                  <th className="w-[135px] px-3 text-left font-bold">Created At</th>
                  <th className="w-[155px] px-3 text-center font-bold">Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-14 text-center text-slate-500">
                      Loading coding questions...
                    </td>
                  </tr>
                ) : visibleQuestions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-14 text-center text-sm text-slate-500">
                      No coding questions match your filters.
                    </td>
                  </tr>
                ) : (
                  visibleQuestions.map((question, index) => (
                    <tr
                      key={question.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(question.id)}
                          onChange={() => toggleSelected(question.id)}
                          className="h-[18px] w-[18px] accent-blue-600"
                        />
                      </td>

                      {/* Serial Number */}
                      <td className="px-2 py-3 text-slate-600">
                        {(page - 1) * pageSize + index + 1}
                      </td>

                      {/* Question Title */}
                      <td className="px-3 py-3">
                        <div className="max-w-[350px]">
                          <p className="font-bold text-slate-900">
                            {question.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {question.description}
                          </p>
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="px-3 py-3 text-center">
                        <TopicPill value={question.topic} />
                      </td>

                      {/* Difficulty */}
                      <td className="px-3 py-3 text-center">
                        <DifficultyPill value={question.difficulty} />
                      </td>

                      {/* Language */}
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700">
                          {question.language}
                        </span>
                      </td>

                      {/* Test Cases */}
                      <td className="px-3 py-3 text-center font-semibold text-slate-700">
                        {question.testCases}
                      </td>

                      {/* Created At */}
                      <td className="px-3 py-3 text-slate-600">
                        {formatDate(question.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="View Question"
                            onClick={() => handleViewQuestion(question)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="Edit Question"
                            onClick={() =>
                              navigate("/admin/coding/add-question", {
                                state: { question },
                              })
                            }
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            title="Delete Question"
                            onClick={() => setDeleteQuestion(question)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-3 py-3">
            <p className="text-sm text-slate-800">
              Showing{" "}
              {filteredQuestions.length === 0
                ? 0
                : (page - 1) * pageSize + 1}
              –
              {Math.min(page * pageSize, filteredQuestions.length)}
              {" "}of {filteredQuestions.length} questions
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={20} /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((number) => (
                <button key={number} type="button" onClick={() => goToPage(number)} className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${page === number ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"}`}>{number}</button>
              ))}
              {totalPages > 5 && <><span className="px-1 text-slate-600">...</span><button type="button" onClick={() => goToPage(totalPages)} className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${page === totalPages ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-900"}`}>{totalPages}</button></>}
              <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={20} /></button>
            </div>
          </div>
        </section>

        {viewQuestion && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">
                    {viewQuestion.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Coding question details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewQuestion(null)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <p className="py-10 text-center text-slate-500">
                  Loading question details...
                </p>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <TopicPill value={viewQuestion.skill_name || "Uncategorized"} />
                    <DifficultyPill
                      value={
                        viewQuestion.difficulty?.charAt(0) +
                        viewQuestion.difficulty?.slice(1).toLowerCase()
                      }
                    />
                    <span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-800">
                      {viewQuestion.programming_language}
                    </span>
                  </div>

                  <div className="space-y-4 text-sm text-slate-700">

                    <div>
                      <h3 className="mb-1 font-bold text-slate-950">
                        Problem Statement
                      </h3>
                      <p className="whitespace-pre-wrap leading-6">
                        {viewQuestion.problem_statement}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Input Format</h3>
                      <p className="whitespace-pre-wrap">
                        {viewQuestion.input_format || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Output Format</h3>
                      <p className="whitespace-pre-wrap">
                        {viewQuestion.output_format || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Constraints</h3>
                      <p className="whitespace-pre-wrap">
                        {viewQuestion.constraints || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Sample Input</h3>
                      <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-3">
                        {viewQuestion.sample_input || "—"}
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Sample Output</h3>
                      <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-3">
                        {viewQuestion.sample_output || "—"}
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-950">Explanation</h3>
                      <p className="whitespace-pre-wrap">
                        {viewQuestion.explanation || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-bold text-slate-950">
                        Test Cases ({viewQuestion.test_cases?.length || 0})
                      </h3>

                      {viewQuestion.test_cases?.length ? (
                        viewQuestion.test_cases.map((testCase, index) => (
                          <div
                            key={testCase.id}
                            className="mb-3 rounded-lg border border-slate-200 p-3"
                          >
                            <p className="mb-2 font-bold">
                              Test Case {index + 1}
                              {testCase.is_sample && " (Sample)"}
                            </p>

                            <p className="font-semibold">Input:</p>
                            <pre className="mb-2 whitespace-pre-wrap rounded bg-slate-50 p-2">
                              {testCase.input_data}
                            </pre>

                            <p className="font-semibold">Expected Output:</p>
                            <pre className="whitespace-pre-wrap rounded bg-slate-50 p-2">
                              {testCase.expected_output}
                            </pre>
                          </div>
                        ))
                      ) : (
                        <p>No test cases available.</p>
                      )}
                    </div>

                  </div>
                </>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewQuestion(null)}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {deleteQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="alertdialog" aria-modal="true">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-extrabold text-slate-950">Delete coding question?</h2>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete <b>{deleteQuestion.title}</b>? This action cannot be undone.</p>
              <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteQuestion(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
    </AdminDashboardLayout>
  );
}
