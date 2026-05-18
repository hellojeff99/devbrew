"use client";

import { api } from "@/lib/api";
import { createSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const params = useParams();
  const roomId = Number(params.roomId);
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const [myName, setMyName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get<{
          sub: number;
          role: string;
          name: string;
        }>("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        startTransition(() => {
          setMyId(response.data.sub);
          setMyName(response.data.name);
        });
      } catch (error) {
        console.error(error);
      }
    };
    void fetchMe();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get<Message[]>(`/chat/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        startTransition(() => setMessages(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    void fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const newSocket = createSocket();
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("socket connected");
      newSocket.emit("join_room", { roomId });
    });

    newSocket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!socketRef.current || content.trim().length === 0) return;
    socketRef.current.emit("send_message", { roomId, content });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 shadow-sm">
        <h1 className="text-base font-semibold text-gray-900">
          채팅방 #{roomId}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">실시간 멘토링 채팅</p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">
            아직 메시지가 없어요. 먼저 인사해보세요.
          </p>
        )}
        {messages.map((message) => {
          const isMine = message.senderId === myId;
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 max-w-xs ${isMine ? "self-end items-end" : "self-start items-start"}`}
            >
              {!isMine && (
                <span className="text-xs text-gray-400 px-1">
                  {message.senderName}
                </span>
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  isMine
                    ? "bg-rose-600 text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                {message.content}
              </div>
              <span className="text-xs text-gray-300 px-1">
                {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 items-center">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
        />
        <button
          onClick={handleSendMessage}
          className="w-10 h-10 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-full flex items-center justify-center transition flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white rotate-90"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
