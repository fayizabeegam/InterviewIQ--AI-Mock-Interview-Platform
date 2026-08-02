import { useState } from "react";
import {
  Mail,
  Lock,
  User,
} from "lucide-react";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaLinkedin,

} from "react-icons/fa";
import Input from "../common/Input";
import SocialButton from "../common/SocialButton";
import Button from "../common/Button";


function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="">
      <div className="mx-auto w-full max-w-[420px]">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-[34px] sm:whitespace-nowrap">
              <span>Create Account</span>
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-slate-500">
            Let's get you started on your interview journey
          </p>
        </div>

        {/* Full name */}
        <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
                Full Name
            </label>

            <Input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                icon={<User size={20} />}
                value={formData.fullName}
                onChange={handleChange}
            />
        </div>

        {/* Email */}
        
        <div className="mb-6">
          <label className="mb-2 block text-left text-sm font-medium text-slate-700">
            Email address
          </label>

          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            icon={<Mail size={20} />}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-2 block text-left text-sm font-medium text-slate-700">
            Password</label>

          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            icon={<Lock size={20} />}
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {/*confirm password  */}
        <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
                Confirm Password
            </label>

            <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                icon={<Lock size={20} />}
                value={formData.confirmPassword}
                onChange={handleChange}
                showPassword={showConfirmPassword}
                togglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
                }
            />
        </div>

        {/* select role */}
        <div className="mb-6">
            <label className="mb-2 block text-left text-sm font-medium text-slate-700">
                Select Your Role
            </label>

            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition focus:border-blue-500"
            >
                <option value="">Choose your role</option>
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
                <option value="interviewer">Interviewer</option>
            </select>
        </div>

        {/* Remember */}
        <div className="my-6 flex items-start gap-3">
            <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4"
            />

            <label htmlFor="terms" className="text-sm leading-6 text-gray-600">
                I agree to the{" "}
                <button
                type="button"
                className="font-semibold text-blue-600 hover:underline"
                >
                Terms of Service
                </button>{" "}
                and{" "}
                <button
                type="button"
                className="font-semibold text-blue-600 hover:underline"
                >
                Privacy Policy
                </button>
            </label>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="mt-8"
        >
          Create Account
        </Button>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>

          <span className="mx-4 text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Social Login */}

        <SocialButton
          icon={<FaGoogle className="text-xl text-red-500" />}
          text="Continue with Google"
          onClick={() => console.log("Google Login")}
        />

        <SocialButton
          icon={<FaGithub className="text-xl" />}
          text="Continue with GitHub"
          onClick={() => console.log("GitHub Login")}
        />

        <SocialButton
          icon={<FaLinkedin className="text-xl text-blue-700" />}
          text="Continue with LinkedIn"
          onClick={() => console.log("LinkedIn Login")}
        />

      </div>

      <div className="mt-8 text-center text-sm">
          <span className="text-[#6B7280]">
            Already have an account?
          </span>

          <button className="ml-1 font-semibold text-[#2563EB] hover:underline">
            Login
          </button>
       </div>
   
    </div>
  );
}

export default RegisterForm;