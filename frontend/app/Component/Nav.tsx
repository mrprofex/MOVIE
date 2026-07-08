"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  function itemClass(href: string) {
    const active = pathname === href;
    return [
      "px-3 py-2 rounded-md text-sm font-semibold transition",
      active
        ? "bg-surface-2 text-accent"
        : "text-gray-300 hover:bg-surface-2 hover:text-white",
    ].join(" ");
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="flex flex-col gap-1">
      <Link href="/" className={itemClass("/")}>
        All Movies
      </Link>

      {loading ? null : user ? (
        <>
          <Link href="/dashboard" className={itemClass("/dashboard")}>
            Dashboard
          </Link>
          <div className="mt-6 pt-4 border-t border-border-app">
            <p className="px-3 text-xs uppercase tracking-wide text-gray-500 mb-1">
              Signed in as
            </p>
            <p className="px-3 text-sm text-white font-medium truncate">
              {user.name}
            </p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-gray-300 hover:bg-surface-2 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 pt-4 border-t border-border-app flex flex-col gap-2">
          <Link
            href="/login"
            className="px-3 py-2 rounded-md text-sm font-semibold text-center border border-border-app text-white hover:bg-surface-2 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-3 py-2 rounded-md text-sm font-semibold text-center bg-accent text-[#0F1220] hover:brightness-110 transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;
