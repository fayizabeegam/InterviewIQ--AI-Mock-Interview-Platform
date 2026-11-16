
import {
  ChartNoAxesColumn,
  ChevronDown,
  ChevronRight,
  Code2,
  Crown,
  FileText,
  Home,
  Mic,
  Settings,
  Users,
  SlidersHorizontal,
  UserRoundCog,
  ShieldCheck,
  Bell,
  BrainCircuit,
  Plug,
  ClipboardList,
  X,
  LayoutDashboard,
  List,
  CirclePlus,
  Upload,
  Send,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const navigation = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: Users,
    children: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        path: "/admin/users/overview",
      },
      {
        label: "All Users",
        icon: List,
        path: "/admin/users",
      },
    ],
  },
  {
    label: "Interviews",
    icon: Mic,
    children: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        path: "/admin/interviews/overview",
      },
      {
        label: "All Interviews",
        icon: List,
        path: "/admin/interviews",
      },
    ],
  },
  {
    label: "Coding Practices",
    icon: Code2,
    children: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        path: "/admin/coding/overview",
      },
      {
        label: "All Questions",
        icon: List,
        path: "/admin/coding/all-questions",
      },
      {
        label: "Add Question",
        icon: CirclePlus,
        path: "/admin/coding/add-question",
      },
      {
        label: "Bulk Upload",
        icon: Upload,
        path: "/admin/coding/bulk-upload",
      },
      {
        label: "Submissions",
        icon: Send,
        path: "/admin/coding/submissions",
      },
      {
        label: "Reports",
        icon: ChartNoAxesColumn,
        path: "/admin/coding/reports",
      },
    ],
  },
  {
    label: "Resumes",
    icon: FileText,
    children: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        path: "/admin/resumes/overview",
      },
      {
        label: "All Resumes",
        icon: List,
        path: "/admin/resumes/all",
      },
    ],
  },
  
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "General",
        icon: SlidersHorizontal,
        path: "/admin/settings/general",
      },
      {
        label: "Admin Profile",
        icon: UserRoundCog,
        path: "/admin/settings/profile",
      },
      {
        label: "Security",
        icon: ShieldCheck,
        path: "/admin/settings/security",
      },
      {
        label: "Notifications",
        icon: Bell,
        path: "/admin/settings/notifications",
      },
      {
        label: "AI Configuration",
        icon: BrainCircuit,
        path: "/admin/settings/ai",
      },
      {
        label: "Integrations",
        icon: Plug,
        path: "/admin/settings/integrations",
      },
      {
        label: "Activity Logs",
        icon: ClipboardList,
        path: "/admin/settings/activity-logs",
      },
    ],
  },
];

export default function AdminSidebar({
  activePage = "Dashboard",
  onNavigate,
  mobileMenu,
  setMobileMenu,
}) {
  const navigate = useNavigate();

  // Only one dropdown can remain open at a time.
  const [expandedMenu, setExpandedMenu] = useState(() => {
    if (activePage.startsWith("Coding")) return "Coding Practices";
    if (activePage.startsWith("User")) return "Users";
    if (activePage.startsWith("Interview")) return "Interviews";
    if (activePage.startsWith("Resume")) return "Resumes";

    return null;
  });

  const handleLogoClick = () => {
    navigate("/");
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item);
    } else {
      navigate(item.path);
      setMobileMenu(false);
    }
  };

  const handleDropdownToggle = (label) => {
    setExpandedMenu((previous) =>
      previous === label ? null : label
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenu && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-y-auto bg-gradient-to-b from-[#14243a] to-[#101d30] px-[15px] py-5 text-white transition-transform duration-200 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between px-1.5">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-3 text-left"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-0 blur-lg transition group-hover:opacity-30" />

              <FaRobot className="relative text-xl text-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[23px] font-bold tracking-tight">
                InterviewIQ
              </span>

              <span className="rounded-md border border-blue-400/20 bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                AI
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenu(false)}
            className="ml-2 rounded-lg p-1 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;

            const isExpanded = expandedMenu === item.label;

            const active =
              activePage === item.label ||
              (hasChildren && item.children.some(
                (child) => activePage === child.label
              ));

            return (
              <div key={item.label}>
                {/* Main Menu */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      handleDropdownToggle(item.label);
                    } else {
                      handleNavigation(item);
                    }
                  }}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-[15px] transition ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 font-semibold shadow-lg"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <Icon size={23} strokeWidth={2.3} />

                  <span className="flex-1">{item.label}</span>

                  {hasChildren && (
                    isExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )
                  )}
                </button>

                {/* Dropdown Submenu */}
                {hasChildren && (
                  <div
                    className={`grid transition-all duration-300 ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-5 mt-2 space-y-2 border-l border-slate-600/60 pl-3">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;

                          const childActive =
                            activePage === child.label;

                          return (
                            <button
                              key={child.path}
                              type="button"
                              onClick={() => handleNavigation(child)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] transition ${
                                childActive
                                  ? "bg-[#294574] font-semibold text-white"
                                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <ChildIcon
                                size={19}
                                strokeWidth={2}
                                className={
                                  childActive
                                    ? "text-blue-400"
                                    : "text-slate-400"
                                }
                              />

                              <span>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Admin Access */}
        <div className="mt-auto pt-6">
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
