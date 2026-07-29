import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaLinkedin,

} from "react-icons/fa";
import { PiHandWavingFill } from "react-icons/pi";
import Input from "../common/Input";
import SocialButton from "../common/SocialButton";
import Button from "../common/Button";


function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

        {/* Register Link */}
        <div className="mb-16 flex justify-end text-sm">
          <span className="text-[#6B7280]">
            New here?
          </span>

          <button className="ml-1 font-semibold text-[#2563EB] hover:underline">
            Create an account
          </button>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="flex items-center gap-3 text-[38px] font-bold leading-tight text-slate-900">
              <span>Welcome Back!</span>
              <PiHandWavingFill className="text-yellow-400 text-[38px]" />
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-slate-500">
            Login to continue your interview journey
          </p>
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
        <div className="mb-2 flex justify-between">
          <label className="font-medium">Password</label>

          <button className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="relative">

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

        {/* Remember */}
        <div className="my-6 flex items-center gap-2">
          <input type="checkbox" />

          <span className="text-gray-600">
            Remember me
          </span>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="mt-8"
        >
          Login
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
   
    </div>
  );
}

export default LoginForm;