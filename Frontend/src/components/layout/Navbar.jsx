import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import {
  ArrowRight,
  Menu,
  X,
  Bell,
  ChevronDown,
  UserRound,
  LockKeyhole,
  LogOut,
} from "lucide-react";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCodingPractice = location.pathname === "/coding-practice";


  // =====================================================
  // AUTH
  // =====================================================

  const token = localStorage.getItem("access_token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn = Boolean(token);

  const displayName =
    user?.first_name ||
    user?.username ||
    "User";

  const email =
    user?.email || "";

  const initial =
    displayName.charAt(0).toUpperCase();


  // =====================================================
  // STATE
  // =====================================================

  const [scrolled, setScrolled] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);


  // =====================================================
  // NAVBAR SCROLL EFFECT
  // =====================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  // =====================================================
  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // =====================================================
  // SCROLL TO HOME SECTION
  // =====================================================

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setProfileOpen(false);

    if (window.location.pathname === "/") {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      return;
    }

    navigate(`/#${id}`);
  };


  // =====================================================
  // NAVIGATE AND CLOSE MENUS
  // =====================================================

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    navigate(path);
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5">

      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          isCodingPractice
          ? "rounded-2xl border border-slate-200/80 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-xl"
          :scrolled
            ? "rounded-2xl border border-slate-200/80 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-xl"
            : "border border-transparent bg-white/60 backdrop-blur-md"
        }`}
      >

        <div className="flex h-16 items-center justify-between px-4 sm:px-6">


          {/* =================================================
              LOGO
          ================================================= */}

          <button
            type="button"
            onClick={() => {
              navigate("/");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="group flex items-center gap-3"
          >

            <div className="relative">

              <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 blur-lg transition group-hover:opacity-30" />

              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200">
                <FaRobot className="text-xl text-white" />
              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="text-[28px] font-bold tracking-[-0.02em] text-slate-950">
                InterviewIQ
              </span>

              <span className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-blue-600">
                AI
              </span>

            </div>

          </button>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">

            {!isLoggedIn ? (
              <>

                <NavItem
                  onClick={() =>
                    scrollToSection("features")
                  }
                >
                  Features
                </NavItem>


                <NavItem
                  onClick={() =>
                    scrollToSection("how-it-works")
                  }
                >
                  How It Works
                </NavItem>


                <NavItem
                  onClick={() =>
                    scrollToSection("about")
                  }
                >
                  About
                </NavItem>


                <NavItem
                  onClick={() =>
                    scrollToSection("testimonials")
                  }
                >
                  Testimonials
                </NavItem>

              </>
            ) : (
              <>

                <NavItem
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Home
                </NavItem>


                <NavItem
                  onClick={() =>
                    navigate("/resume-analyzer")
                  }
                >
                  Resume Analyzer
                </NavItem>


                <NavItem
                  onClick={() =>
                    navigate("/job-matcher")
                  }
                >
                  Job Matcher
                </NavItem>


                <NavItem
                  onClick={() =>
                    navigate("/ai-interview")
                  }
                >
                  AI Interview
                </NavItem>


                <NavItem
                  onClick={() =>
                    navigate("/coding-practice")
                  }
                >
                  Coding Practice
                </NavItem>


                <NavItem
                  onClick={() =>
                    navigate("/roadmap")
                  }
                >
                  Roadmap
                </NavItem>

              </>
            )}

          </nav>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2">

            {!isLoggedIn ? (
              <>

                {/* Login */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 sm:block"
                >
                  Log in
                </button>


                {/* Get Started */}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="group hidden items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 sm:flex"
                >
                  Get Started

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </>
            ) : (
              <>

                {/* Notification */}

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:flex"
                >

                  <Bell size={19} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

                </button>


                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                <div
                  ref={profileRef}
                  className="relative"
                >

                  {/* User Button */}

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (previous) => !previous
                      )
                    }
                    aria-expanded={profileOpen}
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                      {initial}
                    </div>


                    <span className="hidden max-w-[110px] truncate text-sm font-medium text-slate-700 sm:block">
                      {displayName}
                    </span>


                    <ChevronDown
                      className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>


                  {/* Dropdown */}

                  {profileOpen && (

                    <div className="absolute right-0 top-full z-[100] mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">


                      {/* User Information */}

                      <div className="border-b border-slate-100 px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">
                            {initial}
                          </div>


                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {displayName}
                            </p>

                            {email && (
                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {email}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>


                      {/* Profile Actions */}

                      <div className="p-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleNavigate(
                              "/user-profile"
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        >

                          <UserRound className="h-4 w-4" />

                          My Profile

                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleNavigate(
                              "/change-password"
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        >

                          <LockKeyhole className="h-4 w-4" />

                          Change Password

                        </button>

                      </div>


                      {/* Logout */}

                      <div className="border-t border-slate-100 p-2">

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >

                          <LogOut className="h-4 w-4" />

                          Logout

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </>
            )}


            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous
                )
              }
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >

              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}

            </button>

          </div>

        </div>


        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "max-h-[750px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >

          <div className="border-t border-slate-100 px-4 pb-4 pt-3">


            {/* Mobile Navigation */}

            <div className="space-y-1">

              {!isLoggedIn ? (
                <>

                  <MobileNavItem
                    onClick={() =>
                      scrollToSection("features")
                    }
                  >
                    Features
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      scrollToSection(
                        "how-it-works"
                      )
                    }
                  >
                    How It Works
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      scrollToSection("about")
                    }
                  >
                    About
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      scrollToSection(
                        "testimonials"
                      )
                    }
                  >
                    Testimonials
                  </MobileNavItem>

                </>
              ) : (
                <>

                  <MobileNavItem
                    onClick={() =>
                      handleNavigate("/")
                    }
                  >
                    Home
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      handleNavigate(
                        "/resume-analyzer"
                      )
                    }
                  >
                    Resume Analyzer
                  </MobileNavItem>


                  {/* Added Job Matcher to mobile */}

                  <MobileNavItem
                    onClick={() =>
                      handleNavigate(
                        "/job-matcher"
                      )
                    }
                  >
                    Job Matcher
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      handleNavigate(
                        "/ai-interview"
                      )
                    }
                  >
                    AI Interview
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      handleNavigate(
                        "/coding"
                      )
                    }
                  >
                    Coding Practice
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      handleNavigate(
                        "/reports"
                      )
                    }
                  >
                    Reports
                  </MobileNavItem>

                </>
              )}

            </div>


            {/* =================================================
                MOBILE BOTTOM AREA
            ================================================= */}

            {!isLoggedIn ? (

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/login")
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Log in
                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/register")
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started

                  <ArrowRight size={15} />

                </button>

              </div>

            ) : (

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">


                {/* Mobile User */}

                <div className="flex items-center gap-3 px-3 py-2">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                    {initial}
                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>

                    {email && (
                      <p className="truncate text-xs text-slate-400">
                        {email}
                      </p>
                    )}

                  </div>

                </div>


                {/* My Profile */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/user-profile")
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >

                  <UserRound className="h-4 w-4" />

                  My Profile

                </button>


                {/* Change Password */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      "/change-password"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >

                  <LockKeyhole className="h-4 w-4" />

                  Change Password

                </button>


                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                >

                  <LogOut className="h-4 w-4" />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
}


// =====================================================
// DESKTOP NAV ITEM
// =====================================================

function NavItem({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
    >

      {children}

      <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-4" />

    </button>
  );
}


// =====================================================
// MOBILE NAV ITEM
// =====================================================

function MobileNavItem({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
    >

      {children}

      <ArrowRight
        size={14}
        className="text-slate-300"
      />

    </button>
  );
}


export default Navbar;