"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

  const pathname = usePathname();

  const isChats =
    pathname.startsWith("/dashboard/chats");

  const isGroups =
    pathname.startsWith("/dashboard/groups");

  const isSettings =
    pathname.startsWith("/dashboard/settings");

  return (

    <div className="
      w-20
      bg-neutral-900
      flex
      flex-col
      justify-between
    ">

      <div>

        <Link href="/dashboard/chats">

          <div className={`
            p-3
            ${isChats
              ? "bg-neutral-700"
              : "hover:bg-neutral-800"}
          `}>
            Chats
          </div>

        </Link>

        <Link href="/dashboard/groups">

          <div className={`
            p-3
            ${isGroups
              ? "bg-neutral-700"
              : "hover:bg-neutral-800"}
          `}>
            Groups
          </div>

        </Link>

      </div>

      <Link href="/dashboard/settings">

        <div className={`
          p-3
          ${isSettings
            ? "bg-neutral-700"
            : "hover:bg-neutral-800"}
        `}>
          Settings
        </div>

      </Link>

    </div>

  );

}
