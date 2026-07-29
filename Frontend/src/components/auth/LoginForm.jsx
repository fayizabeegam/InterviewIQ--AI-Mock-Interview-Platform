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
    <div className="flex items-center justify-center p-6 md:p-10 xl:p-12">
      <div className="w-full max-w-md">

        {/* Register Link */}
        <div className="mb-10 text-right">
          <span className="text-gray-500">New here? </span>
          <button className="font-semibold text-blue-600 hover:underline">
            Create an account
          </button>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-xl font-bold text-slate-900">
          Welcome Back!👋
        </h1>

        <p className="mb-10 text-gray-500">
          Login to continue your interview journey
        </p>

        {/* Email */}
        <div className="relative mb-6">
          <Mail
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

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