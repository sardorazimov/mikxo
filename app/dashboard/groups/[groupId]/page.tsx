"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  content: string | null;
  createdAt: string;
}

interface GroupInfo {
  id: string;
  name: string;
  description: string | null;
}

export default function GroupChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/user")
      .then(r => r.json())
      .then(u => { if (active) setCurrentUserId(u?.id ?? null); });
    fetch(`/api/groups/${groupId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (active && data) setGroup(data); });
    return () => { active = false; };
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

  return (
    <div className="flex flex-col h-full bg-neutral-800 text-white">
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
  );
}
