import LeftPanel from "./LeftPanel";

function AuthLayout({ children, variant = "login" }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[46%_54%]">

        {/* Visual / Product panel */}
        <div className="hidden lg:block">
          <LeftPanel variant={variant} />
        </div>

        {/* Form */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">

          {/* Background glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/50 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100/40 blur-[110px]" />

          <div className="relative z-10 w-full max-w-[430px]">
            {children}
          </div>

        </section>

      </div>
    </main>
  );
}

export default AuthLayout;