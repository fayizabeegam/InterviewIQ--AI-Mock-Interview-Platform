import { useState } from "react";
import {
  AlertCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";
import {
  FaGithub,
  FaGoogle,
  FaLinkedin,
  FaRobot,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import SocialButton from "../common/SocialButton";
import Button from "../common/Button";
import { registerUser } from "../../services/authService";


function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((previous) => ({
        ...previous,
        [e.target.name]: undefined,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setErrors((previous) => ({
        ...previous,
        terms:
          "Please accept the Terms of Service and Privacy Policy.",
      }));

      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await registerUser(formData);

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });

    } catch (error) {

      if (error.response) {
        setErrors(
          error.response.data?.errors || {
            general:
              error.response.data?.message ||
              "Unable to create your account.",
          }
        );

      } else {
        setErrors({
          general:
            "Unable to connect to the server.",
        });
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>

      {/* Mobile logo */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-9 flex items-center gap-2.5 lg:hidden"
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


      {/* Login link */}
      <div className="mb-9 flex justify-end text-xs">

        <span className="text-slate-400">
          Already have an account?
        </span>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="ml-1.5 font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </button>

      </div>


      {/* Heading */}
      <div>

        <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[36px]">
          Create account
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Start practicing smarter with your AI interview coach.
        </p>

      </div>


      {/* General Error */}
      {errors.general && (
        <div className="mt-6 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5">

          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-xs text-red-600">
            {errors.general}
          </p>

        </div>
      )}


      {/* Fields */}
      <div className="mt-7">

        {/* Name */}
        <div className="grid gap-4 sm:grid-cols-2">

          <AuthField
            label="First name"
            error={errors.first_name}
          >
            <Input
              type="text"
              name="first_name"
              placeholder="First name"
              icon={<User size={17} />}
              value={formData.first_name}
              onChange={handleChange}
            />
          </AuthField>


          <AuthField
            label="Last name"
            error={errors.last_name}
          >
            <Input
              type="text"
              name="last_name"
              placeholder="Last name"
              icon={<User size={17} />}
              value={formData.last_name}
              onChange={handleChange}
            />
          </AuthField>

        </div>


        {/* Email */}
        <div className="mt-4">

          <AuthField
            label="Email address"
            error={errors.email}
          >
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              icon={<Mail size={17} />}
              value={formData.email}
              onChange={handleChange}
            />
          </AuthField>

        </div>


        {/* Passwords */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <AuthField
            label="Password"
            error={errors.password}
          >
            <Input
              type="password"
              name="password"
              placeholder="Password"
              icon={<Lock size={17} />}
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() =>
                setShowPassword(!showPassword)
              }
            />
          </AuthField>


          <AuthField
            label="Confirm password"
            error={errors.confirm_password}
          >
            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              icon={<Lock size={17} />}
              value={formData.confirm_password}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              togglePassword={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            />
          </AuthField>

        </div>

      </div>


      {/* Terms */}
      <div className="mt-5">

        <label className="flex cursor-pointer items-start gap-3">

          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(
                e.target.checked
              );

              setErrors((previous) => ({
                ...previous,
                terms: undefined,
              }));
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          />

          <span className="text-xs leading-5 text-slate-500">
            I agree to the{" "}
            <span className="font-semibold text-blue-600">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-semibold text-blue-600">
              Privacy Policy
            </span>
          </span>

        </label>


        {errors.terms && (
          <p className="mt-2 text-[11px] text-red-500">
            {errors.terms}
          </p>
        )}

      </div>


      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="mt-6"
      >
        {loading
          ? "Creating account..."
          : "Create Account"}
      </Button>


      {/* Divider */}
      <div className="my-6 flex items-center gap-4">

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
            console.log("Google Register")
          }
        />

        <SocialButton
          icon={
            <FaGithub className="text-lg" />
          }
          text="Continue with GitHub"
          onClick={() =>
            console.log("GitHub Register")
          }
        />

        <SocialButton
          icon={
            <FaLinkedin className="text-lg text-blue-700" />
          }
          text="Continue with LinkedIn"
          onClick={() =>
            console.log("LinkedIn Register")
          }
        />

      </div>

    </form>
  );
}


/* Field wrapper */
function AuthField({
  label,
  error,
  children,
}) {
  const message = Array.isArray(error)
    ? error[0]
    : error;

  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      {children}

      {message && (
        <p className="mt-1.5 text-[11px] text-red-500">
          {message}
        </p>
      )}

    </div>
  );
}


export default RegisterForm;