"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type CoffeeChat = {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  mentee: {
    id: number;
    name: string;
  };
  timeSlot: {
    startTime: string;
  };
};

export default function DashboardPage() {
  const [coffeeChats, setCoffeeChats] = useState<CoffeeChat[]>([]);

  useEffect(() => {
    const fetchCoffeeChats = async () => {
      try {
        const response = await api.get("/coffeechats/mentor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setCoffeeChats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoffeeChats();
  }, []);

  const handleAction = async (id: number, action: "APPROVE" | "REJECT") => {
    try {
      if (action === "APPROVE") {
        await api.patch(
          `/coffeechats/${id}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      } else {
        await api.patch(
          `/coffeechats/${id}/reject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      }

      setCoffeeChats((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: action === "APPROVE" ? "APPROVED" : "REJECTED",
              }
            : c,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">멘토 대시보드</h1>
            <p className="text-sm text-gray-500 mt-1">
              커피챗 요청을 확인하고 관리하세요
            </p>
          </div>

          {/* 슬롯 페이지 이동 */}
          <Link
            href="/slots"
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition"
          >
            슬롯 관리
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="대기 중"
            count={coffeeChats.filter((r) => r.status === "PENDING").length}
          />
          <StatBox
            label="승인됨"
            count={coffeeChats.filter((r) => r.status === "APPROVED").length}
          />
          <StatBox
            label="거절됨"
            count={coffeeChats.filter((r) => r.status === "REJECTED").length}
          />
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {coffeeChats.map((chat) => {
            const start = new Date(chat.timeSlot.startTime);

            return (
              <div
                key={chat.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {chat.mentee.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {start.toLocaleString("ko-KR")}
                    </p>
                  </div>

                  <StatusBadge status={chat.status} />
                </div>

                {chat.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(chat.id, "APPROVE")}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleAction(chat.id, "REJECT")}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {coffeeChats.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-10">
              아직 요청이 없어요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------ components ------------------ */
function StatBox({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900">{count}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CoffeeChat["status"] }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-600",
    APPROVED: "bg-green-100 text-green-600",
    REJECTED: "bg-gray-100 text-gray-500",
  };

  const label = {
    PENDING: "대기",
    APPROVED: "승인됨",
    REJECTED: "거절됨",
  };

  return (
    <div
      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${styles[status]}`}
    >
      {label[status]}
    </div>
  );
}
