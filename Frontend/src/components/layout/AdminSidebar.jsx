
import {
  ChartNoAxesColumn,
  ChevronRight,
  Code2,
  Crown,
  FileText,
  Home,
  Mic,
  Settings,
  Users,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const navigation = [
  { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Interviews", icon: Mic, path: "/admin/interviews" },
  { label: "Coding Tests", icon: Code2, path: "/admin/coding-tests" },
  { label: "Resumes", icon: FileText, path: "/admin/resumes" },
  { label: "Reports", icon: ChartNoAxesColumn, path: "/admin/reports" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar({
  activePage = "Dashboard",
  onNavigate,
  mobileMenu,
  setMobileMenu,
}) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    setMobileMenu(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {mobileMenu && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-gradient-to-b from-[#14243a] to-[#101d30] px-[15px] py-5 text-white transition-transform duration-200 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Admin Logo */}
        <div className="mb-8 flex items-center justify-between px-1.5">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-3 text-left"
            aria-label="InterviewIQ home"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-950/30">
              <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-0 blur-lg transition group-hover:opacity-30" />
              <FaRobot className="relative text-xl text-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[23px] font-bold tracking-tight text-white">
                InterviewIQ
              </span>

              <span className="rounded-md border border-blue-400/20 bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-blue-300">
                AI
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenu(false)}
            className="ml-2 rounded-lg p-1 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;

            return (
              <button
                type="button"
                key={item.label}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(item);
                  } else {
                    navigate(item.path);
                    setMobileMenu(false);
                  }
                }}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-[15px] transition ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 font-semibold shadow-lg shadow-blue-950/20"
                    : "text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon size={23} strokeWidth={2.3} />

                <span className="flex-1">{item.label}</span>

                {item.label !== "Dashboard" && (
                  <ChevronRight size={17} className="text-slate-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Access */}
        <div className="mt-auto">
          <div className="rounded-xl border border-white/5 bg-white/[0.08] p-4">
            <div className="flex items-center gap-3">
              <Crown size={24} className="text-amber-400" />
              <span className="font-semibold text-sky-100">
                Admin Access
              </span>
            </div>

            <p className="ml-10 mt-1 text-xs leading-5 text-slate-300">
              Manage users, content,
              <br />
              and platform settings.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
