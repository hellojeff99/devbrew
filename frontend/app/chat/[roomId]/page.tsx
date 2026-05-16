"use client";
import { createSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const params = useParams();
  const roomId = Number(params.roomId);
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

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

  const handleSendMessage = () => {
    if (!socketRef.current || content.trim().length === 0) return;
    socketRef.current.emit("send_message", { roomId, content });
    setContent("");
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Chat Room #{roomId}</h1>
      <div className="flex flex-col gap-2 border rounded p-4 h-[400px] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="border rounded p-2">
            <div className="text-sm">User #{message.senderId}</div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="message"
          className="border p-2 flex-1"
        />
        <button onClick={handleSendMessage} className="border px-4">
          Send
        </button>
      </div>
    </div>
  );
}
