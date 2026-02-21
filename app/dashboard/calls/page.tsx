"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CallUI() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const groupId = searchParams.get("groupId");
  const type = searchParams.get("type") ?? "audio";

  const label = userId ? `User ${userId.slice(0, 8)}...` : `Group ${(groupId ?? "").slice(0, 8)}...`;

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white items-center justify-center gap-8">
      <p className="text-neutral-400 text-sm uppercase tracking-widest">
        {type === "video" ? "📹 Video Call" : "📞 Audio Call"}
      </p>

      {type === "video" && (
        <div className="w-80 h-48 bg-neutral-800 rounded-xl flex items-center justify-center text-4xl border border-neutral-700">
          📷 Camera
        </div>
      )}

      <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-5xl shadow-lg">
        👤
      </div>

      <p className="text-xl font-semibold">{label}</p>
      <p className="text-neutral-400 text-sm animate-pulse">Calling…</p>

      <button
        onClick={() => router.back()}
        className="mt-4 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-semibold text-lg"
      >
        End Call
      </button>
    </div>
  );
}

export default function CallsPage() {
  return (
    <Suspense>
      <CallUI />
    </Suspense>
  );
}
