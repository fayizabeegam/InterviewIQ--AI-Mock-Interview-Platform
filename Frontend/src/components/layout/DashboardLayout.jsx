// components/layout/DashboardLayout.jsx

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;