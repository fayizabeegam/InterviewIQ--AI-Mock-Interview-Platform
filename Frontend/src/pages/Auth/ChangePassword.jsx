import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  sendChangePasswordOTP,
  changePassword,
} from "../../services/authService";

function ChangePassword() {
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
    <div className="mx-auto w-full max-w-[420px]">

      {/* Heading */}
      <div className="mb-10 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <Lock className="text-blue-600" size={26} />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Change Password
        </h1>

        <p className="mt-3 text-[15px] leading-6 text-slate-500">
          {step === 1
            ? "We'll send a verification code to your registered email."
            : "Enter the verification code and your new password."}
        </p>

      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div>

          <div className="mb-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
            <Mail
              className="mt-0.5 shrink-0 text-blue-600"
              size={22}
            />

            <p className="text-sm leading-5 text-blue-700">
              For your security, we'll verify your identity before
              changing your password.
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
            className="mt-4"
          >
            {loading ? "Sending OTP..." : "Send Verification Code"}
          </Button>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleChangePassword}>

          {/* OTP */}
          <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
              Verification Code
            </label>

            <Input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              icon={<Mail size={20} />}
              value={otp}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setOtp(value);
              }}
            />
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
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
              togglePassword={() =>
                setShowPassword(!showPassword)
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              icon={<Lock size={20} />}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              showPassword={showConfirmPassword}
              togglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
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

          <Button
            type="submit"
            disabled={loading}
            className="mt-4"
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
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
  );
}

export default ChangePassword;