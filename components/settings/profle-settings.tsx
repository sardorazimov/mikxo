/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function ProfileSettings({
  user
}: {
  user: any
}) {

  const [username, setUsername] =
    useState(user?.username ?? "");

  const [bio, setBio] =
    useState(user?.bio ?? "");

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    const res = await fetch(
      "/api/users/update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
        })
      }
    );
    setStatus(res.ok ? "saved" : "error");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (

    <div className="flex-1 p-6 space-y-4 text-white max-w-lg">

      <h2 className="text-xl font-bold">Profile Settings</h2>

      <div className="space-y-1">
        <label className="text-sm text-neutral-400">Username</label>
        <input
          className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={username}
          placeholder="username"
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-neutral-400">Bio</label>
        <textarea
          className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          value={bio}
          placeholder="Tell us about yourself..."
          onChange={(e) =>
            setBio(e.target.value)
          }
        />
      </div>

      <button
        onClick={save}
        disabled={status === "saving"}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-lg text-sm font-medium"
      >
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : status === "error" ? "Error, try again" : "Save"}
      </button>

    </div>

  );

}
