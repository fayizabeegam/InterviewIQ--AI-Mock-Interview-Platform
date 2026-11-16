
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  LockKeyhole,
  Save,
  Loader2,
  X,
  UserCog,
  Home,
  ChevronRight,
} from "lucide-react";

import { useNavigate, useLocation  } from "react-router-dom";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import {
  getAdminProfile,
  updateAdminProfile,
} from "../../../services/adminService";

const AdminProfileSettings = () => {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (data?.message) return data.message;
    if (data?.detail) return data.detail;

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([key, value]) => {
          const message = Array.isArray(value)
            ? value.join(", ")
            : value;

          return `${key}: ${message}`;
        })
        .join(" | ");
    }

    return error?.message || "Something went wrong. Please try again.";
  };

  // Fetch Admin Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAdminProfile();
      const data = response?.data?.data ?? response?.data ?? response;

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        created_at: data.created_at || "",
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Profile Input Changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update Admin Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await updateAdminProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        mobile: profile.mobile,
      });

      const data = response?.data?.data ?? response?.data ?? response;

      setProfile((prev) => ({
        ...prev,
        ...data,
      }));

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  // Format Account Created Date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  return (
    <AdminDashboardLayout activePage="Settings">
      <div className="min-h-screen space-y-5 bg-[#F4F6FC] p-5 md:p-7">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Home size={15} />
          <span>Home</span>

          <ChevronRight size={15} />
          <span>Settings</span>

          <ChevronRight size={15} />
          <span className="font-medium text-gray-800">
            Admin Profile
          </span>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <span>{successMessage}</span>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="rounded-lg p-1 hover:bg-green-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <Loader2
              className="animate-spin text-blue-600"
              size={32}
            />
          </div>
        ) : (
          <>
            {/* Profile Information */}
            <form onSubmit={handleProfileSubmit}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Profile Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Manage your administrator profile details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* First Name */}
                  <div>
                    <label className={labelClass}>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      placeholder="Enter first name"
                      className={inputClass}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={labelClass}>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      placeholder="Enter last name"
                      className={inputClass}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className={labelClass}>
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className={`${inputClass} cursor-not-allowed bg-gray-50 pl-11`}
                      />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className={labelClass}>
                      Mobile Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleProfileChange}
                        placeholder="Enter mobile number"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                </div>

                {/* Save Profile */}
                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>

              </div>
            </form>

            {/* Account Information */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Account Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    View your administrator account details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* Account Created */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <CalendarDays size={17} />

                    <span className="text-xs font-medium">
                      Account Created
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(profile.created_at)}
                  </p>
                </div>

                {/* Account Role */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <UserCog size={17} />

                    <span className="text-xs font-medium">
                      Account Role
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    Administrator
                  </p>
                </div>

              </div>
            </div>

            {/* Password & Security */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                    <LockKeyhole size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Password & Security
                    </h2>

                    <p className="text-sm text-gray-500">
                      Manage your administrator account password.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/change-password", {
                                    state: { from: "admin" },
                                })}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <LockKeyhole size={17} />

                  Change Password

                  <ChevronRight size={17} />
                </button>

              </div>
            </div>

          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfileSettings;
