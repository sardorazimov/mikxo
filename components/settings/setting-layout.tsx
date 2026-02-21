/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileSettings from "./profle-settings";


export default function SettingsLayout({
  user
}: {
  user: any
}) {

  return (

    <div className="flex h-full bg-neutral-800 text-white">

      <div className="w-48 border-r border-neutral-700 p-4 space-y-1">
        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-3">Settings</p>
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 text-sm font-medium">
          👤 Profile
        </div>
      </div>

      <ProfileSettings user={user} />

    </div>

  );

}

