"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.accessToken as string;
      const role = response.data.user.role as string;
      const userId = response.data.user.id.toString() as string;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      alert("login success");
      router.replace("/");
    } catch (error) {
      console.error(error);
      alert("login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">DevBrew</h1>
          <p className="text-sm text-gray-500 mt-1">다시 만나서 반가워요</p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          className="mt-6 w-full py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition"
        >
          로그인
        </button>

        {/* Signup Link */}
        <p className="mt-4 text-center text-xs text-gray-400">
          아직 계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-rose-600 font-medium hover:underline"
          >
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
