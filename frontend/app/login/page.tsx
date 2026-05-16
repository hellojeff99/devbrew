"use client";

import { useState } from "react";

import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.accessToken as string;

      localStorage.setItem("accessToken", accessToken);

      alert("login success");
    } catch (error) {
      console.error(error);

      alert("login failed");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-8">
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
