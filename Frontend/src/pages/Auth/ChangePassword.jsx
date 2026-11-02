import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft  } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  sendChangePasswordOTP,
  changePassword,
} from "../../services/authService";

function ChangePassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Send OTP
  const handleSendOTP = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendChangePasswordOTP(token);

      console.log("SEND OTP RESPONSE:", response.data);

      setSuccess(
        "A verification code has been sent to your registered email."
      );

      setStep(2);

    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      if (error.response) {
        const data = error.response.data;

        setError(
          data.message ||
          data.detail ||
          "Unable to send OTP."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(
        {
          otp: otp,
          password: password,
          confirm_password: confirmPassword,
        },
        token
      );

      console.log("CHANGE PASSWORD RESPONSE:", response.data);

      setSuccess("Password changed successfully.");

      setOtp("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      if (error.response) {
        const data = error.response.data;

        setError(
          data.message ||
          data.detail ||
          data.otp?.[0] ||
          "Unable to change password."
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

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Lock size={20} className="text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Change Password
            </h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {step === 1
              ? "Verify your identity before changing your password."
              : "Enter the verification code and your new password."}
          </p>
        </div>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <>
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
              <Mail size={22} className="mt-0.5 shrink-0 text-blue-600" />
              <p className="text-sm leading-5 text-blue-700">
                We'll send a verification code to your registered email.
              </p>
            </div>

            {error && (
              <p className="mb-4 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {success && (
              <p className="mb-4 text-center text-sm text-green-600">
                {success}
              </p>
            )}

            <Button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="mt-4 w-full"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </Button>
          </>
        )}

        {/* Step 2: Verify OTP and change password */}
        {step === 2 && (
          <form onSubmit={handleChangePassword}>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Verification Code
              </label>
              <Input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                icon={<Mail size={20} />}
                value={otp}
                maxLength={6}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Enter new password"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <Input
                type="password"
                name="confirm_password"
                placeholder="Confirm new password"
                icon={<Lock size={20} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPassword={showConfirmPassword}
                togglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </div>

            {error && (
              <p className="mb-4 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {success && (
              <p className="mb-4 text-center text-sm text-green-600">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="mt-4 w-full text-sm font-medium text-blue-600 hover:underline"
            >
              Send OTP Again
            </button>
          </form>
        )}
      </div>
    </div>
  );

}

export default ChangePassword;