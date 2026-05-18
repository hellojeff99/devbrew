"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("MENTEE");

  // 실제 사용 시 아래 import로 교체
  // import { api } from '@/lib/api';
  const handleSignup = async () => {
    try {
      // await api.post('/auth/signup', { email, password, name, role });
      alert("signup success");
    } catch (error) {
      console.error(error);
      alert("signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">DevBrew</h1>
          <p className="text-sm text-gray-500 mt-1">
            커피 한 잔으로 시작하는 멘토링
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {["MENTEE", "MENTOR"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === r
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r === "MENTEE" ? "취준생" : "멘토"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
          />
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
          onClick={handleSignup}
          className="mt-6 w-full py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition"
        >
          시작하기
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-xs text-gray-400">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-rose-600 font-medium hover:underline"
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
