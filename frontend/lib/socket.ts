import { io } from "socket.io-client";

export const createSocket = () => {
  const accessToken = localStorage.getItem("accessToken");

  return io("http://localhost:3000", {
    auth: {
      token: accessToken,
    },
  });
};
