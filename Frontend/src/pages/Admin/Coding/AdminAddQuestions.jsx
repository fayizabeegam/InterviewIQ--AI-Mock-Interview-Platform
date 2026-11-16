import { useEffect, useRef, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import {
  Home, Code2, Eye, Bold, Italic, List, ListOrdered, AlignLeft,
  Plus, Upload, Save, Pencil, Trash2, ChevronDown, X, FileJson,
} from "lucide-react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import {
  getCodingQuestionDetail,
  createCodingQuestion,
  updateCodingQuestion,
} from "../../../services/adminService";



const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({ label, required, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 block text-sm font-bold text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function SectionHeading({ number, title, description, children }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-extrabold leading-5 text-slate-950">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <section className={`rounded-xl border border-blue-100 bg-white p-3.5 shadow-sm ${className}`}>{children}</section>;
}

export default function AdminAddQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedQuestion = location.state?.question;
  const importRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    skill: "",
    difficulty: "",
    programming_language: "",
    problem_statement: "",
    input_format: "",
    output_format: "",
    constraints: "",
    sample_input: "",
    sample_output: "",
    explanation: "",
  });
  const [testCases, setTestCases] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(selectedQuestion?.id);

  const [editingId, setEditingId] = useState(null);
  const [showCaseEditor, setShowCaseEditor] = useState(false);
  const [caseDraft, setCaseDraft] = useState({ input_data: "", expected_output: "", is_sample: false });
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    if (!selectedQuestion?.id) {
      // New question: keep the form empty.
      setForm({
        title: "",
        skill: "",
        difficulty: "",
        programming_language: "",
        problem_statement: "",
        input_format: "",
        output_format: "",
        constraints: "",
        sample_input: "",
        sample_output: "",
        explanation: "",
      });

      setTestCases([]);
      return;
    }

    const fetchQuestionDetails = async () => {
      try {
        setLoadingQuestion(true);
        setMessage("");

        const response = await getCodingQuestionDetail(
          selectedQuestion.id
        );

        const question = response.data;

        setForm({
          title: question.title || "",
          skill: question.skill || "",
          difficulty: question.difficulty || "",
          programming_language: question.programming_language || "",
          problem_statement: question.problem_statement || "",
          input_format: question.input_format || "",
          output_format: question.output_format || "",
          constraints: question.constraints || "",
          sample_input: question.sample_input || "",
          sample_output: question.sample_output || "",
          explanation: question.explanation || "",
        });

        setTestCases(
          (question.test_cases || []).map((item, index) => ({
            id: item.id,
            input_data: item.input_data || "",
            expected_output: item.expected_output || "",
            is_sample: Boolean(item.is_sample),
            order: item.order || index + 1,
          }))
        );
      } catch (error) {
        console.error("Unable to fetch question:", error);

        setMessage(
          error.response?.data?.message ||
          "Unable to load question details."
        );
      } finally {
        setLoadingQuestion(false);
      }
    };

    fetchQuestionDetails();
  }, [selectedQuestion?.id]);


  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const saveTestCase = () => {
    if (!caseDraft.input_data.trim() || !caseDraft.expected_output.trim()) {
      setMessage("Enter both input and expected output for the test case.");
      return;
    }
    if (editingId) {
      setTestCases((items) => items.map((item) => item.id === editingId ? { ...caseDraft, id: editingId } : item));
    } else {
      setTestCases((items) => [...items, { ...caseDraft, id: Date.now() }]);
    }
    setCaseDraft({ input_data: "", expected_output: "", is_sample: false });
    setEditingId(null);
    setShowCaseEditor(false);
    setMessage("");
  };

  const editTestCase = (item) => {
    setEditingId(item.id);
    setCaseDraft({ input_data: item.input_data, expected_output: item.expected_output, is_sample: item.is_sample });
    setShowCaseEditor(true);
  };

  const deleteTestCase = (id) => setTestCases((items) => items.filter((item) => item.id !== id));

  const importTestCases = async (file) => {
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const items = Array.isArray(parsed) ? parsed : parsed.test_cases;

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("JSON must contain at least one test case.");
      }

      const normalized = items.map((item, index) => ({
        id: `import-${Date.now()}-${index}`,
        input_data: item.input_data ?? item.input ?? "",
        expected_output: item.expected_output ?? item.output ?? "",
        is_sample: Boolean(item.is_sample),
      }));

      if (
        normalized.some(
          (item) =>
            typeof item.input_data !== "string" ||
            typeof item.expected_output !== "string" ||
            !item.input_data.trim() ||
            !item.expected_output.trim()
        )
      ) {
        throw new Error(
          "Every test case needs valid input_data and expected_output."
        );
      }

      // Create a unique key using input and expected output.
      const getKey = (item) =>
        JSON.stringify([item.input_data, item.expected_output]);

      // Check existing test cases and duplicates within the uploaded JSON.
      const existingKeys = new Set(testCases.map(getKey));
      const importedKeys = new Set();

      const newCases = normalized.filter((item) => {
        const key = getKey(item);

        if (existingKeys.has(key) || importedKeys.has(key)) {
          return false;
        }

        importedKeys.add(key);
        return true;
      });

      const duplicateCount = normalized.length - newCases.length;

      // If every test case already exists, show an error.
      if (newCases.length === 0) {
        throw new Error(
          "All test cases already exist. No new test cases imported."
        );
      }

      // Add only new test cases.
      setTestCases((current) => [...current, ...newCases]);

      setMessage(
        `${newCases.length} new test case(s) imported successfully.` +
          (duplicateCount > 0
            ? ` ${duplicateCount} duplicate test case(s) skipped.`
            : "")
      );

    } catch (error) {
      setMessage(error.message || "Unable to import this JSON file.");
    }

    if (importRef.current) {
      importRef.current.value = "";
    }
  };
  
  
  const saveQuestion = async (event) => {
    event.preventDefault();

    const required = [
      "title",
      "difficulty",
      "programming_language",
      "problem_statement",
      "sample_input",
      "sample_output",
    ];

    const missing = required.filter(
      (key) => !String(form[key] || "").trim()
    );

    if (missing.length) {
      setMessage(
        `Please complete these required fields: ${missing.join(", ")}`
      );
      return;
    }

    if (!testCases.length) {
      setMessage("Add at least one test case before saving.");
      return;
    }

    const payload = {
      ...form,
      skill: form.skill || null,
      test_cases: testCases.map((item, index) => ({
        input_data: item.input_data,
        expected_output: item.expected_output,
        is_sample: item.is_sample,
        order: index + 1,
      })),
    };

    try {
      setSaving(true);
      setMessage("");

      const response = isEditMode
        ? await updateCodingQuestion(selectedQuestion.id, payload)
        : await createCodingQuestion(payload);

      setMessage(response.message || "Question saved successfully.");

      navigate("/admin/coding/all-questions");
    } catch (error) {
      console.error("Save question error:", error);

      const errors = error.response?.data?.errors;

      setMessage(
        errors
          ? JSON.stringify(errors)
          : error.response?.data?.message || "Unable to save question."
      );
    } finally {
      setSaving(false);
    }
  };




  return (
    <AdminDashboardLayout activePage="Coding Practice" adminName="Admin">
      <main className="mx-auto max-w-[1700px] space-y-3 p-4 sm:p-5 xl:p-6">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Home size={15} /><span>/</span><span>Coding Practice</span><span>/</span>
          <span className="font-bold text-slate-950">
            {isEditMode ? "Edit Question" : "Add Question"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          
        </div>


        {loadingQuestion && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Loading question details...
            </div>
        )}

        <form onSubmit={saveQuestion} className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[226px_minmax(0,1fr)]">
          {/* Step navigation */}
          <aside className="rounded-xl border border-blue-100 bg-white p-2.5 shadow-sm">
            {[
              ["1", "Question Details", "question-details"],
              ["2", "Problem Description", "problem-description"],
              ["3", "Samples & Explanation", "samples"],
              ["4", "Test Cases", "test-cases"],
            ].map(([number, title, id], index) => (
              <a key={id} href={`#${id}`} className={`mb-1 flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-semibold last:mb-0 ${index === 0 ? "bg-blue-100 text-blue-700" : "text-slate-800 hover:bg-slate-50"}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold ${index === 0 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-slate-100 text-slate-700"}`}>{number}</span>
                {title}
              </a>
            ))}
          </aside>

          <div className="min-w-0 space-y-3">
            {/* Question details */}
            <Card>
              <div id="question-details">
                <SectionHeading number="1" title="Question Details" description="Basic information about the coding question." />
              </div>
              <div className="grid grid-cols-1 gap-x-7 gap-y-2 sm:grid-cols-2">
                <Field label="Title" required>
                  <input className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Enter question title" />
                </Field>
                <Field label="Topic / Skill">
                  <select
                    className={inputClass}
                    value={form.skill}
                    onChange={(e) => update("skill", e.target.value)}
                  >
                    <option value="">Uncategorized</option>
                  </select>
                </Field>
                <Field label="Difficulty" required>
                  <select className={inputClass} value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                    <option value="">Select difficulty</option><option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
                  </select>
                </Field>
                <Field label="Programming Language" required>
                  <select className={inputClass} value={form.programming_language} onChange={(e) => update("programming_language", e.target.value)}>
                    <option value="">Select language</option><option value="PYTHON">Python</option><option value="JAVA">Java</option><option value="JAVASCRIPT">JavaScript</option><option value="CPP">C++</option><option value="C">C</option>
                  </select>
                </Field>
              </div>
            </Card>

            {/* Problem description */}
            <Card>
              <div id="problem-description">
                <SectionHeading number="2" title="Problem Description" description="Provide the problem statement and related details." />
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.95fr]">
                <Field label="Problem Statement" required>
                  <textarea rows={5} className={`${inputClass} resize-y rounded-b-none`} value={form.problem_statement} onChange={(e) => update("problem_statement", e.target.value)} placeholder="Describe the problem clearly..." />
                  <div className="-mt-1 flex items-center gap-4 rounded-b-lg border border-t-0 border-slate-300 bg-slate-50 px-3 py-2 text-slate-700">
                    <button type="button" aria-label="Bold"><Bold size={17} /></button>
                    <button type="button" aria-label="Italic"><Italic size={17} /></button>
                    <span className="h-5 border-l border-slate-300" />
                    <button type="button" aria-label="Code"><Code2 size={17} /></button>
                    <span className="h-5 border-l border-slate-300" />
                    <button type="button" aria-label="Bulleted list"><List size={17} /></button>
                    <button type="button" aria-label="Numbered list"><ListOrdered size={17} /></button>
                    <button type="button" aria-label="Align left"><AlignLeft size={17} /></button>
                    <button type="button" onClick={() => setShowPreview(true)} className="ml-auto flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-blue-50"><Eye size={15} /> Preview</button>
                  </div>
                </Field>
                <div className="space-y-2">
                  <Field label="Input Format">
                    <input className={inputClass} value={form.input_format} onChange={(e) => update("input_format", e.target.value)} placeholder="Describe the input format..." />
                  </Field>
                  <Field label="Output Format">
                    <input className={inputClass} value={form.output_format} onChange={(e) => update("output_format", e.target.value)} placeholder="Describe the output format..." />
                  </Field>
                  <Field label={<>Constraints <span className="font-normal text-slate-600">(Optional)</span></>}>
                    <input className={inputClass} value={form.constraints} onChange={(e) => update("constraints", e.target.value)} placeholder="e.g., 1 ≤ N ≤ 10⁵, 0 ≤ A[i] ≤ 10⁹" />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Samples */}
            <Card>
              <div id="samples">
                <SectionHeading number="3" title="Samples & Explanation" description="Add sample input, output and explanation." />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Sample Input" required>
                  <textarea rows={2} className={`${inputClass} min-h-[62px] resize-y`} value={form.sample_input} onChange={(e) => update("sample_input", e.target.value)} placeholder={"e.g.\n[2, 7, 11, 15]\n9"} />
                </Field>
                <Field label="Sample Output" required>
                  <textarea rows={2} className={`${inputClass} min-h-[62px] resize-y`} value={form.sample_output} onChange={(e) => update("sample_output", e.target.value)} placeholder={"e.g.\n[0, 1]"} />
                </Field>
                <Field label={<>Explanation <span className="font-normal text-slate-600">(Optional)</span></>}>
                  <textarea rows={2} className={`${inputClass} min-h-[62px] resize-y`} value={form.explanation} onChange={(e) => update("explanation", e.target.value)} placeholder="Explain the sample output..." />
                </Field>
              </div>
            </Card>

            {/* Test cases */}
            <Card>
              <div id="test-cases" className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <SectionHeading number="4" title="Test Cases" description="Add test cases to evaluate the solution." />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => { setEditingId(null); setCaseDraft({ input_data: "", expected_output: "", is_sample: false }); setShowCaseEditor(true); }} className="flex items-center gap-1.5 rounded-lg border border-blue-500 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"><Plus size={15} /> Add Test Case</button>
                  <button type="button" onClick={() => importRef.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Upload size={15} /> Import from JSON</button>
                  <input ref={importRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => importTestCases(e.target.files?.[0])} />
                </div>
              </div>

              {showCaseEditor && (
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                  <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">{editingId ? "Edit Test Case" : "New Test Case"}</h3><button type="button" onClick={() => setShowCaseEditor(false)} aria-label="Close"><X size={17} /></button></div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Input">
                      <textarea rows={3} className={inputClass} value={caseDraft.input_data} onChange={(e) => setCaseDraft((v) => ({ ...v, input_data: e.target.value }))} placeholder="Enter test input..." />
                    </Field>
                    <Field label="Expected Output">
                      <textarea rows={3} className={inputClass} value={caseDraft.expected_output} onChange={(e) => setCaseDraft((v) => ({ ...v, expected_output: e.target.value }))} placeholder="Enter expected output..." />
                    </Field>
                  </div>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={caseDraft.is_sample} onChange={(e) => setCaseDraft((v) => ({ ...v, is_sample: e.target.checked }))} className="accent-blue-600" /> Mark as sample test case</label>
                  <div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setShowCaseEditor(false)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">Cancel</button><button type="button" onClick={saveTestCase} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Test Case</button></div>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[650px] text-sm">
                  <thead className="bg-slate-100 text-xs font-bold text-slate-800">
                    <tr><th className="w-10 px-3 py-2 text-left"><input type="checkbox" aria-label="Select all test cases" /></th><th className="w-14 px-2 py-2 text-left">#</th><th className="px-3 py-2 text-left">Input</th><th className="px-3 py-2 text-left">Expected Output</th><th className="px-3 py-2 text-center">Type</th><th className="px-3 py-2 text-center">Actions</th></tr>
                  </thead>
                  <tbody>
                    {testCases.map((item, index) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-3 py-2"><input type="checkbox" aria-label={`Select test case ${index + 1}`} /></td>
                        <td className="px-2 py-2 font-semibold text-slate-800">{index + 1}</td>
                        <td className="whitespace-pre-line px-3 py-2 font-medium text-slate-800">{item.input_data}</td>
                        <td className="whitespace-pre-line px-3 py-2 font-semibold text-slate-800">{item.expected_output}</td>
                        <td className="px-3 py-2 text-center"><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_sample ? "bg-emerald-100 text-emerald-800" : "bg-violet-100 text-violet-800"}`}>{item.is_sample ? "Sample" : "Hidden"}</span></td>
                        <td className="px-3 py-2"><div className="flex justify-center gap-2"><button type="button" onClick={() => editTestCase(item)} className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200" aria-label="Edit test case"><Pencil size={16} /></button><button type="button" onClick={() => deleteTestCase(item.id)} className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200" aria-label="Delete test case"><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                    {testCases.length === 0 && <tr><td colSpan="6" className="px-3 py-7 text-center text-slate-500">No test cases added yet.</td></tr>}
                  </tbody>
                </table>
              </div>
              {message && <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
            </Card>

            <div className="flex flex-wrap justify-end gap-3 pb-2">
              <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">Cancel</button>
              <button
                type="submit"
                disabled={saving || loadingQuestion}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : isEditMode
                    ? "Update Question"
                    : "Save Question"}
              </button>
            </div>
          </div>
        </form>

        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold text-slate-900">Question Preview</h2><button type="button" onClick={() => setShowPreview(false)} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div>
              <h3 className="text-lg font-bold text-slate-900">{form.title || "Untitled question"}</h3>
              <div className="my-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">{form.programming_language || "Language not selected"}</span><span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">{form.difficulty || "Difficulty not selected"}</span><span className="rounded-full bg-violet-100 px-3 py-1 text-violet-800">{form.skill || "Topic not selected"}</span></div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{form.problem_statement || "Problem statement will appear here."}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2"><div><b className="text-sm">Sample Input</b><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{form.sample_input || "—"}</pre></div><div><b className="text-sm">Sample Output</b><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{form.sample_output || "—"}</pre></div></div>
              {form.explanation && <div className="mt-3"><b className="text-sm">Explanation</b><p className="mt-1 text-sm text-slate-700">{form.explanation}</p></div>}
              <div className="mt-5 flex justify-end"><button type="button" onClick={() => setShowPreview(false)} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Close Preview</button></div>
            </div>
          </div>
        )}
      </main>
    </AdminDashboardLayout>
  );
}
