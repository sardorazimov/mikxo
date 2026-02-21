"use client";

import { useState, useEffect } from "react";

interface Stats {
  userCount: number;
  groupCount: number;
  channelCount: number;
  messageCount: number;
}

interface User {
  id: string;
  username: string | null;
  email: string;
  displayName: string | null;
  isBot: boolean;
  createdAt: string | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats);
    fetch("/api/admin/users").then(r => r.json()).then(setUsersList);
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats.userCount, icon: "👤" },
              { label: "Groups", value: stats.groupCount, icon: "👥" },
              { label: "Channels", value: stats.channelCount, icon: "#" },
              { label: "Messages", value: stats.messageCount, icon: "💬" },
            ].map((s) => (
              <div key={s.label} className="bg-neutral-800 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-neutral-400">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-neutral-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700">
            <h2 className="font-semibold">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-700">
                <tr>
                  <th className="text-left p-3">Username</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Display Name</th>
                  <th className="text-left p-3">Bot</th>
                  <th className="text-left p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} className="border-t border-neutral-700 hover:bg-neutral-750">
                    <td className="p-3">@{u.username ?? "—"}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.displayName ?? "—"}</td>
                    <td className="p-3">{u.isBot ? "✅" : "—"}</td>
                    <td className="p-3">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
