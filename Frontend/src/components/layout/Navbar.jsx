import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

import {
  ArrowRight,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

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

  const initial =
    displayName.charAt(0).toUpperCase();


  // =====================================================
  // STATE
  // =====================================================
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


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
  // SCROLL TO HOME SECTION
  // =====================================================
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);

    // If already on home page
    if (window.location.pathname === "/") {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      return;
    }

    // If user is on another page
    navigate(`/#${id}`);
  };


  // =====================================================
  // NAVIGATE AND CLOSE MOBILE MENU
  // =====================================================
  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };


  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5">

      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          scrolled
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

              {/* Logo Glow */}
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
                {/* Visitor Navigation */}

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
                {/* Logged In Navigation */}

                <NavItem
                  onClick={() => navigate("/")}
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
                    navigate("/ai-interview")
                  }
                >
                  AI Interview
                </NavItem>

                <NavItem
                  onClick={() =>
                    navigate("/coding")
                  }
                >
                  Coding Practice
                </NavItem>

                <NavItem
                  onClick={() =>
                    navigate("/reports")
                  }
                >
                  Reports
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
                {/* ===============================
                    LOGGED OUT
                =============================== */}

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
                {/* ===============================
                    LOGGED IN
                =============================== */}

                {/* Notification */}
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:flex"
                >
                  <Bell size={19} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                </button>


                {/* Profile */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/profile")
                  }
                  className="hidden items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100 sm:flex"
                >

                  {/* User Initial */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                    {initial}
                  </div>


                  {/* Name */}
                  <span className="hidden max-w-24 truncate text-sm font-semibold text-slate-700 xl:block">
                    {displayName}
                  </span>


                  <ChevronDown
                    size={15}
                    className="text-slate-400"
                  />

                </button>
              </>
            )}


            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (prev) => !prev
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
              ? "max-h-[650px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >

          <div className="border-t border-slate-100 px-4 pb-4 pt-3">


            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}
            <div className="space-y-1">

              {!isLoggedIn ? (
                <>
                  {/* Visitor Mobile Navigation */}

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
                  {/* Logged In Mobile Navigation */}

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
                      handleNavigate("/coding")
                    }
                  >
                    Coding Practice
                  </MobileNavItem>


                  <MobileNavItem
                    onClick={() =>
                      handleNavigate("/reports")
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
              /* ===============================
                 LOGGED OUT MOBILE
              =============================== */

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
              /* ===============================
                 LOGGED IN MOBILE PROFILE
              =============================== */

              <div className="mt-4 border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate("/profile")
                  }
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                    {initial}
                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>

                    <p className="text-xs text-slate-400">
                      View profile
                    </p>

                  </div>


                  <ChevronDown
                    size={16}
                    className="-rotate-90 text-slate-400"
                  />

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}


/* =====================================================
   DESKTOP NAV ITEM
===================================================== */

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


/* =====================================================
   MOBILE NAV ITEM
===================================================== */

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