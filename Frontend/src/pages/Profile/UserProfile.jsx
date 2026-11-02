import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  FileText,
  BriefcaseBusiness,
  Video,
  Mail,
  CalendarDays,
  Pencil,
  LockKeyhole,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import UserLayout from "../../components/layout/UserLayout";
import { getUserProfile } from "../../services/ProfileService";
import { getResumes } from "../../services/resumeService";



const UserProfile = () => {

  const navigate = useNavigate();


  // =====================================================
  // PROFILE DATA
  // =====================================================

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savedResumes, setSavedResumes] = useState(0);


  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoading(true);
        setProfileError("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getUserProfile(token);

        console.log("Profile API:", response.data);

        setProfile(response.data.data);

        const resumeResponse = await getResumes(token);

        setSavedResumes(
          Array.isArray(resumeResponse.data)
            ? resumeResponse.data.length
            : 0
        );

      } catch (error) {

        console.error(
          "Failed to fetch profile:",
          error.response?.data || error
        );

        setProfileError("Unable to load profile information.");

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, [navigate]);


  // =====================================================
  // DISPLAY VALUES
  // =====================================================

  const fullName = `${profile?.first_name || ""} ${
    profile?.last_name || ""
  }`.trim();


  const displayName =
    fullName ||
    profile?.username ||
    "User";


  const email =
    profile?.email ||
    "No email available";


  const initial =
    displayName.charAt(0).toUpperCase();


  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      )
    : "Not available";


  // Real values will be connected later

  const jobMatches = "—";
  const aiInterviews = "—";


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <UserLayout>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="min-h-screen bg-[#f8fafc]">

        <div className="mx-auto w-full max-w-[1450px] px-5 pb-12 pt-3 sm:px-8 lg:px-10">


          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md shadow-blue-200">

                <UserRound className="h-5 w-5 text-white" />

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-[22px] font-bold tracking-tight text-slate-900">
                    My Profile
                  </h2>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                    Account
                  </span>

                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage your personal information and InterviewIQ account settings.
                </p>

              </div>

            </div>

            <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-slate-700 sm:flex">

              <Sparkles
                size={15}
                className="text-blue-600"
              />

              Personal Profile

            </div>

          </div>


          {/* =================================================
              PROFILE HERO
          ================================================= */}

          <section className="relative mt-2.5 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

            {/* SOFT DECORATIVE BACKGROUND */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80" />

            <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-120px] left-[35%] h-64 w-64 rounded-full bg-violet-200/20 blur-3xl" />


            <div className="relative flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">


              {/* USER */}

              <div className="flex items-center gap-5">

                {/* INITIAL AVATAR */}

                <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 text-[34px] font-semibold text-white shadow-lg shadow-blue-200/50">

                  {loading ? "..." : initial}

                </div>


                {/* DETAILS */}

                <div className="min-w-0">

                  <h2 className="truncate text-2xl font-bold tracking-tight text-slate-900">

                    {loading
                      ? "Loading..."
                      : displayName}

                  </h2>

                  <p className="mt-1.5 truncate text-sm text-slate-500">

                    {loading
                      ? "Loading profile..."
                      : email}

                  </p>


                  {!loading && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">

                        {/* Joined Date */}
                        {memberSince !== "Not available" && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <CalendarDays
                              size={14}
                              className="text-slate-400"
                            />

                            Joined {memberSince}
                          </span>
                        )}

                        {/* LinkedIn */}
                        {profile?.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-blue-600"
                          >
                            <FaLinkedin
                              size={15}
                              className="text-blue-600"
                            />

                            LinkedIn
                          </a>
                        )}

                        {/* GitHub */}
                        {profile?.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                          >
                            <FaGithub
                              size={15}
                              className="text-slate-700"
                            />

                            GitHub
                          </a>
                        )}

                      </div>
                  )}

                </div>

              </div>


              {/* EDIT PROFILE */}

              <button

                type="button"

                onClick={() =>
                  navigate("/user-profile/edit")
                }

                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md sm:w-auto"

              >

                <Pencil size={16} />

                Edit Profile

              </button>

            </div>

          </section>


          {/* PROFILE ERROR */}

          {profileError && (

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {profileError}
            </div>

          )}


          {/* =================================================
              MANAGEMENT + QUICK ACTIONS
          ================================================= */}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">


            {/* ACCOUNT MANAGEMENT */}

            <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">

              <div className="px-6 pb-4 pt-5">

                <h3 className="text-lg font-semibold text-slate-900">
                  Account Management
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your profile, resumes and security.
                </p>

              </div>


              <div className="px-4 pb-4">

                <ActionRow
                  icon={UserRound}
                  title="Edit Profile"
                  description="Update your name and account information."
                  iconClass="bg-blue-50 text-blue-600"
                  onClick={() =>
                    navigate("/user-profile/edit")
                  }
                />


                <ActionRow
                  icon={FileText}
                  title="Saved Resumes"
                  description="View your uploaded and analyzed resumes."
                  iconClass="bg-violet-50 text-violet-600"
                  onClick={() =>
                    navigate("/resume-analyzer")
                  }
                />


                <ActionRow
                  icon={LockKeyhole}
                  title="Change Password"
                  description="Update your account password."
                  iconClass="bg-emerald-50 text-emerald-600"
                  onClick={() =>
                    navigate("/change-password")
                  }
                  last
                />

              </div>

            </section>


            {/* QUICK ACTIONS */}

            <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">

              <div className="px-6 pb-4 pt-5">

                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Continue your InterviewIQ activity.
                </p>

              </div>


              <div className="px-4 pb-4">

                <ActionRow
                  icon={FileText}
                  title="Resume Analyzer"
                  description="Analyze or review your resumes."
                  iconClass="bg-blue-50 text-blue-600"
                  onClick={() =>
                    navigate("/resume-analyzer")
                  }
                />


                <ActionRow
                  icon={Video}
                  title="AI Interview"
                  description="Start a new practice session."
                  iconClass="bg-violet-50 text-violet-600"
                  onClick={() =>
                    navigate("/ai-interview")
                  }
                />


                <ActionRow
                  icon={BriefcaseBusiness}
                  title="Job Matcher"
                  description="Compare your resume with a job."
                  iconClass="bg-emerald-50 text-emerald-600"
                  onClick={() =>
                    navigate("/job-matcher")
                  }
                  last
                />

              </div>

            </section>

          </div>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <section className="mt-5 overflow-hidden rounded-[18px] border border-red-100 bg-red-50/40">

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-red-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100/70 text-red-500">

                  <LogOut size={20} />

                </div>


                <div>

                  <p className="text-sm font-semibold text-red-600">
                    Logout
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Sign out of your InterviewIQ account.
                  </p>

                </div>

              </div>


              <ChevronRight
                size={18}
                className="text-red-300 transition-transform group-hover:translate-x-1"
              />

            </button>

          </section>

        </div>

      </div>

    </UserLayout>

  );

};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  icon: Icon,
  count,
  label,
  description,
  iconClass,
  onClick,
}) => {

  return (

    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >

      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
      >

        <Icon
          size={23}
          strokeWidth={1.8}
        />

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between">

          <p className="text-2xl font-bold leading-none text-slate-900">
            {count}
          </p>


          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">

            <ChevronRight size={17} />

          </div>

        </div>


        <p className="mt-2 text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>

      </div>

    </button>

  );

};


// =====================================================
// INFORMATION CARD
// =====================================================

const InfoCard = ({
  icon: Icon,
  label,
  value,
  iconClass,
}) => {

  return (

    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 transition hover:border-slate-200">

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >

        <Icon
          size={20}
          strokeWidth={1.8}
        />

      </div>


      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>

  );

};


// =====================================================
// ACTION ROW
// =====================================================

const ActionRow = ({
  icon: Icon,
  title,
  description,
  iconClass,
  onClick,
  last = false,
}) => {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 ${
        !last
          ? "border-b border-slate-100"
          : ""
      }`}
    >

      <div className="flex min-w-0 items-center gap-4">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >

          <Icon
            size={18}
            strokeWidth={1.8}
          />

        </div>


        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>


      <ChevronRight
        size={18}
        className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
      />

    </button>

  );

};


export default UserProfile;