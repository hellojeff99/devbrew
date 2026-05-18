// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      const token = localStorage.getItem("accessToken");
      const storedRole = localStorage.getItem("role");

      console.log("Token:", token);
      setIsLoggedIn(!!token);
      setRole(storedRole);
      setMounted(true);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router.replace("/login");
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-lg font-bold text-rose-600 tracking-tight">
        DevBrew
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {role === "MENTOR" ? (
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
              >
                대시보드
              </Link>
            ) : (
              <Link
                href="/mentors"
                className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
              >
                멘토 찾기
              </Link>
            )}

            <Link
              href="/chat"
              className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
            >
              채팅
            </Link>

            {role && (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                {role}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-rose-600 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
