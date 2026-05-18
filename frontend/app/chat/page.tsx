"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type ChatRoom = {
  id: number;
  mentorName: string;
  lastMessage: string | null;
  updatedAt: string;
};

export default function ChatListPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get<{ chatRooms: ChatRoom[] }>("/chat", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setChatRooms(response.data.chatRooms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchChatRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">채팅 목록을 불러오는 중...</p>
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
          <p className="text-sm text-gray-500 mt-1">진행 중인 커피챗 대화방</p>
        </div>

        {/* Chat Room List */}
        {chatRooms.length === 0 ? (
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
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {room.mentorName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-rose-600 transition-colors">
                    {room.mentorName}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {room.lastMessage ?? "아직 메시지가 없어요"}
                  </div>
                </div>

                {/* Time */}
                <div className="text-xs text-gray-300 flex-shrink-0">
                  {new Date(room.updatedAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
