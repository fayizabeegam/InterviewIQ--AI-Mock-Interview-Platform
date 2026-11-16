import { useEffect, useRef, useState } from "react";
import {
  Home, Code2, Info, Download, CloudUpload, FileJson, File,
  CheckCircle2, X, Eye, Monitor, Upload, ChartNoAxesColumnIncreasing,
  Trophy,
} from "lucide-react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { uploadCodingQuestions, getCodingQuestionStats } from "../../../services/adminService";
const LEVELS = [
  {
    key: "EASY",
    label: "Easy",
    color: "green",
    sampleName: "easy_questions.json",
    sample: {
      questions: [{
        title: "Palindrome Number",
        skill: null,
        difficulty: "EASY",
        programming_language: "PYTHON",
        problem_statement: "Given an integer, determine whether it reads the same forward and backward.",
        input_format: "A single integer n.",
        output_format: "Print true if n is a palindrome; otherwise print false.",
        constraints: "−2³¹ <= n <= 2³¹ − 1",
        sample_input: "121",
        sample_output: "true",
        explanation: "121 reads the same in both directions.",
        test_cases: [
          { input_data: "121", expected_output: "true", is_sample: true, order: 1 },
          { input_data: "-121", expected_output: "false", is_sample: false, order: 2 },
          { input_data: "10", expected_output: "false", is_sample: false, order: 3 },
        ],
      }],
    },
  },
  {
    key: "MEDIUM",
    label: "Medium",
    color: "amber",
    sampleName: "medium_questions.json",
    sample: {
      questions: [{
        title: "Valid Anagram",
        skill: null,
        difficulty: "MEDIUM",
        programming_language: "PYTHON",
        problem_statement: "Given two strings s and t, return true if t is an anagram of s.",
        input_format: "Two strings s and t.",
        output_format: "Print true or false.",
        constraints: "1 <= s.length, t.length <= 5 * 10⁴",
        sample_input: "anagram\nnagaram",
        sample_output: "true",
        explanation: "Both strings contain the same characters with the same frequencies.",
        test_cases: [
          { input_data: "anagram\nnagaram", expected_output: "true", is_sample: true, order: 1 },
          { input_data: "rat\ncar", expected_output: "false", is_sample: false, order: 2 },
        ],
      }],
    },
  },
  {
    key: "HARD",
    label: "Hard",
    color: "red",
    sampleName: "hard_questions.json",
    sample: {
      questions: [{
        title: "Median of Two Sorted Arrays",
        skill: null,
        difficulty: "HARD",
        programming_language: "PYTHON",
        problem_statement: "Given two sorted arrays, find the median of the two sorted arrays.",
        input_format: "Two sorted integer arrays.",
        output_format: "Print the median value.",
        constraints: "0 <= nums1.length, nums2.length <= 1000",
        sample_input: "[1, 3]\n[2]",
        sample_output: "2.0",
        explanation: "The merged sorted array is [1, 2, 3], so the median is 2.",
        test_cases: [
          { input_data: "[1, 3]\n[2]", expected_output: "2.0", is_sample: true, order: 1 },
          { input_data: "[1, 2]\n[3, 4]", expected_output: "2.5", is_sample: false, order: 2 },
        ],
      }],
    },
  },
];

const tone = {
  green: {
    panel: "border-emerald-200",
    head: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-950",
    count: "border-emerald-200 bg-emerald-100 text-emerald-800",
    drop: "border-emerald-400",
    upload: "bg-blue-600 hover:bg-blue-700",
    file: "border-emerald-100 bg-emerald-50",
    check: "text-emerald-600",
  },
  amber: {
    panel: "border-amber-200",
    head: "bg-amber-50",
    icon: "bg-amber-100 text-amber-700",
    title: "text-amber-950",
    count: "border-amber-200 bg-amber-100 text-amber-800",
    drop: "border-blue-400",
    upload: "bg-blue-600 hover:bg-blue-700",
    file: "border-slate-300 bg-slate-50",
    check: "text-emerald-600",
  },
  red: {
    panel: "border-rose-200",
    head: "bg-rose-50",
    icon: "bg-rose-100 text-rose-700",
    title: "text-rose-950",
    count: "border-rose-200 bg-rose-100 text-rose-800",
    drop: "border-blue-400",
    upload: "bg-blue-600 hover:bg-blue-700",
    file: "border-slate-300 bg-slate-50",
    check: "text-emerald-600",
  },
};

function downloadJson(level) {
  const blob = new Blob([JSON.stringify(level.sample, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = level.sampleName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function UploadCard({ level, data, onFile, onRemove, onUpload, uploading  }) {
  const fileInput = useRef(null);
  const [dragging, setDragging] = useState(false);
  const styles = tone[level.color];

  const readFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      onFile(level.key, { error: "Please select a .json file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onFile(level.key, { error: "File size must not exceed 5 MB." });
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      const questions = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('JSON must contain a non-empty "questions" array.');
      }
      const wrongDifficulty = questions.find((q) => String(q.difficulty || "").toUpperCase() !== level.key);
      if (wrongDifficulty) {
        throw new Error(`This file contains a question that is not ${level.label}. Upload only ${level.label} questions here.`);
      }
      onFile(level.key, { file, questions });
    } catch (error) {
      onFile(level.key, { error: error instanceof SyntaxError ? "Invalid JSON file. Please check the JSON syntax." : error.message });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    readFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm ${styles.panel}`}>
      <div className={`flex h-[56px] items-center justify-between px-4 ${styles.head}`}>
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.icon}`}><Code2 size={27} /></span>
          <h2 className={`text-xl font-extrabold ${styles.title}`}>{level.label.toUpperCase()}</h2>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-sm font-bold ${styles.count}`}>{data.questions?.length || 0} {data.questions?.length === 1 ? "question" : "questions"}</span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="min-h-[40px] text-sm leading-5 text-slate-800">
          Upload a JSON file containing only <b>{level.label}</b> level coding questions.
        </p>

        <button type="button" onClick={() => downloadJson(level)} className="mx-auto my-1 flex h-[32px] items-center gap-2 rounded-lg border border-blue-500 bg-white px-3 text-sm font-bold text-blue-700 hover:bg-blue-50">
          <Download size={17} /> Download {level.label} JSON Sample
        </button>

        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(event) => readFile(event.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-3 flex min-h-[146px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 text-center transition ${dragging ? "border-blue-600 bg-blue-50" : "border-blue-500 bg-blue-50/50 hover:bg-blue-50"}`}
        >
          <CloudUpload size={51} strokeWidth={1.8} className="mb-1 text-blue-600" />
          <span className="text-sm font-extrabold text-slate-950">Drag and drop {level.label} questions JSON here</span>
          <span className="mt-0.5 text-sm text-slate-900">or click to browse files</span>
          <span className="mt-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1 text-xs text-slate-800">JSON files only · Maximum 5 MB</span>
        </button>

        {data.error ? (
          <div className="mt-3 flex min-h-[57px] items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <span>{data.error}</span>
            <button type="button" onClick={() => onRemove(level.key)} aria-label="Dismiss error"><X size={18} /></button>
          </div>
        ) : data.file ? (
          <div className={`mt-3 flex min-h-[57px] items-center gap-3 rounded-lg border px-3 py-2 ${styles.file}`}>
            <FileJson size={35} className="shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-950">{data.file.name}</p>
              <p className="text-xs text-slate-700">{formatSize(data.file.size)} · {data.questions.length} questions</p>
            </div>
            <CheckCircle2 size={23} className={styles.check} />
            <button type="button" onClick={() => { onRemove(level.key); if (fileInput.current) fileInput.current.value = ""; }} aria-label="Remove selected file" className="ml-1 text-slate-700 hover:text-red-600"><X size={21} /></button>
          </div>
        ) : (
          <div className="mt-3 flex min-h-[57px] items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2">
            <File size={29} className="shrink-0 text-slate-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">No file selected</p>
              <p className="text-xs text-slate-600">Choose a {level.label} JSON file to preview questions.</p>
            </div>
          </div>
        )}

        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          <div className="flex h-[35px] items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-slate-950">
            <Eye size={19} className="text-blue-600" /> Preview ({data.questions?.length || 0} questions)
          </div>
          {data.questions?.length ? (
            <div className="divide-y divide-slate-200">
              {data.questions.map((question, index) => (
                <div key={`${question.title}-${index}`} className="flex min-h-[35px] items-center gap-3 px-3 py-1.5">
                  <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-sm font-bold text-blue-700">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{question.title || `Question ${index + 1}`}</span>
                  <Code2 size={18} className="shrink-0 text-slate-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[120px] flex-col items-center justify-center px-3 text-center">
              <Monitor size={40} className="mb-2 text-slate-400" />
              <p className="text-sm font-extrabold text-slate-900">No questions to preview</p>
              <p className="mt-1 text-xs text-slate-600">Select a {level.label} JSON file to see the questions.</p>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={
            !data.file ||
            !data.questions?.length ||
            uploading === level.key
          }
          onClick={() => onUpload(level.key)}
          className={`mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-lg text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-900/50 ${styles.upload}`}
        >
          <Upload size={21} />
          {uploading === level.key
            ? "Uploading..."
            : `Upload ${level.label} Questions`}
        </button>
      </div>
    </section>
  );
}

export default function AdminBulkUpload() {
  const [uploads, setUploads] = useState({
    EASY: { file: null, questions: [], error: "" },
    MEDIUM: { file: null, questions: [], error: "" },
    HARD: { file: null, questions: [], error: "" },
  });
  const [stats, setStats] = useState({
    total_questions: 0,
    easy_questions: 0,
    medium_questions: 0,
    hard_questions: 0,
  });
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState("");

  const totalQuestions = Object.values(uploads).reduce((sum, item) => sum + (item.questions?.length || 0), 0);
  const updateFile = (key, value) => setUploads((current) => ({ ...current, [key]: { file: null, questions: [], error: "", ...value } }));
  const removeFile = (key) => setUploads((current) => ({ ...current, [key]: { file: null, questions: [], error: "" } }));


  const fetchStats = async () => {
    try {
      const response = await getCodingQuestionStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load coding question statistics:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  const handleUpload = async (key) => {
    const selected = uploads[key];

    if (!selected.file || !selected.questions.length) {
      setNotice("Please select a valid JSON file first.");
      return;
    }

    try {
      setUploading(key);
      setNotice("");

      const response = await uploadCodingQuestions(
        key,
        selected.file
      );

      setNotice(
        response.message ||
          `${key} questions uploaded successfully.`
      );

      removeFile(key);

      await fetchStats();

    } catch (error) {
      console.error("Bulk upload error:", error);

      const errorData = error.response?.data;

      setNotice(
        errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          "Failed to upload questions. Please try again."
      );

    } finally {
      setUploading("");
    }
  };

  return (
    <AdminDashboardLayout activePage="Coding Questions" adminName="Admin">
      <main className="mx-auto max-w-[1700px] space-y-4 p-4 sm:p-5 xl:p-6">
        <div className="flex items-center gap-3 text-xs text-slate-700">
          <Home size={17} /><span>/</span><span>Coding Questions</span><span>/</span>
          <span className="font-bold text-slate-950">Bulk Upload</span>
        </div>


        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex h-[88px] items-center gap-5 rounded-xl border border-blue-200 bg-blue-50/70 px-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Code2 size={33} /></span>
            <div><p className="text-sm font-bold text-slate-900">Total Questions</p><p className="text-[30px] font-extrabold leading-8 text-slate-950">{stats.total_questions}</p></div>
          </div>
          <div className="flex h-[88px] items-center gap-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Code2 size={33} /></span>
            <div><p className="text-sm font-bold text-slate-900">Easy</p><p className="text-[30px] font-extrabold leading-8 text-slate-950">{stats.easy_questions}</p></div>
          </div>
          <div className="flex h-[88px] items-center gap-5 rounded-xl border border-amber-200 bg-amber-50/70 px-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><ChartNoAxesColumnIncreasing size={33} /></span>
            <div><p className="text-sm font-bold text-slate-900">Medium</p><p className="text-[30px] font-extrabold leading-8 text-slate-950">{stats.medium_questions}</p></div>
          </div>
          <div className="flex h-[88px] items-center gap-5 rounded-xl border border-rose-200 bg-rose-50/70 px-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-100 text-rose-600"><Trophy size={33} /></span>
            <div><p className="text-sm font-bold text-slate-900">Hard</p><p className="text-[30px] font-extrabold leading-8 text-slate-950">{stats.hard_questions}</p></div>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-900">
          <Info size={24} className="mt-0.5 shrink-0 text-blue-600" />
          <p><b>Note:</b> Upload three separate JSON files — one for <b>Easy</b>, one for <b>Medium</b>, and one for <b>Hard</b>. Each file should contain only questions of the selected difficulty.</p>
        </div>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {notice}
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss"><X size={18} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-3">
          {LEVELS.map((level) => (
            <UploadCard
              key={level.key}
              level={level}
              data={uploads[level.key]}
              onFile={updateFile}
              onRemove={removeFile}
              onUpload={handleUpload}
              uploading={uploading}
            />
          ))}
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
