// components/layout/Sidebar.jsx

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r">

      <div className="p-6 font-bold text-xl">
        InterviewIQ
      </div>

      <nav className="space-y-2 px-4">

        <button className="w-full rounded-lg p-3 text-left hover:bg-blue-50">
          Dashboard
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-blue-50">
          AI Interview
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-blue-50">
          Coding
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-blue-50">
          Reports
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;