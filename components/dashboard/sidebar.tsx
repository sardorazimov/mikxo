"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/chats", icon: "💬", label: "Chats" },
  { href: "/dashboard/groups", icon: "👥", label: "Groups" },
  { href: "/dashboard/channels", icon: "#", label: "Channels" },
  { href: "/dashboard/calls", icon: "📞", label: "Calls" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-20 bg-neutral-900 flex flex-col justify-between">
      <div>
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href}>
            <div
              className={`p-3 flex flex-col items-center gap-1 text-xs ${
                pathname.startsWith(href) && !pathname.startsWith("/dashboard/calls/")
                  ? "bg-neutral-700"
                  : "hover:bg-neutral-800"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/dashboard/settings">
        <div
          className={`p-3 flex flex-col items-center gap-1 text-xs ${
            pathname.startsWith("/dashboard/settings")
              ? "bg-neutral-700"
              : "hover:bg-neutral-800"
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </div>
      </Link>
    </div>
  );
}
