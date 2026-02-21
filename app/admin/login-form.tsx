"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Invalid password.");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input
          type="password"
          className="w-full bg-neutral-700 rounded-lg px-3 py-2 outline-none"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2 rounded-lg font-semibold"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
