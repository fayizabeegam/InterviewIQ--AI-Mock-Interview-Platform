import Navbar from "./Navbar";

function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="w-full pt-24 sm:pt-28">
        {children}
      </main>
    </div>
  );
}

export default UserLayout;