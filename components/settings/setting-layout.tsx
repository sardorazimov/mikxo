/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileSettings from "./profle-settings";


export default function SettingsLayout({
  user
}: {
  user: any
}) {

  return (

    <div className="flex">

      <ProfileSettings user={user} />

    </div>

  );

}

