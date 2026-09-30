import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: email,
      });

      console.log("FORGOT PASSWORD RESPONSE:", response.data);

      setSuccess(
        "Password reset link has been sent to your email."
      );

      setEmail("");

    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      if (error.response) {
        const responseData = error.response.data;

        setError(
          responseData.message ||
          responseData.detail ||
          responseData.email?.[0] ||
          "Unable to send password reset link."
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

        {/* Back to Login */}
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
            <Mail
              size={28}
              className="text-blue-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter the email address associated with your
            InterviewIQ account and we'll send you a
            password reset link.
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>

            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="mb-4 text-center text-sm text-green-600">
              {success}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </Button>

        </form>

        {/* Login */}
        <div className="mt-6 text-center text-sm">

          <span className="text-slate-500">
            Remember your password?
          </span>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;