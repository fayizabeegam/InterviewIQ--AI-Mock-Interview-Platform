import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Sparkles,
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  Loader2,
} from "lucide-react";

import { FaGithub, FaLinkedin} from "react-icons/fa";

import UserLayout from "../../components/layout/UserLayout";

import {
  getUserProfile,
  updateUserProfile,
} from "../../services/ProfileService";



const EditProfile = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    current_role: "",
    linkedin_url: "",
    github_url: "",
  });


  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getUserProfile(token);

        const profile = response.data.data;

        setFormData({
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          email: profile?.email || "",
          mobile: profile?.mobile || "",
          current_role: profile?.current_role || "",
          linkedin_url: profile?.linkedin_url || "",
          github_url: profile?.github_url || "",
        });

      } catch (error) {

        console.error(
          "Failed to fetch profile:",
          error.response?.data || error
        );

        setError("Unable to load your profile.");

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, [navigate]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        mobile: formData.mobile.trim(),
        current_role: formData.current_role.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        github_url: formData.github_url.trim(),
      };

      await updateUserProfile(token, payload);

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/user-profile");
      }, 700);

    } catch (error) {

      console.error(
        "Failed to update profile:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to update your profile."
      );

    } finally {

      setSaving(false);

    }

  };


  return (

    <UserLayout>

      <div className="min-h-screen bg-[#f8fafc]">

        <div className="mx-auto w-full max-w-[1450px] px-5 pb-12 pt-3 sm:px-8 lg:px-10">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md shadow-blue-200">

                <UserRound
                 className="h-5 w-5 text-white"
                />

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-[22px] font-bold tracking-tight text-slate-900">
                    Edit Profile
                  </h2>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                    Account
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information and professional details.
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
              BACK BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate("/user-profile")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >

            <ArrowLeft size={17} />

            Back to Profile

          </button>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="mt-5 flex min-h-[400px] items-center justify-center rounded-[22px] border border-slate-200 bg-white">

              <div className="flex flex-col items-center gap-3">

                <Loader2
                  size={28}
                  className="animate-spin text-blue-600"
                />

                <p className="text-sm text-slate-500">
                  Loading your profile...
                </p>

              </div>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="mt-5"
            >


              {/* =================================================
                  PERSONAL INFORMATION
              ================================================= */}

              <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                      <User size={19} />

                    </div>

                    <div>

                      <h2 className="text-base font-semibold text-slate-900">
                        Personal Information
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Update your basic account information.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">

                  <FormField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    icon={User}
                  />

                  <FormField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    icon={User}
                  />


                  {/* EMAIL READ ONLY */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-500 outline-none"
                      />

                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Your email address cannot be changed here.
                    </p>

                  </div>


                  <FormField
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    icon={Phone}
                  />

                  <FormField
                    label="Current Role"
                    name="current_role"
                    value={formData.current_role}
                    onChange={handleChange}
                    placeholder="e.g. Python Developer"
                    icon={BriefcaseBusiness}
                  />

                </div>

              </section>

              {/* =================================================
                  SOCIAL LINKS
              ================================================= */}

              <section className="mt-5 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5 sm:px-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                      <FaGithub size={19} />

                    </div>

                    <div>

                      <h2 className="text-base font-semibold text-slate-900">
                        Professional Links
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Add links to your professional profiles.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">

                  <FormField
                    label="LinkedIn"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    icon={FaLinkedin}
                    type="url"
                  />

                  <FormField
                    label="GitHub"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    icon={FaGithub}
                    type="url"
                  />

                </div>

              </section>


              {/* =================================================
                  ERROR / SUCCESS
              ================================================= */}

              {error && (

                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>

              )}


              {success && (

                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                  {success}
                </div>

              )}


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate("/user-profile")}
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >

                  {saving ? (

                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      <Save size={17} />

                      Save Changes
                    </>

                  )}

                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </UserLayout>

  );

};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  step,
  min,
}) => {

  return (

    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          min={min}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        />

      </div>

    </div>

  );

};


export default EditProfile;