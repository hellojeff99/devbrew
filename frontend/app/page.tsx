"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

const FEATURES = [
  {
    title: "멘토 탐색",
    desc: "현직 개발자 멘토를 기술 스택 기반으로 찾아보세요",
  },
  { title: "슬롯 예약", desc: "원하는 시간대를 선택해 커피챗을 신청하세요" },
  {
    title: "실시간 채팅",
    desc: "승인 즉시 채팅방이 열려 바로 대화를 시작할 수 있어요",
  },
];

const MENTEE_STEPS = [
  "멘토 목록에서 원하는 멘토를 탐색해요",
  "슬롯을 선택하고 커피챗을 신청해요",
  "멘토가 승인하면 채팅방이 열려요",
  "실시간 채팅으로 멘토링을 시작해요",
];

const MENTOR_STEPS = [
  "대시보드에서 커피챗 요청을 확인해요",
  "요청을 검토하고 승인 또는 거절해요",
  "승인하면 채팅방이 자동으로 생성돼요",
  "실시간 채팅으로 멘티와 소통해요",
];

export default function RootPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"MENTEE" | "MENTOR">("MENTEE");

  useEffect(() => {
    startTransition(() => {
      const token = localStorage.getItem("accessToken");
      const storedRole = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setRole(storedRole);
      setMounted(true);
    });
  }, []);

  const steps = activeTab === "MENTEE" ? MENTEE_STEPS : MENTOR_STEPS;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Hero */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-rose-600 tracking-tight">
            DevBrew
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            커피 한 잔으로 시작하는 개발자 멘토링
          </p>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">
            취업을 준비하는 개발자와 현직 멘토를 연결해요.
            <br />
            시간 슬롯을 예약하고, 실시간 채팅으로 실무 이야기를 들어보세요.
          </p>
        </div>
        {/* Motto */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 text-center">
          <p className="text-sm font-semibold text-gray-900">
            “막막한 취업 준비, 혼자 고민하지 마세요”
          </p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            DevBrew는 단순한 Q&A가 아닌, <br />
            실제 경험을 가진 개발자와의 대화를 통해 방향을 찾는 공간입니다.
          </p>
        </div>

        {/* Value Props */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-900">
            왜 DevBrew인가요?
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold text-rose-600">
                실무 기반 멘토링
              </p>
              <p className="text-xs text-gray-400">
                현직 개발자의 실제 경험을 기반으로 현실적인 조언을 받아보세요
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-rose-600">
                가벼운 커피챗 형식
              </p>
              <p className="text-xs text-gray-400">
                부담 없는 대화로 자연스럽게 궁금증을 해결할 수 있어요
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-rose-600">빠른 연결</p>
              <p className="text-xs text-gray-400">
                승인 즉시 채팅으로 이어지는 즉각적인 소통 경험
              </p>
            </div>
          </div>
        </div>
        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-1.5"
            >
              <div className="text-xs font-semibold text-rose-600">
                {f.title}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-900">이용 방법</p>

          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["MENTEE", "MENTOR"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "MENTEE" ? "취준생" : "멘토"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {steps.map((text, i) => (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {text}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-3 bg-gray-100 ml-3 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {mounted &&
          (isLoggedIn ? (
            <Link
              href={role === "MENTOR" ? "/dashboard" : "/mentors"}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition text-center"
            >
              {role === "MENTOR" ? "대시보드로 이동" : "멘토 찾기"}
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/signup"
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition text-center"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="flex-1 py-3 bg-white border border-gray-200 hover:border-rose-200 text-gray-700 text-sm font-semibold rounded-lg transition text-center"
              >
                로그인
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
