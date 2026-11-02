import Navbar from "./Navbar";

function UserLayout({ children, backgroundClass = "bg-slate-50"  }) {
  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <Navbar />

      <main className="w-full pt-24 sm:pt-28">
        {children}
      </main>
    </div>
  );
}

export default UserLayout;