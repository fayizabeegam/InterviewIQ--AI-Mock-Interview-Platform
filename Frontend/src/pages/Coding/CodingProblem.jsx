
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Code2,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
  Play,
  Send,
  Maximize,
  Minimize,
  FlaskConical,
  Terminal,
  Lightbulb,
  MessageCircle,
  SlidersHorizontal,
  CheckCircle2,
  LockKeyhole,
  X,
} from "lucide-react";
import UserLayout from "../../components/layout/UserLayout";
import { fetchCodingQuestionDetail } from "../../services/codingService";

const LANGUAGES = [
  { value: "PYTHON", label: "Python 3", file: "main.py", icon: "🐍" },
  { value: "JAVA", label: "Java", file: "Main.java", icon: "☕" },
  { value: "JAVASCRIPT", label: "JavaScript", file: "main.js", icon: "🟨" },
  { value: "C", label: "C", file: "main.c", icon: "🔵" },
  { value: "CPP", label: "C++", file: "main.cpp", icon: "🔷" },
  { value: "CSHARP", label: "C#", file: "Program.cs", icon: "🟣" },
];

const STARTER_CODE = {
  PYTHON: {
    "Palindrome Number": `number = int(input())

# Write your solution here
print(str(number) == str(number)[::-1])`,

    "Reverse a String": `text = input()

# Write your solution here
print(text[::-1])`,

    "Two Sum": `def two_sum(nums, target):
    # Write your solution here
    pass

nums = list(map(int, input().split()))
target = int(input())
print(two_sum(nums, target))`,
  },
};

const getStarterCode = (lang, title) => {
  const questionCode = STARTER_CODE[lang]?.[title];

  if (questionCode) {
    return questionCode;
  }

  return lang === "PYTHON"
    ? "# Write your solution here"
    : "// Write your solution here";
};

export default function CodingProblem() {

  const [language, setLanguage] = useState("PYTHON");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("Problem");
  const [bottomTab, setBottomTab] = useState("Test Cases");
  const [customInput, setCustomInput] = useState("");
  const [expandedCases, setExpandedCases] = useState([0]);
  const [message, setMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  
  const selectedLanguage = LANGUAGES.find(
    (item) => item.value === language
  );

  const { questionId } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const testCases = problem
    ? [{
        input: problem.sample_input || "",
        output: problem.sample_output || "",
        explanation: problem.explanation || "",
      }]
    : [];

  const changeLanguage = (value) => {
    setLanguage(value);
    setCode(getStarterCode(value, problem?.title));
    setMessage("");
  };

  const toggleCase = (index) => {
    setExpandedCases((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Code copied to clipboard.");
    } catch {
      setMessage("Unable to copy code.");
    }
  };

  const resetCode = () => {
    setCode(getStarterCode(language, problem?.title));
    setMessage("Starter code restored.");
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setMessage("Full-screen mode is unavailable.");
    }
  };

  const handleRun = () => {
    setMessage(
      "Code execution is not connected yet. Connect a secure code execution service to run test cases."
    );
  };

  const handleSubmit = () => {
    setMessage(
      "Submission service is not connected yet. Your code has not been evaluated."
    );
  };

  useEffect(() => {
    let cancelled = false;

    const loadProblem = async () => {
        try {
        const data = await fetchCodingQuestionDetail(questionId);
        console.log("Question detail response:", data);
        if (!cancelled) {
          setProblem(data);
          setCode(getStarterCode(language, data.title));
          setCustomInput(data.sample_input || "");
          setExpandedCases([0]);
        }
        } catch (err) {
          console.error("Detail API error:", err.response?.status);
          console.error("Detail API response:", err.response?.data);
          console.error("Full error:", err);
          if (!cancelled) {
            setError(
              err.response?.data?.detail ||
              "Unable to load this coding question."
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
    };

    if (questionId) {
        loadProblem();
    }

    return () => {
        cancelled = true;
    };
  }, [questionId]);

  useEffect(() => {
    if (problem) {
      setCode(getStarterCode(language, problem.title));
    }
  }, [language, problem]);

  if (loading) {
    return (
      <UserLayout backgroundClass="bg-[#071323]">
        <div className="flex min-h-screen items-center justify-center bg-[#071323] text-slate-200">
          Loading coding question...
        </div>
      </UserLayout>
    );
  }

  if (error || !problem) {
    return (
      <UserLayout backgroundClass="bg-[#071323]">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#071323] text-slate-200">
          <p>{error || "Coding question not found."}</p>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Back to Challenges
          </button>
        </div>
      </UserLayout>
    );
  }

 
  
  return (
    <UserLayout backgroundClass="bg-[#071323]">
      <div
        className={`min-h-screen bg-[#071323] text-slate-100 ${
          isFullscreen ? "p-3" : ""
        }`}
      >


        {/* Workspace */}
        <main
          className={`mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-[0.88fr_1.18fr] ${
            isFullscreen ? "min-h-[calc(100vh-24px)]" : ""
          }`}
        >
          {/* Left: Problem description */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-[#1b3049] bg-[#091729]">
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-sky-300"
              >
                <ArrowLeft size={18} />
                Back to Challenges
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                aria-label="Bookmark problem"
                className={bookmarked ? "text-sky-400" : "text-slate-400"}
              >
                <Bookmark
                  size={21}
                  fill={bookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="px-5 pb-4 pt-3">
              <h1 className=" !text-white text-2xl font-bold tracking-tight">
                {problem.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  ♟ {problem.difficulty || "Difficulty not set"}
                </span>
                <span className="rounded-lg bg-[#122741] px-3 py-1.5 text-xs text-sky-300">
                  ◉ Arrays
                </span>
                <span className="rounded-lg bg-[#182941] px-3 py-1.5 text-xs text-slate-200">
                  Hash Table
                </span>
              </div>
            </div>

            {/* Problem tabs */}
            <div className="flex flex-wrap border-b border-[#263a53] px-4">
              {[
                { label: "Problem", icon: Code2 },
                { label: "Submissions", icon: SlidersHorizontal },
                { label: "Solution", icon: Lightbulb },
                { label: "Discuss", icon: MessageCircle },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm transition sm:px-4 ${
                    activeTab === label
                      ? "border-sky-400 bg-sky-500/[0.06] text-white"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-4 p-5">
              {activeTab === "Problem" && (
                <>
                  <div>
                    <h2 className="!text-white mb-2 text-lg font-semibold">
                      Problem Statement
                    </h2>
                    <p className="text-[15px] leading-6 text-slate-200">
                      {problem?.problem_statement || "No problem description available."}
                    </p>
                    {problem.input_format && (
                      <div className="mt-4">
                        <h3 className="mb-1 font-semibold text-white">Input Format</h3>
                        <p className="whitespace-pre-line text-[15px] leading-6 text-slate-300">
                          {problem.input_format}
                        </p>
                      </div>
                    )}
                    {problem.output_format && (
                      <div className="mt-3">
                        <h3 className="mb-1 font-semibold text-white">Output Format</h3>
                        <p className="whitespace-pre-line text-[15px] leading-6 text-slate-300">
                          {problem.output_format}
                        </p>
                      </div>
                    )}
                  </div>

                  {testCases.map((test, index) => (
                    <article
                      key={test.input}
                      className="rounded-xl border border-[#182d46] bg-[#102138] px-4 py-3"
                    >
                      <h3 className="mb-3 font-semibold text-white">
                        Example {index + 1}
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
                        <strong className="text-white">Input:</strong>{" "}
                        {test.input || "No sample input provided."}
                      </p>
                      <p className="text-sm leading-6 text-slate-300">
                        <strong className="text-white">Output:</strong>{" "}
                        {test.output || "No sample output provided."}
                      </p>
                      {test.explanation && (
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
                          <strong className="text-white">Explanation:</strong>{" "}
                          {test.explanation}
                        </p>
                      )}
                    </article>
                  ))}

                  <div>
                    <h2 className=" !text-white mb-2 text-lg font-semibol">
                      Constraints
                    </h2>
                    <p className="whitespace-pre-line font-mono text-sm leading-5 text-slate-300">
                      {problem?.constraints || "No constraints specified."}
                    </p>
                  </div>
                </>
              )}

              {activeTab === "Submissions" && (
                <div className="py-12 text-center">
                  <SlidersHorizontal
                    className="mx-auto mb-3 text-slate-500"
                    size={30}
                  />
                  <h2 className="font-semibold text-white">Your submissions</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Submission history will appear here once the API is
                    connected.
                  </p>
                </div>
              )}

              {activeTab === "Solution" && (
                <div className="py-12 text-center">
                  <Lightbulb
                    className="mx-auto mb-3 text-amber-300"
                    size={30}
                  />
                  <h2 className="font-semibold text-white">
                    Solution and hints
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Hints and AI-powered explanations can be added later.
                  </p>
                </div>
              )}

              {activeTab === "Discuss" && (
                <div className="py-12 text-center">
                  <MessageCircle
                    className="mx-auto mb-3 text-slate-500"
                    size={30}
                  />
                  <h2 className="font-semibold text-white">
                    Community discussion
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Discussion features are not connected yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right: Code editor and test cases */}
          <section className="flex min-w-0 flex-col gap-3">
            {/* Editor */}
            <div className="overflow-hidden rounded-xl border border-[#203752] bg-[#091525]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b3049] p-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="language"
                    className="text-sm text-slate-300"
                  >
                    Language
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      value={language}
                      onChange={(event) =>
                        changeLanguage(event.target.value)
                      }
                      className="w-48 appearance-none rounded-lg border border-[#314762] bg-[#0b1b2e] py-2.5 pl-3 pr-9 text-sm text-white outline-none focus:border-sky-500"
                    >
                      {LANGUAGES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.icon} {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRun}
                    className="flex items-center gap-2 rounded-lg border border-sky-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500/10"
                  >
                    <Play size={16} fill="currentColor" />
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    <Send size={16} />
                    Submit
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    aria-label="Toggle full screen"
                    className="rounded-lg p-2 text-slate-300 transition hover:bg-[#182b43] hover:text-white"
                  >
                    {isFullscreen ? (
                      <Minimize size={19} />
                    ) : (
                      <Maximize size={19} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-[#263b54] bg-[#0c1a2b]">
                <div className="flex items-center gap-2 border-b-2 border-sky-500 bg-[#10243a] px-4 py-3 text-sm text-white">
                  <Code2 size={15} className="text-sky-400" />
                  {selectedLanguage.file}
                </div>

                <div className="flex items-center gap-3 px-4 text-sm text-slate-300">
                  <button
                    onClick={copyCode}
                    title="Copy code"
                    className="hover:text-sky-300"
                  >
                    <Copy size={18} />
                  </button>
                  <span className="h-5 border-l border-[#31445b]" />
                  <button
                    onClick={resetCode}
                    className="flex items-center gap-2 hover:text-sky-300"
                  >
                    <RotateCcw size={15} />
                    <span className="hidden sm:inline">Reset Code</span>
                  </button>
                </div>
              </div>

              <div className="flex min-h-[340px] bg-[#0a1524] sm:min-h-[345px]">
                <div className="select-none border-r border-[#172b41] bg-[#0d1b2d] px-3 py-3 text-right font-mono text-sm leading-[27px] text-slate-500 sm:px-5">
                  {(code || "").split("\n").map((_, index) => (
                    <div key={index}>{index + 1}</div>
                  ))}
                </div>
                <textarea
                  aria-label="Code editor"
                  spellCheck={false}
                  value={code || ""}
                  onChange={(event) => setCode(event.target.value)}
                  className="min-h-[340px] w-full resize-y bg-transparent p-3 font-mono text-sm leading-[27px] text-sky-100 outline-none selection:bg-sky-500/30 sm:min-h-[345px] sm:p-4"
                />
              </div>

              {message && (
                <div className="flex items-start gap-2 border-t border-[#263b54] bg-[#10243a] px-4 py-3 text-sm text-sky-200">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                  <p className="flex-1">{message}</p>
                  <button
                    onClick={() => setMessage("")}
                    aria-label="Dismiss message"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Test cases */}
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[#203752] bg-[#091525]">
              <div className="flex border-b border-[#263b54]">
                <button
                  onClick={() => setBottomTab("Test Cases")}
                  className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
                    bottomTab === "Test Cases"
                      ? "border-sky-400 bg-sky-500/[0.06] text-sky-300"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  <FlaskConical size={17} />
                  Test Cases
                </button>
                <button
                  onClick={() => setBottomTab("Custom Input")}
                  className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm ${
                    bottomTab === "Custom Input"
                      ? "border-sky-400 bg-sky-500/[0.06] text-sky-300"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  <Terminal size={17} />
                  Custom Input
                </button>
              </div>

              {bottomTab === "Test Cases" ? (
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex rounded-lg border border-[#263b54] bg-[#0d1d30] p-0.5">
                      <span className="rounded-md border border-sky-500 bg-sky-500/10 px-3 py-2 text-xs text-sky-300">
                        Sample Test Cases
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400">
                        <LockKeyhole size={13} />
                        All Test Cases
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {testCases.length} sample {testCases.length === 1 ? "case" : "cases"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {testCases.map((test, index) => (
                      <article
                        key={test.input}
                        className="overflow-hidden rounded-xl border border-[#1b3049] bg-[#102137]"
                      >
                        <button
                          onClick={() => toggleCase(index)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left"
                        >
                          {expandedCases.includes(index) ? (
                            <ChevronDown size={17} />
                          ) : (
                            <ChevronRight size={17} />
                          )}
                          <span className="text-sm font-medium text-white">
                            Test Case {index + 1}
                          </span>
                        </button>

                        {expandedCases.includes(index) && (
                          <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2">
                            <div className="min-w-0">
                              <p className="mb-2 text-sm text-slate-300">
                                Input
                              </p>
                              <pre className="min-h-[72px] overflow-x-auto whitespace-pre-wrap rounded-lg border border-[#243a53] bg-[#15273d] p-3 font-mono text-sm leading-6 text-white">
                                {test.input}
                              </pre>
                            </div>
                            <div className="min-w-0">
                              <p className="mb-2 text-sm text-slate-300">
                                Expected Output
                              </p>
                              <pre className="min-h-[72px] overflow-x-auto whitespace-pre-wrap rounded-lg border border-[#243a53] bg-[#15273d] p-3 font-mono text-sm leading-6 text-white">
                                {test.output}
                              </pre>
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5">
                  <label
                    htmlFor="custom-input"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Enter custom input
                  </label>
                  <textarea
                    id="custom-input"
                    value={customInput}
                    onChange={(event) => setCustomInput(event.target.value)}
                    placeholder="Enter input for your program..."
                    className="min-h-32 w-full rounded-lg border border-[#263b54] bg-[#102137] p-3 font-mono text-sm leading-6 text-white outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleRun}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
                  >
                    <Play size={15} />
                    Run with Custom Input
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </UserLayout>
  );
}
