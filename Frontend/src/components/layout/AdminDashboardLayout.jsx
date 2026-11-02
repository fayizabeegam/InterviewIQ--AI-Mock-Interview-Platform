
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminDashboardLayout({
  children,
  activePage = "Dashboard",
  search = "",
  setSearch,
  adminName = "Admin",
}) {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavigate = (item) => {
    navigate(item.path);
    setMobileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f3f7fc] text-slate-900">
      <AdminSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <div className="min-w-0 lg:ml-[272px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center gap-4 border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md sm:px-7 xl:px-8">
          <button
            onClick={() => setMobileMenu(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>

          <div className="max-w-[520px] flex-1">
            <input
              value={search}
              onChange={(event) => setSearch?.(event.target.value)}
              placeholder="Search users, interviews, or reports..."
              className="h-11 w-full rounded-xl bg-slate-100/90 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={22} />
                <span className="absolute right-0 top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
                  <p className="font-semibold">Notifications</p>
                  <p className="mt-3 text-sm text-slate-600">
                    3 new platform updates.
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Notifications are not connected to the API yet.
                  </p>
                </div>
              )}
            </div>

            <div className="hidden h-9 border-l border-slate-200 sm:block" />

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 text-left hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17263b] text-lg text-white">
                  {adminName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{adminName}</p>
                  <p className="text-xs text-slate-500">Superuser</p>
                </div>

                <ChevronDown
                  size={17}
                  className="hidden text-slate-600 sm:block"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

export default AdminDashboardLayout;
