
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  Mail,
  CalendarDays,
  UserRound,
  CheckCircle2,
  Clock,
  BrainCircuit,
  ThumbsUp,
  Target,
  Lightbulb,
  History,
  ChevronLeft,
  Minus,
  Plus,
  Maximize,
  Check,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  X,
  AlertCircle,
  Award,
  Languages,
  FolderGit2,
  LoaderCircle,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import {
  getAdminResumeDetails,
  downloadAdminResume,
  deleteAdminResume,
} from "../../../services/adminService";

/* ---------------- HELPERS ---------------- */

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDisplayName = (candidate) => {
  if (!candidate) return "Unknown Candidate";

  const fullName = [candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    candidate.name ||
    fullName ||
    candidate.username ||
    "Unknown Candidate"
  );
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

const getText = (value, fallback = "Not available") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

const getStatusLabel = (status) => {
  const labels = {
    COMPLETED: "Completed",
    PROCESSING: "Processing",
    PENDING: "Pending",
    FAILED: "Failed",
  };

  return labels[status] || status || "Unknown";
};

const getScore = (resume) => {
  if (resume?.upload_status !== "COMPLETED") return null;

  const score =
    resume?.ats_analysis?.score ?? resume?.ats_score;

  if (score === null || score === undefined || score === "") {
    return null;
  }

  const parsed = Number(score);

  return Number.isFinite(parsed) ? parsed : null;
};

const getSkillName = (item) => {
  if (typeof item === "string") return item;

  return (
    item?.skill_name ||
    item?.skill?.name ||
    item?.name ||
    item?.other_skill ||
    "Unnamed skill"
  );
};

const getItemText = (item) => {
  if (typeof item === "string") return item;

  return (
    item?.description ||
    item?.title ||
    item?.name ||
    JSON.stringify(item)
  );
};

/* ---------------- STATUS BADGE ---------------- */

const StatusBadge = ({ status }) => {
  const completed = status === "COMPLETED";
  const failed = status === "FAILED";

  const style = completed
    ? "bg-emerald-100 text-emerald-700"
    : failed
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${style}`}
    >
      {completed ? (
        <CheckCircle2 size={15} />
      ) : (
        <Clock size={15} />
      )}

      {getStatusLabel(status)}
    </span>
  );
};

/* ---------------- ATS SCORE CIRCLE ---------------- */

const ScoreCircle = ({ score }) => {
  if (score === null || score === undefined) {
    return (
      <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-gray-200">
        <span className="text-2xl font-bold text-gray-500">
          —
        </span>
        <span className="text-xs text-gray-500">
          No score
        </span>
      </div>
    );
  }

  const safeScore = Math.max(0, Math.min(100, Number(score)));

  return (
    <div
      className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#2563EB ${safeScore * 3.6}deg, #E5E7EB 0deg)`,
      }}
    >
      <div className="flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-white">
        <span className="text-2xl font-bold text-gray-950">
          {safeScore.toFixed(1)}%
        </span>

        <span className="text-xs text-gray-600">
          ATS Score
        </span>
      </div>
    </div>
  );
};

/* ---------------- SKILL TAG ---------------- */

const SkillTag = ({ skill }) => (
  <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800">
    {skill}
  </span>
);

/* ---------------- EMPTY MESSAGE ---------------- */

const EmptyMessage = ({
  message = "No information available.",
}) => (
  <p className="py-4 text-sm text-gray-500">
    {message}
  </p>
);

/* ---------------- SECTION HEADING ---------------- */

const SectionHeading = ({ icon: Icon, children }) => (
  <h3 className="flex items-center gap-2 font-bold text-gray-900">
    <Icon size={19} className="text-blue-700" />
    {children}
  </h3>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminResumeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resume, setResume] = useState(null);

  const [activeTab, setActiveTab] = useState("analysis");

  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);

  // PDF preview state
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  // Page loading and actions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ---------------- FETCH RESUME DETAILS ---------------- */

  useEffect(() => {
    let isMounted = true;

    const fetchResumeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminResumeDetails(id);

        if (!response?.success || !response?.data) {
          throw new Error(
            response?.message ||
              "Unable to load resume details."
          );
        }

        if (isMounted) {
          setResume(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.detail ||
              err.message ||
              "Something went wrong while loading resume details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchResumeDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ---------------- LOAD AUTHENTICATED PDF PREVIEW ---------------- */

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const loadResumePreview = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");
        setPreviewUrl("");

        const response = await downloadAdminResume(id);

        const blob = response.data;

        if (!(blob instanceof Blob) || blob.size === 0) {
          throw new Error("The resume file is empty or invalid.");
        }

        // Validate that the server returned a PDF.
        const contentType =
          response.headers?.["content-type"] ||
          blob.type ||
          "";

        if (
          contentType.includes("application/json") ||
          contentType.includes("text/html")
        ) {
          throw new Error(
            "The server did not return a PDF file."
          );
        }

        const pdfBlob = new Blob([blob], {
          type: "application/pdf",
        });

        objectUrl = window.URL.createObjectURL(pdfBlob);

        if (isMounted) {
          setPreviewUrl(objectUrl);
        }
      } catch (err) {
        if (isMounted) {
          setPreviewError(
            err.response?.data?.detail ||
              err.message ||
              "Unable to load the PDF preview."
          );
        }
      } finally {
        if (isMounted) {
          setPreviewLoading(false);
        }
      }
    };

    if (id) {
      loadResumePreview();
    }

    return () => {
      isMounted = false;

      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id]);

  /* ---------------- DERIVED DATA ---------------- */

  const candidate = resume?.candidate || {};
  const atsAnalysis = resume?.ats_analysis || {};

  const candidateName = getDisplayName(candidate);

  const fileName =
    resume?.file_name ||
    resume?.resume_file?.split("/").pop() ||
    "Resume document";

  const score = getScore(resume);

  const skills = useMemo(
    () =>
      toArray(resume?.skills)
        .map(getSkillName)
        .filter(Boolean),
    [resume?.skills]
  );

  const strengths = toArray(atsAnalysis?.strengths);
  const weaknesses = toArray(atsAnalysis?.weaknesses);
  const suggestions = toArray(atsAnalysis?.suggestions);

  const educations = toArray(resume?.educations);
  const experiences = toArray(resume?.experiences);
  const projects = toArray(resume?.projects);
  const certifications = toArray(resume?.certifications);
  const languages = toArray(resume?.languages);

  const uploadedDate = formatDate(resume?.created_at);
  const uploadedTime = formatTime(resume?.created_at);

  /* ---------------- DOWNLOAD RESUME ---------------- */

  const handleDownload = async () => {
    try {
      setActionLoading(true);

      const response = await downloadAdminResume(id);

      const blob = new Blob([response.data], {
        type:
          response.headers?.["content-type"] ||
          "application/pdf",
      });

      if (!blob.size) {
        throw new Error("Downloaded file is empty.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Unable to download the resume."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- OPEN FULL PDF ---------------- */

  const handleFullScreen = () => {
    if (!previewUrl) return;

    window.open(
      previewUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ---------------- DELETE RESUME ---------------- */

  const handleDelete = async () => {
    try {
      setActionLoading(true);

      await deleteAdminResume(id);

      setShowDeleteModal(false);

      navigate("/admin/resumes/all", {
        state: {
          message: "Resume deleted successfully.",
        },
      });
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to delete the resume."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- RETRY PDF PREVIEW ---------------- */

  const handleRetryPreview = async () => {
    try {
      setPreviewLoading(true);
      setPreviewError("");

      const response = await downloadAdminResume(id);

      const blob = response.data;

      if (!(blob instanceof Blob) || !blob.size) {
        throw new Error("The PDF file is empty or invalid.");
      }

      const contentType =
        response.headers?.["content-type"] ||
        blob.type ||
        "";

      if (
        contentType.includes("application/json") ||
        contentType.includes("text/html")
      ) {
        throw new Error(
          "The server did not return a PDF file."
        );
      }

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const newUrl = window.URL.createObjectURL(pdfBlob);

      setPreviewUrl((oldUrl) => {
        if (oldUrl) {
          window.URL.revokeObjectURL(oldUrl);
        }

        return newUrl;
      });
    } catch (err) {
      setPreviewError(
        err.message || "Unable to load PDF preview."
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  /* ---------------- LOADING STATE ---------------- */

  if (loading) {
    return (
      <AdminDashboardLayout activePage="Resumes">
        <div className="flex min-h-[70vh] items-center justify-center bg-[#F4F6FC]">
          <div className="text-center">
            <LoaderCircle
              size={38}
              className="mx-auto animate-spin text-blue-700"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
              Loading resume details...
            </p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  /* ---------------- ERROR STATE ---------------- */

  if (error || !resume) {
    return (
      <AdminDashboardLayout activePage="Resumes">
        <div className="min-h-screen bg-[#F4F6FC] p-4 md:p-6">
          <button
            onClick={() => navigate("/admin/resumes/all")}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft size={18} />
            Back to All Resumes
          </button>

          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <AlertCircle
              size={38}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-3 text-lg font-bold text-gray-900">
              Unable to load resume
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {error || "The requested resume could not be found."}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <AdminDashboardLayout activePage="Resumes">
      <div className="min-h-screen space-y-4 bg-[#F4F6FC] p-4 md:p-6">

        {/* BREADCRUMB */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Home size={16} />
          <ChevronRight size={14} />

          <span>Resumes</span>

          <ChevronRight size={14} />

          <button
            onClick={() => navigate("/admin/resumes/all")}
            className="hover:text-blue-700"
          >
            All Resumes
          </button>

          <ChevronRight size={14} />

          <span className="font-semibold text-gray-900">
            Resume Details
          </span>
        </div>

        {/* PAGE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div></div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={actionLoading || !resume.resume_file}
              className="flex h-[46px] items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={19} />
              Download
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={actionLoading}
              className="flex h-[46px] items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={19} />
              Delete
            </button>
          </div>
        </div>

        {/* CANDIDATE PROFILE CARD */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-5 xl:grid-cols-12">

            <div className="flex items-center gap-4 xl:col-span-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                {candidateName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-950">
                  {candidateName}
                </h2>

                <p className="mt-2 flex items-center gap-2 break-all text-sm text-gray-600">
                  <Mail size={16} className="shrink-0" />
                  {getText(candidate.email)}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                  <CalendarDays size={17} />
                  Joined: {formatDate(candidate.date_joined)}
                </p>
              </div>
            </div>

            {/* FILE */}

            <div className="border-t border-gray-100 pt-4 xl:col-span-2 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-1 text-blue-700"
                  size={25}
                />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">
                    Resume File
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-800">
                    {fileName}
                  </p>
                </div>
              </div>
            </div>

            {/* UPLOAD DATE */}

            <div className="border-t border-gray-100 pt-4 xl:col-span-2 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
              <div className="flex items-start gap-3">
                <CalendarDays
                  className="mt-1 text-gray-800"
                  size={25}
                />

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Uploaded On
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {uploadedDate}
                  </p>

                  <p className="text-sm text-gray-700">
                    {uploadedTime}
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div className="border-t border-gray-100 pt-4 xl:col-span-2 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-1 text-green-600"
                  size={25}
                />

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Analysis Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={resume.upload_status} />
                  </div>
                </div>
              </div>
            </div>

            {/* SCORE */}

            <div className="flex items-center justify-center rounded-2xl bg-blue-50 p-4 xl:col-span-2">
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-800">
                  ATS Score
                </p>

                <h2 className="mt-1 text-4xl font-bold text-blue-700">
                  {score === null ? "—" : `${score}%`}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">

          {/* PDF PREVIEW */}

          <div className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm xl:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <FileText size={27} className="text-blue-700" />

              <h2 className="text-lg font-bold text-gray-950">
                Resume Preview
              </h2>
            </div>

            {/* PDF TOOLBAR */}

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border border-gray-200 bg-gray-50 px-3 py-3">

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPageNumber((p) => Math.max(1, p - 1))
                  }
                  disabled={pageNumber === 1}
                  className="rounded p-1 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="rounded border border-gray-300 bg-white px-3 py-1 text-sm">
                  Page {pageNumber}
                </span>

                <button
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="rounded p-1 text-gray-700 hover:bg-gray-200"
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <button
                  onClick={() =>
                    setZoom((z) => Math.max(60, z - 10))
                  }
                  disabled={zoom <= 60}
                  className="rounded p-1.5 text-gray-800 hover:bg-gray-200 disabled:opacity-40"
                >
                  <Minus size={19} />
                </button>

                <select
                  value={zoom}
                  onChange={(e) =>
                    setZoom(Number(e.target.value))
                  }
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium outline-none"
                >
                  <option value={60}>60%</option>
                  <option value={80}>80%</option>
                  <option value={100}>100%</option>
                  <option value={120}>120%</option>
                  <option value={150}>150%</option>
                </select>

                <button
                  onClick={() =>
                    setZoom((z) => Math.min(150, z + 10))
                  }
                  disabled={zoom >= 150}
                  className="rounded p-1.5 text-gray-800 hover:bg-gray-200 disabled:opacity-40"
                >
                  <Plus size={19} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  title="Open full PDF"
                  onClick={handleFullScreen}
                  disabled={!previewUrl}
                  className="rounded p-1.5 text-gray-800 hover:bg-gray-200 disabled:opacity-40"
                >
                  <Maximize size={19} />
                </button>

                <button
                  title="Download PDF"
                  onClick={handleDownload}
                  disabled={actionLoading || !resume.resume_file}
                  className="rounded p-1.5 text-gray-800 hover:bg-gray-200 disabled:opacity-40"
                >
                  <Download size={19} />
                </button>
              </div>
            </div>

            {/* AUTHENTICATED PDF PREVIEW */}

            <div className="min-h-[580px] flex-1 overflow-hidden rounded-b-xl border border-t-0 border-gray-200 bg-[#EEF0F6]">

              {previewLoading ? (
                <div className="flex h-[580px] flex-col items-center justify-center">
                  <LoaderCircle
                    size={38}
                    className="animate-spin text-blue-700"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600">
                    Loading resume preview...
                  </p>
                </div>
              ) : previewError ? (
                <div className="flex h-[580px] flex-col items-center justify-center p-6 text-center">
                  <AlertCircle
                    size={42}
                    className="text-red-500"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Preview unavailable
                  </p>

                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    {previewError}
                  </p>

                  <button
                    onClick={handleRetryPreview}
                    className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={actionLoading}
                    className="mt-3 text-sm font-semibold text-blue-700 hover:underline"
                  >
                    Download Resume
                  </button>
                </div>
              ) : previewUrl ? (
                <iframe
                  key={previewUrl}
                  src={`${previewUrl}#page=${pageNumber}&zoom=${zoom}`}
                  title="Candidate resume preview"
                  className="h-[640px] w-full bg-white"
                />
              ) : (
                <div className="flex h-[580px] flex-col items-center justify-center p-6 text-center">
                  <FileText
                    size={42}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Resume preview is not available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ANALYSIS PANEL */}

          <div className="flex min-h-[640px] flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm xl:col-span-7">

            {/* TABS */}

            <div className="grid grid-cols-3 gap-1 rounded-xl border border-gray-100 bg-[#F5F6FB] p-1">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex items-center justify-center gap-2 rounded-lg px-2 py-3 text-xs font-bold sm:text-sm ${
                  activeTab === "analysis"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-800 hover:bg-white"
                }`}
              >
                <BrainCircuit size={18} />
                AI Analysis
              </button>

              <button
                onClick={() => setActiveTab("extracted")}
                className={`flex items-center justify-center gap-2 rounded-lg px-2 py-3 text-xs font-bold sm:text-sm ${
                  activeTab === "extracted"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-800 hover:bg-white"
                }`}
              >
                <UserRound size={18} />
                Extracted Info
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center justify-center gap-2 rounded-lg px-2 py-3 text-xs font-bold sm:text-sm ${
                  activeTab === "history"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-800 hover:bg-white"
                }`}
              >
                <History size={18} />
                Version History
              </button>
            </div>

            {/* AI ANALYSIS TAB */}

            {activeTab === "analysis" && (
              <div className="mt-5 space-y-5">

                {/* SCORE AND SUMMARY */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="flex items-center justify-center border-b border-gray-100 pb-4 md:col-span-4 md:border-b-0 md:border-r md:pb-0">
                    <ScoreCircle score={score} />
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 shadow-sm md:col-span-8">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-950">
                      <FileText
                        size={18}
                        className="text-blue-700"
                      />
                      AI Summary
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                      {getText(
                        atsAnalysis.summary,
                        "AI summary is not available for this resume."
                      )}
                    </p>
                  </div>
                </div>

                {/* STRENGTHS AND WEAKNESSES */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 bg-emerald-100 px-4 py-3">
                      <ThumbsUp
                        size={19}
                        className="text-green-700"
                      />

                      <h3 className="text-sm font-bold text-green-800">
                        Strengths
                      </h3>
                    </div>

                    <div className="space-y-3 p-4">
                      {strengths.length ? (
                        strengths.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2
                              size={17}
                              className="mt-0.5 shrink-0 text-green-600"
                            />

                            <p className="text-sm text-gray-800">
                              {getItemText(item)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <EmptyMessage message="No strengths available." />
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 bg-orange-100 px-4 py-3">
                      <Target
                        size={19}
                        className="text-orange-700"
                      />

                      <h3 className="text-sm font-bold text-orange-800">
                        Areas to Improve
                      </h3>
                    </div>

                    <div className="space-y-3 p-4">
                      {weaknesses.length ? (
                        weaknesses.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2"
                          >
                            <AlertCircle
                              size={17}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />

                            <p className="text-sm text-gray-800">
                              {getItemText(item)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <EmptyMessage message="No improvement areas available." />
                      )}
                    </div>
                  </div>
                </div>

                {/* AI SUGGESTIONS */}

                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 bg-blue-100 px-4 py-3">
                    <Lightbulb
                      size={20}
                      className="text-blue-700"
                    />

                    <h3 className="text-sm font-bold text-blue-900">
                      AI Suggestions
                    </h3>
                  </div>

                  <div className="space-y-3 p-4">
                    {suggestions.length ? (
                      suggestions.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >
                          <Check
                            size={19}
                            className="mt-0.5 shrink-0 text-blue-700"
                          />

                          <p className="text-sm leading-5 text-gray-800">
                            {getItemText(item)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <EmptyMessage message="No AI suggestions available." />
                    )}
                  </div>
                </div>

                {/* SECTION SCORES */}

                {atsAnalysis.section_scores &&
                  typeof atsAnalysis.section_scores === "object" &&
                  (
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h3 className="font-bold text-gray-900">
                        Section Scores
                      </h3>

                      <div className="mt-4 space-y-4">
                        {Object.entries(
                          atsAnalysis.section_scores
                        ).map(([section, value]) => {
                          const numericValue = Number(
                            typeof value === "object"
                              ? value?.score
                              : value
                          );

                          return (
                            <div key={section}>
                              <div className="mb-1 flex justify-between gap-3 text-sm">
                                <span className="font-medium capitalize text-gray-700">
                                  {section.replaceAll("_", " ")}
                                </span>

                                <span className="font-semibold text-gray-900">
                                  {Number.isFinite(numericValue)
                                    ? `${numericValue}%`
                                    : getText(value)}
                                </span>
                              </div>

                              {Number.isFinite(numericValue) && (
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                      width: `${Math.max(
                                        0,
                                        Math.min(100, numericValue)
                                      )}%`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* EXTRACTED INFORMATION TAB */}

            {activeTab === "extracted" && (
              <div className="mt-5 space-y-5">

                {/* CANDIDATE INFORMATION */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={UserRound}>
                    Candidate Information
                  </SectionHeading>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Full Name
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {candidateName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                        {getText(candidate.email)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Username
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {getText(candidate.username)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {candidate.is_active === undefined
                          ? "Not available"
                          : candidate.is_active
                            ? "Active"
                            : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={Code2}>
                    Extracted Technical Skills
                  </SectionHeading>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.map((skill, index) => (
                        <SkillTag
                          key={`${skill}-${index}`}
                          skill={skill}
                        />
                      ))
                    ) : (
                      <EmptyMessage message="No skills found." />
                    )}
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={BriefcaseBusiness}>
                    Work Experience
                  </SectionHeading>

                  {experiences.length ? (
                    experiences.map((experience, index) => (
                      <div
                        key={experience.id || index}
                        className="mt-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {getText(experience.designation)}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {getText(experience.company)}
                            </p>
                          </div>

                          <span className="text-xs text-gray-500">
                            {formatDate(experience.start_date)} –{" "}
                            {experience.currently_working
                              ? "Present"
                              : formatDate(experience.end_date)}
                          </span>
                        </div>

                        {experience.employment_type && (
                          <p className="mt-2 text-xs text-gray-500">
                            {experience.employment_type}
                            {experience.location
                              ? ` · ${experience.location}`
                              : ""}
                          </p>
                        )}

                        {experience.description && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <EmptyMessage message="No work experience found." />
                  )}
                </div>

                {/* EDUCATION */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={GraduationCap}>
                    Education
                  </SectionHeading>

                  {educations.length ? (
                    educations.map((education, index) => (
                      <div
                        key={education.id || index}
                        className="mt-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <p className="text-sm font-bold text-gray-900">
                          {getText(education.degree)}
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {getText(education.institution)}
                        </p>

                        {education.field_of_study && (
                          <p className="mt-1 text-sm text-gray-600">
                            {education.field_of_study}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(education.start_date)} –{" "}
                          {formatDate(education.end_date)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyMessage message="No education details found." />
                  )}
                </div>

                {/* PROJECTS */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={FolderGit2}>
                    Projects
                  </SectionHeading>

                  {projects.length ? (
                    projects.map((project, index) => (
                      <div
                        key={project.id || index}
                        className="mt-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <p className="text-sm font-bold text-gray-900">
                          {getText(project.title)}
                        </p>

                        {project.description && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                            {project.description}
                          </p>
                        )}

                        {project.technologies && (
                          <p className="mt-2 text-xs text-gray-600">
                            Technologies:{" "}
                            {Array.isArray(project.technologies)
                              ? project.technologies.join(", ")
                              : project.technologies}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-3 text-xs">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-blue-700 hover:underline"
                            >
                              GitHub
                            </a>
                          )}

                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-blue-700 hover:underline"
                            >
                              Live Project
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyMessage message="No projects found." />
                  )}
                </div>

                {/* CERTIFICATIONS */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={Award}>
                    Certifications
                  </SectionHeading>

                  {certifications.length ? (
                    certifications.map((certification, index) => (
                      <div
                        key={certification.id || index}
                        className="mt-4"
                      >
                        <p className="text-sm font-bold text-gray-900">
                          {getText(certification.name)}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {getText(certification.issuer)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(certification.issue_date)}
                          {certification.expiry_date
                            ? ` – ${formatDate(certification.expiry_date)}`
                            : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyMessage message="No certifications found." />
                  )}
                </div>

                {/* LANGUAGES */}

                <div className="rounded-xl border border-gray-200 p-4">
                  <SectionHeading icon={Languages}>
                    Languages
                  </SectionHeading>

                  {languages.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {languages.map((language, index) => (
                        <span
                          key={language.id || index}
                          className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
                        >
                          {getText(language.name)}
                          {language.proficiency
                            ? ` · ${language.proficiency}`
                            : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyMessage message="No languages found." />
                  )}
                </div>

                {/* PARSED TEXT */}

                {resume.parsed_text && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <SectionHeading icon={FileText}>
                      Parsed Resume Text
                    </SectionHeading>

                    <div className="mt-4 max-h-80 overflow-y-auto rounded-lg bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {resume.parsed_text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VERSION HISTORY TAB */}

            {activeTab === "history" && (
              <div className="mt-5">
                <h3 className="text-base font-bold text-gray-900">
                  Resume Version History
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Previous resume uploads from this candidate.
                </p>

                <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                  <History
                    size={36}
                    className="mx-auto text-gray-400"
                  />

                  <h4 className="mt-3 text-sm font-bold text-gray-800">
                    Version history is not available
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    The current backend does not yet provide an API
                    for retrieving previous resume versions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DELETE CONFIRMATION MODAL */}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-3 text-red-600">
                    <Trash2 size={22} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    Delete Resume?
                  </h3>
                </div>

                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={19} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{fileName}</strong>? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading && (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  Delete Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
