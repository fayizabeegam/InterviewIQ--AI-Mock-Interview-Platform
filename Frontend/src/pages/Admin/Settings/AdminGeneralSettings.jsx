
import { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  Settings,
  Globe,
  Monitor,
  ShieldCheck,
  Save,
  RefreshCw,
  X,
  Building2,
  Mail,
  Clock,
  Languages,
  CalendarDays,
  Upload,
  Users,
} from "lucide-react";

import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";

import {
  getAdminGeneralSettings,
  updateAdminGeneralSettings,
} from "../../../services/adminService";

// ---------------------------------------------
// INITIAL FORM DATA
// ---------------------------------------------

const initialForm = {
  application_name: "",
  application_description: "",
  support_email: "",
  timezone: "Asia/Kolkata",
  date_format: "DD/MM/YYYY",
  time_format: "12-hour",
  default_language: "en",
  pagination_size: 10,
  maintenance_mode: false,
  allow_registration: true,
  max_upload_size_mb: 5,
};

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------

export default function AdminGeneralSettings() {
  // -------------------------------------------
  // STATES
  // -------------------------------------------

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // -------------------------------------------
  // FETCH SETTINGS
  // -------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminGeneralSettings();

        // Supports direct and wrapped API responses
        const data = response.data?.data ?? response.data;

        if (!data) {
          throw new Error("Invalid settings response.");
        }

        if (isMounted) {
          setFormData({
            ...initialForm,
            ...data,
          });
        }
      } catch (err) {
        console.error("Failed to fetch general settings:", err);

        if (isMounted) {
          setError(
            err.response?.data?.detail ||
              err.response?.data?.message ||
              err.message ||
              "Unable to load general settings."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------
  // HANDLE INPUT CHANGE
  // -------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["pagination_size", "max_upload_size_mb"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  // -------------------------------------------
  // UPDATE SETTINGS
  // -------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateAdminGeneralSettings(formData);

      const data = response.data?.data ?? response.data;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      }

      setMessage("General settings updated successfully.");
    } catch (err) {
      console.error("Failed to update general settings:", err);

      const responseData = err.response?.data;

      setError(
        responseData?.detail ||
          responseData?.message ||
          "Failed to update general settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------
  // RESET SETTINGS
  // -------------------------------------------

  const handleReset = () => {
    setError("");
    setMessage("");
    setFormData(initialForm);
  };

  // -------------------------------------------
  // SHARED STYLES
  // -------------------------------------------

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  // -------------------------------------------
  // LOADING
  // -------------------------------------------

  if (loading) {
    return (
      <AdminDashboardLayout activePage="Settings">
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6FC]">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <RefreshCw size={20} className="animate-spin" />
            Loading general settings...
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  // -------------------------------------------
  // RENDER
  // -------------------------------------------

  return (
    <AdminDashboardLayout activePage="Settings">
      <div className="min-h-screen space-y-5 bg-[#F4F6FC] p-5 md:p-7">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Home size={16} />
          <ChevronRight size={14} />
          <span>Settings</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">
            General Settings
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div></div>

          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
            <Settings size={18} />
            Platform Configuration
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* APPLICATION INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Application Information
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Configure your platform identity and contact information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Application Name
                </label>

                <input
                  type="text"
                  name="application_name"
                  value={formData.application_name}
                  onChange={handleChange}
                  placeholder="Enter application name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Support Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="email"
                    name="support_email"
                    value={formData.support_email}
                    onChange={handleChange}
                    placeholder="support@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Application Description
                </label>

                <textarea
                  name="application_description"
                  value={formData.application_description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter application description"
                  className={`${inputClass} resize-none`}
                />
              </div>

            </div>
          </section>

          {/* REGIONAL SETTINGS */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
                <Globe size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Regional Settings
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Configure timezone, language and date preferences.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Timezone
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">
                      America/New_York
                    </option>
                    <option value="Europe/London">
                      Europe/London
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Default Language
                </label>

                <div className="relative">
                  <Languages
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <select
                    name="default_language"
                    value={formData.default_language}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  >
                    <option value="en">English</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Date Format
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <select
                    name="date_format"
                    value={formData.date_format}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Time Format
                </label>

                <select
                  name="time_format"
                  value={formData.time_format}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="12-hour">12 Hour</option>
                  <option value="24-hour">24 Hour</option>
                </select>
              </div>

            </div>
          </section>

          {/* SYSTEM CONFIGURATION */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-700">
                <Monitor size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  System Configuration
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Manage application display and upload limits.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Pagination Size
                </label>

                <input
                  type="number"
                  name="pagination_size"
                  min="1"
                  value={formData.pagination_size}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <p className="mt-1.5 text-xs text-gray-500">
                  Number of records displayed per page.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Upload Size (MB)
                </label>

                <div className="relative">
                  <Upload
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="number"
                    name="max_upload_size_mb"
                    min="1"
                    value={formData.max_upload_size_mb}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>

                <p className="mt-1.5 text-xs text-gray-500">
                  Maximum permitted file upload size.
                </p>
              </div>

            </div>
          </section>

          {/* PLATFORM CONTROLS */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Platform Controls
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Manage platform availability and user registration.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 px-5">

              {/* Maintenance Mode */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                    <Settings size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Maintenance Mode
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Enable maintenance mode for the application.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="maintenance_mode"
                    checked={formData.maintenance_mode}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>

              {/* Registration */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Users size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Allow User Registration
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Allow new users to register on the platform.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="allow_registration"
                    checked={formData.allow_registration}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>

            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-end gap-3">

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex h-[46px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex h-[46px] items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

        {/* FOOTER */}
        <div className="rounded-xl border border-gray-100 bg-white px-5 py-3">
          <p className="text-xs text-gray-500">
            General application settings are restricted to authorized administrators.
          </p>
        </div>

      </div>
    </AdminDashboardLayout>
  );
}
