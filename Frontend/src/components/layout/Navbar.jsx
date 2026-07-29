// components/layout/Navbar.jsx

import { Menu } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">

      <div className="flex items-center gap-3">

        <button className="lg:hidden">
          <Menu />
        </button>

        <h1 className="font-bold text-xl">
          InterviewIQ
        </h1>

      </div>

      <img
        src="/avatar.png"
        alt=""
        className="h-10 w-10 rounded-full"
      />

    </header>
  );
}

export default Navbar;