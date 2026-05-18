"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

type ChatRoom = {
  id: number;
  mentorName: string;
  lastMessage: string | null;
  updatedAt: string;
};

type CoffeeChat = {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  mentor: { name: string; headline: string | null };
  timeSlot: { startTime: string };
};

const STATUS_LABEL: Record<CoffeeChat["status"], string> = {
  PENDING: "검토 중",
  APPROVED: "승인됨",
  REJECTED: "거절됨",
};

const STATUS_STYLE: Record<CoffeeChat["status"], string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-gray-100 text-gray-400",
};

export default function ChatListPage() {
  const [role, setRole] = useState<string | null>(null);
  const [tab, setTab] = useState<"coffeechats" | "chat">("chat");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [coffeeChats, setCoffeeChats] = useState<CoffeeChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(() => setRole(localStorage.getItem("role")));
  }, []);

  useEffect(() => {
    if (!role) return;

    const accessToken = localStorage.getItem("accessToken");
    const headers = { Authorization: `Bearer ${accessToken}` };

    const fetchData = async () => {
      try {
        const chatRoomsRes = await api.get<{ chatRooms: ChatRoom[] }>("/chat", {
          headers,
        });
        setChatRooms(chatRoomsRes.data.chatRooms);

        if (role === "MENTEE") {
          const coffeeChatsRes = await api.get<CoffeeChat[]>(
            "/coffeechats/mentee",
            { headers },
          );
          setCoffeeChats(coffeeChatsRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [role]);

  const filteredCoffeeChats = coffeeChats.filter(
    (c) => c.status !== "APPROVED",
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
          <p className="text-sm text-gray-500 mt-1">
            {role === "MENTEE"
              ? "신청 현황과 채팅방을 확인하세요"
              : "진행 중인 커피챗 대화방"}
          </p>
        </div>

        {/* Tab (MENTEE only) */}
        {role === "MENTEE" && (
          <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
            {(["chat", "coffeechats"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  tab === t
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "chat" ? "채팅방" : "커피챗 신청"}
              </button>
            ))}
          </div>
        )}

        {/* Chat Room List */}
        {(role === "MENTOR" || tab === "chat") &&
          (chatRooms.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
              <p className="text-sm text-gray-400">
                아직 참여 중인 채팅방이 없어요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chatRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/chat/${room.id}`}
                  className="group bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:border-rose-200 hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {room.mentorName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm group-hover:text-rose-600 transition-colors">
                      {room.mentorName}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      {room.lastMessage ?? "아직 메시지가 없어요"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 flex-shrink-0">
                    {new Date(room.updatedAt).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </Link>
              ))}
            </div>
          ))}

        {/* CoffeeChat List (MENTEE only) */}
        {role === "MENTEE" &&
          tab === "coffeechats" &&
          (filteredCoffeeChats.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
              <p className="text-sm text-gray-400">
                아직 신청한 커피챗이 없어요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredCoffeeChats.map((chat) => (
                <div
                  key={chat.id}
                  className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {chat.mentor.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">
                      {chat.mentor.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {chat.mentor.headline ?? "—"}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">
                      {new Date(chat.timeSlot.startTime).toLocaleDateString(
                        "ko-KR",
                        {
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        },
                      )}{" "}
                      {new Date(chat.timeSlot.startTime).toLocaleTimeString(
                        "ko-KR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[chat.status]}`}
                  >
                    {STATUS_LABEL[chat.status]}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
