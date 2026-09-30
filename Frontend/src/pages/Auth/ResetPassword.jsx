import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.password || !formData.confirm_password) {
      setError("Please enter both password fields.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        uid: uid,
        token: token,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      console.log("RESET PASSWORD RESPONSE:", response.data);

      setSuccess("Password reset successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      if (error.response) {
        const responseData = error.response.data;

        setError(
          responseData.message ||
          responseData.detail ||
          responseData.password?.[0] ||
          "Invalid or expired reset link."
        );
      } else {
        setError("Unable to connect to the server.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Lock
              size={28}
              className="text-blue-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Create a new password for your InterviewIQ account.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Password */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <Input
              type="password"
              name="password"
              placeholder="Enter new password"
              icon={<Lock size={20} />}
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() =>
                setShowPassword(!showPassword)
              }
            />

          </div>

          {/* Confirm Password */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              icon={<Lock size={20} />}
              value={formData.confirm_password}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              togglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="mb-4 text-sm text-green-600">
              {success}
            </p>
          )}

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </Button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;