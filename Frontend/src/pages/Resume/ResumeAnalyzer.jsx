import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import Container from "../../components/common/Container";
import {
  Sparkles,
  FileText,
  BrainCircuit,
  ChevronDown,
  Code2,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Layers3,
  MapPin,
CalendarDays,
Building2,
BookOpen,
ExternalLink,
UploadCloud,
Plus,
Award,
Languages,
} from "lucide-react";
import {
  getResumes,
  getResumeDetail,
  saveParsedResumeData,
  getATSAnalysis,
  saveATSAnalysis,
  uploadResume
} from "../../services/resumeService";

import { parseResumeWithAI } from "../../services/ai/resumeParser";
import { analyzeResumeATS } from "../../services/ai/atsAnalyzer";


const ResumeAnalyzer = () => {
    const [resumes, setResumes] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);

    const [uploadTitle, setUploadTitle] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState("");
    const [analysisSuccess, setAnalysisSuccess] = useState(false);

    const [pendingAIResult, setPendingAIResult] = useState(null);
    const [pendingResumeId, setPendingResumeId] = useState(null);

    const [analysisResult, setAnalysisResult] = useState(null);

    const [atsAnalysis, setATSAnalysis] = useState(null);
    const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
    const [atsError, setATSError] = useState("");
    const [atsSuccess, setATSSuccess] = useState(false);

    const [pendingATSResult, setPendingATSResult] = useState(null);
    const [pendingATSResumeId, setPendingATSResumeId] = useState(null);

    const formatDate = (date) => {
        if (!date) return "Present";

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-US",
            {
            month: "short",
            year: "numeric",
            }
        );
    };

    const skillCategoryLabels = {
        TECHNICAL: "Technical Skills",
        TOOLS_TECHNOLOGIES: "Tools & Technologies",
        DOMAIN_KNOWLEDGE: "Domain Knowledge",
        MANAGEMENT: "Management",
        COMMUNICATION: "Communication",
        LEADERSHIP: "Leadership",
        ANALYTICAL: "Analytical Skills",
        CREATIVE: "Creative Skills",
        LANGUAGE: "Languages",
        SOFT_SKILL: "Soft Skills",
        OTHER: "Other",
    };

    const groupedSkills =
        analysisResult?.skills?.reduce((groups, skill) => {
            const category = skill.category || "OTHER";

            if (!groups[category]) {
            groups[category] = [];
            }

            groups[category].push(skill);

            return groups;
        }, {}) || {};


    useEffect(() => {
        const fetchResumes = async () => {
            try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("Authentication required.");
                return;
            }

            const response = await getResumes(token);

            const resumeList =
                response.data.data ??
                response.data.results ??
                response.data;

            if (Array.isArray(resumeList)) {
                setResumes(resumeList);

                if (resumeList.length > 0) {
                setSelectedResumeId(resumeList[0].id);
                }
            }
            } catch (error) {
            console.error("Resume fetch error:", error);
            setError("Unable to load your resumes.");
            } finally {
            setLoading(false);
            }
        };

        fetchResumes();
        }, []);
    

    const loadAnalysisResult = async (resumeId) => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await getResumeDetail(
        resumeId,
        token
        );

        const resume =
        response.data.data ??
        response.data;

        // Check whether this resume actually has
        // saved structured analysis
        const hasAnalysis =
        (resume.skills?.length || 0) > 0 ||
        (resume.experiences?.length || 0) > 0 ||
        (resume.educations?.length || 0) > 0 ||
        (resume.projects?.length || 0) > 0||
        (resume.certifications?.length || 0) > 0 ||
        (resume.languages?.length || 0) > 0;

        if (hasAnalysis) {
        setAnalysisResult(resume);
        } else {
        setAnalysisResult(null);
        }

    } catch (error) {
        console.error(
        "Unable to load analysis result:",
        error
        );

        setAnalysisResult(null);
    }
    };

    const loadATSAnalysis = async (resumeId) => {
        try {
            const token = localStorage.getItem("access_token");

            const response = await getATSAnalysis(
            resumeId,
            token
            );

            const analysis =
            response.data.data ??
            response.data;

            setATSAnalysis(analysis);

        } catch (error) {
            if (error.response?.status === 404) {
            // This resume has not been ATS analyzed yet
            setATSAnalysis(null);
            return;
            }

            console.error(
            "Unable to load ATS analysis:",
            error
            );

            setATSAnalysis(null);
        }
    };

    useEffect(() => {
        // Clear previous resume data immediately
        setAnalysisResult(null);
        setATSAnalysis(null);

        setAnalysisError("");
        setAnalysisSuccess(false);

        setATSError("");
        setATSSuccess(false);

        setPendingAIResult(null);
        setPendingResumeId(null);

        setPendingATSResult(null);
        setPendingATSResumeId(null);

        if (!selectedResumeId) {
            return;
        }

        loadAnalysisResult(selectedResumeId);
        loadATSAnalysis(selectedResumeId);

        }, [selectedResumeId]);

    const handleAnalyzeResume = async () => {
        if (!selectedResumeId || isAnalyzing) {
            return;
        }

        try {
            setIsAnalyzing(true);

            // Clear previous messages
            setAnalysisError("");
            setATSError("");
            setAnalysisSuccess(false);
            setATSSuccess(false);

            const token = localStorage.getItem("access_token");

            // =====================================================
            // 1. GET SELECTED RESUME
            // =====================================================

            const detailResponse = await getResumeDetail(
            selectedResumeId,
            token
            );

            const resume =
            detailResponse.data.data ??
            detailResponse.data;

            // console.log("SELECTED RESUME:", resume);
            // console.log("RESUME ID:", resume.id);
            // console.log("RESUME TITLE:", resume.title);
            // console.log("PARSED TEXT:", resume.parsed_text);

            if (!resume.parsed_text) {
            setAnalysisError(
                "No text could be extracted from this resume."
            );
            return;
            }

            // =====================================================
            // 2. RESUME STRUCTURE ANALYSIS
            // =====================================================

            const aiResult = await parseResumeWithAI(
            resume.parsed_text
            );

            // Keep result in case save fails
            setPendingAIResult(aiResult);
            setPendingResumeId(selectedResumeId);

            await saveParsedResumeData(
            selectedResumeId,
            aiResult,
            token
            );

            // Resume data saved successfully
            setPendingAIResult(null);
            setPendingResumeId(null);

            // Reload skills, experience, education, projects
            await loadAnalysisResult(selectedResumeId);

            // =====================================================
            // 3. ATS ANALYSIS
            // =====================================================

            const atsResult = await analyzeResumeATS(
            resume.parsed_text
            );

            // Keep result in case ATS save fails
            setPendingATSResult(atsResult);
            setPendingATSResumeId(selectedResumeId);

            const atsResponse = await saveATSAnalysis(
            selectedResumeId,
            atsResult,
            token
            );

            const savedATS =
            atsResponse.data.data ??
            atsResponse.data;

            setATSAnalysis(savedATS);

            setPendingATSResult(null);
            setPendingATSResumeId(null);

            // =====================================================
            // 4. COMPLETE
            // =====================================================

            setAnalysisSuccess(true);
            setATSSuccess(true);

        } catch (error) {
            console.error(
            "Resume analysis error:",
            error
            );

            if (error.code === "ERR_NETWORK") {
            setAnalysisError(
                "Analysis completed, but saving was interrupted. Please retry saving."
            );
            } else {
            setAnalysisError(
                "Unable to complete resume analysis. Please try again."
            );
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRetrySave = async () => {
        if (!pendingAIResult || !pendingResumeId) {
            return;
        }

        try {
            setAnalysisError("");

            const token = localStorage.getItem("access_token");

            await saveParsedResumeData(
            pendingResumeId,
            pendingAIResult,
            token
            );

            setPendingAIResult(null);
            setPendingResumeId(null);

            setAnalysisSuccess(true);
            await loadAnalysisResult(pendingResumeId);

        } catch (error) {
            console.error("Retry save error:", error);

            setAnalysisError(
            "Unable to save the analysis yet. Please try again."
            );
        }
    };


    const handleAnalyzeATS = async () => {
        if (!selectedResumeId || isAnalyzingATS) {
            return;
        }

        try {
            setIsAnalyzingATS(true);
            setATSError("");
            setATSSuccess(false);

            const token = localStorage.getItem("access_token");

            // Get resume text
            const detailResponse = await getResumeDetail(
            selectedResumeId,
            token
            );

            const resume =
            detailResponse.data.data ??
            detailResponse.data;

            if (!resume.parsed_text) {
            setATSError(
                "No text could be extracted from this resume."
            );
            return;
            }

            // Analyze resume using Puter
            const atsResult = await analyzeResumeATS(
            resume.parsed_text
            );

            console.log("ATS RESULT:", atsResult);

            // Keep result in case Django save is interrupted
            setPendingATSResult(atsResult);
            setPendingATSResumeId(selectedResumeId);

            // Save result
            const saveResponse = await saveATSAnalysis(
            selectedResumeId,
            atsResult,
            token
            );

            const savedAnalysis =
            saveResponse.data.data ??
            saveResponse.data;

            setATSAnalysis(savedAnalysis);

            setPendingATSResult(null);
            setPendingATSResumeId(null);

            setATSSuccess(true);

        } catch (error) {
            console.error("ATS analysis error:", error);

            if (error.code === "ERR_NETWORK") {
            setATSError(
                "ATS analysis completed, but saving was interrupted. Please retry saving."
            );
            } else {
            setATSError(
                "Unable to analyze ATS score. Please try again."
            );
            }
        } finally {
            setIsAnalyzingATS(false);
        }
    };

    const handleRetryATSSave = async () => {
    if (!pendingATSResult || !pendingATSResumeId) {
        return;
    }

    try {
        setATSError("");

        const token = localStorage.getItem("access_token");

        const response = await saveATSAnalysis(
        pendingATSResumeId,
        pendingATSResult,
        token
        );

        const savedAnalysis =
        response.data.data ??
        response.data;

        setATSAnalysis(savedAnalysis);

        setPendingATSResult(null);
        setPendingATSResumeId(null);

        setATSSuccess(true);

    } catch (error) {
        console.error(
        "ATS retry save error:",
        error
        );

        setATSError(
        "Unable to save the ATS analysis. Please try again."
        );
    }
    };


    const handleResumeUpload = async () => {
        // console.log("UPLOAD BUTTON CLICKED");
        // console.log("UPLOAD FILE:", uploadFile);
        // console.log("UPLOAD TITLE:", uploadTitle);
  if (!uploadFile) {
    setUploadError("Please select a resume.");
    return;
  }

  try {
    setUploading(true);
    setUploadError("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setUploadError("Authentication required.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "title",
      uploadTitle.trim() ||
        uploadFile.name.replace(/\.[^/.]+$/, "")
    );

    formData.append("resume_file", uploadFile);

    const response = await uploadResume(
      formData,
      token
    );

    const newResume =
      response.data.data ??
      response.data;

    // console.log("NEW RESUME:", newResume);
    // console.log("NEW RESUME ID:", newResume?.id);

    // Clear old resume result immediately
    setAnalysisResult(null);
    setATSAnalysis(null);

    // Refresh dropdown
    const listResponse = await getResumes(token);

    const resumeList =
      listResponse.data.data ??
      listResponse.data.results ??
      listResponse.data;

    if (Array.isArray(resumeList)) {
      setResumes(resumeList);
    }

    // Select NEW resume
    if (newResume?.id) {
      setSelectedResumeId(newResume.id);
    } else {
      console.error(
        "Uploaded resume response has no ID:",
        newResume
      );

      setUploadError(
        "Resume uploaded, but its ID was not returned."
      );

      return;
    }

    setUploadFile(null);
    setUploadTitle("");

  } catch (error) {
    console.error(
      "Resume upload failed:",
      error
    );

    setUploadError(
      error.response?.data?.message ||
        "Failed to upload resume. Please try again."
    );
  } finally {
    setUploading(false);
  }
};

    return (
        <UserLayout>
            <Container>
                <div className="py-8 sm:py-10">
                    

                        {/* AI Resume Analyzer Control */}
                        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        {/* Top accent */}
                        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

                        <div className="p-5 sm:p-6 lg:p-7">

                            {/* Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-200">
                                <BrainCircuit className="h-5 w-5 text-white" />
                                </div>

                                <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                    AI Resume Analysis
                                    </h2>

                                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                    AI Powered
                                    </span>
                                </div>

                                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                    Select a resume and let InterviewIQ identify your skills,
                                    experience, education, projects, and professional profile.
                                </p>
                                </div>

                            </div>

                            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                Smart Analysis
                            </div>

                            </div>


                            {/* Divider */}
                            <div className="my-6 h-px bg-slate-100" />


                            {/* Loading */}
                            {loading ? (
                            <div className="flex min-h-[84px] items-center justify-center">

                                <div className="flex items-center gap-3 text-sm text-slate-500">

                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                                Loading your resumes...

                                </div>

                            </div>
                            ) : error ? (

                            /* Error */
                            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                <p className="text-sm font-medium text-red-600">
                                {error}
                                </p>
                            </div>

                            ) : resumes.length === 0 ? (

                            /* No Resume */
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8">

                            <div className="mx-auto max-w-lg text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                <FileText className="h-5 w-5 text-slate-400" />
                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-800">
                                No resume available
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                Upload your first resume to start AI analysis.
                                </p>

                                <input
                                id="first-resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                    setUploadFile(file);

                                    setUploadTitle(
                                        file.name.replace(/\.[^/.]+$/, "")
                                    );

                                    setUploadError("");
                                    }
                                }}
                                />

                                {!uploadFile ? (
                                <label
                                    htmlFor="first-resume-upload"
                                    className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <UploadCloud className="h-5 w-5" />
                                    Select Resume
                                </label>
                                ) : (
                                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-left">

                                    <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                        {uploadFile.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                        setUploadFile(null);
                                        setUploadTitle("");
                                        setUploadError("");
                                        }}
                                        className="text-sm font-medium text-slate-500 hover:text-red-500"
                                    >
                                        Remove
                                    </button>

                                    </div>

                                    <button
                                    type="button"
                                    onClick={handleResumeUpload}
                                    disabled={uploading}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                    <UploadCloud className="h-4 w-4" />

                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Resume"}
                                    </button>

                                </div>
                                )}

                                {uploadError && (
                                <p className="mt-3 text-sm text-red-600">
                                    {uploadError}
                                </p>
                                )}

                            </div>

                            </div>
                            ) : (

                            /* Resume Selection */
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

                                <div className="flex-1">

                                <label
                                    htmlFor="resume"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Select Resume
                                </label>

                                <div>
                                    <div className="relative">

                                        {/* Select wrapper */}
                                        <div className="relative">

                                            <div className="pointer-events-none absolute left-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-blue-50">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            </div>

                                            <select
                                            id="resume"
                                            value={selectedResumeId}
                                            onChange={(e) => {
                                                const newResumeId = e.target.value;

                                                setAnalysisResult(null);
                                                setATSAnalysis(null);

                                                setAnalysisSuccess(false);
                                                setATSSuccess(false);

                                                setAnalysisError("");
                                                setATSError("");

                                                setSelectedResumeId(newResumeId);

                                                console.log(
                                                "SELECTED RESUME ID:",
                                                newResumeId
                                                );
                                            }}
                                            className="h-14 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-14 pr-11 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                            >
                                            {resumes.map((resume) => (
                                                <option
                                                key={resume.id}
                                                value={String(resume.id)}
                                                >
                                                {resume.title} - {resume.id.slice(0, 8)}
                                                </option>
                                            ))}
                                            </select>

                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                        </div>

                                        <div className="mt-4">
                                        <input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (file) {
                                                setUploadFile(file);
                                                setUploadTitle(
                                                file.name.replace(/\.[^/.]+$/, "")
                                                );
                                                setUploadError("");
                                            }
                                            }}
                                        />

                                        {!uploadFile ? (
                                            <label
                                            htmlFor="resume-upload"
                                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                            <UploadCloud className="h-5 w-5" />
                                            Upload New Resume
                                            </label>
                                        ) : (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {uploadFile.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                                </div>

                                                <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadFile(null);
                                                    setUploadTitle("");
                                                    setUploadError("");
                                                }}
                                                className="text-sm font-medium text-slate-500 hover:text-red-500"
                                                >
                                                Remove
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleResumeUpload}
                                                disabled={uploading}
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <UploadCloud className="h-4 w-4" />

                                                {uploading ? "Uploading..." : "Upload Resume"}
                                            </button>
                                            </div>
                                        )}

                                        {uploadError && (
                                            <p className="mt-2 text-sm text-red-600">
                                            {uploadError}
                                            </p>
                                        )}
                                        </div>

                                    </div>

                                </div>
                                </div>

                                {/* Analyze Button */}
                                <button
                                type="button"
                                onClick={handleAnalyzeResume}
                                disabled={
                                    !selectedResumeId ||
                                    loading ||
                                    isAnalyzing
                                }
                                className="group flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 lg:min-w-[180px]"
                                >

                                {isAnalyzing ? (
                                    <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Analyzing...
                                    </>
                                ) : (
                                    <>
                                    <Sparkles className="h-4 w-4" />
                                    Analyze Resume
                                    </>
                                )}

                                </button>

                            </div>

                            )}


                            {/* Analysis Error */}
                            {analysisError && (
                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-sm font-medium text-red-600">
                                    {analysisError}
                                </p>

                                {pendingAIResult && (
                                    <button
                                    type="button"
                                    onClick={handleRetrySave}
                                    className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                                    >
                                    Retry Save
                                    </button>
                                )}

                                </div>

                            </div>
                            )}


                            {/* Success */}
                            {analysisSuccess && (
                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">

                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                                ✓
                                </div>

                                <p className="text-sm font-medium text-emerald-700">
                                Resume analyzed successfully.
                                </p>

                            </div>
                            )}

                        </div>
                        </div>

                        {/* Resume Analysis Results */}
                        {analysisResult && (
                        <div className="mt-8 space-y-6">

                            {/* Analysis Overview */}
                        
                            <div>
                                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                                            Resume Analysis
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Overview of the information detected from your resume.
                                        </p>
                                    </div>

                                    <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Analysis complete
                                    </div>
                                </div>


                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                                    {/* Skills */}
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50">

                                        <div className="flex items-start justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                            <Code2 className="h-5 w-5" />
                                            </div>

                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                            Skills
                                            </span>
                                        </div>

                                        <div className="mt-5">
                                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                            {analysisResult.skills?.length || 0}
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                            Skills Detected
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                            Professional & technical skills
                                            </p>
                                        </div>
                                    </div>


                                    {/* Experience */}
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50">

                                        <div className="flex items-start justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                                <BriefcaseBusiness className="h-5 w-5" />
                                            </div>

                                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                                            Career
                                            </span>
                                        </div>

                                        <div className="mt-5">
                                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                            {analysisResult.experiences?.length || 0}
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                            Experience
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                            Positions detected
                                            </p>
                                        </div>
                                    </div>


                                    {/* Projects */}
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/50">

                                        <div className="flex items-start justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                            <FolderKanban className="h-5 w-5" />
                                            </div>

                                            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-600">
                                            Work
                                            </span>
                                        </div>

                                        <div className="mt-5">
                                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                            {analysisResult.projects?.length || 0}
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                            Projects
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                            Projects identified
                                            </p>
                                        </div>
                                    </div>


                                    {/* Education */}
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-slate-200/50">

                                        <div className="flex items-start justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
                                            <GraduationCap className="h-5 w-5" />
                                            </div>

                                            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                                            Academic
                                            </span>
                                        </div>

                                        <div className="mt-5">
                                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                            {analysisResult.educations?.length || 0}
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                            Education
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                            Qualifications detected
                                            </p>
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <div className="mb-8 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                                            <Award className="h-6 w-6 text-amber-500" />
                                            </div>

                                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                                            CERTIFIED
                                            </span>
                                        </div>

                                        <p className="text-3xl font-bold text-slate-950">
                                            {analysisResult?.certifications?.length || 0}
                                        </p>

                                        <p className="mt-1 font-medium text-slate-800">
                                            Certifications
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Certifications detected
                                        </p>
                                    </div>

                                    {/* Languages */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <div className="mb-8 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                                            <Languages className="h-6 w-6 text-emerald-500" />
                                            </div>

                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                            LANGUAGE
                                            </span>
                                        </div>

                                        <p className="text-3xl font-bold text-slate-950">
                                            {analysisResult?.languages?.length || 0}
                                        </p>

                                        <p className="mt-1 font-medium text-slate-800">
                                            Languages
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Languages detected
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* ATS Score */}
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                                {/* Header */}
                                <div className="border-b border-slate-100 px-5 py-5 sm:px-6 lg:px-7">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Target className="h-5 w-5" />
                                        </div>

                                        <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-semibold text-slate-900">
                                            ATS Resume Score
                                            </h2>

                                            {atsAnalysis && (
                                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                Analyzed
                                            </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            AI-powered analysis of your resume's ATS readiness.
                                        </p>
                                        </div>

                                    </div>


                                    {atsAnalysis && (
                                        <button
                                            type="button"
                                            onClick={handleAnalyzeATS}
                                            disabled={!selectedResumeId || isAnalyzingATS}
                                            className="group flex w-fit items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                        >
                                            {isAnalyzingATS ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Re-analyzing...
                                            </>
                                            ) : (
                                            <>
                                                <RefreshCw className="h-4 w-4" />
                                                Re-analyze ATS
                                            </>
                                            )}
                                        </button>
                                    )}

                                    </div>
                                </div>


                                {/* =====================================================
                                    ATS RESULT
                                ====================================================== */}

                                {atsAnalysis ? (

                                    <div className="p-5 sm:p-6 lg:p-7">

                                    {/* Overall Score */}
                                    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">

                                        {/* Score */}
                                        <div className="flex justify-center lg:justify-start">

                                        <div className="relative flex h-44 w-44 items-center justify-center">

                                            {/* Outer Circle */}
                                            <div
                                            className="absolute inset-0 rounded-full"
                                            style={{
                                                background: `conic-gradient(
                                                #2563eb ${
                                                    Math.min(
                                                    Number(atsAnalysis.ats_score || 0),
                                                    100
                                                    ) * 3.6
                                                }deg,
                                                #e2e8f0 0deg
                                                )`,
                                            }}
                                            />

                                            {/* White Inner Circle */}
                                            <div className="absolute inset-[10px] rounded-full bg-white" />


                                            <div className="relative text-center">

                                            <div className="flex items-end justify-center">
                                                <span className="text-4xl font-bold tracking-tight text-slate-950">
                                                {Math.round(
                                                    Number(
                                                    atsAnalysis.ats_score
                                                    )
                                                )}
                                                </span>

                                                <span className="mb-1 ml-1 text-sm font-semibold text-slate-400">
                                                /100
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                ATS Score
                                            </p>

                                            </div>

                                        </div>

                                        </div>


                                        {/* Summary */}
                                        <div>

                                        <div className="flex items-center gap-2">

                                            <TrendingUp className="h-5 w-5 text-blue-600" />

                                            <h3 className="text-lg font-semibold text-slate-900">
                                            ATS Readiness
                                            </h3>

                                        </div>


                                        {atsAnalysis.summary && (
                                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                            {atsAnalysis.summary}
                                            </p>
                                        )}


                                        {/* Disclaimer */}
                                        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                                            <p className="text-xs leading-5 text-slate-500">
                                            This score is an AI-generated readiness estimate
                                            and may differ from the scoring methods used by
                                            individual employers or ATS platforms.
                                            </p>

                                        </div>

                                        </div>

                                    </div>


                                    {/* =====================================================
                                        SECTION SCORES
                                    ====================================================== */}

                                    {atsAnalysis.section_scores && (
                                        <div className="mt-8 border-t border-slate-100 pt-7">

                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">
                                            Section Performance
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                            See how each part of your resume performs.
                                            </p>
                                        </div>


                                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                            {Object.entries(
                                            atsAnalysis.section_scores
                                            ).map(([section, score]) => (

                                            <div
                                                key={section}
                                                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                <span className="text-sm font-medium capitalize text-slate-700">
                                                    {section.replaceAll("_", " ")}
                                                </span>

                                                <span className="text-sm font-bold text-slate-900">
                                                    {score}
                                                    <span className="font-medium text-slate-400">
                                                    /100
                                                    </span>
                                                </span>

                                                </div>


                                                {/* Progress Bar */}
                                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
                                                    style={{
                                                    width: `${Math.min(
                                                        Number(score),
                                                        100
                                                    )}%`,
                                                    }}
                                                />

                                                </div>

                                            </div>

                                            ))}

                                        </div>

                                        </div>
                                    )}


                                    {/* =====================================================
                                        STRENGTHS + AREAS TO IMPROVE
                                    ====================================================== */}

                                    <div className="mt-8 grid gap-5 lg:grid-cols-2">

                                        {/* Strengths */}
                                        {atsAnalysis.strengths?.length > 0 && (
                                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 sm:p-6">

                                            <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                Strengths
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                What your resume does well
                                                </p>
                                            </div>

                                            </div>


                                            <div className="mt-5 space-y-3">

                                            {atsAnalysis.strengths.map(
                                                (strength, index) => (

                                                <div
                                                    key={index}
                                                    className="flex gap-3"
                                                >

                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                    ✓
                                                    </span>

                                                    <p className="text-sm leading-6 text-slate-600">
                                                    {strength}
                                                    </p>

                                                </div>

                                                )
                                            )}

                                            </div>

                                        </div>
                                        )}


                                        {/* Areas To Improve */}
                                        {atsAnalysis.weaknesses?.length > 0 && (
                                        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 sm:p-6">

                                            <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                                <AlertTriangle className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                Areas to Improve
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                Opportunities to strengthen your resume
                                                </p>
                                            </div>

                                            </div>


                                            <div className="mt-5 space-y-3">

                                            {atsAnalysis.weaknesses.map(
                                                (weakness, index) => (

                                                <div
                                                    key={index}
                                                    className="flex gap-3"
                                                >

                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                                                    !
                                                    </span>

                                                    <p className="text-sm leading-6 text-slate-600">
                                                    {weakness}
                                                    </p>

                                                </div>

                                                )
                                            )}

                                            </div>

                                        </div>
                                        )}

                                    </div>


                                    {/* =====================================================
                                        RECOMMENDATIONS
                                    ====================================================== */}

                                    {atsAnalysis.suggestions?.length > 0 && (
                                        <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-5 sm:p-6">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <Lightbulb className="h-5 w-5" />
                                            </div>

                                            <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Recommendations
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Practical improvements suggested by InterviewIQ
                                            </p>
                                            </div>

                                        </div>


                                        <div className="mt-5 grid gap-3 lg:grid-cols-2">

                                            {atsAnalysis.suggestions.map(
                                            (suggestion, index) => (

                                                <div
                                                key={index}
                                                className="flex gap-3 rounded-xl border border-blue-100/70 bg-white/70 p-4"
                                                >

                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                                                    {index + 1}
                                                </span>

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {suggestion}
                                                </p>

                                                </div>

                                            )
                                            )}

                                        </div>

                                        </div>
                                    )}

                                    </div>

                                ) : (

                                /* =====================================================
                                EMPTY ATS STATE
                                ====================================================== */

                                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                                        <Target className="h-6 w-6 text-slate-400" />
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                        ATS analysis not generated yet
                                    </h3>

                                    <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                                        Analyze your resume to see its ATS readiness score,
                                        section performance, strengths, and recommendations.
                                    </p>

                                </div>

                            )}


                            {/* =====================================================
                                ERROR
                            ====================================================== */}

                            {atsError && (
                                <div className="mx-5 mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 sm:mx-6 lg:mx-7">

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                    <p className="text-sm font-medium text-red-600">
                                    {atsError}
                                    </p>

                                    {pendingATSResult && (
                                    <button
                                        type="button"
                                        onClick={handleRetryATSSave}
                                        className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Retry Save
                                    </button>
                                    )}

                                </div>

                                </div>
                            )}


                            {/* =====================================================
                                SUCCESS
                            ====================================================== */}

                            {atsSuccess && (
                                <div className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 sm:mx-6 lg:mx-7">

                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                                <p className="text-sm font-medium text-emerald-700">
                                    ATS analysis completed successfully.
                                </p>

                                </div>
                            )}

                            </div>


                            {/* Skills */}
                            {analysisResult.skills?.length > 0 && (
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                                {/* Header */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Layers3 className="h-5 w-5" />
                                    </div>

                                    <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Skills Detected
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Skills identified from your resume and grouped by category.
                                    </p>
                                    </div>

                                </div>


                                {/* Total Skills */}
                                <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                                    <span className="text-xs font-semibold text-blue-600">
                                    {analysisResult.skills.length}
                                    </span>

                                    <span className="text-xs font-medium text-blue-500">
                                    Total Skills
                                    </span>

                                </div>

                                </div>


                                {/* Skill Categories */}
                                <div className="p-5 sm:p-6">

                                <div className="grid gap-4 lg:grid-cols-2">

                                    {Object.entries(groupedSkills).map(
                                    ([category, skills]) => (

                                        <div
                                        key={category}
                                        className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-md hover:shadow-slate-100"
                                        >

                                        {/* Category Header */}
                                        <div className="flex items-center justify-between gap-3">

                                            <div className="flex items-center gap-2.5">

                                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                                            <h3 className="text-sm font-semibold text-slate-800">
                                                {skillCategoryLabels[category] || category}
                                            </h3>

                                            </div>


                                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-slate-500 shadow-sm">
                                            {skills.length}
                                            </span>

                                        </div>


                                        {/* Skills */}
                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                {skill.name}
                                            </span>
                                            ))}

                                        </div>

                                        </div>

                                    )
                                    )}

                                </div>

                                </div>

                            </div>
                            )}

                            {/* Experience */}
                            {analysisResult.experiences?.length > 0 && (
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                                {/* Header */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BriefcaseBusiness className="h-5 w-5" />
                                    </div>

                                    <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Professional Experience
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Work experience identified from your resume.
                                    </p>
                                    </div>

                                </div>


                                {/* Position Count */}
                                <div className="flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5">

                                    <span className="text-xs font-semibold text-indigo-600">
                                    {analysisResult.experiences.length}
                                    </span>

                                    <span className="text-xs font-medium text-indigo-500">
                                    {analysisResult.experiences.length === 1
                                        ? "Position"
                                        : "Positions"}
                                    </span>

                                </div>

                                </div>


                                {/* Experience Timeline */}
                                <div className="p-5 sm:p-6 lg:p-7">

                                <div className="relative">

                                    {analysisResult.experiences.map(
                                    (experience, index) => (

                                        <div
                                        key={experience.id}
                                        className="relative flex gap-4 sm:gap-5"
                                        >

                                        {/* Timeline */}
                                        <div className="flex shrink-0 flex-col items-center">

                                            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                                            <Building2 className="h-4 w-4" />
                                            </div>


                                            {index !==
                                            analysisResult.experiences.length - 1 && (
                                            <div className="my-2 min-h-8 w-px flex-1 bg-slate-200" />
                                            )}

                                        </div>


                                        {/* Content */}
                                        <div
                                            className={`min-w-0 flex-1 ${
                                            index !==
                                            analysisResult.experiences.length - 1
                                                ? "pb-7"
                                                : ""
                                            }`}
                                        >

                                            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all duration-300 hover:border-indigo-100 hover:bg-white hover:shadow-md hover:shadow-slate-100">

                                            {/* Title + Date */}
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

                                                <div>

                                                <h3 className="text-base font-semibold text-slate-900">
                                                    {experience.designation}
                                                </h3>


                                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">

                                                    <span className="text-sm font-semibold text-slate-600">
                                                    {experience.company}
                                                    </span>


                                                    {experience.location && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">

                                                        <MapPin className="h-3.5 w-3.5" />

                                                        {experience.location}

                                                    </span>
                                                    )}

                                                </div>

                                                </div>


                                                {/* Date */}
                                                <div className="flex w-fit shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">

                                                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                                                <span className="whitespace-nowrap text-xs font-medium text-slate-500">

                                                    {formatDate(
                                                    experience.start_date
                                                    )}

                                                    <span className="mx-1.5 text-slate-300">
                                                    —
                                                    </span>

                                                    {experience.currently_working
                                                    ? "Present"
                                                    : formatDate(
                                                        experience.end_date
                                                        )}

                                                </span>

                                                </div>

                                            </div>


                                            {/* Employment Type */}
                                            {experience.employment_type && (
                                                <div className="mt-4">

                                                <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                                                    {experience.employment_type
                                                    .replaceAll("_", " ")
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (letter) =>
                                                        letter.toUpperCase()
                                                    )}
                                                </span>

                                                </div>
                                            )}


                                            {/* Description */}
                                            {experience.description && (
                                                <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-600">
                                                {experience.description}
                                                </p>
                                            )}

                                            </div>

                                        </div>

                                        </div>

                                    )
                                    )}

                                </div>

                                </div>

                            </div>
                            )}

                            {/* Education */}
                            {analysisResult.educations?.length > 0 && (
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                                {/* Header */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <GraduationCap className="h-5 w-5" />
                                    </div>

                                    <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Education
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Academic qualifications identified from your resume.
                                    </p>
                                    </div>

                                </div>

                                {/* Count */}
                                <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5">

                                    <span className="text-xs font-semibold text-cyan-600">
                                    {analysisResult.educations.length}
                                    </span>

                                    <span className="text-xs font-medium text-cyan-600">
                                    {analysisResult.educations.length === 1
                                        ? "Qualification"
                                        : "Qualifications"}
                                    </span>

                                </div>

                                </div>


                                {/* Education List */}
                                <div className="p-5 sm:p-6 lg:p-7">

                                <div className="grid gap-4 lg:grid-cols-2">

                                    {analysisResult.educations.map((education) => (

                                    <div
                                        key={education.id}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-white hover:shadow-md hover:shadow-slate-100"
                                    >

                                        {/* Small accent */}
                                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-70" />


                                        <div className="flex items-start gap-4">

                                        {/* Icon */}
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
                                            <BookOpen className="h-5 w-5" />
                                        </div>


                                        <div className="min-w-0 flex-1">

                                            {/* Degree */}
                                            <h3 className="text-base font-semibold leading-6 text-slate-900">
                                            {education.degree}
                                            </h3>


                                            {/* Institution */}
                                            <p className="mt-1 text-sm font-semibold text-slate-600">
                                            {education.institution}
                                            </p>


                                            {/* Field */}
                                            {education.field_of_study && (
                                            <span className="mt-3 inline-flex rounded-lg border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                                                {education.field_of_study}
                                            </span>
                                            )}


                                            {/* Date */}
                                            <div className="mt-4 flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">

                                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                                            <span className="text-xs font-medium text-slate-500">

                                                {formatDate(education.start_date)}

                                                <span className="mx-1.5 text-slate-300">
                                                —
                                                </span>

                                                {formatDate(education.end_date)}

                                            </span>

                                            </div>

                                        </div>

                                        </div>

                                    </div>

                                    ))}

                                </div>

                                </div>

                            </div>
                            )}

                            {/* Projects */}
                            {analysisResult.projects?.length > 0 && (
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                                {/* Header */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <FolderKanban className="h-5 w-5" />
                                    </div>

                                    <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Projects
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Projects and technologies identified from your resume.
                                    </p>
                                    </div>

                                </div>


                                {/* Project Count */}
                                <div className="flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5">

                                    <span className="text-xs font-semibold text-violet-600">
                                    {analysisResult.projects.length}
                                    </span>

                                    <span className="text-xs font-medium text-violet-500">
                                    {analysisResult.projects.length === 1
                                        ? "Project"
                                        : "Projects"}
                                    </span>

                                </div>

                                </div>


                                {/* Projects Grid */}
                                <div className="p-5 sm:p-6 lg:p-7">

                                <div className="grid gap-5 lg:grid-cols-2">

                                    {analysisResult.projects.map((project) => (

                                    <div
                                        key={project.id}
                                        className="group flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50"
                                    >

                                        {/* Project Header */}
                                        <div className="flex items-start justify-between gap-4">

                                        <div className="flex min-w-0 items-start gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                            <FolderKanban className="h-4 w-4" />
                                            </div>


                                            <div className="min-w-0">

                                            <h3 className="text-base font-semibold leading-6 text-slate-900">
                                                {project.title}
                                            </h3>


                                            {/* Project Date */}
                                            {(project.start_date ||
                                                project.end_date) && (

                                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">

                                                <CalendarDays className="h-3.5 w-3.5" />

                                                <span>
                                                    {formatDate(project.start_date)}

                                                    <span className="mx-1">
                                                    —
                                                    </span>

                                                    {formatDate(project.end_date)}
                                                </span>

                                                </div>

                                            )}

                                            </div>

                                        </div>

                                        </div>


                                        {/* Description */}
                                        {project.description && (
                                        <p className="mt-4 text-sm leading-7 text-slate-600">
                                            {project.description}
                                        </p>
                                        )}


                                        {/* Technologies */}
                                        {project.technologies && (
                                        <div className="mt-5">

                                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Technologies
                                            </p>

                                            <div className="flex flex-wrap gap-2">

                                            {project.technologies
                                                .split(",")
                                                .map((technology) =>
                                                technology.trim()
                                                )
                                                .filter(Boolean)
                                                .map((technology) => (

                                                <span
                                                    key={technology}
                                                    className="rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700"
                                                >
                                                    {technology}
                                                </span>

                                                ))}

                                            </div>

                                        </div>
                                        )}


                                        {/* Spacer keeps links aligned at bottom */}
                                        <div className="flex-1" />


                                        {/* Links */}
                                        {(project.github_url ||
                                        project.live_url) && (

                                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">

                                            {project.github_url && (

                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                            >

                                                GitHub

                                            </a>

                                            )}


                                            {project.live_url && (

                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                                            >

                                                <ExternalLink className="h-4 w-4" />

                                                Live Project

                                            </a>

                                            )}

                                        </div>

                                        )}

                                    </div>

                                    ))}

                                </div>

                                </div>

                            </div>
                            )}

                            {/* Certifications */}
                            {analysisResult?.certifications?.length > 0 && (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-7 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                                    <Award className="h-6 w-6 text-amber-500" />
                                    </div>

                                    <div>
                                    <h3 className="text-xl font-semibold text-slate-950">
                                        Certifications
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Professional certifications and training
                                    </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-600">
                                    {analysisResult.certifications.length}{" "}
                                    {analysisResult.certifications.length === 1
                                    ? "Certification"
                                    : "Certifications"}
                                </span>
                                </div>

                                {/* Certification Cards */}
                                <div className="p-7">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {analysisResult.certifications.map(
                                    (certification) => (
                                        <div
                                        key={certification.id}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/40 p-5"
                                        >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                                            <Award className="h-5 w-5 text-amber-500" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-slate-950">
                                            {certification.name}
                                            </h4>

                                            {certification.issuer && (
                                            <p className="mt-1 text-sm text-slate-600">
                                                {certification.issuer}
                                            </p>
                                            )}

                                            {(certification.start_date ||
                                            certification.end_date) && (
                                            <p className="mt-2 text-sm text-slate-400">
                                                {certification.start_date
                                                ? new Date(
                                                    certification.start_date
                                                    ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                    })
                                                : ""}

                                                {certification.start_date &&
                                                certification.end_date &&
                                                " – "}

                                                {certification.end_date
                                                ? new Date(
                                                    certification.end_date
                                                    ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                    })
                                                : ""}
                                            </p>
                                            )}
                                        </div>
                                        </div>
                                    )
                                    )}
                                </div>
                                </div>
                            </div>
                            )}

                            {/* Languages */}
                            {analysisResult?.languages?.length > 0 && (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-7 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                                    <Languages className="h-6 w-6 text-emerald-500" />
                                    </div>

                                    <div>
                                    <h3 className="text-xl font-semibold text-slate-950">
                                        Languages
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Languages and communication proficiency
                                    </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-600">
                                    {analysisResult.languages.length}{" "}
                                    {analysisResult.languages.length === 1
                                    ? "Language"
                                    : "Languages"}
                                </span>
                                </div>

                                {/* Language Cards */}
                                <div className="p-7">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {analysisResult.languages.map((language) => (
                                    <div
                                        key={language.id}
                                        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/40 p-5"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                        <Languages className="h-5 w-5 text-emerald-500" />
                                        </div>

                                        <div>
                                        <h4 className="font-semibold text-slate-950">
                                            {language.name}
                                        </h4>

                                        {language.proficiency && (
                                            <p className="mt-1 text-sm text-slate-500">
                                            {language.proficiency}
                                            </p>
                                        )}
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                            )}

                        </div>
                        )}
                </div>
            </Container>
        </UserLayout>
    );
};

export default ResumeAnalyzer;