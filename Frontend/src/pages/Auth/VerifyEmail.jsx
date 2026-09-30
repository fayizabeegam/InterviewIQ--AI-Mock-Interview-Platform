import { Mail } from "lucide-react";
import { useLocation,useNavigate  } from "react-router-dom";
import { useRef, useState } from "react";
import { verifyEmail,resendOTP } from "../../services/authService";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
        setLoading(true);
        setError("");

        const response = await verifyEmail({
        email: email,
        otp: otpValue,
      });

      console.log(response.data);

      navigate("/", {
        state: {
          message: "Email verified successfully. Please login.",
        },
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          error.response.data?.otp?.[0] ||
          "Invalid or expired OTP."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await resendOTP({
        email: email,
      });

      console.log(response.data);

      setSuccessMessage(
        "A new verification code has been sent to your email."
      );

      // Clear old OTP boxes
      setOtp(["", "", "", "", "", ""]);

      // Focus first box
      inputRefs.current[0]?.focus();

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          error.response.data?.email?.[0] ||
          "Unable to resend OTP."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center text-slate-900">
          Verify Your Email
        </h1>

        <p className="mt-4 text-center text-slate-500">
          We've sent a verification code to
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-50 p-3">
          <Mail className="text-blue-600" size={20} />
          <span className="font-medium text-blue-700">
           {email}
          </span>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Please check your inbox and enter the 6-digit verification code below.
        </p>

        {/* OTP Boxes */}

        <div className="mt-8 flex justify-center gap-3">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={handleOtpPaste}
              className="h-12 w-12 rounded-xl border border-slate-300 text-center text-xl font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-600">
            {successMessage}
          </p>
        )}
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendLoading}
          className="mt-4 w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

      </div>
    </div>
  );
}

export default VerifyEmail;