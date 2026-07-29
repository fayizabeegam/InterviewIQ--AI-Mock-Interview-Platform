import LeftPanel from "./LeftPanel";
import Container from "../common/Container";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center py-6">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl grid grid-cols-1 lg:grid-cols-2">

          {/* Left Side */}
          <LeftPanel />

          {/* Right Side */}
          <div className="flex items-center justify-center p-6 md:p-10 xl:p-12">
            {children}
          </div>

        </div>
      </Container>
    </div>
  );
}

export default AuthLayout;