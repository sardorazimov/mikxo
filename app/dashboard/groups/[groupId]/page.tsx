"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  content: string | null;
  createdAt: string;
}

interface Member {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: string | null;
}

interface GroupInfo {
  id: string;
  name: string;
  description: string | null;
  ownerId: string | null;
  members: Member[];
}

export default function GroupChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteError, setInviteError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function loadGroup() {
    fetch(`/api/groups/${groupId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setGroup(data);
          setEditName(data.name);
          setEditDescription(data.description ?? "");
        }
      });
  }

  useEffect(() => {
    let active = true;
    fetch("/api/user")
      .then(r => r.json())
      .then(u => { if (active) setCurrentUserId(u?.id ?? null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    loadGroup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    let active = true;
    const poll = () =>
      fetch(`/api/messages?channelId=${groupId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (active && data) setMessages(data); });
    poll();
    const interval = setInterval(poll, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, channelId: groupId }),
    });
    setText("");
    const res = await fetch(`/api/messages?channelId=${groupId}`);
    if (res.ok) setMessages(await res.json());
  }

  async function saveSettings() {
    const res = await fetch(`/api/groups/${groupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });
    if (res.ok) {
      loadGroup();
      setShowSettings(false);
    }
  }

  async function inviteMember() {
    setInviteError("");
    const res = await fetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: inviteUsername }),
    });
    if (res.ok) {
      setInviteUsername("");
      loadGroup();
    } else {
      const data = await res.json();
      setInviteError(data.error ?? "Failed to invite");
    }
  }

  async function removeMember(userId: string) {
    await fetch(`/api/groups/${groupId}/members?userId=${userId}`, { method: "DELETE" });
    loadGroup();
  }

  async function leaveGroup() {
    if (!currentUserId) return;
    await fetch(`/api/groups/${groupId}/members?userId=${currentUserId}`, { method: "DELETE" });
    router.push("/dashboard/groups");
  }

  async function deleteGroup() {
    const res = await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard/groups");
  }

  const isOwner = group?.ownerId === currentUserId;

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 bg-neutral-800 text-white">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h1 className="font-bold text-lg">{group?.name ?? "Group"}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/calls?groupId=${groupId}&type=audio`)}
              className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded-lg text-sm"
            >
              📞 Call
            </button>
            <button
              onClick={() => router.push(`/dashboard/calls?groupId=${groupId}&type=video`)}
              className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded-lg text-sm"
            >
              📹 Video
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded-lg text-sm"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  m.senderId === currentUserId ? "bg-indigo-600" : "bg-neutral-700"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-neutral-700 flex gap-2">
          <input
            className="flex-1 bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Group Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-white text-xl">✕</button>
            </div>

            {isOwner && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Info</h3>
                <input
                  className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                  placeholder="Group name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  className="w-full bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                  placeholder="Description (optional)"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button
                  onClick={saveSettings}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Members ({group?.members.length ?? 0})</h3>
              {group?.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-sm">
                      {m.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatarUrl} alt={m.username ?? ""} className="w-full h-full object-cover rounded-full" />
                      ) : "👤"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.displayName ?? m.username}</p>
                      <p className="text-xs text-neutral-400">{m.role}</p>
                    </div>
                  </div>
                  {isOwner && m.id !== currentUserId && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isOwner && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Invite Member</h3>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-neutral-700 rounded-lg px-3 py-2 text-sm outline-none"
                    placeholder="Username"
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                  />
                  <button
                    onClick={inviteMember}
                    className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg text-sm"
                  >
                    Invite
                  </button>
                </div>
                {inviteError && <p className="text-xs text-red-400">{inviteError}</p>}
              </div>
            )}

            <div className="border-t border-neutral-700 pt-4 space-y-2">
              {!isOwner && (
                <button
                  onClick={leaveGroup}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-sm text-yellow-400"
                >
                  Leave Group
                </button>
              )}
              {isOwner && (
                <button
                  onClick={deleteGroup}
                  className="w-full bg-red-900 hover:bg-red-800 px-4 py-2 rounded-lg text-sm text-red-300"
                >
                  Delete Group
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
