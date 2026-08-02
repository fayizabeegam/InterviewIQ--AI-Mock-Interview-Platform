import LeftPanel from "./LeftPanel";
import Container from "../common/Container";

function AuthLayout({ children, variant = "login" }) {
  return (
    <div className="min-h-screen py-6">
      <Container>
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl  shadow-xl">

          <div className="grid min-h-[900px] grid grid-cols-1 lg:grid-cols-[1fr_1fr]">

            {/* Left */}
            <LeftPanel variant={variant} />

            {/* Right */}
            <div className="flex justify-center px-10 py-12 lg:px-12">
              {children}
            </div>

          </div>

        </div>
      </Container>
    </div>
  );
}

export default AuthLayout;