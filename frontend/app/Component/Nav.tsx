import Link from "next/link";
import React from "react";

function Nav() {
  return (
    <nav className="flex flex-col text-black font-extrabold gap-4 ">
      <Link
        href="/"
        className="px-4 py-2 rounded-lg hover:bg-blue-300 transition"
      >
        All Movie
      </Link>
    </nav>
  );
}

export default Nav;
