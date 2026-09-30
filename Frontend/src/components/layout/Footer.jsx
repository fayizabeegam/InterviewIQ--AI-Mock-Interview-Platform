import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import {
  ArrowRight,
  Sparkles,
  Mail,
} from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-400">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />


      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 lg:px-10 lg:pt-20">

        <div className="grid gap-14 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">

          {/* =================================================
              BRAND
          ================================================= */}
          <div className="max-w-sm">

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

                <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-30 blur-lg" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <FaRobot className="text-xl" />
                </div>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-xl font-bold tracking-tight text-white">
                  InterviewIQ
                </span>

                <span className="rounded-md border border-blue-400/20 bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">
                  AI
                </span>

              </div>
            </button>


            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">
              Practice realistic interviews, receive intelligent
              feedback, and build the skills and confidence you need
              for your next opportunity.
            </p>


            {/* AI label */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-2">

              <Sparkles
                size={13}
                className="text-blue-400"
              />

              <span className="text-[10px] font-medium text-slate-400">
                AI-powered interview preparation
              </span>

            </div>


            {/* Social */}
            <div className="mt-7 flex items-center gap-2">

              <SocialButton
                label="GitHub"
                icon={<FaGithub size={17} />}
              />

              <SocialButton
                label="LinkedIn"
                icon={<FaLinkedinIn size={16} />}
              />

              <SocialButton
                label="Instagram"
                icon={<FaInstagram size={17} />}
              />

            </div>

          </div>


          {/* =================================================
              PRODUCT
          ================================================= */}
          <FooterColumn title="Product">

            <FooterLink
              onClick={() => scrollToSection("features")}
            >
              Features
            </FooterLink>

            <FooterLink
              onClick={() => scrollToSection("features")}
            >
              AI Mock Interviews
            </FooterLink>

            <FooterLink
              onClick={() => scrollToSection("features")}
            >
              AI Feedback
            </FooterLink>

            <FooterLink
              onClick={() => scrollToSection("features")}
            >
              Coding Practice
            </FooterLink>

          </FooterColumn>


          {/* =================================================
              EXPLORE
          ================================================= */}
          <FooterColumn title="Explore">

            <FooterLink
              onClick={() =>
                scrollToSection("how-it-works")
              }
            >
              How It Works
            </FooterLink>

            <FooterLink
              onClick={() => scrollToSection("about")}
            >
              About
            </FooterLink>

            <FooterLink
              onClick={() =>
                scrollToSection("testimonials")
              }
            >
              Testimonials
            </FooterLink>

            <FooterLink
              onClick={() => navigate("/login")}
            >
              Log in
            </FooterLink>

          </FooterColumn>


          {/* =================================================
              GET STARTED
          ================================================= */}
          <div>

            <h3 className="text-sm font-semibold text-white">
              Ready to practice?
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Start your first AI mock interview and discover where
              you can improve.
            </p>


            <button
              type="button"
              onClick={() => navigate("/register")}
              className="group mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:text-white"
            >
              Get Started Free

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>


            {/* Contact */}
            <div className="mt-7 flex items-center gap-2 text-xs text-slate-500">

              <Mail size={14} />

              <span>
                Questions or feedback?
              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            DIVIDER
        ===================================================== */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />


        {/* =====================================================
            BOTTOM
        ===================================================== */}
        <div className="flex flex-col gap-5 pt-7 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} InterviewIQ.
            All rights reserved.
          </p>


          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              AI systems operational
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

            <span>
              Built for better interviews.
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}


/* =====================================================
   FOOTER COLUMN
===================================================== */
function FooterColumn({
  title,
  children,
}) {
  return (
    <div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <div className="mt-6 space-y-4">
        {children}
      </div>

    </div>
  );
}


/* =====================================================
   FOOTER LINK
===================================================== */
function FooterLink({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2 text-left text-sm text-slate-500 transition hover:text-white"
    >
      <span className="h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-3" />

      {children}
    </button>
  );
}


/* =====================================================
   SOCIAL BUTTON
===================================================== */
function SocialButton({
  icon,
  label,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
    >
      {icon}
    </button>
  );
}


export default Footer;