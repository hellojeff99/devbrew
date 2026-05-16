"use client";

import { useEffect } from "react";

import { io } from "socket.io-client";

export default function SocketTestPage() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const socket = io("http://localhost:3000", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected", reason);
    });

    socket.on("connect_error", (error) => {
      console.log("connect error", error.message);
    });

    socket.emit(
      "join_room",
      {
        roomId: 1,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        console.log(response);
      },
    );

    socket.emit("send_message", {
      roomId: 1,

      content: "hello",
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket Test Page</div>;
}
