import { useState } from "react";
import {
  AlertCircle,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  FaGoogle,
  FaGithub,
  FaLinkedin,
  FaRobot,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Input from "../common/Input";
import SocialButton from "../common/SocialButton";
import Button from "../common/Button";
import { loginUser } from "../../services/authService";


function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.username || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(formData);

      const data = response.data.data;

      localStorage.setItem(
        "access_token",
        data.access
      );

      localStorage.setItem(
        "refresh_token",
        data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      if (error.response) {
        const responseData = error.response.data;

        setError(
          responseData.message ||
          responseData.detail ||
          "Invalid email or password."
        );

      } else {
        setError(
          "Unable to connect to the server."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>

      {/* =====================================================
          MOBILE LOGO
      ===================================================== */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-12 flex items-center gap-2.5 lg:hidden"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <FaRobot size={16} />
        </div>

        <span className="font-bold text-slate-900">
          InterviewIQ
        </span>

        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600">
          AI
        </span>
      </button>


      {/* =====================================================
          TOP LINK
      ===================================================== */}
      <div className="mb-12 flex justify-end text-xs">

        <span className="text-slate-400">
          New to InterviewIQ?
        </span>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="ml-1.5 font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Create account
        </button>

      </div>


      {/* =====================================================
          HEADING
      ===================================================== */}
      <div>

        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles size={19} />
        </div>

        <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[38px]">
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Continue practicing and improving your interview skills.
        </p>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="mt-7 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5">

          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-xs leading-5 text-red-600">
            {error}
          </p>

        </div>
      )}


      {/* =====================================================
          FIELDS
      ===================================================== */}
      <div className="mt-8">

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Username or email
          </label>

          <Input
            type="text"
            name="username"
            placeholder="Enter your username or email"
            icon={<Mail size={18} />}
            value={formData.username}
            onChange={handleChange}
          />
        </div>


        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>

            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </button>

          </div>

          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            togglePassword={() =>
              setShowPassword(!showPassword)
            }
          />

        </div>

      </div>


      {/* Remember */}
      <label className="mt-5 flex w-fit cursor-pointer items-center gap-2.5">

        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 accent-blue-600"
        />

        <span className="text-xs text-slate-500">
          Remember me
        </span>

      </label>


      {/* Login */}
      <Button
        type="submit"
        disabled={loading}
        className="mt-7"
      >
        {loading
          ? "Signing in..."
          : "Sign in"}
      </Button>


      {/* Divider */}
      <div className="my-7 flex items-center gap-4">

        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
          Or continue with
        </span>

        <div className="h-px flex-1 bg-slate-200" />

      </div>


      {/* Social */}
      <div className="space-y-3">

        <SocialButton
          icon={
            <FaGoogle className="text-lg text-red-500" />
          }
          text="Continue with Google"
          onClick={() =>
            console.log("Google Login")
          }
        />

        <SocialButton
          icon={
            <FaGithub className="text-lg" />
          }
          text="Continue with GitHub"
          onClick={() =>
            console.log("GitHub Login")
          }
        />

        <SocialButton
          icon={
            <FaLinkedin className="text-lg text-blue-700" />
          }
          text="Continue with LinkedIn"
          onClick={() =>
            console.log("LinkedIn Login")
          }
        />

      </div>

    </form>
  );
}

export default LoginForm;